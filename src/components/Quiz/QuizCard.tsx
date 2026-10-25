import React, { useEffect, useCallback } from 'react';
import type { MultipleChoiceQuestion } from '../../types/quiz';
import { useLanguage } from '../../context/LanguageContext';
import {
  CheckCircle2,
  XCircle,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Info,
} from 'lucide-react';

interface QuizCardProps {
  question: MultipleChoiceQuestion;
  selectedOption?: 'A' | 'B' | 'C' | 'D';
  isBookmarked: boolean;
  onSelectOption: (option: 'A' | 'B' | 'C' | 'D') => void;
  onToggleBookmark: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev: boolean;
  hasNext: boolean;
  currentIndex: number;
  totalCount: number;
}

export const QuizCard: React.FC<QuizCardProps> = ({
  question,
  selectedOption,
  isBookmarked,
  onSelectOption,
  onToggleBookmark,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
  totalCount,
}) => {
  const { t } = useLanguage();
  const isAnswered = selectedOption !== undefined;
  const isCorrect = selectedOption === question.answer;

  // Keyboard shortcut listener
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input or textarea
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      const key = e.key.toUpperCase();
      if (key === 'A' || key === '1') {
        e.preventDefault();
        onSelectOption('A');
      } else if (key === 'B' || key === '2') {
        e.preventDefault();
        onSelectOption('B');
      } else if (key === 'C' || key === '3') {
        e.preventDefault();
        onSelectOption('C');
      } else if (key === 'D' || key === '4') {
        e.preventDefault();
        onSelectOption('D');
      } else if (e.key === 'ArrowLeft' && hasPrev && onPrev) {
        e.preventDefault();
        onPrev();
      } else if (e.key === 'ArrowRight' && hasNext && onNext) {
        e.preventDefault();
        onNext();
      }
    },
    [onSelectOption, onPrev, onNext, hasPrev, hasNext]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const optionKeys: Array<'A' | 'B' | 'C' | 'D'> = ['A', 'B', 'C', 'D'];

  return (
    <article
      className="bg-[#161b22] border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl shadow-black/40 flex flex-col justify-between transition-all"
      aria-labelledby={`quiz-q-${question.id}-title`}
    >
      {/* Top Header: Badge, Progress Pill, Bookmark */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-800">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20 text-xs font-mono font-bold">
              #{question.id} {t('quizOf')} {totalCount}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-medium max-w-xs sm:max-w-md truncate">
              {question.section}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onToggleBookmark}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                isBookmarked
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700/60'
              }`}
              title={isBookmarked ? t('quizBookmarked') : t('quizBookmark')}
              aria-label={isBookmarked ? t('quizBookmarked') : t('quizBookmark')}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
              <span className="hidden sm:inline">
                {isBookmarked ? t('quizBookmarked') : t('quizBookmark')}
              </span>
            </button>
          </div>
        </div>

        {/* Question Statement */}
        <h2
          id={`quiz-q-${question.id}-title`}
          className="text-base sm:text-lg lg:text-xl font-bold text-white leading-relaxed mb-6"
        >
          {question.question}
        </h2>

        {/* Option Buttons */}
        <div className="space-y-3 mb-6" role="radiogroup" aria-label={t('quizSelectOptionPrompt')}>
          {optionKeys.map((key) => {
            const optionText = question.options[key];
            const isThisSelected = selectedOption === key;
            const isThisCorrect = question.answer === key;

            let buttonStyle =
              'bg-[#0d1117] border-slate-800 hover:border-slate-700 text-slate-200 hover:bg-[#111722]';

            if (isAnswered) {
              if (isThisCorrect) {
                // Correct answer always gets bright green highlight
                buttonStyle =
                  'bg-emerald-950/40 border-emerald-500 text-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500';
              } else if (isThisSelected && !isThisCorrect) {
                // Wrong picked answer gets red highlight
                buttonStyle =
                  'bg-rose-950/40 border-rose-500 text-rose-100 shadow-[0_0_15px_rgba(244,63,94,0.15)] ring-1 ring-rose-500';
              } else {
                buttonStyle = 'bg-[#0d1117]/60 border-slate-800/60 text-slate-400 opacity-60';
              }
            }

            return (
              <button
                key={key}
                onClick={() => onSelectOption(key)}
                className={`w-full text-left p-3.5 sm:p-4 rounded-xl border flex items-start gap-3.5 transition-all text-sm sm:text-base leading-snug group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${buttonStyle}`}
                role="radio"
                aria-checked={isThisSelected}
                aria-label={`${key}: ${optionText}`}
              >
                {/* Key indicator pill */}
                <span
                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 transition-colors mt-0.5 ${
                    isAnswered && isThisCorrect
                      ? 'bg-emerald-500 text-emerald-950'
                      : isAnswered && isThisSelected && !isThisCorrect
                      ? 'bg-rose-500 text-rose-950'
                      : 'bg-slate-800 text-slate-300 group-hover:bg-slate-700'
                  }`}
                >
                  {isAnswered && isThisCorrect ? (
                    <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                  ) : isAnswered && isThisSelected && !isThisCorrect ? (
                    <XCircle className="w-4 h-4 stroke-[2.5]" />
                  ) : (
                    key
                  )}
                </span>

                <div className="flex-1">
                  <span className="font-medium">{optionText}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Why / Explanation Section */}
        {isAnswered && (
          <div
            className={`p-4 sm:p-5 rounded-xl border mb-6 transition-all animate-fadeIn ${
              isCorrect
                ? 'bg-emerald-950/20 border-emerald-500/30'
                : 'bg-indigo-950/20 border-indigo-500/30'
            }`}
            role="region"
            aria-live="polite"
          >
            <div className="flex items-center gap-2 mb-2">
              {isCorrect ? (
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t('quizStatusCorrect')}</span>
                  <span className="text-slate-400">•</span>
                  <span>{t('quizWhyExplanation')}</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
                  <Info className="w-4 h-4" />
                  <span>
                    {t('quizStatusIncorrect')} (Correct: {question.answer})
                  </span>
                  <span className="text-slate-400">•</span>
                  <span>{t('quizWhyExplanation')}</span>
                </div>
              )}
            </div>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-sans">
              {question.explanation}
            </p>
          </div>
        )}
      </div>

      {/* Footer Navigation & Shortcut hint */}
      <footer className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs text-slate-500 font-mono hidden md:flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-sky-400" />
          <span>{t('quizKeyboardShortcuts')}</span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end ml-auto">
          <button
            onClick={onPrev}
            disabled={!hasPrev}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              hasPrev
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                : 'bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed opacity-50'
            }`}
            aria-label={t('quizPrev')}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{t('quizPrev')}</span>
          </button>

          <button
            onClick={onNext}
            disabled={!hasNext}
            className={`flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              hasNext
                ? 'bg-sky-600 hover:bg-sky-500 text-white shadow-lg shadow-sky-600/20'
                : 'bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed opacity-50'
            }`}
            aria-label={t('quizNext')}
          >
            <span>{t('quizNext')}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </footer>
    </article>
  );
};
