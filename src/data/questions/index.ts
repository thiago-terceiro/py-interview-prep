import type { Question, Track } from '../../types';

import { fundamentalQuestions } from './fundamentals';
import { algorithmQuestions } from './algorithms';
import { dataManipulationQuestions } from './dataManipulation';
import { mlEngineeringQuestions } from './mlEngineering';

export const allQuestions: Question[] = [
  ...fundamentalQuestions,
  ...algorithmQuestions,
  ...dataManipulationQuestions,
  ...mlEngineeringQuestions,
];

export const trackMeta: Record<
  Track,
  {
    title: string;
    description: string;
    icon: string;
    color: string;
    badgeBg: string;
    accentColor: string;
    packages: string[];
  }
> = {
  fundamentals: {
    title: 'Python Fundamentals',
    description: 'Generators, LRU caching, decorators, context managers, iterators, and language nuances.',
    icon: 'Terminal',
    color: 'text-amber-400',
    badgeBg: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    accentColor: '#f59e0b',
    packages: [],
  },
  algorithms: {
    title: 'Interview Algorithms',
    description: 'Two pointers, sliding window, binary search, DFS/BFS grids, dynamic programming, and heaps.',
    icon: 'Cpu',
    color: 'text-emerald-400',
    badgeBg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    accentColor: '#10b981',
    packages: [],
  },
  'data-manipulation': {
    title: 'NumPy & Pandas',
    description: 'Broadcasting, one-hot encoding, vector search, groupby aggregations, imputation, and time series.',
    icon: 'Table',
    color: 'text-sky-400',
    badgeBg: 'bg-sky-500/10 text-sky-300 border-sky-500/30',
    accentColor: '#0ea5e9',
    packages: ['numpy', 'pandas'],
  },
  'ml-engineering': {
    title: 'ML Engineering',
    description: 'Loss functions, gradient descent, metrics, K-Means, BPE tokenization, and Transformer attention.',
    icon: 'Brain',
    color: 'text-purple-400',
    badgeBg: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
    accentColor: '#a855f7',
    packages: ['numpy'],
  },
};

export function getQuestionById(id: string): Question | undefined {
  return allQuestions.find(q => q.id === id);
}

export function getQuestionsByTrack(track: Track): Question[] {
  return allQuestions.filter(q => q.track === track);
}

export function getRequiredPackagesForQuestion(question: Question): string[] {
  return trackMeta[question.track].packages;
}
