/**
 * Profil Yönetim Servisi
 * Kullanıcı verilerini AsyncStorage'da yönetir
 * Çocuk gizliliği için tüm veriler yerel olarak saklanır
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserProfile {
  nickname: string;
  avatar: string;
  ageGroup: string;
  createdAt: string;
  totalPoints: number;
  completedExperiments: string[];
  badges: Badge[];
  currentStreak: number;
  lastActivityDate?: string;
}

export interface Badge {
  id: string;
  name: string;
  emoji: string;
  description: string;
  earnedAt: string;
}

export interface ExperimentProgress {
  experimentId: string;
  startedAt: string;
  completedAt?: string;
  currentStep: number;
  totalSteps: number;
  notes: string[];
  photos: string[]; // Base64 encoded local photos
  pointsEarned: number;
}

const STORAGE_KEYS = {
  PROFILE: 'user_profile',
  EXPERIMENTS: 'experiment_progress',
  WEEKLY_DATA: 'weekly_experiment_data',
  SETTINGS: 'app_settings',
};

/**
 * Profili getir
 */
export async function getProfile(): Promise<UserProfile | null> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.PROFILE);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Profil getirilemedi:', error);
    return null;
  }
}

/**
 * Profili güncelle
 */
export async function updateProfile(updates: Partial<UserProfile>): Promise<boolean> {
  try {
    const current = await getProfile();
    if (!current) return false;
    
    const updated = { ...current, ...updates };
    await AsyncStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated));
    return true;
  } catch (error) {
    console.error('Profil güncellenemedi:', error);
    return false;
  }
}

/**
 * Puan ekle
 */
export async function addPoints(points: number): Promise<number> {
  try {
    const profile = await getProfile();
    if (!profile) return 0;
    
    const newTotal = profile.totalPoints + points;
    await updateProfile({ 
      totalPoints: newTotal,
      lastActivityDate: new Date().toISOString(),
    });
    
    // Rozet kontrolü
    await checkAndAwardBadges(newTotal, profile);
    
    return newTotal;
  } catch (error) {
    console.error('Puan eklenemedi:', error);
    return 0;
  }
}

/**
 * Deney tamamlandı işaretle
 */
export async function completeExperiment(experimentId: string, points: number): Promise<boolean> {
  try {
    const profile = await getProfile();
    if (!profile) return false;
    
    if (!profile.completedExperiments.includes(experimentId)) {
      profile.completedExperiments.push(experimentId);
      profile.totalPoints += points;
      profile.lastActivityDate = new Date().toISOString();
      
      // Streak güncelle
      profile.currentStreak = calculateStreak(profile.lastActivityDate);
      
      await AsyncStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
      
      // Rozet kontrolü
      await checkAndAwardBadges(profile.totalPoints, profile);
    }
    
    return true;
  } catch (error) {
    console.error('Deney tamamlanamadı:', error);
    return false;
  }
}

/**
 * Rozet ver
 */
export async function awardBadge(badge: Omit<Badge, 'earnedAt'>): Promise<boolean> {
  try {
    const profile = await getProfile();
    if (!profile) return false;
    
    // Zaten var mı kontrol et
    if (profile.badges.some(b => b.id === badge.id)) {
      return false;
    }
    
    profile.badges.push({
      ...badge,
      earnedAt: new Date().toISOString(),
    });
    
    await AsyncStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    return true;
  } catch (error) {
    console.error('Rozet verilemedi:', error);
    return false;
  }
}

/**
 * Rozet kontrolü ve otomatik verme
 */
async function checkAndAwardBadges(totalPoints: number, profile: UserProfile): Promise<void> {
  const badges: Array<Omit<Badge, 'earnedAt'>> = [];
  
  // Puan rozetleri
  if (totalPoints >= 100 && !profile.badges.some(b => b.id === 'points_100')) {
    badges.push({
      id: 'points_100',
      name: 'Başlangıç',
      emoji: '⭐',
      description: '100 puan kazandın!',
    });
  }
  
  if (totalPoints >= 500 && !profile.badges.some(b => b.id === 'points_500')) {
    badges.push({
      id: 'points_500',
      name: 'Yükselen Yıldız',
      emoji: '🌟',
      description: '500 puan kazandın!',
    });
  }
  
  if (totalPoints >= 1000 && !profile.badges.some(b => b.id === 'points_1000')) {
    badges.push({
      id: 'points_1000',
      name: 'Süper Bilim İnsanı',
      emoji: '🏆',
      description: '1000 puan kazandın!',
    });
  }
  
  // Deney rozetleri
  const experimentCount = profile.completedExperiments.length;
  
  if (experimentCount >= 1 && !profile.badges.some(b => b.id === 'first_experiment')) {
    badges.push({
      id: 'first_experiment',
      name: 'İlk Deney',
      emoji: '🧪',
      description: 'İlk deneyini tamamladın!',
    });
  }
  
  if (experimentCount >= 5 && !profile.badges.some(b => b.id === 'experiments_5')) {
    badges.push({
      id: 'experiments_5',
      name: 'Meraklı Kaşif',
      emoji: '🔬',
      description: '5 deney tamamladın!',
    });
  }
  
  if (experimentCount >= 10 && !profile.badges.some(b => b.id === 'experiments_10')) {
    badges.push({
      id: 'experiments_10',
      name: 'Deney Ustası',
      emoji: '🥼',
      description: '10 deney tamamladın!',
    });
  }
  
  // Streak rozetleri
  if (profile.currentStreak >= 7 && !profile.badges.some(b => b.id === 'streak_7')) {
    badges.push({
      id: 'streak_7',
      name: 'Haftalık Seri',
      emoji: '🔥',
      description: '7 gün üst üste deney yaptın!',
    });
  }
  
  // Rozetleri ver
  for (const badge of badges) {
    await awardBadge(badge);
  }
}

/**
 * Streak hesapla
 */
function calculateStreak(lastActivityDate: string): number {
  const last = new Date(lastActivityDate);
  const today = new Date();
  
  // Aynı gün mü?
  if (last.toDateString() === today.toDateString()) {
    return 1;
  }
  
  // Dün mü?
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (last.toDateString() === yesterday.toDateString()) {
    return 1; // Streak devam ediyor, mevcut değeri koru
  }
  
  return 0; // Streak kırıldı
}

/**
 * Tüm verileri sıfırla (test için)
 */
export async function resetAllData(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.PROFILE,
      STORAGE_KEYS.EXPERIMENTS,
      STORAGE_KEYS.WEEKLY_DATA,
      'onboarding_completed',
      'profile_completed',
    ]);
  } catch (error) {
    console.error('Veriler sıfırlanamadı:', error);
  }
}

export default {
  getProfile,
  updateProfile,
  addPoints,
  completeExperiment,
  awardBadge,
  resetAllData,
};
