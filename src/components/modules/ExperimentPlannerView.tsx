import React, { useState } from 'react';
import {
  FlaskConical,
  Sparkles,
  Download,
  Copy,
  Check,
  AlertTriangle,
  Server,
  Layers,
  CheckCircle2,
  Loader2,
  HelpCircle
} from 'lucide-react';
import type { ExperimentPlan, AcademicPaper } from '../../types/research';
import { ApiClient } from '../../services/apiClient';

interface ExperimentPlannerViewProps {
  experiments: ExperimentPlan[];
  papers: AcademicPaper[];
  onAddExperiment: (plan: ExperimentPlan) => void;
  initialTopic?: string;
}

export const ExperimentPlannerView: React.FC<ExperimentPlannerViewProps> = ({
  experiments,
  papers,
  onAddExperiment,
  initialTopic
}) => {
  const [problemStatement, setProblemStatement] = useState(
    initialTopic || 'Evaluating deterministic token attribution and reciprocal rank fusion to eliminate citation hallucination under random seed noise'
  );
  const [loading, setLoading] = useState(false);
  const [selectedPlanIdx, setSelectedPlanIdx] = useState(0);
  const [copiedPlan, setCopiedPlan] = useState(false);

  const activePlan = experiments[selectedPlanIdx] || experiments[0];

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!problemStatement.trim() || loading) return;

    setLoading(true);
    try {
      const plan = await ApiClient.generateExperimentPlan(problemStatement.trim(), papers);
      onAddExperiment(plan);
      setSelectedPlanIdx(0);
    } catch (err) {
      console.error('Experiment plan generation failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyMarkdown = () => {
    if (!activePlan) return;
    const md = `# Experiment Protocol: ${activePlan.researchProblem}\n\n## Hypotheses\n${activePlan.hypotheses.map(h => `- ${h}`).join('\n')}\n\n## Variables\n- Independent: ${activePlan.variables.independent.join(', ')}\n- Dependent: ${activePlan.variables.dependent.join(', ')}\n- Control: ${activePlan.variables.control.join(', ')}\n\n## Protocol Steps\n${activePlan.experimentSteps.join('\n')}`;
    navigator.clipboard.writeText(md);
    setCopiedPlan(true);
    setTimeout(() => setCopiedPlan(false), 2000);
  };

  return (
    <div className="space-y-6 p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold mb-1">
          <FlaskConical className="w-3.5 h-3.5" />
          <span>EMPIRICAL VALIDATION & PROTOCOL DESIGN</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Experiment Planner</h1>
        <p className="text-xs text-zinc-400 mt-1">
          Translate broad scientific hypotheses into rigorous, reproducible empirical experiments with controlled variables and metric baselines.
        </p>
      </div>

      {/* Generator Prompt Bar */}
      <form onSubmit={handleGenerate} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-3 shadow-lg">
        <label className="block text-xs font-semibold text-zinc-300">
          Research Problem / Core Scientific Question
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={problemStatement}
            onChange={(e) => setProblemStatement(e.target.value)}
            placeholder="e.g. Test if dynamic BM25 weighting improves retrieval on out-of-vocabulary medical nomenclature..."
            className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all cursor-pointer shrink-0"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>{loading ? 'Synthesizing Protocol...' : 'Design Protocol'}</span>
          </button>
        </div>
      </form>

      {/* Active Experiment Plan Display */}
      {activePlan && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-zinc-800">
            <div>
              <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-wider">
                Formal Research Protocol
              </span>
              <h2 className="text-lg font-bold text-white mt-0.5">
                {activePlan.researchProblem}
              </h2>
            </div>

            <button
              onClick={copyMarkdown}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedPlan ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedPlan ? 'Copied Markdown' : 'Copy Protocol'}</span>
            </button>
          </div>

          {/* Research Questions & Hypotheses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-850 space-y-2">
              <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                Research Questions
              </span>
              <ul className="space-y-1.5 text-xs text-zinc-300">
                {activePlan.researchQuestions.map((rq, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="font-mono text-cyan-500 shrink-0">RQ{idx + 1}:</span>
                    <span>{rq}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-850 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                  Formal Scientific Hypotheses
                </span>
                <span className="text-[9px] font-mono text-zinc-500 px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800">
                  Unvalidated Proposal
                </span>
              </div>
              <ul className="space-y-1.5 text-xs text-zinc-300">
                {activePlan.hypotheses.map((hypo, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="font-mono text-amber-500 shrink-0">H{idx + 1}:</span>
                    <span>{hypo}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Variables Triad */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Controlled Experimental Variables
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-850 space-y-1">
                <div className="text-[10px] font-mono font-bold text-indigo-400 uppercase">
                  Independent Variables
                </div>
                <ul className="text-xs text-zinc-300 space-y-1">
                  {activePlan.variables.independent.map((v, i) => (
                    <li key={i}>• {v}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-850 space-y-1">
                <div className="text-[10px] font-mono font-bold text-emerald-400 uppercase">
                  Dependent Variables (Metrics)
                </div>
                <ul className="text-xs text-zinc-300 space-y-1">
                  {activePlan.variables.dependent.map((v, i) => (
                    <li key={i}>• {v}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-850 space-y-1">
                <div className="text-[10px] font-mono font-bold text-zinc-400 uppercase">
                  Control Variables
                </div>
                <ul className="text-xs text-zinc-300 space-y-1">
                  {activePlan.variables.control.map((v, i) => (
                    <li key={i}>• {v}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Datasets, Baselines & Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-850 space-y-2">
              <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                Evaluation Datasets
              </span>
              <ul className="space-y-1.5 text-xs text-zinc-300">
                {activePlan.datasets.map((d, i) => (
                  <li key={i}>
                    <strong className="text-indigo-400">{d.name}: </strong>
                    <span className="text-zinc-400">{d.rationale}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-850 space-y-2">
              <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                Competitive Baselines
              </span>
              <ul className="space-y-1 text-xs text-zinc-300">
                {activePlan.baselines.map((b, i) => (
                  <li key={i}>• {b}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-850 space-y-2">
              <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                Primary Metrics
              </span>
              <ul className="space-y-1 text-xs text-zinc-300">
                {activePlan.evaluationMetrics.map((m, i) => (
                  <li key={i}>• {m}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Step-by-Step Execution Protocol */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Step-by-Step Execution Protocol
            </span>
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-850 space-y-2">
              {activePlan.experimentSteps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-zinc-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Risks & Resources */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-amber-950/10 border border-amber-500/20 space-y-1">
              <span className="font-semibold text-amber-400 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" /> Possible Risks & Failure Modes
              </span>
              <ul className="text-zinc-300 space-y-1 pt-1">
                {activePlan.possibleRisks.map((r, i) => (
                  <li key={i}>• {r}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-850 space-y-1">
              <span className="font-semibold text-zinc-300 flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-indigo-400" /> Required Compute & Tools
              </span>
              <ul className="text-zinc-400 space-y-1 pt-1">
                {activePlan.requiredResources.map((res, i) => (
                  <li key={i}>• {res}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
