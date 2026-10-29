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
  Award,
  Sparkles,
  Check,
  Search,
} from 'lucide-react';

export type FlashcardStatusFilter = 'all' | 'review' | 'mastered' | 'unstudied';

interface FlashcardViewProps {
  questions: QuizQuestion[];
  progress: UserQuizProgress;
  initialQuestionIndex?: number;
  onRateCard?: (questionId: number, rating: 'mastered' | 'review') => void;
  onToggleBookmark: (questionId: number) => void;
}

export const FlashcardView: React.FC<FlashcardViewProps> = ({
  questions,
  progress,
  initialQuestionIndex,
  onRateCard,
  onToggleBookmark,
}) => {
  const { t } = useLanguage();
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<FlashcardStatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
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
  const isIntentLockedRef = useRef<'horizontal' | 'vertical' | null>(null);
  const cardRef = useRef<HTMLElement>(null);

  // Section friendly short names for dropdown options
  const sectionShortLabels: Record<string, string> = useMemo(
    () => ({
      'Classical ML, Feature Engineering & Fraud/Anomaly Detection': 'Classical ML & Fraud',
      'Ultra-Low-Latency Inference, ONNX & Real-Time Data Stores': 'Low-Latency & ONNX',
      'MLOps, Drift Detection, CI/CD & Observability': 'MLOps & CI/CD',
      'Agentic Workflows, LangGraph, State Machines & LLMs': 'Agentic Workflows & LLMs',
      'Distributed Systems, Security, RBAC & Cryptographic Auditing': 'Distributed & Security',
      'High-Performance React/Next.js Streaming UI & Accessibility': 'Streaming UI & A11y',
      'Open-Ended System Design & Scenario': 'System Design Scenarios',
    }),
    []
  );

  const sections = useMemo(() => {
    const list = [
      { id: 'all', label: 'All Topics', shortLabel: 'All Topics', count: questions.length },
    ];
    const unique = Array.from(new Set(questions.map(q => q.section)));
    for (const sec of unique) {
      list.push({
        id: sec,
        label: sec,
        shortLabel: sectionShortLabels[sec] || sec,
        count: questions.filter(q => q.section === sec).length,
      });
    }
    return list;
  }, [questions, sectionShortLabels]);

  // Live status counts given current topic
  const filteredCounts = useMemo(() => {
    let baseList = questions;
    if (selectedSection !== 'all') {
      baseList = baseList.filter(q => q.section === selectedSection);
    }
    const all = baseList.length;
    const review = baseList.filter(q => progress.bookmarkedIds.includes(q.id)).length;
    const mastered = baseList.filter(q => progress.completedIds.includes(q.id)).length;
    const unstudied = baseList.filter(q => !progress.completedIds.includes(q.id)).length;
    return { all, review, mastered, unstudied };
  }, [questions, selectedSection, progress.bookmarkedIds, progress.completedIds]);

  // Filter deck based on topic, status, and search query
  const filteredIndices = useMemo(() => {
    const list: number[] = [];
    const query = searchQuery.trim().toLowerCase();

    questions.forEach((q, idx) => {
      // 1. Section filter
      if (selectedSection !== 'all' && q.section !== selectedSection) {
        return;
      }

      // 2. Status filter
      const isMarked = progress.bookmarkedIds.includes(q.id);
      const isCompleted = progress.completedIds.includes(q.id);

      if (statusFilter === 'review' && !isMarked) return;
      if (statusFilter === 'mastered' && !isCompleted) return;
      if (statusFilter === 'unstudied' && isCompleted) return;

      // 3. Search query
      if (query) {
        const matchesQ = q.question.toLowerCase().includes(query);
        const matchesSec = q.section.toLowerCase().includes(query);
        let matchesContent = false;
        if (q.type === 'multiple-choice') {
          matchesContent =
            q.explanation.toLowerCase().includes(query) ||
            Object.values(q.options).some(opt => opt.toLowerCase().includes(query));
        } else {
          matchesContent = q.acceptableCriteria.some(crit => crit.toLowerCase().includes(query));
        }
        if (!matchesQ && !matchesSec && !matchesContent) {
          return;
        }
      }

      list.push(idx);
    });

    return list;
  }, [
    questions,
    selectedSection,
    statusFilter,
    searchQuery,
    progress.bookmarkedIds,
    progress.completedIds,
  ]);

  // Actual sequence of question indices being studied
  const activeDeck = useMemo(() => {
    if (shuffledIndices && shuffledIndices.length === filteredIndices.length) {
      return shuffledIndices;
    }
    return filteredIndices;
  }, [filteredIndices, shuffledIndices]);

  // Sync with jump map selection if navigated externally (React 19 render-time state adjustment)
  const [prevInitialIndex, setPrevInitialIndex] = useState<number | undefined>(initialQuestionIndex);
  if (initialQuestionIndex !== prevInitialIndex) {
    setPrevInitialIndex(initialQuestionIndex);
    if (initialQuestionIndex !== undefined) {
      const targetPos = activeDeck.indexOf(initialQuestionIndex);
      if (targetPos !== -1) {
        setActiveDeckIndex(targetPos);
        setIsFlipped(false);
        setShowOptionsHint(false);
        setDragOffset(0);
      }
    }
  }

  const handleSectionChange = (section: string) => {
    setSelectedSection(section);
    setActiveDeckIndex(0);
    setShuffledIndices(null);
    setIsFlipped(false);
    setShowOptionsHint(false);
    setDragOffset(0);
  };

  const handleStatusFilterChange = (status: FlashcardStatusFilter) => {
    setStatusFilter(status);
    setActiveDeckIndex(0);
    setShuffledIndices(null);
    setIsFlipped(false);
    setShowOptionsHint(false);
    setDragOffset(0);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setActiveDeckIndex(0);
    setShuffledIndices(null);
    setIsFlipped(false);
    setShowOptionsHint(false);
    setDragOffset(0);
  };

  const handleResetFilters = () => {
    setSelectedSection('all');
    setStatusFilter('all');
    setSearchQuery('');
    setActiveDeckIndex(0);
    setShuffledIndices(null);
    setIsFlipped(false);
    setShowOptionsHint(false);
    setDragOffset(0);
  };

  const currentQIndex = activeDeck[activeDeckIndex];
  const currentQ: QuizQuestion | undefined =
    currentQIndex !== undefined ? questions[currentQIndex] : undefined;

  const isMarkedForReview = currentQ ? progress.bookmarkedIds.includes(currentQ.id) : false;
  const isMastered = currentQ ? progress.completedIds.includes(currentQ.id) : false;

  const hasPrev = activeDeckIndex > 0;
  const hasNext = activeDeckIndex < activeDeck.length - 1;

  const handleFlip = useCallback(() => {
    setIsFlipped(prev => !prev);
  }, []);

  const handlePrev = useCallback(() => {
    if (hasPrev && !animatingCard) {
      if (
        document.activeElement instanceof HTMLElement &&
        (document.activeElement === cardRef.current || cardRef.current?.contains(document.activeElement))
      ) {
        document.activeElement.blur();
      }

      const initialScrollY = window.scrollY;
      setDragOffset(0);
      setAnimatingCard({ dir: 'right', phase: 'exit' });
      setTimeout(() => {
        setIsFlipped(false);
        setShowOptionsHint(false);
        setActiveDeckIndex(prev => prev - 1);
        setAnimatingCard({ dir: 'right', phase: 'enter-prep' });

        if (window.scrollY !== initialScrollY && initialScrollY > 0) {
          window.scrollTo({ top: initialScrollY, behavior: 'instant' as ScrollBehavior });
        }

        requestAnimationFrame(() => {
          if (window.scrollY !== initialScrollY && initialScrollY > 0) {
            window.scrollTo({ top: initialScrollY, behavior: 'instant' as ScrollBehavior });
          }
          requestAnimationFrame(() => {
            setAnimatingCard({ dir: 'right', phase: 'enter-active' });
            if (window.scrollY !== initialScrollY && initialScrollY > 0) {
              window.scrollTo({ top: initialScrollY, behavior: 'instant' as ScrollBehavior });
            }
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
      if (
        document.activeElement instanceof HTMLElement &&
        (document.activeElement === cardRef.current || cardRef.current?.contains(document.activeElement))
      ) {
        document.activeElement.blur();
      }

      const initialScrollY = window.scrollY;
      setDragOffset(0);
      setAnimatingCard({ dir: 'left', phase: 'exit' });
      setTimeout(() => {
        setIsFlipped(false);
        setShowOptionsHint(false);
        setActiveDeckIndex(prev => prev + 1);
        setAnimatingCard({ dir: 'left', phase: 'enter-prep' });

        if (window.scrollY !== initialScrollY && initialScrollY > 0) {
          window.scrollTo({ top: initialScrollY, behavior: 'instant' as ScrollBehavior });
        }

        requestAnimationFrame(() => {
          if (window.scrollY !== initialScrollY && initialScrollY > 0) {
            window.scrollTo({ top: initialScrollY, behavior: 'instant' as ScrollBehavior });
          }
          requestAnimationFrame(() => {
            setAnimatingCard({ dir: 'left', phase: 'enter-active' });
            if (window.scrollY !== initialScrollY && initialScrollY > 0) {
              window.scrollTo({ top: initialScrollY, behavior: 'instant' as ScrollBehavior });
            }
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
      } else if (e.key === 'm' || e.key === 'M') {
        if (currentQ && onRateCard) {
          e.preventDefault();
          onRateCard(currentQ.id, isMastered ? 'review' : 'mastered');
        }
      }
    },
    [handleFlip, handlePrev, handleNext, currentQ, onToggleBookmark, onRateCard, isMastered]
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
    isIntentLockedRef.current = null;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (!isPointerDownRef.current) return;
    const deltaX = e.clientX - dragStartXRef.current;
    const deltaY = e.clientY - dragStartYRef.current;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    if (isIntentLockedRef.current === null) {
      // 1. If vertical movement begins or matches horizontal: strictly lock to vertical scrolling
      if (absY >= 12 && absY >= absX) {
        isIntentLockedRef.current = 'vertical';
        isPointerDownRef.current = false;
        setIsDragging(false);
        setDragOffset(0);
        return;
      }

      // 2. Only lock into horizontal card swipe if there is clear, substantial horizontal dominance
      if (absX >= 18 && absX >= absY * 2.0) {
        isIntentLockedRef.current = 'horizontal';
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

    if (isIntentLockedRef.current === 'vertical') {
      return;
    }

    if (isIntentLockedRef.current === 'horizontal' && hasDraggedRef.current) {
      // Resistance dampening if swiping past bounds
      if ((deltaX > 0 && !hasPrev) || (deltaX < 0 && !hasNext)) {
        setDragOffset(deltaX * 0.25);
      } else {
        setDragOffset(deltaX);
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLElement>) => {
    if (!isPointerDownRef.current && !hasDraggedRef.current) {
      isIntentLockedRef.current = null;
      return;
    }

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
    const deltaY = e.clientY - dragStartYRef.current;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);
    const deltaTime = Date.now() - dragStartTimeRef.current;
    const velocityX = absX / Math.max(deltaTime, 1);

    // Require unambiguous horizontal swipe intent
    const isClearHorizontalSwipe =
      isIntentLockedRef.current === 'horizontal' &&
      hasDraggedRef.current &&
      absX > absY * 1.8 &&
      (absX >= 75 || (absX >= 40 && velocityX >= 0.55));

    isIntentLockedRef.current = null;

    if (isClearHorizontalSwipe) {
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
      {/* Top Deck Toolbar: Filters & Shuffle */}
      <div className="bg-[#161b22] border border-slate-800 p-3 sm:p-4 rounded-2xl shadow-lg space-y-3">
        {/* Row 1: Search + Topic Selector + Shuffle Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => handleSearchChange(e.target.value)}
              placeholder="Filter flashcards by keyword..."
              className="w-full bg-[#0d1117] border border-slate-800 rounded-xl pl-9 pr-8 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => handleSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs px-1"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Section / Category Selector */}
          <div className="w-full sm:w-auto">
            <select
              value={selectedSection}
              onChange={e => handleSectionChange(e.target.value)}
              aria-label="Filter flashcards by topic"
              className="w-full sm:w-auto bg-[#0d1117] border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 font-medium"
            >
              <option value="all">All Topics ({questions.length})</option>
              {sections.filter(s => s.id !== 'all').map(sec => (
                <option key={sec.id} value={sec.id}>
                  {sec.shortLabel} ({sec.count})
                </option>
              ))}
            </select>
          </div>

          {/* Shuffle Button */}
          <button
            type="button"
            onClick={handleShuffle}
            disabled={filteredIndices.length <= 1}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-[#0d1117] text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 transition disabled:opacity-50 shrink-0"
            title={t('flashcardShuffle')}
          >
            <Shuffle className="w-3.5 h-3.5 text-sky-400" />
            <span>{t('flashcardShuffle')}</span>
          </button>
        </div>

        {/* Row 2: Status Filter Pills + Active Deck Count */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/60">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleStatusFilterChange('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                statusFilter === 'all'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'bg-[#0d1117] text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              All Cards ({filteredCounts.all})
            </button>

            <button
              type="button"
              onClick={() => handleStatusFilterChange('review')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                statusFilter === 'review'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-[#0d1117] text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>{t('flashcardDeckReview')}</span>
              <span className="text-[11px] opacity-80">({filteredCounts.review})</span>
            </button>

            <button
              type="button"
              onClick={() => handleStatusFilterChange('mastered')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                statusFilter === 'mastered'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-[#0d1117] text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Mastered</span>
              <span className="text-[11px] opacity-80">({filteredCounts.mastered})</span>
            </button>

            <button
              type="button"
              onClick={() => handleStatusFilterChange('unstudied')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                statusFilter === 'unstudied'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-[#0d1117] text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              Unstudied ({filteredCounts.unstudied})
            </button>
          </div>

          <div className="text-xs font-mono text-slate-400">
            <span className="text-sky-400 font-bold">{filteredIndices.length}</span> in deck
          </div>
        </div>
      </div>

      {/* Empty Deck State */}
      {activeDeck.length === 0 ? (
        <div className="bg-[#161b22] border border-slate-800 rounded-2xl p-12 text-center text-slate-300 space-y-4">
          <CheckCircle2 className="w-12 h-12 text-sky-400 mx-auto" />
          <div className="space-y-1">
            <p className="text-base font-semibold">{t('flashcardEmptyDeck')}</p>
            <p className="text-xs text-slate-500">
              No flashcards match your current filter combination.
            </p>
          </div>
          <button
            type="button"
            onClick={handleResetFilters}
            className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition shadow-lg shadow-sky-600/20"
          >
            Reset Filters
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
          <div className="relative overflow-hidden p-1 -m-1">
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
                  /* ================= FRONT: QUESTION PROMPT ================= */
                  <div className="space-y-5">
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
                          type="button"
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

              {/* Bottom Card Footer */}
              <div
                onClick={e => e.stopPropagation()}
                className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2">
                  {/* Mark for Review Button */}
                  <button
                    type="button"
                    onClick={() => onToggleBookmark(currentQ.id)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md active:scale-95 ${
                      isMarkedForReview
                        ? 'bg-amber-600 text-white shadow-amber-600/30 ring-2 ring-amber-400/50'
                        : 'bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 border border-amber-500/40 hover:border-amber-400'
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

                  {/* Mark as Mastered Button */}
                  {onRateCard && (
                    <button
                      type="button"
                      onClick={() => onRateCard(currentQ.id, isMastered ? 'review' : 'mastered')}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md active:scale-95 ${
                        isMastered
                          ? 'bg-emerald-600 text-white shadow-emerald-600/30 ring-2 ring-emerald-400/50'
                          : 'bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/40 hover:border-emerald-400'
                      }`}
                      title={isMastered ? 'Mastered' : 'Mark as Mastered'}
                      aria-label={isMastered ? 'Mastered' : 'Mark as Mastered'}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isMastered ? 'Mastered' : 'Mark Mastered'}</span>
                    </button>
                  )}
                </div>

                <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">
                  [Space] Flip • Swipe or drag • [R] Review • [M] Mastered
                </span>
              </div>
            </article>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between px-2 pt-2">
            <button
              type="button"
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
              type="button"
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
