/**
 * Confidence must be at or above this to resolve straight to a decision.
 * Below it, the adaptive round fires — a real branch, not decoration. AI_SYSTEM.md §3.
 */
export const CONFIDENCE_THRESHOLD = 0.85;

/** Pacing for the DemoRunner's staggered event dispatch, in milliseconds. */
export const DEMO_STEP_DELAY_MS = 260;

/** Briefly hold the failed confidence state before the automatic recovery route replaces it. */
export const AUTO_RECOVERY_DELAY_MS = 1600;
