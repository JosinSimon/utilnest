import type {
  AlphaMask,
  MaskStats,
  RgbaBuffer,
  Size,
  SolidAnalysis,
  SolidOptions,
} from "./types"
import { analyzeBorder } from "./color"
import { makeForegroundMask, fillEnclosedHoles } from "./mask"
import { erodeMask, featherMask } from "./refine"

/** Sanitized default solid-removal options. */
export const SOLID_DEFAULTS = {
  tolerance: 48,
  erodeRadius: 1,
  featherRadius: 0,
  fillHoles: true,
  minAlphaKeep: 128,
  maxWorkPixels: 6_000_000,
} satisfies Required<Pick<SolidOptions, "tolerance" | "erodeRadius" | "featherRadius" | "fillHoles" | "minAlphaKeep" | "maxWorkPixels">>

export function withSolidDefaults(opts: SolidOptions = {}): Required<SolidOptions> {
  return {
    ...SOLID_DEFAULTS,
    ...opts,
    targetColor: opts.targetColor ?? null,
    matchMode: opts.matchMode ?? "edge",
  }
}

/** Simple fg/bg ratio of a foreground mask. */
export function maskStats(mask: AlphaMask): {
  foregroundRatio: number
  backgroundRatio: number
} {
  let fg = 0
  const n = mask.length
  for (let i = 0; i < n; i++) {
    if (mask[i] >= 128) fg++
  }
  const r = n === 0 ? 0 : fg / n
  return { foregroundRatio: r, backgroundRatio: 1 - r }
}

/**
 * Deterministic solid matcher used by the whole app and by unit tests.
 * Produces a foreground `AlphaMask` (not the composited image) so that both
 * the AI path and the solid path converge on the same contract.
 */
export function extractSolidMask(
  rgba: RgbaBuffer,
  size: Size,
  opts: SolidOptions = {},
): {
  mask: AlphaMask
  analysis: SolidAnalysis
  stats: MaskStats
} {
  const o = withSolidDefaults(opts)
  const analysis = analyzeBorder(rgba, size, { tolerance: o.tolerance })

  const bgColor = o.targetColor ?? analysis.backgroundColor
  const mask = makeForegroundMask(rgba, size, o.matchMode, {
    bgColor,
    tolerance: o.tolerance,
    minAlphaKeep: o.minAlphaKeep,
  })

  let refined = mask
  if (o.fillHoles) refined = fillEnclosedHoles(refined, size)
  if (o.erodeRadius > 0) refined = erodeMask(refined, size, o.erodeRadius)
  if (o.featherRadius > 0) refined = featherMask(refined, size, o.featherRadius)

  return { mask: refined, analysis, stats: maskStats(refined) }
}

/**
 * Front-door for the deterministic solid matcher. The AI path lives behind
 * `segmentation/ai.ts` and converges on the same `AlphaMask` contract, so any
 * wrapper can route mode -> matcher without branching on engine internals.
 */
export function segment(
  rgba: RgbaBuffer,
  size: Size,
  opts: SolidOptions = {},
): ReturnType<typeof extractSolidMask> {
  return extractSolidMask(rgba, size, opts)
}

/** Recommendation used by the UI before any heavy work runs. */
export function recommendMode(rgba: RgbaBuffer, size: Size): SolidAnalysis {
  return analyzeBorder(rgba, size)
}