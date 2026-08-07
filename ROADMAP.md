# Tool Roadmap

Progress tracker for all planned tools. Build order: **Text → Government Forms → Image → PDF**.

Legend: ✅ live & tested · 🚧 in progress · ⏳ planned

## Category: Text (10 tools)

| # | Tool | Status | Notes |
|---|------|--------|-------|
| 1 | Word Counter | ✅ | Engine + 62 finance tests total pass; ships reading time + keywords |
| 2 | Character Counter | ✅ | Grapheme-safe via `Intl.Segmenter` |
| 3 | Line Counter | ✅ | CRLF-aware via shared `splitLines` helper |
| 4 | Case Converter | ✅ | 9 modes incl. Title, Sentence, camelCase, snake_case, kebab-case |
| 5 | Remove Duplicate Lines | ✅ | Optional case-insensitive mode |
| 6 | Remove Extra Spaces | ✅ | Trim ends + collapse internal, toggleable |
| 7 | Text Sorter | ✅ | Alpha / reverse / numeric + remove-duplicates toggle |
| 8 | Reverse Text | ✅ | Characters / words / lines modes |
| 9 | Random Text Generator | ✅ | Words / sentences / paragraphs, deterministic seed |
| 10 | Find & Replace | ✅ | Case-sensitive + whole-word toggles, literal (non-regex) search |

Future text ideas: Markdown preview, Lorem Ipsum, keyword density, diff view.

## Category: Government Forms (10 tools)

| # | Tool | Status |
|---|------|--------|
| 1 | Govt Form Image Resizer (SSC / UPSC / PSC / IBPS) | ✅ Preset pipeline live |
| 2 | Passport Photo Maker | ✅ 3.5×3.5 cm @ DPI, white-bg warning |
| 3 | Signature Resizer | ✅ SSC / NEET / IBPS signature presets |
| 4 | Compress Image to 20 / 50 / 100 KB | ✅ Engine + 2 tools live (Vitest 41, Playwright 3) |
| 5 | Resize Image to Exact Pixels | ✅ Same engine shares pipeline |
| 6 | Exam Presets (NEET / JEE / SSC) | ✅ Preset picker (photo) — verified:false until official |
| 7 | Aadhaar / PAN Resizer | ✅ 3.5cm-based presets — verified:false |
| 8 | Document Scanner | ✅ Image→PDF via pdf-lib (lives in tool, not engine) |
| 9 | Exam Preset: SSC CGL & others | ⏳ merged into #1/#6 |
| 10 | (reserve) | ⏳ |

Phase 2 notes: shared `shared/image` engine (geometry/specs/validator/metadata/encoder/compressor/presetPipeline) + impure `driver.ts`. Government presets always `allowDownscale:false` (never silently shrink to fit) and report `cannotHitTarget`/`cannotHitMin` honestly. `/verify` specs only after official-source validation. Passport/Aadhaar/PAN presets are cm-dimensioned, resolved to px at a fixed sensible DPI (300); DPI is hidden from the UI. NEET UG + IBPS presets verified against official sources (`lastVerified` in `specs.ts`, log in `VERIFICATION.md`); SSC unverified (photo now live-capture only). Tool scopes are disjoint so no preset appears in two tools.

## Category: Image (10 tools)

| # | Tool | Status |
|---|------|--------|
| 1 | Image Compressor | ✅ KB presets (20/50/100/200/500) via shared binary-search engine |
| 2 | Image Resizer | ✅ exact px, aspect preserved, JPEG/PNG |
| 3 | Image Cropper | ✅ draggable box + aspect presets (1:1, 4:3, 3:2, 16:9), JPG/PNG |
| 4 | JPG ⇔ PNG ⇔ WebP Converter | ✅ quality slider, all three formats |
| 5 | DPI Converter | ✅ byte-level JFIF/pHYs rewrite (72/96/150/200/300/600 + custom) |
| 6 | Background Remover (API / local later) | ⏳ |
| 7 | Image ↔ Base64 | ✅ encode image→data URL, decode base64→file with mime sniffing |
| 8 | Watermark | ✅ text + logo overlay, position/opacity/size, JPEG/PNG |
| 9 | Dimensions Checker | ✅ reads W×H, aspect, MP, format, DPI straight from bytes |
| 10 | (reserve) | ⏳ |

Future image ideas: blur / sharpen, AI upscaler, HEIC conversion.

## Category: PDF (10 tools)

| # | Tool | Status |
|---|------|--------|
| 1 | Merge PDFs | ⏳ |
| 2 | Split PDF | ⏳ |
| 3 | Compress PDF | ⏳ |
| 4 | JPG ↔ PDF | ⏳ |
| 5 | PDF → JPG | ⏳ |
| 6 | Rotate PDF | ⏳ |
| 7 | Delete / Extract / Reorder Pages | ⏳ |
| 8 | Unlock Password (remove protection) | ⏳ |
| 9 | Protect PDF (password) | ⏳ |
| 10 | Word / Excel / PPT ↔ PDF | ⏳ |

Future PDF ideas: OCR for scanned documents.

## Status

- **Phase 1 (Text):** ✅ 10/10 tools live, 278 total tests passing, typecheck + lint + build green.
- **Phase 2 (Government Forms):** ✅ 8/8 tools live, 342 unit tests + 6 browser (Playwright) tests passing, tsc + lint + build green. NEET/IBPS presets verified; SSC/Pan/Aadhaar/passport await official confirmation (backlog).
- **Phase 3 (Image):** 🚧 8/10 tools live (Compressor, Resizer, Cropper, JPG/PNG/WebP Converter, Image↔Base64, DPI Converter, Watermark, Dimensions Checker). Reuses the Phase 2 shared `shared/image` engine. DPI converter rewrites JFIF/pHYs bytes (no resampling) and drives CRC32 for PNG. Remaining: background remover (heavy).
- **Phase 4 (PDF):** after Image.
