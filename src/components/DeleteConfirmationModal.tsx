import React, { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Experiment } from '../types';

interface DeleteConfirmationModalProps {
  experiment: Experiment | null;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  experiment,
  isOpen,
  onConfirm,
  onCancel,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen || !experiment) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150"
      onClick={onCancel}
      id="delete-confirmation-overlay"
    >
      <div
        id="delete-confirmation-modal"
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl max-w-sm sm:max-w-md w-full p-6 shadow-2xl border border-stone-200 text-stone-900 flex flex-col gap-4 animate-in zoom-in-95 duration-150"
      >
        {/* Header with warning icon & close button */}
        <div className="flex items-start justify-between">
          <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <button
            type="button"
            onClick={onCancel}
            id="modal-close-cancel-btn"
            className="w-8 h-8 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 flex items-center justify-center transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Question & details */}
        <div>
          <h3 className="text-lg font-bold text-stone-950">Remove experiment?</h3>
          <p className="text-sm text-stone-600 mt-1.5 leading-relaxed">
            Are you sure you want to remove{' '}
            <span className="font-semibold text-stone-900">“{experiment.title}”</span> from your
            experiment journal? This cannot be undone.
          </p>
        </div>

        {/* Action Buttons: 'cancel' and 'Remove' */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            id="cancel-remove-btn"
            className="px-4 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            id="confirm-remove-btn"
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer active:scale-98"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};
