/** Model answers for optional lesson missions: `ok` solutions must pass every check, `wrong` ones must fail. */
export type MissionSolutions = Record<string, { ok: string[]; wrong?: string[] }>;
