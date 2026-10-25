import React, { useState, useEffect, useCallback } from 'react';
import type { QuizQuestion } from '../../types/quiz';
import { useLanguage } from '../../context/LanguageContext';
import {
  RotateCcw,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Award,
} from 'lucide-react';

interface FlashcardViewProps {
  questions: QuizQuestion[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  isBookmarked: boolean;
  isCompleted: boolean;
  onToggleBookmark: () => void;
  onToggleCompleted: () => void;
}

export const FlashcardView: React.FC<FlashcardViewProps> = ({
  questions,
  currentIndex,
  onIndexChange,
  isBookmarked,
  isCompleted,
  onToggleBookmark,
  onToggleCompleted,
}) => {
  const { t } = useLanguage();
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  const currentQ = questions[currentIndex] || questions[0];
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < questions.length - 1;

  // Reset flip state when question changes
  useEffect(() => {
    setIsFlipped(false);
  }, [currentIndex]);

  const handleFlip = useCallback(() => {
    setIsFlipped(prev => !prev);
  }, []);

  const handlePrev = useCallback(() => {
    if (hasPrev) onIndexChange(currentIndex - 1);
  }, [hasPrev, currentIndex, onIndexChange]);

  const handleNext = useCallback(() => {
    if (hasNext) onIndexChange(currentIndex + 1);
  }, [hasNext, currentIndex, onIndexChange]);

  // Keyboard navigation for flashcards
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        handleFlip();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      }
    },
    [handleFlip, handlePrev, handleNext]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!currentQ) return null;

  const isMCQ = currentQ.type === 'multiple-choice';

  return (
    <div className="max-w-4xl mx-auto flex flex-col items-center">
      {/* Flashcard Header Controls */}
      <div className="w-full flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
            Card {currentIndex + 1} {t('quizOf')} {questions.length}
          </span>
          <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 hidden sm:inline truncate max-w-xs">
            {currentQ.section}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleBookmark}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              isBookmarked
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700'
            }`}
            title={isBookmarked ? t('quizBookmarked') : t('quizBookmark')}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
            <span className="hidden sm:inline">
              {isBookmarked ? t('quizBookmarked') : t('quizBookmark')}
            </span>
          </button>
        </div>
      </div>

      {/* Main Flashcard Container */}
      <div
        onClick={handleFlip}
        role="button"
        tabIndex={0}
        aria-label={`${t('flashcardFlipPrompt')}. Current: ${isFlipped ? t('flashcardBack') : t('flashcardFront')}`}
        onKeyDown={e => {
          if (e.key === 'Enter') handleFlip();
        }}
        className="w-full min-h-[420px] sm:min-h-[460px] bg-[#161b22] hover:border-sky-500/50 border border-slate-800 rounded-2xl p-6 sm:p-9 shadow-2xl cursor-pointer select-none flex flex-col justify-between transition-all duration-200 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
      >
        {/* Top Card Badge */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                isFlipped
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
              }`}
            >
              {isFlipped ? t('flashcardBack') : t('flashcardFront')}
            </span>
            <span className="text-xs text-slate-400">
              {isMCQ ? t('quizTypeMCQ') : t('quizTypeOpenEnded')}
            </span>
          </div>

          <span className="text-xs text-slate-500 font-mono flex items-center gap-1 group-hover:text-sky-400 transition-colors">
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t('flashcardFlipPrompt')}</span>
          </span>
        </div>

        {/* Card Body (Front vs Back) */}
        <div className="my-auto py-6">
          {!isFlipped ? (
            /* FRONT: Question Prompt & Options Preview */
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white leading-relaxed mb-6">
                {currentQ.question}
              </h2>

              {isMCQ && (
                <div className="grid grid-cols-1 gap-2.5 opacity-80 pointer-events-none">
                  {(['A', 'B', 'C', 'D'] as const).map(letter => (
                    <div
                      key={letter}
                      className="p-3 rounded-xl bg-[#0d1117] border border-slate-800/80 flex items-start gap-3 text-xs sm:text-sm text-slate-300"
                    >
                      <span className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center font-mono font-bold text-xs text-slate-400 shrink-0">
                        {letter}
                      </span>
                      <span>{currentQ.options[letter]}</span>
                    </div>
                  ))}
                </div>
              )}

              {!isMCQ && (
                <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 text-xs sm:text-sm text-purple-300 flex items-center gap-2">
                  <Award className="w-4 h-4 shrink-0 text-purple-400" />
                  <span>
                    Formulate your architecture, tradeoffs, and failure modes mentally or on paper,
                    then click to reveal the staff engineering criteria.
                  </span>
                </div>
              )}
            </div>
          ) : (
            /* BACK: Solution, Correct Answer & Rationale */
            <div className="space-y-4 animate-fadeIn">
              {isMCQ ? (
                <div>
                  <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/50 mb-4">
                    <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>
                        Correct Answer: Option {currentQ.answer}
                      </span>
                    </div>
                    <div className="text-sm sm:text-base font-bold text-white">
                      {currentQ.options[currentQ.answer]}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#0d1117] border border-slate-800">
                    <div className="text-xs font-bold text-sky-400 uppercase tracking-wider font-mono mb-2">
                      {t('quizWhyExplanation')}
                    </div>
                    <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-sans">
                      {currentQ.explanation}
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="p-4 rounded-xl bg-sky-950/20 border border-sky-500/40 mb-3">
                    <div className="text-xs font-bold text-sky-300 uppercase tracking-wider font-mono mb-1">
                      {t('quizStaffCriteriaTitle')}
                    </div>
                    <p className="text-xs text-slate-400">{t('quizCriteriaInstruction')}</p>
                  </div>

                  <div className="space-y-2.5">
                    {currentQ.acceptableCriteria.map((criterion, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-[#0d1117] border border-slate-800 flex items-start gap-3 text-xs sm:text-sm text-slate-200 leading-relaxed"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{criterion}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom Card Controls & Mastery rating */}
        <div
          onClick={e => e.stopPropagation()}
          className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3"
        >
          <button
            onClick={onToggleCompleted}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              isCompleted
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{isCompleted ? t('quizMarkIncomplete') : t('flashcardMarkKnow')}</span>
          </button>

          <span className="text-xs font-mono text-slate-500 hidden sm:inline">
            [Space] to Flip • [←/→] Navigate
          </span>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="w-full flex items-center justify-between mt-6 px-2">
        <button
          onClick={handlePrev}
          disabled={!hasPrev}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            hasPrev
              ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              : 'bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed opacity-50'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>{t('quizPrev')}</span>
        </button>

        <button
          onClick={handleNext}
          disabled={!hasNext}
          className={`flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold transition-all ${
            hasNext
              ? 'bg-sky-600 hover:bg-sky-500 text-white shadow-lg shadow-sky-600/20'
              : 'bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed opacity-50'
          }`}
        >
          <span>{t('quizNext')}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
