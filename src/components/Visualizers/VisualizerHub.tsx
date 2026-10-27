import React, { useState } from 'react';
import { TwoPointersVisualizer } from './TwoPointersVisualizer';
import { SlidingWindowVisualizer } from './SlidingWindowVisualizer';
import { BinarySearchVisualizer } from './BinarySearchVisualizer';
import { BfsGridVisualizer } from './BfsGridVisualizer';
import { GradientDescentVisualizer } from './GradientDescentVisualizer';
import { Sparkles, ArrowRight, Code2 } from 'lucide-react';

interface VisualizerHubProps {
  onOpenQuestion?: (questionId: string) => void;
  onSelectTab?: (tab: 'two-pointers' | 'sliding-window' | 'binary-search' | 'bfs-grid' | 'gradient-descent') => void;
  initialTab?: 'two-pointers' | 'sliding-window' | 'binary-search' | 'bfs-grid' | 'gradient-descent';
}

export const VisualizerHub: React.FC<VisualizerHubProps> = ({ onOpenQuestion, onSelectTab, initialTab = 'two-pointers' }) => {
  const [activeTab, setActiveTab] = useState<
    'two-pointers' | 'sliding-window' | 'binary-search' | 'bfs-grid' | 'gradient-descent'
  >(initialTab);

  React.useEffect(() => {
    if (initialTab && initialTab !== activeTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const handleTabChange = (tabId: 'two-pointers' | 'sliding-window' | 'binary-search' | 'bfs-grid' | 'gradient-descent') => {
    setActiveTab(tabId);
    onSelectTab?.(tabId);
  };

  const visualizers = [
    {
      id: 'two-pointers',
      name: 'Two Pointers',
      category: 'Algorithms',
      questionId: 'py-08-two-sum-sorted',
      questionTitle: '#8 Two Sum II - Input Array Is Sorted',
      badge: 'O(N) Time | O(1) Space',
      badgeColor: 'border-emerald-500/30 text-emerald-300 bg-emerald-500/10',
      description: 'Inward and fast/slow pointer convergence on sorted arrays or linked lists.',
    },
    {
      id: 'sliding-window',
      name: 'Sliding Window',
      category: 'Algorithms',
      questionId: 'py-09-longest-substring-without-repeats',
      questionTitle: '#9 Longest Substring Without Repeating Characters',
      badge: 'O(N) Dynamic Window',
      badgeColor: 'border-sky-500/30 text-sky-300 bg-sky-500/10',
      description: 'Maintain valid contiguous subarray states with expand & contract pointers.',
    },
    {
      id: 'binary-search',
      name: 'Binary Search',
      category: 'Algorithms',
      questionId: 'py-10-search-rotated-sorted-array',
      questionTitle: '#10 Search in Rotated Sorted Array',
      badge: 'O(log N) Divide & Conquer',
      badgeColor: 'border-violet-500/30 text-violet-300 bg-violet-500/10',
      description: 'Halve the search space by identifying sorted halves in rotated arrays.',
    },
    {
      id: 'bfs-grid',
      name: 'Breadth-First Search (BFS)',
      category: 'Graph Traversal',
      questionId: 'py-13-number-of-islands',
      questionTitle: '#13 Number of Islands (Grid BFS / DFS)',
      badge: 'O(V + E) Queue Level-Order',
      badgeColor: 'border-amber-500/30 text-amber-300 bg-amber-500/10',
      description: 'Layer-by-layer exploration of connected components using a FIFO queue.',
    },
    {
      id: 'gradient-descent',
      name: 'Gradient Descent',
      category: 'ML Engineering',
      questionId: 'py-25-linear-regression-gradient-descent',
      questionTitle: '#25 Ridge Regression & Gradient Descent Step',
      badge: 'Parameter Optimization',
      badgeColor: 'border-purple-500/30 text-purple-300 bg-purple-500/10',
      description: 'Steepest descent parameter updates w := w - α ∇L on continuous loss curves.',
    },
  ] as const;

  const currentVis = visualizers.find(v => v.id === activeTab)!;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold tracking-wider uppercase mb-1">
            <Sparkles className="w-4 h-4" /> Interactive Algorithm Visualizers
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            See the Core Interview Patterns in Action
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Stepping through algorithms visually transforms abstract pointer movements and loss surfaces into intuitive mental models you can recall during coding interviews.
          </p>
        </div>

        {onOpenQuestion && (
          <button
            onClick={() => onOpenQuestion(currentVis.questionId)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition shadow-lg shadow-indigo-600/25 shrink-0"
          >
            <Code2 className="w-4 h-4" />
            Practice {currentVis.questionTitle.split(' ')[0]}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Visualizer Tabs */}
      <div className="flex gap-2 p-1.5 bg-[#161b22] border border-slate-800 rounded-xl overflow-x-auto">
        {visualizers.map(v => (
          <button
            key={v.id}
            onClick={() => handleTabChange(v.id as any)}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === v.id
                ? 'bg-slate-800 text-white font-bold border border-slate-700 shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <span>{v.name}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded border ${v.badgeColor}`}>
              {v.category}
            </span>
          </button>
        ))}
      </div>

      {/* Active Visualizer Panel */}
      <div>
        {activeTab === 'two-pointers' && <TwoPointersVisualizer />}
        {activeTab === 'sliding-window' && <SlidingWindowVisualizer />}
        {activeTab === 'binary-search' && <BinarySearchVisualizer />}
        {activeTab === 'bfs-grid' && <BfsGridVisualizer />}
        {activeTab === 'gradient-descent' && <GradientDescentVisualizer />}
      </div>
    </div>
  );
};
