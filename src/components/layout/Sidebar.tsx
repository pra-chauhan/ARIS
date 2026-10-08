import React from 'react';
import {
  LayoutDashboard,
  Search,
  BookOpen,
  FileSearch,
  MessageSquare,
  Network,
  Compass,
  TableProperties,
  NotebookPen,
  FlaskConical,
  ShieldCheck,
  Scale,
  PenTool,
  GitBranch,
  Sparkles
} from 'lucide-react';

export type NavTab = 
  | 'dashboard'
  | 'search'
  | 'papers'
  | 'reader'
  | 'rag-chat'
  | 'knowledge-graph'
  | 'gaps'
  | 'literature-matrix'
  | 'notebook'
  | 'experiments'
  | 'reproducibility'
  | 'peer-review'
  | 'writing'
  | 'diagrams';

interface NavItem {
  id: NavTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  count?: number;
  badge?: string;
  highlight?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

interface SidebarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  paperCount: number;
  gapCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  paperCount,
  gapCount
}) => {
  const navSections: NavSection[] = [
    {
      title: 'WORKSPACE',
      items: [
        { id: 'dashboard' as NavTab, label: 'Overview & Pulse', icon: LayoutDashboard },
        { id: 'search' as NavTab, label: 'Semantic Discovery', icon: Search, badge: '4 APIs' },
        { id: 'papers' as NavTab, label: 'Paper Library', icon: BookOpen, count: paperCount },
        { id: 'reader' as NavTab, label: 'Multimodal Reader', icon: FileSearch },
      ]
    },
    {
      title: 'INTELLIGENCE & RAG',
      items: [
        { id: 'rag-chat' as NavTab, label: 'Citation-Grounded RAG', icon: MessageSquare, highlight: true },
        { id: 'knowledge-graph' as NavTab, label: 'Knowledge Graph', icon: Network },
        { id: 'gaps' as NavTab, label: 'Gaps & Contradictions', icon: Compass, count: gapCount },
        { id: 'literature-matrix' as NavTab, label: 'Literature Matrix', icon: TableProperties },
      ]
    },
    {
      title: 'SCIENTIFIC PROTOCOL',
      items: [
        { id: 'notebook' as NavTab, label: 'Research Notebook', icon: NotebookPen },
        { id: 'experiments' as NavTab, label: 'Experiment Planner', icon: FlaskConical },
        { id: 'reproducibility' as NavTab, label: 'Reproducibility Audit', icon: ShieldCheck },
        { id: 'peer-review' as NavTab, label: 'AI Peer Reviewer', icon: Scale },
      ]
    },
    {
      title: 'OUTPUT & WRITING',
      items: [
        { id: 'writing' as NavTab, label: 'Academic Writing & LaTeX', icon: PenTool },
        { id: 'diagrams' as NavTab, label: 'Research Diagrams', icon: GitBranch },
      ]
    }
  ];

  return (
    <aside className="w-64 border-r border-zinc-800 bg-zinc-950 flex flex-col justify-between h-screen select-none shrink-0 overflow-y-auto">
      <div>
        {/* App Branding */}
        <div className="p-4 border-b border-zinc-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold tracking-wider text-base text-zinc-100">ARIS</span>
              <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                v1.0 OS
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 font-mono">Research Intelligence</p>
          </div>
        </div>

        {/* Navigation Groups */}
        <div className="p-3 space-y-6">
          {navSections.map((section) => (
            <div key={section.title}>
              <div className="px-3 mb-2 text-[10px] font-semibold text-zinc-500 tracking-wider">
                {section.title}
              </div>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onTabChange(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                          : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.highlight ? 'text-indigo-400' : 'text-zinc-400'}`} />
                        <span>{item.label}</span>
                      </div>
                      {typeof item.count === 'number' && item.count > 0 && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                          isActive ? 'bg-indigo-700 text-white' : 'bg-zinc-800 text-zinc-400'
                        }`}>
                          {item.count}
                        </span>
                      )}
                      {item.badge && (
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                          isActive ? 'bg-indigo-700 text-white' : 'bg-zinc-800 text-indigo-300'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-zinc-800 bg-zinc-950/60 text-xs">
        <div className="flex items-center justify-between text-zinc-500 mb-1">
          <span className="text-[11px]">Grounded Rigor</span>
          <span className="text-[10px] font-mono text-emerald-400">Zero Hallucination</span>
        </div>
        <p className="text-[10px] text-zinc-600 leading-tight">
          Every statement verified against retrieved citations & methodology.
        </p>
      </div>
    </aside>
  );
};
