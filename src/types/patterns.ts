export type PatternCategory =
  | 'Two Pointers & Window'
  | 'Search & Divide'
  | 'Data Structures & LIFO'
  | 'Graphs & Trees'
  | 'Optimization & DP'
  | 'Prefix & Hashes'
  | 'System Caching';

export type PatternDifficulty = 'Foundational' | 'Intermediate' | 'Advanced';

export type PatternTabType = 'intuition' | 'blueprint' | 'visual' | 'traps';

export interface PatternTrap {
  title: string;
  explanation: string;
  mitigation: string;
}

export interface PatternVariant {
  name: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  twist: string;
}

export interface InteractiveStep {
  stepNumber: number;
  label: string;
  description: string;
  stateSnapshot: Record<string, any>;
  highlightIndices?: number[];
  activePointers?: Record<string, number>;
  codeLine?: number;
}

export interface VisualizerPreset {
  id: string;
  name: string;
  description: string;
  inputData: any;
  steps: InteractiveStep[];
}

export interface AlgoPattern {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  category: PatternCategory;
  difficulty: PatternDifficulty;
  tags: string[];
  relatedQuestionId: string;
  relatedQuestionNumber: number;
  relatedQuestionTitle: string;
  visualizerId?: 'two-pointers' | 'sliding-window' | 'binary-search' | 'bfs-grid' | 'gradient-descent';
  
  // Historical & Purpose Context
  origin: {
    year: string;
    pioneer: string;
    context: string;
  };
  whyCreated: string;
  fundamentalBottleneck: string;

  // Tab 1: Intuition & Aha!
  ahaAnalogy: {
    title: string;
    story: string;
    visualConcept: string;
    takeaway: string;
  };
  intuition: {
    coreIdea: string;
    whyNaiveFails: string;
    mathematicalInsight: string;
  };

  // Tab 2: Pattern Blueprint & Recipe
  blueprint: {
    triggerSignals: string[];
    steps: string[];
    codeTemplate: string;
    complexity: {
      time: string;
      space: string;
      amortizedNotes?: string;
    };
  };

  // Tab 3: Interactive Visualizer Data & Engine Config
  visualizerConfig: {
    type:
      | 'two-pointers'
      | 'sliding-window'
      | 'binary-search'
      | 'stack-matching'
      | 'linked-list-reversal'
      | 'grid-bfs'
      | 'dp-coins'
      | 'heap-topk'
      | 'prefix-sums'
      | 'lru-cache';
    presets: VisualizerPreset[];
  };

  // Tab 4: Deep Dive & Traps
  traps: PatternTrap[];
  interviewVariants: PatternVariant[];
}
