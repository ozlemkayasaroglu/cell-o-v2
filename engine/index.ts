/**
 * Engine - Main Export
 * Exports all engine components for easy importing
 */

// Experiment engine
export { experimentEngine, default } from './experimentEngine';

// Types
export type {
  WeeklyExperiment,
  WeeklyProgress,
  Badge,
  ExperimentCategory,
  ExperimentDifficulty,
  RequiredMaterial,
  ExperimentStep,
} from '@/types/experimentTypes';

export {
  difficultyPoints,
  categoryIcons,
  difficultyColors,
} from '@/types/experimentTypes';
