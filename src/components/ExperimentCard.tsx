import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  Star, 
  Edit3, 
  Trash2, 
  Share2, 
  RotateCw,
  Sparkles,
  Layers,
  Users
} from 'lucide-react';
import { Experiment, parseIngredient } from '../types';

interface ExperimentCardProps {
  experiment: Experiment;
  onSelect: (experiment: Experiment) => void;
  onShare: (experiment: Experiment) => void;
  onEdit: (experiment: Experiment) => void;
  onDelete: (experiment: Experiment) => void;
}

// Fallback high-quality ice cream cone if no image provided
const DEFAULT_PHOTO = 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80';

export function formatCardDate(dateStr: string): string {
  if (!dateStr) return '05 September 26';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = String(d.getDate()).padStart(2, '0');
    const month = d.toLocaleDateString('en-US', { month: 'long' });
    const year = String(d.getFullYear()).slice(-2);
    return `${day} ${month} ${year}`;
  } catch {
    return dateStr;
  }
}

export const ExperimentCard: React.FC<ExperimentCardProps> = ({
  experiment,
  onSelect,
  onShare,
  onEdit,
  onDelete,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formattedDate = formatCardDate(experiment.date);
  const freezeHours = experiment.freezeTimeHours ?? 22;
  const photo = experiment.photoUrl || DEFAULT_PHOTO;
  const overallScore = (experiment.ratings?.overall ?? 8.5).toFixed(1);

  // Verdict style badge
  const getVerdictStyle = (verdict: string) => {
    switch (verdict) {
      case 'Perfect':
      case 'Legendary':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'Very good':
      case 'Very Good':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'Make again':
      case 'Make Again':
        return 'bg-sky-100 text-sky-900 border-sky-300';
      case 'Needs work':
      case 'Needs Work':
        return 'bg-orange-100 text-orange-900 border-orange-300';
      default:
        return 'bg-stone-100 text-stone-800 border-stone-300';
    }
  };

  return (
    <div 
      id={`experiment-card-${experiment.id}`}
      className="bg-white rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 border border-stone-200/80 flex flex-col w-full max-w-sm mx-auto group"
    >
      {/* Top Image with Date and Freeze Overlays */}
      <div 
        onClick={() => onSelect(experiment)}
        className="relative h-64 sm:h-72 w-full overflow-hidden bg-stone-100 cursor-pointer"
      >
        <img
          src={photo}
          alt={experiment.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
        />

        {/* Top Header Overlay: Date & Freeze Duration */}
        <div className="absolute top-0 inset-x-0 bg-gradient-to-b from-black/60 via-black/25 to-transparent pt-3.5 pb-8 px-4 flex items-center justify-between text-white text-xs font-sans">
          <div className="flex items-center gap-1.5 drop-shadow-sm font-medium">
            <Calendar className="w-3.5 h-3.5 text-white/90" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-1.5 drop-shadow-sm font-medium">
            <Clock className="w-3.5 h-3.5 text-white/90" />
            <span>{freezeHours}h freeze</span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex flex-col gap-3">
        {/* Row 1: Experiment Title & Score */}
        <div className="flex items-baseline justify-between gap-2">
          <h2 
            onClick={() => onSelect(experiment)}
            title={experiment.title}
            className="font-sans font-bold text-lg text-stone-900 truncate leading-snug cursor-pointer hover:text-[#7A8A32] transition-colors"
          >
            {experiment.title || 'Experiment Title'}
          </h2>
          <div className="flex items-center gap-1 text-stone-900 font-bold text-sm shrink-0">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>{overallScore}/10</span>
          </div>
        </div>

        {/* Row 2: Spin Program Badge & Verdict Tag */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-block bg-[#F8BFB9] text-[#1c1917] text-sm font-bold px-3 py-1 rounded-full">
            {experiment.program || 'Spin program'}
          </span>
          {experiment.verdict && (
            <span className="inline-block text-sm font-bold px-3 py-1 rounded-full bg-[#DF9260] text-white">
              {experiment.verdict}
            </span>
          )}
        </div>

        {/* Row 3: 3 Score Boxes (Flavour, Creamy, Texture) */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-[#F4ECE1] rounded-xl py-2 px-1 text-center flex flex-col justify-center">
            <span className="text-sm text-stone-700 font-semibold leading-none mb-1">
              Flavour
            </span>
            <span className="text-sm font-bold text-stone-900 leading-none">
              {(experiment.ratings?.flavour ?? 0).toFixed(1)}/10
            </span>
          </div>

          <div className="bg-[#F4ECE1] rounded-xl py-2 px-1 text-center flex flex-col justify-center">
            <span className="text-sm text-stone-700 font-semibold leading-none mb-1">
              Creamy
            </span>
            <span className="text-sm font-bold text-stone-900 leading-none">
              {(experiment.ratings?.creaminess ?? 0).toFixed(1)}/10
            </span>
          </div>

          <div className="bg-[#F4ECE1] rounded-xl py-2 px-1 text-center flex flex-col justify-center">
            <span className="text-sm text-stone-700 font-semibold leading-none mb-1">
              Texture
            </span>
            <span className="text-sm font-bold text-stone-900 leading-none">
              {(experiment.ratings?.texture ?? 0).toFixed(1)}/10
            </span>
          </div>
        </div>

        {/* Row 4: Comments Box */}
        <div className="bg-[#F4ECE1] rounded-xl p-3 text-stone-700 text-xs sm:text-sm min-h-[44px] flex items-center">
          <p className="line-clamp-2 leading-relaxed italic">
            “{experiment.notes || 'No comments yet'}”
          </p>
        </div>

        {/* Row 5: Details Dropdown / Accordion Trigger */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 flex items-center justify-between text-stone-700 text-xs sm:text-sm hover:bg-stone-50 transition-colors cursor-pointer"
          >
            <span className="font-medium text-stone-800">
              {isExpanded ? 'Hide details' : 'Show details'}
            </span>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-stone-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-stone-500" />
            )}
          </button>

          {/* Expanded Drawer Details & Actions */}
          {isExpanded && (
            <div className="mt-2.5 p-3.5 bg-stone-50 rounded-2xl border border-stone-200 text-xs space-y-3">
              {/* Base Recipe & Ingredients */}
              {experiment.baseIngredients && experiment.baseIngredients.length > 0 ? (
                <div>
                  <span className="font-mono uppercase font-bold text-stone-400 text-[10px] block mb-1">
                    Base Ingredients
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {experiment.baseIngredients.map((item, idx) => {
                      const parsed = parseIngredient(item);
                      return (
                        <span 
                          key={idx} 
                          className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-white border border-stone-200 rounded-md text-[11px] shadow-2xs"
                        >
                          <span className="font-medium text-stone-800">{parsed.name}</span>
                          {parsed.amount && (
                            <span className="font-bold text-[#1b2110] bg-[#DCE788] px-1.5 py-0.2 rounded font-mono text-[10px]">
                              {parsed.amount}
                            </span>
                          )}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ) : experiment.base ? (
                <div>
                  <span className="font-mono uppercase font-bold text-stone-400 text-[10px] block mb-0.5">
                    Base Formulation
                  </span>
                  <p className="text-stone-700 font-medium">
                    {experiment.base}
                  </p>
                </div>
              ) : null}

              {/* Mix-Ins */}
              {experiment.mixIns && experiment.mixIns.length > 0 && (
                <div>
                  <span className="font-mono uppercase font-bold text-stone-400 text-[10px] block mb-1">
                    Mix-Ins
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {experiment.mixIns.map((m, i) => (
                      <span 
                        key={i} 
                        className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-white border border-stone-200 rounded-md text-[11px] shadow-2xs"
                      >
                        <span className="font-medium text-stone-800">{m.name}</span>
                        {m.amount && (
                          <span className="font-bold text-[#1b2110] bg-[#DCE788] px-1.5 py-0.2 rounded font-mono text-[10px]">
                            {m.amount}
                          </span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Spin Diagnostics */}
              <div className="pt-2 border-t border-stone-200 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-stone-600">
                  <span className="text-stone-500">Re-spin needed:</span>
                  {experiment.reSpinNeeded ? (
                    <span className="text-[#292524] font-semibold flex items-center gap-1">
                      <RotateCw className="w-3 h-3" /> Yes ({experiment.reSpinCount}x)
                    </span>
                  ) : (
                    <span className="text-[#292524] font-semibold">
                      No (1 spin perfect)
                    </span>
                  )}
                </div>
                {experiment.reSpinNotes && (
                  <p className="text-[11px] text-stone-500 italic bg-white/70 p-2 rounded-lg border border-stone-200/60">
                    "{experiment.reSpinNotes}"
                  </p>
                )}
              </div>

              {/* Next Batch Ideas */}
              {experiment.nextTime && (
                <div className="bg-amber-50/80 border border-amber-200/80 p-2.5 rounded-xl text-[11px] text-amber-900">
                  <span className="font-bold block mb-0.5 text-amber-950 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-600" /> Next Experiment:
                  </span>
                  <p className="leading-snug">{experiment.nextTime}</p>
                </div>
              )}

              {/* Friends / Tasters */}
              {experiment.friends && experiment.friends.length > 0 && (
                <div className="flex items-center gap-1.5 text-[11px] text-stone-600 pt-1 border-t border-stone-200">
                  <Users className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span className="text-stone-500">Tasted with:</span>
                  <span className="font-medium text-stone-800">{experiment.friends.join(', ')}</span>
                </div>
              )}

              {/* Quick Card Action Buttons */}
              <div className="pt-2 border-t border-stone-200 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => onSelect(experiment)}
                  className="px-2.5 py-1.5 rounded-lg bg-white border border-stone-200 text-stone-700 hover:bg-stone-100 font-medium text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>View Details</span>
                </button>

                <button
                  type="button"
                  onClick={() => onShare(experiment)}
                  title="Share experiment"
                  className="px-2.5 py-1.5 rounded-lg bg-white border border-stone-200 text-stone-700 hover:bg-stone-100 font-medium text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Row 6: Card Actions (Edit & Remove) */}
        <div className="grid grid-cols-2 gap-2 pt-0.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(experiment);
            }}
            id={`card-edit-btn-${experiment.id}`}
            className="w-full py-2 px-3 rounded-xl bg-[#C5CC84] hover:bg-[#B5BD75] text-[#1b2110] text-sm font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs active:scale-98"
          >
            <Edit3 className="w-4 h-4 text-[#1b2110]" />
            <span>Edit</span>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(experiment);
            }}
            id={`card-remove-btn-${experiment.id}`}
            className="w-full py-2 px-3 rounded-xl bg-white hover:bg-red-50 border border-stone-300 hover:border-red-300 text-stone-700 hover:text-red-700 text-sm font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs active:scale-98"
          >
            <Trash2 className="w-4 h-4" />
            <span>Remove</span>
          </button>
        </div>
      </div>
    </div>
  );
};
