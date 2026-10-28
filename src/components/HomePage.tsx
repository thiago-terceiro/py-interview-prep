import React from 'react';
import { Link } from '@tanstack/react-router';
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
    <div className="max-w-[1700px] w-full mx-auto py-8 sm:py-12 space-y-12 pb-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-950/40 via-[#0d1117] to-slate-900 border border-slate-800 p-8 sm:p-12 rounded-3xl relative overflow-hidden shadow-2xl text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold tracking-wider uppercase">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>Client-Side Python 3.12 WebAssembly Environment</span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight">
          Master Python & ML <br />
          <span className="bg-gradient-to-r from-sky-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent">
            Technical Interviews
          </span>
        </h1>

        <p className="text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
          30 hand-crafted interview questions spanning language nuances, algorithmic patterns,
          NumPy/Pandas vectorization, and ML engineering. Zero setup required, running entirely
          in your browser.
        </p>

        {/* Hero Quick Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            to="/catalog"
            onClick={() => onNavigate('catalog')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-transform active:scale-95 no-underline cursor-pointer"
          >
            <Trophy className="w-4 h-4" />
            <span>Explore All 30 Questions</span>
          </Link>

          <Link
            to="/patterns"
            onClick={() => onNavigate('patterns')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-600/25 transition-transform active:scale-95 no-underline cursor-pointer"
          >
            <Brain className="w-4 h-4 text-sky-200" />
            <span>Algo Patterns Hub</span>
          </Link>

          <Link
            to="/quiz"
            onClick={() => onNavigate('quiz')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 hover:from-sky-500 hover:to-purple-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-sky-600/25 transition-transform active:scale-95 no-underline cursor-pointer"
          >
            <GraduationCap className="w-4 h-4 text-sky-200" />
            <span>100 Qs AI & ML Bank</span>
          </Link>

          <Link
            to="/arena"
            onClick={() => onNavigate('arena')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs sm:text-sm border border-slate-700 transition-transform active:scale-95 no-underline cursor-pointer"
          >
            <Code2 className="w-4 h-4 text-emerald-400" />
            <span>Open Practice Arena</span>
          </Link>

          <Link
            to="/visualizers"
            onClick={() => onNavigate('visualizers')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#161b22] hover:bg-slate-800 text-slate-300 text-xs sm:text-sm border border-slate-800 transition no-underline cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-sky-400" />
            <span>Algorithm Visualizers</span>
          </Link>
        </div>

        {/* Progress Counter Banner */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#161b22] border border-slate-800 text-xs text-slate-400 font-mono">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Progress: <strong className="text-white">{solvedCount}</strong> of 30 problems solved</span>
        </div>
      </section>

      {/* Prominent Algo Patterns Hub Feature Callout Banner */}
      <section className="px-4">
        <div className="bg-gradient-to-r from-indigo-950/40 via-[#0d1117] to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-300 text-xs font-bold uppercase tracking-wider">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              <span>{t('patternsHeroBadge')}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {t('homePatternBannerTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              {t('homePatternBannerDesc')}
            </p>
          </div>

          <Link
            to="/patterns"
            onClick={() => onNavigate('patterns')}
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95 shrink-0 no-underline cursor-pointer"
          >
            <Brain className="w-4 h-4" />
            <span>{t('homeExplorePatternsBtn')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Production ML & Full-Stack AI 100 Qs Bank Banner */}
      <section className="px-4">
        <div className="bg-gradient-to-r from-indigo-950/40 via-[#0d1117] to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
          <div className="space-y-3 max-w-2xl">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {t('quizHeroTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              {t('quizHeroDesc')}
            </p>
          </div>

          <Link
            to="/quiz"
            onClick={() => onNavigate('quiz')}
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-sky-600/30 transition-all hover:scale-105 active:scale-95 shrink-0 no-underline cursor-pointer"
          >
            <GraduationCap className="w-4 h-4" />
            <span>Launch 100 Qs Bank</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 4 Tracks Grid */}
      <section className="space-y-4 px-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-sky-400" />
            <span>Curated Tracks</span>
          </h2>
          <Link
            to="/catalog"
            onClick={() => onNavigate('catalog')}
            className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 font-semibold transition no-underline cursor-pointer"
          >
            View full syllabus <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {tracks.map(({ key, icon: Icon }) => {
            const meta = trackMeta[key];
            const trackQuestions = allQuestions.filter(q => q.track === key);
            return (
              <Link
                key={key}
                to="/catalog"
                search={{ track: key }}
                onClick={() => {
                  onSelectTrack(key);
                  onNavigate('catalog');
                }}
                className="bg-[#161b22] border border-slate-800 hover:border-slate-700 p-5 rounded-2xl flex flex-col justify-between space-y-4 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl group no-underline text-inherit"
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
              </Link>
            );
          })}
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4">
        <Link
          to="/patterns"
          onClick={() => onNavigate('patterns')}
          className="bg-[#161b22] border border-slate-800 p-5 rounded-2xl space-y-2 cursor-pointer hover:border-indigo-500/40 transition group no-underline text-inherit"
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
        </Link>

        <Link
          to="/visualizers"
          onClick={() => onNavigate('visualizers')}
          className="bg-[#161b22] border border-slate-800 p-5 rounded-2xl space-y-2 cursor-pointer hover:border-sky-500/40 transition group no-underline text-inherit"
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
        </Link>

        <Link
          to="/cheatsheet"
          onClick={() => onNavigate('cheatsheet')}
          className="bg-[#161b22] border border-slate-800 p-5 rounded-2xl space-y-2 cursor-pointer hover:border-purple-500/40 transition group no-underline text-inherit"
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
        </Link>
      </section>
    </div>
  );
};
