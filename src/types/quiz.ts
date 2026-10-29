export type QuizQuestionType = 'multiple-choice' | 'open-ended';

export type QuizSection =
  | 'Machine Learning Fundamentals & Beginner Concepts'
  | 'Classical ML, Feature Engineering & Fraud/Anomaly Detection'
  | 'Ultra-Low-Latency Inference, ONNX & Real-Time Data Stores'
  | 'MLOps, Drift Detection, CI/CD & Observability'
  | 'Agentic Workflows, LangGraph, State Machines & LLMs'
  | 'Distributed Systems, Security, RBAC & Cryptographic Auditing'
  | 'High-Performance React/Next.js Streaming UI & Accessibility'
  | 'Open-Ended System Design & Scenario';

export interface MultipleChoiceQuestion {
  id: number;
  type: 'multiple-choice';
  section: QuizSection;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  answer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
}

export interface OpenEndedQuestion {
  id: number;
  type: 'open-ended';
  section: QuizSection;
  question: string;
  acceptableCriteria: string[];
}

export type QuizQuestion = MultipleChoiceQuestion | OpenEndedQuestion;

export interface UserQuizProgress {
  selectedAnswers: Record<number, 'A' | 'B' | 'C' | 'D'>;
  openEndedNotes: Record<number, string>;
  openEndedCheckedCriteria: Record<number, number[]>;
  bookmarkedIds: number[];
  completedIds: number[];
}

export type QuizViewMode = 'quiz' | 'flashcard' | 'list';
