import React, { useState, useEffect, useCallback } from 'react';
import { quizQuestions } from '../../data/quizQuestions';
import type { UserQuizProgress, QuizViewMode } from '../../types/quiz';
import { useLanguage } from '../../context/LanguageContext';
import { QuizCard } from './QuizCard';
import { OpenEndedCard } from './OpenEndedCard';
import { FlashcardView } from './FlashcardView';
import { QuizListView } from './QuizListView';
import { PageHeaderCard } from '../PageHeaderCard';
import { SlidingTabs, type TabItem } from '../SlidingTabs';
import {
  GraduationCap,
  Layers,
  Trophy,
  CheckCircle2,
  Bookmark,
  RotateCcw,
  ListFilter,
  BarChart3,
  HelpCircle,
} from 'lucide-react';

const QUIZ_STORAGE_KEY = 'py_interview_pro_quiz_v1';

export const QuizHub: React.FC = () => {
  const { t } = useLanguage();

  // Progress state loaded from localStorage
  const [progress, setProgress] = useState<UserQuizProgress>(() => {
    try {
      const saved = localStorage.getItem(QUIZ_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load quiz progress from localStorage:', e);
    }
    return {
      selectedAnswers: {},
      openEndedNotes: {},
      openEndedCheckedCriteria: {},
      bookmarkedIds: [],
      completedIds: [],
    };
  });

  const [viewMode, setViewMode] = useState<QuizViewMode>('quiz');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [showQuestionMap, setShowQuestionMap] = useState<boolean>(false);
  const [showResetModal, setShowResetModal] = useState<boolean>(false);

  // Sync progress state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.warn('Failed to save quiz progress to localStorage:', e);
    }
  }, [progress]);

  // Handlers for MCQ and Open-Ended
  const handleSelectOption = useCallback(
    (questionId: number, option: 'A' | 'B' | 'C' | 'D') => {
      setProgress(prev => {
        const nextAnswers = { ...prev.selectedAnswers, [questionId]: option };
        const nextCompleted = Array.from(new Set([...prev.completedIds, questionId]));
        return {
          ...prev,
          selectedAnswers: nextAnswers,
          completedIds: nextCompleted,
        };
      });
    },
    []
  );

  const handleResetOption = useCallback((questionId: number) => {
    setProgress(prev => {
      const nextAnswers = { ...prev.selectedAnswers };
      delete nextAnswers[questionId];
      const nextCompleted = prev.completedIds.filter(id => id !== questionId);
      return {
        ...prev,
        selectedAnswers: nextAnswers,
        completedIds: nextCompleted,
      };
    });
  }, []);

  const handleNotesChange = useCallback((questionId: number, notes: string) => {
    setProgress(prev => ({
      ...prev,
      openEndedNotes: {
        ...prev.openEndedNotes,
        [questionId]: notes,
      },
    }));
  }, []);

  const handleToggleCriterion = useCallback((questionId: number, criterionIndex: number) => {
    setProgress(prev => {
      const existing = prev.openEndedCheckedCriteria[questionId] || [];
      const updated = existing.includes(criterionIndex)
        ? existing.filter(idx => idx !== criterionIndex)
        : [...existing, criterionIndex];

      return {
        ...prev,
        openEndedCheckedCriteria: {
          ...prev.openEndedCheckedCriteria,
          [questionId]: updated,
        },
      };
    });
  }, []);

  const handleToggleCompleted = useCallback((questionId: number) => {
    setProgress(prev => {
      const isCompleted = prev.completedIds.includes(questionId);
      const nextCompleted = isCompleted
        ? prev.completedIds.filter(id => id !== questionId)
        : [...prev.completedIds, questionId];

      return {
        ...prev,
        completedIds: nextCompleted,
      };
    });
  }, []);

  const handleToggleBookmark = useCallback((questionId: number) => {
    setProgress(prev => {
      const isBookmarked = prev.bookmarkedIds.includes(questionId);
      const nextBookmarks = isBookmarked
        ? prev.bookmarkedIds.filter(id => id !== questionId)
        : [...prev.bookmarkedIds, questionId];

      return {
        ...prev,
        bookmarkedIds: nextBookmarks,
      };
    });
  }, []);

  const handleRateFlashcard = useCallback((questionId: number, rating: 'mastered' | 'review') => {
    setProgress(prev => {
      if (rating === 'mastered') {
        const nextCompleted = Array.from(new Set([...prev.completedIds, questionId]));
        const nextBookmarked = prev.bookmarkedIds.filter(id => id !== questionId);
        return {
          ...prev,
          completedIds: nextCompleted,
          bookmarkedIds: nextBookmarked,
        };
      } else {
        const nextBookmarked = Array.from(new Set([...prev.bookmarkedIds, questionId]));
        const nextCompleted = prev.completedIds.filter(id => id !== questionId);
        return {
          ...prev,
          bookmarkedIds: nextBookmarked,
          completedIds: nextCompleted,
        };
      }
    });
  }, []);

  const handleResetProgress = () => {
    setShowResetModal(true);
  };

  const handleConfirmReset = () => {
    setProgress({
      selectedAnswers: {},
      openEndedNotes: {},
      openEndedCheckedCriteria: {},
      bookmarkedIds: [],
      completedIds: [],
    });
    setCurrentIndex(0);
    setShowResetModal(false);
    try {
      localStorage.removeItem(QUIZ_STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to clear quiz progress in localStorage:', e);
    }
  };

  // Stats calculation
  const totalQuestions = quizQuestions.length; // 100
  const mcqQuestions = quizQuestions.filter(q => q.type === 'multiple-choice');
  const answeredMCQCount = Object.keys(progress.selectedAnswers).length;

  let correctMCQCount = 0;
  for (const q of mcqQuestions) {
    if (progress.selectedAnswers[q.id] === q.answer) {
      correctMCQCount++;
    }
  }

  const accuracyRate =
    answeredMCQCount > 0 ? Math.round((correctMCQCount / answeredMCQCount) * 100) : 0;
  const completedTotal = progress.completedIds.length;
  const overallPercent = Math.round((completedTotal / totalQuestions) * 100);

  const currentQuestion = quizQuestions[currentIndex] || quizQuestions[0];
  const isCurrentBookmarked = progress.bookmarkedIds.includes(currentQuestion.id);
  const isCurrentCompleted = progress.completedIds.includes(currentQuestion.id);

  const quizModes: TabItem<QuizViewMode>[] = [
    {
      id: 'quiz',
      label: t('quizModeQuiz'),
      icon: HelpCircle,
    },
    {
      id: 'flashcard',
      label: t('quizModeFlashcard'),
      icon: Layers,
    },
    {
      id: 'list',
      label: t('quizModeList'),
      icon: ListFilter,
    },
  ];

  return (
    <div className="max-w-[1700px] w-full mx-auto space-y-6 pb-16">
      {/* Reusable Fixed-Height Header Card - Zero CLS */}
      <PageHeaderCard
        badgeIcon={GraduationCap}
        badgeText="150 Technical Qs Knowledge Bank"
        badgeColor="text-indigo-400"
        title={t('quizHeroTitle')}
        description={t('quizHeroDesc')}
      />

      {/* Stats Bar */}
      <section
        className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4"
        aria-label="Quiz Performance Metrics"
      >
        <div className="bg-[#161b22] border border-slate-800 rounded-xl p-3.5 sm:p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 text-sky-400" />
          </div>
          <div>
            <div className="text-[11px] font-medium text-slate-400">{t('quizStatsCompleted')}</div>
            <div className="text-lg sm:text-xl font-bold font-mono text-white">
              {completedTotal} <span className="text-xs text-slate-500 font-normal">/ {totalQuestions}</span>
            </div>
          </div>
        </div>

        <div className="bg-[#161b22] border border-slate-800 rounded-xl p-3.5 sm:p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <Trophy className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="text-[11px] font-medium text-slate-400">{t('quizStatsAccuracy')}</div>
            <div className="text-lg sm:text-xl font-bold font-mono text-emerald-400">
              {accuracyRate}%{' '}
              <span className="text-xs text-slate-500 font-normal">
                ({correctMCQCount}/{answeredMCQCount})
              </span>
            </div>
          </div>
        </div>

        <div className="bg-[#161b22] border border-slate-800 rounded-xl p-3.5 sm:p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
            <Bookmark className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="text-[11px] font-medium text-slate-400">{t('quizStatsBookmarked')}</div>
            <div className="text-lg sm:text-xl font-bold font-mono text-amber-300">
              {progress.bookmarkedIds.length}
            </div>
          </div>
        </div>

        <div className="bg-[#161b22] border border-slate-800 rounded-xl p-3.5 sm:p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
              <BarChart3 className="w-5 h-5 text-purple-400" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-medium text-slate-400">{t('quizStatsMastery')}</div>
              <div className="text-lg sm:text-xl font-bold font-mono text-purple-300">
                {overallPercent}%
              </div>
            </div>
          </div>

          <button
            onClick={handleResetProgress}
            className="p-2 rounded-lg bg-[#0d1117] text-slate-400 hover:text-rose-400 border border-slate-800 transition-colors"
            title={t('quizProgressResetBtn')}
            aria-label={t('quizProgressResetBtn')}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Mode Switcher & Question Navigator Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#161b22] border border-slate-800 p-2 sm:p-3 rounded-2xl">
        {/* Mode Buttons with Fast-Sliding Active Container Pill */}
        <SlidingTabs
          tabs={quizModes}
          activeTab={viewMode}
          onChange={(mode) => setViewMode(mode)}
          ariaLabel="Quiz Navigation Modes"
          className="w-full sm:w-auto"
        />

        {/* Question Map Dropdown Toggle (1..100) */}
        {viewMode !== 'list' && (
          <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowQuestionMap(prev => !prev)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0d1117] border border-slate-800 text-xs font-mono text-slate-300 hover:text-white hover:border-slate-700 transition"
            >
              <span>
                Q {currentIndex + 1} / {totalQuestions}
              </span>
              <span className="text-[10px] text-sky-400">
                {showQuestionMap ? '▲ Hide Map' : '▼ Jump Map'}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Interactive 150-Question Mini Map (Expandable) */}
      {showQuestionMap && viewMode !== 'list' && (
        <section
          className="bg-[#161b22] border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl animate-fadeIn"
          aria-label="150 Questions Fast Jump Navigator"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs font-mono text-slate-400 mb-3 pb-2 border-b border-slate-800">
            <span className="font-bold text-slate-200 shrink-0">150 Questions Navigator</span>
            <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1.5 text-[11px]">
              <span className="flex items-center gap-1.5 shrink-0">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" /> Correct
              </span>
              <span className="flex items-center gap-1.5 shrink-0">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" /> Incorrect
              </span>
              <span className="flex items-center gap-1.5 shrink-0">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shrink-0" /> System Design
              </span>
              <span className="flex items-center gap-1.5 shrink-0">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-700 shrink-0" /> Unanswered MCQ
              </span>
            </div>
          </div>

          <div className="grid grid-cols-10 sm:grid-cols-20 md:grid-cols-25 gap-1.5 max-h-64 overflow-y-auto p-1">
            {quizQuestions.map((q, idx) => {
              const isSelected = idx === currentIndex;
              const isMCQ = q.type === 'multiple-choice';
              const userAns = isMCQ ? progress.selectedAnswers[q.id] : undefined;
              const isAns = isMCQ ? userAns !== undefined : progress.completedIds.includes(q.id);
              const isCorr = isMCQ && userAns === q.answer;
              const isBookmarked = progress.bookmarkedIds.includes(q.id);

              let bgClass = 'bg-[#0d1117] text-slate-400 border-slate-800 hover:border-slate-600';
              if (isMCQ) {
                if (isAns) {
                  if (isCorr) {
                    bgClass = 'bg-emerald-950/60 text-emerald-300 border-emerald-500/50';
                  } else {
                    bgClass = 'bg-rose-950/60 text-rose-300 border-rose-500/50';
                  }
                }
              } else {
                // System Design questions (IDs 71-100)
                if (progress.completedIds.includes(q.id)) {
                  bgClass = 'bg-purple-600/40 text-purple-200 border-purple-400 font-bold shadow-sm shadow-purple-500/20';
                } else if (
                  progress.openEndedNotes[q.id] &&
                  progress.openEndedNotes[q.id].trim().length > 0
                ) {
                  bgClass = 'bg-amber-950/40 text-amber-300 border-amber-500/40';
                } else {
                  bgClass = 'bg-purple-950/30 text-purple-300 border-purple-700/50 hover:border-purple-400 hover:bg-purple-900/40';
                }
              }

              if (isSelected) {
                bgClass += ' ring-2 ring-sky-400 font-bold';
              }

              return (
                <button
                  type="button"
                  key={q.id}
                  onClick={() => {
                    setCurrentIndex(idx);
                    setShowQuestionMap(false);
                  }}
                  className={`relative h-8 rounded-lg text-xs font-mono border flex items-center justify-center transition-all ${bgClass}`}
                  title={`#${q.id} (${q.section})`}
                  aria-label={`Jump to question ${q.id}`}
                >
                  {q.id}
                  {isBookmarked && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400" />
                  )}
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Main View Area */}
      {viewMode === 'quiz' && (
        <div>
          {currentQuestion.type === 'multiple-choice' ? (
            <QuizCard
              question={currentQuestion}
              selectedOption={progress.selectedAnswers[currentQuestion.id]}
              isBookmarked={isCurrentBookmarked}
              onSelectOption={opt => handleSelectOption(currentQuestion.id, opt)}
              onResetOption={() => handleResetOption(currentQuestion.id)}
              onToggleBookmark={() => handleToggleBookmark(currentQuestion.id)}
              onPrev={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
              onNext={() => setCurrentIndex(prev => Math.min(totalQuestions - 1, prev + 1))}
              hasPrev={currentIndex > 0}
              hasNext={currentIndex < totalQuestions - 1}
              currentIndex={currentIndex}
              totalCount={totalQuestions}
            />
          ) : (
            <OpenEndedCard
              question={currentQuestion}
              userNotes={progress.openEndedNotes[currentQuestion.id] || ''}
              checkedCriteria={progress.openEndedCheckedCriteria[currentQuestion.id] || []}
              isCompleted={isCurrentCompleted}
              isBookmarked={isCurrentBookmarked}
              onNotesChange={notes => handleNotesChange(currentQuestion.id, notes)}
              onToggleCriterion={critIdx => handleToggleCriterion(currentQuestion.id, critIdx)}
              onToggleCompleted={() => handleToggleCompleted(currentQuestion.id)}
              onToggleBookmark={() => handleToggleBookmark(currentQuestion.id)}
              onPrev={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
              onNext={() => setCurrentIndex(prev => Math.min(totalQuestions - 1, prev + 1))}
              hasPrev={currentIndex > 0}
              hasNext={currentIndex < totalQuestions - 1}
              currentIndex={currentIndex}
              totalCount={totalQuestions}
            />
          )}
        </div>
      )}

      {viewMode === 'flashcard' && (
        <FlashcardView
          questions={quizQuestions}
          progress={progress}
          initialQuestionIndex={currentIndex}
          onRateCard={handleRateFlashcard}
          onToggleBookmark={handleToggleBookmark}
        />
      )}

      {viewMode === 'list' && (
        <QuizListView
          questions={quizQuestions}
          progress={progress}
          onSelectQuestion={(idx, mode) => {
            setCurrentIndex(idx);
            setViewMode(mode);
          }}
          onToggleBookmark={id => handleToggleBookmark(id)}
        />
      )}

      {/* Accessible Confirmation Modal for Resetting Quiz Progress */}
      {showResetModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setShowResetModal(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="quiz-reset-modal-title"
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
                <h3 id="quiz-reset-modal-title" className="text-sm font-bold text-slate-100 dark:text-white">
                  {t('quizProgressResetTitle')}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {t('quizProgressResetSubtitle')}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {t('quizProgressResetConfirm')}
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition cursor-pointer active:scale-95"
              >
                {t('resetModalCancel')}
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 shadow-md shadow-rose-600/20 transition cursor-pointer active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                {t('quizProgressResetBtn')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
