import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  AlertTriangle,
  Cpu,
  Table,
  Brain,
  Search,
  Check,
  Copy,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Layers,
  Zap,
  HelpCircle,
  Filter,
  X,
} from 'lucide-react';
import {
  pythonCatches,
  mlTransformerTips,
  complexityTableData,
  numpyTipsData,
  type PythonCatch,
  type MLTransformerTip,
} from '../data/cheatsheetData';
import { useLanguage } from '../context/LanguageContext';
import { PageHeaderCard } from './PageHeaderCard';
import { SlidingTabs, type TabItem } from './SlidingTabs';

type CheatsheetTab = 'all' | 'python' | 'ml' | 'complexity' | 'numpy';

export const CheatsheetView: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<CheatsheetTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  const handleCopy = (id: string, code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const toggleExpand = (id: string) => {
    setExpandedCards((prev) => ({
      ...prev,
      [id]: prev[id] === undefined ? false : !prev[id], // Default is open, so first toggle collapses
    }));
  };

  const isCardExpanded = (id: string) => {
    return expandedCards[id] !== false; // default to expanded
  };

  // Filtered Python Catches
  const filteredPython = useMemo(() => {
    if (!searchQuery.trim()) return pythonCatches;
    const q = searchQuery.toLowerCase();
    return pythonCatches.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.trap.toLowerCase().includes(q) ||
        item.why.toLowerCase().includes(q) ||
        item.tip.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.badCode.toLowerCase().includes(q) ||
        item.goodCode.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Filtered ML & Transformer Tips
  const filteredML = useMemo(() => {
    if (!searchQuery.trim()) return mlTransformerTips;
    const q = searchQuery.toLowerCase();
    return mlTransformerTips.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.concept.toLowerCase().includes(q) ||
        item.interviewGotcha.toLowerCase().includes(q) ||
        item.takeaway.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.formula && item.formula.toLowerCase().includes(q)) ||
        item.codeSnippet.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const totalResultsCount =
    (activeTab === 'all' || activeTab === 'python' ? filteredPython.length : 0) +
    (activeTab === 'all' || activeTab === 'ml' ? filteredML.length : 0);

  const pythonCategoryBadges: Record<PythonCatch['category'], { label: string; color: string }> = {
    mutability: { label: 'Mutability', color: 'bg-rose-500/10 text-rose-400 border-rose-500/30' },
    scoping: { label: 'Scoping & Closures', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
    semantics: { label: 'CPython Semantics', color: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
    performance: { label: 'Performance & Memory', color: 'bg-sky-500/10 text-sky-400 border-sky-500/30' },
    'control-flow': { label: 'Control Flow', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
  };

  const mlCategoryBadges: Record<MLTransformerTip['category'], { label: string; color: string }> = {
    'attention-arch': { label: 'Attention & Architecture', color: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
    'numerical-stability': { label: 'Numerical Precision', color: 'bg-rose-500/10 text-rose-400 border-rose-500/30' },
    'llm-inference': { label: 'LLM Serving & KV Cache', color: 'bg-sky-500/10 text-sky-400 border-sky-500/30' },
    'training-optimization': { label: 'Training & Backprop', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
    'data-evaluation': { label: 'Metrics & Data Leakage', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
  };

  const tabItems: TabItem<CheatsheetTab>[] = [
    {
      id: 'all',
      label: t('cheatsheetTabAll'),
      icon: Layers,
      count: pythonCatches.length + mlTransformerTips.length,
    },
    {
      id: 'python',
      label: t('cheatsheetTabPython'),
      icon: AlertTriangle,
      count: filteredPython.length,
      badgeColor: 'border-amber-500/40 text-amber-400',
    },
    {
      id: 'ml',
      label: t('cheatsheetTabML'),
      icon: Brain,
      count: filteredML.length,
      badgeColor: 'border-purple-500/40 text-purple-400',
    },
    {
      id: 'complexity',
      label: t('cheatsheetTabComplexity'),
      icon: Cpu,
    },
    {
      id: 'numpy',
      label: t('cheatsheetTabNumpy'),
      icon: Table,
    },
  ];

  return (
    <main className="max-w-[1700px] w-full mx-auto space-y-6 pb-16">
      {/* Reusable Fixed-Height Header Card - Zero CLS */}
      <PageHeaderCard
        badgeIcon={BookOpen}
        badgeText={t('cheatsheetHeroBadge')}
        badgeColor="text-sky-400"
        title={t('cheatsheetHeroTitle')}
        description={t('cheatsheetHeroDesc')}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs px-2.5 py-1.5 rounded-xl font-medium font-mono">
              {pythonCatches.length} {t('cheatsheetTabPython')}
            </span>
            <span className="bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs px-2.5 py-1.5 rounded-xl font-medium font-mono">
              {mlTransformerTips.length} {t('cheatsheetTabML')}
            </span>
          </div>
        }
      />

      {/* Search Input - Pushed down outside the header card to preserve fixed card height */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('cheatsheetSearchPlaceholder')}
            className="w-full bg-[#161b22] border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-100 placeholder-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:border-sky-400 transition"
            aria-label={t('cheatsheetSearchPlaceholder')}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 rounded-lg focus-visible:ring-2 focus-visible:ring-sky-400"
              aria-label={t('cheatsheetResetFilter')}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs with Fast-Sliding Active Container Pill */}
      <SlidingTabs
        tabs={tabItems}
        activeTab={activeTab}
        onChange={(id) => setActiveTab(id)}
        ariaLabel="Cheatsheet topic selection"
      />

      {/* No Results Screen */}
      {searchQuery && totalResultsCount === 0 && (
        <div className="bg-[#161b22] border border-slate-800 rounded-2xl p-8 text-center space-y-4">
          <HelpCircle className="w-12 h-12 text-slate-500 mx-auto" />
          <p className="text-slate-300 font-medium">{t('cheatsheetNoResults')}</p>
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-sky-500/20 border border-sky-500/30 text-sky-400 hover:bg-sky-500/30 rounded-xl text-sm font-semibold transition"
          >
            <RotateCcwIcon className="w-4 h-4" />
            {t('cheatsheetResetFilter')}
          </button>
        </div>
      )}

      {/* SECTION 1: PYTHON INTERVIEW CATCHES */}
      {(activeTab === 'all' || activeTab === 'python') && filteredPython.length > 0 && (
        <section aria-labelledby="python-catches-title" className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5 text-amber-400 font-bold text-lg sm:text-xl">
              <AlertTriangle className="w-6 h-6" />
              <h2 id="python-catches-title">{t('cheatsheetTabPython')}</h2>
              <span className="text-xs font-mono font-normal text-slate-400 bg-slate-800 px-2.5 py-0.5 rounded-full">
                {filteredPython.length} {t('cheatsheetHeroBadge')}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5">
            {filteredPython.map((item, idx) => {
              const isExpanded = isCardExpanded(item.id);
              const badge = pythonCategoryBadges[item.category];

              return (
                <article
                  key={item.id}
                  className="bg-[#161b22] border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-md transition hover:border-slate-700/80 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-start gap-3">
                      <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono font-bold text-xs shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                          {item.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full border ${badge.color}`}
                          >
                            {badge.label}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleExpand(item.id)}
                      className="self-end sm:self-center text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 transition min-h-[36px]"
                      aria-expanded={isExpanded}
                      aria-label={`${item.title} details`}
                    >
                      <span>{isExpanded ? 'Collapse' : 'Details'}</span>
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  {/* Trap & Why */}
                  <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-3.5 text-xs sm:text-sm space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="font-semibold text-rose-400 shrink-0">
                        {t('cheatsheetTheTrap')}:
                      </span>
                      <span className="text-slate-200">{item.trap}</span>
                    </div>
                    <div className="flex items-start gap-2 text-slate-400 border-t border-slate-800 pt-2">
                      <span className="font-semibold text-sky-400 shrink-0">
                        {t('cheatsheetWhyItHappens')}:
                      </span>
                      <span className="text-slate-300">{item.why}</span>
                    </div>
                  </div>

                  {/* Expandable Code Comparison */}
                  {isExpanded && (
                    <div className="space-y-4 pt-1 animate-fadeIn">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Flawed Code */}
                        <div className="bg-[#0d1117] border border-rose-500/20 rounded-xl overflow-hidden">
                          <div className="flex items-center justify-between px-3 py-1.5 bg-rose-950/30 border-b border-rose-500/20 text-[11px] text-rose-400 font-semibold">
                            <span>{t('cheatsheetFlawedCode')}</span>
                          </div>
                          <pre className="p-3 font-mono text-xs text-rose-200/90 overflow-x-auto leading-relaxed">
                            <code>{item.badCode}</code>
                          </pre>
                        </div>

                        {/* Good Code */}
                        <div className="bg-[#0d1117] border border-emerald-500/30 rounded-xl overflow-hidden relative group">
                          <div className="flex items-center justify-between px-3 py-1.5 bg-emerald-950/30 border-b border-emerald-500/20 text-[11px] text-emerald-400 font-semibold">
                            <span>{t('cheatsheetCleanCode')}</span>
                            <button
                              type="button"
                              onClick={() => handleCopy(item.id, item.goodCode)}
                              className="text-slate-400 hover:text-white flex items-center gap-1 p-1 rounded transition"
                              title={t('cheatsheetCopyCode')}
                              aria-label={t('cheatsheetCopyCode')}
                            >
                              {copiedId === item.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                              <span>{copiedId === item.id ? t('cheatsheetCopied') : ''}</span>
                            </button>
                          </div>
                          <pre className="p-3 font-mono text-xs text-emerald-300/90 overflow-x-auto leading-relaxed">
                            <code>{item.goodCode}</code>
                          </pre>
                        </div>
                      </div>

                      {/* Pro tip callout */}
                      <div className="flex items-start gap-2 text-xs bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-3 text-slate-300">
                        <Zap className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-emerald-300">{t('cheatsheetProFix')}: </strong>
                          <span>{item.tip}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* SECTION 2: ML & TRANSFORMERS CORE INVARIANTS */}
      {(activeTab === 'all' || activeTab === 'ml') && filteredML.length > 0 && (
        <section aria-labelledby="ml-tips-title" className="space-y-4 pt-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5 text-purple-400 font-bold text-lg sm:text-xl">
              <Brain className="w-6 h-6" />
              <h2 id="ml-tips-title">{t('cheatsheetTabML')}</h2>
              <span className="text-xs font-mono font-normal text-slate-400 bg-slate-800 px-2.5 py-0.5 rounded-full">
                {filteredML.length} {t('cheatsheetHeroBadge')}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5">
            {filteredML.map((item, idx) => {
              const isExpanded = isCardExpanded(item.id);
              const badge = mlCategoryBadges[item.category];

              return (
                <article
                  key={item.id}
                  className="bg-[#161b22] border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-md transition hover:border-slate-700/80 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-start gap-3">
                      <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400 font-mono font-bold text-xs shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                          {item.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full border ${badge.color}`}
                          >
                            {badge.label}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleExpand(item.id)}
                      className="self-end sm:self-center text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 transition min-h-[36px]"
                      aria-expanded={isExpanded}
                      aria-label={`${item.title} details`}
                    >
                      <span>{isExpanded ? 'Collapse' : 'Details'}</span>
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  {/* Concept & Formula */}
                  <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl p-3.5 text-xs sm:text-sm space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="font-semibold text-purple-400 shrink-0">
                        {t('cheatsheetConcept')}:
                      </span>
                      <span className="text-slate-200">{item.concept}</span>
                    </div>

                    {item.formula && (
                      <div className="flex items-start gap-2 border-t border-slate-800/80 pt-2 font-mono text-xs text-sky-300">
                        <span className="font-semibold text-sky-400 shrink-0 font-sans">
                          {t('cheatsheetMathematicalFormula')}:
                        </span>
                        <code className="bg-[#0d1117] px-2 py-0.5 rounded text-sky-200">
                          {item.formula}
                        </code>
                      </div>
                    )}
                  </div>

                  {/* Expandable Details & PyTorch Code */}
                  {isExpanded && (
                    <div className="space-y-4 pt-1 animate-fadeIn">
                      {/* Gotcha in Interviews */}
                      <div className="bg-amber-950/20 border border-amber-500/20 rounded-xl p-3 text-xs text-slate-200 space-y-1">
                        <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>{t('cheatsheetInterviewGotcha')}</span>
                        </div>
                        <p className="text-slate-300 leading-relaxed pl-5">
                          {item.interviewGotcha}
                        </p>
                      </div>

                      {/* Code Snippet */}
                      <div className="bg-[#0d1117] border border-slate-700/80 rounded-xl overflow-hidden relative">
                        <div className="flex items-center justify-between px-3 py-1.5 bg-slate-800/60 border-b border-slate-700/50 text-[11px] text-slate-300 font-semibold">
                          <span>{t('cheatsheetCodeImplementation')}</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(item.id, item.codeSnippet)}
                            className="text-slate-400 hover:text-white flex items-center gap-1 p-1 rounded transition"
                            title={t('cheatsheetCopyCode')}
                            aria-label={t('cheatsheetCopyCode')}
                          >
                            {copiedId === item.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                            <span>{copiedId === item.id ? t('cheatsheetCopied') : ''}</span>
                          </button>
                        </div>
                        <pre className="p-3 font-mono text-xs text-slate-200 overflow-x-auto leading-relaxed">
                          <code>{item.codeSnippet}</code>
                        </pre>
                      </div>

                      {/* Takeaway */}
                      <div className="flex items-start gap-2 text-xs bg-purple-500/5 border border-purple-500/20 rounded-xl p-3 text-slate-300">
                        <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-purple-300">{t('cheatsheetKeyTakeaway')}: </strong>
                          <span>{item.takeaway}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* SECTION 3: PYTHON DATA STRUCTURE TIME COMPLEXITIES TABLE */}
      {(activeTab === 'all' || activeTab === 'complexity') && (
        <section aria-labelledby="complexity-title" className="space-y-4 pt-4">
          <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-lg sm:text-xl border-b border-slate-800 pb-3">
            <Cpu className="w-6 h-6" />
            <h2 id="complexity-title">{t('cheatsheetTabComplexity')}</h2>
          </div>

          <div className="bg-[#161b22] border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-700 text-slate-400">
                    <th className="pb-3 pr-4 font-sans font-semibold">Operation</th>
                    <th className="pb-3 px-3">list</th>
                    <th className="pb-3 px-3">collections.deque</th>
                    <th className="pb-3 px-3">dict / set</th>
                    <th className="pb-3 pl-3">heapq</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-200">
                  {complexityTableData.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-800/30 transition">
                      <td className="py-2.5 pr-4 text-slate-300 font-sans font-medium">{row.operation}</td>
                      <td
                        className={`py-2.5 px-3 ${
                          row.list.includes('O(1)') ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {row.list}
                      </td>
                      <td className="py-2.5 px-3 text-emerald-400 font-semibold">{row.deque}</td>
                      <td className="py-2.5 px-3 text-emerald-400">{row.dictSet}</td>
                      <td className="py-2.5 pl-3 text-amber-400">{row.heapq}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-xs text-slate-400 pt-2 border-t border-slate-800">
              * Amortized O(1). <strong>Queue Warning:</strong> Never use{' '}
              <code className="text-rose-300 bg-rose-950/40 px-1 py-0.5 rounded">list.pop(0)</code>{' '}
              in BFS graph traversals ($O(N)$ shift). Always use{' '}
              <code className="text-emerald-300 bg-emerald-950/40 px-1 py-0.5 rounded">
                collections.deque.popleft()
              </code>{' '}
              ($O(1)$ pointer update).
            </p>
          </div>
        </section>
      )}

      {/* SECTION 4: NUMPY & VECTORIZATION CHEAT SHEET */}
      {(activeTab === 'all' || activeTab === 'numpy') && (
        <section aria-labelledby="numpy-title" className="space-y-4 pt-4">
          <div className="flex items-center gap-2.5 text-sky-400 font-bold text-lg sm:text-xl border-b border-slate-800 pb-3">
            <Table className="w-6 h-6" />
            <h2 id="numpy-title">{t('cheatsheetTabNumpy')}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {numpyTipsData.map((tip, idx) => (
              <article
                key={idx}
                className="bg-[#161b22] border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3"
              >
                <div className="flex items-center gap-2 text-sky-300 font-bold text-sm">
                  <Filter className="w-4 h-4 text-sky-400" />
                  <h3>{tip.title}</h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{tip.desc}</p>
                <div className="bg-[#0d1117] border border-slate-700/60 rounded-xl p-3 font-mono text-xs text-sky-200 overflow-x-auto">
                  <code>{tip.code}</code>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  );
};

// Helper icon component
function RotateCcwIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}
