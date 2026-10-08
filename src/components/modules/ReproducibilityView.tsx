import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Sparkles,
  Loader2,
  BookOpen,
  Download,
  Copy,
  Check
} from 'lucide-react';
import type { ReproducibilityReport, AcademicPaper } from '../../types/research';
import { ApiClient } from '../../services/apiClient';

interface ReproducibilityViewProps {
  reports: ReproducibilityReport[];
  papers: AcademicPaper[];
  onAddReport: (report: ReproducibilityReport) => void;
  initialPaperId?: string;
}

export const ReproducibilityView: React.FC<ReproducibilityViewProps> = ({
  reports,
  papers,
  onAddReport,
  initialPaperId
}) => {
  const [selectedPaperId, setSelectedPaperId] = useState<string>(initialPaperId || papers[0]?.id || '');
  const [auditing, setAuditing] = useState(false);

  const selectedPaper = papers.find(p => p.id === selectedPaperId) || papers[0];
  const activeReport = reports.find(r => r.paperId === selectedPaper?.id) || reports[0];

  const handleRunAudit = async () => {
    if (!selectedPaper || auditing) return;
    setAuditing(true);
    try {
      const report = await ApiClient.analyzeReproducibility(selectedPaper);
      onAddReport(report);
    } catch (err) {
      console.error('Audit failed:', err);
    } finally {
      setAuditing(false);
    }
  };

  const getStatusBadge = (status: 'Available' | 'Partial' | 'Missing') => {
    if (status === 'Available') {
      return (
        <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
          <CheckCircle2 className="w-3 h-3" /> Available
        </span>
      );
    }
    if (status === 'Partial') {
      return (
        <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
          <AlertCircle className="w-3 h-3" /> Partial
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 text-[11px] font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
        <XCircle className="w-3 h-3" /> Missing
      </span>
    );
  };

  return (
    <div className="space-y-6 p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>OPEN SCIENCE ARTIFACT VERIFICATION</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Reproducibility Analyzer</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Audit manuscripts against the ACM/IEEE open artifact guidelines across code, data, seeds, and hardware.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedPaperId}
            onChange={(e) => setSelectedPaperId(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none max-w-xs truncate cursor-pointer"
          >
            {papers.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>

          <button
            onClick={handleRunAudit}
            disabled={auditing || !selectedPaper}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
          >
            {auditing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>{auditing ? 'Auditing Manuscript...' : 'Audit Paper'}</span>
          </button>
        </div>
      </div>

      {activeReport ? (
        <div className="space-y-6">
          {/* Top Score Banner */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                Target Manuscript
              </span>
              <h2 className="text-lg font-bold text-white">
                {activeReport.paperTitle}
              </h2>
              <p className="text-xs text-zinc-400">
                Audit conducted according to empirical machine learning artifact standards.
              </p>
            </div>

            <div className="flex items-center gap-4 bg-zinc-950 p-4 rounded-xl border border-zinc-850 shrink-0">
              <div className="text-right">
                <div className="text-3xl font-extrabold text-white">
                  {activeReport.overallScore}<span className="text-sm text-zinc-500 font-normal">/100</span>
                </div>
                <div className="text-[11px] font-semibold text-emerald-400">
                  {activeReport.overallScore >= 80 ? 'High Reproducibility' : 'Moderate Gaps Detected'}
                </div>
              </div>
              <div className="w-16 h-16 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 flex items-center justify-center font-bold text-xs text-emerald-400">
                {activeReport.overallScore}%
              </div>
            </div>
          </div>

          {/* Breakdown Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(activeReport.breakdown).map(([key, item]) => (
              <div key={key} className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-200 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  {getStatusBadge(item.status)}
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {item.details}
                </p>
              </div>
            ))}
          </div>

          {/* Actionable Recommendations */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-3">
            <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Actionable Recommendations for Camera-Ready Publication</span>
            </h3>
            <div className="space-y-2">
              {activeReport.recommendations.map((rec, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-zinc-950 border border-zinc-850 flex items-start gap-3 text-xs text-zinc-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="py-20 text-center text-zinc-500 border border-dashed border-zinc-800 rounded-2xl">
          <ShieldCheck className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Select a paper and click "Audit Paper" to generate a reproducibility report.</p>
        </div>
      )}
    </div>
  );
};
