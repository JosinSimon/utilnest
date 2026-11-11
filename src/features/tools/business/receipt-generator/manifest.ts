import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "receipt-generator",
  name: "Receipt Generator",
  slug: "receipt-generator",
  category: "business",
  path: "business/receipt-generator",
  shortDescription:
    "Make a payment receipt for cash, UPI, card, bank transfer or cheque. Amount in words is added for you. Print it or download a PDF free.",
  longDescription:
    "Create a simple payment receipt that confirms you have received money from someone. Fill in your business details, the payer's name, the amount and how they paid, and the receipt shows the amount in figures and in Indian words (lakh, thousand, rupees and paise). Print it or save it as an A4 PDF. Everything happens in your browser and nothing is uploaded.",
  sections: [
    {
      heading: "What a payment receipt should show",
      body: "A clear receipt answers five questions: who received the money, who paid it, how much, when, and for what. This generator covers each one: your business name, address and phone; the payer's name under Received From; a receipt number and date; the amount in figures and words; the payment method; and a For Payment Of line. Add a reference number such as a UPI transaction ID, bank UTR or cheque number so both sides can match the payment later. A signature line is printed at the bottom for you to sign by hand.",
    },
    {
      heading: "Receipt vs invoice: which one do you need?",
      body: "An invoice asks for payment. A receipt confirms that payment has already been made. A freelancer usually sends an invoice first and then a receipt once the client pays. Shopkeepers often hand over only a receipt because the sale and payment happen together. This tool makes a plain acknowledgement receipt with no tax breakup. If you are GST registered and need to show taxable value, CGST, SGST or IGST, use the Invoice Generator instead. For advance payments, GST has its own receipt voucher format, so check with your accountant if that applies to you.",
    },
    {
      heading: "Common uses in India",
      body: "People use payment receipts for house rent, tuition and coaching fees, society maintenance, freelance and repair work, event bookings, token or advance money, and small shop sales. For a rent receipt, write the month and property in the description, for example \"Rent for October 2026, Flat 3B, Andheri\", and choose the payment method used. Employers that ask for rent receipts for HRA often also want the landlord's PAN when yearly rent is above ₹1,00,000. The tool has no PAN field, so add it in the Notes box if you need it.",
    },
    {
      heading: "Numbering and record keeping",
      body: "Give every receipt its own number and never reuse one. The default is RCT-001, but a format with the year, such as RCT-2026-014, is easier to sort and search. Keep a copy of every receipt you issue, along with the bank statement or UPI history that shows the money arriving. Nothing you type here is saved, so download the PDF before you close or refresh the page. If you issue receipts often, keep a simple spreadsheet of the number, date, payer and amount next to your saved PDFs.",
    },
    {
      heading: "Cash receipts and revenue stamps",
      body: "Cash leaves no bank trail, so a signed receipt matters most when you are paid in cash. Write the exact amount, check the amount in words, and sign the printed copy. Some offices and landlords still expect a revenue stamp on cash receipts above ₹5,000, so check what the other party needs before you hand it over. For UPI, card and bank transfers, the transaction ID in the reference field is usually the most useful proof.",
    },
  ],
  examples: [
    {
      title: "Monthly rent paid by UPI",
      input: "₹15,000 · UPI · \"Rent for October 2026\" · Ref: UPI transaction ID",
      output: "Receipt for ₹15,000 with \"Fifteen Thousand Rupees Only\" in words",
    },
    {
      title: "Cash payment with paise",
      input: "₹2,499.50 · Cash · \"Tuition fees, November 2026\"",
      output: "Amount in words: \"Two Thousand Four Hundred Ninety Nine Rupees and Fifty Paise Only\"",
    },
    {
      title: "Advance paid by cheque",
      input: "₹3,50,000 · Cheque · Ref: cheque number",
      output: "Amount in words: \"Three Lakh Fifty Thousand Rupees Only\"",
    },
  ],
  primaryKeyword: "receipt generator",
  keywords: [
    "payment receipt generator",
    "receipt maker online",
    "cash receipt format",
    "rent receipt generator",
    "money receipt format india",
    "upi payment receipt",
    "payment receipt pdf",
    "free receipt maker",
    "advance payment receipt",
  ],
  searchAliases: ["receipt maker", "payment receipt", "cash receipt", "rent receipt", "money receipt", "payment acknowledgement"],
  searchWeight: 75,
  relatedTools: ["invoice-generator", "quotation-generator", "number-to-words", "hra-calculator"],
  featured: false,
  trending: false,
  popular: false,
  addedAt: "2026-08-10",
  lastUpdated: "2026-11-11",
  schemaType: "Generator",
  icon: "receipt",
  faq: [
    {
      question: "What should a payment receipt include?",
      answer:
        "The name of the person or business receiving the money, the payer's name, a receipt number, the date, the amount in figures and words, the payment method, what the payment was for, and a signature. A transaction or cheque number helps both sides match the payment.",
    },
    {
      question: "Is this receipt legally valid?",
      answer:
        "It is a standard acknowledgement that you received a payment, and it is valid as a record when the details are correct and it is signed. It is not a GST tax invoice. If you need to show GST, use the Invoice Generator.",
    },
    {
      question: "Can I use it as a rent receipt for HRA?",
      answer:
        "Yes. Put the landlord as the business name, yourself as the payer, and the month and address in the description, then get it signed. If your employer asks for the landlord's PAN, add it in the Notes field.",
    },
    {
      question: "Does it write the amount in words automatically?",
      answer:
        "Yes. The amount is converted to Indian words with rupees and paise and \"Only\" at the end, for example ₹1,500.05 becomes \"One Thousand Five Hundred Rupees and Five Paise Only\".",
    },
    {
      question: "Can I add my logo or GST to the receipt?",
      answer:
        "No. This is a simple receipt with business name, address and phone only. The Invoice Generator supports a logo, GSTIN and GST calculation.",
    },
    {
      question: "Is my data stored anywhere?",
      answer:
        "No. The receipt is built in your browser and nothing is uploaded or saved. Download the PDF before you leave the page, because the form clears when you refresh.",
    },
  ],
  howTo: [
    {
      title: "Add your details",
      description: "Enter your business or personal name, address and phone. These appear at the top of the receipt.",
    },
    {
      title: "Enter the payment",
      description: "Type the payer's name, receipt number, date and amount, then pick Cash, UPI, Card, Bank Transfer, Cheque or Other.",
    },
    {
      title: "Describe what it was for",
      description: "Fill in the purpose, plus a UTR, UPI or cheque number and any notes. The preview updates as you type.",
    },
    {
      title: "Print or download",
      description: "Check the amount in words, then click Print or Download PDF and sign the copy you hand over.",
    },
  ],
  engine: "calculator",
  privacyNote: "none",
}
