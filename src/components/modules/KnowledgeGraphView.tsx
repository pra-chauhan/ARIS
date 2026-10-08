import React, { useState, useEffect, useRef } from 'react';
import {
  Network,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Filter,
  RefreshCw,
  Sparkles,
  Info,
  BookOpen,
  ArrowRight,
  Loader2
} from 'lucide-react';
import type { KnowledgeGraphData, KnowledgeNode, KnowledgeEdge, AcademicPaper } from '../../types/research';
import { ApiClient } from '../../services/apiClient';

interface KnowledgeGraphViewProps {
  graph: KnowledgeGraphData;
  papers: AcademicPaper[];
  onUpdateGraph: (newGraph: KnowledgeGraphData) => void;
  onSelectPaper: (paper: AcademicPaper) => void;
}

export const KnowledgeGraphView: React.FC<KnowledgeGraphViewProps> = ({
  graph,
  papers,
  onUpdateGraph,
  onSelectPaper
}) => {
  const [selectedNode, setSelectedNode] = useState<KnowledgeNode | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [regenerating, setRegenerating] = useState(false);

  // Layout node coordinates (force-directed radial simulation)
  const [nodePositions, setNodePositions] = useState<Record<string, { x: number; y: number }>>({});

  useEffect(() => {
    // Generate initial layout centered at (400, 300)
    const positions: Record<string, { x: number; y: number }> = {};
    const centerX = 450;
    const centerY = 320;
    const radius = 220;

    graph.nodes.forEach((node, i) => {
      // Group by type or arrange in rings
      let r = radius;
      if (node.type === 'paper') r = 140;
      else if (node.type === 'method') r = 240;
      else if (node.type === 'dataset') r = 300;

      const angle = (i / Math.max(1, graph.nodes.length)) * 2 * Math.PI;
      // Add a bit of pseudo-stochastic jitter for organic layout
      const jitterX = Math.sin(i * 3.7) * 25;
      const jitterY = Math.cos(i * 2.3) * 25;

      positions[node.id] = {
        x: centerX + r * Math.cos(angle) + jitterX,
        y: centerY + r * Math.sin(angle) + jitterY
      };
    });

    setNodePositions(positions);
  }, [graph]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).tagName === 'svg' || (e.target as HTMLElement).tagName === 'g') {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleSyncGraph = async () => {
    setRegenerating(true);
    try {
      const updated = await ApiClient.buildKnowledgeGraph(papers);
      onUpdateGraph(updated);
    } catch (err) {
      console.error('Graph build error:', err);
    } finally {
      setRegenerating(false);
    }
  };

  const filteredNodes = graph.nodes.filter(n => {
    if (filterType === 'all') return true;
    return n.type === filterType;
  });

  const filteredNodeIds = new Set(filteredNodes.map(n => n.id));

  const filteredEdges = graph.edges.filter(e => 
    filteredNodeIds.has(e.source) && filteredNodeIds.has(e.target)
  );

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-7xl mx-auto p-6 gap-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-zinc-900 border border-zinc-800">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold mb-0.5">
            <Network className="w-3.5 h-3.5" />
            <span>RELATIONAL RESEARCH TOPOLOGY</span>
          </div>
          <h2 className="text-base font-bold text-white">Research Knowledge Graph</h2>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Entity Filter */}
          <div className="flex items-center gap-1.5 bg-zinc-800/80 px-2 py-1 rounded-lg">
            <span className="text-zinc-500">Filter:</span>
            {['all', 'paper', 'method', 'dataset', 'concept', 'author'].map(t => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-2 py-0.5 rounded capitalize font-medium transition-all ${
                  filterType === t
                    ? 'bg-indigo-600 text-white'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Sync Button */}
          <button
            onClick={handleSyncGraph}
            disabled={regenerating}
            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
          >
            {regenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
            <span>Sync Graph</span>
          </button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 relative bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-inner flex">
        {/* Canvas Toolbar Controls */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-1 bg-zinc-900/90 backdrop-blur-md p-1 rounded-xl border border-zinc-800">
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
            onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
            className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white"
            title="Reset View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 z-10 flex flex-wrap gap-2.5 bg-zinc-900/90 backdrop-blur-md px-3 py-2 rounded-xl border border-zinc-800 text-[11px]">
          <span className="flex items-center gap-1 text-zinc-300">
            <span className="w-2.5 h-2.5 rounded-full bg-[#6366f1]" /> Paper
          </span>
          <span className="flex items-center gap-1 text-zinc-300">
            <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" /> Method
          </span>
          <span className="flex items-center gap-1 text-zinc-300">
            <span className="w-2.5 h-2.5 rounded-full bg-[#06b6d4]" /> Dataset
          </span>
          <span className="flex items-center gap-1 text-zinc-300">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" /> Concept
          </span>
          <span className="flex items-center gap-1 text-zinc-300">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ec4899]" /> Author
          </span>
        </div>

        {/* Interactive SVG Surface */}
        <div 
          className="w-full h-full cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <svg className="w-full h-full">
            <defs>
              <marker
                id="arrowhead"
                markerWidth="8"
                markerHeight="6"
                refX="16"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#52525b" />
              </marker>
            </defs>

            <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
              {/* Edges */}
              {filteredEdges.map((edge) => {
                const sourcePos = nodePositions[edge.source];
                const targetPos = nodePositions[edge.target];
                if (!sourcePos || !targetPos) return null;

                const isConnectedToSelected = selectedNode && (edge.source === selectedNode.id || edge.target === selectedNode.id);

                return (
                  <g key={edge.id}>
                    <line
                      x1={sourcePos.x}
                      y1={sourcePos.y}
                      x2={targetPos.x}
                      y2={targetPos.y}
                      stroke={isConnectedToSelected ? '#818cf8' : '#27272a'}
                      strokeWidth={isConnectedToSelected ? 2.5 : 1.5}
                      markerEnd="url(#arrowhead)"
                      strokeDasharray={edge.relationship === 'contradicts' ? '4,4' : undefined}
                    />
                    <text
                      x={(sourcePos.x + targetPos.x) / 2}
                      y={(sourcePos.y + targetPos.y) / 2 - 4}
                      fill={isConnectedToSelected ? '#a5b4fc' : '#71717a'}
                      fontSize="9"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      {edge.relationship}
                    </text>
                  </g>
                );
              })}

              {/* Nodes */}
              {filteredNodes.map((node) => {
                const pos = nodePositions[node.id] || { x: 450, y: 320 };
                const isSelected = selectedNode?.id === node.id;
                const nodeColor = node.color || '#6366f1';

                return (
                  <g
                    key={node.id}
                    transform={`translate(${pos.x}, ${pos.y})`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedNode(node);
                    }}
                    className="cursor-pointer group"
                  >
                    <circle
                      r={node.type === 'paper' ? 24 : 18}
                      fill={nodeColor}
                      fillOpacity={isSelected ? 0.9 : 0.25}
                      stroke={nodeColor}
                      strokeWidth={isSelected ? 3 : 1.5}
                      className="transition-all"
                    />
                    <circle
                      r={node.type === 'paper' ? 7 : 5}
                      fill={nodeColor}
                    />
                    <text
                      y={node.type === 'paper' ? 36 : 28}
                      fill={isSelected ? '#ffffff' : '#d4d4d8'}
                      fontSize="11"
                      fontWeight={isSelected ? 'bold' : 'normal'}
                      textAnchor="middle"
                      className="select-none pointer-events-none drop-shadow"
                    >
                      {node.label}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>
        </div>

        {/* Selected Node Sidebar Drawer */}
        {selectedNode && (
          <div className="w-80 bg-zinc-900 border-l border-zinc-800 p-5 z-20 flex flex-col justify-between shadow-2xl overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                  {selectedNode.type}
                </span>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="text-zinc-500 hover:text-white text-xs"
                >
                  Close
                </button>
              </div>

              <div>
                <h3 className="text-base font-bold text-white mb-1">
                  {selectedNode.label}
                </h3>
                {selectedNode.description && (
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {selectedNode.description}
                  </p>
                )}
              </div>

              {/* Connected Relationships */}
              <div className="space-y-2">
                <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                  Topological Edges
                </span>
                <div className="space-y-1.5">
                  {graph.edges
                    .filter(e => e.source === selectedNode.id || e.target === selectedNode.id)
                    .map(edge => {
                      const otherId = edge.source === selectedNode.id ? edge.target : edge.source;
                      const otherNode = graph.nodes.find(n => n.id === otherId);
                      const isSource = edge.source === selectedNode.id;

                      return (
                        <div key={edge.id} className="p-2 rounded bg-zinc-950 text-xs border border-zinc-850 space-y-0.5">
                          <div className="flex items-center gap-1 font-mono text-[10px] text-indigo-400">
                            <span>{isSource ? 'Outbound' : 'Inbound'}:</span>
                            <strong className="text-zinc-300">{edge.relationship}</strong>
                          </div>
                          <div className="text-zinc-200 font-medium truncate">
                            {otherNode?.label || otherId}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>

            {selectedNode.paperId && (
              <div className="pt-4 border-t border-zinc-800">
                <button
                  onClick={() => {
                    const p = papers.find(x => x.id === selectedNode.paperId);
                    if (p) onSelectPaper(p);
                  }}
                  className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-indigo-600/20"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Open Paper in Reader</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
