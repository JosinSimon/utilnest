import html2pdf from "html2pdf.js"

/**
 * Document printing and downloading helpers for document generators.
 * Supports direct high-DPI client-side PDF generation, HTML downloads, and print dialogs.
 */

/** Download the document directly as a PDF file (.pdf). */
export function downloadPdf(elementId: string, fileName: string): void {
  const el = document.getElementById(elementId)
  if (!el) {
    alert("Document element not found for PDF download.")
    return
  }

  const pdfFileName = fileName.endsWith(".pdf") ? fileName : `${fileName.replace(/\.(html|pdf)$/i, "")}.pdf`

  const opt = {
    margin: [8, 8, 8, 8],
    filename: pdfFileName,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, logging: false },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  }

  html2pdf().set(opt).from(el).save()
}

/** Trigger window.print() scoped to a specific element. */
export function printDocument(elementId: string): void {
  const el = document.getElementById(elementId)
  if (!el) {
    alert("Document element not found for printing.")
    return
  }

  const innerContent = el.innerHTML
  const win = window.open("", "_blank", "width=950,height=800")
  if (!win) {
    alert("Please allow popups for this site to enable document printing.")
    return
  }

  win.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Print Document</title>
<style>
  ${getPrintStyles()}
</style>
</head>
<body>
${innerContent}
<script>
  window.onload = function() {
    setTimeout(function() {
      window.focus();
      window.print();
    }, 250);
  };
  window.onafterprint = function() {
    window.close();
  };
</script>
</body>
</html>`)
  win.document.close()
}

/** Download the document as a standalone HTML file. */
export function downloadDocument(elementId: string, fileName: string): void {
  const el = document.getElementById(elementId)
  if (!el) {
    alert("Document element not found for download.")
    return
  }

  const innerContent = el.innerHTML
  const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${fileName.replace(".html", "")}</title>
<style>
  ${getPrintStyles()}
</style>
</head>
<body>
${innerContent}
</body>
</html>`

  const blob = new Blob([fullHtml], { type: "text/html;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

/** Complete CSS injected into standalone HTML windows and files. */
function getPrintStyles(): string {
  return `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      font-size: 13px;
      line-height: 1.5;
      color: #111827;
      background: #fff;
      padding: 32px;
      max-width: 850px;
      margin: 0 auto;
    }

    img { max-width: 100%; height: auto; }

    /* Layout Utility Emulation for standalone HTML files */
    .flex { display: flex !important; }
    .flex-row { flex-direction: row !important; }
    .flex-col { flex-direction: column !important; }
    .justify-between { justify-content: space-between !important; }
    .justify-end { justify-content: flex-end !important; }
    .items-start { align-items: flex-start !important; }
    .items-center { align-items: center !important; }
    .items-end { align-items: flex-end !important; }
    .w-full { width: 100% !important; }
    .w-1\\/2 { width: 50% !important; }
    .w-2\\/5 { width: 40% !important; }
    .w-48 { width: 12rem !important; }
    .max-h-16 { max-height: 64px !important; width: auto !important; object-fit: contain !important; }
    
    .grid { display: grid !important; }
    .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
    .gap-2 { gap: 0.5rem !important; }
    .gap-3 { gap: 0.75rem !important; }
    .gap-4 { gap: 1rem !important; }

    .text-right { text-align: right !important; }
    .text-center { text-align: center !important; }
    .text-left { text-align: left !important; }
    .font-bold { font-weight: 700 !important; }
    .font-semibold { font-weight: 600 !important; }
    .font-medium { font-weight: 500 !important; }
    .font-mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace !important; }
    .uppercase { text-transform: uppercase !important; }
    .capitalize { text-transform: capitalize !important; }
    .tracking-wider { letter-spacing: 0.05em !important; }

    .text-xs { font-size: 0.75rem !important; line-height: 1rem !important; }
    .text-sm { font-size: 0.875rem !important; line-height: 1.25rem !important; }
    .text-base { font-size: 1rem !important; line-height: 1.5rem !important; }
    .text-lg { font-size: 1.125rem !important; line-height: 1.75rem !important; }
    .text-xl { font-size: 1.25rem !important; line-height: 1.75rem !important; }
    .text-2xl { font-size: 1.5rem !important; line-height: 2rem !important; }
    .text-3xl { font-size: 1.875rem !important; line-height: 2.25rem !important; }
    .text-4xl { font-size: 2.25rem !important; line-height: 2.5rem !important; }

    .text-gray-400 { color: #9ca3af !important; }
    .text-gray-500 { color: #6b7280 !important; }
    .text-gray-600 { color: #4b5563 !important; }
    .text-gray-700 { color: #374151 !important; }
    .text-gray-800 { color: #1f2937 !important; }
    .text-gray-900 { color: #111827 !important; }
    .text-red-600 { color: #dc2626 !important; }

    .bg-gray-50 { background-color: #f9fafb !important; }
    .bg-gray-100 { background-color: #f3f4f6 !important; }
    .bg-gray-800 { background-color: #1f2937 !important; }
    .bg-gray-900 { background-color: #111827 !important; }
    .text-white { color: #ffffff !important; }

    .p-2 { padding: 0.5rem !important; }
    .p-3 { padding: 0.75rem !important; }
    .p-4 { padding: 1rem !important; }
    .p-6 { padding: 1.5rem !important; }
    .p-8 { padding: 2rem !important; }
    .px-2 { padding-left: 0.5rem !important; padding-right: 0.5rem !important; }
    .px-3 { padding-left: 0.75rem !important; padding-right: 0.75rem !important; }
    .py-2 { padding-top: 0.5rem !important; padding-bottom: 0.5rem !important; }
    .py-3 { padding-top: 0.75rem !important; padding-bottom: 0.75rem !important; }
    .pb-2 { padding-bottom: 0.5rem !important; }
    .pb-4 { padding-bottom: 1rem !important; }
    .pb-6 { padding-bottom: 1.5rem !important; }
    .pt-2 { padding-top: 0.5rem !important; }
    .pt-4 { padding-top: 1rem !important; }
    .pt-6 { padding-top: 1.5rem !important; }

    .mb-1 { margin-bottom: 0.25rem !important; }
    .mb-2 { margin-bottom: 0.5rem !important; }
    .mb-4 { margin-bottom: 1rem !important; }
    .mb-6 { margin-bottom: 1.5rem !important; }
    .mb-8 { margin-bottom: 2rem !important; }
    .mb-12 { margin-bottom: 3rem !important; }
    .mt-1 { margin-top: 0.25rem !important; }
    .mt-2 { margin-top: 0.5rem !important; }
    .mt-4 { margin-top: 1rem !important; }
    .mt-8 { margin-top: 2rem !important; }
    .mt-12 { margin-top: 3rem !important; }
    .mt-16 { margin-top: 4rem !important; }
    .pr-8 { padding-right: 2rem !important; }

    .border { border: 1px solid #e5e7eb !important; }
    .border-b { border-bottom: 1px solid #e5e7eb !important; }
    .border-b-2 { border-bottom: 2px solid #e5e7eb !important; }
    .border-t { border-top: 1px solid #e5e7eb !important; }
    .border-y-2 { border-top: 2px solid #1f2937 !important; border-bottom: 2px solid #1f2937 !important; }
    .border-gray-200 { border-color: #e5e7eb !important; }
    .border-gray-400 { border-color: #9ca3af !important; }
    .border-gray-800 { border-color: #1f2937 !important; }
    .rounded { border-radius: 0.25rem !important; }
    .rounded-sm { border-radius: 0.125rem !important; }
    .rounded-md { border-radius: 0.375rem !important; }
    .rounded-lg { border-radius: 0.5rem !important; }
    .rounded-full { border-radius: 9999px !important; }

    table { width: 100% !important; border-collapse: collapse !important; margin-bottom: 1.5rem !important; }
    th, td { text-align: left; }

    .whitespace-pre-wrap { white-space: pre-wrap !important; }
    .relative { position: relative !important; }
    .absolute { position: absolute !important; }
    .bottom-4 { bottom: 1rem !important; }
    .left-0 { left: 0 !important; }
    .right-0 { right: 0 !important; }

    @media print {
      body { padding: 0; max-width: 100%; }
      @page { margin: 12mm; size: A4; }
    }
  `
}
