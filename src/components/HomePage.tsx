import React from 'react';
import {
  Code2,
  Trophy,
  Sparkles,
  BookOpen,
  ArrowRight,
  Terminal,
  Cpu,
  Table,
  Brain,
  CheckCircle2,
  Zap,
  Layers,
  Lightbulb,
  GraduationCap,
} from 'lucide-react';
import { trackMeta, allQuestions } from '../data/questions';
import type { Track } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface HomePageProps {
  solvedCount: number;
  onNavigate: (tab: 'arena' | 'catalog' | 'visualizers' | 'cheatsheet' | 'patterns' | 'quiz') => void;
  onSelectTrack: (track: Track) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  solvedCount,
  onNavigate,
  onSelectTrack,
}) => {
  const { t } = useLanguage();
  const tracks: { key: Track; icon: any }[] = [
    { key: 'fundamentals', icon: Terminal },
    { key: 'algorithms', icon: Cpu },
    { key: 'data-manipulation', icon: Table },
    { key: 'ml-engineering', icon: Brain },
  ];

  return (
    <div className="max-w-[1400px] mx-auto py-8 sm:py-12 space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-6 max-w-3xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>Client-Side Python 3.12 WebAssembly Environment</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          Master Python & ML <br />
          <span className="bg-gradient-to-r from-sky-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent">
            Technical Interviews
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
          30 hand-crafted interview questions spanning language nuances, algorithmic patterns,
          NumPy/Pandas vectorization, and ML engineering. Zero setup required, running entirely
          in your browser.
        </p>

        {/* Hero Quick Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onNavigate('catalog')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-transform active:scale-95"
          >
            <Trophy className="w-4 h-4" />
            <span>Explore All 30 Questions</span>
          </button>

          <button
            onClick={() => onNavigate('patterns')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-600/25 transition-transform active:scale-95"
          >
            <Brain className="w-4 h-4 text-sky-200" />
            <span>Algo Patterns Hub</span>
          </button>

          <button
            onClick={() => onNavigate('quiz')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 hover:from-sky-500 hover:to-purple-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-sky-600/25 transition-transform active:scale-95"
          >
            <GraduationCap className="w-4 h-4 text-sky-200" />
            <span>100 Qs AI & ML Bank</span>
          </button>

          <button
            onClick={() => onNavigate('arena')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs sm:text-sm border border-slate-700 transition-transform active:scale-95"
          >
            <Code2 className="w-4 h-4 text-emerald-400" />
            <span>Open Practice Arena</span>
          </button>

          <button
            onClick={() => onNavigate('visualizers')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#161b22] hover:bg-slate-800 text-slate-300 text-xs sm:text-sm border border-slate-800 transition"
          >
            <Sparkles className="w-4 h-4 text-sky-400" />
            <span>Algorithm Visualizers</span>
          </button>
        </div>

        {/* Progress Counter Banner */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#161b22] border border-slate-800 text-xs text-slate-400 font-mono">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Progress: <strong className="text-white">{solvedCount}</strong> of 30 problems solved</span>
        </div>
      </section>

      {/* Prominent Algo Patterns Hub Feature Callout Banner */}
      <section className="px-4">
        <div className="bg-gradient-to-r from-indigo-950/70 via-slate-900 to-sky-950/50 border border-indigo-500/40 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-300 text-xs font-bold uppercase tracking-wider">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              <span>{t('patternsHeroBadge')}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {t('homePatternBannerTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {t('homePatternBannerDesc')}
            </p>
          </div>

          <button
            onClick={() => onNavigate('patterns')}
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95 shrink-0"
          >
            <Brain className="w-4 h-4" />
            <span>{t('homeExplorePatternsBtn')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Production ML & Full-Stack AI 100 Qs Bank Banner */}
      <section className="px-4">
        <div className="bg-gradient-to-r from-slate-900 via-sky-950/60 to-purple-950/50 border border-sky-500/40 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-300 text-xs font-bold uppercase tracking-wider">
              <GraduationCap className="w-3.5 h-3.5 text-sky-400" />
              <span>{t('quizHeroBadge')}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {t('quizHeroTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {t('quizHeroDesc')}
            </p>
          </div>

          <button
            onClick={() => onNavigate('quiz')}
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-sky-600/30 transition-all hover:scale-105 active:scale-95 shrink-0"
          >
            <GraduationCap className="w-4 h-4" />
            <span>Launch 100 Qs Bank</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 4 Tracks Grid */}
      <section className="space-y-4 px-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-sky-400" />
            <span>Curated Tracks</span>
          </h2>
          <button
            onClick={() => onNavigate('catalog')}
            className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 font-semibold transition"
          >
            View full syllabus <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {tracks.map(({ key, icon: Icon }) => {
            const meta = trackMeta[key];
            const trackQuestions = allQuestions.filter(q => q.track === key);
            return (
              <div
                key={key}
                onClick={() => {
                  onSelectTrack(key);
                  onNavigate('catalog');
                }}
                className="bg-[#161b22] border border-slate-800 hover:border-slate-700 p-5 rounded-2xl flex flex-col justify-between space-y-4 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[#0d1117] border border-slate-800 flex items-center justify-center">
                      <Icon className={`w-5 h-5 ${meta.color}`} />
                    </div>
                    <span className="text-[11px] font-mono font-bold text-slate-400">
                      {trackQuestions.length} Questions
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white group-hover:text-sky-300 transition">
                    {meta.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {meta.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-white transition">
                  <span>Start Track</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4">
        <div
          onClick={() => onNavigate('patterns')}
          className="bg-[#161b22] border border-slate-800 p-5 rounded-2xl space-y-2 cursor-pointer hover:border-indigo-500/40 transition group"
        >
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
            <Brain className="w-4 h-4" />
            <span>Algorithm Patterns</span>
          </div>
          <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition">
            Cognitive Pattern Blueprints
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Multi-tab explanations: Intuition & Metaphor, Pattern Recipe, Interactive Trace, and Interview Traps.
          </p>
        </div>

        <div
          onClick={() => onNavigate('visualizers')}
          className="bg-[#161b22] border border-slate-800 p-5 rounded-2xl space-y-2 cursor-pointer hover:border-sky-500/40 transition group"
        >
          <div className="flex items-center gap-2 text-sky-400 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Interactive Visualizers</span>
          </div>
          <h4 className="text-sm font-bold text-white group-hover:text-sky-300 transition">
            Step-by-Step Algorithm Animations
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Trace Two Pointers, Sliding Windows, Binary Searches, Grid BFS, and Gradient Descent in real time.
          </p>
        </div>

        <div
          onClick={() => onNavigate('cheatsheet')}
          className="bg-[#161b22] border border-slate-800 p-5 rounded-2xl space-y-2 cursor-pointer hover:border-purple-500/40 transition group"
        >
          <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>Interview Cheatsheet</span>
          </div>
          <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition">
            High-Yield Python & ML Tables
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Time & space complexities, Python built-in idioms, NumPy broadcasting rules, and ML loss formulas.
          </p>
        </div>
      </section>
    </div>
  );
};
