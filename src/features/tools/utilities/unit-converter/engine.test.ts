import { describe, it, expect } from "vitest"
import { convertUnits } from "./engine"

describe("Unit Converter Engine", () => {
  it("converts length correctly (cm to m)", () => {
    const res = convertUnits("length", 100, "cm", "m")
    expect(res).not.toBeNull()
    expect(res?.toValue).toBe(1)
  })

  it("converts length metric to imperial (m to ft)", () => {
    const res = convertUnits("length", 1, "m", "ft")
    expect(res?.toValue).toBeCloseTo(3.28084, 4)
  })

  it("converts weight (kg to lb)", () => {
    const res = convertUnits("weight", 1, "kg", "lb")
    expect(res?.toValue).toBeCloseTo(2.20462, 4)
  })

  it("converts temperature (Celsius to Fahrenheit)", () => {
    const res = convertUnits("temperature", 25, "celsius", "fahrenheit")
    expect(res?.toValue).toBe(77)
  })

  it("converts temperature (Celsius to Kelvin)", () => {
    const res = convertUnits("temperature", 0, "celsius", "kelvin")
    expect(res?.toValue).toBe(273.15)
  })

  it("distinguishes SI decimal data vs binary IEC data", () => {
    const si = convertUnits("data", 1, "kb", "b")
    expect(si?.toValue).toBe(1000)

    const binary = convertUnits("data", 1, "kib", "b")
    expect(binary?.toValue).toBe(1024)
  })

  it("reverses unit conversions within float tolerance", () => {
    const step1 = convertUnits("speed", 100, "kmh", "mph")
    expect(step1).not.toBeNull()
    const step2 = convertUnits("speed", step1!.toValue, "mph", "kmh")
    expect(step2?.toValue).toBeCloseTo(100, 4)
  })

  it("handles non-finite or invalid inputs gracefully", () => {
    expect(convertUnits("length", NaN, "cm", "m")).toBeNull()
    expect(convertUnits("length", 10, "invalid", "m")).toBeNull()
  })
})
