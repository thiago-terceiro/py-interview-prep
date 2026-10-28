import React, { useState, useMemo } from 'react';
import { algoPatterns } from '../../data/algoPatterns';
import { PatternDetail } from './PatternDetail';
import { PageHeaderCard } from '../PageHeaderCard';
import type { PatternCategory, PatternDifficulty } from '../../types/patterns';
import { useLanguage } from '../../context/LanguageContext';
import {
  Search,
  Filter,
  ChevronRight,
  Zap,
} from 'lucide-react';

interface AlgoPatternsViewProps {
  onOpenArenaQuestion: (questionId: string) => void;
  onOpenVisualizerHub?: (visualizerId: string) => void;
  onSelectPattern?: (patternId: string) => void;
  initialPatternId?: string;
}

export const AlgoPatternsView: React.FC<AlgoPatternsViewProps> = ({
  onOpenArenaQuestion,
  onOpenVisualizerHub,
  onSelectPattern,
  initialPatternId,
}) => {
  const { t } = useLanguage();
  const [selectedPatternId, setSelectedPatternId] = useState<string>(
    initialPatternId || algoPatterns[0].id
  );
  const [prevInitialPatternId, setPrevInitialPatternId] = useState(initialPatternId);

  if (initialPatternId !== prevInitialPatternId) {
    setPrevInitialPatternId(initialPatternId);
    if (initialPatternId) {
      setSelectedPatternId(initialPatternId);
    }
  }

  const handlePatternClick = (id: string) => {
    setSelectedPatternId(id);
    onSelectPattern?.(id);
  };
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<PatternCategory | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<PatternDifficulty | 'all'>('all');

  const categories: Array<PatternCategory | 'all'> = [
    'all',
    'Two Pointers & Window',
    'Search & Divide',
    'Data Structures & LIFO',
    'Graphs & Trees',
    'Optimization & DP',
    'Prefix & Hashes',
    'System Caching',
  ];

  const filteredPatterns = useMemo(() => {
    const list = algoPatterns.filter(pattern => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        pattern.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pattern.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pattern.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        pattern.origin.pioneer.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === 'all' || pattern.category === selectedCategory;
      const matchesDifficulty =
        selectedDifficulty === 'all' || pattern.difficulty === selectedDifficulty;

      return matchesSearch && matchesCategory && matchesDifficulty;
    });

    const difficultyWeight: Record<PatternDifficulty, number> = {
      Foundational: 1,
      Intermediate: 2,
      Advanced: 3,
    };

    return list.sort((a, b) => {
      const diff = difficultyWeight[a.difficulty] - difficultyWeight[b.difficulty];
      if (diff !== 0) return diff;
      return a.number - b.number;
    });
  }, [searchQuery, selectedCategory, selectedDifficulty]);

  const activePattern =
    algoPatterns.find(p => p.id === selectedPatternId) || filteredPatterns[0] || algoPatterns[0];

  return (
    <div className="max-w-[1700px] mx-auto space-y-6 pb-16">
      {/* Reusable Fixed-Height Header Card - Zero CLS */}
      <PageHeaderCard
        badgeIcon={Zap}
        badgeText={t('patternsHeroBadge')}
        badgeColor="text-indigo-400"
        title={t('patternsHeroTitle')}
        description={t('patternsHeroDesc')}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs px-3 py-1.5 rounded-xl font-medium font-mono">
              {algoPatterns.length} Core Blueprints
            </span>
          </div>
        }
      />

      {/* Quick Metrics Bar - Pushed down outside card for identical height */}
      <div className="flex flex-wrap items-center gap-4 sm:gap-6 px-1 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>
            <strong className="text-white font-mono">{algoPatterns.length}</strong> Core Patterns
          </span>
        </div>
        <span>•</span>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-sky-400"></span>
          <span>
            <strong className="text-white font-mono">4</strong> Cognitive Layers per Pattern
          </span>
        </div>
        <span>•</span>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
          <span>Interactive Step-by-Step Visualizers</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#161b22] border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={t('searchPatternsPlaceholder')}
            className="w-full bg-[#0d1117] border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs text-slate-400 font-medium shrink-0 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            {t('category')}:
          </span>
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value as any)}
            className="bg-[#0d1117] border border-slate-700 text-xs text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-sky-500"
          >
            <option value="all">{t('allCategories')}</option>
            {categories
              .filter(c => c !== 'all')
              .map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
          </select>

          {/* Difficulty Filter */}
          <select
            value={selectedDifficulty}
            onChange={e => setSelectedDifficulty(e.target.value as any)}
            className="bg-[#0d1117] border border-slate-700 text-xs text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-sky-500"
            aria-label={t('filterByDifficulty')}
          >
            <option value="all">{t('allDifficulties')}</option>
            <option value="Foundational">{t('patternFoundational')}</option>
            <option value="Intermediate">{t('patternIntermediate')}</option>
            <option value="Advanced">{t('patternAdvanced')}</option>
          </select>
        </div>
      </div>

      {/* Main Content Layout: Left Sidebar + Right Pattern Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sidebar List (4 cols) */}
        <aside className="lg:col-span-4 space-y-2">
          <div className="flex items-center justify-between px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            <span>Pattern Navigation</span>
            <span className="text-slate-500 font-mono">
              {filteredPatterns.length} {t('patternsFound')}
            </span>
          </div>

          <div className="space-y-2 max-h-[780px] overflow-y-auto pr-1">
            {filteredPatterns.map(pattern => {
              const isSelected = pattern.id === activePattern.id;
              return (
                <div
                  key={pattern.id}
                  onClick={() => handlePatternClick(pattern.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all duration-150 text-left group ${
                    isSelected
                      ? 'bg-slate-800 border-sky-500/50 shadow-lg shadow-sky-500/10'
                      : 'bg-[#161b22] border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold font-mono text-indigo-400">
                      Pattern #{pattern.number}
                    </span>
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full font-semibold ${
                        pattern.difficulty === 'Foundational'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : pattern.difficulty === 'Intermediate'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {pattern.difficulty}
                    </span>
                  </div>

                  <h3
                    className={`text-sm font-bold mt-1 line-clamp-1 transition-colors ${
                      isSelected ? 'text-white' : 'text-slate-200 group-hover:text-sky-300'
                    }`}
                  >
                    {pattern.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                    {pattern.subtitle}
                  </p>

                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-800/60 text-[10px] text-slate-500 font-mono">
                    <span className="truncate max-w-[180px]">{pattern.category}</span>
                    <span className="flex items-center gap-1 text-sky-400 group-hover:translate-x-0.5 transition-transform">
                      Inspect <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}

            {filteredPatterns.length === 0 && (
              <div className="text-center py-12 text-slate-500 text-xs">
                No patterns match your filter criteria.
              </div>
            )}
          </div>
        </aside>

        {/* Right Active Pattern Detail (8 cols) */}
        <main className="lg:col-span-8">
          {activePattern ? (
            <PatternDetail
              pattern={activePattern}
              onOpenArenaQuestion={onOpenArenaQuestion}
              onOpenVisualizerHub={onOpenVisualizerHub}
            />
          ) : (
            <div className="bg-[#161b22] border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
              {t('selectPatternToExplore')}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
