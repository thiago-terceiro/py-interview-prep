import React, { useState, useEffect } from 'react';
import { allQuestions, getQuestionById } from './data/questions';
import { HomePage } from './components/HomePage';
import { QuestionCatalog } from './components/QuestionCatalog';
import { ProblemArena } from './components/ProblemArena';
import { VisualizerHub } from './components/Visualizers/VisualizerHub';
import { CheatsheetView } from './components/CheatsheetView';
import { AlgoPatternsView } from './components/AlgoPatterns/AlgoPatternsView';
import { QuizHub } from './components/Quiz/QuizHub';
import { pyodideRunner, type PyodideStatus } from './services/pyodideRunner';
import type { Track } from './types';
import { ThemeProvider } from './context/ThemeProvider';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { A11yMenu } from './components/A11yMenu';
import {
  Code2,
  BookOpen,
  Sparkles,
  Terminal,
  Trophy,
  CheckCircle2,
  Menu,
  X,
  RotateCcw,
  Home,
  Brain,
  GraduationCap,
} from 'lucide-react';

const STORAGE_KEY = 'py_interview_pro_progress_v1';

export type TabType = 'home' | 'catalog' | 'arena' | 'patterns' | 'visualizers' | 'cheatsheet' | 'quiz';

const AppContent: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [activeQuestionId, setActiveQuestionId] = useState<string>('py-01-flatten-nested-list');
  const [activePatternId, setActivePatternId] = useState<string>('two-pointers');
  const [selectedCatalogTrack, setSelectedCatalogTrack] = useState<Track | 'all'>('all');
  const [initialVisualizerTab, setInitialVisualizerTab] = useState<
    'two-pointers' | 'sliding-window' | 'binary-search' | 'bfs-grid' | 'gradient-descent'
  >('two-pointers');

  const [solvedQuestionIds, setSolvedQuestionIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.solvedQuestionIds || [];
      }
    } catch (e) {
      console.warn('Failed to load saved progress:', e);
    }
    return [];
  });

  const [codeDrafts, setCodeDrafts] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.codeDrafts || {};
      }
    } catch (e) {
      console.warn('Failed to load code drafts:', e);
    }
    return {};
  });

  const [pyStatus, setPyStatus] = useState<PyodideStatus>('idle');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Subscribe to Pyodide status
  useEffect(() => {
    const unsub = pyodideRunner.subscribeStatus(status => setPyStatus(status));
    pyodideRunner.init().catch(err => {
      console.warn('Background Pyodide init error:', err);
    });
    return () => unsub();
  }, []);

  // Save progress & drafts to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          solvedQuestionIds,
          codeDrafts,
          lastActiveQuestionId: activeQuestionId,
        })
      );
    } catch (e) {
      console.warn('Failed to persist progress:', e);
    }
  }, [solvedQuestionIds, codeDrafts, activeQuestionId]);

  const activeQuestion = getQuestionById(activeQuestionId) || allQuestions[0];
  const currentCode = codeDrafts[activeQuestion.id] ?? activeQuestion.starterCode;

  const handleCodeChange = (newCode: string) => {
    setCodeDrafts(prev => ({
      ...prev,
      [activeQuestion.id]: newCode,
    }));
  };

  const handleQuestionSolved = (questionId: string) => {
    if (!solvedQuestionIds.includes(questionId)) {
      setSolvedQuestionIds(prev => [...prev, questionId]);
    }
  };

  const handleToggleQuestionSolved = (questionId: string) => {
    setSolvedQuestionIds(prev =>
      prev.includes(questionId)
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  const handleSelectQuestion = (questionId: string) => {
    setActiveQuestionId(questionId);
    setActiveTab('arena');
    setMobileMenuOpen(false);
  };

  const handleOpenPattern = (patternId: string) => {
    setActivePatternId(patternId);
    setActiveTab('patterns');
    setMobileMenuOpen(false);
  };

  const handleOpenVisualizer = (visualizerId: string) => {
    const validTabs: Array<
      'two-pointers' | 'sliding-window' | 'binary-search' | 'bfs-grid' | 'gradient-descent'
    > = ['two-pointers', 'sliding-window', 'binary-search', 'bfs-grid', 'gradient-descent'];
    if (validTabs.includes(visualizerId as any)) {
      setInitialVisualizerTab(visualizerId as any);
      setActiveTab('visualizers');
      setMobileMenuOpen(false);
    }
  };

  const handleSelectTrackFromHome = (track: Track) => {
    setSelectedCatalogTrack(track);
    setActiveTab('catalog');
  };

  const handleResetAllProgress = () => {
    if (window.confirm('Reset all solved progress and code drafts?')) {
      setSolvedQuestionIds([]);
      setCodeDrafts({});
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col selection:bg-indigo-500/30 selection:text-white">
      {/* Top Main Navigation Bar */}
      <header className="sticky top-0 z-50 bg-[#0d1117]/95 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-[1700px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo & Brand (Clickable to Home) */}
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer select-none group"
            title="Go to Home"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-sky-500 to-emerald-400 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#0d1117] rounded-[10px] flex items-center justify-center">
                <Terminal className="w-5 h-5 text-sky-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-black tracking-tight text-white m-0 group-hover:text-sky-300 transition-colors">
                  PyInterview <span className="text-sky-400">Pro</span>
                </h1>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  30 Track
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Python Fundamentals → Algorithms → NumPy/Pandas → ML Engineering
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-[#161b22] border border-slate-800 p-1 rounded-xl">
            {/* Home Tab */}
            <button
              onClick={() => setActiveTab('home')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-transform duration-75 active:scale-95 ${
                activeTab === 'home'
                  ? 'bg-slate-800 text-white shadow-sm border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-800/50'
              }`}
            >
              <Home className="w-3.5 h-3.5 text-sky-400" />
              {t('navHome')}
            </button>

            {/* 1. All 30 Questions */}
            <button
              onClick={() => setActiveTab('catalog')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-transform duration-75 active:scale-95 ${
                activeTab === 'catalog'
                  ? 'bg-slate-800 text-white shadow-sm border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-800/50'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              {t('navCatalog')}
            </button>

            {/* 2. Practice Arena */}
            <button
              onClick={() => setActiveTab('arena')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-transform duration-75 active:scale-95 ${
                activeTab === 'arena'
                  ? 'bg-slate-800 text-white shadow-sm border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-800/50'
              }`}
            >
              <Code2 className="w-3.5 h-3.5 text-emerald-400" />
              {t('navArena')}
            </button>

            {/* 3. Algo Patterns (NEW Core Hub) */}
            <button
              onClick={() => setActiveTab('patterns')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-transform duration-75 active:scale-95 ${
                activeTab === 'patterns'
                  ? 'bg-slate-800 text-sky-300 shadow-sm border-indigo-500/50'
                  : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-800/50'
              }`}
            >
              <Brain className="w-3.5 h-3.5 text-indigo-400" />
              {t('navPatterns')}
            </button>

            {/* 4. Algorithm Visualizers */}
            <button
              onClick={() => setActiveTab('visualizers')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-transform duration-75 active:scale-95 ${
                activeTab === 'visualizers'
                  ? 'bg-slate-800 text-white shadow-sm border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-800/50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              {t('navVisualizers')}
            </button>

            {/* 5. Cheatsheet */}
            <button
              onClick={() => setActiveTab('cheatsheet')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-transform duration-75 active:scale-95 ${
                activeTab === 'cheatsheet'
                  ? 'bg-slate-800 text-white shadow-sm border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-800/50'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-purple-400" />
              {t('navCheatsheet')}
            </button>

            {/* 6. 100 Qs Bank (AI & ML) */}
            <button
              onClick={() => setActiveTab('quiz')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-transform duration-75 active:scale-95 ${
                activeTab === 'quiz'
                  ? 'bg-slate-800 text-sky-300 shadow-sm border-sky-500/50'
                  : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-800/50'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-sky-400" />
              {t('navQuiz')}
            </button>
          </nav>

          {/* Right Header Controls: Engine Pill + Solved Pill + Language + Theme */}
          <div className="flex items-center gap-2.5">
            {/* Pyodide Engine Pill */}
            <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#161b22] border border-slate-800 text-xs font-mono">
              <span
                className={`w-2 h-2 rounded-full ${
                  pyStatus === 'ready'
                    ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]'
                    : pyStatus === 'loading-pyodide' ||
                      pyStatus === 'loading-packages' ||
                      pyStatus === 'running'
                    ? 'bg-amber-400 animate-ping'
                    : 'bg-slate-500'
                }`}
              />
              <span className="text-slate-400">
                {pyStatus === 'ready'
                  ? t('pythonEngineReady')
                  : pyStatus === 'error'
                  ? t('pythonEngineError')
                  : t('pythonEngineInitializing')}
              </span>
            </div>

            {/* Solved Progress Pill - Non-wrapping and compact */}
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#161b22] border border-slate-800 text-xs select-none whitespace-nowrap shrink-0"
              title="Questions solved out of 30 total"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="font-mono font-bold text-white whitespace-nowrap">
                {solvedQuestionIds.length} <span className="text-slate-500 font-normal">/ 30</span>
              </span>
            </div>

            {/* Accessibility, Language & Theme Menu */}
            <A11yMenu />

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(m => !m)}
              className="lg:hidden p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-800 bg-[#0d1117] px-4 py-3 space-y-2">
            <button
              onClick={() => {
                setActiveTab('home');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-200 hover:bg-slate-800"
            >
              <Home className="w-4 h-4 text-sky-400" />
              {t('navHome')}
            </button>
            <button
              onClick={() => {
                setActiveTab('catalog');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-200 hover:bg-slate-800"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              {t('navCatalog')}
            </button>
            <button
              onClick={() => {
                setActiveTab('arena');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-200 hover:bg-slate-800"
            >
              <Code2 className="w-4 h-4 text-emerald-400" />
              {t('navArena')}
            </button>
            <button
              onClick={() => {
                setActiveTab('patterns');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-sky-300 hover:bg-slate-800"
            >
              <Brain className="w-4 h-4 text-indigo-400" />
              {t('navPatterns')}
            </button>
            <button
              onClick={() => {
                setActiveTab('visualizers');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-200 hover:bg-slate-800"
            >
              <Sparkles className="w-4 h-4 text-sky-400" />
              {t('navVisualizers')}
            </button>
            <button
              onClick={() => {
                setActiveTab('cheatsheet');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-200 hover:bg-slate-800"
            >
              <BookOpen className="w-4 h-4 text-purple-400" />
              {t('navCheatsheet')}
            </button>
            <button
              onClick={() => {
                setActiveTab('quiz');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-sky-300 hover:bg-slate-800"
            >
              <GraduationCap className="w-4 h-4 text-sky-400" />
              {t('navQuiz')}
            </button>
            <button
              onClick={handleResetAllProgress}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-rose-400 hover:bg-rose-950/20"
            >
              <RotateCcw className="w-4 h-4" />
              {t('resetProgress')}
            </button>
          </div>
        )}
      </header>

      {/* Main Tab View */}
      <main className="flex-1 w-full max-w-[1700px] mx-auto p-4 sm:p-6">
        {activeTab === 'home' && (
          <HomePage
            solvedCount={solvedQuestionIds.length}
            onNavigate={tab => setActiveTab(tab)}
            onSelectTrack={handleSelectTrackFromHome}
          />
        )}

        {activeTab === 'catalog' && (
          <QuestionCatalog
            solvedQuestionIds={solvedQuestionIds}
            onSelectQuestion={handleSelectQuestion}
            onToggleQuestionSolved={handleToggleQuestionSolved}
            onOpenVisualizer={handleOpenVisualizer}
            initialTrack={selectedCatalogTrack}
          />
        )}

        {activeTab === 'arena' && (
          <ProblemArena
            question={activeQuestion}
            allQuestions={allQuestions}
            userCode={currentCode}
            onCodeChange={handleCodeChange}
            onQuestionSolved={handleQuestionSolved}
            onSelectQuestion={handleSelectQuestion}
            onOpenVisualizer={handleOpenVisualizer}
            onOpenPattern={handleOpenPattern}
          />
        )}

        {activeTab === 'patterns' && (
          <AlgoPatternsView
            initialPatternId={activePatternId}
            onOpenArenaQuestion={handleSelectQuestion}
            onOpenVisualizerHub={handleOpenVisualizer}
          />
        )}

        {activeTab === 'visualizers' && (
          <VisualizerHub
            initialTab={initialVisualizerTab}
            onOpenQuestion={handleSelectQuestion}
          />
        )}

        {activeTab === 'cheatsheet' && <CheatsheetView />}

        {activeTab === 'quiz' && <QuizHub />}
      </main>

      {/* Footer */}
      <footer
        className={`border-t border-slate-800/80 bg-[#0d1117] py-4 px-4 text-center text-xs text-slate-500 ${
          activeTab === 'arena' ? 'hidden' : 'block'
        }`}
      >
        <div className="flex flex-wrap items-center justify-center gap-4">
          <span>{t('brandName')}</span>
          <span>•</span>
          <span>Client-side WebAssembly Execution (Pyodide 3.12)</span>
          <span>•</span>
          <span>NumPy & Pandas Integrated</span>
          <span>•</span>
          <button
            onClick={handleResetAllProgress}
            className="text-slate-500 hover:text-rose-400 transition"
          >
            {t('resetProgress')}
          </button>
        </div>
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
