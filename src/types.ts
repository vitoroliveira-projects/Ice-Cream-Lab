export type NinjaProgram = 
  | 'Ice Cream' 
  | 'Lite Ice Cream' 
  | 'Sorbet' 
  | 'Gelato' 
  | 'Milkshake' 
  | 'Mix-In' 
  | 'Italian Ice' 
  | 'Slushi';

export type NinjaModel = 
  | 'Ninja CREAMi Deluxe NC501' 
  | 'Ninja CREAMi NC300 / NC301' 
  | 'Ninja CREAMi Breeze' 
  | 'Other / Custom';

export type IngredientCategory = 
  | 'Nuts & seeds'
  | 'Spices & aromatics'
  | 'Sweet swirls'
  | 'Chocolate'
  | 'Crunch / mix-ins'
  | 'Fruit'
  | 'Coffee / drinks'
  | 'Wildcard'
  | 'Base & Dairy'
  | 'Sweetener / Binder';

export type IngredientSource = 
  | 'Albert Heijn'
  | 'Turkish supermarket'
  | 'Asian supermarket'
  | 'Specialty / Online'
  | 'Standard grocery'
  | 'Home pantry';

export interface Ingredient {
  id: string;
  name: string;
  category: IngredientCategory;
  flavourTags: string[];
  source: IngredientSource;
  available: boolean;
  notes?: string;
}

export interface MixInItem {
  name: string;
  amount?: string;
  type: 'dry-crunch' | 'swirl-liquid' | 'topping';
}

export interface Rating {
  creaminess: number; // 1-10
  flavour: number; // 1-10
  texture: number; // 1-10
  creativity: number; // 1-10
  wouldMakeAgain: number; // 1-10
  appearance?: number; // 1-10 (optional)
  overall: number; // Weighted calculated average
}

export type VerdictLabel = 
  | 'Needs work'
  | 'Make again'
  | 'Very good'
  | 'Perfect';

export interface BaseIngredientItem {
  name: string;
  amount: string; // e.g. "1 cup", "1 tbsp", "200ml"
}

export function parseIngredient(ing: string | BaseIngredientItem): BaseIngredientItem {
  if (typeof ing === 'object' && ing !== null && 'name' in ing) {
    return { name: ing.name, amount: ing.amount || '' };
  }
  const str = String(ing || '').trim();
  if (!str) return { name: '', amount: '' };

  // Format like "Whole milk (200ml)"
  const parenMatch = str.match(/^(.*?)\s*\((.*?)\)$/);
  if (parenMatch) {
    return { name: parenMatch[1].trim(), amount: parenMatch[2].trim() };
  }

  // Format like "1 cup whole milk" or "200ml Slagroom" or "1 tbsp cream cheese (melted)"
  const qtyMatch = str.match(/^([\d/.]+\s*(?:cups?|tbsp|tsp|ml|g|oz|pinches?|pinch|bottles?|bottle|scoops?|scoop|pieces?|can)?)\s+(.*)$/i);
  if (qtyMatch) {
    return { amount: qtyMatch[1].trim(), name: qtyMatch[2].trim() };
  }

  return { name: str, amount: '' };
}

export interface Experiment {
  id: string;
  number: number;
  date: string;
  title: string;
  base: string; // e.g., "Whole milk + heavy cream + cream cheese"
  baseIngredients: (string | BaseIngredientItem)[];
  mixIns: MixInItem[];
  machineModel: NinjaModel;
  program: NinjaProgram;
  freezeTimeHours: number;
  firstSpinRating: number; // 1 - 5 stars
  reSpinNeeded: boolean;
  reSpinCount: number;
  reSpinNotes?: string;
  challengeId?: string;
  ratings: Rating;
  verdict: VerdictLabel;
  notes?: string;
  nextTime?: string; // "Changes for next batch"
  friends?: string[];
  photoUrl?: string;
  tags?: string[];
}

export type ChallengeDifficulty = 1 | 2 | 3 | 4 | 5;
export type ChallengeStatus = 'available' | 'in-progress' | 'completed';

export interface Challenge {
  id: string;
  name: string;
  description: string;
  difficulty: ChallengeDifficulty;
  requiredIngredients?: string[];
  optionalIngredients?: string[];
  status: ChallengeStatus;
  completedExperimentNumber?: number;
  completedExperimentId?: string;
  rewardBadge?: string;
}

export interface FriendTaster {
  id: string;
  name: string;
  favouriteFlavours?: string;
  notes?: string;
}
