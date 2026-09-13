import React, { useState, useMemo } from 'react';
import { 
  X, 
  Star, 
  Upload, 
  Check, 
  Clock,
  Calendar,
  RotateCw,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Plus,
  Sparkles,
  Trash2,
  Link as LinkIcon
} from 'lucide-react';
import { 
  Experiment, 
  NinjaProgram, 
  VerdictLabel,
  BaseIngredientItem,
  parseIngredient
} from '../types';
import { 
  COMMON_INGREDIENTS, 
  CommonIngredientItem 
} from '../data/commonIngredients';

interface ExperimentFormModalProps {
  initialExperiment?: Experiment | null;
  nextNumber: number;
  onSave: (experiment: Experiment) => void;
  onClose: () => void;
}

const NINJA_PROGRAMS: NinjaProgram[] = [
  'Ice Cream',
  'Lite Ice Cream',
  'Gelato',
  'Sorbet',
  'Milkshake',
  'Mix-In',
  'Slushi',
  'Italian Ice',
];

export const ExperimentFormModal: React.FC<ExperimentFormModalProps> = ({
  initialExperiment,
  nextNumber,
  onSave,
  onClose,
}) => {
  const isEditing = !!initialExperiment;

  // Basic Info
  const [title, setTitle] = useState(initialExperiment?.title ?? '');
  const [date, setDate] = useState(
    initialExperiment?.date ?? new Date().toISOString().split('T')[0]
  );
  const [freezeHours, setFreezeHours] = useState<number>(
    initialExperiment?.freezeTimeHours ?? 24
  );
  const [program, setProgram] = useState<NinjaProgram>(
    initialExperiment?.program ?? 'Ice Cream'
  );

  // Photo (empty string if creating new)
  const [photoUrl, setPhotoUrl] = useState(
    initialExperiment?.photoUrl ?? ''
  );
  const [customPhotoInput, setCustomPhotoInput] = useState('');

  // 3 Core Ratings (1 - 10)
  const [flavour, setFlavour] = useState<number>(
    initialExperiment?.ratings?.flavour ?? 8.0
  );
  const [creamy, setCreamy] = useState<number>(
    initialExperiment?.ratings?.creaminess ?? 8.0
  );
  const [texture, setTexture] = useState<number>(
    initialExperiment?.ratings?.texture ?? 8.0
  );

  // Comments / Notes
  const [comments, setComments] = useState(initialExperiment?.notes ?? '');

  // Calculate live overall score
  const calculatedOverall = Number(
    (flavour * 0.4 + creamy * 0.35 + texture * 0.25).toFixed(1)
  );

  // Auto-calculated verdict
  const autoVerdict = (score: number): VerdictLabel => {
    if (score >= 9.0) return 'Perfect';
    if (score >= 8.0) return 'Very good';
    if (score >= 7.0) return 'Make again';
    return 'Needs work';
  };

  const [verdict, setVerdict] = useState<VerdictLabel>(
    initialExperiment?.verdict ?? autoVerdict(calculatedOverall)
  );

  // Optional extra details toggle
  const [showAdvanced, setShowAdvanced] = useState(
    Boolean(initialExperiment?.base || initialExperiment?.reSpinNeeded)
  );

  // Base ingredients with separated item & proportion/quantity: default to empty [] when adding new
  const [selectedIngredients, setSelectedIngredients] = useState<BaseIngredientItem[]>(() => {
    if (initialExperiment?.baseIngredients && initialExperiment.baseIngredients.length > 0) {
      return initialExperiment.baseIngredients.map(parseIngredient);
    }
    if (initialExperiment?.base) {
      return initialExperiment.base
        .split(/[,+]/)
        .map((s) => parseIngredient(s.trim()))
        .filter((i) => i.name);
    }
    return [];
  });

  const [baseCategoryFilter, setBaseCategoryFilter] = useState<'All' | 'Dairy & Liquids' | 'Sweeteners' | 'Stabilizers & Flavors' | 'Fruits & Mixes'>('All');
  const [mixInsText, setMixInsText] = useState(
    initialExperiment?.mixIns?.map((m) => m.name).join(', ') ?? ''
  );
  const [reSpinNeeded, setReSpinNeeded] = useState(
    initialExperiment?.reSpinNeeded ?? false
  );
  const [reSpinNotes, setReSpinNotes] = useState(
    initialExperiment?.reSpinNotes ?? ''
  );

  const filteredCommonIngredients = useMemo(() => {
    if (baseCategoryFilter === 'All') return COMMON_INGREDIENTS;
    return COMMON_INGREDIENTS.filter(
      (ing) => ing.category === baseCategoryFilter
    );
  }, [baseCategoryFilter]);

  const [activeAddMenuIndex, setActiveAddMenuIndex] = useState<number | null>(null);
  const [customUnitInputs, setCustomUnitInputs] = useState<{ [key: number]: string }>({});
  const [customIngredientInput, setCustomIngredientInput] = useState('');

  const handleToggleCommonIngredient = (item: CommonIngredientItem) => {
    const existingIndex = selectedIngredients.findIndex(
      (ing) => ing.name.toLowerCase() === item.name.toLowerCase()
    );
    if (existingIndex >= 0) {
      setSelectedIngredients((prev) => prev.filter((_, idx) => idx !== existingIndex));
    } else {
      setSelectedIngredients((prev) => [
        ...prev,
        { name: item.name, amount: item.defaultAmount || '1 cup' },
      ]);
    }
  };

  const handleUpdateIngredientAmount = (index: number, newAmount: string) => {
    setSelectedIngredients((prev) =>
      prev.map((ing, idx) => (idx === index ? { ...ing, amount: newAmount } : ing))
    );
  };

  const handleAppendIngredientAmount = (index: number, extra: string) => {
    setSelectedIngredients((prev) =>
      prev.map((ing, idx) => {
        if (idx !== index) return ing;
        const current = ing.amount.trim();
        const newAmount = current ? `${current} + ${extra}` : extra;
        return { ...ing, amount: newAmount };
      })
    );
  };

  const handleSetCustomIngredientAmount = (index: number, val: string) => {
    if (!val.trim()) return;
    setSelectedIngredients((prev) =>
      prev.map((ing, idx) => (idx === index ? { ...ing, amount: val.trim() } : ing))
    );
    setCustomUnitInputs((prev) => ({ ...prev, [index]: '' }));
    setActiveAddMenuIndex(null);
  };

  const handleUpdateIngredientName = (index: number, newName: string) => {
    setSelectedIngredients((prev) =>
      prev.map((ing, idx) => (idx === index ? { ...ing, name: newName } : ing))
    );
  };

  const handleRemoveIngredient = (index: number) => {
    setSelectedIngredients((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleAddCustomIngredient = (name?: string) => {
    const trimmed = typeof name === 'string' ? name.trim() : '';
    setSelectedIngredients((prev) => [
      ...prev,
      { name: trimmed, amount: '1 cup' },
    ]);
    if (trimmed) {
      setCustomIngredientInput('');
    }
  };

  const handleClearAllIngredients = () => {
    setSelectedIngredients([]);
  };

  // Handle local file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setPhotoUrl(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please enter a title for your experiment.');
      return;
    }

    const parsedMixIns = mixInsText
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
      .map((name) => ({
        name,
        type: 'dry-crunch' as const,
      }));

    const validBaseIngredients = selectedIngredients.filter((i) => i.name.trim().length > 0);
    const formattedBaseFormula = validBaseIngredients
      .map((i) => (i.amount.trim() ? `${i.amount.trim()} ${i.name.trim()}` : i.name.trim()))
      .join(' + ');

    const experimentToSave: Experiment = {
      id: initialExperiment?.id ?? `exp-${Date.now()}`,
      number: initialExperiment?.number ?? nextNumber,
      date,
      title: title.trim(),
      base: formattedBaseFormula || '',
      baseIngredients: validBaseIngredients,
      mixIns: parsedMixIns,
      machineModel: initialExperiment?.machineModel ?? 'Ninja CREAMi Deluxe NC501',
      program,
      freezeTimeHours: Number(freezeHours),
      firstSpinRating: initialExperiment?.firstSpinRating ?? 4,
      reSpinNeeded,
      reSpinCount: reSpinNeeded ? 1 : 0,
      reSpinNotes: reSpinNeeded ? reSpinNotes.trim() : undefined,
      ratings: {
        flavour: Number(flavour),
        creaminess: Number(creamy),
        texture: Number(texture),
        creativity: initialExperiment?.ratings?.creativity ?? 8.0,
        wouldMakeAgain: initialExperiment?.ratings?.wouldMakeAgain ?? 8.5,
        overall: calculatedOverall,
      },
      verdict,
      notes: comments.trim(),
      nextTime: initialExperiment?.nextTime,
      photoUrl,
    };

    onSave(experimentToSave);
  };

  const categories = ['All', 'Classic', 'Gelato', 'Sorbet', 'Mix-Ins'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div 
        id="experiment-form-modal"
        className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header matching dark side nav (#413d3e) */}
        <div className="bg-[#413d3e] px-6 py-3.5 text-white flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="min-w-0 pr-4">
            <h2 
              className="font-sans font-bold text-2xl text-white leading-tight truncate"
              title={title.trim() || (isEditing ? `Edit Experiment #${initialExperiment?.number}` : 'Adding a new experiment')}
            >
              {isEditing
                ? (title.trim() || `Edit Experiment #${initialExperiment?.number}`)
                : (title.trim() || 'Adding a new experiment')}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors cursor-pointer shadow-xs shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body - scrollable container with fixed footer */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden bg-white">
          <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Experiment Title */}
          <div>
            <label className="block text-sm font-bold text-stone-800 uppercase tracking-wider mb-1.5">
              Experiment Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Dutch Stroopwafel & Salted Caramel"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm font-medium focus:ring-2 focus:ring-[#8EA13E] focus:outline-hidden"
            />
          </div>

          {/* Date, Freeze time, Spin Program - Side by side and fully aligned */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3 items-start">
            {/* Date */}
            <div className="min-w-0">
              <label className="flex items-center gap-1.5 text-sm font-bold text-stone-700 uppercase tracking-wider mb-1.5 h-5">
                <Calendar className="w-4 h-4 text-stone-500 shrink-0" />
                <span className="truncate">Date</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="h-10 w-full px-2 sm:px-3 rounded-xl border border-stone-300 text-sm text-stone-900 bg-stone-50 focus:bg-white focus:ring-2 focus:ring-[#8EA13E] focus:outline-hidden box-border"
              />
            </div>

            {/* Freeze Hours */}
            <div className="min-w-0">
              <label className="flex items-center gap-1.5 text-sm font-bold text-stone-700 uppercase tracking-wider mb-1.5 h-5">
                <Clock className="w-4 h-4 text-stone-500 shrink-0" />
                <span className="truncate">Freeze Time</span>
              </label>
              <div className="relative flex items-center">
                <input
                  type="number"
                  min="8"
                  max="72"
                  value={freezeHours}
                  onChange={(e) => setFreezeHours(Number(e.target.value))}
                  className="h-10 w-full pl-2.5 sm:pl-3 pr-10 sm:pr-12 rounded-xl border border-stone-300 text-sm text-stone-900 bg-stone-50 focus:bg-white focus:ring-2 focus:ring-[#8EA13E] focus:outline-hidden box-border"
                />
                <span className="absolute right-2 sm:right-3 text-sm text-stone-400 font-mono pointer-events-none">
                  hrs
                </span>
              </div>
            </div>

            {/* Program */}
            <div className="min-w-0">
              <label className="flex items-center gap-1.5 text-sm font-bold text-stone-700 uppercase tracking-wider mb-1.5 h-5">
                <RotateCw className="w-4 h-4 text-stone-500 shrink-0" />
                <span className="truncate">Program</span>
              </label>
              <select
                value={program}
                onChange={(e) => setProgram(e.target.value as NinjaProgram)}
                className="h-10 w-full px-2 sm:px-3 rounded-xl border border-stone-300 text-sm text-stone-900 bg-stone-50 focus:bg-white focus:ring-2 focus:ring-[#8EA13E] focus:outline-hidden cursor-pointer box-border"
              >
                {NINJA_PROGRAMS.map((prog) => (
                  <option key={prog} value={prog}>
                    {prog}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Photo: Two options (Upload photo or Paste custom image link) */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-stone-800 uppercase tracking-wider">
              Photo
            </label>

            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Preview Thumbnail */}
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0 shadow-xs flex items-center justify-center relative group">
                {photoUrl ? (
                  <>
                    <img
                      src={photoUrl}
                      alt="Experiment Preview"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setPhotoUrl('')}
                      className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-xs font-semibold"
                      title="Remove photo"
                    >
                      Remove
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center text-stone-400 p-1 text-center">
                    <ImageIcon className="w-6 h-6 stroke-[1.5]" />
                    <span className="text-[10px] font-medium leading-tight mt-1">No photo</span>
                  </div>
                )}
              </div>

              {/* Two Options: Upload or Link */}
              <div className="flex-1 w-full space-y-2.5">
                <div className="flex items-center gap-3">
                  {/* Option 1: Upload photo */}
                  <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-100 text-stone-800 text-sm font-semibold cursor-pointer transition-colors shadow-2xs">
                    <Upload className="w-4 h-4 text-stone-600" />
                    <span>Upload photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  <span className="text-xs text-stone-400 uppercase tracking-wider font-bold">or</span>
                  <span className="text-xs text-stone-500 font-medium">paste image URL below</span>
                </div>

                {/* Option 2: Paste custom image link */}
                <div className="flex items-center gap-1.5">
                  <div className="relative flex-1">
                    <LinkIcon className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="url"
                      placeholder="Paste image link (e.g. https://...)"
                      value={customPhotoInput}
                      onChange={(e) => setCustomPhotoInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (customPhotoInput.trim()) {
                            setPhotoUrl(customPhotoInput.trim());
                            setCustomPhotoInput('');
                          }
                        }
                      }}
                      className="w-full pl-9 pr-3 py-1.5 text-sm border border-stone-300 rounded-lg bg-white text-stone-800 focus:ring-1 focus:ring-[#8EA13E] focus:outline-hidden"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (customPhotoInput.trim()) {
                        setPhotoUrl(customPhotoInput.trim());
                        setCustomPhotoInput('');
                      }
                    }}
                    disabled={!customPhotoInput.trim()}
                    className="px-3 py-1.5 bg-[#1B2110] text-[#DCE788] rounded-lg text-sm font-semibold hover:bg-[#2c351a] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sensory Ratings (Flavour, Creamy, Texture) in #F8F5EC */}
          <div className="bg-[#F8F5EC] p-4 rounded-2xl border border-stone-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-stone-800 uppercase tracking-wider">
                Sensory Ratings (1 – 10)
              </span>
              <div className="flex items-center gap-1 font-bold text-stone-900 text-sm">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>Overall: {calculatedOverall}/10</span>
              </div>
            </div>

            {/* 3 Sliders matching the 3 Card boxes */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Flavour */}
              <div className="bg-white p-3 rounded-xl border border-stone-200">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-bold text-stone-700">Flavour</span>
                  <span className="font-bold text-stone-900">{flavour.toFixed(1)}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.5"
                  value={flavour}
                  onChange={(e) => setFlavour(Number(e.target.value))}
                  className="w-full accent-[#8EA13E] cursor-pointer"
                />
              </div>

              {/* Creamy */}
              <div className="bg-white p-3 rounded-xl border border-stone-200">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-bold text-stone-700">Creamy</span>
                  <span className="font-bold text-stone-900">{creamy.toFixed(1)}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.5"
                  value={creamy}
                  onChange={(e) => setCreamy(Number(e.target.value))}
                  className="w-full accent-[#8EA13E] cursor-pointer"
                />
              </div>

              {/* Texture */}
              <div className="bg-white p-3 rounded-xl border border-stone-200">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-bold text-stone-700">Texture</span>
                  <span className="font-bold text-stone-900">{texture.toFixed(1)}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.5"
                  value={texture}
                  onChange={(e) => setTexture(Number(e.target.value))}
                  className="w-full accent-[#8EA13E] cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Comments Box */}
          <div>
            <label className="block text-sm font-bold text-stone-800 uppercase tracking-wider mb-1.5">
              “Comments” / Tasting Notes
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Absolute crowd pleaser! Chewy caramel pockets with great sea salt balance."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm leading-relaxed focus:ring-2 focus:ring-[#8EA13E] focus:outline-hidden"
            />
          </div>

          {/* Verdict Selector */}
          <div>
            <label className="block text-sm font-bold text-stone-800 uppercase tracking-wider mb-1.5">
              My Verdict
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['Needs work', 'Make again', 'Very good', 'Perfect'] as VerdictLabel[]).map((v) => {
                const isSelected = verdict === v;
                return (
                  <button
                    type="button"
                    key={v}
                    onClick={() => setVerdict(v)}
                    className={`py-2 px-3 rounded-xl text-sm font-bold border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {v}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Optional formulation & details accordion */}
          <div className="pt-2 border-t border-stone-200">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-sm text-stone-700 hover:text-stone-950 font-semibold flex items-center justify-between w-full py-1 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-stone-800 text-sm">Base Formulation, Mix-Ins & Re-Spin</span>
                <span className="text-sm bg-[#8EA13E]/20 text-[#3f4a14] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 border border-[#8EA13E]/30">
                  <Sparkles className="w-3.5 h-3.5 text-[#55631b]" />
                  {selectedIngredients.length} Ingredients
                </span>
              </div>
              {showAdvanced ? <ChevronUp className="w-4 h-4 text-stone-500" /> : <ChevronDown className="w-4 h-4 text-stone-500" />}
            </button>

            {showAdvanced && (
              <div className="mt-3 space-y-4 p-4 bg-stone-50 rounded-2xl border border-stone-200">
                {/* 1. Select the ingredient: Common Ingredients & Custom Ingredient */}
                <div className="space-y-3 bg-white p-4 rounded-xl border border-stone-200">
                  <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-stone-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#1b2110] text-[#DCE788] text-xs font-bold">
                          1
                        </span>
                        <span className="text-sm font-bold text-stone-800 uppercase tracking-wider">
                          Select the ingredient
                        </span>
                      </div>
                      <span className="text-sm text-stone-500 mt-0.5 block">
                        Choose ingredients from the list or add custom ingredient names
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      {(['All', 'Dairy & Liquids', 'Sweeteners', 'Stabilizers & Flavors', 'Fruits & Mixes'] as const).map((cat) => (
                        <button
                          type="button"
                          key={cat}
                          onClick={() => setBaseCategoryFilter(cat)}
                          className={`text-sm px-3 py-1 rounded-full transition-colors cursor-pointer ${
                            baseCategoryFilter === cat
                              ? 'bg-[#1b2110] text-[#DCE788] font-bold'
                              : 'bg-stone-200 text-stone-700 hover:bg-stone-300 font-medium'
                          }`}
                        >
                          {cat === 'Stabilizers & Flavors' ? 'Stabilizers' : cat === 'Fruits & Mixes' ? 'Fruits' : cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Common Ingredients chips */}
                  <div className="flex flex-wrap gap-2 p-2 max-h-44 overflow-y-auto">
                    {filteredCommonIngredients.map((item) => {
                      const isSelected = selectedIngredients.some(
                        (ing) => ing.name.toLowerCase() === item.name.toLowerCase()
                      );
                      return (
                        <button
                          type="button"
                          key={item.id}
                          onClick={() => handleToggleCommonIngredient(item)}
                          className={`text-sm px-3 py-1.5 rounded-xl border flex items-center gap-2 transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#1b2110] text-[#DCE788] border-[#1b2110] font-semibold shadow-2xs'
                              : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100 hover:border-stone-300'
                          }`}
                          title={`Click to ${isSelected ? 'remove' : 'select'} ${item.name}`}
                        >
                          <span className="text-sm font-semibold">{item.name}</span>
                          <span
                            className={`text-sm font-bold flex items-center gap-1 px-2 py-0.5 rounded-md ${
                              isSelected
                                ? 'bg-white/15 text-[#DCE788]'
                                : 'bg-[#8EA13E]/20 text-[#3f4a14]'
                            }`}
                          >
                            {isSelected ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Selected</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-3.5 h-3.5" />
                                <span>Select</span>
                              </>
                            )}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom ingredient input at the same level as Select the ingredient */}
                  <div className="pt-2 border-t border-stone-100">
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={customIngredientInput}
                          onChange={(e) => setCustomIngredientInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              if (customIngredientInput.trim()) {
                                handleAddCustomIngredient(customIngredientInput);
                              }
                            }
                          }}
                          placeholder="Or add a custom ingredient (e.g. Oat milk, Coconut cream, Honey)"
                          className="w-full pl-3 pr-20 py-1.5 text-sm bg-stone-50 border border-stone-300 rounded-lg text-stone-800 placeholder-stone-400 focus:bg-white focus:ring-1 focus:ring-[#8EA13E] focus:outline-hidden"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddCustomIngredient(customIngredientInput)}
                          disabled={!customIngredientInput.trim()}
                          className="absolute right-1 top-1 bottom-1 px-3 bg-[#1b2110] text-[#DCE788] text-xs font-bold rounded-md hover:bg-[#2c351a] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-opacity flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Set the quantity: Selected Ingredients & Amounts */}
                <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#1b2110] text-[#DCE788] text-xs font-bold">
                        2
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-stone-800 uppercase tracking-wider">
                            Set the quantity
                          </span>
                        </div>
                        <span className="text-sm text-stone-500 block">
                          Select a pre-set quantity or add a new custom value
                        </span>
                      </div>
                    </div>

                    {selectedIngredients.length > 0 && (
                      <button
                        type="button"
                        onClick={handleClearAllIngredients}
                        className="text-sm text-red-600 hover:text-red-700 font-semibold cursor-pointer transition-colors px-2 py-1 rounded hover:bg-red-50"
                        title="Clear all selected ingredients"
                      >
                        Clear All
                      </button>
                    )}
                  </div>

                  {selectedIngredients.length === 0 ? (
                    <div className="p-4 text-center border-2 border-dashed border-stone-200 rounded-xl bg-stone-50 text-stone-500 text-sm">
                      No ingredients selected yet. Select from the common ingredients or enter a custom ingredient in step 1.
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {selectedIngredients.map((item, index) => (
                        <div
                          key={index}
                          className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 hover:border-stone-300 transition-colors space-y-2.5"
                        >
                          {/* Line 1: Ingredient name input and remove button */}
                          <div className="flex items-center gap-2">
                            <div className="flex-1 min-w-0">
                              <label className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-1">
                                Ingredient
                              </label>
                              <input
                                type="text"
                                value={item.name}
                                onChange={(e) => handleUpdateIngredientName(index, e.target.value)}
                                placeholder="e.g. Whole milk, Heavy cream"
                                className="w-full px-2.5 py-1.5 text-sm font-semibold bg-white border border-stone-300 rounded-lg text-stone-800 focus:ring-1 focus:ring-[#8EA13E] focus:outline-hidden"
                              />
                            </div>

                            {/* Remove button */}
                            <button
                              type="button"
                              onClick={() => handleRemoveIngredient(index)}
                              className="self-end p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer shrink-0"
                              title="Remove ingredient"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Line 2: Under it, the quantity display, quick amount suggestions, and Add button */}
                          <div className="flex items-center justify-between gap-2 pt-1 border-t border-stone-200/60 flex-wrap sm:flex-nowrap">
                            <div className="flex items-center gap-2">
                              <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                                Quantity:
                              </label>
                              <span
                                className="inline-block px-2.5 py-1 bg-stone-200 text-stone-800 rounded-lg text-sm font-mono font-bold border border-stone-300"
                                title="Current quantity"
                              >
                                {item.amount || 'None'}
                              </span>
                            </div>

                            {/* Quick Amount Suggestion Buttons + 'Add' option for custom values & units */}
                            <div className="flex items-center gap-1 relative flex-wrap sm:flex-nowrap">
                              {['1 cup', '1/2 cup', '1 tbsp', '1 tsp'].map((quickAmt) => (
                                <button
                                  key={quickAmt}
                                  type="button"
                                  onClick={() => handleUpdateIngredientAmount(index, quickAmt)}
                                  className={`text-xs px-2 py-1 rounded border transition-colors cursor-pointer ${
                                    item.amount === quickAmt
                                      ? 'bg-[#1b2110] text-[#DCE788] border-[#1b2110] font-bold'
                                      : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-100'
                                  }`}
                                  title={`Set to ${quickAmt}`}
                                >
                                  {quickAmt}
                                </button>
                              ))}

                              {/* Option 'Add' - allows user to include other values (e.g. grams, ml, oz, etc.) */}
                              <div className="relative">
                                <button
                                  type="button"
                                  onClick={() => setActiveAddMenuIndex(activeAddMenuIndex === index ? null : index)}
                                  className={`text-xs px-2 py-1 rounded border transition-colors cursor-pointer flex items-center gap-0.5 ${
                                    activeAddMenuIndex === index
                                      ? 'bg-[#8EA13E] text-white border-[#8EA13E] font-bold'
                                      : 'bg-stone-100 text-stone-700 border-stone-300 hover:bg-stone-200 font-semibold'
                                  }`}
                                  title="Add other values or units (e.g. grams, ml, oz, etc.)"
                                >
                                  <Plus className="w-3 h-3" />
                                  <span>Add</span>
                                </button>

                                {activeAddMenuIndex === index && (
                                  <div className="absolute right-0 bottom-full mb-1.5 z-30 bg-white border border-stone-200 rounded-xl shadow-xl p-3 flex flex-col gap-2 min-w-[240px] w-64">
                                    <div className="flex items-center justify-between pb-1 border-b border-stone-100">
                                      <span className="text-sm font-bold uppercase text-stone-700">
                                        Include other value / unit
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => setActiveAddMenuIndex(null)}
                                        className="text-stone-400 hover:text-stone-600 text-sm px-1 cursor-pointer"
                                      >
                                        ✕
                                      </button>
                                    </div>

                                    {/* Custom input for other values (e.g. grams, etc.) */}
                                    <div className="flex gap-1.5">
                                      <input
                                        type="text"
                                        value={customUnitInputs[index] || ''}
                                        onChange={(e) =>
                                          setCustomUnitInputs((prev) => ({ ...prev, [index]: e.target.value }))
                                        }
                                        onKeyDown={(e) => {
                                          if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleSetCustomIngredientAmount(index, customUnitInputs[index] || '');
                                          }
                                        }}
                                        placeholder="e.g. 50g, 200ml, 2 pinches"
                                        className="flex-1 px-2.5 py-1 text-sm border border-stone-300 rounded-lg text-stone-800 focus:ring-1 focus:ring-[#8EA13E] focus:outline-hidden"
                                        autoFocus
                                      />
                                      <button
                                        type="button"
                                        onClick={() => handleSetCustomIngredientAmount(index, customUnitInputs[index] || '')}
                                        disabled={!customUnitInputs[index]?.trim()}
                                        className="px-2.5 py-1 bg-[#1b2110] text-[#DCE788] text-sm font-bold rounded-lg hover:bg-[#2c351a] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                                      >
                                        Set
                                      </button>
                                    </div>

                                    {/* Common unit presets */}
                                    <div>
                                      <span className="text-sm font-bold text-stone-500 uppercase tracking-wider block mb-1">
                                        Common Units & Amounts
                                      </span>
                                      <div className="grid grid-cols-3 gap-1">
                                        {['50g', '100g', '250g', '50ml', '100ml', '250ml', '1 pinch', '2 drops', '1 dash'].map((preset) => (
                                          <button
                                            key={preset}
                                            type="button"
                                            onClick={() => handleSetCustomIngredientAmount(index, preset)}
                                            className="text-center text-xs font-mono font-medium px-1.5 py-1 rounded bg-stone-50 border border-stone-200 hover:bg-stone-100 text-stone-700 transition-colors cursor-pointer"
                                          >
                                            {preset}
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 3. Mix-Ins */}
                <div>
                  <label className="block text-sm font-bold text-stone-800 mb-1">
                    Mix-Ins (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Chopped stroopwafel, Salted caramel swirl, Pistachio bits"
                    value={mixInsText}
                    onChange={(e) => setMixInsText(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm bg-white focus:ring-2 focus:ring-[#8EA13E] focus:outline-hidden"
                  />
                </div>

                {/* 5. Re-spin Details */}
                <div className="flex items-center gap-4 text-sm pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={reSpinNeeded}
                      onChange={(e) => setReSpinNeeded(e.target.checked)}
                      className="accent-[#8EA13E] w-4 h-4 rounded"
                    />
                    <span className="text-stone-800 font-bold text-sm">Needed Re-Spin?</span>
                  </label>

                  {reSpinNeeded && (
                    <input
                      type="text"
                      placeholder="e.g. Added 1 tbsp milk before re-spin"
                      value={reSpinNotes}
                      onChange={(e) => setReSpinNotes(e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-xl border border-stone-300 text-sm bg-white focus:ring-2 focus:ring-[#8EA13E] focus:outline-hidden"
                    />
                  )}
                </div>
              </div>
            )}
          </div>
          </div>

          {/* Action Buttons - Fixed at the bottom */}
          <div className="px-6 py-4 border-t border-stone-200 bg-stone-50/90 backdrop-blur-xs flex items-center justify-end gap-3 shrink-0 shadow-xs">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-stone-600 hover:text-stone-900 text-sm font-semibold cursor-pointer border border-transparent hover:bg-stone-200/50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#C5CC84] hover:bg-[#B5BD75] text-[#1b2110] font-bold text-sm shadow-xs transition-transform active:scale-98 cursor-pointer"
            >
              {isEditing ? 'Save Changes' : 'Save Experiment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
