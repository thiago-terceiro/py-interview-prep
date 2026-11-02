import { describe, it, expect } from 'vitest';
import { quizQuestions } from './quizQuestions';

describe('Quiz Data Integrity & Performance Structures', () => {
  it('has 200 questions with unique IDs from 1 to 200', () => {
    expect(quizQuestions.length).toBe(200);
    const ids = quizQuestions.map(q => q.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(200);
    expect(Math.min(...ids)).toBe(1);
    expect(Math.max(...ids)).toBe(200);
  });

  it('all multiple-choice questions have valid options and answers', () => {
    const mcqs = quizQuestions.filter(q => q.type === 'multiple-choice');
    expect(mcqs.length).toBe(200);
    for (const q of mcqs) {
      expect(['A', 'B', 'C', 'D']).toContain(q.answer);
      expect(q.options.A).toBeDefined();
      expect(q.options.B).toBeDefined();
      expect(q.options.C).toBeDefined();
      expect(q.options.D).toBeDefined();
      expect(q.explanation.length).toBeGreaterThan(0);
    }
  });

  it('any open-ended questions have acceptable criteria if present', () => {
    const openEnded = quizQuestions.filter(q => q.type === 'open-ended');
    for (const q of openEnded) {
      expect(q.acceptableCriteria.length).toBeGreaterThan(0);
    }
  });
});
