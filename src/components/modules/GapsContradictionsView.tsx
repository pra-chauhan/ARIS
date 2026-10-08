import React, { useState } from 'react';
import {
  Compass,
  AlertTriangle,
  GitCompare,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  HelpCircle,
  FlaskConical,
  BookOpen,
  CheckCircle2,
  RefreshCw,
  Loader2
} from 'lucide-react';
import type { ResearchGap, Contradiction, AcademicPaper } from '../../types/research';
import { ApiClient } from '../../services/apiClient';

interface GapsContradictionsViewProps {
  gaps: ResearchGap[];
  contradictions: Contradiction[];
  papers: AcademicPaper[];
  onUpdateGaps: (gaps: ResearchGap[]) => void;
  onUpdateContradictions: (contras: Contradiction[]) => void;
  onFormulateExperiment: (gapOrTopic: string) => void;
}

export const GapsContradictionsView: React.FC<GapsContradictionsViewProps> = ({
  gaps,
  contradictions,
  papers,
  onUpdateGaps,
  onUpdateContradictions,
  onFormulateExperiment
}) => {
  const [activeTab, setActiveTab] = useState<'gaps' | 'contradictions'>('gaps');
  const [loadingGaps, setLoadingGaps] = useState(false);
  const [loadingContras, setLoadingContras] = useState(false);

  const handleScanGaps = async () => {
    setLoadingGaps(true);
    try {
      const newGaps = await ApiClient.detectGaps(papers);
      onUpdateGaps(newGaps);
    } catch (err) {
      console.error('Error scanning gaps:', err);
    } finally {
      setLoadingGaps(false);
    }
  };

  const handleScanContradictions = async () => {
    setLoadingContras(true);
    try {
      const newContras = await ApiClient.detectContradictions(papers);
      onUpdateContradictions(newContras);
    } catch (err) {
      console.error('Error detecting contradictions:', err);
    } finally {
      setLoadingContras(false);
    }
  };

  return (
    <div className="space-y-6 p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold mb-1">
            <Compass className="w-3.5 h-3.5" />
            <span>CRITICAL SCIENTIFIC FRONTIERS</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Research Gaps & Contradictions</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Detect unexplored benchmarks, unaddressed populations, and empirical conflicts across your paper corpus.
          </p>
        </div>

        {/* Tab Buttons & Actions */}
        <div className="flex items-center gap-2">
          <div className="bg-zinc-900 border border-zinc-800 p-1 rounded-xl flex items-center gap-1 text-xs">
            <button
              onClick={() => setActiveTab('gaps')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'gaps'
                  ? 'bg-indigo-600 text-white'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Research Gaps ({gaps.length})
            </button>
            <button
              onClick={() => setActiveTab('contradictions')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'contradictions'
                  ? 'bg-indigo-600 text-white'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Contradictions ({contradictions.length})
            </button>
          </div>

          {activeTab === 'gaps' ? (
            <button
              onClick={handleScanGaps}
              disabled={loadingGaps}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
            >
              {loadingGaps ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
              <span>Scan Gaps</span>
            </button>
          ) : (
            <button
              onClick={handleScanContradictions}
              disabled={loadingContras}
              className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-amber-600/20 cursor-pointer"
            >
              {loadingContras ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
              <span>Detect Conflicts</span>
            </button>
          )}
        </div>
      </div>

      {/* Tab 1: Research Gaps */}
      {activeTab === 'gaps' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/20 text-xs text-indigo-300 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold text-indigo-200">ARIS Scientific Integrity Contract: </strong>
              Every detected gap strictly separates <span className="font-mono bg-indigo-900/50 px-1 rounded">EVIDENCE</span> (reported literature fact), <span className="font-mono bg-indigo-900/50 px-1 rounded">INFERENCE</span> (logical deduction), and <span className="font-mono bg-indigo-900/50 px-1 rounded">HYPOTHESIS</span> (unvalidated proposal). Hypotheses are never asserted as established facts.
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {gaps.map((gap) => (
              <div
                key={gap.id}
                className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all space-y-4 shadow-lg"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-semibold uppercase ${
                      gap.confidence === 'High'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}>
                      {gap.confidence} Confidence
                    </span>
                    <span className="text-xs font-mono text-zinc-400">
                      {gap.affectedArea}
                    </span>
                  </div>

                  <button
                    onClick={() => onFormulateExperiment(gap.title)}
                    className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <FlaskConical className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Plan Experiment</span>
                  </button>
                </div>

                <h3 className="text-lg font-bold text-white">
                  {gap.title}
                </h3>

                {/* Evidence / Inference / Hypothesis Triad */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-850 space-y-1">
                    <div className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                      1. Evidence (Literature Fact)
                    </div>
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      {gap.evidence}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-850 space-y-1">
                    <div className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
                      2. Inference (Logical Derivation)
                    </div>
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      {gap.inference}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-850 space-y-1">
                    <div className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider">
                      3. Hypothesis (Open Research Idea)
                    </div>
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      {gap.hypothesis}
                    </p>
                  </div>
                </div>

                {/* Impact & Direction */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-850">
                    <span className="font-semibold text-zinc-400 block mb-1">Why It Matters:</span>
                    <p className="text-zinc-300">{gap.whyItMatters}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-850">
                    <span className="font-semibold text-indigo-400 block mb-1">Suggested Direction:</span>
                    <p className="text-zinc-300">{gap.suggestedDirection}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Contradictions */}
      {activeTab === 'contradictions' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold text-amber-200">Cross-Study Discrepancy Analysis: </strong>
              ARIS detects empirical divergence across studies and isolates the underlying causes (e.g. undisclosed seed variance, dataset distribution shifts, or differing evaluation protocols).
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {contradictions.map((contra) => (
              <div
                key={contra.id}
                className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4 shadow-lg"
              >
                <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                  <div className="flex items-center gap-2">
                    <GitCompare className="w-4 h-4 text-amber-400" />
                    <h3 className="text-base font-bold text-white">{contra.topic}</h3>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    Empirical Contradiction
                  </span>
                </div>

                {/* Side by Side Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Paper A */}
                  <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-850 space-y-2">
                    <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-wider">
                      Study A: {contra.paperA.paperTitle}
                    </span>
                    <p className="text-xs font-semibold text-zinc-100">
                      "{contra.paperA.claim}"
                    </p>
                    <p className="text-[11px] text-zinc-400 bg-zinc-900 p-2 rounded">
                      <strong className="text-zinc-500">Reported Evidence: </strong>
                      {contra.paperA.evidence}
                    </p>
                  </div>

                  {/* Paper B */}
                  <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-850 space-y-2">
                    <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                      Study B: {contra.paperB.paperTitle}
                    </span>
                    <p className="text-xs font-semibold text-zinc-100">
                      "{contra.paperB.claim}"
                    </p>
                    <p className="text-[11px] text-zinc-400 bg-zinc-900 p-2 rounded">
                      <strong className="text-zinc-500">Reported Evidence: </strong>
                      {contra.paperB.evidence}
                    </p>
                  </div>
                </div>

                {/* Underlying Causes */}
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-850 space-y-2">
                  <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                    Root Causes for Observed Discrepancy
                  </span>
                  <ul className="space-y-1 text-xs text-zinc-300">
                    {contra.underlyingCauses.map((cause, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                        <span>{cause}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Synthesis & Resolution */}
                <div className="p-4 rounded-xl bg-indigo-950/10 border border-indigo-500/20 text-xs space-y-1.5">
                  <span className="font-semibold text-indigo-300 block">Methodological Synthesis & Resolution Hypothesis:</span>
                  <p className="text-zinc-300 leading-relaxed">{contra.explanation}</p>
                  <p className="text-indigo-200 font-medium pt-1">
                    <strong className="text-indigo-400">Resolution Hypothesis: </strong>
                    {contra.resolutionHypothesis}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
