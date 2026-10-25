import React, { useState, useMemo } from 'react';
import type { Track, Difficulty } from '../types';

import { allQuestions, trackMeta } from '../data/questions';
import {
  Search,
  CheckCircle2,
  Circle,
  Eye,
  Code2,
  Terminal,
  Cpu,
  Table,
  Brain,
  Filter,
} from 'lucide-react';

interface QuestionCatalogProps {
  solvedQuestionIds: string[];
  onSelectQuestion: (questionId: string) => void;
  onToggleQuestionSolved?: (questionId: string) => void;
  onOpenVisualizer: (visualizerId: string) => void;
  initialTrack?: Track | 'all';
}

export const QuestionCatalog: React.FC<QuestionCatalogProps> = ({
  solvedQuestionIds,
  onSelectQuestion,
  onToggleQuestionSolved,
  onOpenVisualizer,
  initialTrack = 'all',
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTrack, setSelectedTrack] = useState<Track | 'all'>(initialTrack);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'solved' | 'unsolved'>('all');

  const solvedSet = useMemo(() => new Set(solvedQuestionIds), [solvedQuestionIds]);

  // Pre-calculate track counts so clicking a category does not recompute stats
  const trackCounts = useMemo(() => {
    const counts: Record<string, { total: number; solved: number }> = {};
    (Object.keys(trackMeta) as Track[]).forEach(t => {
      const qList = allQuestions.filter(q => q.track === t);
      counts[t] = {
        total: qList.length,
        solved: qList.filter(q => solvedSet.has(q.id)).length,
      };
    });
    return counts;
  }, [solvedSet]);

  const filteredQuestions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return allQuestions.filter(q => {
      if (query) {
        const matchTitle = q.title.toLowerCase().includes(query);
        const matchTags = q.tags.some(t => t.toLowerCase().includes(query));
        const matchSummary = q.summary.toLowerCase().includes(query);
        if (!matchTitle && !matchTags && !matchSummary) return false;
      }

      if (selectedTrack !== 'all' && q.track !== selectedTrack) {
        return false;
      }

      if (selectedDifficulty !== 'all' && q.difficulty !== selectedDifficulty) {
        return false;
      }

      if (statusFilter === 'solved' && !solvedSet.has(q.id)) {
        return false;
      }
      if (statusFilter === 'unsolved' && solvedSet.has(q.id)) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedTrack, selectedDifficulty, statusFilter, solvedSet]);

  const totalQuestions = allQuestions.length;
  const totalSolved = solvedQuestionIds.length;
  const completionPercentage = Math.round((totalSolved / totalQuestions) * 100);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Overview Stats Bar */}
      <div className="bg-[#161b22] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Python Technical Interview Curriculum
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              30 curated interview questions spanning core fundamentals to transformer attention mechanics.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-[#0d1117] px-5 py-3 rounded-xl border border-slate-800">
            <div>
              <div className="text-xs text-slate-400">Total Progress</div>
              <div className="text-2xl font-black text-white font-mono">
                {totalSolved} <span className="text-sm font-normal text-slate-500">/ {totalQuestions}</span>
              </div>
            </div>
            <div className="w-16 h-16 relative flex items-center justify-center">
              <span className="text-sm font-bold text-emerald-400 font-mono">
                {completionPercentage}%
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200 dark:bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-300/60 dark:border-slate-800">
          <div
            className="bg-gradient-to-r from-emerald-500 via-sky-500 to-indigo-500 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>

        {/* Tracks Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {(Object.keys(trackMeta) as Track[]).map(t => {
            const meta = trackMeta[t];
            const stat = trackCounts[t] || { total: 0, solved: 0 };
            const isSelected = selectedTrack === t;

            return (
              <button
                key={t}
                onClick={() => setSelectedTrack(isSelected ? 'all' : t)}
                className={`text-left p-4 rounded-xl border select-none active:scale-[0.98] ${
                  isSelected
                    ? 'bg-slate-800 border-indigo-500/80 shadow-md ring-1 ring-indigo-500/40'
                    : 'bg-[#0d1117] border-slate-800 hover:border-slate-700 hover:bg-slate-800/30'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {t === 'fundamentals' && <Terminal className={`w-4 h-4 ${meta.color}`} />}
                    {t === 'algorithms' && <Cpu className={`w-4 h-4 ${meta.color}`} />}
                    {t === 'data-manipulation' && <Table className={`w-4 h-4 ${meta.color}`} />}
                    {t === 'ml-engineering' && <Brain className={`w-4 h-4 ${meta.color}`} />}
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{meta.title}</span>
                  </div>
                  <span className="text-xs font-mono text-slate-400">
                    {stat.solved}/{stat.total}
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-300/60 dark:border-transparent">
                  <div
                    className="h-1.5 rounded-full"
                    style={{
                      backgroundColor: meta.accentColor,
                      width: stat.total > 0 ? `${(stat.solved / stat.total) * 100}%` : '0%',
                    }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search questions by title, tags, or concepts (e.g. 'softmax', 'two pointers', 'pandas')..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#161b22] border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <div className="flex items-center gap-1.5 bg-[#161b22] border border-slate-800 p-1 rounded-xl text-xs">
            <span className="text-slate-500 px-2 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Level:
            </span>
            {(['all', 'Easy', 'Medium'] as const).map(diff => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-2.5 py-1 rounded-lg capitalize transition ${
                  selectedDifficulty === diff
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 bg-[#161b22] border border-slate-800 p-1 rounded-xl text-xs">
            {(['all', 'unsolved', 'solved'] as const).map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-2.5 py-1 rounded-lg capitalize transition ${
                  statusFilter === status
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Questions List Table */}
      <div className="bg-[#161b22] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="divide-y divide-slate-800/80">
          {filteredQuestions.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              No questions found matching your search filter.
            </div>
          ) : (
            filteredQuestions.map(q => {
              const isSolved = solvedSet.has(q.id);
              const meta = trackMeta[q.track];

              return (
                <div
                  key={q.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-800/40 transition group"
                >
                  <div className="flex items-start gap-3.5 flex-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onToggleQuestionSolved) {
                          onToggleQuestionSolved(q.id);
                        }
                      }}
                      className="mt-1 shrink-0 text-slate-500 hover:scale-110 active:scale-95 transition-transform"
                      title={isSolved ? 'Mark as unsolved' : 'Mark as completed'}
                      aria-label={isSolved ? 'Mark as unsolved' : 'Mark as completed'}
                    >
                      {isSolved ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 hover:text-emerald-300 transition-colors" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-500 hover:text-emerald-400 transition-colors" />
                      )}
                    </button>

                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-mono font-bold text-slate-400">
                          #{q.number}
                        </span>
                        <button
                          onClick={() => onSelectQuestion(q.id)}
                          className="text-base font-semibold text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition text-left cursor-pointer"
                        >
                          {q.title}
                        </button>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full border ${meta.badgeBg}`}
                        >
                          {meta.title}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                            q.difficulty === 'Easy'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {q.difficulty}
                        </span>
                      </div>

                      <p className="text-xs text-slate-400 line-clamp-1 max-w-2xl">
                        {q.summary}
                      </p>

                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {q.tags.map(tag => (
                          <span
                            key={tag}
                            className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800 font-mono"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {q.visualizerId && (
                      <button
                        onClick={() => onOpenVisualizer(q.visualizerId!)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-950/60 text-indigo-300 border border-indigo-700/50 hover:bg-indigo-900/80 text-xs font-medium transition"
                        title="View Interactive Visualizer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Visualizer</span>
                      </button>
                    )}

                    <button
                      onClick={() => onSelectQuestion(q.id)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow-md shadow-emerald-500/20"
                    >
                      <Code2 className="w-3.5 h-3.5" />
                      Solve
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
