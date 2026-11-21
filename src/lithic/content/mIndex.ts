// Authored Power Query M lessons (The Refinery), assembled for the Academy.
import type { MLesson } from './mTypes';
import { RAW_LESSONS } from './m/raw';
import { EXTRACT_LESSONS } from './m/extract';
import { SEPARATE_LESSONS } from './m/separate';
import { TRANSFORM_LESSONS } from './m/transform';

export const M_LESSONS: MLesson[] = [...RAW_LESSONS, ...EXTRACT_LESSONS, ...SEPARATE_LESSONS, ...TRANSFORM_LESSONS];
export const mLessonById = (id: string): MLesson | undefined => M_LESSONS.find((l) => l.id === id);
