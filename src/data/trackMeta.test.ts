import { describe, it, expect } from 'vitest';
import { trackMeta, TOTAL_QUESTIONS_COUNT } from './trackMeta';
import { allQuestions } from './questions';

describe('Track Metadata & Questions Parity', () => {
  it('total questions count matches allQuestions array length', () => {
    expect(allQuestions.length).toBe(TOTAL_QUESTIONS_COUNT);
    expect(TOTAL_QUESTIONS_COUNT).toBe(45);
  });

  it('each track has correct question count summing to TOTAL_QUESTIONS_COUNT', () => {
    let sum = 0;
    for (const key of Object.keys(trackMeta) as Array<keyof typeof trackMeta>) {
      const meta = trackMeta[key];
      const countInArray = allQuestions.filter(q => q.track === key).length;
      expect(meta.count).toBe(countInArray);
      sum += meta.count;
    }
    expect(sum).toBe(TOTAL_QUESTIONS_COUNT);
  });

  it('all question IDs are unique and start with py-', () => {
    const ids = allQuestions.map(q => q.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
    for (const id of ids) {
      expect(id).toMatch(/^py-\d{2}-/);
    }
  });

  it('each question has non-empty starterCode and testHarness', () => {
    for (const q of allQuestions) {
      expect(q.starterCode.trim().length).toBeGreaterThan(0);
      expect(q.testHarness.trim().length).toBeGreaterThan(0);
    }
  });
});
