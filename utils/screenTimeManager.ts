/**
 * Ekran Süresi Yöneticisi
 * Çocuklar için yaşa göre süre kısıtı (yaş × 10 dakika)
 * Tüm veriler yerel olarak saklanır
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'screen_time_data';

export interface ScreenTimeData {
  date: string; // YYYY-MM-DD formatında
  totalSeconds: number;
  sessions: SessionData[];
}

export interface SessionData {
  startTime: string;
  endTime?: string;
  durationSeconds: number;
}

export interface ScreenTimeSettings {
  ageGroup: string;
  dailyLimitMinutes: number;
}

/**
 * Yaş grubuna göre günlük limit hesapla (yaş × 10 dakika)
 */
export function calculateDailyLimit(ageGroup: string): number {
  // Sabit limitler: 4-7 => 20 dk, diğerleri => 30 dk
  if (ageGroup === '4-5' || ageGroup === '6-7') return 20;
  return 30;
}

/**
 * Bugünün tarihini YYYY-MM-DD formatında al
 */
function getTodayKey(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

/**
 * Bugünün ekran süresi verisini getir
 */
export async function getTodayScreenTime(): Promise<ScreenTimeData> {
  try {
    const todayKey = getTodayKey();
    const allData = await AsyncStorage.getItem(STORAGE_KEY);
    const parsed = allData ? JSON.parse(allData) : {};
    
    return parsed[todayKey] || {
      date: todayKey,
      totalSeconds: 0,
      sessions: [],
    };
  } catch (error) {
    console.error('Ekran süresi getirilemedi:', error);
    return {
      date: getTodayKey(),
      totalSeconds: 0,
      sessions: [],
    };
  }
}

/**
 * Ekran süresini güncelle
 */
export async function updateScreenTime(additionalSeconds: number): Promise<ScreenTimeData> {
  try {
    const todayKey = getTodayKey();
    const allData = await AsyncStorage.getItem(STORAGE_KEY);
    const parsed = allData ? JSON.parse(allData) : {};
    
    const todayData = parsed[todayKey] || {
      date: todayKey,
      totalSeconds: 0,
      sessions: [],
    };
    
    todayData.totalSeconds += additionalSeconds;
    parsed[todayKey] = todayData;
    
    // Sadece son 7 günü sakla
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const cutoffKey = sevenDaysAgo.toISOString().split('T')[0];
    
    const filteredData: Record<string, ScreenTimeData> = {};
    Object.keys(parsed).forEach(key => {
      if (key >= cutoffKey) {
        filteredData[key] = parsed[key];
      }
    });
    
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filteredData));
    return todayData;
  } catch (error) {
    console.error('Ekran süresi güncellenemedi:', error);
    return {
      date: getTodayKey(),
      totalSeconds: 0,
      sessions: [],
    };
  }
}

/**
 * Oturum başlat
 */
export async function startSession(): Promise<void> {
  try {
    const todayKey = getTodayKey();
    const allData = await AsyncStorage.getItem(STORAGE_KEY);
    const parsed = allData ? JSON.parse(allData) : {};
    
    const todayData = parsed[todayKey] || {
      date: todayKey,
      totalSeconds: 0,
      sessions: [],
    };
    
    todayData.sessions.push({
      startTime: new Date().toISOString(),
      durationSeconds: 0,
    });
    
    parsed[todayKey] = todayData;
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
  } catch (error) {
    console.error('Oturum başlatılamadı:', error);
  }
}

/**
 * Oturumu bitir
 */
export async function endSession(): Promise<void> {
  try {
    const todayKey = getTodayKey();
    const allData = await AsyncStorage.getItem(STORAGE_KEY);
    if (!allData) return;
    
    const parsed = JSON.parse(allData);
    const todayData = parsed[todayKey];
    if (!todayData || todayData.sessions.length === 0) return;
    
    const lastSession = todayData.sessions[todayData.sessions.length - 1];
    if (lastSession && !lastSession.endTime) {
      lastSession.endTime = new Date().toISOString();
      const start = new Date(lastSession.startTime).getTime();
      const end = new Date(lastSession.endTime).getTime();
      lastSession.durationSeconds = Math.floor((end - start) / 1000);
    }
    
    parsed[todayKey] = todayData;
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
  } catch (error) {
    console.error('Oturum bitirilemedi:', error);
  }
}

/**
 * Kalan süreyi hesapla (saniye cinsinden)
 */
export function calculateRemainingTime(
  usedSeconds: number,
  dailyLimitMinutes: number
): number {
  const limitSeconds = dailyLimitMinutes * 60;
  return Math.max(0, limitSeconds - usedSeconds);
}

/**
 * Süreyi insan okunabilir formata çevir
 */
export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}s ${minutes}dk`;
  }
  if (minutes > 0) {
    return `${minutes}dk ${secs}sn`;
  }
  return `${secs}sn`;
}

/**
 * Süreyi sadece dakika olarak göster
 */
export function formatMinutes(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  return `${minutes} dakika`;
}
