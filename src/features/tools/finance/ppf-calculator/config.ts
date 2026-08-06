/**
 * Single source of truth for PPF rules. The government reviews the PPF
 * interest rate quarterly and can revise deposit limits; update these values
 * here and every consumer (engine, UI, manifest, FAQ) picks them up.
 */
export const PPF_CONFIG = {
  /** Current government rate (FY 2026-27, Q1–Q2): 7.1% p.a. */
  annualRatePct: 7.1,
  /** Minimum deposit per financial year to keep an account active (₹). */
  minDeposit: 500,
  /** Maximum deposit per financial year (₹1,50,000). */
  maxDeposit: 150000,
  /** Standard lock-in period before the account matures (years). */
  lockInYears: 15,
  /** After maturity the account can be extended in blocks of this many years. */
  extensionBlockYears: 5,
} as const

export type PpfConfig = typeof PPF_CONFIG
