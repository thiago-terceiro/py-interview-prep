import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import type { QuizQuestion, UserQuizProgress } from '../../types/quiz';
import { useLanguage } from '../../context/LanguageContext';
import {
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
} from 'lucide-react';

interface FlashcardViewProps {
  questions: QuizQuestion[];
  progress: UserQuizProgress;
  onRateCard?: (questionId: number, rating: 'mastered' | 'review') => void;
  onToggleBookmark: (questionId: number) => void;
}

type DeckFilter = 'all' | 'review';

export const FlashcardView: React.FC<FlashcardViewProps> = ({
  questions,
  progress,
  onToggleBookmark,
}) => {
  const { t } = useLanguage();
  const [deckFilter, setDeckFilter] = useState<DeckFilter>('all');
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [showOptionsHint, setShowOptionsHint] = useState<boolean>(false);
  const [activeDeckIndex, setActiveDeckIndex] = useState<number>(0);
  const [shuffledIndices, setShuffledIndices] = useState<number[] | null>(null);

  // Swipe & Click-and-drag gesture state
  const [dragOffset, setDragOffset] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [animatingCard, setAnimatingCard] = useState<{
    dir: 'left' | 'right';
    phase: 'exit' | 'enter-prep' | 'enter-active';
  } | null>(null);
  const dragStartXRef = useRef<number>(0);
  const dragStartYRef = useRef<number>(0);
  const dragStartTimeRef = useRef<number>(0);
  const isPointerDownRef = useRef<boolean>(false);
  const hasDraggedRef = useRef<boolean>(false);
  const cardRef = useRef<HTMLElement>(null);

  // Filter deck based on selection: All vs Marked for Review
  const filteredIndices = useMemo(() => {
    const list: number[] = [];
    questions.forEach((q, idx) => {
      const isMarked = progress.bookmarkedIds.includes(q.id);
      if (deckFilter === 'review') {
        if (isMarked) list.push(idx);
      } else {
        list.push(idx);
      }
    });
    return list;
  }, [questions, progress.bookmarkedIds, deckFilter]);

  // Actual sequence of question indices being studied
  const activeDeck = useMemo(() => {
    if (shuffledIndices && shuffledIndices.length === filteredIndices.length) {
      return shuffledIndices;
    }
    return filteredIndices;
  }, [filteredIndices, shuffledIndices]);

  // Reset to first card when deck changes
  const [prevDeckFilter, setPrevDeckFilter] = useState(deckFilter);
  if (deckFilter !== prevDeckFilter) {
    setPrevDeckFilter(deckFilter);
    setActiveDeckIndex(0);
    setIsFlipped(false);
    setShowOptionsHint(false);
    setDragOffset(0);
  }

  const currentQIndex = activeDeck[activeDeckIndex];
  const currentQ: QuizQuestion | undefined =
    currentQIndex !== undefined ? questions[currentQIndex] : undefined;

  const isMarkedForReview = currentQ ? progress.bookmarkedIds.includes(currentQ.id) : false;

  const hasPrev = activeDeckIndex > 0;
  const hasNext = activeDeckIndex < activeDeck.length - 1;

  const handleFlip = useCallback(() => {
    setIsFlipped(prev => !prev);
  }, []);

  const handlePrev = useCallback(() => {
    if (hasPrev && !animatingCard) {
      setDragOffset(0);
      setAnimatingCard({ dir: 'right', phase: 'exit' });
      setTimeout(() => {
        setIsFlipped(false);
        setShowOptionsHint(false);
        setActiveDeckIndex(prev => prev - 1);
        setAnimatingCard({ dir: 'right', phase: 'enter-prep' });
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setAnimatingCard({ dir: 'right', phase: 'enter-active' });
            setTimeout(() => {
              setAnimatingCard(null);
            }, 300);
          });
        });
      }, 250);
    }
  }, [hasPrev, animatingCard]);

  const handleNext = useCallback(() => {
    if (hasNext && !animatingCard) {
      setDragOffset(0);
      setAnimatingCard({ dir: 'left', phase: 'exit' });
      setTimeout(() => {
        setIsFlipped(false);
        setShowOptionsHint(false);
        setActiveDeckIndex(prev => prev + 1);
        setAnimatingCard({ dir: 'left', phase: 'enter-prep' });
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setAnimatingCard({ dir: 'left', phase: 'enter-active' });
            setTimeout(() => {
              setAnimatingCard(null);
            }, 300);
          });
        });
      }, 250);
    }
  }, [hasNext, animatingCard]);

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
    setDragOffset(0);
  };

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
      } else if (e.key === 'r' || e.key === 'R') {
        if (currentQ) {
          e.preventDefault();
          onToggleBookmark(currentQ.id);
        }
      }
    },
    [handleFlip, handlePrev, handleNext, currentQ, onToggleBookmark]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Pointer / Touch / Mouse Drag & Swipe Handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLElement>) => {
    // Only primary click/touch
    if (e.button !== 0) return;
    // Don't drag if clicking buttons, textareas, inputs, or interactive controls
    if ((e.target as HTMLElement).closest('button, input, textarea, a')) {
      return;
    }

    dragStartXRef.current = e.clientX;
    dragStartYRef.current = e.clientY;
    dragStartTimeRef.current = Date.now();
    isPointerDownRef.current = true;
    hasDraggedRef.current = false;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (!isPointerDownRef.current) return;
    const deltaX = e.clientX - dragStartXRef.current;
    const deltaY = e.clientY - dragStartYRef.current;

    if (!hasDraggedRef.current) {
      // Determine if horizontal intent is clear
      if (Math.abs(deltaX) > 8 || Math.abs(deltaY) > 8) {
        if (Math.abs(deltaY) > Math.abs(deltaX) * 1.3) {
          // Primarily vertical scroll: abort horizontal drag
          isPointerDownRef.current = false;
          setIsDragging(false);
          setDragOffset(0);
          return;
        }
        hasDraggedRef.current = true;
        setIsDragging(true);

        if (cardRef.current && 'setPointerCapture' in cardRef.current) {
          try {
            cardRef.current.setPointerCapture(e.pointerId);
          } catch {
            // Ignore if pointer capture fails
          }
        }
      }
    }

    if (hasDraggedRef.current) {
      // Resistance dampening if swiping past bounds
      if ((deltaX > 0 && !hasPrev) || (deltaX < 0 && !hasNext)) {
        setDragOffset(deltaX * 0.28);
      } else {
        setDragOffset(deltaX);
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLElement>) => {
    if (!isPointerDownRef.current && !hasDraggedRef.current) return;
    isPointerDownRef.current = false;
    setIsDragging(false);

    if (cardRef.current && 'releasePointerCapture' in cardRef.current) {
      try {
        cardRef.current.releasePointerCapture(e.pointerId);
      } catch {
        // Ignore
      }
    }

    const deltaX = e.clientX - dragStartXRef.current;
    const deltaTime = Date.now() - dragStartTimeRef.current;
    const velocity = Math.abs(deltaX) / Math.max(deltaTime, 1);

    const SWIPE_DISTANCE_THRESHOLD = 60; // px
    const SWIPE_VELOCITY_THRESHOLD = 0.35; // px/ms

    if (
      hasDraggedRef.current &&
      (Math.abs(deltaX) > SWIPE_DISTANCE_THRESHOLD || velocity > SWIPE_VELOCITY_THRESHOLD)
    ) {
      if (deltaX < 0 && hasNext) {
        // Swiped / Dragged Left -> Next Card
        handleNext();
        return;
      } else if (deltaX > 0 && hasPrev) {
        // Swiped / Dragged Right -> Previous Card
        handlePrev();
        return;
      }
    }

    setDragOffset(0);
    // Give a brief window before resetting hasDraggedRef so onClick ignores drag release
    setTimeout(() => {
      hasDraggedRef.current = false;
    }, 70);
  };

  const handleCardClick = () => {
    if (hasDraggedRef.current) return;
    handleFlip();
  };

  const isMCQ = currentQ?.type === 'multiple-choice';

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Top Deck Toolbar: Filter Pills + Shuffle */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#161b22] border border-slate-800 p-3 rounded-2xl shadow-lg">
        {/* Deck Filters */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          <button
            onClick={() => setDeckFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              deckFilter === 'all'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'bg-[#0d1117] text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {t('flashcardDeckAll')} ({questions.length})
          </button>

          <button
            onClick={() => setDeckFilter('review')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              deckFilter === 'review'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'bg-[#0d1117] text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>{t('flashcardDeckReview')}</span>
            <span className="text-[11px] opacity-80">({progress.bookmarkedIds.length})</span>
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
          <CheckCircle2 className="w-12 h-12 text-sky-400 mx-auto" />
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
          {/* Deck Counter & Fixed Flip/Swipe Instruction OUTSIDE and ABOVE the card */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-2 text-xs font-mono text-slate-400">
            <span className="font-bold text-sky-400">
              Card {activeDeckIndex + 1} of {activeDeck.length}
            </span>

            {/* Fixed Flip Prompt ABOVE the card */}
            <div className="flex items-center gap-1.5 text-slate-400 select-none">
              <span>{t('flashcardFlipPrompt')}</span>
            </div>

            <span className="hidden sm:inline text-slate-500 truncate max-w-xs">
              {currentQ.section}
            </span>
          </div>

          {/* Swipeable & Draggable Flashcard Article */}
          <div className="relative overflow-visible">
            <article
              ref={cardRef}
              onClick={handleCardClick}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              role="button"
              tabIndex={0}
              aria-label={`${t('flashcardFlipPrompt')}. Current: ${
                isFlipped ? t('flashcardBack') : t('flashcardFront')
              }`}
              onKeyDown={e => {
                if (e.key === 'Enter') handleFlip();
              }}
              style={{
                transform: animatingCard
                  ? animatingCard.phase === 'exit'
                    ? `translateX(${animatingCard.dir === 'left' ? '-120%' : '120%'})`
                    : animatingCard.phase === 'enter-prep'
                    ? `translateX(${animatingCard.dir === 'left' ? '120%' : '-120%'})`
                    : 'translateX(0)'
                  : `translateX(${dragOffset}px)`,
                opacity: animatingCard
                  ? animatingCard.phase === 'exit' || animatingCard.phase === 'enter-prep'
                    ? 0
                    : 1
                  : Math.max(0.1, 1 - Math.abs(dragOffset) / 600),
                transition: isDragging || (animatingCard && animatingCard.phase === 'enter-prep')
                  ? 'none'
                  : 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease',
                touchAction: 'pan-y',
              }}
              className={`w-full min-h-[440px] sm:min-h-[460px] bg-[#161b22] hover:border-sky-500/40 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl select-none flex flex-col justify-between transition-colors duration-150 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
                isDragging ? 'cursor-grabbing' : 'cursor-grab'
              }`}
            >
              {/* Top Indicator Inside Card */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
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
                  <span className="text-xs font-mono text-slate-300 font-bold">
                    #{currentQ.id}
                  </span>
                </div>

                <span className="text-xs text-slate-400 font-medium truncate max-w-[200px] sm:max-w-xs">
                  {currentQ.section}
                </span>
              </div>

              {/* Card Body */}
              <div className="my-auto py-5">
                {!isFlipped ? (
                  /* ================= FRONT: ACTIVE RECALL PROMPT ================= */
                  <div className="space-y-5">
                    {/* Active Recall Coaching Pill */}
                    <div className="p-3.5 rounded-xl bg-indigo-950/20 border border-indigo-500/30 flex items-start gap-3">
                      <Brain className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-indigo-300 uppercase tracking-wider font-mono">
                          Active Recall
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

                    {/* Optional Multiple-Choice Hint Drawer */}
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
                  <div className="space-y-4 animate-fadeIn">
                    {isMCQ ? (
                      <div>
                        {/* Bold Punchline / Core Takeaway */}
                        <div className="p-4 sm:p-5 rounded-xl bg-emerald-950/30 border border-emerald-500/50 mb-3 shadow-lg shadow-emerald-950/20">
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
                        <div className="p-4 rounded-xl bg-[#0d1117] border border-slate-800">
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

              {/* Bottom Card Footer: Only the ONE BLUE "Mark for Review" button */}
              <div
                onClick={e => e.stopPropagation()}
                className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3"
              >
                {/* Single Blue Button to mark for review */}
                <button
                  onClick={() => onToggleBookmark(currentQ.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md active:scale-95 ${
                    isMarkedForReview
                      ? 'bg-sky-600 text-white shadow-sky-600/30 ring-2 ring-sky-400/50'
                      : 'bg-sky-950/40 hover:bg-sky-900/60 text-sky-300 border border-sky-500/40 hover:border-sky-400'
                  }`}
                  title={isMarkedForReview ? t('flashcardMarkedReview') : t('flashcardMarkReview')}
                  aria-label={isMarkedForReview ? t('flashcardMarkedReview') : t('flashcardMarkReview')}
                >
                  {isMarkedForReview ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>{t('flashcardMarkedReview')}</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-4 h-4" />
                      <span>{t('flashcardMarkReview')}</span>
                    </>
                  )}
                </button>

                <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">
                  [Space] Flip • Swipe or drag to navigate • [R] Review
                </span>
              </div>
            </article>
          </div>

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

          {/* Keyboard Shortcuts Hint */}
          <div className="text-xs text-slate-500 font-mono hidden md:flex items-center justify-center gap-1.5 pt-3">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>{t('flashcardKeyboardShortcuts')}</span>
          </div>
        </>
      )}
    </div>
  );
};
