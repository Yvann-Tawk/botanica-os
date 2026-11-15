// Recaps and optional missions for every lesson, one file per galaxy, keyed by lesson id.
import type { LessonExtras } from '../types';
import { X01 } from './g01';
import { X02 } from './g02';
import { X03 } from './g03';
import { X04 } from './g04';
import { X05 } from './g05';
import { X06 } from './g06';
import { X07 } from './g07';
import { X08 } from './g08';

export const EXTRAS: Record<string, LessonExtras> = { ...X01, ...X02, ...X03, ...X04, ...X05, ...X06, ...X07, ...X08 };
