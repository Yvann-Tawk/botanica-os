// A world-agnostic registry of every concept id Terraform OS knows about. Each world's curriculum registers its
// ids at import time, so the progression store (progress.ts) can validate completions without importing every
// world — which would create cycles and couple the store to Python. Botanica and Lithic both register here.

const known = new Set<string>();

/** Called at module load by each world's curriculum. Ids are stable keys; registering twice is harmless. */
export function registerConcepts(ids: Iterable<string>): void {
  for (const id of ids) known.add(id);
}

/** Whether a conceptId belongs to any registered world. Garbage keys in stored progress are dropped. */
export function isKnownConcept(id: string): boolean {
  return known.has(id);
}
