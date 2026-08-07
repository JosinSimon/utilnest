import type { OfficialSpecPreset } from "./types"

/**
 * Official specification registry for government-form image tools.
 *
 * RULES
 *  - The official notification or official application portal is ALWAYS the
 *    source of truth. Third-party blogs / coaching sites are never authoritative.
 *  - Every preset is only `verified: true` when confirmed against an official
 *    source (sourceUrl + notificationYear + lastVerified set).
 *  - If we cannot confirm an official source yet, the preset stays
 *    `verified: false` and the UI shows:
 *    "Official specification awaiting verification."
 *  - Never guess specifications.
 */

export const PRESET_REGISTRY: OfficialSpecPreset[] = [
  {
    id: "ssc-cgl-photo",
    exam: "SSC CGL",
    organization: "Staff Selection Commission",
    documentType: "photo",
    dimensions: { width: 200, height: 230, unit: "px" },
    kbMin: 20,
    kbMax: 50,
    acceptedFormats: ["jpeg"],
    preferredFormat: "jpeg",
    backgroundColor: "white",
    allowDownscale: false,
    sourceUrl: "https://ssc.gov.in",
    notificationYear: 2026,
    verified: false,
    notes:
      "SSC has moved to live webcam/QR photo capture for recent cycles. Pixel dimensions and KB range vary by notification year — awaiting confirmation from the official ssc.gov.in notification. Do not treat as authoritative.",
  },
  {
    id: "ssc-cgl-signature",
    exam: "SSC CGL",
    organization: "Staff Selection Commission",
    documentType: "signature",
    dimensions: { width: 140, height: 60, unit: "px" },
    kbMin: 10,
    kbMax: 20,
    acceptedFormats: ["jpeg"],
    preferredFormat: "jpeg",
    backgroundColor: "white",
    allowDownscale: false,
    sourceUrl: "https://ssc.gov.in",
    notificationYear: 2026,
    verified: false,
    notes:
      "Signature must be signed in black ink on plain white paper, running hand (block capitals not allowed). 4.0cm x 2.0cm nominal. Awaiting confirmation from the official notification.",
  },
  {
    id: "neet-ug-photo",
    exam: "NEET UG",
    organization: "National Testing Agency (NTA)",
    documentType: "photo",
    dimensions: { width: 350, height: 450, unit: "px" },
    kbMin: 10,
    kbMax: 200,
    acceptedFormats: ["jpeg"],
    preferredFormat: "jpeg",
    backgroundColor: "white",
    allowDownscale: false,
    sourceUrl: "https://neet.nta.nic.in",
    notificationYear: 2026,
    verified: false,
    notes:
      "Passport-size (3.5cm x 4.5cm nominal) on white background, 80% face coverage, ears visible. Dimension values reported by coaching sources range 275x354 to 413x531 — awaiting the official NTA information bulletin.",
  },
  {
    id: "neet-ug-signature",
    exam: "NEET UG",
    organization: "National Testing Agency (NTA)",
    documentType: "signature",
    dimensions: { width: 275, height: 118, unit: "px" },
    kbMin: 4,
    kbMax: 30,
    acceptedFormats: ["jpeg"],
    preferredFormat: "jpeg",
    backgroundColor: "white",
    allowDownscale: false,
    sourceUrl: "https://neet.nta.nic.in",
    notificationYear: 2026,
    verified: false,
    notes:
      "Signature in running hand, black ink. Awaiting confirmation from the official NTA bulletin.",
  },
  {
    id: "ibps-po-photo",
    exam: "IBPS PO / Clerk",
    organization: "Institute of Banking Personnel Selection",
    documentType: "photo",
    dimensions: { width: 200, height: 230, unit: "px" },
    kbMin: 20,
    kbMax: 50,
    acceptedFormats: ["jpeg"],
    preferredFormat: "jpeg",
    backgroundColor: "white",
    allowDownscale: false,
    sourceUrl: "https://www.ibps.in",
    notificationYear: 2026,
    verified: false,
    notes:
      "IBPS commonly requires 200x230 px, 20-50 KB. Awaiting confirmation from the official ibps.in notification.",
  },
  {
    id: "ibps-signature",
    exam: "IBPS PO / Clerk",
    organization: "Institute of Banking Personnel Selection",
    documentType: "signature",
    dimensions: { width: 140, height: 60, unit: "px" },
    kbMin: 10,
    kbMax: 20,
    acceptedFormats: ["jpeg"],
    preferredFormat: "jpeg",
    backgroundColor: "white",
    allowDownscale: false,
    sourceUrl: "https://www.ibps.in",
    notificationYear: 2026,
    verified: false,
    notes:
      "Awaiting confirmation from the official ibps.in notification.",
  },
]

export function getPresetById(id: string): OfficialSpecPreset | undefined {
  return PRESET_REGISTRY.find((p) => p.id === id)
}

/** Presets grouped by exam for the UI gallery. */
export function getPresetsByExam(): Map<string, OfficialSpecPreset[]> {
  const map = new Map<string, OfficialSpecPreset[]>()
  for (const p of PRESET_REGISTRY) {
    const list = map.get(p.exam) ?? []
    list.push(p)
    map.set(p.exam, list)
  }
  return map
}

/** Human-readable verification summary used in the UI. */
export function presetVerificationText(p: OfficialSpecPreset): string {
  if (p.verified) {
    return [
      `Verified against: ${p.organization}`,
      `Notification Year: ${p.notificationYear ?? "—"}`,
      `Last Verified: ${p.lastVerified ?? "—"}`,
      `Official Source: ${p.sourceUrl ?? "—"}`,
    ].join(" · ")
  }
  return "Official specification awaiting verification."
}
