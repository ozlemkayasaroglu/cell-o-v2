/**
 * Gözlem Motoru Tipleri
 * Varyasyon tabanlı gözlem sistemi için yapı tanımlar
 */

import { INatTaxon } from '@/data/iNaturalistMockData';

// iNaturalist ikonik taksonlarına dayalı gözlem kategorileri
export type ObservationCategory =
  | 'Kuşlar'
  | 'Böcekler'
  | 'Bitkiler'
  | 'Mantarlar'
  | 'Memeliler'
  | 'Sürüngenler'
  | 'İki Yaşamlılar'
  | 'Yumuşakçalar'
  | 'Örümcekgiller'
  | 'Hava Durumu'
  | 'Manzara'
  | 'Davranış';

// Gözlemler için odak alanları
export type ObservationFocus =
  | 'identification'    // Türü tanımla
  | 'behavior'          // Davranış kalıplarını gözlemle
  | 'habitat'           // Yaşam alanını/ortamı not al
  | 'interaction'       // Organizmalar arası etkileşimleri gözlemle
  | 'lifecycle'         // Yaşam evrelerini gözlemle
  | 'count'             // Örnekleri say
  | 'sounds'            // Dinle ve sesleri tanımla
  | 'patterns'          // Desenleri ve işaretleri gözlemle
  | 'comparison'        // Benzer türleri karşılaştır
  | 'seasonal';         // Mevsimsel gözlemler

// Zorluk seviyeleri
export type ObservationDifficulty = 'easy' | 'medium' | 'hard' | 'expert';

// Gözlem Görevi arayüzü
export interface ObservationTask {
  id: string;
  title: string;
  description: string;
  category: ObservationCategory;
  focus: ObservationFocus;
  difficulty: ObservationDifficulty;
  points: number;
  hints: string[];
  targetTaxon?: INatTaxon;
  repeatAfterDays: number;
  createdAt: string;
  expiresAt?: string;
}

// Tamamlanmış gözlem kaydı
export interface CompletedObservation {
  id: string;
  taskId: string;
  observationText: string;
  location: string;
  completedAt: string;
  photoUri?: string;
  verified: boolean;
}

// Tekrarları takip etmek için kullanıcı gözlem geçmişi
export interface ObservationHistory {
  taskId: string;
  category: ObservationCategory;
  focus: ObservationFocus;
  lastCompletedAt: string;
  completionCount: number;
}

// Görev oluşturma yapılandırması
export interface TaskGenerationConfig {
  preferredCategories?: ObservationCategory[];
  maxDifficulty?: ObservationDifficulty;
  includeExpired?: boolean;
  count?: number;
}

// UI için odak açıklamaları
export const focusDescriptions: Record<ObservationFocus, string> = {
  identification: 'Bulduğun türü tanımla ve adlandır',
  behavior: 'Organizmanın ne yaptığını izle ve anlat',
  habitat: 'Bulduğun yerin çevresini tanımla',
  interaction: 'Farklı organizmaların nasıl etkileştiğini gözlemle',
  lifecycle: 'Farklı yaşam evrelerini ara (yumurta, larva, yetişkin)',
  count: 'Bir alanda kaç tane bulabildiğini say',
  sounds: 'Dikkatli dinle ve sesleri tanımla',
  patterns: 'Renkleri, çizgileri, lekeleri veya dokuları ara',
  comparison: 'Benzer görünümlü türleri bul ve karşılaştır',
  seasonal: 'Mevsimsel değişiklikleri veya zamanlamayı not al',
};

// Zorluk puan çarpanları
export const difficultyPoints: Record<ObservationDifficulty, number> = {
  easy: 10,
  medium: 25,
  hard: 50,
  expert: 100,
};

// UI için kategori emojileri
export const categoryEmojis: Record<ObservationCategory, string> = {
  'Kuşlar': '🐦',
  'Böcekler': '🦋',
  'Bitkiler': '🌿',
  'Mantarlar': '🍄',
  'Memeliler': '🦊',
  'Sürüngenler': '🦎',
  'İki Yaşamlılar': '🐸',
  'Yumuşakçalar': '🐌',
  'Örümcekgiller': '🕷️',
  'Hava Durumu': '🌤️',
  'Manzara': '🏞️',
  'Davranış': '👀',
};

// UI için odak ikonları
export const focusIcons: Record<ObservationFocus, string> = {
  identification: '🔍',
  behavior: '🎬',
  habitat: '🏠',
  interaction: '🤝',
  lifecycle: '🔄',
  count: '🔢',
  sounds: '👂',
  patterns: '🎨',
  comparison: '⚖️',
  seasonal: '📅',
};
