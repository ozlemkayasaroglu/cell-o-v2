/**
 * useWeeklyExperiment Hook
 * Haftalık deney yönetimi için React hook
 */

import { useState, useEffect, useCallback } from 'react';
import {
  WeeklyExperiment,
  WeeklyProgress,
  Badge,
} from '@/types/experimentTypes';
import experimentEngine from '@/engine/experimentEngine';

interface UseWeeklyExperimentResult {
  // Mevcut deney
  currentExperiment: WeeklyExperiment | null;
  upcomingExperiments: WeeklyExperiment[];
  allExperiments: WeeklyExperiment[];

  // İlerleme
  progress: WeeklyProgress;

  // Durumlar
  loading: boolean;
  error: string | null;

  // Aksiyonlar
  refreshData: () => Promise<void>;
  completeExperiment: (
    experimentId: string,
    observation: {
      notes: string;
      photoUri?: string;
      rating: number;
    }
  ) => Promise<{ success: boolean; newBadges: Badge[]; pointsEarned: number }>;
  advanceWeek: () => Promise<void>;
  resetProgress: () => Promise<void>;
  searchOrganisms: (query: string) => Promise<any[]>;
}

export function useWeeklyExperiment(): UseWeeklyExperimentResult {
  const [currentExperiment, setCurrentExperiment] =
    useState<WeeklyExperiment | null>(null);
  const [upcomingExperiments, setUpcomingExperiments] = useState<
    WeeklyExperiment[]
  >([]);
  const [allExperiments, setAllExperiments] = useState<WeeklyExperiment[]>([]);
  const [progress, setProgress] = useState<WeeklyProgress>({
    currentWeek: 1,
    totalExperimentsCompleted: 0,
    totalPoints: 0,
    streak: 0,
    badges: [],
    unlockedCategories: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [currentExp, upcoming, all, prog] = await Promise.all([
        experimentEngine.getCurrentWeekExperiment(),
        experimentEngine.getUpcomingExperiments(4),
        experimentEngine.getAllExperiments(),
        experimentEngine.getProgress(),
      ]);

      setCurrentExperiment(currentExp);
      setUpcomingExperiments(upcoming);
      setAllExperiments(all);
      setProgress(prog);

      // Removed verbose debugging logs
    } catch (err) {
      console.error('Veri yüklenirken hata:', err);
      setError('Veriler yüklenemedi. Lütfen tekrar dene.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const completeExperiment = async (
    experimentId: string,
    observation: {
      notes: string;
      photoUri?: string;
      rating: number;
    }
  ) => {
    const result = await experimentEngine.completeExperiment(
      experimentId,
      observation
    );

    if (result.success) {
      // Verileri yenile
      await loadData();
    }

    return result;
  };

  const advanceWeek = async () => {
    await experimentEngine.advanceToNextWeek();
    await loadData();
  };

  const resetProgress = async () => {
    await experimentEngine.resetProgress();
    await loadData();
  };

  const searchOrganisms = async (query: string) => {
    return experimentEngine.searchOrganisms(query);
  };

  return {
    currentExperiment,
    upcomingExperiments,
    allExperiments,
    progress,
    loading,
    error,
    refreshData: loadData,
    completeExperiment,
    advanceWeek,
    resetProgress,
    searchOrganisms,
  };
}

export default useWeeklyExperiment;
