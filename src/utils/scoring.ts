import { Rating, VerdictLabel } from '../types';

/**
 * Calculates the weighted overall rating according to the specification:
 * Flavour and Would Make Again are weighted highest.
 * Flavour: 30%
 * Would Make Again: 25%
 * Creaminess: 20%
 * Texture: 15%
 * Creativity: 10%
 */
export function calculateOverallScore(
  ratings: Omit<Rating, 'overall'>
): number {
  const flavour = Number(ratings.flavour) || 0;
  const wouldMakeAgain = Number(ratings.wouldMakeAgain) || 0;
  const creaminess = Number(ratings.creaminess) || 0;
  const texture = Number(ratings.texture) || 0;
  const creativity = Number(ratings.creativity) || 0;

  const score = (
    flavour * 0.30 +
    wouldMakeAgain * 0.25 +
    creaminess * 0.20 +
    texture * 0.15 +
    creativity * 0.10
  );

  return Math.round(score * 10) / 10;
}

export function getVerdictLabel(overall: number): VerdictLabel {
  if (overall >= 9.0) return 'Perfect';
  if (overall >= 8.0) return 'Very good';
  if (overall >= 7.0) return 'Make again';
  return 'Needs work';
}

export function getVerdictColor(verdict: VerdictLabel | string): {
  bg: string;
  text: string;
  border: string;
  badgeBg: string;
} {
  switch (verdict) {
    case 'Perfect':
    case 'Legendary':
      return {
        bg: 'bg-amber-100/80',
        text: 'text-amber-900',
        border: 'border-amber-300',
        badgeBg: 'bg-amber-500 text-white shadow-xs',
      };
    case 'Very good':
    case 'Very Good':
      return {
        bg: 'bg-emerald-50',
        text: 'text-emerald-900',
        border: 'border-emerald-300',
        badgeBg: 'bg-emerald-600 text-white',
      };
    case 'Make again':
    case 'Make Again':
      return {
        bg: 'bg-sky-50',
        text: 'text-sky-900',
        border: 'border-sky-300',
        badgeBg: 'bg-sky-600 text-white',
      };
    case 'Needs work':
    case 'Needs Work':
    default:
      return {
        bg: 'bg-orange-50',
        text: 'text-orange-900',
        border: 'border-orange-300',
        badgeBg: 'bg-orange-500 text-white',
      };
  }
}
