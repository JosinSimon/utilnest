import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "number-to-words",
  name: "Number to Words Converter",
  slug: "number-to-words",
  category: "business",
  path: "business/number-to-words",
  shortDescription:
    "Convert any number or rupee amount into words in Indian (lakh, crore) or international (million, billion) format for cheques and invoices.",
  longDescription:
    "Type a number and get it written out in words straight away. Choose the Indian system (thousand, lakh, crore) or the international system (thousand, million, billion), and plain number or currency mode. Currency mode supports rupees and paise, dollars, euros, pounds, dirhams or your own currency names, and ends with \"Only\" as on cheques. Copy the result with one click.",
  sections: [
    {
      heading: "Indian vs international numbering",
      body: "The Indian system groups digits as thousand, lakh and crore: 1,00,000 is one lakh and 1,00,00,000 is one crore. The international system uses thousand, million and billion: 1,000,000 is one million. The conversions are fixed: 10 lakh = 1 million, 1 crore = 10 million, and 100 crore = 1 billion. So 12,45,678 reads \"Twelve Lakh Forty Five Thousand Six Hundred Seventy Eight\" in the Indian system and \"One Million Two Hundred Forty Five Thousand Six Hundred Seventy Eight\" in the international one. Pick the system your reader expects. Indian banks and documents use lakh and crore.",
    },
    {
      heading: "How to write a cheque amount in words",
      body: "Start the words close to the left edge of the line, and write the currency and \"Only\" so nothing can be added later: \"Rupees Three Lakh Fifty Thousand Only\". Make sure the words and the figure in the box match exactly, because a mismatch can lead to the cheque being returned. Do not leave gaps between words, and draw a line through any empty space after \"Only\". For paise, write \"and Fifty Paise\" before \"Only\". This tool gives the words in the form \"Three Lakh Fifty Thousand Rupees Only\", which you can copy into the same order your bank uses.",
    },
    {
      heading: "Amount in words on invoices and receipts",
      body: "Invoices, quotations, receipts, salary slips and agreements often show the total in words as well as figures. Words are harder to alter and help catch typing mistakes, such as an extra zero. The Invoice, Quotation and Receipt generators on this site add the amount in words for you. Use this converter when you are filling a form by hand, writing a cheque, drafting a contract, or checking a figure in a document someone else prepared.",
    },
    {
      heading: "Paise, decimals and rounding",
      body: "In currency mode, the part after the decimal point is read as paise (or cents, pence and so on). ₹999.50 becomes \"Nine Hundred Ninety Nine Rupees and Fifty Paise Only\" and ₹0.75 becomes \"Seventy Five Paise Only\". Only two decimal places are used, so extra digits are rounded to the nearest paisa. Singular forms are used where they apply: ₹1 is \"One Rupee Only\". Negative numbers are prefixed with \"Minus\".",
    },
    {
      heading: "Common mistakes to avoid",
      body: "Writing \"Lakhs\" and \"Lacs\" in the same document: pick one style and stay with it. This tool writes \"Lakh\" and \"Crore\" in singular, which is the usual style on cheques. Mixing systems, such as \"Ten Lakh Million\", is another frequent error. Missing a zero is the most expensive one, as ₹1,50,000 and ₹15,00,000 differ by ten times. Always read the words back against the figure before you sign.",
    },
  ],
  examples: [
    {
      title: "Cheque amount in rupees",
      input: "350000 · Indian · Currency (INR)",
      output: "Three Lakh Fifty Thousand Rupees Only",
    },
    {
      title: "Amount with paise",
      input: "1245678.50 · Indian · Currency (INR)",
      output: "Twelve Lakh Forty Five Thousand Six Hundred Seventy Eight Rupees and Fifty Paise Only",
    },
    {
      title: "International format",
      input: "1245678 · International · Plain",
      output: "One Million Two Hundred Forty Five Thousand Six Hundred Seventy Eight",
    },
  ],
  primaryKeyword: "number to words",
  keywords: [
    "number to words converter",
    "amount in words",
    "rupees in words",
    "cheque amount in words",
    "number to words in indian rupees",
    "lakh crore in words",
    "convert number to words for cheque",
    "amount in words converter",
    "number to words international",
  ],
  searchAliases: ["amount in words", "rupees to words", "number in words", "cheque words", "figures to words", "amount to words"],
  searchWeight: 82,
  relatedTools: ["invoice-generator", "receipt-generator", "quotation-generator"],
  featured: false,
  trending: true,
  popular: true,
  addedAt: "2026-08-10",
  lastUpdated: "2026-11-11",
  schemaType: "Converter",
  icon: "case-sensitive",
  faq: [
    {
      question: "How do I write ₹1,00,000 in words for a cheque?",
      answer:
        "One Lakh Rupees Only. On most cheques you write it as \"Rupees One Lakh Only\" on the words line and 1,00,000 in the figure box.",
    },
    {
      question: "What is 12,45,678 in words?",
      answer:
        "In the Indian system it is Twelve Lakh Forty Five Thousand Six Hundred Seventy Eight. In the international system the same number is One Million Two Hundred Forty Five Thousand Six Hundred Seventy Eight.",
    },
    {
      question: "How do I write an amount with paise in words?",
      answer:
        "Write the rupees, then \"and\", then the paise. ₹999.50 is Nine Hundred Ninety Nine Rupees and Fifty Paise Only.",
    },
    {
      question: "How many lakh make a million, and how many crore make a billion?",
      answer:
        "10 lakh make 1 million, and 100 crore make 1 billion. One crore equals 10 million.",
    },
    {
      question: "How do I write ₹2.5 crore in words?",
      answer:
        "₹2,50,00,000 is Two Crore Fifty Lakh Rupees Only.",
    },
    {
      question: "Can I convert to dollars or other currencies?",
      answer:
        "Yes. Currency mode supports INR, USD, EUR, GBP and AED, and a custom option where you type your own main and fractional unit names, such as Riyal and Halala.",
    },
  ],
  howTo: [
    {
      title: "Enter the number",
      description: "Type the amount in figures, with up to two decimal places for paise or cents.",
    },
    {
      title: "Choose the numbering system",
      description: "Pick Indian (lakh, crore) for Indian documents or International (million, billion) for overseas use.",
    },
    {
      title: "Choose plain or currency mode",
      description: "Plain gives the number only. Currency adds rupees and paise, or the currency you select, plus \"Only\" at the end.",
    },
    {
      title: "Copy the words",
      description: "Click Copy Words and paste the result into your cheque draft, invoice or document. Read it back against the figure.",
    },
  ],
  engine: "calculator",
  privacyNote: "none",
}
