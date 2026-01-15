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
import {
  weeklyExperiments,
  getExperimentByWeek,
} from '@/data/weeklyExperiments';
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
    currentWeek: (getCurrentWeekOfYear() % 12) + 1, // 1-12 arası döngü
    totalExperimentsCompleted: 0,
    totalPoints: 0,
    streak: 0,
    badges: [],
    unlockedCategories: ['Hücre Biyolojisi', 'Kristal Oluşumu'],
  };
}

// Yaş grubuna göre izin verilen zorluk seviyeleri (kullanıcının isteğine göre)
// Daha esnek bir haritalama:
// 4-5 => 'kolay'
// 6-7 => 'kolay'
// 8-9 => 'kolay', 'orta'
// 10-12 => 'orta', 'zor'
const ageDifficultyMap: Record<string, string[]> = {
  '4-5': ['kolay'],
  '6-7': ['kolay'],
  '8-9': ['kolay', 'orta'],
  '10-12': ['orta', 'zor'],
};

// Bir deneyin belirli yaş grubuna uygun olup olmadığını kontrol et
// Eğer experiment.ageGroups yoksa, difficulty bazlı çıkarım yaparak yaş aralıklarını türetiriz
// Buradaki harita, ageDifficultyMap ile tutarlı olacak şekilde daha esnek hale getirildi
const difficultyToAgeGroups: Record<string, string[]> = {
  kolay: ['4-5', '6-7', '8-9'],
  orta: ['8-9', '10-12'],
  zor: ['10-12'],
};

function isExperimentSuitableForAge(exp: any, ageGroup?: string | null) {
  // 1) Eğer deney explicit ageGroups içeriyorsa onu kullan
  if (
    exp.ageGroups &&
    Array.isArray(exp.ageGroups) &&
    exp.ageGroups.length > 0
  ) {
    if (!ageGroup) return true; // profil yoksa uygun say
    return exp.ageGroups.includes(ageGroup);
  }

  // 2) Eğer ageGroups yoksa difficulty alanına bak ve uygun yaş gruplarını türet
  const difficulty: string | undefined = (exp.difficulty || '').toLowerCase();
  const derivedAgeGroups = difficulty
    ? difficultyToAgeGroups[difficulty] || []
    : [];

  if (derivedAgeGroups.length > 0) {
    if (!ageGroup) return true;
    return derivedAgeGroups.includes(ageGroup);
  }

  // 3) Fallback: difficulty etiketine göre yaşQuality kontrolü (mevcut ageDifficultyMap tersinden)
  // Eğer yine bilgi yoksa eski mantığa dön: eğer deneyde difficulty yoksa uygun say
  if (!difficulty) return true;

  // Son çare: yaş grubunun izin verdiği difficulty listesine bak
  if (!ageGroup) return true;
  const allowed = ageDifficultyMap[ageGroup] || ['kolay', 'orta', 'zor'];
  return allowed.includes(difficulty);
}

// Basit çocuk-dili eşlemeleri: teknik terimleri daha anlaşılır hale getir
const childTermMap: Record<string, Record<string, string>> = {
  '4-5': {
    // teknik: çocukça açıklama
    kloroplast: 'bitkilerin içinde küçük yeşil paketçiği',
    fotosentez: 'güneş ışığıyla yemek yapma',
    stomata: 'yaprağın nefes delikleri',
    biyolüminesans: 'ışık saçma',
    enzim: 'küçük yardımcılar',
    bakteri: 'çok küçük canlılar',
    protist: 'tek hücreli küçük canlı',
    kristal: 'parlak şekilli taşcık',
    hücre: 'canlıların küçük yapı taşı',
    tohum: 'geleceğin bitki paketi',
  },
  '6-7': {
    kloroplast: 'kloroplast (bitkideki yeşil enerji paketleri)',
    fotosentez: 'fotosentez (ışıkla besin yapma süreci)',
    stomata: 'stoma (yaprağın hava delikleri)',
    biyolüminesans: 'biyolüminesans (canlıların ışık üretmesi)',
    enzim: 'enzim (vücudun küçük yardımcı proteinleri)',
    bakteri: 'bakteri (mikroskobik canlılar)',
    protist: 'protist (tek hücreli organizma)',
    kristal: 'kristal (düzenli ve parlak yapı)',
    hücre: 'hücre (canlının en küçük birimi)',
    tohum: 'tohum (bitkinin başlangıcı)',
  },
};

// Deney açıklamalarındaki büyütme (40x, 20x, 100x vb.) ifadelerini temizle
function removeMagnification(text: string | undefined): string | undefined {
  if (!text) return text;
  //
  // - Eşleşen örnekler: '40x', '20x', '100x' (kelime sınırı ile)
  // - Ayrıca parantez içindeki veya sonunda gelen '40x,' '40x.' gibi durumları da temizle
  // - Kalan fazla boşlukları düzelt
  let out = text.replace(/\b\d{1,3}x\b/gi, '');
  // Temizlenmiş metinde ardışık boşlukları tekleştir ve baş/son boşlukları kırp
  out = out.replace(/\s{2,}/g, ' ').trim();
  // Eğer parantez içi yalnızca bu ifade ise fazladan parantezi de temizlemeye çalış
  out = out.replace(/\(\s*\)\s*/g, '');
  return out;
}

function simplifyTextForAge(
  text: string | undefined,
  ageGroup?: string | null
): string | undefined {
  if (!text || !ageGroup) return removeMagnification(text);
  const map = childTermMap[ageGroup];
  if (!map) return removeMagnification(text);

  let out = text;
  for (const [term, repl] of Object.entries(map)) {
    const re = new RegExp(term, 'ig');
    out = out.replace(re, repl);
  }

  // Büyütme ifadelerini temizle
  out = removeMagnification(out) || out;
  return out;
}

function generateChildFriendly(exp: any, ageGroup?: string | null) {
  // Kaynak alanlar: title, name, shortDescription, description
  const titleSrc = exp.title || exp.name || exp.headline || '';
  const descSrc = exp.shortDescription || exp.summary || exp.description || '';

  const childTitle = simplifyTextForAge(titleSrc, ageGroup) || titleSrc;
  const childDescription = simplifyTextForAge(descSrc, ageGroup) || descSrc;

  return {
    title: childTitle,
    description: childDescription,
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
      await AsyncStorage.setItem(
        STORAGE_KEYS.WEEKLY_PROGRESS,
        JSON.stringify(progress)
      );
    } catch (error) {
      console.error('İlerleme kaydedilirken hata:', error);
    }
  },

  /**
   * Bu haftanın deneyini getir
   */
  async getCurrentWeekExperiment(): Promise<WeeklyExperiment | null> {
    const progress = await this.getProgress();
    let experiment = getExperimentByWeek(progress.currentWeek);
    if (!experiment) return null;

    // Profilden yaş bilgisini al
    let ageGroup: string | null = null;
    try {
      const profileData = await AsyncStorage.getItem('user_profile');
      const profile = profileData ? JSON.parse(profileData) : null;
      ageGroup = profile?.ageGroup ?? null;
    } catch (err) {
      ageGroup = null;
    }

    // Tamamlanma durumunu kontrol et
    const completedIds = await this.getCompletedExperimentIds();

    // Eğer mevcut haftanın deneyi yaşa uygun değilse, ileri haftalara bakıp en yakın uygun deneyi getir
    let ageSuitable = isExperimentSuitableForAge(experiment, ageGroup);

    let chosenExperiment = experiment;
    let chosenWeek = progress.currentWeek;

    if (!ageSuitable) {
      // Ara (maks 12 hafta)
      for (let offset = 1; offset <= 12; offset++) {
        const weekNum = ((progress.currentWeek + offset - 1) % 12) + 1;
        const candidate = getExperimentByWeek(weekNum);
        if (!candidate) continue;
        if (isExperimentSuitableForAge(candidate, ageGroup)) {
          chosenExperiment = candidate;
          chosenWeek = weekNum;
          ageSuitable = true;
          break;
        }
      }
    }

    // iNaturalist'ten ek bilgi çek
    let enrichedExperiment = { ...chosenExperiment };
    if (chosenExperiment.taxonId) {
      const taxonInfo = await this.getCachedTaxonInfo(chosenExperiment.taxonId);
      if (taxonInfo) {
        enrichedExperiment = {
          ...enrichedExperiment,
          scientificName: taxonInfo.name,
        };
      }
    }

    // childFriendly bilgisi ekle
    (enrichedExperiment as any).childFriendly = generateChildFriendly(
      enrichedExperiment,
      ageGroup
    );
    (enrichedExperiment as any).ageSuitable = ageSuitable;

    const isCompleted = completedIds.includes(enrichedExperiment.id);
    const status = isCompleted
      ? 'completed'
      : chosenWeek <= progress.currentWeek
      ? 'available'
      : 'locked';

    return {
      ...enrichedExperiment,
      status,
    };
  },

  /**
   * Sonraki haftalara ait deneyleri getir (önizleme)
   */
  async getUpcomingExperiments(count: number = 4): Promise<WeeklyExperiment[]> {
    const progress = await this.getProgress();
    const completedIds = await this.getCompletedExperimentIds();
    const upcoming: WeeklyExperiment[] = [];

    // Profilden yaş bilgisini al
    let ageGroup: string | null = null;
    try {
      const profileData = await AsyncStorage.getItem('user_profile');
      const profile = profileData ? JSON.parse(profileData) : null;
      ageGroup = profile?.ageGroup ?? null;
    } catch (err) {
      ageGroup = null;
    }

    // İleri haftaları dolaşarak uygun deneyleri bul (maks 12 hafta döngü)
    let offset = 1;
    let attempts = 0;
    while (upcoming.length < count && attempts < 24) {
      const weekNum = ((progress.currentWeek + offset - 1) % 12) + 1;
      const experiment = getExperimentByWeek(weekNum);
      if (experiment) {
        const isCompleted = completedIds.includes(experiment.id);
        const ageSuitable = isExperimentSuitableForAge(experiment, ageGroup);
        (experiment as any).ageSuitable = ageSuitable;
        // Çocuk-dili açıklamalarını ekle (sadece 4-5 ve 6-7 için etkili olur)
        (experiment as any).childFriendly = generateChildFriendly(
          experiment,
          ageGroup
        );

        if (ageSuitable) {
          upcoming.push({
            ...experiment,
            status: isCompleted ? 'completed' : 'locked',
            unlocksAt: getWeekStartDate(weekNum).toISOString(),
          });
        }
      }
      offset += 1;
      attempts += 1;
    }

    return upcoming;
  },

  /**
   * Tamamlanan deney ID'lerini getir
   */
  async getCompletedExperimentIds(): Promise<string[]> {
    try {
      const data = await AsyncStorage.getItem(
        STORAGE_KEYS.COMPLETED_EXPERIMENTS
      );
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
      const experiment = weeklyExperiments.find((e) => e.id === experimentId);
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
    experiment: (typeof weeklyExperiments)[0]
  ): Badge[] {
    const newBadges: Badge[] = [];
    const existingIds = progress.badges.map((b) => b.id);

    // İlk deney rozeti
    if (
      progress.totalExperimentsCompleted === 1 &&
      !existingIds.includes('first-experiment')
    ) {
      newBadges.push({
        id: 'first-experiment',
        name: 'Genç Bilim İnsanı',
        description: 'İlk deneyini tamamladın!',
        icon: '🔬',
        earnedAt: new Date().toISOString(),
      });
    }

    // 5 deney rozeti
    if (
      progress.totalExperimentsCompleted === 5 &&
      !existingIds.includes('five-experiments')
    ) {
      newBadges.push({
        id: 'five-experiments',
        name: 'Laboratuvar Ustası',
        description: '5 deney tamamladın!',
        icon: '🧪',
        earnedAt: new Date().toISOString(),
      });
    }

    // 10 deney rozeti
    if (
      progress.totalExperimentsCompleted === 10 &&
      !existingIds.includes('ten-experiments')
    ) {
      newBadges.push({
        id: 'ten-experiments',
        name: 'Bilim Kahramanı',
        description: '10 deney tamamladın!',
        icon: '🦸‍♂️',
        earnedAt: new Date().toISOString(),
      });
    }

    // Kategori rozetleri
    const categoryBadges: Record<
      string,
      { id: string; name: string; icon: string }
    > = {
      'Hücre Biyolojisi': {
        id: 'cell-master',
        name: 'Hücre Uzmanı',
        icon: '🧫',
      },
      Mikroorganizmalar: {
        id: 'micro-master',
        name: 'Mikrop Avcısı',
        icon: '🦠',
      },
      'Kristal Oluşumu': {
        id: 'crystal-master',
        name: 'Kristal Ustası',
        icon: '💎',
      },
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
  async getUserObservations(): Promise<
    Record<string, WeeklyExperiment['userObservation']>
  > {
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
  async getCachedTaxonInfo(
    taxonId: number
  ): Promise<{ name: string; summary?: string } | null> {
    try {
      // Önbellekten kontrol et
      const cacheData = await AsyncStorage.getItem(
        STORAGE_KEYS.INATURALIST_CACHE
      );
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
        await AsyncStorage.setItem(
          STORAGE_KEYS.INATURALIST_CACHE,
          JSON.stringify(cache)
        );

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

    // Profilden yaş bilgisini al
    let ageGroup: string | null = null;
    try {
      const profileData = await AsyncStorage.getItem('user_profile');
      const profile = profileData ? JSON.parse(profileData) : null;
      ageGroup = profile?.ageGroup ?? null;
    } catch (err) {
      ageGroup = null;
    }

    return weeklyExperiments
      .filter((exp) => isExperimentSuitableForAge(exp, ageGroup))
      .map((exp) => {
        const isCompleted = completedIds.includes(exp.id);
        const isAvailable = exp.weekNumber <= progress.currentWeek;
        const childFriendly = generateChildFriendly(exp, ageGroup);
        return {
          ...exp,
          status: isCompleted
            ? 'completed'
            : isAvailable
            ? 'available'
            : 'locked',
          childFriendly,
        } as WeeklyExperiment;
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
