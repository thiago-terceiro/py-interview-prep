import type { Track } from '../types';

export interface TrackMetaItem {
  title: string;
  description: string;
  icon: string;
  color: string;
  badgeBg: string;
  accentColor: string;
  packages: string[];
  count: number;
}

export const TOTAL_QUESTIONS_COUNT = 45;

export const trackMeta: Record<Track, TrackMetaItem> = {
  fundamentals: {
    title: 'Python Fundamentals',
    description: 'Generators, LRU caching, decorators, context managers, iterators, and language nuances.',
    icon: 'Terminal',
    color: 'text-amber-400',
    badgeBg: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    accentColor: '#f59e0b',
    packages: [],
    count: 10,
  },
  algorithms: {
    title: 'Interview Algorithms',
    description: 'Two pointers, sliding window, binary search, DFS/BFS grids, dynamic programming, and heaps.',
    icon: 'Cpu',
    color: 'text-emerald-400',
    badgeBg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    accentColor: '#10b981',
    packages: [],
    count: 17,
  },
  'data-manipulation': {
    title: 'NumPy & Pandas',
    description: 'Broadcasting, one-hot encoding, vector search, groupby aggregations, imputation, and time series.',
    icon: 'Table',
    color: 'text-sky-400',
    badgeBg: 'bg-sky-500/10 text-sky-300 border-sky-500/30',
    accentColor: '#0ea5e9',
    packages: ['numpy', 'pandas'],
    count: 9,
  },
  'ml-engineering': {
    title: 'ML Engineering',
    description: 'Loss functions, gradient descent, metrics, K-Means, BPE tokenization, and Transformer attention.',
    icon: 'Brain',
    color: 'text-purple-400',
    badgeBg: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
    accentColor: '#a855f7',
    packages: ['numpy'],
    count: 9,
  },
};
