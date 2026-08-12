# UtilNest Sitewide SEO Strategy

## Goal

Make every UtilNest tool page indexable, rich-result ready, internally discoverable, and targeted to India-first long-tail searches before competing for broad head terms.

## Core rules for every tool

- One indexable, prerendered HTML page per tool.
- Title starts with the primary search intent, not the brand.
- Title length target: 25-75 characters including `| UtilNest`.
- Meta description target: 50-165 characters.
- Canonical must match `/category/{category}/{slug}`.
- JSON-LD must include WebApplication, BreadcrumbList, FAQPage, and HowTo when visible on page.
- FAQ JSON-LD must match visible FAQ copy.
- Tool content must include: H1, long intro, how-to, examples where useful, FAQ, related tools, category links, and last updated date.
- Prefer India-specific copy where the query has Indian intent: Rupees, GST, government forms, exam upload limits, FY/AY tax years, UPI, CTC, Indian passport dimensions.

## Traffic strategy

Prioritize pages by ranking difficulty:

1. Government/document upload pages
   - compress image to 20KB / 50KB / 100KB
   - resize signature 140x60
   - NEET photo size 2026
   - IBPS photo signature size
   - SSC signature resize
   - Aadhaar/PAN photo resize

2. Finance calculators for India
   - EMI calculator India
   - home loan EMI calculator
   - car loan EMI calculator
   - GST calculator
   - income tax calculator FY 2026-27
   - SIP/FD/PPF/RD calculators

3. PDF upload-limit pages
   - compress PDF below 100KB
   - compress PDF below 200KB
   - compress PDF below 500KB
   - PDF to JPG online
   - images to PDF online

4. Image conversion pages
   - JPG to PNG
   - PNG to JPG
   - WebP to PNG
   - JPG to WebP

5. Business and utility pages
   - GST invoice generator
   - quotation generator
   - receipt generator
   - QR code generator for UPI
   - password generator

## Implementation notes

- Current systemic SEO guard lives in `src/components/seo/seo-data.test.ts`.
- Shared category FAQ copy lives in `src/data/category-faqs.ts` so visual FAQs and prerendered schema stay in sync.
- Shared OG fallback is `public/og/default.svg` and `site.defaultOgImage`.
- `public/llms.txt` exists for AI crawler discovery.
- `public/ads.txt` is intentionally placeholder-only until the real AdSense publisher ID is known.

## Next content expansion

Create dedicated exact-intent pages where one generic tool targets multiple high-volume queries. Reuse the same engines, but give each route its own H1, title, FAQ, default settings, and canonical.

Suggested first expansion:

- `/category/image/jpg-to-png`
- `/category/image/png-to-jpg`
- `/category/image/webp-to-png`
- `/category/pdf/compress-pdf-below-200kb`
- `/category/image/compress-image-to-50kb`
- `/category/government/signature-resize-140x60`
- `/category/finance/home-loan-emi-calculator`
