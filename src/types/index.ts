export type Track = 'fundamentals' | 'algorithms' | 'data-manipulation' | 'ml-engineering';

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface TestCase {
  id: number;
  inputDescription: string;
  callExpression: string;
  expectedOutput: string;
  isHidden?: boolean;
}

export interface Question {
  id: string;
  number: number;
  title: string;
  slug: string;
  track: Track;
  difficulty: Difficulty;
  tags: string[];
  summary: string;
  description: string;
  examples: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  constraints: string[];
  starterCode: string;
  solutionCode: string;
  testHarness: string;
  explanation: {
    approach: string;
    timeComplexity: string;
    spaceComplexity: string;
    keyTakeaway: string;
  };
  hints: string[];
  visualizerId?: 'two-pointers' | 'sliding-window' | 'binary-search' | 'bfs-grid' | 'gradient-descent';
}

export interface TestResultItem {
  id: number;
  input: string;
  expected: string;
  actual: string;
  passed: boolean;
  stdout?: string;
  error?: string;
}

export interface ExecutionResult {
  success: boolean;
  passedCount: number;
  totalCount: number;
  results: TestResultItem[];
  stdout: string;
  executionTimeMs: number;
  error?: string;
}

export interface UserProgress {
  solvedQuestionIds: string[];
  codeDrafts: Record<string, string>; // questionId -> code
  lastActiveQuestionId?: string;
}

export interface ReplResult {
  stdout: string;
  result?: string;
  error?: string;
  elapsedMs: number;
}

export interface ScriptRunResult {
  stdout: string;
  error?: string;
  executionTimeMs: number;
}

export interface ConsoleEntry {
  id: string;
  command: string;
  timestamp: Date;
  stdout?: string;
  result?: string;
  error?: string;
  elapsedMs?: number;
}

export * from './quiz';

