/**
 * Observation Engine
 * Generates and manages observation tasks using iNaturalist data as reference
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ObservationTask,
  ObservationHistory,
  ObservationCategory,
  ObservationFocus,
  ObservationDifficulty,
  TaskGenerationConfig,
  difficultyPoints,
  CompletedObservation,
} from '@/types/observationTypes';
import {
  mockTaxa,
  getRandomTaxonFromCategory,
  INatTaxon,
} from '@/data/iNaturalistMockData';
import {
  taskTemplates,
  TaskTemplate,
  getSeasonalTemplates,
} from '@/data/observationTemplates';

// Storage keys
const STORAGE_KEYS = {
  ACTIVE_TASKS: 'observation_active_tasks',
  TASK_HISTORY: 'observation_task_history',
  COMPLETED_OBSERVATIONS: 'observation_completed',
  USER_PREFERENCES: 'observation_preferences',
};

// Default repeat interval in days
const DEFAULT_REPEAT_AFTER_DAYS = 60;

/**
 * Generate a unique task ID
 */
function generateTaskId(): string {
  return `task_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Fill in template placeholders with taxon data
 */
function fillTemplate(template: string, taxon?: INatTaxon): string {
  if (!taxon) return template.replace(/{taxonName}/g, 'an organism');
  return template.replace(/{taxonName}/g, taxon.commonName);
}

/**
 * Check if a task variation should be repeated based on history
 */
async function shouldRepeatTask(
  category: ObservationCategory,
  focus: ObservationFocus,
  repeatAfterDays: number = DEFAULT_REPEAT_AFTER_DAYS
): Promise<boolean> {
  try {
    const historyData = await AsyncStorage.getItem(STORAGE_KEYS.TASK_HISTORY);
    if (!historyData) return true;

    const history: ObservationHistory[] = JSON.parse(historyData);
    const matchingHistory = history.find(
      (h) => h.category === category && h.focus === focus
    );

    if (!matchingHistory) return true;

    const lastCompleted = new Date(matchingHistory.lastCompletedAt);
    const daysSinceCompletion = Math.floor(
      (Date.now() - lastCompleted.getTime()) / (1000 * 60 * 60 * 24)
    );

    return daysSinceCompletion >= repeatAfterDays;
  } catch (error) {
    console.error('Error checking task history:', error);
    return true;
  }
}

/**
 * Get the user's observation history
 */
async function getTaskHistory(): Promise<ObservationHistory[]> {
  try {
    const historyData = await AsyncStorage.getItem(STORAGE_KEYS.TASK_HISTORY);
    return historyData ? JSON.parse(historyData) : [];
  } catch (error) {
    console.error('Error getting task history:', error);
    return [];
  }
}

/**
 * Update task history after completion
 */
async function updateTaskHistory(
  category: ObservationCategory,
  focus: ObservationFocus,
  taskId: string
): Promise<void> {
  try {
    const history = await getTaskHistory();
    const existingIndex = history.findIndex(
      (h) => h.category === category && h.focus === focus
    );

    const now = new Date().toISOString();

    if (existingIndex >= 0) {
      history[existingIndex].lastCompletedAt = now;
      history[existingIndex].completionCount += 1;
    } else {
      history.push({
        taskId,
        category,
        focus,
        lastCompletedAt: now,
        completionCount: 1,
      });
    }

    await AsyncStorage.setItem(STORAGE_KEYS.TASK_HISTORY, JSON.stringify(history));
  } catch (error) {
    console.error('Error updating task history:', error);
  }
}

/**
 * Generate a single observation task from a template
 */
function createTaskFromTemplate(
  template: TaskTemplate,
  taxon?: INatTaxon
): ObservationTask {
  const now = new Date();
  const expiresAt = new Date(now);
  expiresAt.setDate(expiresAt.getDate() + 7); // Tasks expire in 7 days

  return {
    id: generateTaskId(),
    title: fillTemplate(template.titleTemplate, taxon),
    description: fillTemplate(template.descriptionTemplate, taxon),
    category: template.category,
    focus: template.focus,
    difficulty: template.difficulty,
    points: difficultyPoints[template.difficulty],
    hints: template.hints,
    targetTaxon: taxon,
    repeatAfterDays: DEFAULT_REPEAT_AFTER_DAYS,
    createdAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
  };
}

/**
 * Main Observation Engine
 */
export const observationEngine = {
  /**
   * Generate new observation tasks based on configuration
   */
  async generateTasks(config: TaskGenerationConfig = {}): Promise<ObservationTask[]> {
    const {
      preferredCategories,
      maxDifficulty = 'hard',
      includeExpired = false,
      count = 5,
    } = config;

    const tasks: ObservationTask[] = [];
    const availableTemplates = getSeasonalTemplates();

    // Filter by difficulty
    const difficultyOrder: ObservationDifficulty[] = ['easy', 'medium', 'hard', 'expert'];
    const maxDifficultyIndex = difficultyOrder.indexOf(maxDifficulty);
    const filteredByDifficulty = availableTemplates.filter(
      (t) => difficultyOrder.indexOf(t.difficulty) <= maxDifficultyIndex
    );

    // Filter by preferred categories if specified
    const filteredTemplates = preferredCategories
      ? filteredByDifficulty.filter((t) =>
          preferredCategories.includes(t.category)
        )
      : filteredByDifficulty;

    // Shuffle templates
    const shuffled = [...filteredTemplates].sort(() => Math.random() - 0.5);

    for (const template of shuffled) {
      if (tasks.length >= count) break;

      // Check if this variation should be repeated
      const canRepeat = await shouldRepeatTask(
        template.category,
        template.focus,
        DEFAULT_REPEAT_AFTER_DAYS
      );

      if (!canRepeat && !includeExpired) continue;

      // Get a random taxon if the template requires one
      let taxon: INatTaxon | undefined;
      if (template.requiresTaxon) {
        const categoryTaxon = getRandomTaxonFromCategory(template.category);
        taxon = categoryTaxon || undefined;
      }

      const task = createTaskFromTemplate(template, taxon);
      tasks.push(task);
    }

    return tasks;
  },

  /**
   * Get today's recommended tasks (mix of difficulties and categories)
   */
  async getDailyTasks(): Promise<ObservationTask[]> {
    // Try to load cached daily tasks first
    try {
      const cached = await AsyncStorage.getItem(STORAGE_KEYS.ACTIVE_TASKS);
      if (cached) {
        const { tasks, date } = JSON.parse(cached);
        const today = new Date().toDateString();
        if (date === today && tasks.length > 0) {
          return tasks;
        }
      }
    } catch (error) {
      console.error('Error loading cached tasks:', error);
    }

    // Generate new daily tasks with variety
    const easyTasks = await this.generateTasks({
      maxDifficulty: 'easy',
      count: 2,
    });

    const mediumTasks = await this.generateTasks({
      maxDifficulty: 'medium',
      count: 2,
    });

    const hardTasks = await this.generateTasks({
      maxDifficulty: 'hard',
      count: 1,
    });

    const allTasks = [...easyTasks, ...mediumTasks, ...hardTasks];

    // Cache the daily tasks
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.ACTIVE_TASKS,
        JSON.stringify({
          tasks: allTasks,
          date: new Date().toDateString(),
        })
      );
    } catch (error) {
      console.error('Error caching tasks:', error);
    }

    return allTasks;
  },

  /**
   * Get tasks for a specific category
   */
  async getTasksByCategory(category: ObservationCategory): Promise<ObservationTask[]> {
    return this.generateTasks({
      preferredCategories: [category],
      count: 5,
    });
  },

  /**
   * Complete a task and record the observation
   */
  async completeTask(
    task: ObservationTask,
    observationText: string,
    location: string,
    photoUri?: string
  ): Promise<CompletedObservation> {
    const completed: CompletedObservation = {
      id: `obs_${Date.now()}`,
      taskId: task.id,
      observationText,
      location,
      completedAt: new Date().toISOString(),
      photoUri,
      verified: false,
    };

    // Save to completed observations
    try {
      const existingData = await AsyncStorage.getItem(
        STORAGE_KEYS.COMPLETED_OBSERVATIONS
      );
      const observations: CompletedObservation[] = existingData
        ? JSON.parse(existingData)
        : [];
      observations.unshift(completed);
      await AsyncStorage.setItem(
        STORAGE_KEYS.COMPLETED_OBSERVATIONS,
        JSON.stringify(observations)
      );

      // Update history
      await updateTaskHistory(task.category, task.focus, task.id);

      // Remove from active tasks
      await this.removeActiveTask(task.id);
    } catch (error) {
      console.error('Error completing task:', error);
    }

    return completed;
  },

  /**
   * Remove a task from active tasks
   */
  async removeActiveTask(taskId: string): Promise<void> {
    try {
      const cached = await AsyncStorage.getItem(STORAGE_KEYS.ACTIVE_TASKS);
      if (cached) {
        const { tasks, date } = JSON.parse(cached);
        const updatedTasks = tasks.filter((t: ObservationTask) => t.id !== taskId);
        await AsyncStorage.setItem(
          STORAGE_KEYS.ACTIVE_TASKS,
          JSON.stringify({ tasks: updatedTasks, date })
        );
      }
    } catch (error) {
      console.error('Error removing task:', error);
    }
  },

  /**
   * Get completed observations
   */
  async getCompletedObservations(): Promise<CompletedObservation[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.COMPLETED_OBSERVATIONS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting completed observations:', error);
      return [];
    }
  },

  /**
   * Get statistics about task completion
   */
  async getStatistics(): Promise<{
    totalCompleted: number;
    byCategory: Record<string, number>;
    byDifficulty: Record<string, number>;
    totalPoints: number;
  }> {
    try {
      const history = await getTaskHistory();
      const byCategory: Record<string, number> = {};
      const byDifficulty: Record<string, number> = {};
      let totalCompleted = 0;
      let totalPoints = 0;

      const completedData = await AsyncStorage.getItem(
        STORAGE_KEYS.COMPLETED_OBSERVATIONS
      );
      const completed: CompletedObservation[] = completedData
        ? JSON.parse(completedData)
        : [];

      totalCompleted = completed.length;

      // Calculate from history
      history.forEach((h) => {
        byCategory[h.category] = (byCategory[h.category] || 0) + h.completionCount;
      });

      return {
        totalCompleted,
        byCategory,
        byDifficulty,
        totalPoints,
      };
    } catch (error) {
      console.error('Error getting statistics:', error);
      return {
        totalCompleted: 0,
        byCategory: {},
        byDifficulty: {},
        totalPoints: 0,
      };
    }
  },

  /**
   * Refresh tasks (force regeneration)
   */
  async refreshTasks(): Promise<ObservationTask[]> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.ACTIVE_TASKS);
    } catch (error) {
      console.error('Error clearing tasks:', error);
    }
    return this.getDailyTasks();
  },

  /**
   * Get all available categories
   */
  getAvailableCategories(): ObservationCategory[] {
    const categories = new Set(taskTemplates.map((t) => t.category));
    return Array.from(categories);
  },

  /**
   * Search for tasks related to a specific taxon
   */
  async searchByTaxon(query: string): Promise<ObservationTask[]> {
    const matchingTaxa = mockTaxa.filter(
      (t) =>
        t.commonName.toLowerCase().includes(query.toLowerCase()) ||
        t.name.toLowerCase().includes(query.toLowerCase())
    );

    const tasks: ObservationTask[] = [];

    for (const taxon of matchingTaxa.slice(0, 3)) {
      const categoryTemplates = taskTemplates.filter(
        (t) => t.category === getCategoryFromTaxon(taxon) && t.requiresTaxon
      );

      if (categoryTemplates.length > 0) {
        const template = categoryTemplates[0];
        tasks.push(createTaskFromTemplate(template, taxon));
      }
    }

    return tasks;
  },
};

/**
 * Helper function to get category from taxon
 */
function getCategoryFromTaxon(taxon: INatTaxon): ObservationCategory {
  const mapping: Record<string, ObservationCategory> = {
    Aves: 'Kuşlar',
    Insecta: 'Böcekler',
    Plantae: 'Bitkiler',
    Fungi: 'Mantarlar',
    Mammalia: 'Memeliler',
    Reptilia: 'Sürüngenler',
    Amphibia: 'İki Yaşamlılar',
    Mollusca: 'Yumuşakçalar',
    Arachnida: 'Örümcekgiller',
  };
  return mapping[taxon.iconicTaxonName] || 'Davranış';
}

export default observationEngine;
