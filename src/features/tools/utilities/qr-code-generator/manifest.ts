import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "qr-code-generator",
  name: "QR Code Generator",
  slug: "qr-code-generator",
  category: "utilities",
  path: "utilities/qr-code-generator",

  shortDescription:
    "Make free QR codes for UPI payments, Wi-Fi, websites, contacts, SMS and email. Pick colours and size, then download PNG or SVG. No sign-up, no expiry.",
  longDescription:
    "Create a QR code for a website link, a UPI payment request, your Wi-Fi network, a contact card, a phone number, an SMS, an email or plain text. Change the colours, error correction and size, then download it as PNG or SVG, copy it or print it. The code is built in your browser, the data is stored inside the QR code itself, and it keeps working for as long as the details stay valid.",

  sections: [
    {
      heading: "Eight QR code types",
      body: "Website URL opens a link and adds https:// if you leave it out. UPI Payment opens a UPI app with your UPI ID filled in. Wi-Fi Network lets a phone join your network without typing the password. vCard Contact saves a name, phone, email and company to the address book. Plain Text shows any text. Email opens a new mail with the address and subject filled in. Phone Call dials a number, and SMS Message opens a text with the number and message ready. Pick a type and fill in its fields.",
    },
    {
      heading: "UPI payment QR codes",
      body: "Enter your UPI ID (VPA), such as yourname@bank, and optionally a payee name, an amount in ₹ and a note. The tool builds a standard upi://pay link with the currency set to INR. If you add an amount, the payer's app fills it in, which suits a fixed bill or invoice. Leave the amount blank for a shop counter QR where customers type their own amount. Before you print it, scan it with your own UPI app and check the payee name and amount. Many apps show the name registered with the bank, which may differ from the name you typed.",
    },
    {
      heading: "Wi-Fi QR codes for home, office and guests",
      body: "Enter the network name (SSID) exactly as it appears, including capital letters, add the password and choose the security type: WPA/WPA2/WPA3, WEP or None for an open network. Most recent Android phones and iPhones can scan this with the camera app and offer to join. Print it for guests, a café table, a PG or a co-working desk. If you change your Wi-Fi password later, make a new QR code, because the old one will still contain the old password.",
    },
    {
      heading: "Colours, error correction and size",
      body: "Keep a dark foreground on a light background, as many scanners struggle with low contrast or inverted colours. Error correction lets a code still scan when part of it is dirty, creased or covered: Low recovers about 7% damage, Medium 15%, Quartile 25% and High 30%. Higher levels make the pattern denser, so use Medium for screens and Quartile or High for printed labels and outdoor signs. Size runs from 128 to 1024 pixels for the PNG. For print, download the SVG, which stays sharp at any size.",
    },
    {
      heading: "Static codes: what that means",
      body: "Every code made here is static: the link, UPI ID or Wi-Fi details are written directly into the pattern. There is no redirect service in between, so the code does not expire, does not need an account and does not track scans. The trade-off is that you cannot edit it after printing. If a URL or number changes, generate and print a new code. Always test a printed sample with two different phones before ordering large quantities.",
    },
  ],

  examples: [
    {
      title: "UPI QR for a fixed bill",
      input: "UPI ID shop@upi · Amount ₹500 · Note Order 123",
      output: "upi://pay?pa=shop%40upi&am=500&tn=Order%20123&cu=INR",
    },
    {
      title: "Wi-Fi for guests",
      input: "SSID HomeWiFi · Password ******** · WPA",
      output: "WIFI:S:HomeWiFi;T:WPA;P:********;H:false;;",
    },
    {
      title: "Website link",
      input: "example.com",
      output: "Encodes https://example.com",
    },
  ],

  primaryKeyword: "qr code generator",
  keywords: [
    "upi qr code generator",
    "wifi qr code generator",
    "free qr code generator",
    "qr code generator for website link",
    "vcard qr code generator",
    "qr code generator with colour",
    "qr code svg download",
    "qr code for payment",
    "static qr code generator no expiry",
    "how to make a qr code",
  ],
  searchAliases: [
    "qr maker",
    "qr creator",
    "upi qr",
    "payment qr",
    "wifi qr",
    "make qr code",
  ],
  searchWeight: 98,

  relatedTools: ["uuid-generator", "password-generator", "unit-converter"],
  featured: true,
  trending: true,
  popular: true,
  addedAt: "2026-08-10",
  lastUpdated: "2026-11-11",

  schemaType: "Generator",
  icon: "qr-code",
  faq: [
    {
      question: "Can I make a UPI QR code for payments?",
      answer:
        "Yes. Choose UPI Payment, enter your UPI ID and, if you like, a payee name, amount and note. Scan the result with your own UPI app to confirm the details before sharing or printing it.",
    },
    {
      question: "Do these QR codes expire?",
      answer:
        "No. The data is stored inside the code itself, with no link shortener or account behind it, so it works as long as the URL, UPI ID or other details remain valid.",
    },
    {
      question: "How do I make a QR code for my Wi-Fi?",
      answer:
        "Choose Wi-Fi Network, type the network name exactly, enter the password and select the security type (usually WPA). Guests can scan it with their phone camera to join.",
    },
    {
      question: "Should I download PNG or SVG?",
      answer:
        "Use PNG for WhatsApp, websites and documents. Use SVG for printing on posters, menus, packaging or visiting cards, because it scales to any size without blurring.",
    },
    {
      question: "Which error correction level should I choose?",
      answer:
        "Medium (15%) is fine for screens and clean prints. Choose Quartile (25%) or High (30%) for codes that may get scratched, folded or partly covered.",
    },
    {
      question: "Is my data uploaded anywhere?",
      answer:
        "No. The QR code is generated in your browser, so your UPI ID, Wi-Fi password and contact details are not sent to a server.",
    },
  ],
  howTo: [
    {
      title: "Pick a QR type",
      description: "Choose Website URL, UPI Payment, Wi-Fi Network, vCard, Plain Text, Email, Phone Call or SMS.",
    },
    {
      title: "Fill in the details",
      description: "Enter the link, UPI ID, Wi-Fi name and password, or contact fields. The preview updates as you type.",
    },
    {
      title: "Style the code",
      description: "Set the foreground and background colours, the error correction level and the size in pixels.",
    },
    {
      title: "Download and test",
      description: "Download PNG or SVG, copy or print it, then scan it with your phone to check it works.",
    },
  ],

  engine: "calculator",
  privacyNote: "client",
}

export default definition
