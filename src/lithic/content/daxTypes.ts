// DAX (The Crystal Matrix) lesson type: the shared Lesson shell, validated by the DaxCheck engine.
import type { Lesson, Exercise, Mission } from './types';
import type { DaxCheck } from '../runtime/dax/checks';

export type DaxExercise = Exercise<DaxCheck>;
export type DaxMission = Mission<DaxCheck>;
export interface DaxLesson extends Lesson<DaxCheck> { planetId: 'matrix' }
