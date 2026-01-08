/**
 * Mikroskop ve Deney Görev Türleri
 * Haftalık görevler için tip tanımlamaları
 */

// Görev kategorileri
export type ExperimentCategory =
  | 'Mikroskop Gözlemi'
  | 'Hücre Biyolojisi'
  | 'Mikroorganizmalar'
  | 'Kristal Oluşumu'
  | 'Bitki Anatomisi'
  | 'Su Yaşamı'
  | 'Mantarlar'
  | 'Kimyasal Reaksiyon';

// Zorluk seviyeleri
export type ExperimentDifficulty = 'kolay' | 'orta' | 'zor' | 'uzman';

// Gerekli malzemeler
export interface RequiredMaterial {
  name: string;
  icon: string;
  optional?: boolean;
}

// Deney adımları
export interface ExperimentStep {
  stepNumber: number;
  instruction: string;
  duration?: string; // örn: "5 dakika"
  tip?: string;
}

// Haftalık görev
export interface WeeklyExperiment {
  id: string;
  weekNumber: number; // 1-52 hafta
  title: string;
  description: string;
  category: ExperimentCategory;
  difficulty: ExperimentDifficulty;
  estimatedTime: string; // örn: "30-45 dakika"
  points: number;

  // Bilimsel içerik
  scientificName?: string; // iNaturalist'ten
  taxonId?: number; // iNaturalist taxon ID
  learningObjectives: string[];

  // Deney detayları
  materials: RequiredMaterial[];
  steps: ExperimentStep[];
  safetyNotes?: string[];

  // Gözlem rehberi
  observationGuide: string[];
  expectedResults: string[];

  // Hedeflenmiş yaş grupları (opsiyonel). Eğer yoksa tüm yaşlara uygundur.
  ageGroups?: string[];
  // Ebeveyn gözetimi gerekli mi
  parentRequired?: boolean;
  // Farklı yaş/karmaşa seviyeleri için varyantlar
  variants?: Record<string, { stepsCount?: number; estimatedTime?: string; steps?: ExperimentStep[] }>;

  // Görev durumu
  status: 'locked' | 'available' | 'in_progress' | 'completed';
  unlocksAt?: string; // ISO date
  completedAt?: string;

  // Kullanıcı gözlemi
  userObservation?: {
    notes: string;
    photoUri?: string;
    rating: number; // 1-5 yıldız
    completedAt: string;
  };

  // Hesaplanmış: kullanıcının profiline göre uygunluk (engine tarafından set edilebilir)
  ageSuitable?: boolean;
}

// Haftalık ilerleme
export interface WeeklyProgress {
  currentWeek: number;
  totalExperimentsCompleted: number;
  totalPoints: number;
  streak: number; // Art arda tamamlanan hafta sayısı
  badges: Badge[];
  unlockedCategories: ExperimentCategory[];
}

// Rozetler
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt?: string;
}

// Zorluk puanları
export const difficultyPoints: Record<ExperimentDifficulty, number> = {
  kolay: 50,
  orta: 100,
  zor: 200,
  uzman: 350,
};

// Kategori ikonları
export const categoryIcons: Record<ExperimentCategory, string> = {
  'Mikroskop Gözlemi': '🔬',
  'Hücre Biyolojisi': '🧫',
  Mikroorganizmalar: '🦠',
  'Kristal Oluşumu': '💎',
  'Bitki Anatomisi': '🌱',
  'Su Yaşamı': '💧',
  Mantarlar: '🍄',
  'Kimyasal Reaksiyon': '⚗️',
};

// Zorluk renkleri
export const difficultyColors: Record<ExperimentDifficulty, string> = {
  kolay: '#4ADE80', // Yeşil
  orta: '#FBBF24', // Sarı
  zor: '#FB923C', // Turuncu
  uzman: '#EF4444', // Kırmızı
};
