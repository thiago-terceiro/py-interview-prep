import type { Question, Track } from '../../types';
import { trackMeta, TOTAL_QUESTIONS_COUNT, type TrackMetaItem } from '../trackMeta';

import { fundamentalQuestions } from './fundamentals';
import { algorithmQuestions } from './algorithms';
import { dataManipulationQuestions } from './dataManipulation';
import { mlEngineeringQuestions } from './mlEngineering';

export { trackMeta, TOTAL_QUESTIONS_COUNT, type TrackMetaItem };

export const allQuestions: Question[] = [
  ...fundamentalQuestions,
  ...algorithmQuestions,
  ...dataManipulationQuestions,
  ...mlEngineeringQuestions,
];

export function getQuestionById(id: string): Question | undefined {
  return allQuestions.find(q => q.id === id);
}

export function getQuestionsByTrack(track: Track): Question[] {
  return allQuestions.filter(q => q.track === track);
}

export function getRequiredPackagesForQuestion(question: Question): string[] {
  return trackMeta[question.track].packages;
}

