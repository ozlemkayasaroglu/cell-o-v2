/**
 * Ekran Süresi Hook'u
 * Çocuklar için yaşa dayalı süre takibi
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import {
  getTodayScreenTime,
  updateScreenTime,
  calculateDailyLimit,
  calculateRemainingTime,
  formatMinutes,
  startSession,
  endSession,
} from '@/utils/screenTimeManager';
import { getProfile } from '@/services/profileService';

export interface ScreenTimeState {
  usedSeconds: number;
  dailyLimitMinutes: number;
  remainingSeconds: number;
  usedFormatted: string;
  remainingFormatted: string;
  percentUsed: number;
  isLimitReached: boolean;
  ageGroup: string;
}

export function useScreenTime() {
  const [state, setState] = useState<ScreenTimeState>({
    usedSeconds: 0,
    dailyLimitMinutes: 60,
    remainingSeconds: 3600,
    usedFormatted: '0 dakika',
    remainingFormatted: '60 dakika',
    percentUsed: 0,
    isLimitReached: false,
    ageGroup: '6-7',
  });
  
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const appStateRef = useRef(AppState.currentState);

  // Verileri yükle
  const loadData = useCallback(async () => {
    try {
      const profile = await getProfile();
      const ageGroup = profile?.ageGroup || '6-7';
      const dailyLimitMinutes = calculateDailyLimit(ageGroup);
      
      const screenTime = await getTodayScreenTime();
      const usedSeconds = screenTime.totalSeconds;
      const remainingSeconds = calculateRemainingTime(usedSeconds, dailyLimitMinutes);
      
      setState({
        usedSeconds,
        dailyLimitMinutes,
        remainingSeconds,
        // Gösterimde sadece dakika cinsinden göstereceğiz
        usedFormatted: formatMinutes(usedSeconds),
        remainingFormatted: formatMinutes(remainingSeconds),
        percentUsed: Math.min(100, (usedSeconds / (dailyLimitMinutes * 60)) * 100),
        isLimitReached: remainingSeconds <= 0,
        ageGroup,
      });
    } catch (error) {
      console.error('Ekran süresi yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Her dakika güncelle
  const tick = useCallback(async () => {
    if (appStateRef.current === 'active') {
      try {
        // Her dakika için 60 saniye ekle (kullanıcının beklediği dk-dk ilerleme)
        const secondsPerTick = 60;
        await updateScreenTime(secondsPerTick);
        await loadData();
      } catch (err) {
        console.error('Tick sırasında hata:', err);
      }
    }
  }, [loadData]);

  // Uygulama durumu değişikliği
  const handleAppStateChange = useCallback(async (nextAppState: AppStateStatus) => {
    if (appStateRef.current.match(/inactive|background/) && nextAppState === 'active') {
      // Uygulama ön plana geldi
      await startSession();
      await loadData();
    } else if (nextAppState.match(/inactive|background/) && appStateRef.current === 'active') {
      // Uygulama arka plana gitti
      await endSession();
    }
    appStateRef.current = nextAppState;
  }, [loadData]);

  useEffect(() => {
    loadData();
    startSession();

    // Her dakika güncelle
    intervalRef.current = setInterval(tick, 60000);

    // App state dinleyicisi
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      subscription.remove();
      endSession();
    };
  }, [loadData, tick, handleAppStateChange]);

  const refresh = useCallback(async () => {
    setLoading(true);
    await loadData();
  }, [loadData]);

  return {
    ...state,
    loading,
    refresh,
  };
}
