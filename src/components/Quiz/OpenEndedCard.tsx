import React, { useState, useEffect, useCallback } from 'react';
import type { OpenEndedQuestion } from '../../types/quiz';
import { useLanguage } from '../../context/LanguageContext';
import {
  CheckCircle2,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Edit3,
  ListChecks,
  Award,
  Sparkles,
} from 'lucide-react';

interface OpenEndedCardProps {
  question: OpenEndedQuestion;
  userNotes: string;
  checkedCriteria: number[];
  isCompleted: boolean;
  isBookmarked: boolean;
  onNotesChange: (notes: string) => void;
  onToggleCriterion: (criterionIndex: number) => void;
  onToggleCompleted: () => void;
  onToggleBookmark: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev: boolean;
  hasNext: boolean;
  currentIndex: number;
  totalCount: number;
}

export const OpenEndedCard: React.FC<OpenEndedCardProps> = ({
  question,
  userNotes,
  checkedCriteria,
  isCompleted,
  isBookmarked,
  onNotesChange,
  onToggleCriterion,
  onToggleCompleted,
  onToggleBookmark,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
  totalCount,
}) => {
  const { t } = useLanguage();
  const [criteriaRevealed, setCriteriaRevealed] = useState<boolean>(false);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      if (e.key === 'ArrowLeft' && hasPrev && onPrev) {
        e.preventDefault();
        onPrev();
      } else if (e.key === 'ArrowRight' && hasNext && onNext) {
        e.preventDefault();
        onNext();
      } else if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        setCriteriaRevealed(prev => !prev);
      }
    },
    [hasPrev, hasNext, onPrev, onNext]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const criteriaCount = question.acceptableCriteria.length;
  const metCount = checkedCriteria.length;
  const progressPercent = criteriaCount > 0 ? Math.round((metCount / criteriaCount) * 100) : 0;

  return (
    <article
      className="bg-[#161b22] border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl shadow-black/40 flex flex-col justify-between transition-all"
      aria-labelledby={`open-q-${question.id}-title`}
    >
      <div>
        {/* Header: Question Number, Section Badge, Completed Badge & Bookmark */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-800">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-mono font-bold">
              #{question.id} {t('quizOf')} {totalCount}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-medium">
              {t('quizTypeOpenEnded')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isCompleted && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-bold font-mono">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{t('quizMarkMastered')}</span>
              </span>
            )}

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

        {/* System Design Prompt */}
        <div className="mb-6 p-4 sm:p-5 rounded-xl bg-purple-950/15 border border-purple-500/30">
          <div className="flex items-center gap-2 text-purple-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
            <Award className="w-4 h-4" />
            <span>Staff-Level Architecture Scenario</span>
          </div>
          <h2
            id={`open-q-${question.id}-title`}
            className="text-base sm:text-lg lg:text-xl font-bold text-white leading-relaxed"
          >
            {question.question}
          </h2>
        </div>

        {/* User Notes Area (Write your thoughts first!) */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor={`notes-${question.id}`}
              className="text-xs sm:text-sm font-semibold text-slate-300 flex items-center gap-1.5"
            >
              <Edit3 className="w-4 h-4 text-sky-400" />
              <span>{t('quizYourNotes')}</span>
            </label>
            <span className="text-xs font-mono text-slate-500">
              {userNotes.length} chars (auto-saved)
            </span>
          </div>
          <textarea
            id={`notes-${question.id}`}
            value={userNotes}
            onChange={e => onNotesChange(e.target.value)}
            placeholder={t('quizYourNotesPlaceholder')}
            rows={4}
            className="w-full bg-[#0d1117] border border-slate-800 rounded-xl p-3.5 sm:p-4 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50 font-mono transition-all resize-y"
          />
        </div>

        {/* Reveal Criteria Button */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <button
            onClick={() => setCriteriaRevealed(prev => !prev)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition-all ${
              criteriaRevealed
                ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                : 'bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white border-transparent shadow-lg shadow-sky-600/20'
            }`}
          >
            {criteriaRevealed ? (
              <>
                <EyeOff className="w-4 h-4" />
                <span>{t('quizHideCriteria')}</span>
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                <span>{t('quizRevealCriteria')}</span>
              </>
            )}
          </button>

          {/* Criteria Checklist Progress */}
          {criteriaRevealed && (
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-slate-400">{t('quizCriteriaScore')}:</span>
              <span className="font-bold text-sky-400">
                {metCount} / {criteriaCount} ({progressPercent}%)
              </span>
            </div>
          )}
        </div>

        {/* Revealed Criteria Section */}
        {criteriaRevealed && (
          <section
            className="p-5 rounded-xl bg-[#0d1117] border border-sky-500/30 mb-6 space-y-4 animate-fadeIn"
            aria-labelledby={`criteria-title-${question.id}`}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ListChecks className="w-4 h-4 text-sky-400" />
                <h3
                  id={`criteria-title-${question.id}`}
                  className="text-xs sm:text-sm font-bold text-sky-300 uppercase tracking-wider font-mono m-0"
                >
                  {t('quizStaffCriteriaTitle')}
                </h3>
              </div>
              <span className="text-xs text-slate-400">{t('quizCriteriaInstruction')}</span>
            </div>

            <div className="space-y-3">
              {question.acceptableCriteria.map((criterion, idx) => {
                const isChecked = checkedCriteria.includes(idx);
                return (
                  <div
                    key={idx}
                    onClick={() => onToggleCriterion(idx)}
                    className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all select-none ${
                      isChecked
                        ? 'bg-emerald-950/20 border-emerald-500/50 text-slate-100'
                        : 'bg-[#161b22] border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => onToggleCriterion(idx)}
                      id={`crit-${question.id}-${idx}`}
                      className="mt-0.5 w-4 h-4 rounded text-sky-500 focus:ring-sky-400 border-slate-700 bg-slate-900 cursor-pointer"
                      aria-label={`Criterion ${idx + 1}`}
                    />
                    <label
                      htmlFor={`crit-${question.id}-${idx}`}
                      className="text-xs sm:text-sm leading-relaxed cursor-pointer flex-1"
                    >
                      {criterion}
                    </label>
                  </div>
                );
              })}
            </div>

            {/* Mastered completion toggle */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={onToggleCompleted}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  isCompleted
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isCompleted ? t('quizMarkIncomplete') : t('quizMarkMastered')}</span>
              </button>
            </div>
          </section>
        )}
      </div>

      {/* Footer Navigation */}
      <footer className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs text-slate-500 font-mono hidden md:flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-sky-400" />
          <span>{t('quizOpenEndedKeyboardShortcuts')}</span>
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
