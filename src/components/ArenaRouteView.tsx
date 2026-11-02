import React, { useEffect } from 'react';
import { useParams } from '@tanstack/react-router';
import { allQuestions, getQuestionById } from '../data/questions';
import { ProblemArena } from './ProblemArena';
import { useAppNavigation } from '../App';

export const ArenaRouteView: React.FC = () => {
  const params = useParams({ strict: false }) as { questionId?: string };
  const questionId = params?.questionId;

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
};

export default ArenaRouteView;
