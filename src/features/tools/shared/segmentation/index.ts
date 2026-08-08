/**
 * Public API of the reusable segmentation engine.
 *
 * The engine's core contract is a foreground `AlphaMask`. Consumers
 * (background removal, replace background, blur background, autocrop, passport
 * photo, product photo, object isolation, stickers) compose the exported
 * functions below — none of them read the engine's internals.
 */
export * from "./types"
export * from "./color"
export * from "./mask"
export * from "./refine"
export * from "./geometry"
export * from "./operators"
export * from "./pipeline"
export { AI_MODEL, AI_MAX_INPUT_PIXELS } from "./model"
export { isAiAvailable, runAiMask } from "./ai"
export type { AiAvailability, AiMaskResult } from "./ai"
export { loadImageRgba, rgbaToBlob, backgroundRemovedFileName } from "./driver"
export type { LoadedImageRgba, OutputFormat } from "./driver"