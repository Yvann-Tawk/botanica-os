import { G01 } from './g01';
import { G02 } from './g02';
import { G03 } from './g03';
import { G04 } from './g04';
import { G05 } from './g05';
import { G06 } from './g06';
import { G07 } from './g07';
import { G08 } from './g08';
import type { Solutions } from './types';

export const SOLUTIONS: Solutions = { ...G01, ...G02, ...G03, ...G04, ...G05, ...G06, ...G07, ...G08 };
