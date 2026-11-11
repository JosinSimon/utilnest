import type { ToolDefinition } from "@/data/types"

export const definition: ToolDefinition = {
  id: "unit-converter",
  name: "Unit Converter",
  slug: "unit-converter",
  category: "utilities",
  path: "utilities/unit-converter",

  shortDescription:
    "Convert length, weight, area, volume, temperature, speed, time, data, pressure and energy units. Sq ft to sq m, kg to lb, cm to feet, °C to °F and more.",
  longDescription:
    "Convert between metric, imperial and US units in 10 categories: length, weight, area, volume, temperature, speed, time, data storage, pressure and energy. Pick a category, choose the From and To units and type a value, and the result appears at once with up to 6 decimal places. Swap the direction with one click and copy the result as a ready-to-paste line.",

  sections: [
    {
      heading: "Categories and units covered",
      body: "Length: mm, cm, m, km, inch, foot, yard, mile and nautical mile. Weight: mg, g, kg, metric ton, ounce, pound and stone. Area: cm², m², km², in², ft², yd², acre and hectare. Volume: mL, L, m³ and US teaspoon, tablespoon, fluid ounce, cup, pint, quart and gallon. Temperature: Celsius, Fahrenheit and Kelvin. Speed: m/s, km/h, mph, knots and ft/s. Time: milliseconds to years. Data: bits, bytes, KB to TB and KiB to TiB. Pressure: Pa, kPa, bar, psi, atm and mmHg. Energy: J, kJ, cal, kcal, Wh, kWh and BTU.",
    },
    {
      heading: "Property and area conversions",
      body: "Flats in India are usually sold by the square foot, while land records and some plans use square metres, square yards, acres or hectares. Useful anchors: 1 m² = 10.76391 ft², 1 sq yd = 9 ft² (plots are often quoted in square yards, also called gaj), 1 acre = 43,560 ft² and 1 hectare = 2.471054 acres. Example: a 100 m² flat is 1,076.391042 ft². Regional land units such as bigha, guntha and cent vary by state and are not included, so check the local value with your land records office.",
    },
    {
      heading: "Height, weight and temperature",
      body: "Height in centimetres converts to decimal feet: 170 cm = 5.577428 ft. To get feet and inches, multiply the decimal part by 12: 0.577428 × 12 = 6.93, so about 5 ft 7 in. Weight: 1 kg = 2.204623 lb, so 70 kg is about 154.32 lb. For temperature, the tool uses the exact formulas °F = °C × 9/5 + 32 and K = °C + 273.15. A body temperature of 98.6 °F is 37 °C, 104 °F is 40 °C, and -40 is the same on both scales.",
    },
    {
      heading: "GB vs GiB and other data units",
      body: "Storage makers use decimal units, where 1 GB = 1,000,000,000 bytes. Many operating systems count in binary units, where 1 GiB = 1,073,741,824 bytes. That is why a 256 GB phone or pen drive shows about 238.42 GiB of space. This converter lists both families: KB, MB, GB and TB (powers of 1000) and KiB, MiB, GiB and TiB (powers of 1024). Internet speeds are quoted in bits, and 1 byte = 8 bits, so 1 MB = 8,000,000 bits.",
    },
    {
      heading: "Everyday conversions and assumptions",
      body: "Your electricity bill counts units, and 1 unit is 1 kWh, which is 3,600,000 joules or about 3,412 BTU. Food energy in kcal converts to kJ at 4.184, so 2,000 kcal = 8,368 kJ. Tyre pressure of 32 psi is 2.206322 bar or 220.632233 kPa. A speed of 60 km/h is 37.282272 mph. Some units need an assumption: Month means 30 days, Year means 365 days, and the US cup is taken as 240 mL. Results are rounded to at most 6 decimal places.",
    },
  ],

  examples: [
    {
      title: "Flat size",
      input: "100 square meters to square feet",
      output: "1,076.391042 ft²",
    },
    {
      title: "Body temperature",
      input: "98.6 °F to Celsius",
      output: "37 °C",
    },
    {
      title: "Phone storage",
      input: "256 GB (SI) to GiB (binary)",
      output: "238.418579 GiB",
    },
  ],

  primaryKeyword: "unit converter",
  keywords: [
    "unit converter online",
    "sq ft to sq m converter",
    "square meter to square feet",
    "acre to square feet",
    "cm to feet converter",
    "kg to pounds converter",
    "celsius to fahrenheit",
    "km to miles",
    "gb to gib converter",
    "psi to bar converter",
    "metric to imperial converter",
  ],
  searchAliases: [
    "measurement converter",
    "metric converter",
    "area converter",
    "length converter",
    "weight converter",
    "temperature converter",
    "conversion calculator",
  ],
  searchWeight: 90,

  relatedTools: ["time-zone-converter", "date-difference-calculator", "age-calculator"],
  featured: true,
  trending: true,
  popular: true,
  addedAt: "2026-08-10",
  lastUpdated: "2026-11-11",

  schemaType: "Converter",
  icon: "arrow-left-right",
  faq: [
    {
      question: "How many square feet are in 1 square metre?",
      answer:
        "1 square metre is 10.76391 square feet. To go the other way, 1,000 square feet is 92.90304 square metres.",
    },
    {
      question: "How many square feet are in an acre?",
      answer:
        "One acre is exactly 43,560 square feet, or about 4,046.86 square metres. One hectare is 2.471054 acres.",
    },
    {
      question: "How do I convert cm to feet and inches?",
      answer:
        "Convert cm to feet, then multiply the decimal part by 12 for inches. 170 cm = 5.577428 ft, and 0.577428 × 12 ≈ 6.93, so about 5 ft 7 in.",
    },
    {
      question: "How many pounds are in 1 kilogram?",
      answer:
        "1 kg is 2.204623 pounds. 1 pound is 0.453592 kg, using the exact definition of 453.59237 grams.",
    },
    {
      question: "Why does my 256 GB phone show less storage?",
      answer:
        "The box uses decimal gigabytes (1 GB = 1,000,000,000 bytes), while many devices count in binary units. 256 GB is about 238.42 GiB, before the operating system takes its share.",
    },
    {
      question: "Does the converter support bigha, guntha or lakh?",
      answer:
        "No. Those units vary by region or are counting terms rather than measurement units. The converter sticks to standard metric, imperial and US units.",
    },
  ],
  howTo: [
    {
      title: "Choose a category",
      description: "Pick length, weight, area, volume, temperature, speed, time, data, pressure or energy.",
    },
    {
      title: "Select the units",
      description: "Choose the From unit and the To unit. Use the swap button to reverse them.",
    },
    {
      title: "Enter a value",
      description: "Type the number to convert. The result updates as you type, rounded to at most 6 decimals.",
    },
    {
      title: "Copy the result",
      description: "Click Copy Result to copy a line such as 100 m² = 1,076.391042 ft².",
    },
  ],

  engine: "calculator",
  privacyNote: "client",
}

export default definition
