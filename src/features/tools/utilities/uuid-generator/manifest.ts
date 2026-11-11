import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "uuid-generator",
  name: "UUID Generator",
  slug: "uuid-generator",
  category: "utilities",
  path: "utilities/uuid-generator",

  shortDescription:
    "Generate random version 4 UUIDs (GUIDs) online, 1 to 100 at a time. Uppercase or no-hyphen formats, one-click copy, made in your browser.",
  longDescription:
    "Create random version 4 UUIDs for database keys, API requests, test data and file names. Generate 1 to 100 at a time, switch to uppercase or remove the hyphens, and copy one UUID or the whole list. The IDs are made in your browser with the Web Crypto API, so nothing is sent to a server.",

  sections: [
    {
      heading: "What a UUID looks like",
      body: "A UUID (universally unique identifier) is a 128-bit value written as 32 hexadecimal characters in five groups: 8-4-4-4-12, for example 3f2b8c1e-7a4d-4e9b-9c21-5d6e7f8a9b0c. That is 36 characters with hyphens, or 32 without. In a version 4 UUID, the first character of the third group is always 4, and the first character of the fourth group is 8, 9, a or b. The other 122 bits are random. Microsoft software calls the same thing a GUID.",
    },
    {
      heading: "How this generator works",
      body: "This tool makes version 4 (random) UUIDs only. It calls crypto.randomUUID, the built-in UUID function in modern browsers, which uses the same secure random source as other browser security features. On older browsers without that function, it builds the UUID from crypto.getRandomValues and sets the version and variant bits itself. Each time you change the quantity or format, or click Generate New UUIDs, you get a new set. Nothing is stored, so copy the IDs you want to keep.",
    },
    {
      heading: "Can two UUIDs ever be the same?",
      body: "In theory yes, in practice almost never. A version 4 UUID has 122 random bits, giving about 5.3 × 10^36 possible values. You would need to generate roughly 2.7 × 10^18 UUIDs before there is even a 50% chance of a single repeat. That is why systems can create IDs on many machines at once without checking a central list first. The guarantee depends on a good random source, which is why this tool uses the browser's cryptographic one.",
    },
    {
      heading: "Uppercase and no-hyphen formats",
      body: "UUIDs are not case-sensitive, and the standard (RFC 9562, which replaced RFC 4122) recommends lowercase output. Some tools and older Windows software show GUIDs in uppercase, so tick Uppercase if your system expects it. Tick Remove Hyphens to get a compact 32-character string, which is handy for file names, URL slugs or columns with a fixed length. If your database has a native UUID type, keep the standard hyphenated form so it is parsed correctly.",
    },
    {
      heading: "Common uses",
      body: "Developers use UUIDs as primary keys when rows are created on several servers or offline devices, as request or trace IDs in logs, as idempotency keys for payment and order APIs, and as unique names for uploaded files. Testers use bulk UUIDs to fill sample data. A UUID is unique, but it is not meant to be a password or secret token. For anything a person should not be able to guess, use the Password Generator instead.",
    },
  ],

  examples: [
    {
      title: "Standard UUID v4",
      input: "Quantity 1 · default format",
      output: "3f2b8c1e-7a4d-4e9b-9c21-5d6e7f8a9b0c",
    },
    {
      title: "Uppercase, no hyphens",
      input: "Quantity 1 · Uppercase on · Remove Hyphens on",
      output: "3F2B8C1E7A4D4E9B9C215D6E7F8A9B0C (32 characters)",
    },
    {
      title: "Bulk list for test data",
      input: "Quantity 100 · Copy All UUIDs",
      output: "100 UUIDs copied, one per line",
    },
  ],

  primaryKeyword: "uuid generator",
  keywords: [
    "uuid v4 generator",
    "guid generator",
    "random uuid generator",
    "online uuid generator",
    "bulk uuid generator",
    "uuid generator without hyphens",
    "uppercase guid generator",
    "generate uuid online",
    "what is a uuid",
  ],
  searchAliases: ["guid", "uuid", "uuid v4", "unique id generator", "random id generator"],
  searchWeight: 90,

  relatedTools: ["random-number-generator", "password-generator", "qr-code-generator"],
  featured: true,
  trending: true,
  popular: true,
  addedAt: "2026-08-10",
  lastUpdated: "2026-11-11",

  schemaType: "Generator",
  icon: "fingerprint",
  faq: [
    {
      question: "Which UUID version does this tool generate?",
      answer:
        "Version 4 only. Version 4 UUIDs are built from random numbers, with fixed bits marking the version (the 4 at the start of the third group) and the variant.",
    },
    {
      question: "Is a UUID the same as a GUID?",
      answer:
        "Yes. GUID (globally unique identifier) is the name Microsoft uses for the same 128-bit format. A UUID from this tool works anywhere a GUID is expected.",
    },
    {
      question: "Are the UUIDs really unique?",
      answer:
        "They are random, not checked against a list, but with 122 random bits a repeat is extremely unlikely. You would need around 2.7 × 10^18 UUIDs for a 50% chance of one duplicate.",
    },
    {
      question: "How many UUIDs can I generate at once?",
      answer:
        "From 1 to 100 per batch. Click Copy All UUIDs to copy the list with one UUID per line, or Generate New UUIDs for a new batch.",
    },
    {
      question: "Should I use uppercase or lowercase UUIDs?",
      answer:
        "UUIDs are case-insensitive, and lowercase is the standard output. Use uppercase only if a system or style guide asks for it.",
    },
    {
      question: "Are generated UUIDs stored anywhere?",
      answer:
        "No. They are created in your browser and are not uploaded or saved. Refreshing the page gives a new set.",
    },
  ],
  howTo: [
    {
      title: "Set the quantity",
      description: "Enter how many UUIDs you need, from 1 to 100.",
    },
    {
      title: "Choose the format",
      description: "Tick Uppercase for capital letters or Remove Hyphens for a 32-character string.",
    },
    {
      title: "Make a new batch",
      description: "Click Generate New UUIDs to replace the list with a fresh set of version 4 UUIDs.",
    },
    {
      title: "Copy the results",
      description: "Use the copy button next to a single UUID, or Copy All UUIDs for the full list.",
    },
  ],

  engine: "calculator",
  privacyNote: "client",
}

export default definition
