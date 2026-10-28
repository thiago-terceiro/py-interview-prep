import React, { useState } from 'react';
import { Link } from '@tanstack/react-router';
import type { AlgoPattern, PatternTabType } from '../../types/patterns';
import { PatternVisualizer } from './PatternVisualizer';
import { SlidingTabs } from '../SlidingTabs';
import { useLanguage } from '../../context/LanguageContext';
import {
  Lightbulb,
  Compass,
  Eye,
  AlertTriangle,
  Code2,
  Clock,
  HardDrive,
  ArrowRight,
  Sparkles,
  ExternalLink,
  BookOpen,
  CheckCircle2,
  History,
  Target,
  Zap,
} from 'lucide-react';

interface PatternDetailProps {
  pattern: AlgoPattern;
  onOpenArenaQuestion: (questionId: string) => void;
  onOpenVisualizerHub?: (visualizerId: string) => void;
}

export const PatternDetail: React.FC<PatternDetailProps> = ({
  pattern,
  onOpenArenaQuestion,
  onOpenVisualizerHub,
}) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<PatternTabType>('intuition');

  const tabs: Array<{
    id: PatternTabType;
    labelKey: 'tabIntuition' | 'tabBlueprint' | 'tabVisual' | 'tabTraps';
    icon: typeof Lightbulb;
  }> = [
    { id: 'intuition', labelKey: 'tabIntuition', icon: Lightbulb },
    { id: 'blueprint', labelKey: 'tabBlueprint', icon: Compass },
    { id: 'visual', labelKey: 'tabVisual', icon: Eye },
    { id: 'traps', labelKey: 'tabTraps', icon: AlertTriangle },
  ];

  return (
    <div className="bg-[#161b22] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Pattern Title Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
              Pattern #{pattern.number}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
              {pattern.category}
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
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

          <h2 className="text-2xl font-black text-white tracking-tight">{pattern.title}</h2>
          <p className="text-sm text-slate-400">{pattern.subtitle}</p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Link
            to="/arena/$questionId"
            params={{ questionId: pattern.relatedQuestionId }}
            onClick={() => onOpenArenaQuestion(pattern.relatedQuestionId)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition shadow-lg shadow-emerald-600/20 active:scale-95 no-underline cursor-pointer"
          >
            <Code2 className="w-4 h-4" />
            <span>{t('openInPracticeArena')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          {pattern.visualizerId && (
            <Link
              to="/visualizers/$tab"
              params={{ tab: pattern.visualizerId }}
              onClick={() => onOpenVisualizerHub?.(pattern.visualizerId!)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium transition active:scale-95 no-underline cursor-pointer"
              title={t('openInteractiveVisualizer')}
            >
              <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden sm:inline">{t('openInteractiveVisualizer')}</span>
            </Link>
          )}
        </div>
      </div>

      {/* Tabs Navigation (Perspective Switcher) with Fast-Sliding Active Container Pill */}
      <SlidingTabs
        tabs={tabs.map(({ id, labelKey, icon }) => ({
          id,
          label: t(labelKey),
          icon,
        }))}
        activeTab={activeTab}
        onChange={(id) => setActiveTab(id as PatternTabType)}
        ariaLabel="Pattern Explanation Perspectives"
      />

      {/* TAB CONTENT PANELS */}

      {/* Tab 1: Intuition & Metaphor */}
      {activeTab === 'intuition' && (
        <section
          id="panel-intuition"
          role="tabpanel"
          aria-labelledby="tab-intuition"
          className="space-y-6 animate-fadeIn"
        >
          {/* Origin & Historical Context */}
          <div className="bg-[#0d1117] border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider">
              <History className="w-4 h-4" />
              <span>{t('historicalOrigin')}</span>
              <span className="text-slate-500 font-mono">
                ({pattern.origin.year} • {pattern.origin.pioneer})
              </span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">{pattern.origin.context}</p>
          </div>

          {/* Why Created & Fundamental Bottleneck */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#0d1117] border border-slate-800 rounded-xl p-5 space-y-2">
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
                <Target className="w-4 h-4" />
                <span>{t('whyCreatedHeader')}</span>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed">{pattern.whyCreated}</p>
            </div>

            <div className="bg-[#0d1117] border border-slate-800 rounded-xl p-5 space-y-2">
              <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold uppercase tracking-wider">
                <Zap className="w-4 h-4" />
                <span>{t('fundamentalBottleneckHeader')}</span>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed">
                {pattern.fundamentalBottleneck}
              </p>
            </div>
          </div>

          {/* The "Aha!" Mental Metaphor */}
          <div className="bg-gradient-to-r from-indigo-950/40 via-[#0d1117] to-slate-900 border border-indigo-500/30 rounded-xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span>{t('ahaMetaphorHeader')}</span>
              <span className="text-white font-semibold">— {pattern.ahaAnalogy.title}</span>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed italic">
              "{pattern.ahaAnalogy.story}"
            </p>
            <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400">
              <span>
                Visual Concept:{' '}
                <strong className="text-sky-300">{pattern.ahaAnalogy.visualConcept}</strong>
              </span>
              <span className="text-emerald-400 font-semibold">
                ✓ {pattern.ahaAnalogy.takeaway}
              </span>
            </div>
          </div>

          {/* Theoretical Breakdown: Core Idea, Naive Failure, Math Invariant */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="bg-[#0d1117] border border-slate-800 rounded-xl p-4 space-y-2">
              <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wide">
                The Core Intuitive Idea
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {pattern.intuition.coreIdea}
              </p>
            </div>

            <div className="bg-[#0d1117] border border-slate-800 rounded-xl p-4 space-y-2">
              <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wide">
                {t('whyNaiveFailsHeader')}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {pattern.intuition.whyNaiveFails}
              </p>
            </div>

            <div className="bg-[#0d1117] border border-slate-800 rounded-xl p-4 space-y-2">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wide">
                {t('mathInsightHeader')}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {pattern.intuition.mathematicalInsight}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Tab 2: Pattern Blueprint & Recipe */}
      {activeTab === 'blueprint' && (
        <section
          id="panel-blueprint"
          role="tabpanel"
          aria-labelledby="tab-blueprint"
          className="space-y-6 animate-fadeIn"
        >
          {/* Trigger Signals */}
          <div className="bg-[#0d1117] border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>{t('triggerSignalsHeader')}</span>
            </div>
            <p className="text-xs text-slate-400">{t('howToSpotIn10s')}</p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
              {pattern.blueprint.triggerSignals.map((signal, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-xs text-slate-200 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{signal}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Step-by-Step Recipe */}
          <div className="bg-[#0d1117] border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-sky-400 text-xs font-semibold uppercase tracking-wider">
              <Compass className="w-4 h-4" />
              <span>{t('algorithmicRecipeHeader')}</span>
            </div>
            <ol className="space-y-2">
              {pattern.blueprint.steps.map((step, idx) => (
                <li
                  key={idx}
                  className="text-xs text-slate-300 font-mono bg-slate-900/40 p-2 rounded-lg border border-slate-800/60 flex items-center gap-2"
                >
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-sky-400 flex items-center justify-center text-[10px] font-bold shrink-0">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Python Production Template */}
          <div className="bg-[#0d1117] border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                <Code2 className="w-4 h-4" />
                <span>{t('productionTemplateHeader')}</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Python 3.12 Standard</span>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 overflow-x-auto text-xs font-mono text-slate-200 leading-relaxed">
              <pre>{pattern.blueprint.codeTemplate}</pre>
            </div>
          </div>

          {/* Complexity Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#0d1117] border border-slate-800 rounded-xl p-4 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20 shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  {t('timeComplexity')}
                </h4>
                <p className="text-xs text-slate-200 font-mono">
                  {pattern.blueprint.complexity.time}
                </p>
              </div>
            </div>

            <div className="bg-[#0d1117] border border-slate-800 rounded-xl p-4 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0">
                <HardDrive className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  {t('spaceComplexity')}
                </h4>
                <p className="text-xs text-slate-200 font-mono">
                  {pattern.blueprint.complexity.space}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Tab 3: Interactive Visual Walkthrough */}
      {activeTab === 'visual' && (
        <section
          id="panel-visual"
          role="tabpanel"
          aria-labelledby="tab-visual"
          className="space-y-6 animate-fadeIn"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Eye className="w-4 h-4 text-sky-400" />
                <span>{t('interactiveVisualizerHeader')}</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Step through state mutations, pointer movements, and invariant changes in real time.
              </p>
            </div>
          </div>

          <PatternVisualizer pattern={pattern} />
        </section>
      )}

      {/* Tab 4: Traps & Interview Variants */}
      {activeTab === 'traps' && (
        <section
          id="panel-traps"
          role="tabpanel"
          aria-labelledby="tab-traps"
          className="space-y-6 animate-fadeIn"
        >
          {/* Subtle Edge Cases & Candidate Traps */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              <span>{t('interviewTrapsHeader')}</span>
            </h3>

            <div className="space-y-3">
              {pattern.traps.map((trap, idx) => (
                <div
                  key={idx}
                  className="bg-[#0d1117] border border-amber-500/20 rounded-xl p-4 space-y-2"
                >
                  <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                    <span className="text-amber-400 font-mono">⚠️ Trap #{idx + 1}:</span>
                    <span>{trap.title}</span>
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed pl-6">
                    {trap.explanation}
                  </p>
                  <div className="pl-6 pt-1 text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>
                      {t('mitigation')}: {trap.mitigation}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Classic Interview Variations */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span>{t('interviewVariantsHeader')}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[...pattern.interviewVariants]
                .sort((a, b) => {
                  const weight: Record<'Easy' | 'Medium' | 'Hard', number> = {
                    Easy: 1,
                    Medium: 2,
                    Hard: 3,
                  };
                  return weight[a.difficulty] - weight[b.difficulty];
                })
                .map((variant, idx) => (
                <div
                  key={idx}
                  className="bg-[#0d1117] border border-slate-800 rounded-xl p-4 space-y-2 flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{variant.name}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                          variant.difficulty === 'Easy'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : variant.difficulty === 'Medium'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {variant.difficulty}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      <strong className="text-slate-300">{t('twistToWatch')}:</strong>{' '}
                      {variant.twist}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
