---
name: py-question-authoring
description: >-
  Provides guidelines, templates, and procedures for authoring new Python interview questions,
  algorithmic challenges, data manipulation tasks, or ML engineering problems with full trilingual localization.
  Use when adding new questions to src/data/questions/, updating starter/solution code, or adding test cases.
---

# Python Question Authoring Runbook

Use this skill when adding new interview questions to `src/data/questions/`.
Every question must satisfy rigorous pedagogical, algorithmic, and engineering standards.

---

## 1. Directory Structure & Tracks

Questions are organized by track in `src/data/questions/`:
- `fundamentals.ts`: Generators, decorators, closures, dunder methods, iterables, memory management.
- `algorithms.ts`: Data structures, two pointers, sliding window, binary search, trees, DP, graphs.
- `dataManipulation.ts`: In-place operations, matrix rotations, string parsing, grouping, JSON processing.
- `mlEngineering.ts`: NumPy vectorization, gradient descent, metric calculations (IoU, F1, Cosine Similarity), PyTorch/Tensor fundamentals.

---

## 2. Canonical Question Schema (`Question` Interface)

```typescript
import type { Question } from '../../types';

export const newQuestion: Question = {
  id: 'py-07-slug-name',
  number: 7,
  title: 'Descriptive Problem Title',
  slug: 'descriptive-problem-title',
  track: 'fundamentals', // 'fundamentals' | 'algorithms' | 'dataManipulation' | 'mlEngineering'
  difficulty: 'Medium',  // 'Easy' | 'Medium' | 'Hard'
  tags: ['Generators', 'Iterators', 'Performance'],
  summary: 'One sentence concise summary for search and catalog cards.',
  description: `Markdown formatted complete problem statement.
  
### Requirements:
1. Clear numbered requirements.
2. Explicit behavior for edge cases (empty inputs, nulls, negative numbers).`,
  examples: [
    {
      input: 'func([1, 2, 3], 2)',
      output: '[[1, 2], [3]]',
      explanation: 'Detailed walkthrough of the transformation.'
    }
  ],
  constraints: [
    '1 <= len(arr) <= 10^5',
    'Elements fit within 32-bit signed integers.',
    'Time Complexity: O(N), Space Complexity: O(1) auxiliary.'
  ],
  starterCode: `def func(arr, size):
    """
    Function docstring.
    """
    # Write your solution here
    pass
`,
  solutionCode: `def func(arr, size):
    """
    Clean, idiomatic, fully commented reference solution.
    """
    pass
`,
  testHarness: `def _run_tests():
    # 3-5 comprehensive test cases covering standard, empty, single-element, and large inputs
    pass
_run_tests()
`,
  requiredPackages: [] // Optional: e.g. ['numpy', 'pandas'] if needed
};
```

---

## 3. Trilingual Localization Checklist

Whenever a new question or UI category is added:
1. Ensure title, summary, and instructions are clearly phrased.
2. Check `src/locales/en.ts`, `src/locales/ptBR.ts`, and `src/locales/es.ts`.
3. If new tag names or track labels are introduced, add them across all three dictionaries to maintain 100% i18n parity.
