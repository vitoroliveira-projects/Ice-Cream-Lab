import React from 'react';
import { 
  X, 
  Share2, 
  Edit3, 
  Trash2, 
  Star, 
  RotateCw, 
  Clock, 
  Calendar,
  Layers,
  FlaskConical,
  Sparkles,
  Users
} from 'lucide-react';
import { Experiment, parseIngredient } from '../types';
import { formatCardDate } from './ExperimentCard';

interface ExperimentModalProps {
  experiment: Experiment;
  onClose: () => void;
  onShare: (experiment: Experiment) => void;
  onEdit: (experiment: Experiment) => void;
  onDelete: (experiment: Experiment) => void;
}

const DEFAULT_PHOTO = 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80';

export const ExperimentModal: React.FC<ExperimentModalProps> = ({
  experiment,
  onClose,
  onShare,
  onEdit,
  onDelete,
}) => {
  const formattedDate = formatCardDate(experiment.date);
  const freezeHours = experiment.freezeTimeHours ?? 22;
  const photo = experiment.photoUrl || DEFAULT_PHOTO;
  const overallScore = (experiment.ratings?.overall ?? 8.5).toFixed(1);

  // Verdict style badge matching the card
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
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div 
        id={`experiment-detail-modal-${experiment.id}`}
        className="bg-white rounded-3xl max-w-xl w-full border border-stone-200 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Scrollable Container (Hero image & Content body scroll together) */}
        <div className="overflow-y-auto flex-1 bg-white">
          {/* Hero Image (non-sticky, scrolls with content) */}
          <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-stone-100">
            <img
              src={photo}
              alt={experiment.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />

            {/* Top Gradient Overlay: Date, Freeze Time & Modal Controls */}
            <div className="absolute top-0 inset-x-0 bg-gradient-to-b from-black/75 via-black/35 to-transparent pt-3.5 pb-8 px-4 sm:px-5 flex items-center justify-between text-white text-xs font-sans">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 drop-shadow-sm font-medium">
                  <Calendar className="w-3.5 h-3.5 text-white/90" />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center gap-1.5 drop-shadow-sm font-medium">
                  <Clock className="w-3.5 h-3.5 text-white/90" />
                  <span>{freezeHours}h freeze</span>
                </div>
              </div>

              {/* Top Right Quick Controls */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onShare(experiment)}
                  title="Share experiment"
                  className="w-7 h-7 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onEdit(experiment)}
                  title="Edit experiment"
                  className="w-7 h-7 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={onClose}
                  title="Close modal"
                  className="w-7 h-7 rounded-full bg-white/80 hover:bg-white text-stone-900 flex items-center justify-center transition-colors cursor-pointer shadow-xs ml-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Content Body */}
          <div className="p-6 sm:p-7 space-y-5 bg-white">
          {/* Row 1: Experiment Title & Score */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-sans font-bold text-2xl text-stone-900 leading-tight">
                {experiment.title || 'Experiment Title'}
              </h2>
              {experiment.machineModel && (
                <span className="text-[11px] text-stone-400 font-mono mt-1 block">
                  {experiment.machineModel}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-stone-900 font-bold text-lg shrink-0 pt-0.5">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              <span>{overallScore}/10</span>
            </div>
          </div>

          {/* Row 2: Spin Program Badge & Verdict Tag */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-block bg-[#F8BFB9] text-[#1c1917] text-sm font-bold px-3.5 py-1 rounded-full">
              {experiment.program || 'Spin program'}
            </span>
            {experiment.verdict && (
              <span className="inline-block text-sm font-bold px-3 py-1 rounded-full bg-[#DF9260] text-white">
                {experiment.verdict}
              </span>
            )}
            <span className="text-sm text-stone-500 font-medium ml-auto">
              Experiment #{experiment.number}
            </span>
          </div>

          {/* Row 3: 3 Score Boxes (Flavour, Creamy, Texture) in #F4ECE1 */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="bg-[#F4ECE1] rounded-2xl py-3 px-2 text-center flex flex-col justify-center">
              <span className="text-sm text-stone-700 font-semibold mb-1">
                Flavour
              </span>
              <span className="text-base sm:text-lg text-stone-900 font-bold leading-none">
                {(experiment.ratings?.flavour ?? 0).toFixed(1)}/10
              </span>
            </div>

            <div className="bg-[#F4ECE1] rounded-2xl py-3 px-2 text-center flex flex-col justify-center">
              <span className="text-sm text-stone-700 font-semibold mb-1">
                Creamy
              </span>
              <span className="text-base sm:text-lg text-stone-900 font-bold leading-none">
                {(experiment.ratings?.creaminess ?? 0).toFixed(1)}/10
              </span>
            </div>

            <div className="bg-[#F4ECE1] rounded-2xl py-3 px-2 text-center flex flex-col justify-center">
              <span className="text-sm text-stone-700 font-semibold mb-1">
                Texture
              </span>
              <span className="text-base sm:text-lg text-stone-900 font-bold leading-none">
                {(experiment.ratings?.texture ?? 0).toFixed(1)}/10
              </span>
            </div>
          </div>

          {/* Row 4: Comments Box in #F4ECE1 */}
          <div className="bg-[#F4ECE1] rounded-2xl p-4 text-stone-800 text-sm leading-relaxed">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
              Comments & Tasting Notes
            </span>
            <p className="italic font-medium">
              “{experiment.notes || 'No comments recorded for this experiment.'}”
            </p>
          </div>

          {/* Row 5: Verdict Box */}
          <div className="bg-white border border-stone-300 rounded-2xl p-3.5 flex items-center justify-between">
            <span className="font-medium text-stone-800 text-sm">
              My verdict: <strong className="font-semibold">{experiment.verdict}</strong>
            </span>
            <span className={`px-2.5 py-1 rounded-full border text-xs font-bold ${getVerdictStyle(experiment.verdict)}`}>
              {experiment.verdict}
            </span>
          </div>

          {/* Base Formulation & Ingredients */}
          {(experiment.base || (experiment.baseIngredients && experiment.baseIngredients.length > 0)) && (
            <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/80 space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-500">
                <FlaskConical className="w-3.5 h-3.5 text-stone-600" />
                <span>Base Formulation</span>
              </div>
              {experiment.base && (
                <p className="text-sm font-medium text-stone-800 leading-relaxed">
                  {experiment.base}
                </p>
              )}
              {experiment.baseIngredients && experiment.baseIngredients.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                    Ingredients & Proportions
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {experiment.baseIngredients.map((item, i) => {
                      const parsed = parseIngredient(item);
                      return (
                        <div 
                          key={i}
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-stone-200 rounded-xl text-xs shadow-2xs"
                        >
                          <span className="font-semibold text-stone-800">{parsed.name}</span>
                          {parsed.amount && (
                            <span className="font-bold text-[#1b2110] bg-[#DCE788] px-2 py-0.5 rounded-md font-mono text-[11px]">
                              {parsed.amount}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mix-Ins */}
          {experiment.mixIns && experiment.mixIns.length > 0 && (
            <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/80 space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-500">
                <Layers className="w-3.5 h-3.5 text-stone-600" />
                <span>Mix-Ins & Textures</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {experiment.mixIns.map((item, idx) => (
                  <div 
                    key={idx}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-stone-200 rounded-xl text-xs shadow-2xs"
                  >
                    <span className="font-semibold text-stone-800">{item.name}</span>
                    {item.amount && (
                      <span className="font-bold text-[#1b2110] bg-[#DCE788] px-2 py-0.5 rounded-md font-mono text-[11px]">
                        {item.amount}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Process & Re-spin Observation */}
          <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/80 space-y-2.5 text-xs">
            <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-stone-500">
              <RotateCw className="w-3.5 h-3.5 text-stone-600" />
              <span>Ninja Process Details</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
              <div className="p-2.5 bg-white rounded-xl border border-stone-200">
                <span className="text-[10px] text-stone-400 font-bold block mb-0.5">
                  First Spin
                </span>
                <div className="flex items-center text-amber-500">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3.5 h-3.5 ${
                        s <= (experiment.firstSpinRating ?? 4)
                          ? 'fill-amber-400 text-amber-500'
                          : 'text-stone-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="p-2.5 bg-white rounded-xl border border-stone-200">
                <span className="text-[10px] text-stone-400 font-bold block mb-0.5">
                  Re-spin Needed
                </span>
                <span className={`font-bold ${experiment.reSpinNeeded ? 'text-orange-700' : 'text-emerald-700'}`}>
                  {experiment.reSpinNeeded ? `Yes (${experiment.reSpinCount}x)` : 'No (1 spin)'}
                </span>
              </div>

              <div className="p-2.5 bg-white rounded-xl border border-stone-200 col-span-2 sm:col-span-1">
                <span className="text-[10px] text-stone-400 font-bold block mb-0.5">
                  Freeze Time
                </span>
                <span className="font-bold text-stone-800">
                  {freezeHours} hours
                </span>
              </div>
            </div>

            {experiment.reSpinNotes && (
              <p className="text-stone-600 bg-white p-2.5 rounded-xl border border-stone-200 text-xs">
                <strong className="font-semibold text-stone-800">Re-spin Note:</strong> {experiment.reSpinNotes}
              </p>
            )}
          </div>

          {/* Next Time Tweaks (if available) */}
          {experiment.nextTime && (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 text-xs space-y-1">
              <span className="font-bold uppercase text-amber-900 text-[10px] tracking-wider block">
                Changes For Next Experiment
              </span>
              <p className="text-stone-800 italic">
                “{experiment.nextTime}”
              </p>
            </div>
          )}

          {/* Friends / Guest Tasters (if available) */}
          {experiment.friends && experiment.friends.length > 0 && (
            <div className="flex items-center gap-2 text-xs text-stone-600 px-1">
              <Users className="w-3.5 h-3.5 text-stone-400" />
              <span>Tasters: <strong>{experiment.friends.join(', ')}</strong></span>
            </div>
          )}
        </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={() => onDelete(experiment)}
            id="modal-delete-btn"
            className="px-3 py-2 rounded-xl text-xs font-medium text-stone-400 hover:text-red-700 hover:bg-red-50 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Experiment</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onShare(experiment)}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-stone-100 border border-stone-300 text-stone-800 text-sm font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>

            <button
              type="button"
              onClick={() => onEdit(experiment)}
              id="modal-edit-btn"
              className="px-5 py-2 rounded-xl bg-[#C5CC84] hover:bg-[#B5BD75] text-[#1b2110] text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Edit3 className="w-4 h-4 text-[#1b2110]" />
              <span>Edit Experiment</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
