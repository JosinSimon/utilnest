import type { CalculatorEngine } from "@/features/tools/engine"

export type UnitCategory =
  | "length"
  | "weight"
  | "area"
  | "volume"
  | "temperature"
  | "speed"
  | "time"
  | "data"
  | "pressure"
  | "energy"

export interface UnitDefinition {
  id: string
  label: string
  symbol: string
  // Factor relative to base unit of the category, or custom convert functions for non-linear like Temp
  ratio?: number
  toBase?: (val: number) => number
  fromBase?: (val: number) => number
}

// ── Base Units:
// length: meter (m)
// weight: gram (g)
// area: square meter (m²)
// volume: liter (L)
// temperature: Celsius (°C)
// speed: meter per second (m/s)
// time: second (s)
// data: byte (B)
// pressure: Pascal (Pa)
// energy: Joule (J)

export const UNITS_BY_CATEGORY: Record<UnitCategory, { name: string; units: UnitDefinition[] }> = {
  length: {
    name: "Length",
    units: [
      { id: "mm", label: "Millimeter", symbol: "mm", ratio: 0.001 },
      { id: "cm", label: "Centimeter", symbol: "cm", ratio: 0.01 },
      { id: "m", label: "Meter", symbol: "m", ratio: 1 },
      { id: "km", label: "Kilometer", symbol: "km", ratio: 1000 },
      { id: "inch", label: "Inch", symbol: "in", ratio: 0.0254 },
      { id: "ft", label: "Foot", symbol: "ft", ratio: 0.3048 },
      { id: "yd", label: "Yard", symbol: "yd", ratio: 0.9144 },
      { id: "mi", label: "Mile", symbol: "mi", ratio: 1609.344 },
      { id: "nmi", label: "Nautical Mile", symbol: "nmi", ratio: 1852 },
    ],
  },
  weight: {
    name: "Weight / Mass",
    units: [
      { id: "mg", label: "Milligram", symbol: "mg", ratio: 0.001 },
      { id: "g", label: "Gram", symbol: "g", ratio: 1 },
      { id: "kg", label: "Kilogram", symbol: "kg", ratio: 1000 },
      { id: "oz", label: "Ounce", symbol: "oz", ratio: 28.349523125 },
      { id: "lb", label: "Pound", symbol: "lb", ratio: 453.59237 },
      { id: "st", label: "Stone", symbol: "st", ratio: 6350.29318 },
      { id: "ton", label: "Metric Ton", symbol: "t", ratio: 1_000_000 },
    ],
  },
  area: {
    name: "Area",
    units: [
      { id: "sq_cm", label: "Square Centimeter", symbol: "cm²", ratio: 0.0001 },
      { id: "sq_m", label: "Square Meter", symbol: "m²", ratio: 1 },
      { id: "sq_km", label: "Square Kilometer", symbol: "km²", ratio: 1_000_000 },
      { id: "sq_in", label: "Square Inch", symbol: "in²", ratio: 0.00064516 },
      { id: "sq_ft", label: "Square Foot", symbol: "ft²", ratio: 0.09290304 },
      { id: "sq_yd", label: "Square Yard", symbol: "yd²", ratio: 0.83612736 },
      { id: "acre", label: "Acre", symbol: "ac", ratio: 4046.8564224 },
      { id: "ha", label: "Hectare", symbol: "ha", ratio: 10000 },
    ],
  },
  volume: {
    name: "Volume",
    units: [
      { id: "ml", label: "Milliliter", symbol: "mL", ratio: 0.001 },
      { id: "l", label: "Liter", symbol: "L", ratio: 1 },
      { id: "cu_m", label: "Cubic Meter", symbol: "m³", ratio: 1000 },
      { id: "tsp", label: "Teaspoon (US)", symbol: "tsp", ratio: 0.00492892 },
      { id: "tbsp", label: "Tablespoon (US)", symbol: "tbsp", ratio: 0.0147868 },
      { id: "fl_oz", label: "Fluid Ounce (US)", symbol: "fl oz", ratio: 0.0295735 },
      { id: "cup", label: "Cup (US)", symbol: "cup", ratio: 0.24 },
      { id: "pt", label: "Pint (US)", symbol: "pt", ratio: 0.473176 },
      { id: "qt", label: "Quart (US)", symbol: "qt", ratio: 0.946353 },
      { id: "gal", label: "Gallon (US)", symbol: "gal", ratio: 3.785411784 },
    ],
  },
  temperature: {
    name: "Temperature",
    units: [
      {
        id: "celsius",
        label: "Celsius",
        symbol: "°C",
        toBase: (v) => v,
        fromBase: (v) => v,
      },
      {
        id: "fahrenheit",
        label: "Fahrenheit",
        symbol: "°F",
        toBase: (v) => (v - 32) * (5 / 9),
        fromBase: (v) => v * (9 / 5) + 32,
      },
      {
        id: "kelvin",
        label: "Kelvin",
        symbol: "K",
        toBase: (v) => v - 273.15,
        fromBase: (v) => v + 273.15,
      },
    ],
  },
  speed: {
    name: "Speed",
    units: [
      { id: "ms", label: "Meter per second", symbol: "m/s", ratio: 1 },
      { id: "kmh", label: "Kilometer per hour", symbol: "km/h", ratio: 1 / 3.6 },
      { id: "mph", label: "Miles per hour", symbol: "mph", ratio: 0.44704 },
      { id: "knot", label: "Knot", symbol: "kn", ratio: 0.514444 },
      { id: "fts", label: "Feet per second", symbol: "ft/s", ratio: 0.3048 },
    ],
  },
  time: {
    name: "Time",
    units: [
      { id: "ms", label: "Millisecond", symbol: "ms", ratio: 0.001 },
      { id: "sec", label: "Second", symbol: "s", ratio: 1 },
      { id: "min", label: "Minute", symbol: "min", ratio: 60 },
      { id: "hr", label: "Hour", symbol: "hr", ratio: 3600 },
      { id: "day", label: "Day", symbol: "d", ratio: 86400 },
      { id: "week", label: "Week", symbol: "wk", ratio: 604800 },
      { id: "month", label: "Month (30 days)", symbol: "mo", ratio: 2592000 },
      { id: "yr", label: "Year (365 days)", symbol: "yr", ratio: 31536000 },
    ],
  },
  data: {
    name: "Data Storage",
    units: [
      { id: "bit", label: "Bit", symbol: "b", ratio: 0.125 },
      { id: "b", label: "Byte", symbol: "B", ratio: 1 },
      // SI Decimal (Powers of 1000)
      { id: "kb", label: "Kilobyte (SI)", symbol: "KB", ratio: 1000 },
      { id: "mb", label: "Megabyte (SI)", symbol: "MB", ratio: 1_000_000 },
      { id: "gb", label: "Gigabyte (SI)", symbol: "GB", ratio: 1_000_000_000 },
      { id: "tb", label: "Terabyte (SI)", symbol: "TB", ratio: 1_000_000_000_000 },
      // Binary IEC (Powers of 1024)
      { id: "kib", label: "Kibibyte (Binary)", symbol: "KiB", ratio: 1024 },
      { id: "mib", label: "Mebibyte (Binary)", symbol: "MiB", ratio: 1_048_576 },
      { id: "gib", label: "Gibibyte (Binary)", symbol: "GiB", ratio: 1_073_741_824 },
      { id: "tib", label: "Tebibyte (Binary)", symbol: "TiB", ratio: 1_099_511_627_776 },
    ],
  },
  pressure: {
    name: "Pressure",
    units: [
      { id: "pa", label: "Pascal", symbol: "Pa", ratio: 1 },
      { id: "kpa", label: "Kilopascal", symbol: "kPa", ratio: 1000 },
      { id: "bar", label: "Bar", symbol: "bar", ratio: 100000 },
      { id: "psi", label: "Pounds per sq inch", symbol: "psi", ratio: 6894.757293 },
      { id: "atm", label: "Standard Atmosphere", symbol: "atm", ratio: 101325 },
      { id: "mmhg", label: "Millimeter of Mercury", symbol: "mmHg", ratio: 133.322368 },
    ],
  },
  energy: {
    name: "Energy",
    units: [
      { id: "j", label: "Joule", symbol: "J", ratio: 1 },
      { id: "kj", label: "Kilojoule", symbol: "kJ", ratio: 1000 },
      { id: "cal", label: "Calorie", symbol: "cal", ratio: 4.184 },
      { id: "kcal", label: "Kilocalorie (Food Cal)", symbol: "kcal", ratio: 4184 },
      { id: "wh", label: "Watt-hour", symbol: "Wh", ratio: 3600 },
      { id: "kwh", label: "Kilowatt-hour", symbol: "kWh", ratio: 3_600_000 },
      { id: "btu", label: "BTU", symbol: "BTU", ratio: 1055.05585 },
    ],
  },
}

export interface UnitConverterInput {
  category: UnitCategory
  value: number
  fromUnit: string
  toUnit: string
}

export interface UnitConverterResult {
  category: UnitCategory
  fromValue: number
  fromUnit: UnitDefinition
  toValue: number
  toUnit: UnitDefinition
  formattedResult: string
}

export const convertUnits = (
  category: UnitCategory,
  value: number,
  fromId: string,
  toId: string,
): UnitConverterResult | null => {
  if (!Number.isFinite(value)) return null

  const catObj = UNITS_BY_CATEGORY[category]
  if (!catObj) return null

  const fromUnit = catObj.units.find((u) => u.id === fromId)
  const toUnit = catObj.units.find((u) => u.id === toId)

  if (!fromUnit || !toUnit) return null

  let baseValue: number

  if (fromUnit.toBase) {
    baseValue = fromUnit.toBase(value)
  } else if (fromUnit.ratio) {
    baseValue = value * fromUnit.ratio
  } else {
    return null
  }

  let finalValue: number

  if (toUnit.fromBase) {
    finalValue = toUnit.fromBase(baseValue)
  } else if (toUnit.ratio) {
    finalValue = baseValue / toUnit.ratio
  } else {
    return null
  }

  // Round to 6 decimal places to avoid floating point precision noise
  const rounded = Math.round(finalValue * 1e8) / 1e8

  const formattedResult = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 6,
  }).format(rounded)

  return {
    category,
    fromValue: value,
    fromUnit,
    toValue: rounded,
    toUnit,
    formattedResult,
  }
}

export const unitConverterEngine: CalculatorEngine<
  UnitConverterInput,
  UnitConverterResult | null
> = (input) => {
  return convertUnits(input.category, input.value, input.fromUnit, input.toUnit)
}

export default { family: "calculator" as const, run: unitConverterEngine }
