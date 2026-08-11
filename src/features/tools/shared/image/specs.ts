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
      "SSC CGL 2026 does NOT accept pre-shot photo uploads — photographs must be captured live via webcam/mobile (official app/QR) during One-Time Registration. A resize preset is therefore not applicable this cycle. Signature: 140×60 px (~4.0×2.0 cm), 10–20 KB, JPG — consistently reported but not yet confirmed directly on ssc.gov.in. Do not treat as authoritative.",
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
    dimensions: { width: 3.5, height: 4.5, unit: "cm" },
    kbMin: 10,
    kbMax: 200,
    acceptedFormats: ["jpeg"],
    preferredFormat: "jpeg",
    backgroundColor: "white",
    allowDownscale: false,
    sourceUrl:
      "https://cdnbbsr.s3waas.gov.in/s37bc1ec1d9c3426357e69acd5bf320061/uploads/2026/02/202602081576322299.pdf",
    notificationYear: 2026,
    lastVerified: "2026-08-07",
    verified: true,
    notes:
      "NTA Information Bulletin NEET (UG)-2026 p.16: recent passport-size photo in JPG/JPEG, 10–200 KB, 80% face (no mask) including ears, white background. NTA does not mandate pixel dimensions — the 3.5×4.5 cm reference is resolved at a selectable DPI.",
  },
  {
    id: "neet-ug-signature",
    exam: "NEET UG",
    organization: "National Testing Agency (NTA)",
    documentType: "signature",
    dimensions: { width: 3.5, height: 1.5, unit: "cm" },
    kbMin: 10,
    kbMax: 100,
    acceptedFormats: ["jpeg"],
    preferredFormat: "jpeg",
    backgroundColor: "white",
    allowDownscale: false,
    sourceUrl:
      "https://cdnbbsr.s3waas.gov.in/s37bc1ec1d9c3426357e69acd5bf320061/uploads/2026/02/202602081576322299.pdf",
    notificationYear: 2026,
    lastVerified: "2026-08-07",
    verified: true,
    notes:
      "NTA Information Bulletin NEET (UG)-2026 p.16: signature in JPG/JPEG, 10–100 KB, running hand on white paper. NTA does not mandate pixel dimensions; 3.5×1.5 cm is a common reference resolved at selectable DPI.",
  },
  {
    id: "passport-photo",
    exam: "Passport",
    organization: "Passport Seva (Ministry of External Affairs)",
    documentType: "photo",
    dimensions: { width: 3.5, height: 4.5, unit: "cm" },
    kbMin: 10,
    kbMax: 300,
    acceptedFormats: ["jpeg"],
    preferredFormat: "jpeg",
    backgroundColor: "white",
    allowDownscale: false,
    sourceUrl: "https://www.passportindia.gov.in",
    notificationYear: 2026,
    lastVerified: "2026-08-11",
    verified: true,
    notes:
      "Standard Indian Passport photograph size is 3.5cm x 4.5cm (35x45 mm) on a plain white background with face occupying 70-80% of the frame.",
  },
  {
    id: "ibps-po-photo",
    exam: "IBPS PO / Clerk",
    organization: "Institute of Banking Personnel Selection",
    documentType: "photo",
    dimensions: { width: 4.5, height: 3.5, unit: "cm" },
    kbMin: 20,
    kbMax: 50,
    acceptedFormats: ["jpeg"],
    preferredFormat: "jpeg",
    backgroundColor: "white",
    allowDownscale: false,
    sourceUrl:
      "https://www.ibps.in/wp-content/uploads/Detailed_Advt_CRP_PO_MT_XIV_2026.pdf",
    notificationYear: 2026,
    lastVerified: "2026-08-07",
    verified: true,
    notes:
      "IBPS PO/Clerk 2026 photo specification: 20–50 KB, JPEG, 4.5×3.5 cm (or 200×230 px at standard DPI), light/white background.",
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
    sourceUrl:
      "https://www.ibps.in/wp-content/uploads/Detailed_Advt_CRP_PO_MT_XIV_2026.pdf",
    notificationYear: 2026,
    lastVerified: "2026-08-07",
    verified: true,
    notes:
      "IBPS PO/Clerk 2026 signature specification: 10–20 KB, JPEG, 140×60 px, white paper with black ink.",
  },
  {
    id: "aadhaar-photo",
    exam: "Aadhaar",
    organization: "UIDAI",
    documentType: "photo",
    dimensions: { width: 3.5, height: 4.5, unit: "cm" },
    kbMin: 10,
    kbMax: 300,
    acceptedFormats: ["jpeg"],
    preferredFormat: "jpeg",
    backgroundColor: "white",
    allowDownscale: false,
    sourceUrl: "https://uidai.gov.in",
    notificationYear: 2026,
    lastVerified: "2026-08-11",
    verified: true,
    notes:
      "Standard passport size photo (3.5cm x 4.5cm) on a plain light/white background.",
  },
  {
    id: "pan-photo",
    exam: "PAN",
    organization: "Income Tax Department (Protean / NSDL & UTITSL)",
    documentType: "photo",
    dimensions: { width: 3.5, height: 2.5, unit: "cm" },
    kbMin: 10,
    kbMax: 50,
    acceptedFormats: ["jpeg"],
    preferredFormat: "jpeg",
    backgroundColor: "white",
    allowDownscale: false,
    sourceUrl: "https://www.protean-tinpan.com",
    notificationYear: 2026,
    lastVerified: "2026-08-11",
    verified: true,
    notes:
      "Online PAN application photograph is 3.5cm x 2.5cm on white background, max 50 KB in JPEG format.",
  },
  {
    id: "pan-signature",
    exam: "PAN",
    organization: "Income Tax Department (Protean / NSDL & UTITSL)",
    documentType: "signature",
    dimensions: { width: 4.5, height: 2.0, unit: "cm" },
    kbMin: 10,
    kbMax: 50,
    acceptedFormats: ["jpeg"],
    preferredFormat: "jpeg",
    backgroundColor: "white",
    allowDownscale: false,
    sourceUrl: "https://www.protean-tinpan.com",
    notificationYear: 2026,
    lastVerified: "2026-08-11",
    verified: true,
    notes:
      "Online PAN application signature is 4.5cm x 2.0cm on white paper, max 50 KB in JPEG format.",
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
