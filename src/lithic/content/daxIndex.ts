// Authored DAX lessons (The Crystal Matrix), assembled for the Academy. Mini-planet arrays are imported here as
// they are written.
import type { DaxLesson } from './daxTypes';
import { FIRSTCALC_LESSONS } from './dax/firstcalc';
import { FUNCTIONS_LESSONS } from './dax/functions';
import { CONTEXT_LESSONS } from './dax/context';
import { CORE_LESSONS } from './dax/core';

export const DAX_LESSONS: DaxLesson[] = [...FIRSTCALC_LESSONS, ...FUNCTIONS_LESSONS, ...CONTEXT_LESSONS, ...CORE_LESSONS];
export const daxLessonById = (id: string): DaxLesson | undefined => DAX_LESSONS.find((l) => l.id === id);
