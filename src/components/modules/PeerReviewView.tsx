import React, { useState } from 'react';
import {
  Scale,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Loader2,
  Search,
  BookOpen,
  Info
} from 'lucide-react';
import type { PeerReviewReport, ClaimVerificationResult, AcademicPaper } from '../../types/research';
import { ApiClient } from '../../services/apiClient';

interface PeerReviewViewProps {
  reports: PeerReviewReport[];
  papers: AcademicPaper[];
  onAddReport: (report: PeerReviewReport) => void;
  initialPaperId?: string;
}

export const PeerReviewView: React.FC<PeerReviewViewProps> = ({
  reports,
  papers,
  onAddReport,
  initialPaperId
}) => {
  const [selectedPaperId, setSelectedPaperId] = useState<string>(initialPaperId || papers[0]?.id || '');
  const [reviewing, setReviewing] = useState(false);
  const [activeTab, setActiveTab] = useState<'review' | 'claim-verify'>('review');

  // Claim verification state
  const [claimInput, setClaimInput] = useState('Deterministic token attribution reduces hallucinated citations to under 0.8%');
  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState<ClaimVerificationResult | null>(null);

  const selectedPaper = papers.find(p => p.id === selectedPaperId) || papers[0];
  const activeReport = reports.find(r => r.paperId === selectedPaper?.id) || reports[0];

  const handleRunReview = async () => {
    if (!selectedPaper || reviewing) return;
    setReviewing(true);
    try {
      const report = await ApiClient.generatePeerReview(selectedPaper);
      onAddReport(report);
    } catch (err) {
      console.error('Peer review failed:', err);
    } finally {
      setReviewing(false);
    }
  };

  const handleVerifyClaim = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!claimInput.trim() || verifying) return;
    setVerifying(true);
    try {
      const result = await ApiClient.verifyClaim(claimInput.trim(), papers);
      setVerifyResult(result);
    } catch (err) {
      console.error('Claim verification failed:', err);
    } finally {
      setVerifying(false);
    }
  };

  const getSeverityBadge = (sev: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL') => {
    const map = {
      CRITICAL: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      HIGH: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
      MEDIUM: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      LOW: 'bg-blue-500/10 text-blue-400 border-blue-500/20'
    };
    return (
      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${map[sev]}`}>
        {sev} Severity
      </span>
    );
  };

  return (
    <div className="space-y-6 p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold mb-1">
            <Scale className="w-3.5 h-3.5" />
            <span>RIGOROUS METHODOLOGICAL SCRUTINY</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">AI Peer Reviewer & Claim Verification</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Evaluate manuscripts for overclaiming, baseline completeness, and verify empirical assertions against corpus text.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="bg-zinc-900 border border-zinc-800 p-1 rounded-xl flex items-center gap-1 text-xs">
          <button
            onClick={() => setActiveTab('review')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'review'
                ? 'bg-indigo-600 text-white'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Peer Review Report
          </button>
          <button
            onClick={() => setActiveTab('claim-verify')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'claim-verify'
                ? 'bg-indigo-600 text-white'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Claim Verifier
          </button>
        </div>
      </div>

      {activeTab === 'review' && (
        <div className="space-y-6">
          {/* Paper Selector & Review Trigger */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-zinc-900 border border-zinc-800">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-zinc-500">Target Paper:</span>
              <select
                value={selectedPaperId}
                onChange={(e) => setSelectedPaperId(e.target.value)}
                className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-zinc-200 focus:outline-none max-w-xs truncate cursor-pointer"
              >
                {papers.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleRunReview}
              disabled={reviewing || !selectedPaper}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
            >
              {reviewing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Scale className="w-3.5 h-3.5" />}
              <span>{reviewing ? 'Conducting Blind Peer Review...' : 'Run Peer Review'}</span>
            </button>
          </div>

          {activeReport ? (
            <div className="space-y-6">
              {/* Verdict Banner */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-zinc-800">
                  <div>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                      Manuscript Evaluation
                    </span>
                    <h2 className="text-lg font-bold text-white">
                      {activeReport.paperTitle}
                    </h2>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-400 font-medium">Verdict:</span>
                    <span className="px-3 py-1 rounded-lg text-xs font-bold font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {activeReport.verdict}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-zinc-300 leading-relaxed">
                  {activeReport.summary}
                </p>

                {/* Strengths & Weaknesses */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-850 space-y-2">
                    <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                      Key Strengths
                    </span>
                    <ul className="space-y-1.5 text-xs text-zinc-300">
                      {activeReport.strengths.map((s, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-850 space-y-2">
                    <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                      Key Weaknesses & Concerns
                    </span>
                    <ul className="space-y-1.5 text-xs text-zinc-300">
                      {activeReport.weaknesses.map((w, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <span>{w}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Detailed Findings List */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider">
                  Detailed Findings & Recommendations ({activeReport.findings.length})
                </h3>

                <div className="grid grid-cols-1 gap-4">
                  {activeReport.findings.map((f) => (
                    <div
                      key={f.id}
                      className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-bold text-zinc-300">
                          {f.category}
                        </span>
                        {getSeverityBadge(f.severity)}
                      </div>

                      <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-850 text-xs font-mono text-zinc-300">
                        <strong className="text-zinc-500">Audited Passage: </strong>"{f.claimOrPassage}"
                      </div>

                      <p className="text-xs text-zinc-300 leading-relaxed">
                        <strong className="text-amber-400">Issue: </strong>{f.issue}
                      </p>

                      <p className="text-xs text-zinc-400">
                        <strong className="text-zinc-500">Explanation: </strong>{f.explanation}
                      </p>

                      <div className="p-3 rounded-lg bg-indigo-950/20 border border-indigo-500/20 text-xs text-indigo-300">
                        <strong className="text-indigo-400">Actionable Fix: </strong>{f.recommendation}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Disclaimer */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-850 text-xs text-zinc-500 flex items-start gap-2">
                <Info className="w-4 h-4 shrink-0 text-zinc-400" />
                <span>{activeReport.disclaimer}</span>
              </div>
            </div>
          ) : (
            <div className="py-20 text-center text-zinc-500 border border-dashed border-zinc-800 rounded-2xl">
              <Scale className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Select a paper and click "Run Peer Review" to audit methodology.</p>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Claim Verification Workflow */}
      {activeTab === 'claim-verify' && (
        <div className="space-y-6">
          <form onSubmit={handleVerifyClaim} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-3 shadow-lg">
            <label className="block text-xs font-semibold text-zinc-300">
              Scientific Claim to Verify Against Project Corpus
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={claimInput}
                onChange={(e) => setClaimInput(e.target.value)}
                placeholder="Enter scientific claim (e.g. 'Dense embeddings improve accuracy on chemical nomenclature')..."
                className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                disabled={verifying}
                className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all cursor-pointer shrink-0"
              >
                {verifying ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                <span>Verify Claim</span>
              </button>
            </div>
          </form>

          {verifyResult && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <span className="text-xs font-mono text-zinc-400">Claim Verification Status</span>
                <span className={`px-2.5 py-1 rounded-md text-xs font-bold font-mono ${
                  verifyResult.status === 'SUPPORTED'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  {verifyResult.status} (Confidence: {Math.round(verifyResult.confidence * 100)}%)
                </span>
              </div>

              <div className="text-sm font-semibold text-white">
                "{verifyResult.claim}"
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed">
                {verifyResult.explanation}
              </p>

              {/* Verified Passages */}
              {verifyResult.evidencePassages.length > 0 && (
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    Corroborating Passages in Corpus
                  </span>
                  {verifyResult.evidencePassages.map((p, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-850 space-y-1">
                      <div className="flex items-center justify-between text-[11px] text-indigo-400 font-semibold">
                        <span>{p.paperTitle}</span>
                        <span className="text-zinc-500">{p.section}</span>
                      </div>
                      <p className="text-xs text-zinc-300 font-mono">{p.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
