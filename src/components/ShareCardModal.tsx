import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Download, 
  Star, 
  Clock,
  Calendar,
  RotateCw
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Experiment } from '../types';
import { formatCardDate } from './ExperimentCard';

interface ShareCardModalProps {
  experiment: Experiment;
  onClose: () => void;
}

export const ShareCardModal: React.FC<ShareCardModalProps> = ({
  experiment,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const formattedNumber = String(experiment.number).padStart(2, '0');
  const formattedDate = formatCardDate(experiment.date);
  const freezeHours = experiment.freezeTimeHours ?? 22;

  // Generate clean shareable summary text
  const shareText = `🍦 ICE CREAM LAB — EXPERIMENT #${formattedNumber}
Title: ${experiment.title}
Verdict: ${experiment.verdict} (${(experiment.ratings?.overall ?? 8.5).toFixed(1)}/10)
Program: ${experiment.program} mode (${freezeHours}h freeze)

🥣 Base Formulation:
${experiment.base}

🍫 Mix-Ins:
${experiment.mixIns && experiment.mixIns.length > 0 ? experiment.mixIns.map(m => `• ${m.name}${m.amount ? ` (${m.amount})` : ''}`).join('\n') : '• None (pure single spin)'}

⚙️ Ninja CREAMi Process:
• Re-spin needed: ${experiment.reSpinNeeded ? `YES (${experiment.reSpinCount}x)` : 'NO'}
${experiment.reSpinNotes ? `• Notes: ${experiment.reSpinNotes}\n` : ''}
📊 Ratings:
• Flavour: ${experiment.ratings?.flavour}/10
• Creamy: ${experiment.ratings?.creaminess}/10
• Texture: ${experiment.ratings?.texture}/10
• Overall: ${(experiment.ratings?.overall ?? 8.5).toFixed(1)}/10

“${experiment.notes || ''}”
— Spun with love in the Ice Cream Lab`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    const safeTitle = (experiment.title || 'experiment').replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const fileName = `ice_cream_lab_${safeTitle}.pdf`;

    try {
      const element = document.getElementById('printable-experiment-card');
      if (!element) throw new Error('Card element not found');

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#F8F4EA',
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 15;
      const printWidth = pageWidth - margin * 2;
      const printHeight = (canvas.height * printWidth) / canvas.width;

      pdf.addImage(imgData, 'JPEG', margin, margin, printWidth, printHeight);
      pdf.save(fileName);
    } catch (err) {
      console.error('Canvas PDF render failed, falling back to clean text PDF:', err);
      // Reliable fallback: construct formatted vector PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      pdf.setFontSize(22);
      pdf.setTextColor(27, 33, 16);
      pdf.text(experiment.title, 15, 25);

      pdf.setFontSize(11);
      pdf.setTextColor(80, 80, 80);
      pdf.text(`Date: ${formattedDate}  |  Freeze: ${freezeHours}h  |  Program: ${experiment.program || 'Standard'}`, 15, 33);
      pdf.text(`Verdict: ${experiment.verdict}  |  Overall Score: ${(experiment.ratings?.overall ?? 8.5).toFixed(1)}/10`, 15, 40);

      pdf.setFontSize(13);
      pdf.setTextColor(27, 33, 16);
      pdf.text('Base Ingredients:', 15, 52);
      pdf.setFontSize(10);
      pdf.setTextColor(60, 60, 60);
      pdf.text(experiment.base || 'N/A', 15, 58, { maxWidth: 180 });

      if (experiment.mixIns && experiment.mixIns.length > 0) {
        pdf.setFontSize(13);
        pdf.setTextColor(27, 33, 16);
        pdf.text('Mix-Ins:', 15, 80);
        pdf.setFontSize(10);
        pdf.setTextColor(60, 60, 60);
        const mixInText = experiment.mixIns.map(m => `• ${m.name}${m.amount ? ` (${m.amount})` : ''}`).join(', ');
        pdf.text(mixInText, 15, 86, { maxWidth: 180 });
      }

      if (experiment.notes) {
        pdf.setFontSize(13);
        pdf.setTextColor(27, 33, 16);
        pdf.text('Tasting Notes:', 15, 106);
        pdf.setFontSize(10);
        pdf.setTextColor(60, 60, 60);
        pdf.text(`"${experiment.notes}"`, 15, 112, { maxWidth: 180 });
      }

      pdf.save(fileName);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div 
        id="share-card-modal-container"
        className="bg-white rounded-3xl max-w-xl w-full border border-stone-200 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#8EA13E] text-stone-950 flex items-center justify-between border-b border-black/10 no-print">
          <div>
            <h2 className="font-sans font-bold text-lg text-stone-950 leading-tight">
              Sharing experiment
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-stone-900 flex items-center justify-center transition-colors cursor-pointer shadow-xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* The Printable Visual Card */}
        <div className="p-5 sm:p-7 bg-[#F8F4EA] overflow-y-auto" id="printable-experiment-card">
          <div className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm flex flex-col">
            {/* Card Hero Image */}
            {experiment.photoUrl && (
              <div className="relative h-56 w-full overflow-hidden bg-stone-100">
                <img 
                  src={experiment.photoUrl} 
                  alt={experiment.title} 
                  className="w-full h-full object-cover"
                  crossOrigin="anonymous"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-0 inset-x-0 bg-gradient-to-b from-black/60 via-black/25 to-transparent pt-3 pb-6 px-4 flex items-center justify-between text-white text-xs font-sans">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formattedDate}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{freezeHours}h freeze</span>
                  </div>
                </div>
              </div>
            )}

            {/* Card Body */}
            <div className="p-5 space-y-3.5">
              {/* Title & Score */}
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="font-sans font-bold text-xl text-stone-900 leading-snug">
                  {experiment.title}
                </h3>
                <div className="flex items-center gap-1 text-stone-900 font-bold text-sm shrink-0">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>{(experiment.ratings?.overall ?? 8.5).toFixed(1)}/10</span>
                </div>
              </div>

              {/* Row 2: Program & Verdict Badges */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-block bg-[#F8BFB9] text-[#1c1917] text-xs font-bold px-3 py-1 rounded-full">
                  {experiment.program || 'Spin program'}
                </span>
                {experiment.verdict && (
                  <span className="inline-block text-xs font-bold px-3 py-1 rounded-full bg-[#DF9260] text-white">
                    {experiment.verdict}
                  </span>
                )}
              </div>

              {/* 3 Sensory Boxes in #F4ECE1 */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-[#F4ECE1] rounded-xl py-2 px-1 text-center flex flex-col justify-center">
                  <span className="text-sm text-stone-700 font-semibold mb-1">Flavour</span>
                  <span className="text-sm text-stone-900 font-bold">
                    {(experiment.ratings?.flavour ?? 0).toFixed(1)}/10
                  </span>
                </div>
                <div className="bg-[#F4ECE1] rounded-xl py-2 px-1 text-center flex flex-col justify-center">
                  <span className="text-sm text-stone-700 font-semibold mb-1">Creamy</span>
                  <span className="text-sm text-stone-900 font-bold">
                    {(experiment.ratings?.creaminess ?? 0).toFixed(1)}/10
                  </span>
                </div>
                <div className="bg-[#F4ECE1] rounded-xl py-2 px-1 text-center flex flex-col justify-center">
                  <span className="text-sm text-stone-700 font-semibold mb-1">Texture</span>
                  <span className="text-sm text-stone-900 font-bold">
                    {(experiment.ratings?.texture ?? 0).toFixed(1)}/10
                  </span>
                </div>
              </div>

              {/* Comments Box */}
              {experiment.notes && (
                <div className="bg-[#F4ECE1] rounded-xl p-3 text-stone-800 text-xs sm:text-sm italic">
                  “{experiment.notes}”
                </div>
              )}

              {/* Base & Mix-Ins */}
              {experiment.base && (
                <div className="text-xs text-stone-700 pt-1">
                  <span className="font-bold text-stone-500 uppercase text-[10px] block mb-0.5">Base:</span>
                  <p>{experiment.base}</p>
                </div>
              )}

              {experiment.mixIns && experiment.mixIns.length > 0 && (
                <div className="text-xs text-stone-700">
                  <span className="font-bold text-stone-500 uppercase text-[10px] block mb-1">Mix-Ins:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {experiment.mixIns.map((m, idx) => (
                      <span 
                        key={idx} 
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
            </div>
          </div>
        </div>

        {/* Modal Action Buttons (No-print) */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-end gap-3 no-print">
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleExportPDF}
              disabled={isExporting}
              id="export-pdf-btn"
              className="px-5 py-2.5 bg-[#C5CC84] hover:bg-[#B5BD75] text-[#1b2110] rounded-full font-bold text-sm shadow-xs transition-transform active:scale-98 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isExporting ? (
                <RotateCw className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span>{isExporting ? 'Exporting PDF...' : 'Export PDF'}</span>
            </button>

            <button
              onClick={handleCopy}
              id="copy-share-text-btn"
              className={`px-5 py-2.5 rounded-full font-bold text-sm shadow-xs transition-transform active:scale-98 cursor-pointer flex items-center justify-center gap-2 ${
                copied
                  ? 'bg-emerald-700 text-white'
                  : 'border border-stone-300 bg-white hover:bg-stone-100 text-[#1b2110]'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied Text!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Text</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

