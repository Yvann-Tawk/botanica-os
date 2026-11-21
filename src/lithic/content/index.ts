// All authored Lithic lessons, assembled for the Lithic Academy (a lazy chunk). As mini-planets are authored,
// import their lesson arrays here; the Survey/curriculum metadata in ../curriculum.ts stays the index the shell
// uses without loading this text.

import type { HtmlLesson } from './types';
import { STONE_LESSONS } from './html/stone';
import { WALLS_LESSONS } from './html/walls';
import { PATHS_LESSONS } from './html/paths';
import { ARCHIVES_LESSONS } from './html/archives';
import { CHAMBERS_LESSONS } from './html/chambers';
import { CONTROL_LESSONS } from './html/control';
import { LIVING_LESSONS } from './html/living';
import { GRAND_LESSONS } from './html/grand';

export const HTML_LESSONS: HtmlLesson[] = [...STONE_LESSONS, ...WALLS_LESSONS, ...PATHS_LESSONS, ...ARCHIVES_LESSONS, ...CHAMBERS_LESSONS, ...CONTROL_LESSONS, ...LIVING_LESSONS, ...GRAND_LESSONS];
export const htmlLessonById = (id: string): HtmlLesson | undefined => HTML_LESSONS.find((l) => l.id === id);

export { DAX_LESSONS, daxLessonById } from './daxIndex';
import { DAX_LESSONS } from './daxIndex';

/** Lesson ids with authored content (the rest open the "coming soon" card). */
export const AUTHORED_LESSON_IDS = new Set([...HTML_LESSONS.map((l) => l.id), ...DAX_LESSONS.map((l) => l.id)]);
