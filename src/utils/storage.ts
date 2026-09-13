import { Challenge, Experiment, Ingredient } from '../types';
import { STARTER_CHALLENGES, STARTER_EXPERIMENTS, STARTER_INGREDIENTS } from '../data/initialData';

const STORAGE_KEYS = {
  EXPERIMENTS: 'ice_cream_lab_experiments_v1',
  INGREDIENTS: 'ice_cream_lab_ingredients_v1',
  CHALLENGES: 'ice_cream_lab_challenges_v1',
};

export function loadExperiments(): Experiment[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.EXPERIMENTS);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.error('Failed to load experiments from localStorage', err);
  }
  saveExperiments(STARTER_EXPERIMENTS);
  return STARTER_EXPERIMENTS;
}

export function saveExperiments(experiments: Experiment[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.EXPERIMENTS, JSON.stringify(experiments));
  } catch (err) {
    console.error('Failed to save experiments to localStorage', err);
  }
}

export function loadIngredients(): Ingredient[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.INGREDIENTS);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.error('Failed to load ingredients from localStorage', err);
  }
  saveIngredients(STARTER_INGREDIENTS);
  return STARTER_INGREDIENTS;
}

export function saveIngredients(ingredients: Ingredient[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.INGREDIENTS, JSON.stringify(ingredients));
  } catch (err) {
    console.error('Failed to save ingredients to localStorage', err);
  }
}

export function loadChallenges(): Challenge[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CHALLENGES);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.error('Failed to load challenges from localStorage', err);
  }
  saveChallenges(STARTER_CHALLENGES);
  return STARTER_CHALLENGES;
}

export function saveChallenges(challenges: Challenge[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(challenges));
  } catch (err) {
    console.error('Failed to save challenges to localStorage', err);
  }
}
