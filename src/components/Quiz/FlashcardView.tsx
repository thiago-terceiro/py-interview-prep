import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { QuizQuestion, UserQuizProgress } from '../../types/quiz';
import { useLanguage } from '../../context/LanguageContext';
import {
  RotateCcw,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Eye,
  EyeOff,
  Shuffle,
  Brain,
  Award,
  Sparkles,
  Check,
  X,
} from 'lucide-react';

interface FlashcardViewProps {
  questions: QuizQuestion[];
  progress: UserQuizProgress;
  onRateCard: (questionId: number, rating: 'mastered' | 'review') => void;
  onToggleBookmark: (questionId: number) => void;
}

type DeckFilter = 'all' | 'review' | 'unmastered';

export const FlashcardView: React.FC<FlashcardViewProps> = ({
  questions,
  progress,
  onRateCard,
  onToggleBookmark,
}) => {
  const { t } = useLanguage();
  const [deckFilter, setDeckFilter] = useState<DeckFilter>('all');
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [showOptionsHint, setShowOptionsHint] = useState<boolean>(false);
  const [activeDeckIndex, setActiveDeckIndex] = useState<number>(0);
  const [shuffledIndices, setShuffledIndices] = useState<number[] | null>(null);

  // Filter deck based on selection
  const filteredIndices = useMemo(() => {
    const list: number[] = [];
    questions.forEach((q, idx) => {
      const isBookmarked = progress.bookmarkedIds.includes(q.id);
      const isMastered = progress.completedIds.includes(q.id);

      if (deckFilter === 'review') {
        if (isBookmarked) list.push(idx);
      } else if (deckFilter === 'unmastered') {
        if (!isMastered) list.push(idx);
      } else {
        list.push(idx);
      }
    });
    return list;
  }, [questions, progress, deckFilter]);

  // Actual sequence of question indices being studied
  const activeDeck = useMemo(() => {
    if (shuffledIndices && shuffledIndices.length === filteredIndices.length) {
      return shuffledIndices;
    }
    return filteredIndices;
  }, [filteredIndices, shuffledIndices]);

  // Clamp current index when deck changes
  useEffect(() => {
    setActiveDeckIndex(0);
    setIsFlipped(false);
    setShowOptionsHint(false);
  }, [deckFilter]);

  const currentQIndex = activeDeck[activeDeckIndex];
  const currentQ: QuizQuestion | undefined =
    currentQIndex !== undefined ? questions[currentQIndex] : undefined;

  const isBookmarked = currentQ ? progress.bookmarkedIds.includes(currentQ.id) : false;
  const isMastered = currentQ ? progress.completedIds.includes(currentQ.id) : false;

  const hasPrev = activeDeckIndex > 0;
  const hasNext = activeDeckIndex < activeDeck.length - 1;

  const handleFlip = useCallback(() => {
    setIsFlipped(prev => !prev);
  }, []);

  const handlePrev = useCallback(() => {
    if (hasPrev) {
      setIsFlipped(false);
      setShowOptionsHint(false);
      setActiveDeckIndex(prev => prev - 1);
    }
  }, [hasPrev]);

  const handleNext = useCallback(() => {
    if (hasNext) {
      setIsFlipped(false);
      setShowOptionsHint(false);
      setActiveDeckIndex(prev => prev + 1);
    }
  }, [hasNext]);

  const handleShuffle = () => {
    const arr = [...filteredIndices];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setShuffledIndices(arr);
    setActiveDeckIndex(0);
    setIsFlipped(false);
    setShowOptionsHint(false);
  };

  const handleRate = useCallback(
    (rating: 'mastered' | 'review') => {
      if (!currentQ) return;
      onRateCard(currentQ.id, rating);
      // Auto-advance if not at end
      if (hasNext) {
        setIsFlipped(false);
        setShowOptionsHint(false);
        setActiveDeckIndex(prev => prev + 1);
      }
    },
    [currentQ, onRateCard, hasNext]
  );

  // Keyboard navigation
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
      } else if (e.key === '1' && isFlipped) {
        e.preventDefault();
        handleRate('review');
      } else if (e.key === '2' && isFlipped) {
        e.preventDefault();
        handleRate('mastered');
      }
    },
    [handleFlip, handlePrev, handleNext, handleRate, isFlipped]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const isMCQ = currentQ?.type === 'multiple-choice';

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Top Deck Toolbar: Filter Pills + Shuffle */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#161b22] border border-slate-800 p-3 rounded-2xl shadow-lg">
        {/* Deck Filters */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          <button
            onClick={() => setDeckFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              deckFilter === 'all'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'bg-[#0d1117] text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {t('flashcardDeckAll')} ({questions.length})
          </button>

          <button
            onClick={() => setDeckFilter('review')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              deckFilter === 'review'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-[#0d1117] text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>{t('flashcardDeckReview')}</span>
            <span className="text-[11px] opacity-80">({progress.bookmarkedIds.length})</span>
          </button>

          <button
            onClick={() => setDeckFilter('unmastered')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              deckFilter === 'unmastered'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-[#0d1117] text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {t('flashcardDeckUnmastered')} (
            {questions.length - progress.completedIds.length})
          </button>
        </div>

        {/* Shuffle Button */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            onClick={handleShuffle}
            disabled={filteredIndices.length <= 1}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-[#0d1117] text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 transition disabled:opacity-50"
            title={t('flashcardShuffle')}
          >
            <Shuffle className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">{t('flashcardShuffle')}</span>
          </button>
        </div>
      </div>

      {/* Empty Deck State */}
      {activeDeck.length === 0 ? (
        <div className="bg-[#161b22] border border-slate-800 rounded-2xl p-12 text-center text-slate-300 space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
          <p className="text-base font-semibold">{t('flashcardEmptyDeck')}</p>
          <button
            onClick={() => setDeckFilter('all')}
            className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition shadow-lg shadow-sky-600/20"
          >
            {t('flashcardResetDeck')}
          </button>
        </div>
      ) : !currentQ ? null : (
        <>
          {/* Deck Status Bar */}
          <div className="flex items-center justify-between px-2 text-xs font-mono text-slate-400">
            <span className="font-bold text-sky-400">
              Card {activeDeckIndex + 1} of {activeDeck.length}
            </span>
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-slate-500">
                {currentQ.section}
              </span>
              <button
                onClick={() => onToggleBookmark(currentQ.id)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs transition ${
                  isBookmarked
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-[#161b22] text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
                title={isBookmarked ? t('quizBookmarked') : t('quizBookmark')}
              >
                <Bookmark className={`w-3 h-3 ${isBookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
                <span>{isBookmarked ? t('quizBookmarked') : t('quizBookmark')}</span>
              </button>
            </div>
          </div>

          {/* Main 3D Active-Recall Flashcard */}
          <article
            onClick={handleFlip}
            role="button"
            tabIndex={0}
            aria-label={`${t('flashcardFlipPrompt')}. Current: ${
              isFlipped ? t('flashcardBack') : t('flashcardFront')
            }`}
            onKeyDown={e => {
              if (e.key === 'Enter') handleFlip();
            }}
            className="w-full min-h-[460px] bg-[#161b22] hover:border-sky-500/40 border border-slate-800 rounded-2xl p-6 sm:p-9 shadow-2xl cursor-pointer select-none flex flex-col justify-between transition-all duration-150 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
          >
            {/* Top Indicator */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-lg border ${
                    isFlipped
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                  }`}
                >
                  {isFlipped ? t('flashcardBack') : t('flashcardFront')}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  #{currentQ.id}
                </span>
                {isMastered && (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                    <Check className="w-3 h-3 stroke-[3]" />
                    <span>Mastered</span>
                  </span>
                )}
              </div>

              <span className="text-xs text-slate-500 font-mono flex items-center gap-1 group-hover:text-sky-400 transition-colors">
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t('flashcardFlipPrompt')}</span>
              </span>
            </div>

            {/* Card Body */}
            <div className="my-auto py-6">
              {!isFlipped ? (
                /* ================= FRONT: ACTIVE RECALL (NO MULTIPLE CHOICE GIVEN) ================= */
                <div className="space-y-6">
                  {/* Active Recall Coaching Pill */}
                  <div className="p-3.5 rounded-xl bg-indigo-950/20 border border-indigo-500/30 flex items-start gap-3">
                    <Brain className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-indigo-300 uppercase tracking-wider font-mono">
                        Active Recall Mode
                      </div>
                      <p className="text-xs text-slate-300 leading-snug mt-0.5">
                        {t('flashcardActiveRecallPrompt')}
                      </p>
                    </div>
                  </div>

                  {/* Question Prompt */}
                  <h2 className="text-lg sm:text-2xl font-bold text-white leading-relaxed">
                    {currentQ.question}
                  </h2>

                  {/* Optional Multiple-Choice Hint Drawer (Only if candidate is stuck) */}
                  {isMCQ && (
                    <div
                      onClick={e => e.stopPropagation()}
                      className="pt-2 border-t border-slate-800/60"
                    >
                      <button
                        onClick={() => setShowOptionsHint(prev => !prev)}
                        className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-sky-300 font-medium transition"
                      >
                        {showOptionsHint ? (
                          <>
                            <EyeOff className="w-3.5 h-3.5" />
                            <span>{t('flashcardHideOptions')}</span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-3.5 h-3.5" />
                            <span>{t('flashcardPeekOptions')}</span>
                          </>
                        )}
                      </button>

                      {showOptionsHint && (
                        <div className="grid grid-cols-1 gap-2 pt-3 animate-fadeIn">
                          {(['A', 'B', 'C', 'D'] as const).map(letter => (
                            <div
                              key={letter}
                              className="p-2.5 rounded-xl bg-[#0d1117] border border-slate-800/80 flex items-start gap-2.5 text-xs text-slate-300"
                            >
                              <span className="w-5 h-5 rounded bg-slate-800 flex items-center justify-center font-mono font-bold text-[10px] text-slate-400 shrink-0">
                                {letter}
                              </span>
                              <span className="leading-snug">
                                {currentQ.options[letter]}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {!isMCQ && (
                    <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/30 text-xs text-purple-300 flex items-center gap-2">
                      <Award className="w-4 h-4 shrink-0 text-purple-400" />
                      <span>
                        System Design Scenario: Think through latency limits, state machines,
                        failure modes, and cryptographic invariants before flipping.
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                /* ================= BACK: CORE TAKEAWAY, FORMULA & EXPLANATION ================= */
                <div className="space-y-5 animate-fadeIn">
                  {isMCQ ? (
                    <div>
                      {/* Bold Punchline / Core Takeaway */}
                      <div className="p-4 sm:p-5 rounded-xl bg-emerald-950/30 border border-emerald-500/50 mb-4 shadow-lg shadow-emerald-950/20">
                        <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider mb-1.5">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{t('flashcardCoreTakeaway')}</span>
                        </div>
                        <div className="text-base sm:text-lg font-bold text-white leading-snug">
                          <span className="text-emerald-400 font-mono mr-2">
                            [{currentQ.answer}]
                          </span>
                          {currentQ.options[currentQ.answer]}
                        </div>
                      </div>

                      {/* Technical Invariant & Rationale */}
                      <div className="p-4 sm:p-5 rounded-xl bg-[#0d1117] border border-slate-800">
                        <div className="text-xs font-bold text-sky-400 uppercase tracking-wider font-mono mb-2 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{t('quizWhyExplanation')}</span>
                        </div>
                        <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-sans">
                          {currentQ.explanation}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {/* System Design Rubric Checklist */}
                      <div className="p-4 rounded-xl bg-sky-950/20 border border-sky-500/40 mb-3">
                        <div className="text-xs font-bold text-sky-300 uppercase tracking-wider font-mono mb-1">
                          {t('quizStaffCriteriaTitle')}
                        </div>
                        <p className="text-xs text-slate-400">
                          {t('quizCriteriaInstruction')}
                        </p>
                      </div>

                      <div className="space-y-2.5">
                        {currentQ.acceptableCriteria.map((criterion, idx) => (
                          <div
                            key={idx}
                            className="p-3.5 rounded-xl bg-[#0d1117] border border-slate-800 flex items-start gap-3 text-xs sm:text-sm text-slate-200 leading-relaxed"
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

            {/* Bottom Card Controls & Spaced Repetition Buttons */}
            <div
              onClick={e => e.stopPropagation()}
              className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3"
            >
              {isFlipped ? (
                /* Self-Assessment Buttons (When back is revealed) */
                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <button
                    onClick={() => handleRate('review')}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 border border-rose-500/40 transition-all active:scale-95"
                  >
                    <X className="w-4 h-4 text-rose-400" />
                    <span>{t('flashcardRateReview')}</span>
                    <span className="hidden sm:inline font-mono opacity-60 text-[10px]">
                      [1]
                    </span>
                  </button>

                  <button
                    onClick={() => handleRate('mastered')}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/25 transition-all active:scale-95"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>{t('flashcardRateMastered')}</span>
                    <span className="hidden sm:inline font-mono opacity-80 text-[10px]">
                      [2]
                    </span>
                  </button>
                </div>
              ) : (
                <div className="text-xs text-slate-400 font-mono flex items-center gap-1">
                  <RotateCcw className="w-3.5 h-3.5 text-sky-400" />
                  <span>Tap card or press [Space] to flip</span>
                </div>
              )}

              <span className="text-xs font-mono text-slate-500 hidden md:inline ml-auto">
                {t('flashcardKeyboardHints')}
              </span>
            </div>
          </article>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between px-2 pt-2">
            <button
              onClick={handlePrev}
              disabled={!hasPrev}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                hasPrev
                  ? 'bg-[#161b22] hover:bg-slate-800 text-slate-200 border border-slate-800'
                  : 'bg-[#161b22]/50 text-slate-600 border border-slate-800/50 cursor-not-allowed opacity-50'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{t('quizPrev')}</span>
            </button>

            <span className="text-xs font-mono text-slate-500">
              {activeDeckIndex + 1} / {activeDeck.length}
            </span>

            <button
              onClick={handleNext}
              disabled={!hasNext}
              className={`flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                hasNext
                  ? 'bg-sky-600 hover:bg-sky-500 text-white shadow-lg shadow-sky-600/20'
                  : 'bg-[#161b22]/50 text-slate-600 border border-slate-800/50 cursor-not-allowed opacity-50'
              }`}
            >
              <span>{t('quizNext')}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};
