import React, { useState, useEffect, useRef, useMemo } from 'react';
import Editor from '@monaco-editor/react';
import confetti from 'canvas-confetti';
import type { Question, ExecutionResult, ConsoleEntry, ScriptRunResult } from '../types';
import { pyodideRunner, type PyodideStatus } from '../services/pyodideRunner';
import { useLanguage } from '../context/LanguageContext';

import { getRequiredPackagesForQuestion, trackMeta } from '../data/questions';
import { algoPatterns } from '../data/algoPatterns';
import { useTheme } from '../context/ThemeProvider';
import {
  Play,
  RotateCcw,
  Eye,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ChevronDown,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Terminal,
  Clock,
  Loader2,
  BookOpen,
  Brain,
  ArrowRight,
  Code2,
  Trash2,
  CornerDownLeft,
} from 'lucide-react';

interface ProblemArenaProps {
  question: Question;
  allQuestions: Question[];
  userCode: string;
  onCodeChange: (code: string) => void;
  onQuestionSolved: (questionId: string) => void;
  onSelectQuestion: (questionId: string) => void;
  onOpenVisualizer?: (visualizerId: string) => void;
  onOpenPattern?: (patternId: string) => void;
}

export const ProblemArena: React.FC<ProblemArenaProps> = ({
  question,
  allQuestions,
  userCode,
  onCodeChange,
  onQuestionSolved,
  onSelectQuestion,
  onOpenVisualizer,
  onOpenPattern,
}) => {
  const { t } = useLanguage();
  const { resolvedTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'description' | 'hints' | 'solution'>('description');
  const [revealedHints, setRevealedHints] = useState<number[]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [activeTestTab, setActiveTestTab] = useState<number>(0);
  const [pyStatus, setPyStatus] = useState<PyodideStatus>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [showResetModal, setShowResetModal] = useState<boolean>(false);

  // Execution, Console & REPL State
  const [bottomTab, setBottomTab] = useState<'tests' | 'console' | 'repl'>('tests');
  const [isScriptRunning, setIsScriptRunning] = useState<boolean>(false);
  const [scriptResult, setScriptResult] = useState<ScriptRunResult | null>(null);

  const [consoleEntries, setConsoleEntries] = useState<ConsoleEntry[]>([]);
  const [consoleInput, setConsoleInput] = useState<string>('');
  const [isConsoleRunning, setIsConsoleRunning] = useState<boolean>(false);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const consoleEndRef = useRef<HTMLDivElement>(null);
  const consoleInputRef = useRef<HTMLInputElement>(null);

  // Subscribe to Python runtime status
  useEffect(() => {
    const unsubscribe = pyodideRunner.subscribeStatus((status, message) => {
      setPyStatus(status);
      if (message) setStatusMessage(message);
    });
    return () => unsubscribe();
  }, []);

  // Keyboard shortcut listener for Reset modal (Escape to close, Enter to confirm)
  useEffect(() => {
    if (!showResetModal) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowResetModal(false);
      } else if (e.key === 'Enter') {
        onCodeChange(question.starterCode);
        setExecutionResult(null);
        setScriptResult(null);
        setShowResetModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showResetModal, question.starterCode, onCodeChange]);

  // Preload needed packages for track (e.g. numpy / pandas)
  useEffect(() => {
    const required = getRequiredPackagesForQuestion(question);
    if (required.length > 0) {
      pyodideRunner.ensurePackages(required).catch(err => {
        console.warn('Could not preload packages:', err);
      });
    }
    // Reset test execution results & console when switching questions
    setExecutionResult(null);
    setScriptResult(null);
    setRevealedHints([]);
    setActiveTab('description');
    setActiveTestTab(0);
    setConsoleEntries([]);
    pyodideRunner.resetReplSession().catch(() => {});
  }, [question]);

  // Auto-scroll console to bottom when new entries arrive
  useEffect(() => {
    if (bottomTab === 'repl' && consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [consoleEntries, bottomTab]);

  // Smart sample call for quick testing based on starter code signature & example 1
  const sampleCall = useMemo(() => {
    // Specific class question handlers
    if (question.id === 'py-02-lru-cache') {
      return `cache = LRUCache(2); cache.put(1, 10); cache.put(2, 20); print("get(1):", cache.get(1))`;
    }
    if (question.id === 'py-07-error-suppressor') {
      return `with ErrorSuppressor(ValueError): print("Suppressed exception successfully"); raise ValueError("oops")`;
    }

    const fnMatches = [...question.starterCode.matchAll(/def\s+([a-zA-Z0-9_]+)\s*\(/g)];
    const publicFn = fnMatches.find(m => !m[1].startsWith('_'));
    const fnName = publicFn ? publicFn[1] : (fnMatches[0] ? fnMatches[0][1] : null);

    if (fnName) {
      if (question.examples && question.examples.length > 0) {
        const exInput = question.examples[0].input;
        if (exInput && exInput.includes('=')) {
          return `${fnName}(${exInput})`;
        }
      }
      return `${fnName}()`;
    }

    const classMatch = question.starterCode.match(/class\s+([a-zA-Z0-9_]+)/);
    if (classMatch) {
      return `${classMatch[1]}()`;
    }
    return null;
  }, [question.starterCode, question.examples, question.id]);

  const currentIndex = allQuestions.findIndex(q => q.id === question.id);
  const prevQuestion = currentIndex > 0 ? allQuestions[currentIndex - 1] : null;
  const nextQuestion = currentIndex < allQuestions.length - 1 ? allQuestions[currentIndex + 1] : null;

  const toggleHint = (index: number) => {
    if (revealedHints.includes(index)) {
      setRevealedHints(revealedHints.filter(i => i !== index));
    } else {
      setRevealedHints([...revealedHints, index]);
    }
  };

  const handleResetCode = () => {
    setShowResetModal(true);
  };

  const handleConfirmReset = () => {
    onCodeChange(question.starterCode);
    setExecutionResult(null);
    setScriptResult(null);
    setShowResetModal(false);
  };

  const handleRunScript = async () => {
    if (isScriptRunning || isRunning) return;
    setIsScriptRunning(true);
    setScriptResult(null);
    setBottomTab('console');

    const requiredPackages = getRequiredPackagesForQuestion(question);
    const result = await pyodideRunner.runScript(
      userCode,
      sampleCall || undefined,
      requiredPackages
    );
    setScriptResult(result);
    setIsScriptRunning(false);
  };

  const handleRunCode = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setExecutionResult(null);
    setBottomTab('tests');

    const requiredPackages = getRequiredPackagesForQuestion(question);
    const result = await pyodideRunner.runCodeWithHarness(
      userCode,
      question.testHarness,
      requiredPackages
    );

    setExecutionResult(result);
    setIsRunning(false);

    if (result.success) {
      onQuestionSolved(question.id);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#38bdf8', '#a855f7'],
      });
    }
  };

  const handleRunConsole = async (commandToRun?: string) => {
    const cmd = (commandToRun ?? consoleInput).trim();
    if (!cmd || isConsoleRunning) return;

    if (!commandToRun) {
      setConsoleInput('');
      setHistoryIndex(-1);
    }

    setCommandHistory(prev => (prev[prev.length - 1] === cmd ? prev : [...prev, cmd]));
    const entryId = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newEntry: ConsoleEntry = {
      id: entryId,
      command: cmd,
      timestamp: new Date(),
    };

    setConsoleEntries(prev => [...prev, newEntry]);
    setIsConsoleRunning(true);
    setBottomTab('repl');

    try {
      const requiredPackages = getRequiredPackagesForQuestion(question);
      const res = await pyodideRunner.runInteractiveCommand(cmd, userCode, requiredPackages);
      setConsoleEntries(prev =>
        prev.map(entry =>
          entry.id === entryId
            ? {
                ...entry,
                stdout: res.stdout,
                result: res.result,
                error: res.error,
                elapsedMs: res.elapsedMs,
              }
            : entry
        )
      );
    } catch (err: any) {
      setConsoleEntries(prev =>
        prev.map(entry =>
          entry.id === entryId
            ? {
                ...entry,
                error: err?.message || String(err),
              }
            : entry
        )
      );
    } finally {
      setIsConsoleRunning(false);
    }
  };

  const handleResetReplSession = async () => {
    await pyodideRunner.resetReplSession();
    const resetEntry: ConsoleEntry = {
      id: `${Date.now()}-reset`,
      command: '# Session Reset',
      timestamp: new Date(),
      stdout: 'Interactive REPL session cleared. Editor functions will re-sync on next execution.',
      elapsedMs: 0,
    };
    setConsoleEntries(prev => [...prev, resetEntry]);
  };

  const handleClearConsole = () => {
    setConsoleEntries([]);
  };

  const handleConsoleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleRunConsole();
    } else if (e.key === 'ArrowUp') {
      if (commandHistory.length === 0) return;
      e.preventDefault();
      const nextIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setConsoleInput(commandHistory[nextIndex] || '');
    } else if (e.key === 'ArrowDown') {
      if (commandHistory.length === 0 || historyIndex === -1) return;
      e.preventDefault();
      const nextIndex = historyIndex + 1;
      if (nextIndex >= commandHistory.length) {
        setHistoryIndex(-1);
        setConsoleInput('');
      } else {
        setHistoryIndex(nextIndex);
        setConsoleInput(commandHistory[nextIndex]);
      }
    }
  };

  const meta = trackMeta[question.track];
  const matchingPattern = algoPatterns.find(p => p.relatedQuestionId === question.id);

  return (
    <div className="max-w-[1700px] w-full mx-auto space-y-2.5">
      {/* Top Question Navigation & Breadcrumbs */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 bg-[#161b22] border border-slate-800 px-3.5 py-1.5 rounded-xl min-h-[44px]">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-mono font-bold text-slate-400">#{question.number}</span>
          <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{question.title}</span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full border ${meta.badgeBg}`}>
            {meta.title}
          </span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
              question.difficulty === 'Easy'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
            }`}
          >
            {question.difficulty}
          </span>
        </div>

        <div className="flex items-center gap-2 h-7">
          {matchingPattern && onOpenPattern && (
            <button
              onClick={() => onOpenPattern(matchingPattern.id)}
              className="flex items-center gap-1.5 px-3 h-7 rounded-lg bg-sky-950/70 text-sky-300 border border-sky-700/50 hover:bg-sky-900 text-xs font-medium transition active:scale-95 cursor-pointer"
              title="Learn the underlying algorithm pattern blueprint"
            >
              <Brain className="w-3.5 h-3.5 text-sky-400" />
              <span>Pattern Blueprint</span>
            </button>
          )}

          {question.visualizerId && onOpenVisualizer && (
            <button
              onClick={() => onOpenVisualizer(question.visualizerId!)}
              className="flex items-center gap-1.5 px-3 h-7 rounded-lg bg-indigo-950/70 text-indigo-300 border border-indigo-700/50 hover:bg-indigo-900 text-xs font-medium transition active:scale-95 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Interactive Visualizer</span>
            </button>
          )}

          <div className="flex items-center gap-1 border-l border-slate-800 pl-2 h-7">
            <button
              disabled={!prevQuestion}
              onClick={() => prevQuestion && onSelectQuestion(prevQuestion.id)}
              className="w-7 h-7 flex items-center justify-center rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition active:scale-95 cursor-pointer"
              title="Previous Question"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled={!nextQuestion}
              onClick={() => nextQuestion && onSelectQuestion(nextQuestion.id)}
              className="w-7 h-7 flex items-center justify-center rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition active:scale-95 cursor-pointer"
              title="Next Question"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Split Layout: Description on Left, Code & Runner on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 items-stretch">
        {/* Left Column: Problem Information Tabs */}
        <div className="lg:col-span-5 bg-[#161b22] border border-slate-800 rounded-xl overflow-hidden shadow-xl flex flex-col h-[520px] lg:h-[calc(100vh-155px)] lg:min-h-[440px]">
          {/* Panel Tabs */}
          <div className="flex border-b border-slate-800 bg-[#0d1117] px-3 pt-1.5 gap-1 shrink-0">
            <button
              onClick={() => setActiveTab('description')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-t-lg transition cursor-pointer ${
                activeTab === 'description'
                  ? 'bg-[#161b22] text-white border-t-2 border-indigo-500 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" /> Description
            </button>
            <button
              onClick={() => setActiveTab('hints')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-t-lg transition cursor-pointer ${
                activeTab === 'hints'
                  ? 'bg-[#161b22] text-white border-t-2 border-amber-500 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" /> Hints ({question.hints.length})
            </button>
            <button
              onClick={() => setActiveTab('solution')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-t-lg transition cursor-pointer ${
                activeTab === 'solution'
                  ? 'bg-[#161b22] text-white border-t-2 border-emerald-500 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" /> Solution & Complexity
            </button>
          </div>

          {/* Panel Scrollable Content */}
          <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4 text-sm text-slate-300">
            {activeTab === 'description' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{question.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">{question.summary}</p>
                </div>

                {/* Markdown / Formatted Description */}
                <div
                  className={`prose ${
                    resolvedTheme === 'light' ? 'prose-slate' : 'prose-invert'
                  } prose-sm max-w-none space-y-3 leading-relaxed whitespace-pre-line font-sans text-slate-300`}
                >
                  {question.description}
                </div>

                {/* Examples */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Examples
                  </h4>
                  {question.examples.map((ex, i) => (
                    <div
                      key={i}
                      className="bg-[#0d1117] p-3.5 rounded-lg border border-slate-800 space-y-1.5 font-mono text-xs"
                    >
                      <div className="text-slate-400">
                        <strong className="text-slate-200">Input: </strong>
                        <span className="text-sky-300">{ex.input}</span>
                      </div>
                      <div className="text-slate-400">
                        <strong className="text-slate-200">Output: </strong>
                        <span className="text-emerald-300">{ex.output}</span>
                      </div>
                      {ex.explanation && (
                        <div className="text-slate-400 text-[11px] font-sans pt-1 border-t border-slate-800/80">
                          <strong>Explanation: </strong> {ex.explanation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Constraints */}
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Constraints
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-xs text-slate-400 font-mono">
                    {question.constraints.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800">
                  {question.tags.map(t => (
                    <span
                      key={t}
                      className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'hints' && (
              <div className="space-y-4">
                <div className="text-xs text-slate-400">
                  Stuck on this problem? Reveal progressive hints one by one to guide your intuition without giving away the full solution.
                </div>
                {question.hints.map((hint, i) => {
                  const isRevealed = revealedHints.includes(i);
                  return (
                    <div
                      key={i}
                      className="border border-slate-800 bg-[#0d1117] rounded-xl overflow-hidden transition"
                    >
                      <button
                        onClick={() => toggleHint(i)}
                        className="w-full p-3.5 text-left flex items-center justify-between text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800/40"
                      >
                        <span className="flex items-center gap-2">
                          <HelpCircle className="w-4 h-4 text-amber-400" />
                          Hint {i + 1}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${isRevealed ? 'rotate-180' : ''}`}
                        />
                      </button>
                      {isRevealed && (
                        <div className="p-3.5 border-t border-slate-800 bg-[#161b22] text-xs text-slate-300 leading-relaxed font-sans">
                          {hint}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab === 'solution' && (
              <div className="space-y-5">
                {matchingPattern && onOpenPattern && (
                  <div className="bg-gradient-to-r from-indigo-950/60 via-slate-900 to-[#161b22] border border-indigo-500/40 p-3.5 rounded-xl flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <Brain className="w-4 h-4 text-sky-400 shrink-0" />
                      <span className="text-slate-300">
                        Master Pattern: <strong className="text-white">{matchingPattern.title}</strong>
                      </span>
                    </div>
                    <button
                      onClick={() => onOpenPattern(matchingPattern.id)}
                      className="text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1 transition shrink-0"
                    >
                      <span>Explore Pattern Blueprint</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    Optimal Approach & Intuition
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {question.explanation.approach}
                  </p>
                </div>

                {/* Complexities */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#0d1117] p-3 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                      Time Complexity
                    </span>
                    <div className="text-xs font-mono font-bold text-emerald-400 mt-1">
                      {question.explanation.timeComplexity}
                    </div>
                  </div>
                  <div className="bg-[#0d1117] p-3 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                      Space Complexity
                    </span>
                    <div className="text-xs font-mono font-bold text-sky-400 mt-1">
                      {question.explanation.spaceComplexity}
                    </div>
                  </div>
                </div>

                {/* Key Takeaway */}
                <div className="bg-emerald-950/20 border border-emerald-500/30 p-3.5 rounded-lg text-xs text-emerald-200">
                  <strong className="text-emerald-400 block mb-1">Interview Tip:</strong>
                  {question.explanation.keyTakeaway}
                </div>

                {/* Solution Code */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Reference Code
                    </span>
                    <button
                      onClick={() => onCodeChange(question.solutionCode)}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition"
                    >
                      Copy to Editor
                    </button>
                  </div>
                  <pre className="p-3.5 bg-[#0d1117] border border-slate-800 rounded-lg text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed">
                    {question.solutionCode}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Code Editor & Test Results Console */}
        <div className="lg:col-span-7 flex flex-col gap-2.5 h-[620px] lg:h-[calc(100vh-155px)] lg:min-h-[440px]">
          {/* Code Editor Container */}
          <div className="bg-[#161b22] border border-slate-800 rounded-xl overflow-hidden shadow-xl flex flex-col flex-[1.25] min-h-[220px]">
            {/* Editor Action Header */}
            <div className="flex items-center justify-between px-3.5 py-1.5 border-b border-slate-800 bg-[#0d1117]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-mono text-slate-300 font-medium">solution.py</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                  {pyStatus === 'ready' ? 'Python 3.12 (Ready)' : `Python (${pyStatus})`}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={isScriptRunning || isRunning}
                  onClick={handleRunScript}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition shadow-md shadow-sky-500/20 disabled:opacity-50 cursor-pointer active:scale-95"
                  title="Execute solution.py and view console print output"
                  aria-label="Run script"
                >
                  {isScriptRunning ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>{t('runScriptBtn')}...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{t('runScriptBtn')}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleResetCode}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition cursor-pointer active:scale-95"
                  title="Reset to starter template"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset
                </button>

                <button
                  type="button"
                  disabled={isRunning || isScriptRunning}
                  onClick={handleRunCode}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow-lg shadow-emerald-500/25 disabled:opacity-50 cursor-pointer active:scale-95"
                >
                  {isRunning ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Running...
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      Run Tests
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Monaco Editor */}
            <div className="flex-1 w-full bg-[#0d1117] min-h-0">
              <Editor
                height="100%"
                defaultLanguage="python"
                value={userCode}
                onChange={val => onCodeChange(val || '')}
                theme={resolvedTheme === 'light' ? 'vs' : 'vs-dark'}
                options={{
                  fontSize: 13,
                  lineNumbers: 'on',
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  tabSize: 4,
                  insertSpaces: true,
                  automaticLayout: true,
                  fontFamily: 'Consolas, "Fira Code", monospace',
                  padding: { top: 10, bottom: 10 },
                }}
              />
            </div>
          </div>

          {/* Bottom Execution & Interactive Console Panel */}
          <div className="bg-[#161b22] border border-slate-800 rounded-xl overflow-hidden shadow-xl flex flex-col flex-1 min-h-[180px]">
            {/* Multi-Tab Console Header */}
            <div className="flex items-center justify-between px-3.5 py-1.5 border-b border-slate-800 bg-[#0d1117]">
              {/* Tab Navigation */}
              <div className="flex items-center gap-1.5" role="tablist" aria-label="Console views">
                <button
                  type="button"
                  role="tab"
                  aria-selected={bottomTab === 'tests'}
                  aria-controls="panel-test-results"
                  id="tab-test-results"
                  onClick={() => setBottomTab('tests')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    bottomTab === 'tests'
                      ? 'bg-slate-800 text-white border border-slate-700/80 shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5 text-slate-400" />
                  <span>{t('tabTestResults')}</span>
                  {executionResult && (
                    <span
                      className={`ml-1 px-1.5 py-0.2 rounded text-[10px] font-mono font-bold ${
                        executionResult.success
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {executionResult.passedCount}/{executionResult.totalCount}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  role="tab"
                  aria-selected={bottomTab === 'console'}
                  aria-controls="panel-script-console"
                  id="tab-script-console"
                  onClick={() => setBottomTab('console')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    bottomTab === 'console'
                      ? 'bg-slate-800 text-white border border-slate-700/80 shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5 text-sky-400" />
                  <span>{t('tabConsole')}</span>
                  {scriptResult && (
                    <span
                      className={`w-2 h-2 rounded-full ${
                        scriptResult.error ? 'bg-rose-400' : 'bg-emerald-400'
                      }`}
                    />
                  )}
                </button>

                <button
                  type="button"
                  role="tab"
                  aria-selected={bottomTab === 'repl'}
                  aria-controls="panel-interactive-repl"
                  id="tab-interactive-repl"
                  onClick={() => setBottomTab('repl')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    bottomTab === 'repl'
                      ? 'bg-slate-800 text-white border border-slate-700/80 shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{t('tabInteractiveRepl')}</span>
                  {consoleEntries.length > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-500/20 text-indigo-300 font-mono font-semibold">
                      {consoleEntries.length}
                    </span>
                  )}
                </button>
              </div>

              {/* Header Right Actions */}
              <div className="flex items-center gap-2">
                {bottomTab === 'tests' && executionResult && (
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="flex items-center gap-1 text-slate-400">
                      <Clock className="w-3 h-3" /> {executionResult.executionTimeMs}ms
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded font-bold ${
                        executionResult.success
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {executionResult.success
                        ? 'All Tests Passed'
                        : `${executionResult.passedCount}/${executionResult.totalCount} Passed`}
                    </span>
                  </div>
                )}

                {bottomTab === 'console' && (
                  <div className="flex items-center gap-2">
                    {scriptResult && (
                      <span className="flex items-center gap-1 text-slate-400 text-xs font-mono">
                        <Clock className="w-3 h-3" /> {scriptResult.executionTimeMs}ms
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => setScriptResult(null)}
                      disabled={!scriptResult}
                      title={t('consoleScriptClearBtn')}
                      aria-label={t('consoleScriptClearBtn')}
                      className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800 disabled:opacity-30 disabled:hover:text-slate-400 transition text-xs flex items-center gap-1 px-2 cursor-pointer active:scale-95"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span className="text-[11px] hidden md:inline">{t('consoleScriptClearBtn')}</span>
                    </button>
                  </div>
                )}

                {bottomTab === 'repl' && (
                  <div className="flex items-center gap-1.5">
                    <span
                      className="hidden sm:inline-flex items-center gap-1.5 text-[11px] text-emerald-400/90 font-mono mr-1"
                      title={t('consoleSyncNotice')}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Python 3.12 REPL</span>
                    </span>

                    <button
                      type="button"
                      onClick={handleResetReplSession}
                      title={t('consoleResetEnv')}
                      aria-label={t('consoleResetEnv')}
                      className="p-1 rounded text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition text-xs flex items-center gap-1 px-2 cursor-pointer active:scale-95"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span className="text-[11px] hidden md:inline">{t('consoleResetEnv')}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleClearConsole}
                      disabled={consoleEntries.length === 0}
                      title={t('consoleClearBtn')}
                      aria-label={t('consoleClearBtn')}
                      className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800 disabled:opacity-30 disabled:hover:text-slate-400 transition text-xs flex items-center gap-1 px-2 cursor-pointer active:scale-95"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span className="text-[11px] hidden md:inline">{t('consoleClearBtn')}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Test Results Tab Content */}
            {bottomTab === 'tests' && (
              <div
                role="tabpanel"
                id="panel-test-results"
                aria-labelledby="tab-test-results"
                className="p-4 overflow-y-auto flex-1 font-mono text-xs space-y-3"
              >
                {!executionResult && !isRunning && (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center space-y-1">
                    <Terminal className="w-8 h-8 opacity-40 mb-1" />
                    <p>Click "Run Tests" to execute your code against test cases.</p>
                    <p className="text-[11px] text-slate-600">
                      Runs 100% locally in browser via Python 3.12 WebAssembly
                    </p>
                  </div>
                )}

                {isRunning && (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
                    <Loader2 className="w-7 h-7 text-emerald-400 animate-spin" />
                    <div>Executing test harness...</div>
                    {statusMessage && <div className="text-[11px] text-slate-500">{statusMessage}</div>}
                  </div>
                )}

                {executionResult && (
                  <div className="space-y-3">
                    {/* Global Python Error (SyntaxError, NameError, etc.) */}
                    {executionResult.error && (
                      <div className="bg-rose-950/40 border border-rose-500/40 p-3 rounded-lg text-rose-300 whitespace-pre-wrap leading-relaxed">
                        <div className="font-bold flex items-center gap-1.5 mb-1 text-rose-400">
                          <XCircle className="w-4 h-4" /> Runtime / Execution Exception:
                        </div>
                        {executionResult.error}
                      </div>
                    )}

                    {/* Test Cases Tabs */}
                    {executionResult.results.length > 0 && (
                      <div>
                        <div className="flex gap-1.5 border-b border-slate-800 pb-2">
                          {executionResult.results.map((t, idx) => (
                            <button
                              key={t.id}
                              onClick={() => setActiveTestTab(idx)}
                              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                                activeTestTab === idx
                                  ? 'bg-slate-800 text-white border border-slate-700'
                                  : 'text-slate-400 hover:text-slate-200'
                              }`}
                            >
                              {t.passed ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <XCircle className="w-3.5 h-3.5 text-rose-400" />
                              )}
                              Case {t.id}
                            </button>
                          ))}
                        </div>

                        {/* Active Test Case Detail */}
                        {(() => {
                          const currentTest =
                            executionResult.results[activeTestTab] || executionResult.results[0];
                          if (!currentTest) return null;
                          return (
                            <div className="pt-3 space-y-2">
                              <div className="bg-[#0d1117] p-2.5 rounded-lg border border-slate-800">
                                <span className="text-slate-400 block text-[11px]">Input:</span>
                                <span className="text-sky-300 font-mono break-all">
                                  {currentTest.input || '(empty)'}
                                </span>
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div className="bg-[#0d1117] p-2.5 rounded-lg border border-slate-800">
                                  <span className="text-slate-400 block text-[11px]">Expected:</span>
                                  <span className="text-emerald-300 font-mono break-all">
                                    {currentTest.expected}
                                  </span>
                                </div>
                                <div className="bg-[#0d1117] p-2.5 rounded-lg border border-slate-800">
                                  <span className="text-slate-400 block text-[11px]">Your Output:</span>
                                  <span
                                    className={`font-mono break-all ${
                                      currentTest.passed ? 'text-emerald-300' : 'text-rose-400'
                                    }`}
                                  >
                                    {currentTest.actual}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    )}

                    {/* Standard Output (User's print statements) */}
                    {executionResult.stdout && (
                      <div className="bg-[#0d1117] p-3 rounded-lg border border-slate-800">
                        <span className="text-slate-400 block text-[11px] mb-1">
                          Captured Standard Output (stdout):
                        </span>
                        <pre className="text-slate-300 whitespace-pre-wrap">
                          {executionResult.stdout}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Script Console Output Tab Content */}
            {bottomTab === 'console' && (
              <div
                role="tabpanel"
                id="panel-script-console"
                aria-labelledby="tab-script-console"
                className="p-4 overflow-y-auto flex-1 font-mono text-xs space-y-3 bg-[#0d1117]"
              >
                {!scriptResult && !isScriptRunning && (
                  <div className="h-full min-h-[140px] flex flex-col items-center justify-center text-slate-500 text-center p-4 space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center mb-1">
                      <Terminal className="w-5 h-5 text-sky-400" />
                    </div>
                    <p className="text-slate-200 font-semibold text-xs">{t('tabConsole')}</p>
                    <p className="text-[11px] text-slate-400 max-w-md leading-relaxed">
                      {t('consoleScriptEmptyNotice')}
                    </p>
                    <button
                      type="button"
                      onClick={handleRunScript}
                      className="mt-1 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold transition shadow-md shadow-sky-500/20 cursor-pointer active:scale-95"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      {t('runScriptBtn')} solution.py
                    </button>
                  </div>
                )}

                {isScriptRunning && (
                  <div className="h-full min-h-[140px] flex flex-col items-center justify-center text-slate-400 space-y-2">
                    <Loader2 className="w-7 h-7 text-sky-400 animate-spin" />
                    <div>{t('consoleScriptRunning')}</div>
                    {statusMessage && <div className="text-[11px] text-slate-500">{statusMessage}</div>}
                  </div>
                )}

                {scriptResult && (
                  <div className="space-y-3">
                    {/* Error / Traceback */}
                    {scriptResult.error && (
                      <div className="bg-rose-950/40 border border-rose-500/40 p-3.5 rounded-lg text-rose-300 whitespace-pre-wrap leading-relaxed">
                        <div className="font-bold flex items-center gap-1.5 mb-1 text-rose-400">
                          <XCircle className="w-4 h-4" /> Runtime / Execution Exception:
                        </div>
                        {scriptResult.error}
                      </div>
                    )}

                    {/* Standard Output (User's print statements) */}
                    {scriptResult.stdout ? (
                      <div className="bg-[#161b22] p-3.5 rounded-lg border border-slate-800 space-y-1.5">
                        <div className="flex items-center justify-between text-slate-400 text-[11px] pb-1 border-b border-slate-800/80">
                          <span className="font-semibold text-slate-300">Captured Output (stdout):</span>
                          <span className="text-slate-500 font-mono text-[10px] flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" /> {scriptResult.executionTimeMs}ms
                          </span>
                        </div>
                        <pre className="text-slate-100 whitespace-pre-wrap leading-relaxed font-mono text-xs select-text">
                          {scriptResult.stdout}
                        </pre>
                      </div>
                    ) : !scriptResult.error ? (
                      <div className="bg-[#161b22] p-3.5 rounded-lg border border-slate-800 text-slate-400 text-xs italic">
                        {t('consoleNoOutput')}
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            )}

            {/* Interactive REPL Tab Content */}
            {bottomTab === 'repl' && (
              <div
                role="tabpanel"
                id="panel-interactive-repl"
                aria-labelledby="tab-interactive-repl"
                className="flex-1 flex flex-col min-h-0 bg-[#0d1117]"
              >
                {/* Scrollable Console Output Stream */}
                <div className="flex-1 overflow-y-auto p-3.5 font-mono text-xs space-y-2.5 min-h-[100px]">
                  {consoleEntries.length === 0 ? (
                    <div className="h-full min-h-[110px] flex flex-col items-center justify-center text-center p-3">
                      <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-2">
                        <Code2 className="w-4 h-4 text-indigo-400" />
                      </div>
                      <p className="text-slate-200 font-semibold mb-1">{t('tabInteractiveRepl')}</p>
                      <p className="text-[11px] text-slate-400 max-w-md leading-relaxed mb-3">
                        {t('consoleEmptyNotice')}
                      </p>
                      <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-lg">
                        <span className="text-[11px] text-slate-500 mr-1">{t('consoleQuickExamples')}:</span>
                        {sampleCall && (
                          <button
                            type="button"
                            onClick={() => handleRunConsole(sampleCall)}
                            className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-sky-300 text-[11px] transition border border-slate-700/60 cursor-pointer active:scale-95"
                          >
                            {sampleCall}
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRunConsole('dir()')}
                          className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-emerald-300 text-[11px] transition border border-slate-700/60 cursor-pointer active:scale-95"
                        >
                          dir()
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRunConsole('[k for k in dir() if not k.startswith("_")]')}
                          className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-amber-300 text-[11px] transition border border-slate-700/60 cursor-pointer active:scale-95"
                        >
                          list variables
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {consoleEntries.map(entry => (
                        <div key={entry.id} className="space-y-1">
                          <div className="flex items-center justify-between text-slate-400 text-[11px]">
                            <div className="flex items-center gap-1.5 font-bold text-slate-200">
                              <span className="text-emerald-400 select-none">&gt;&gt;&gt;</span>
                              <span>{entry.command}</span>
                            </div>
                            {entry.elapsedMs !== undefined && (
                              <span className="text-[10px] text-slate-500 flex items-center gap-1">
                                <Clock className="w-2.5 h-2.5" />
                                {entry.elapsedMs}ms
                              </span>
                            )}
                          </div>

                          {entry.stdout && (
                            <pre className="text-slate-300 whitespace-pre-wrap pl-3.5 border-l-2 border-slate-700/80 my-1 font-mono text-xs">
                              {entry.stdout}
                            </pre>
                          )}

                          {entry.result !== undefined && (
                            <div className="pl-3.5 border-l-2 border-emerald-500/80 my-1 font-mono text-xs text-emerald-400 font-semibold break-all whitespace-pre-wrap">
                              {entry.result}
                            </div>
                          )}

                          {entry.error && (
                            <div className="pl-3.5 border-l-2 border-rose-500/80 my-1 font-mono text-xs text-rose-400 whitespace-pre-wrap">
                              {entry.error}
                            </div>
                          )}
                        </div>
                      ))}
                      <div ref={consoleEndRef} />
                    </div>
                  )}
                </div>

                {/* Quick Evaluation Chips bar (when entries exist) */}
                {consoleEntries.length > 0 && (
                  <div className="px-3 py-1 bg-[#12161f] border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto text-[11px]">
                    <span className="text-slate-500 font-semibold shrink-0">{t('consoleQuickExamples')}:</span>
                    {sampleCall && (
                      <button
                        type="button"
                        onClick={() => handleRunConsole(sampleCall)}
                        className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-sky-300 font-mono shrink-0 transition border border-slate-700/40 cursor-pointer active:scale-95"
                      >
                        {sampleCall}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRunConsole('dir()')}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-emerald-300 font-mono shrink-0 transition border border-slate-700/40 cursor-pointer active:scale-95"
                    >
                      dir()
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRunConsole('[k for k in dir() if not k.startswith("_")]')}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 font-mono shrink-0 transition border border-slate-700/40 cursor-pointer active:scale-95"
                    >
                      vars
                    </button>
                  </div>
                )}

                {/* Console Command Input Bar */}
                <div className="p-2 border-t border-slate-800 bg-[#161b22] flex items-center gap-2">
                  <span className="font-mono font-bold text-emerald-400 text-xs pl-1 select-none">&gt;&gt;&gt;</span>
                  <input
                    ref={consoleInputRef}
                    type="text"
                    value={consoleInput}
                    onChange={e => setConsoleInput(e.target.value)}
                    onKeyDown={handleConsoleKeyDown}
                    placeholder={t('consolePromptPlaceholder')}
                    disabled={isConsoleRunning}
                    aria-label={t('consolePromptPlaceholder')}
                    className="flex-1 bg-transparent font-mono text-xs text-slate-100 placeholder-slate-500 outline-none border-none focus:ring-0"
                  />
                  <button
                    type="button"
                    onClick={() => handleRunConsole()}
                    disabled={!consoleInput.trim() || isConsoleRunning}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition disabled:opacity-40 disabled:hover:bg-indigo-600 cursor-pointer active:scale-95"
                    aria-label={t('consoleRunBtn')}
                  >
                    {isConsoleRunning ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <CornerDownLeft className="w-3.5 h-3.5" />
                    )}
                    <span className="hidden sm:inline">{t('consoleRunBtn')}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lightweight, Ultra-fast Reset Code Confirmation Modal */}
      {showResetModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setShowResetModal(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="reset-modal-title"
        >
          <div
            className="bg-[#161b22] border border-slate-700/80 rounded-2xl p-5 max-w-sm w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-150"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0">
                <RotateCcw className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <h3 id="reset-modal-title" className="text-sm font-bold text-slate-100 dark:text-white light:text-slate-900">
                  Reset Code to Starter?
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Revert back to starter boilerplate
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              This will discard all edits you've written for{' '}
              <strong className="text-slate-100 dark:text-white light:text-slate-900 font-semibold">
                {question.title}
              </strong>{' '}
              and reload the original template.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition cursor-pointer active:scale-95"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 shadow-md shadow-rose-600/20 transition cursor-pointer active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Code
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
