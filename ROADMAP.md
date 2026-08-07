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
| 1 | Govt Form Image Resizer (SSC / UPSC / PSC / IBPS) | ⏳ |
| 2 | Passport Photo Maker | ⏳ |
| 3 | Signature Resizer | ⏳ |
| 4 | Compress Image to 20 / 50 / 100 KB | ✅ Engine + 2 tools live (Vitest 41, Playwright 3) |
| 5 | Resize Image to Exact Pixels | ✅ Same engine shares pipeline |
| 6 | Exam Presets (NEET / JEE / SSC) | ⏳ Engine presets (SSC CGL / NEET UG / IBPS, verified:false) |
| 7 | Aadhaar / PAN Resizer | ⏳ |
| 8 | Document Scanner | ⏳ PDF lives here, not in engine |
| 9 | Exam Preset: SSC CGL & others | ⏳ |
| 10 | (reserve) | ⏳ |

Phase 2a notes: shared `shared/image` engine (geometry/specs/validator/metadata/encoder/compressor) + impure `driver.ts`. Government presets always `allowDownscale:false` (never silently shrink to fit) and report `cannotHitTarget`/`cannotHitMin` honestly. `/verify` specs only after official-source validation.

## Category: Image (10 tools)

| # | Tool | Status |
|---|------|--------|
| 1 | Image Compressor | ⏳ |
| 2 | Image Resizer | ⏳ |
| 3 | Image Cropper | ⏳ |
| 4 | JPG ↔ PNG ↔ WebP Converter | ⏳ |
| 5 | DPI Converter (72 / 150 / 200 / 300) | ⏳ |
| 6 | Background Remover (API / local later) | ⏳ |
| 7 | Image ↔ Base64 | ⏳ |
| 8 | Watermark | ⏳ |
| 9 | Dimensions Checker | ⏳ |
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
- **Phase 2 (Government Forms):** next.
- **Phase 3 (Image):** after Government.
- **Phase 4 (PDF):** after Image.
