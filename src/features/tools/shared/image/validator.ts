import type {
  ImageFormat,
  OfficialSpecPreset,
  ValidationIssue,
  ValidationReport,
} from "./types"

/**
 * Pure validation. Determines whether an image (by its dimensions, bytes,
 * format) satisfies an official specification. No canvas / DOM access.
 *
 * The validator is conservative: it reports "not compliant" / raises errors
 * whenever a hard requirement cannot be confirmed. Background is reported as
 * informational (estimated) and must NOT itself gate a compliant=true result.
 */

export interface ImageCandidate {
  /** Pixel width of the image to validate. */
  width: number
  height: number
  /** Byte size. */
  bytes: number
  /** Actual container format. */
  format: ImageFormat
  /** DPI if known, else undefined. */
  dpi?: number
  /** Estimated background brightness (0..1) if sampled, else undefined. */
  backgroundBrightness?: number
}

export interface ValidatedOutcome {
  /** True only when the candidate satisfies the hard, checkable requirements. */
  compliant: boolean
  issues: ValidationIssue[]
}

function error(code: string, message: string): ValidationIssue {
  return { severity: "error", code, message }
}
function warning(code: string, message: string): ValidationIssue {
  return { severity: "warning", code, message }
}
function info(code: string, message: string): ValidationIssue {
  return { severity: "info", code, message }
}

/** Expected pixel dims for a preset. Government presets are in px. */
function pixelDimensions(preset: OfficialSpecPreset): { width: number; height: number } {
  // specs may be in cm — but government presets use px; resolve is done in the tool if needed.
  if (preset.dimensions.unit === "px") {
    return { width: preset.dimensions.width, height: preset.dimensions.height }
  }
  // Not resolvable without a DPI — treat as a warning-noting soft requirement.
  return { width: 0, height: 0 }
}

/**
 * Validate an image candidate against a preset. Produces a report. Hard
 * mismatches become errors (compliant=false). Missing/metadata-only caveats are
 * warnings. `report` is assembled for the UI.
 */
export function validateAgainstPreset(
  candidate: ImageCandidate,
  preset: OfficialSpecPreset,
): ValidatedOutcome {
  const issues: ValidationIssue[] = []
  const needsPx = pixelDimensions(preset)

  if (!preset.acceptedFormats.includes(candidate.format)) {
    issues.push(
      error(
        "invalid_format",
        `Format must be ${preset.acceptedFormats.map(toExt).join(" or ")}. Received ${
          candidate.format
        }.`,
      ),
    )
  }

  if (needsPx.width > 0 && needsPx.height > 0) {
    if (candidate.width !== needsPx.width || candidate.height !== needsPx.height) {
      issues.push(
        error(
          "invalid_dimensions",
          `Expected ${needsPx.width}×${needsPx.height} px. Received ${candidate.width}×${candidate.height} px.`,
        ),
      )
    }
  } else {
    issues.push(
      info(
        "unresolved_dimensions",
        "Preset dimensions are not in px — dimension check skipped pending an explicit DPI.",
      ),
    )
  }

  const minBytes = preset.kbMin * 1024
  const maxBytes = preset.kbMax === Infinity ? Infinity : preset.kbMax * 1024

  if (candidate.bytes < minBytes) {
    issues.push(error("file_too_small", `File size ${fmt(candidate.bytes)} is below the required minimum ${preset.kbMin} KB.`))
  }
  if (candidate.bytes > maxBytes) {
    issues.push(error("file_too_large", `File size ${fmt(candidate.bytes)} exceeds ${preset.kbMax} KB.`))
  }

  // Aspect ratio — only when exact dimensions are prescribed and known.
  if (needsPx.width > 0 && needsPx.height > 0) {
    const targetRatio = needsPx.width / needsPx.height
    const actualRatio = candidate.height > 0 ? candidate.width / candidate.height : 0
    if (Math.abs(targetRatio - actualRatio) > 0.01) {
      issues.push(
        warning(
          "aspect_ratio_mismatch",
          `Aspect ratio differs from the prescribed ${needsPx.width}:${needsPx.height}.`,
        ),
      )
    }
  }

  // DPI — informational only; portals rarely validate it hard.
  if (candidate.dpi !== undefined && candidate.dpi <= 0) {
    issues.push(info("dpi_unknown", "DPI not present in file metadata."))
  }

  // Background — always informational, never silently a pass.
  if (preset.backgroundColor) {
    if (candidate.backgroundBrightness === undefined) {
      issues.push(
        info(
          "background_not_sampled",
          `Preset expects a ${preset.backgroundColor} background. We could not confirm it from the image.`,
        ),
      )
    } else if (candidate.backgroundBrightness < 0.7 && preset.backgroundColor === "white") {
      issues.push(
        warning(
          "background_dark",
          "Background reads darker than white; the examination body may reject it. Ensure a plain light background.",
        ),
      )
    }
  }

  const anyError = issues.some((i) => i.severity === "error")
  return { compliant: !anyError, issues }
}

/** Convenience wrapper producing a ValidationReport from a candidate against a preset. */
export function validateCandidate(
  candidate: ImageCandidate,
  preset: OfficialSpecPreset,
): ValidationReport {
  return validateAgainstPreset(candidate, preset) as ValidationReport
}

/** Validate an arbitrary target spec (no preset) for the "resize / exact KB" tools. */
export function validateGeneric(
  candidate: ImageCandidate,
  options: { kbMin: number; kbMax: number; acceptedFormats: ImageFormat[] },
): ValidatedOutcome {
  const issues: ValidationIssue[] = []
  if (!options.acceptedFormats.includes(candidate.format)) {
    issues.push(
      error(
        "invalid_format",
        `Accepted formats: ${options.acceptedFormats.join(", ")}. Received ${candidate.format}.`,
      ),
    )
  }
  const minB = options.kbMin * 1024
  const maxB = options.kbMax === Infinity ? Infinity : options.kbMax * 1024
  if (candidate.bytes < minB) issues.push(error("file_too_small", `Below minimum ${options.kbMin} KB.`))
  if (candidate.bytes > maxB) issues.push(error("file_too_large", `Above maximum ${options.kbMax} KB.`))
  return { compliant: !issues.some((i) => i.severity === "error"), issues }
}

/** Extension label for a format. */
function toExt(f: ImageFormat): string {
  return f === "png" ? "PNG" : "JPG"
}

/** Human readable byte size. */
function fmt(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}