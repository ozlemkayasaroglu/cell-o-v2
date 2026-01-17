/**
 * Haftalık Deney Motoru (Web Version)
 * Deneyleri yönetir, iNaturalist API ile zenginleştirir
 * localStorage kullanır (AsyncStorage yerine)
 */

import type {
  WeeklyExperiment,
  WeeklyProgress,
  Badge,
} from "../types/experimentTypes";
import { weeklyExperiments } from "../data/weeklyExperiments";
import iNaturalistAPI from "../services/iNaturalistAPI";

// Storage anahtarları
const STORAGE_KEYS = {
  WEEKLY_PROGRESS: "experiment_weekly_progress",
  COMPLETED_EXPERIMENTS: "experiment_completed",
  USER_OBSERVATIONS: "experiment_user_observations",
  INATURALIST_CACHE: "experiment_inat_cache",
};

// localStorage wrapper (AsyncStorage API'sine benzer)
const storage = {
  async getItem(key: string): Promise<string | null> {
    return localStorage.getItem(key);
  },
  async setItem(key: string, value: string): Promise<void> {
    localStorage.setItem(key, value);
  },
  async removeItem(key: string): Promise<void> {
    localStorage.removeItem(key);
  },
};

// Varsayılan ilerleme
function getDefaultProgress(): WeeklyProgress {
  return {
    currentWeek: 1,
    totalExperimentsCompleted: 0,
    totalPoints: 0,
    streak: 0,
    badges: [],
    unlockedCategories: [],
  };
}

// Yaş grubuna göre uygun zorluk seviyelerini belirle
function getAllowedDifficulties(ageGroup: string | null): string[] {
  if (!ageGroup) return ["kolay", "orta", "zor"]; // Profil yoksa hepsini göster

  switch (ageGroup) {
    case "4-5":
      return ["kolay"];
    case "6-7":
      return ["kolay"];
    case "8-9":
      return ["orta"];
    case "10-12":
      return ["zor"];
    default:
      return ["kolay", "orta", "zor"];
  }
}

// Deneyin yaş grubuna uygun olup olmadığını kontrol et
function isExperimentSuitableForAge(
  experiment: any,
  ageGroup: string | null
): boolean {
  const allowedDifficulties = getAllowedDifficulties(ageGroup);
  return allowedDifficulties.includes(experiment.difficulty);
}

class ExperimentEngine {
  // İlerlemeyi yükle
  async getProgress(): Promise<WeeklyProgress> {
    try {
      const data = await storage.getItem(STORAGE_KEYS.WEEKLY_PROGRESS);
      if (data) {
        return JSON.parse(data);
      }
    } catch (error) {
      // Hata sessizce handle edilir
    }
    return getDefaultProgress();
  }

  // İlerlemeyi kaydet
  async saveProgress(progress: WeeklyProgress): Promise<void> {
    try {
      await storage.setItem(
        STORAGE_KEYS.WEEKLY_PROGRESS,
        JSON.stringify(progress)
      );
    } catch (error) {
      // Hata sessizce handle edilir
    }
  }

  // Mevcut haftanın deneyini getir
  async getCurrentWeekExperiment(): Promise<WeeklyExperiment | null> {
    const progress = await this.getProgress();
    const completedCount = progress.totalExperimentsCompleted;

    // Kullanıcı profilinden yaş grubunu al
    const profileData = await storage.getItem("user_profile");
    const profile = profileData ? JSON.parse(profileData) : null;
    const ageGroup = profile?.ageGroup || null;

    // Yaş grubuna uygun deneyleri filtrele
    const suitableExperiments = weeklyExperiments.filter((exp) =>
      isExperimentSuitableForAge(exp, ageGroup)
    );

    // Tamamlanan deney sayısına göre sıradaki deneyi getir
    if (completedCount < suitableExperiments.length) {
      const experiment = suitableExperiments[completedCount];
      return {
        ...experiment,
        status: "available",
      };
    }

    return null; // Tüm deneyler tamamlandı
  }

  // Tüm deneyleri getir (yaş/difficulty filtresi olmadan, 52 deney)
  async getAllExperiments(): Promise<WeeklyExperiment[]> {
    const progress = await this.getProgress();
    const completedData = await storage.getItem(STORAGE_KEYS.COMPLETED_EXPERIMENTS);
    const completed: string[] = completedData ? JSON.parse(completedData) : [];

    // 52 haftalık tüm deneyleri sırayla döndür
    const allExperiments = weeklyExperiments.map((exp, index) => {
      const status: "completed" | "available" | "locked" =
        completed.includes(exp.id)
          ? "completed"
          : completed.length === index
          ? "available"
          : "locked";
      return {
        ...exp,
        status,
      };
    });
    return allExperiments as WeeklyExperiment[];
  }

  // Gelecek deneyleri getir
  async getUpcomingExperiments(count: number = 4): Promise<WeeklyExperiment[]> {
    const progress = await this.getProgress();
    const completedCount = progress.totalExperimentsCompleted;

    // Kullanıcı profilinden yaş grubunu al
    const profileData = await storage.getItem("user_profile");
    const profile = profileData ? JSON.parse(profileData) : null;
    const ageGroup = profile?.ageGroup || null;

    // Yaş grubuna uygun deneyleri filtrele
    const suitableExperiments = weeklyExperiments.filter((exp) =>
      isExperimentSuitableForAge(exp, ageGroup)
    );

    return suitableExperiments
      .slice(completedCount + 1, completedCount + 1 + count)
      .map((exp) => ({
        ...exp,
        status: "locked" as const,
      }));
  }

  // Deney tamamla
  async completeExperiment(
    experimentId: string,
    observation: {
      notes: string;
      photoUri?: string;
      rating: number;
    }
  ): Promise<{ success: boolean; newBadges: Badge[]; pointsEarned: number }> {
    try {
      const progress = await this.getProgress();

      // Tüm deneylerden bul (weeklyExperiments yerine allExperiments mantığını kullan)
      let experiment = weeklyExperiments.find((e) => e.id === experimentId);

      // Eğer bulunamazsa, varsayılan bir deney objesi oluştur
      if (!experiment) {
        experiment = {
          id: experimentId,
          title: "Deney",
          description: "",
          points: 100,
          difficulty: "orta" as const,
          category: "Mikroskop Gözlemi" as const,
          materials: [],
          steps: [],
          observationGuide: [],
          expectedResults: [],
          weekNumber: 1,
          estimatedTime: "30 dakika",
          learningObjectives: ["Deney tamamlandı"],
          safetyNotes: [],
        };
      }

      // Zaten tamamlanmış mı kontrol et
      const completedData = await storage.getItem(
        STORAGE_KEYS.COMPLETED_EXPERIMENTS
      );
      const completed: string[] = completedData
        ? JSON.parse(completedData)
        : [];

      if (completed.includes(experimentId)) {
        return { success: false, newBadges: [], pointsEarned: 0 };
      }

      // Tamamlandı olarak işaretle
      completed.push(experimentId);
      await storage.setItem(
        STORAGE_KEYS.COMPLETED_EXPERIMENTS,
        JSON.stringify(completed)
      );

      // Gözlemi kaydet
      const observations = await this.getUserObservations();
      observations[experimentId] = {
        ...observation,
        completedAt: new Date().toISOString(),
      };
      await storage.setItem(
        STORAGE_KEYS.USER_OBSERVATIONS,
        JSON.stringify(observations)
      );

      // İlerlemeyi güncelle
      const pointsEarned = experiment?.points || 100;
      progress.totalExperimentsCompleted += 1;
      progress.totalPoints += pointsEarned;

      // Rozet kontrolü
      const newBadges = await this.checkAndAwardBadges(progress);

      await this.saveProgress(progress);

      return { success: true, newBadges, pointsEarned };
    } catch (error) {
      return { success: false, newBadges: [], pointsEarned: 0 };
    }
  }

  // Kullanıcı gözlemlerini getir
  async getUserObservations(): Promise<Record<string, any>> {
    try {
      const data = await storage.getItem(STORAGE_KEYS.USER_OBSERVATIONS);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      return {};
    }
  }

  // Rozet kontrolü
  async checkAndAwardBadges(progress: WeeklyProgress): Promise<Badge[]> {
    const newBadges: Badge[] = [];
    const existingBadgeIds = progress.badges.map((b) => b.id);

    // İlk deney rozeti
    if (
      progress.totalExperimentsCompleted >= 1 &&
      !existingBadgeIds.includes("first-experiment")
    ) {
      newBadges.push({
        id: "first-experiment",
        name: "İlk Deney",
        description: "İlk deneyini tamamladın!",
        icon: "🔬",
        earnedAt: new Date().toISOString(),
      });
    }

    // 5 deney rozeti
    if (
      progress.totalExperimentsCompleted >= 5 &&
      !existingBadgeIds.includes("five-experiments")
    ) {
      newBadges.push({
        id: "five-experiments",
        name: "Bilim İnsanı",
        description: "5 deney tamamladın!",
        icon: "🧫",
        earnedAt: new Date().toISOString(),
      });
    }

    // 10 deney rozeti
    if (
      progress.totalExperimentsCompleted >= 10 &&
      !existingBadgeIds.includes("ten-experiments")
    ) {
      newBadges.push({
        id: "ten-experiments",
        name: "Uzman",
        description: "10 deney tamamladın!",
        icon: "💎",
        earnedAt: new Date().toISOString(),
      });
    }

    // Yeni rozetleri ekle
    progress.badges.push(...newBadges);

    return newBadges;
  }

  // Sonraki haftaya geç
  async advanceToNextWeek(): Promise<void> {
    const progress = await this.getProgress();
    progress.currentWeek += 1;
    await this.saveProgress(progress);
  }

  // İlerlemeyi sıfırla
  async resetProgress(): Promise<void> {
    await storage.removeItem(STORAGE_KEYS.WEEKLY_PROGRESS);
    await storage.removeItem(STORAGE_KEYS.COMPLETED_EXPERIMENTS);
    await storage.removeItem(STORAGE_KEYS.USER_OBSERVATIONS);
  }

  // Organizma ara (iNaturalist API)
  async searchOrganisms(query: string): Promise<any[]> {
    return iNaturalistAPI.searchTaxa(query, 10);
  }
}

export default new ExperimentEngine();
