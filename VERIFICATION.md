# Specification Verification Log

Tracks how each government preset was (or wasn't) verified. Rule: **the official
notification or official application portal is the only source of truth.**
A preset is `verified: true` only when confirmed against a primary source
(`sourceUrl` + `notificationYear` + `lastVerified` set). Everything else stays
`verified: false` and the UI shows "Official specification awaiting verification."

Reviewed: **2026-08-07** for the 2026 exam cycle.

## Legend
- ✅ verified against primary official source
- ⚠️ partially confirmed / conflicting sources
- ❌ not verifiable (no official self-serve spec exists)

---

## NEET UG (NTA) — ✅ verified

| Field | Value | Source |
|---|---|---|
| Source | Information Bulletin NEET (UG)-2026, p.16 "Upload Scanned Images" | `https://cdnbbsr.s3waas.gov.in/s37bc1ec1d9c3426357e69acd5bf320061/uploads/2026/02/202602081576322299.pdf` |
| Photo format | JPG/JPEG | bulletin §d.i |
| Photo size | **10 KB – 200 KB** | bulletin §d.i |
| Photo dims | **Not specified by NTA.** Reference: recent passport-size (≈3.5×4.5 cm), 80% face incl. ears, white bg | bulletin §d.i |
| Signature format | JPG/JPEG | bulletin §d.ii |
| Signature size | **10 KB – 100 KB** (⚠️ our old 4–30 KB was wrong) | bulletin §d.ii |
| Signature dims | Not specified. Common reference ≈3.5×1.5 cm running hand | multiple sources |

**Correction applied:** signature `kbMin/kbMax` 4–30 → **10–100**. Photo + signature
dimensions switched to cm (passport-size) since NTA does not mandate pixels; the
tool resolves them at user-selectable DPI. `verified: true`.

---

## IBPS PO / Clerk (IBPS) — ✅ verified

| Field | Value | Source |
|---|---|---|
| Source | Official IBPS "Guidelines for Scanning & Uploading the Photograph & Signature" | `https://ibpsreg.ibps.in` (guidelines PDF), notification CRP PO/MT-XVI |
| Photo format | JPG/JPEG | guidelines |
| Photo dims | **200 × 230 pixels (preferred)** | guidelines |
| Photo size | **20 KB – 50 KB** | guidelines |
| Signature format | JPG/JPEG | guidelines |
| Signature dims | **140 × 60 pixels (preferred)** | guidelines |
| Signature size | **10 KB – 20 KB** | guidelines |
| Signature rules | black ink, white paper, running hand (NOT capitals) | guidelines |

Also requires live webcam/mobile photo capture during registration.
Presets already matched. `verified: true`.

---

## SSC CGL (SSC) — ⚠️ partially confirmed

| Field | Value | Source |
|---|---|---|
| Source | ssc.gov.in (portal is JS — text not directly fetchable) | `https://ssc.gov.in` |
| Photo | **No upload in 2026 — live capture only** (webcam/mobile via official app/QR). Pre-shot photos not accepted for new registrations. | ssc.gov.in notice via multiple sources |
| Signature format | JPG/JPEG | multiple sources |
| Signature dims | 140 × 60 px (~4.0 × 2.0 cm) | multiple independent sources (PW, SignResize, ResizeForForms) |
| Signature size | 10 KB – 20 KB | multiple independent sources |

**Decision:** photo preset kept `verified: false` — the 2026 flow is live capture,
so a "resize my photo" preset for SSC CGL is not applicable this cycle (note added).
Signature stays `verified: false` — values are consistent across sources but not
yet confirmed directly on ssc.gov.in. Re-check once the official notification text
is directly fetchable.

---

## Passport / Aadhaar / PAN — ❌ deferred (low value)

| Preset | Status | Reason |
|---|---|---|
| Passport photo (3.5×3.5 cm) | `verified: false` | Passport Seva portal is form-login based; no clean authoritative spec page fetchable. Size is widely cited as 3.5×3.5 cm. |
| Aadhaar photo | `verified: false` | **No official self-upload spec exists** — photos are captured at enrolment centres. Resizing is informational only. |
| PAN photo | `verified: false` | Commonly 3.5×3.5 cm but portal-specific; not confirmed on protean-tinpan.com. |

---

## Re-verification cadence
- Re-check SSC/NEET/IBPS **each exam cycle** when a new notification is released.
- Update `notificationYear`, `lastVerified`, and any changed values in `specs.ts`.
- `specs.test.ts` asserts that verified presets carry a real `sourceUrl` +
  `lastVerified`; flipping a preset back to unverified without a reason fails CI.
