/**
 * Haftalık Deney Motoru
 * Deneyleri yönetir, iNaturalist API ile zenginleştirir
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  WeeklyExperiment,
  WeeklyProgress,
  Badge,
  difficultyPoints,
} from '@/types/experimentTypes';
import { weeklyExperiments, getExperimentByWeek } from '@/data/weeklyExperiments';
import iNaturalistAPI from '@/services/iNaturalistAPI';

// Storage anahtarları
const STORAGE_KEYS = {
  WEEKLY_PROGRESS: 'experiment_weekly_progress',
  COMPLETED_EXPERIMENTS: 'experiment_completed',
  USER_OBSERVATIONS: 'experiment_user_observations',
  INATURALIST_CACHE: 'experiment_inat_cache',
};

// Yılın kaçıncı haftasında olduğumuzu hesapla
function getCurrentWeekOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diff = now.getTime() - start.getTime();
  const oneWeek = 1000 * 60 * 60 * 24 * 7;
  return Math.ceil(diff / oneWeek);
}

// Haftanın başlangıç tarihini hesapla
function getWeekStartDate(weekNumber: number): Date {
  const now = new Date();
  const year = now.getFullYear();
  const firstDayOfYear = new Date(year, 0, 1);
  const daysOffset = (weekNumber - 1) * 7;
  return new Date(firstDayOfYear.getTime() + daysOffset * 24 * 60 * 60 * 1000);
}

// Varsayılan ilerleme
function getDefaultProgress(): WeeklyProgress {
  return {
    currentWeek: getCurrentWeekOfYear() % 12 + 1, // 1-12 arası döngü
    totalExperimentsCompleted: 0,
    totalPoints: 0,
    streak: 0,
    badges: [],
    unlockedCategories: ['Hücre Biyolojisi', 'Kristal Oluşumu'],
  };
}

export const experimentEngine = {
  /**
   * Kullanıcı ilerlemesini getir
   */
  async getProgress(): Promise<WeeklyProgress> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.WEEKLY_PROGRESS);
      if (data) {
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('İlerleme yüklenirken hata:', error);
    }
    return getDefaultProgress();
  },

  /**
   * İlerlemeyi kaydet
   */
  async saveProgress(progress: WeeklyProgress): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.WEEKLY_PROGRESS, JSON.stringify(progress));
    } catch (error) {
      console.error('İlerleme kaydedilirken hata:', error);
    }
  },

  /**
   * Bu haftanın deneyini getir
   */
  async getCurrentWeekExperiment(): Promise<WeeklyExperiment | null> {
    const progress = await this.getProgress();
    const experiment = getExperimentByWeek(progress.currentWeek);
    
    if (!experiment) return null;

    // Kullanıcı profiline göre yaş uygunluğunu kontrol et
    try {
      const profileData = await AsyncStorage.getItem('user_profile');
      const profile = profileData ? JSON.parse(profileData) : null;
      const ageGroup = profile?.ageGroup;
      // ageSuitable true ise kullanıcıya uygun
      (experiment as any).ageSuitable = !experiment.ageGroups || !ageGroup || experiment.ageGroups.includes(ageGroup);
    } catch (err) {
      (experiment as any).ageSuitable = true;
    }
     
    // Tamamlanma durumunu kontrol et
    const completedIds = await this.getCompletedExperimentIds();
    const isCompleted = completedIds.includes(experiment.id);

    // iNaturalist'ten ek bilgi çek
    let enrichedExperiment = { ...experiment };
    if (experiment.taxonId) {
      const taxonInfo = await this.getCachedTaxonInfo(experiment.taxonId);
      if (taxonInfo) {
        enrichedExperiment = {
          ...enrichedExperiment,
          scientificName: taxonInfo.name,
        };
      }
    }

    return {
      ...enrichedExperiment,
      status: isCompleted ? 'completed' : 'available',
    };
  },

  /**
   * Sonraki haftalara ait deneyleri getir (önizleme)
   */
  async getUpcomingExperiments(count: number = 4): Promise<WeeklyExperiment[]> {
    const progress = await this.getProgress();
    const completedIds = await this.getCompletedExperimentIds();
    const upcoming: WeeklyExperiment[] = [];

    for (let i = 1; i <= count; i++) {
      const weekNum = ((progress.currentWeek + i - 1) % 12) + 1;
      const experiment = getExperimentByWeek(weekNum);
      
      if (experiment) {
        const isCompleted = completedIds.includes(experiment.id);
        try {
          const profileData = await AsyncStorage.getItem('user_profile');
          const profile = profileData ? JSON.parse(profileData) : null;
          const ageGroup = profile?.ageGroup;
          (experiment as any).ageSuitable = !experiment.ageGroups || !ageGroup || experiment.ageGroups.includes(ageGroup);
        } catch (err) {
          (experiment as any).ageSuitable = true;
        }
         upcoming.push({
           ...experiment,
           status: isCompleted ? 'completed' : 'locked',
           unlocksAt: getWeekStartDate(weekNum).toISOString(),
         });
       }
     }

     return upcoming;
   },

  /**
   * Tamamlanan deney ID'lerini getir
   */
  async getCompletedExperimentIds(): Promise<string[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.COMPLETED_EXPERIMENTS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Tamamlanan deneyler yüklenirken hata:', error);
      return [];
    }
  },

  /**
   * Deneyi tamamla
   */
  async completeExperiment(
    experimentId: string,
    observation: {
      notes: string;
      photoUri?: string;
      rating: number;
    }
  ): Promise<{ success: boolean; newBadges: Badge[]; pointsEarned: number }> {
    try {
      // Deneyi bul
      const experiment = weeklyExperiments.find(e => e.id === experimentId);
      if (!experiment) {
        return { success: false, newBadges: [], pointsEarned: 0 };
      }

      // Zaten tamamlanmış mı kontrol et
      const completedIds = await this.getCompletedExperimentIds();
      if (completedIds.includes(experimentId)) {
        // Zaten tamamlanmış, tekrar puan ekleme
        return { success: false, newBadges: [], pointsEarned: 0 };
      }

      // Tamamlanan deneylere ekle
      completedIds.push(experimentId);
      await AsyncStorage.setItem(
        STORAGE_KEYS.COMPLETED_EXPERIMENTS,
        JSON.stringify(completedIds)
      );

      // Gözlemi kaydet
      const observations = await this.getUserObservations();
      observations[experimentId] = {
        ...observation,
        completedAt: new Date().toISOString(),
      };
      await AsyncStorage.setItem(
        STORAGE_KEYS.USER_OBSERVATIONS,
        JSON.stringify(observations)
      );

      // İlerlemeyi güncelle
      const progress = await this.getProgress();
      const pointsEarned = experiment.points;
      
      progress.totalExperimentsCompleted += 1;
      progress.totalPoints += pointsEarned;
      progress.streak += 1;

      // Yeni rozetleri kontrol et
      const newBadges = this.checkForNewBadges(progress, experiment);
      progress.badges = [...progress.badges, ...newBadges];

      // Yeni kategorileri aç
      if (!progress.unlockedCategories.includes(experiment.category)) {
        progress.unlockedCategories.push(experiment.category);
      }

      await this.saveProgress(progress);

      return { success: true, newBadges, pointsEarned };
    } catch (error) {
      console.error('Deney tamamlanırken hata:', error);
      return { success: false, newBadges: [], pointsEarned: 0 };
    }
  },

  /**
   * Yeni rozetleri kontrol et
   */
  checkForNewBadges(
    progress: WeeklyProgress,
    experiment: typeof weeklyExperiments[0]
  ): Badge[] {
    const newBadges: Badge[] = [];
    const existingIds = progress.badges.map(b => b.id);

    // İlk deney rozeti
    if (progress.totalExperimentsCompleted === 1 && !existingIds.includes('first-experiment')) {
      newBadges.push({
        id: 'first-experiment',
        name: 'Genç Bilim İnsanı',
        description: 'İlk deneyini tamamladın!',
        icon: '🔬',
        earnedAt: new Date().toISOString(),
      });
    }

    // 5 deney rozeti
    if (progress.totalExperimentsCompleted === 5 && !existingIds.includes('five-experiments')) {
      newBadges.push({
        id: 'five-experiments',
        name: 'Laboratuvar Ustası',
        description: '5 deney tamamladın!',
        icon: '🧪',
        earnedAt: new Date().toISOString(),
      });
    }

    // 10 deney rozeti
    if (progress.totalExperimentsCompleted === 10 && !existingIds.includes('ten-experiments')) {
      newBadges.push({
        id: 'ten-experiments',
        name: 'Bilim Kahramanı',
        description: '10 deney tamamladın!',
        icon: '🦸‍♂️',
        earnedAt: new Date().toISOString(),
      });
    }

    // Kategori rozetleri
    const categoryBadges: Record<string, { id: string; name: string; icon: string }> = {
      'Hücre Biyolojisi': { id: 'cell-master', name: 'Hücre Uzmanı', icon: '🧫' },
      'Mikroorganizmalar': { id: 'micro-master', name: 'Mikrop Avcısı', icon: '🦠' },
      'Kristal Oluşumu': { id: 'crystal-master', name: 'Kristal Ustası', icon: '💎' },
      'Bitki Anatomisi': { id: 'plant-master', name: 'Botanikçi', icon: '🌱' },
    };

    const badge = categoryBadges[experiment.category];
    if (badge && !existingIds.includes(badge.id)) {
      // İlk kez bu kategoride deney tamamlandı
      newBadges.push({
        ...badge,
        description: `${experiment.category} kategorisinde ilk deneyini tamamladın!`,
        earnedAt: new Date().toISOString(),
      });
    }

    // Streak rozetleri
    if (progress.streak === 4 && !existingIds.includes('streak-4')) {
      newBadges.push({
        id: 'streak-4',
        name: 'Istikrarlı Araştırmacı',
        description: 'Art arda 4 hafta deney yaptın!',
        icon: '🔥',
        earnedAt: new Date().toISOString(),
      });
    }

    return newBadges;
  },

  /**
   * Kullanıcı gözlemlerini getir
   */
  async getUserObservations(): Promise<Record<string, WeeklyExperiment['userObservation']>> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_OBSERVATIONS);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Gözlemler yüklenirken hata:', error);
      return {};
    }
  },

  /**
   * Önbellekli iNaturalist takson bilgisi
   */
  async getCachedTaxonInfo(taxonId: number): Promise<{ name: string; summary?: string } | null> {
    try {
      // Önbellekten kontrol et
      const cacheData = await AsyncStorage.getItem(STORAGE_KEYS.INATURALIST_CACHE);
      const cache = cacheData ? JSON.parse(cacheData) : {};

      if (cache[taxonId]) {
        return cache[taxonId];
      }

      // API'den çek
      const taxon = await iNaturalistAPI.getTaxonById(taxonId);
      if (taxon) {
        const info = {
          name: taxon.name,
          summary: taxon.wikipedia_summary,
        };
        
        // Önbelleğe kaydet
        cache[taxonId] = info;
        await AsyncStorage.setItem(STORAGE_KEYS.INATURALIST_CACHE, JSON.stringify(cache));
        
        return info;
      }
    } catch (error) {
      console.error('iNaturalist bilgisi alınırken hata:', error);
    }
    return null;
  },

  /**
   * Sonraki haftaya geç (geliştirme/test için)
   */
  async advanceToNextWeek(): Promise<void> {
    const progress = await this.getProgress();
    progress.currentWeek = (progress.currentWeek % 12) + 1;
    await this.saveProgress(progress);
  },

  /**
   * İlerlemeyi sıfırla (geliştirme/test için)
   */
  async resetProgress(): Promise<void> {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.WEEKLY_PROGRESS,
      STORAGE_KEYS.COMPLETED_EXPERIMENTS,
      STORAGE_KEYS.USER_OBSERVATIONS,
    ]);
  },

  /**
   * Tüm deneyleri getir
   */
  async getAllExperiments(): Promise<WeeklyExperiment[]> {
    const completedIds = await this.getCompletedExperimentIds();
    const progress = await this.getProgress();

    return weeklyExperiments.map((exp, index) => {
      const isCompleted = completedIds.includes(exp.id);
      const isAvailable = exp.weekNumber <= progress.currentWeek;

      return {
        ...exp,
        status: isCompleted ? 'completed' : isAvailable ? 'available' : 'locked',
      };
    });
  },

  /**
   * iNaturalist'ten organizma ara
   */
  async searchOrganisms(query: string) {
    return iNaturalistAPI.searchTaxa(query);
  },
};

export default experimentEngine;
