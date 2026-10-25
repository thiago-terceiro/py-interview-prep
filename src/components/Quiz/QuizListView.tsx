import React, { useState, useMemo } from 'react';
import type { QuizQuestion, UserQuizProgress } from '../../types/quiz';
import { useLanguage } from '../../context/LanguageContext';
import {
  Search,
  CheckCircle2,
  XCircle,
  Bookmark,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';

interface QuizListViewProps {
  questions: QuizQuestion[];
  progress: UserQuizProgress;
  onSelectQuestion: (index: number, mode: 'quiz' | 'flashcard') => void;
  onToggleBookmark: (id: number) => void;
}

type StatusFilter = 'all' | 'completed' | 'correct' | 'incorrect' | 'bookmarked' | 'unanswered';

export const QuizListView: React.FC<QuizListViewProps> = ({
  questions,
  progress,
  onSelectQuestion,
  onToggleBookmark,
}) => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  // Available sections
  const sections: { id: string; label: string; count: number }[] = useMemo(() => {
    const list: { id: string; label: string; count: number }[] = [
      { id: 'all', label: t('quizFilterAll'), count: questions.length },
    ];

    const uniqueSections = Array.from(new Set(questions.map(q => q.section)));
    for (const sec of uniqueSections) {
      list.push({
        id: sec,
        label: sec,
        count: questions.filter(q => q.section === sec).length,
      });
    }

    return list;
  }, [questions, t]);

  // Filtered questions
  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      // 1. Section filter
      if (selectedSection !== 'all' && q.section !== selectedSection) {
        return false;
      }

      // 2. Status filter
      const isBookmarked = progress.bookmarkedIds.includes(q.id);
      const isCompleted = progress.completedIds.includes(q.id);
      const isAnswered =
        q.type === 'multiple-choice'
          ? progress.selectedAnswers[q.id] !== undefined
          : isCompleted || (progress.openEndedNotes[q.id] && progress.openEndedNotes[q.id].trim().length > 0);

      const isCorrect =
        q.type === 'multiple-choice' && progress.selectedAnswers[q.id] === q.answer;
      const isIncorrect =
        q.type === 'multiple-choice' &&
        progress.selectedAnswers[q.id] !== undefined &&
        progress.selectedAnswers[q.id] !== q.answer;

      if (statusFilter === 'completed' && !isAnswered && !isCompleted) return false;
      if (statusFilter === 'unanswered' && (isAnswered || isCompleted)) return false;
      if (statusFilter === 'correct' && !isCorrect) return false;
      if (statusFilter === 'incorrect' && !isIncorrect) return false;
      if (statusFilter === 'bookmarked' && !isBookmarked) return false;

      // 3. Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
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

        return matchesQ || matchesSec || matchesContent;
      }

      return true;
    });
  }, [questions, selectedSection, statusFilter, searchQuery, progress]);

  return (
    <div className="space-y-6">
      {/* Search & Filter Toolbar */}
      <div className="bg-[#161b22] border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={t('quizSearchPlaceholder')}
              className="w-full bg-[#0d1117] border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs"
              >
                Clear
              </button>
            )}
          </div>

          {/* Status Filter Pill Selector */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-slate-400 font-mono hidden xl:inline mr-1">Status:</span>
            {(
              [
                { id: 'all', label: t('quizFilterAllStatus') },
                { id: 'correct', label: t('quizFilterCorrect') },
                { id: 'incorrect', label: t('quizFilterIncorrect') },
                { id: 'bookmarked', label: t('quizFilterBookmarked') },
                { id: 'unanswered', label: t('quizFilterUnanswered') },
              ] as const
            ).map(item => (
              <button
                key={item.id}
                onClick={() => setStatusFilter(item.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  statusFilter === item.id
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'bg-[#0d1117] text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Section Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-800/80">
          {sections.map(sec => (
            <button
              key={sec.id}
              onClick={() => setSelectedSection(sec.id)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                selectedSection === sec.id
                  ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/50'
                  : 'bg-[#0d1117] text-slate-400 hover:text-slate-300 border border-slate-800'
              }`}
            >
              {sec.label} <span className="text-[10px] opacity-70">({sec.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Results Header Count */}
      <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
        <span>
          Showing {filteredQuestions.length} of {questions.length} questions
        </span>
        {(searchQuery || selectedSection !== 'all' || statusFilter !== 'all') && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedSection('all');
              setStatusFilter('all');
            }}
            className="text-sky-400 hover:underline flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>{t('quizClearFilters')}</span>
          </button>
        )}
      </div>

      {/* List of Questions */}
      {filteredQuestions.length === 0 ? (
        <div className="bg-[#161b22] border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
          <p className="text-base font-semibold mb-2">{t('quizNoQuestionsFound')}</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedSection('all');
              setStatusFilter('all');
            }}
            className="px-4 py-2 rounded-xl bg-sky-600 text-white text-xs font-bold hover:bg-sky-500 transition"
          >
            {t('quizClearFilters')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3.5">
          {filteredQuestions.map(q => {
            const index = questions.findIndex(item => item.id === q.id);
            const isBookmarked = progress.bookmarkedIds.includes(q.id);
            const isCompleted = progress.completedIds.includes(q.id);
            const isMCQ = q.type === 'multiple-choice';

            const userSelected = isMCQ ? progress.selectedAnswers[q.id] : undefined;
            const isAnswered = isMCQ ? userSelected !== undefined : isCompleted;
            const isCorrect = isMCQ && userSelected === q.answer;

            return (
              <div
                key={q.id}
                className="bg-[#161b22] border border-slate-800/80 hover:border-slate-700 rounded-xl p-4 sm:p-5 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                      #{q.id}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/60 max-w-xs truncate">
                      {q.section}
                    </span>

                    {/* Status badge */}
                    {isMCQ ? (
                      isAnswered ? (
                        isCorrect ? (
                          <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>{t('quizStatusCorrect')}</span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[11px] font-bold text-rose-400 bg-rose-950/40 px-2 py-0.5 rounded border border-rose-500/30">
                            <XCircle className="w-3 h-3" />
                            <span>{t('quizStatusIncorrect')}</span>
                          </span>
                        )
                      ) : null
                    ) : (
                      isCompleted && (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{t('quizMarkMastered')}</span>
                        </span>
                      )
                    )}
                  </div>

                  <p className="text-sm sm:text-base font-semibold text-slate-200 group-hover:text-white transition-colors leading-snug line-clamp-2">
                    {q.question}
                  </p>
                </div>

                {/* Right Action buttons */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => onToggleBookmark(q.id)}
                    className={`p-2 rounded-lg text-xs transition-colors ${
                      isBookmarked
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700'
                    }`}
                    title={isBookmarked ? t('quizBookmarked') : t('quizBookmark')}
                    aria-label={isBookmarked ? t('quizBookmarked') : t('quizBookmark')}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
                  </button>

                  <button
                    onClick={() => onSelectQuestion(index, 'quiz')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white shadow-sm transition-all"
                  >
                    <span>Quiz</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onSelectQuestion(index, 'flashcard')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
                  >
                    <span>Cards</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
