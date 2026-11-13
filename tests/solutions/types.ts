/** Model answers for content tests. Several per exercise where alternatives are common; `wrong` lists answers that must fail. */
export type Solutions = Record<string, { practice: string[]; challenge: string[]; wrong?: { practice?: string[]; challenge?: string[] }; inputs?: string[] }>;
