import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "invoice-generator",
  name: "Invoice Generator",
  slug: "invoice-generator",
  category: "business",
  path: "business/invoice-generator",
  shortDescription:
    "Free GST invoice maker for Indian businesses and freelancers. CGST + SGST or IGST, discounts, logo, bank and UPI details. Download a PDF.",
  longDescription:
    "Create a GST tax invoice in a few minutes. Add your logo, GSTIN, bank account and UPI ID, then list items with quantity, rate, discount and GST rate. The invoice works out the taxable amount, CGST and SGST (or IGST for inter-state sales), round-off and grand total, and writes the total in words. Print it or download an A4 PDF. Your details stay in your browser.",
  sections: [
    {
      heading: "How the invoice totals are worked out",
      body: "Each line item is calculated separately. Amount = Quantity × Rate. Discount = Amount × Discount % ÷ 100. Taxable value = Amount − Discount. GST = Taxable value × GST rate ÷ 100. The summary shows Subtotal, Total Discount, Taxable Amount, the GST split, a Round Off line and the Grand Total rounded to the nearest rupee. Example: website design billed at ₹25,000 with 18% GST inside the same state gives CGST ₹2,250 + SGST ₹2,250 and a total of ₹29,500.",
    },
    {
      heading: "CGST + SGST vs IGST",
      body: "Pick the supply type once in the Invoice tab. Intra-state means the buyer is in the same state as you, so GST is split equally into CGST and SGST. Inter-state means the buyer is in another state, so the full tax is charged as IGST. The total tax is the same either way: on ₹11,875 at 18%, it is CGST ₹1,068.75 + SGST ₹1,068.75, or IGST ₹2,137.50. If your client is not GST registered, the same rule applies based on where the supply goes.",
    },
    {
      heading: "Details a GST invoice usually needs",
      body: "A tax invoice commonly shows: your name, address and GSTIN; a unique invoice number and date; the buyer's name, address and GSTIN if registered; a description of each item; quantity; taxable value; GST rate and amount; and a signature. This generator covers all of these. It does not have separate HSN/SAC code or place-of-supply fields, so if your invoice needs them, add the code in the item description (for example \"Web design, SAC 998314\") and the place of supply in Notes. Rules change, so confirm the current requirements with your accountant.",
    },
    {
      heading: "Invoice numbering tips",
      body: "Use a fresh, unique number for every invoice and keep them in order. Many businesses restart the series each financial year, for example INV/26-27/001. GST rules limit the invoice number to 16 characters, so keep the prefix short. Never reuse or skip numbers to hide a cancelled bill. Issue a credit note for that instead. The default here is INV-001 and you can type any format you like.",
    },
    {
      heading: "If you are not registered under GST",
      body: "Freelancers and small sellers below the registration limit should not charge GST. Leave the GSTIN fields blank and set every line's GST rate to 0%, so the invoice shows only the taxable amount and total. The heading on this generator always reads \"Tax Invoice\", so check with your accountant whether a plain invoice title suits your case. Add your bank account, IFSC and UPI ID in the Business tab so clients know how to pay.",
    },
    {
      heading: "Logo, payment details and PDF",
      body: "Upload a PNG or JPG logo up to 200 KB. It is read in your browser and never uploaded. Bank name, account number, IFSC and UPI ID print in a Payment Details box, and the total appears in Indian words, for example \"Twenty Nine Thousand Five Hundred Rupees Only\". Download PDF saves an A4 file. Print opens a print window, so allow pop-ups if nothing appears. Nothing is saved, so download the PDF before you close the tab.",
    },
  ],
  examples: [
    {
      title: "Freelance service, same state",
      input: "Website design · 1 × ₹25,000 · 18% GST · intra-state",
      output: "CGST ₹2,250 + SGST ₹2,250 · Grand total ₹29,500",
    },
    {
      title: "Goods sold to another state",
      input: "10 units × ₹1,250 · 5% discount · 18% GST · inter-state",
      output: "Discount ₹625 · Taxable ₹11,875 · IGST ₹2,137.50 · Grand total ₹14,012.50",
    },
    {
      title: "Mixed GST rates with round-off",
      input: "2 × ₹1,499 at 5% + 1 × ₹850 at 18% · intra-state",
      output: "Taxable ₹3,848 · GST ₹302.90 · Round off ₹0.10 · Grand total ₹4,151",
    },
  ],
  primaryKeyword: "invoice generator",
  keywords: [
    "gst invoice generator",
    "free invoice maker",
    "invoice format india",
    "tax invoice generator",
    "online invoice creator",
    "gst bill format",
    "gst invoice format in pdf",
    "freelancer invoice india",
    "invoice with cgst sgst igst",
    "bill generator online",
  ],
  searchAliases: ["bill maker", "tax invoice maker", "gst bill generator", "invoice maker", "bill format", "gst invoice pdf"],
  searchWeight: 95,
  relatedTools: ["gst-calculator", "number-to-words", "discount-calculator", "quotation-generator", "receipt-generator"],
  featured: true,
  trending: true,
  popular: true,
  addedAt: "2026-08-10",
  lastUpdated: "2026-11-11",
  schemaType: "Generator",
  icon: "file-text",
  faq: [
    {
      question: "Does this invoice calculate GST correctly?",
      answer:
        "Yes. It adds GST to each line's taxable value and splits it into CGST and SGST for intra-state sales or shows IGST for inter-state sales. You choose the GST rate per item, so check the current rate for what you sell.",
    },
    {
      question: "How do I make a GST invoice?",
      answer:
        "Enter your business details and GSTIN, the customer's details, an invoice number and date, and the supply type. Then add each item with quantity, rate, discount and GST rate. Check the preview and download the PDF.",
    },
    {
      question: "Can I add HSN or SAC codes?",
      answer:
        "There is no separate HSN/SAC column. You can type the code into the item description, for example \"Laptop bag, HSN 4202\", and it will print on the invoice.",
    },
    {
      question: "Can I make an invoice without GST?",
      answer:
        "Yes. Leave the GSTIN blank and set the GST rate to 0% on every line. The invoice then shows only the amounts and total. Note that the heading always reads \"Tax Invoice\".",
    },
    {
      question: "Can I add my logo and bank details?",
      answer:
        "Yes. Upload a PNG or JPG logo up to 200 KB and fill in bank name, account number, IFSC and UPI ID. They appear on the invoice and in the PDF.",
    },
    {
      question: "Is my invoice data uploaded or saved?",
      answer:
        "No. Everything, including your logo, stays in your browser. Nothing is saved after you refresh, so download the PDF before closing the page.",
    },
  ],
  howTo: [
    {
      title: "Fill the Business tab",
      description: "Upload your logo, enter your business name, GSTIN, address, phone, email, and bank or UPI details.",
    },
    {
      title: "Fill the Customer tab",
      description: "Add the customer's name, GSTIN if they have one, address, phone and email.",
    },
    {
      title: "Set invoice details",
      description: "Enter the invoice number, invoice and due dates, supply type (intra-state or inter-state), notes and terms.",
    },
    {
      title: "Add items and download",
      description: "Add each item with quantity, rate, discount and GST rate, check the totals, then click Download PDF or Print.",
    },
  ],
  engine: "calculator",
  privacyNote: "none",
}
