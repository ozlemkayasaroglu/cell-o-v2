/**
 * useObservationTasks Hook
 * React hook for managing observation tasks in the UI
 */

import { useState, useEffect, useCallback } from 'react';
import { observationEngine } from '@/engine/observationEngine';
import {
  ObservationTask,
  ObservationCategory,
  CompletedObservation,
} from '@/types/observationTypes';

interface UseObservationTasksResult {
  tasks: ObservationTask[];
  loading: boolean;
  error: string | null;
  refreshTasks: () => Promise<void>;
  completeTask: (
    task: ObservationTask,
    observationText: string,
    location: string,
    photoUri?: string
  ) => Promise<CompletedObservation | null>;
  getTasksByCategory: (category: ObservationCategory) => Promise<void>;
  completedObservations: CompletedObservation[];
  statistics: {
    totalCompleted: number;
    byCategory: Record<string, number>;
    totalPoints: number;
  };
}

export function useObservationTasks(): UseObservationTasksResult {
  const [tasks, setTasks] = useState<ObservationTask[]>([]);
  const [completedObservations, setCompletedObservations] = useState<CompletedObservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statistics, setStatistics] = useState({
    totalCompleted: 0,
    byCategory: {} as Record<string, number>,
    totalPoints: 0,
  });

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const dailyTasks = await observationEngine.getDailyTasks();
      setTasks(dailyTasks);
    } catch (err) {
      setError('Failed to load observation tasks');
      console.error('Error loading tasks:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadCompletedObservations = useCallback(async () => {
    try {
      const completed = await observationEngine.getCompletedObservations();
      setCompletedObservations(completed);
    } catch (err) {
      console.error('Error loading completed observations:', err);
    }
  }, []);

  const loadStatistics = useCallback(async () => {
    try {
      const stats = await observationEngine.getStatistics();
      setStatistics({
        totalCompleted: stats.totalCompleted,
        byCategory: stats.byCategory,
        totalPoints: stats.totalPoints,
      });
    } catch (err) {
      console.error('Error loading statistics:', err);
    }
  }, []);

  useEffect(() => {
    loadTasks();
    loadCompletedObservations();
    loadStatistics();
  }, [loadTasks, loadCompletedObservations, loadStatistics]);

  const refreshTasks = async () => {
    setLoading(true);
    try {
      const newTasks = await observationEngine.refreshTasks();
      setTasks(newTasks);
    } catch (err) {
      setError('Failed to refresh tasks');
    } finally {
      setLoading(false);
    }
  };

  const completeTask = async (
    task: ObservationTask,
    observationText: string,
    location: string,
    photoUri?: string
  ): Promise<CompletedObservation | null> => {
    try {
      const completed = await observationEngine.completeTask(
        task,
        observationText,
        location,
        photoUri
      );

      // Update local state
      setTasks((prev) => prev.filter((t) => t.id !== task.id));
      setCompletedObservations((prev) => [completed, ...prev]);
      await loadStatistics();

      return completed;
    } catch (err) {
      setError('Failed to complete task');
      return null;
    }
  };

  const getTasksByCategory = async (category: ObservationCategory) => {
    setLoading(true);
    try {
      const categoryTasks = await observationEngine.getTasksByCategory(category);
      setTasks(categoryTasks);
    } catch (err) {
      setError('Failed to load category tasks');
    } finally {
      setLoading(false);
    }
  };

  return {
    tasks,
    loading,
    error,
    refreshTasks,
    completeTask,
    getTasksByCategory,
    completedObservations,
    statistics,
  };
}

export default useObservationTasks;
