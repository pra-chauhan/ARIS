import React, { useState, useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import {
  GitBranch,
  Sparkles,
  Download,
  Copy,
  Check,
  RefreshCw,
  Loader2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Code2
} from 'lucide-react';
import type { DiagramArtifact } from '../../types/research';
import { ApiClient } from '../../services/apiClient';

interface DiagramStudioViewProps {
  diagrams: DiagramArtifact[];
  onAddDiagram: (diagram: DiagramArtifact) => void;
}

export const DiagramStudioView: React.FC<DiagramStudioViewProps> = ({
  diagrams,
  onAddDiagram
}) => {
  const [activeDiagramIdx, setActiveDiagramIdx] = useState(0);
  const [prompt, setPrompt] = useState('Attributed Scientific RAG Architecture with Sparse-Dense RRF and Attribution Gating');
  const [diagramType, setDiagramType] = useState<DiagramArtifact['type']>('rag_pipeline');
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [svgOutput, setSvgOutput] = useState<string>('');
  const [renderError, setRenderError] = useState<string | null>(null);

  const activeDiagram = diagrams[activeDiagramIdx] || diagrams[0];

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'dark',
      securityLevel: 'loose',
      fontFamily: 'monospace'
    });
  }, []);

  // Re-render Mermaid SVG whenever active diagram code changes
  useEffect(() => {
    if (!activeDiagram) return;
    let isMounted = true;
    const renderDiagram = async () => {
      try {
        const uniqueId = `mermaid_${Date.now()}`;
        const { svg } = await mermaid.render(uniqueId, activeDiagram.mermaidCode);
        if (isMounted) {
          setSvgOutput(svg);
          setRenderError(null);
        }
      } catch (err) {
        if (isMounted) {
          setRenderError((err as Error).message);
        }
      }
    };
    renderDiagram();
    return () => {
      isMounted = false;
    };
  }, [activeDiagram]);

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || generating) return;
    setGenerating(true);

    try {
      const diag = await ApiClient.generateDiagram(prompt.trim(), diagramType);
      onAddDiagram(diag);
      setActiveDiagramIdx(0);
    } catch (err) {
      console.error('Diagram generation error:', err);
    } finally {
      setGenerating(false);
    }
  };

  const handleCopyCode = () => {
    if (!activeDiagram) return;
    navigator.clipboard.writeText(activeDiagram.mermaidCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSvg = () => {
    if (!svgOutput) return;
    const blob = new Blob([svgOutput], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `diagram_${activeDiagram?.type || 'research'}_${Date.now()}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-7xl mx-auto p-6 gap-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-zinc-900 border border-zinc-800">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold mb-0.5">
            <GitBranch className="w-3.5 h-3.5" />
            <span>SCIENTIFIC SCHEMATICS & WORKFLOWS</span>
          </div>
          <h2 className="text-base font-bold text-white">Research Diagrams & Mermaid Studio</h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyCode}
            className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-300 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Code'}</span>
          </button>
          <button
            onClick={handleDownloadSvg}
            disabled={!svgOutput}
            className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export SVG</span>
          </button>
        </div>
      </div>

      {/* Generator Prompt Bar */}
      <form onSubmit={handleGenerate} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-wrap items-center gap-3">
        <select
          value={diagramType}
          onChange={(e) => setDiagramType(e.target.value as any)}
          className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none"
        >
          <option value="rag_pipeline">RAG Pipeline</option>
          <option value="architecture">System Architecture</option>
          <option value="ml_workflow">ML Workflow</option>
          <option value="experiment_protocol">Experiment Protocol</option>
          <option value="concept_map">Concept Map</option>
        </select>

        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your research diagram..."
          className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 min-w-[240px]"
        />

        <button
          type="submit"
          disabled={generating}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all cursor-pointer shrink-0"
        >
          {generating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
          <span>Generate Diagram</span>
        </button>
      </form>

      {/* Split View: Left Code, Right Live Renderer */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 overflow-hidden">
        {/* Left Column: Mermaid Source Code Editor (5 cols) */}
        <div className="lg:col-span-5 bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col justify-between overflow-hidden shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Code2 className="w-4 h-4 text-indigo-400" />
              <span>Mermaid Definition</span>
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">Live Sync</span>
          </div>

          <textarea
            value={activeDiagram?.mermaidCode || ''}
            onChange={(e) => {
              if (activeDiagram) {
                activeDiagram.mermaidCode = e.target.value;
                onAddDiagram({ ...activeDiagram });
              }
            }}
            placeholder="graph TD..."
            className="w-full flex-1 bg-zinc-950 border border-zinc-850 rounded-xl p-4 font-mono text-xs text-zinc-200 focus:outline-none focus:border-indigo-500 resize-none my-3 leading-relaxed"
          />

          {renderError && (
            <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[11px] font-mono">
              Syntax error: {renderError}
            </div>
          )}
        </div>

        {/* Right Column: Live Interactive Diagram Surface (7 cols) */}
        <div className="lg:col-span-7 bg-zinc-950 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between shadow-inner">
          {/* Controls */}
          <div className="absolute top-4 right-4 z-10 flex items-center gap-1 bg-zinc-900/90 backdrop-blur-md p-1 rounded-xl border border-zinc-800">
            <button
              onClick={() => setZoom(z => Math.min(2.5, z + 0.2))}
              className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoom(z => Math.max(0.4, z - 0.2))}
              className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoom(1)}
              className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white"
              title="Reset Zoom"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* SVG Canvas */}
          <div className="flex-1 flex items-center justify-center overflow-auto p-4">
            {svgOutput ? (
              <div 
                style={{ transform: `scale(${zoom})`, transformOrigin: 'center center', transition: 'transform 0.15s ease' }}
                dangerouslySetInnerHTML={{ __html: svgOutput }}
                className="w-full h-full flex items-center justify-center [&_svg]:max-w-full [&_svg]:max-h-full"
              />
            ) : (
              <div className="text-zinc-600 text-xs">No diagram rendered.</div>
            )}
          </div>

          <div className="text-[10px] text-zinc-500 text-center font-mono pt-2 border-t border-zinc-900">
            Rendered natively via Mermaid.js • High-resolution vector SVG
          </div>
        </div>
      </div>
    </div>
  );
};
