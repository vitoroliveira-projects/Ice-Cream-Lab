/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Plus, 
  Search, 
  Download, 
  Upload, 
  X, 
  RotateCcw,
  SlidersHorizontal,
  Layers,
  Sparkles
} from 'lucide-react';
import { Experiment, NinjaProgram } from './types';
import { loadExperiments, saveExperiments } from './utils/storage';
import { STARTER_EXPERIMENTS } from './data/initialData';
import { ExperimentCard } from './components/ExperimentCard';
import { ExperimentModal } from './components/ExperimentModal';
import { ExperimentFormModal } from './components/ExperimentFormModal';
import { ShareCardModal } from './components/ShareCardModal';
import { DeleteConfirmationModal } from './components/DeleteConfirmationModal';

export default function App() {
  const [experiments, setExperiments] = useState<Experiment[]>(() => loadExperiments());

  // Modal states
  const [selectedExperiment, setSelectedExperiment] = useState<Experiment | null>(null);
  const [sharingExperiment, setSharingExperiment] = useState<Experiment | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingExperiment, setEditingExperiment] = useState<Experiment | null>(null);
  const [experimentToDelete, setExperimentToDelete] = useState<Experiment | null>(null);

  // Filter & Search Controls
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProgram, setSelectedProgram] = useState<string>('all');
  const [selectedVerdict, setSelectedVerdict] = useState<string>('all');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-persist experiments
  useEffect(() => {
    saveExperiments(experiments);
  }, [experiments]);

  const nextExperimentNumber = useMemo(() => {
    return experiments.length > 0
      ? Math.max(...experiments.map((e) => e.number)) + 1
      : 1;
  }, [experiments]);

  // Handlers
  const handleOpenNewExperiment = () => {
    setEditingExperiment(null);
    setIsFormOpen(true);
  };

  const handleEditExperiment = (exp: Experiment) => {
    setEditingExperiment(exp);
    setIsFormOpen(true);
    if (selectedExperiment?.id === exp.id) {
      setSelectedExperiment(null);
    }
  };

  const handleDeleteExperiment = (exp: Experiment) => {
    setExperimentToDelete(exp);
  };

  const handleConfirmDelete = () => {
    if (experimentToDelete) {
      setExperiments((prev) => prev.filter((e) => e.id !== experimentToDelete.id));
      if (selectedExperiment?.id === experimentToDelete.id) {
        setSelectedExperiment(null);
      }
      setExperimentToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setExperimentToDelete(null);
  };

  const handleSaveExperiment = (experiment: Experiment) => {
    setExperiments((prev) => {
      const exists = prev.some((e) => e.id === experiment.id);
      if (exists) {
        return prev.map((e) => (e.id === experiment.id ? experiment : e));
      }
      return [experiment, ...prev];
    });

    setIsFormOpen(false);
    setEditingExperiment(null);
  };

  // Export JSON
  const handleExportData = () => {
    const dataStr = JSON.stringify(experiments, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ice-cream-lab-journal-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (Array.isArray(imported)) {
          setExperiments(imported);
        } else {
          alert('Invalid format: expected a list of experiments.');
        }
      } catch {
        alert('Could not parse JSON file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleResetSampleData = () => {
    if (window.confirm('Reset journal with sample experiments?')) {
      setExperiments(STARTER_EXPERIMENTS);
    }
  };

  // Filtered experiments
  const filteredExperiments = useMemo(() => {
    return experiments.filter((exp) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const titleMatch = exp.title.toLowerCase().includes(q);
        const notesMatch = exp.notes ? exp.notes.toLowerCase().includes(q) : false;
        const baseMatch = exp.base ? exp.base.toLowerCase().includes(q) : false;
        if (!titleMatch && !notesMatch && !baseMatch) return false;
      }
      if (selectedProgram !== 'all' && exp.program !== selectedProgram) {
        return false;
      }
      if (selectedVerdict !== 'all' && exp.verdict !== selectedVerdict) {
        return false;
      }
      return true;
    });
  }, [experiments, searchQuery, selectedProgram, selectedVerdict]);

  const PROGRAMS: NinjaProgram[] = [
    'Ice Cream',
    'Lite Ice Cream',
    'Gelato',
    'Sorbet',
    'Milkshake',
    'Mix-In',
  ];

  return (
    <div className="min-h-screen bg-[#F8F4EA] flex flex-col md:flex-row text-stone-900 font-sans selection:bg-amber-200">
      {/* Hidden File Input for JSON import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        className="hidden"
      />

      {/* Left Sidebar (styled with background-color: #413d3e) */}
      <aside className="w-full md:w-64 lg:w-72 bg-[#413d3e] text-stone-100 p-6 sm:p-8 flex flex-col justify-between shrink-0 md:h-screen md:sticky md:top-0 z-20 shadow-xs">
        {/* Top: Branding & "Add new experiment" button */}
        <div className="space-y-6">
          <div>
            <h1 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Ice Cream Lab
            </h1>
          </div>

          <div>
            <button
              onClick={handleOpenNewExperiment}
              id="add-new-experiment-btn"
              className="w-full sm:w-auto px-5 py-2.5 bg-[#C5CC84] hover:bg-[#B5BD75] text-[#1b2110] rounded-full font-bold text-base shadow-xs transition-transform active:scale-98 cursor-pointer flex items-center justify-center gap-2"
            >
              <span className="text-[16px]">Add new experiment</span>
            </button>
          </div>

          {/* Simple Search & Filter */}
          <div className="pt-4 border-t border-white/15 space-y-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-stone-300 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search experiments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-7 py-2 rounded-full bg-white/10 hover:bg-white/15 focus:bg-white/20 text-sm text-white placeholder:text-stone-300 border border-white/15 focus:outline-hidden transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-300 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Program Quick Filter */}
            <div>
              <span className="block text-sm font-bold uppercase tracking-wider text-stone-200 mb-1.5">
                Programs
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setSelectedProgram('all')}
                  className={`text-sm px-3 py-1 rounded-full font-bold transition-colors cursor-pointer ${
                    selectedProgram === 'all'
                      ? 'bg-[#C5CC84] text-[#1b2110] shadow-2xs'
                      : 'bg-white/15 hover:bg-white/25 text-stone-100'
                  }`}
                >
                  All ({experiments.length})
                </button>
                {PROGRAMS.map((prog) => {
                  const count = experiments.filter((e) => e.program === prog).length;
                  if (count === 0 && selectedProgram !== prog) return null;
                  return (
                    <button
                      key={prog}
                      onClick={() => setSelectedProgram(prog)}
                      className={`text-sm px-3 py-1 rounded-full font-bold transition-colors cursor-pointer ${
                        selectedProgram === prog
                          ? 'bg-[#C5CC84] text-[#1b2110] shadow-2xs'
                          : 'bg-white/15 hover:bg-white/25 text-stone-100'
                      }`}
                    >
                      {prog}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Sidebar Tools */}
        <div className="pt-6 mt-6 border-t border-white/15 flex items-center justify-between text-xs text-stone-300">
          <span className="text-[11px] font-medium">
            {experiments.length} {experiments.length === 1 ? 'experiment' : 'experiments'}
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleExportData}
              title="Export experiments to JSON"
              className="p-1.5 bg-white/15 hover:bg-white/25 rounded-lg text-white transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleImportClick}
              title="Import JSON"
              className="p-1.5 bg-white/15 hover:bg-white/25 rounded-lg text-white transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
            </button>
            {experiments.length === 0 && (
              <button
                onClick={handleResetSampleData}
                title="Load sample experiments"
                className="p-1.5 bg-white/15 hover:bg-white/25 rounded-lg text-white transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area (Matching screenshot warm cream canvas and card layout) */}
      <main className="flex-1 p-6 sm:p-10 lg:p-12 overflow-y-auto min-h-screen">
        {/* Active Filter Bar (if filtering) */}
        {(searchQuery || selectedProgram !== 'all' || selectedVerdict !== 'all') && (
          <div className="mb-6 flex items-center justify-between text-xs text-stone-600 bg-white/60 backdrop-blur-xs p-3 rounded-2xl border border-stone-200">
            <span>
              Showing <strong>{filteredExperiments.length}</strong> of {experiments.length} experiments
            </span>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedProgram('all');
                setSelectedVerdict('all');
              }}
              className="text-stone-800 hover:text-stone-950 font-bold underline cursor-pointer"
            >
              Clear filter
            </button>
          </div>
        )}

        {/* Card Grid */}
        {filteredExperiments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 items-start max-w-7xl">
            {filteredExperiments.map((exp) => (
              <ExperimentCard
                key={exp.id}
                experiment={exp}
                onSelect={setSelectedExperiment}
                onShare={setSharingExperiment}
                onEdit={handleEditExperiment}
                onDelete={handleDeleteExperiment}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-3xl p-10 sm:p-14 text-center border border-stone-200 max-w-md mx-auto space-y-4 my-12 shadow-xs">
            <h2 className="font-sans text-xl font-bold text-stone-900">
              {searchQuery || selectedProgram !== 'all'
                ? 'No matching experiments found'
                : 'No experiments yet'}
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
              {searchQuery || selectedProgram !== 'all'
                ? 'Try clearing your search or selecting all programs.'
                : 'Tap "Add new experiment" to log your first Ninja CREAMi ice cream experiment!'}
            </p>

            <div className="pt-2 flex justify-center gap-2">
              <button
                onClick={handleOpenNewExperiment}
                className="px-5 py-2.5 rounded-full bg-[#8EA13E] hover:bg-[#7D8F35] text-stone-950 font-medium text-xs shadow-xs cursor-pointer"
              >
                Add new experiment
              </button>
              {experiments.length === 0 && (
                <button
                  onClick={handleResetSampleData}
                  className="px-4 py-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium cursor-pointer"
                >
                  Load sample experiments
                </button>
              )}
            </div>
          </div>
        )}
      </main>

      {/* New / Edit Experiment Modal */}
      {isFormOpen && (
        <ExperimentFormModal
          initialExperiment={editingExperiment}
          nextNumber={nextExperimentNumber}
          onSave={handleSaveExperiment}
          onClose={() => {
            setIsFormOpen(false);
            setEditingExperiment(null);
          }}
        />
      )}

      {/* Detail Modal */}
      {selectedExperiment && (
        <ExperimentModal
          experiment={selectedExperiment}
          onClose={() => setSelectedExperiment(null)}
          onShare={(exp) => setSharingExperiment(exp)}
          onEdit={(exp) => handleEditExperiment(exp)}
          onDelete={(exp) => handleDeleteExperiment(exp)}
        />
      )}

      {/* Share Card Modal */}
      {sharingExperiment && (
        <ShareCardModal
          experiment={sharingExperiment}
          onClose={() => setSharingExperiment(null)}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        experiment={experimentToDelete}
        isOpen={Boolean(experimentToDelete)}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}
