import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "quotation-generator",
  name: "Quotation Generator",
  slug: "quotation-generator",
  category: "business",
  path: "business/quotation-generator",
  shortDescription:
    "Create a price quotation with line items, discounts and GST (CGST + SGST or IGST), a validity date and terms. Print it or download a PDF.",
  longDescription:
    "Make a clear price quote for a client before you start work or ship goods. Add as many line items as you need with quantity, rate, discount and GST rate, choose intra-state or inter-state supply, and the quotation works out the taxable amount, GST split, round-off and grand total in figures and words. Set a valid-until date, add your terms, then print or save it as an A4 PDF. It all runs in your browser.",
  sections: [
    {
      heading: "How the quotation total is calculated",
      body: "Each line is worked out on its own. Line amount = Quantity × Price. Discount = Line amount × Discount % ÷ 100. Taxable value = Line amount − Discount. GST = Taxable value × GST rate ÷ 100. The quotation then adds up all lines: Subtotal, Discount, Taxable Amount, GST, and a Grand Total rounded to the nearest rupee, with the round-off shown on its own line. Example: 10 office chairs at ₹4,500 with 10% off is ₹45,000 − ₹4,500 = ₹40,500 taxable, plus 18% GST of ₹7,290.",
    },
    {
      heading: "CGST + SGST or IGST",
      body: "Under GST, a sale within the same state is intra-state, and the tax is split equally into CGST and SGST. A sale to a buyer in another state is inter-state, and the full tax is charged as IGST. Choose the supply type once and every line follows it. For a ₹42,500 taxable quote at 18%, intra-state shows CGST ₹3,825 + SGST ₹3,825, while inter-state shows IGST ₹7,650. The total is the same either way. If you are not GST registered, set the GST rate to 0% on each line.",
    },
    {
      heading: "Quotation, estimate, proforma invoice or tax invoice?",
      body: "A quotation is a firm offer: these items, at these prices, until this date. An estimate is a rough guess that may change once work starts. A proforma invoice is a draft bill sent before supply, often so the buyer can arrange payment or approvals. None of these is a tax invoice, and GST is not due on them. The tax invoice is issued when goods are supplied or services are billed. Once your client accepts the quote, use the Invoice Generator with the same items to bill them.",
    },
    {
      heading: "Terms worth adding",
      body: "Short, specific terms prevent most disputes. Useful ones: how long the prices are valid (the tool defaults to 30 days from today), advance required and payment schedule, delivery or completion time, whether transport, installation or taxes are included, warranty, and what is not covered. For example: \"50% advance with order, balance before dispatch. Delivery in 10 working days. Freight extra at actuals.\" The Notes & Terms box keeps your line breaks, so each term can sit on its own line.",
    },
    {
      heading: "Mistakes to avoid",
      body: "Do not mix GST-inclusive and GST-exclusive prices. Enter prices before GST, because the tool adds GST on top. Check the GST rate for each item, as rates differ by product and service and can change. Use a new quote number for every revised quote, such as QUO-014-R1, so the client knows which one is current. And make sure the valid-until date is realistic if your own supplier prices move often.",
    },
  ],
  examples: [
    {
      title: "Furniture order, same state",
      input: "10 chairs × ₹4,500 at 10% off + installation ₹2,000 · 18% GST · intra-state",
      output: "Taxable ₹42,500 · CGST ₹3,825 + SGST ₹3,825 · Grand total ₹50,150",
    },
    {
      title: "Bulk order to another state",
      input: "10 units × ₹1,250 at 5% off · 18% GST · inter-state",
      output: "Taxable ₹11,875 · IGST ₹2,137.50 · Grand total ₹14,012.50",
    },
    {
      title: "Total with round-off",
      input: "3 units × ₹333 · 18% GST · intra-state",
      output: "Taxable ₹999 · GST ₹179.82 · Round off ₹0.18 · Grand total ₹1,179",
    },
  ],
  primaryKeyword: "quotation generator",
  keywords: [
    "quotation maker",
    "quotation format",
    "quotation format with gst",
    "business quotation",
    "price quotation generator",
    "estimate generator",
    "quotation pdf",
    "free quotation maker online",
    "sales quotation format india",
  ],
  searchAliases: ["quote maker", "estimate generator", "price quote", "estimate maker", "quotation format", "proposal price quote"],
  searchWeight: 78,
  relatedTools: ["invoice-generator", "gst-calculator", "discount-calculator", "number-to-words"],
  featured: false,
  trending: false,
  popular: false,
  addedAt: "2026-08-10",
  lastUpdated: "2026-11-11",
  schemaType: "Generator",
  icon: "clipboard-list",
  faq: [
    {
      question: "What should a quotation include?",
      answer:
        "Your business name and contact details, GSTIN if registered, the client's name and address, a quote number, the quote date and valid-until date, an item list with quantity, rate, discount and GST, the total in figures and words, and your terms.",
    },
    {
      question: "Should a quotation show GST?",
      answer:
        "It is good practice, so the client sees the full amount they will pay. This tool adds GST per line and splits it into CGST and SGST for intra-state supply or shows IGST for inter-state supply. GST itself is charged on the tax invoice, not on the quote.",
    },
    {
      question: "What is the difference between a quotation and an invoice?",
      answer:
        "A quotation is an offer made before the sale. An invoice is the bill raised after the client agrees and you supply the goods or services. Once a quote is accepted, create the invoice with the Invoice Generator.",
    },
    {
      question: "How long is a quotation valid?",
      answer:
        "As long as you say it is. The tool sets the valid-until date 30 days from today, and you can change it. Shorter validity suits items whose prices change often.",
    },
    {
      question: "Can I add multiple items with different GST rates?",
      answer:
        "Yes. Click Add Item for each row and pick the GST rate per line (0%, 3%, 5%, 18% or 40%, plus 12% and 28% for older rates). Each line is taxed at its own rate and the totals add up all lines.",
    },
    {
      question: "Is my quotation saved or uploaded?",
      answer:
        "No. Everything stays in your browser and the form clears when you refresh, so download the PDF once you are done.",
    },
  ],
  howTo: [
    {
      title: "Enter both parties",
      description: "Add your business name, GSTIN, address, phone and email, then the client's name, GSTIN, address and phone.",
    },
    {
      title: "Set quote details",
      description: "Set the quote number, date and valid-until date, and choose intra-state (CGST + SGST) or inter-state (IGST).",
    },
    {
      title: "Add line items",
      description: "For each item enter a description, quantity, price before GST, discount % and GST rate. Totals update instantly.",
    },
    {
      title: "Add terms and export",
      description: "Write your payment, delivery and validity terms, check the preview, then click Print or Download PDF.",
    },
  ],
  engine: "calculator",
  privacyNote: "none",
}
