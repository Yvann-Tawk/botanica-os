// Power Query M (The Refinery) lesson type: the shared Lesson shell, validated by the MCheck engine.
import type { Lesson, Exercise, Mission } from './types';
import type { MCheck } from '../runtime/m/checks';

export type MExercise = Exercise<MCheck>;
export type MMission = Mission<MCheck>;
export interface MLesson extends Lesson<MCheck> { planetId: 'refinery' }
