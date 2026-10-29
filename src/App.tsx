import React, { useState, useEffect } from 'react';
import {
  createRootRoute,
  createRoute,
  createRouter,
  createHashHistory,
  RouterProvider,
  Outlet,
  Link,
  useNavigate,
  useParams,
  useSearch,
  useRouterState,
} from '@tanstack/react-router';
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

export interface AppContextType {
  solvedQuestionIds: string[];
  codeDrafts: Record<string, string>;
  activeQuestionId: string;
  setActiveQuestionId: (id: string) => void;
  handleCodeChange: (newCode: string) => void;
  handleQuestionSolved: (questionId: string) => void;
  handleToggleQuestionSolved: (questionId: string) => void;
  handleSelectQuestion: (questionId: string) => void;
  handleOpenPattern: (patternId: string) => void;
  handleOpenVisualizer: (visualizerId: string) => void;
  handleSelectTrackFromHome: (track: Track) => void;
  handleResetAllProgress: () => void;
}

export const AppNavigationContext = React.createContext<AppContextType | null>(null);

export const useAppNavigation = () => {
  const ctx = React.useContext(AppNavigationContext);
  if (!ctx) {
    throw new Error('useAppNavigation must be used within AppNavigationContext.Provider');
  }
  return ctx;
};

// --- Route Definitions ---

const rootRoute = createRootRoute({
  component: RootLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomeRouteComponent,
});

const catalogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/catalog',
  validateSearch: (search: Record<string, unknown>): { track?: Track | 'all' } => ({
    track: typeof search.track === 'string' ? (search.track as Track | 'all') : undefined,
  }),
  component: CatalogRouteComponent,
});

const arenaRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/arena',
  component: ArenaRouteComponent,
});

const arenaQuestionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/arena/$questionId',
  component: ArenaQuestionRouteComponent,
});

const patternsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/patterns',
  component: PatternsRouteComponent,
});

const patternsItemRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/patterns/$patternId',
  component: PatternsItemRouteComponent,
});

const visualizersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/visualizers',
  component: VisualizersRouteComponent,
});

const visualizersTabRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/visualizers/$tab',
  component: VisualizersTabRouteComponent,
});

const cheatsheetRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cheatsheet',
  component: CheatsheetRouteComponent,
});

const quizRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/quiz',
  component: QuizRouteComponent,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  catalogRoute,
  arenaRoute,
  arenaQuestionRoute,
  patternsRoute,
  patternsItemRoute,
  visualizersRoute,
  visualizersTabRoute,
  cheatsheetRoute,
  quizRoute,
]);

// Use hash history for full compatibility with GitHub Pages and static deployments
const hashHistory = createHashHistory();

export const router = createRouter({
  routeTree,
  history: hashHistory,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

// --- Layout & Nav Components ---

function RootLayout() {
  const { t } = useLanguage();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const {
    solvedQuestionIds,
    handleResetAllProgress,
  } = useAppNavigation();

  const [pyStatus, setPyStatus] = useState<PyodideStatus>('idle');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Pyodide status subscription
  useEffect(() => {
    const unsub = pyodideRunner.subscribeStatus(status => setPyStatus(status));
    pyodideRunner.init().catch(err => {
      console.warn('Background Pyodide init error:', err);
    });
    return () => unsub();
  }, []);

  const isArenaActive = currentPath.startsWith('/arena');

  const navLinks = [
    {
      to: '/',
      label: t('navHome'),
      icon: Home,
      iconColor: 'text-sky-400',
      isActive: currentPath === '/',
    },
    {
      to: '/catalog',
      label: t('navCatalog'),
      icon: Trophy,
      iconColor: 'text-amber-400',
      isActive: currentPath.startsWith('/catalog'),
    },
    {
      to: '/arena',
      label: t('navArena'),
      icon: Code2,
      iconColor: 'text-emerald-400',
      isActive: isArenaActive,
    },
    {
      to: '/patterns',
      label: t('navPatterns'),
      icon: Brain,
      iconColor: 'text-indigo-400',
      isActive: currentPath.startsWith('/patterns'),
    },
    {
      to: '/visualizers',
      label: t('navVisualizers'),
      icon: Sparkles,
      iconColor: 'text-sky-400',
      isActive: currentPath.startsWith('/visualizers'),
    },
    {
      to: '/cheatsheet',
      label: t('navCheatsheet'),
      icon: BookOpen,
      iconColor: 'text-purple-400',
      isActive: currentPath.startsWith('/cheatsheet'),
    },
    {
      to: '/quiz',
      label: t('navQuiz'),
      icon: GraduationCap,
      iconColor: 'text-sky-400',
      isActive: currentPath.startsWith('/quiz'),
    },
  ];

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col selection:bg-indigo-500/30 selection:text-white">
      {/* Top Main Navigation Bar */}
      <header className="sticky top-0 z-50 bg-[#0d1117]/95 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-[1700px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between lg:grid lg:grid-cols-[1fr_auto_1fr] gap-4">
          {/* Logo & Brand (Clickable Link to Home) */}
          <div className="flex items-center justify-start min-w-0">
            <Link
              to="/"
              className="flex items-center gap-3 select-none group text-inherit no-underline"
              title="Go to Home"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-sky-500 to-emerald-400 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform shrink-0">
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
                    {allQuestions.length} Track
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 hidden sm:block">
                  {t('brandSubtitle')}
                </p>
              </div>
            </Link>
          </div>

          {/* Desktop Nav Links - Perfectly Centered with the Middle of the Page Container */}
          <nav
            aria-label="Main Navigation"
            className="hidden lg:flex items-center justify-center justify-self-center gap-1 xl:gap-1.5 bg-[#161b22] border border-slate-800 p-1 rounded-xl shadow-inner"
          >
            {navLinks.map(link => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 rounded-lg text-xs font-semibold border transition-transform duration-75 active:scale-95 no-underline whitespace-nowrap ${
                    link.isActive
                      ? 'bg-slate-800 text-white shadow-sm border-slate-700'
                      : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${link.iconColor}`} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Header Controls: Engine Pill + Solved Pill + Language + Theme */}
          <div className="flex items-center justify-end justify-self-end gap-2.5">
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
              title={`Questions solved out of ${allQuestions.length} total`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="font-mono font-bold text-white whitespace-nowrap">
                {solvedQuestionIds.length} <span className="text-slate-500 font-normal">/ {allQuestions.length}</span>
              </span>
            </div>

            {/* Accessibility, Language & Theme Menu */}
            <A11yMenu />

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(m => !m)}
              className="lg:hidden p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-800 bg-[#0d1117] px-4 py-3 space-y-2">
            {navLinks.map(link => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium no-underline ${
                    link.isActive ? 'bg-slate-800 text-white' : 'text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${link.iconColor}`} />
                  {link.label}
                </Link>
              );
            })}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleResetAllProgress();
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-rose-400 hover:bg-rose-950/20 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              {t('resetProgress')}
            </button>
          </div>
        )}
      </header>

      {/* Main Routed Outlet View */}
      <main className="flex-1 w-full max-w-[1700px] mx-auto p-4 sm:p-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer
        className={`border-t border-slate-800/80 bg-[#0d1117] py-4 px-4 text-center text-xs text-slate-500 ${
          isArenaActive ? 'hidden' : 'block'
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
            className="text-slate-500 hover:text-rose-400 transition cursor-pointer"
          >
            {t('resetProgress')}
          </button>
        </div>
      </footer>
    </div>
  );
}

// --- Route Components ---

function HomeRouteComponent() {
  const { solvedQuestionIds, handleSelectTrackFromHome } = useAppNavigation();
  const navigate = useNavigate();

  return (
    <HomePage
      solvedCount={solvedQuestionIds.length}
      onNavigate={tab => {
        if (tab === 'arena') navigate({ to: '/arena' });
        else if (tab === 'catalog') navigate({ to: '/catalog' });
        else if (tab === 'visualizers') navigate({ to: '/visualizers' });
        else if (tab === 'cheatsheet') navigate({ to: '/cheatsheet' });
        else if (tab === 'patterns') navigate({ to: '/patterns' });
        else if (tab === 'quiz') navigate({ to: '/quiz' });
      }}
      onSelectTrack={handleSelectTrackFromHome}
    />
  );
}

function CatalogRouteComponent() {
  const {
    solvedQuestionIds,
    handleSelectQuestion,
    handleToggleQuestionSolved,
    handleOpenVisualizer,
  } = useAppNavigation();
  const search = useSearch({ from: '/catalog' });

  return (
    <QuestionCatalog
      solvedQuestionIds={solvedQuestionIds}
      onSelectQuestion={handleSelectQuestion}
      onToggleQuestionSolved={handleToggleQuestionSolved}
      onOpenVisualizer={handleOpenVisualizer}
      initialTrack={search.track || 'all'}
    />
  );
}

function ArenaQuestionRouteComponent() {
  const { questionId } = useParams({ from: '/arena/$questionId' });
  const {
    activeQuestionId,
    setActiveQuestionId,
    codeDrafts,
    handleCodeChange,
    handleQuestionSolved,
    handleSelectQuestion,
    handleOpenVisualizer,
    handleOpenPattern,
  } = useAppNavigation();

  useEffect(() => {
    if (questionId && questionId !== activeQuestionId) {
      setActiveQuestionId(questionId);
    }
  }, [questionId, activeQuestionId, setActiveQuestionId]);

  const targetId = questionId || activeQuestionId;
  const activeQuestion = getQuestionById(targetId) || allQuestions[0];
  const currentCode = codeDrafts[activeQuestion.id] ?? activeQuestion.starterCode;

  return (
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
  );
}

function ArenaRouteComponent() {
  const {
    activeQuestionId,
    codeDrafts,
    handleCodeChange,
    handleQuestionSolved,
    handleSelectQuestion,
    handleOpenVisualizer,
    handleOpenPattern,
  } = useAppNavigation();

  const activeQuestion = getQuestionById(activeQuestionId) || allQuestions[0];
  const currentCode = codeDrafts[activeQuestion.id] ?? activeQuestion.starterCode;

  return (
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
  );
}

function PatternsItemRouteComponent() {
  const { patternId } = useParams({ from: '/patterns/$patternId' });
  const { handleSelectQuestion, handleOpenVisualizer, handleOpenPattern } = useAppNavigation();

  return (
    <AlgoPatternsView
      initialPatternId={patternId}
      onOpenArenaQuestion={handleSelectQuestion}
      onOpenVisualizerHub={handleOpenVisualizer}
      onSelectPattern={handleOpenPattern}
    />
  );
}

function PatternsRouteComponent() {
  const { handleSelectQuestion, handleOpenVisualizer, handleOpenPattern } = useAppNavigation();

  return (
    <AlgoPatternsView
      onOpenArenaQuestion={handleSelectQuestion}
      onOpenVisualizerHub={handleOpenVisualizer}
      onSelectPattern={handleOpenPattern}
    />
  );
}

function VisualizersTabRouteComponent() {
  const { tab } = useParams({ from: '/visualizers/$tab' });
  const { handleSelectQuestion, handleOpenVisualizer } = useAppNavigation();

  const validTabs: Array<
    'two-pointers' | 'sliding-window' | 'binary-search' | 'bfs-grid' | 'gradient-descent'
  > = ['two-pointers', 'sliding-window', 'binary-search', 'bfs-grid', 'gradient-descent'];

  const initialTab = validTabs.includes(tab as any) ? (tab as any) : 'two-pointers';

  return (
    <VisualizerHub
      initialTab={initialTab}
      onOpenQuestion={handleSelectQuestion}
      onSelectTab={handleOpenVisualizer}
    />
  );
}

function VisualizersRouteComponent() {
  const { handleSelectQuestion, handleOpenVisualizer } = useAppNavigation();

  return (
    <VisualizerHub
      initialTab="two-pointers"
      onOpenQuestion={handleSelectQuestion}
      onSelectTab={handleOpenVisualizer}
    />
  );
}

function CheatsheetRouteComponent() {
  return <CheatsheetView />;
}

function QuizRouteComponent() {
  return <QuizHub />;
}

// --- App State & Router Provider Wrapper ---

export const App: React.FC = () => {
  const [activeQuestionId, setActiveQuestionId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.lastActiveQuestionId) return parsed.lastActiveQuestionId;
      }
    } catch (e) {
      console.warn('Failed to load last question from localStorage:', e);
    }
    return 'py-01-flatten-nested-list';
  });

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

  const handleCodeChange = (newCode: string) => {
    setCodeDrafts(prev => ({
      ...prev,
      [activeQuestionId]: newCode,
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
    router.navigate({ to: '/arena/$questionId', params: { questionId } });
  };

  const handleOpenPattern = (patternId: string) => {
    router.navigate({ to: '/patterns/$patternId', params: { patternId } });
  };

  const handleOpenVisualizer = (visualizerId: string) => {
    router.navigate({ to: '/visualizers/$tab', params: { tab: visualizerId } });
  };

  const handleSelectTrackFromHome = (track: Track) => {
    router.navigate({ to: '/catalog', search: { track } });
  };

  const handleResetAllProgress = () => {
    if (window.confirm('Reset all solved progress and code drafts?')) {
      setSolvedQuestionIds([]);
      setCodeDrafts({});
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const navigationContextValue: AppContextType = {
    solvedQuestionIds,
    codeDrafts,
    activeQuestionId,
    setActiveQuestionId,
    handleCodeChange,
    handleQuestionSolved,
    handleToggleQuestionSolved,
    handleSelectQuestion,
    handleOpenPattern,
    handleOpenVisualizer,
    handleSelectTrackFromHome,
    handleResetAllProgress,
  };

  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppNavigationContext.Provider value={navigationContextValue}>
          <RouterProvider router={router} />
        </AppNavigationContext.Provider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
