// All lesson content, galaxy by galaxy. Imported only by the Academy (a lazy chunk) and the content tests;
// the shell uses the light index in curriculum.ts.
import { GALAXY_01 } from './galaxy01';
import { GALAXY_02 } from './galaxy02';
import { GALAXY_03 } from './galaxy03';
import { GALAXY_04 } from './galaxy04';
import { GALAXY_05 } from './galaxy05';
import { GALAXY_06 } from './galaxy06';
import { GALAXY_07 } from './galaxy07';
import { GALAXY_08 } from './galaxy08';
import type { Lesson } from './types';

export const ALL_LESSONS: Lesson[] = [...GALAXY_01, ...GALAXY_02, ...GALAXY_03, ...GALAXY_04, ...GALAXY_05, ...GALAXY_06, ...GALAXY_07, ...GALAXY_08];
export const lessonById = (id: string) => ALL_LESSONS.find((l) => l.id === id);
