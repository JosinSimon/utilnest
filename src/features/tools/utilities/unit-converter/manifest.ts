import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "unit-converter",
  name: "Unit Converter",
  slug: "unit-converter",
  category: "utilities",
  path: "utilities/unit-converter",

  shortDescription: "Convert length, weight, area, volume, temperature, speed, time, data storage, pressure and energy units instantly.",
  longDescription:
    "Free online unit converter for everyday measurements. Convert length (meters, feet, inches), weight (kg, pounds), area, volume, temperature (Celsius, Fahrenheit), speed, time, data storage (SI decimal vs binary KiB), pressure and energy. 100% private, fast, and runs entirely in your browser.",

  sections: [
    {
      heading: "Comprehensive Multi-Category Unit Conversion",
      body: "Our Unit Converter covers 10 primary measurement categories with exact conversion ratios. Easily convert metric to imperial, SI to binary data units, and temperature scales with instant live calculation.",
    },
    {
      heading: "Data Storage: SI (KB) vs Binary (KiB)",
      body: "Standard SI data units use powers of 1000 (1 KB = 1000 Bytes, 1 MB = 1,000,000 Bytes), whereas binary data units use powers of 1024 (1 KiB = 1024 Bytes, 1 MiB = 1,048,576 Bytes). Our converter clearly distinguishes both so you get exact numbers every time.",
    },
  ],

  primaryKeyword: "unit converter",
  keywords: [
    "unit converter online",
    "length converter",
    "weight converter",
    "kg to pounds",
    "cm to inches",
    "celsius to fahrenheit",
    "data storage converter",
  ],
  searchAliases: [
    "measurement converter",
    "metric to imperial",
    "temperature converter",
    "area converter",
  ],
  searchWeight: 90,

  relatedTools: ["time-zone-converter", "date-difference-calculator", "age-calculator"],
  featured: true,
  trending: true,
  popular: true,
  addedAt: "2026-08-10",
  lastUpdated: "2026-08-10",

  schemaType: "Converter",
  icon: "arrow-left-right",
  faq: [
    {
      question: "How do I convert Celsius to Fahrenheit?",
      answer: "Use the formula: °F = (°C × 9/5) + 32. For example, 25°C = (25 × 1.8) + 32 = 77°F.",
    },
    {
      question: "What is the difference between KB and KiB?",
      answer: "1 Kilobyte (KB) = 1,000 Bytes (decimal SI standard). 1 Kibibyte (KiB) = 1,024 Bytes (binary IEC standard).",
    },
    {
      question: "How many pounds are in 1 kilogram?",
      answer: "1 kg is approximately 2.20462 pounds (lbs).",
    },
  ],
  howTo: [
    { title: "Select Category", description: "Choose measurement type (Length, Weight, Temp, Data, etc.)." },
    { title: "Enter Value", description: "Type the quantity you want to convert." },
    { title: "Choose Units", description: "Select source and destination units to view instant conversion." },
  ],

  engine: "calculator",
  privacyNote: "client",
}

export default definition
