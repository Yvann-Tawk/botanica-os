import { M01 } from './m01';
import { M02 } from './m02';
import { M03 } from './m03';
import { M04 } from './m04';
import { M05 } from './m05';
import { M06 } from './m06';
import { M07 } from './m07';
import { M08 } from './m08';
import type { MissionSolutions } from './missions-types';

export const MISSION_SOLUTIONS: MissionSolutions = { ...M01, ...M02, ...M03, ...M04, ...M05, ...M06, ...M07, ...M08 };
