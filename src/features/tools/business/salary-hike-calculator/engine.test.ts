import { expect, test, describe } from "vitest"
import { runSalaryHike } from "./engine"

describe("Salary Hike Calculator Engine", () => {
  test("calculates monthly hike correctly", () => {
    const result = runSalaryHike({ currentSalary: 50000, hikePercentage: 15, mode: "monthly" })
    expect(result).not.toBeNull()
    expect(result?.newMonthlySalary).toBe(57500)
    expect(result?.monthlyIncrease).toBe(7500)
    expect(result?.newAnnualSalary).toBe(690000)
    expect(result?.annualIncrease).toBe(90000)
  })

  test("calculates annual hike correctly", () => {
    const result = runSalaryHike({ currentSalary: 600000, hikePercentage: 20, mode: "annual" })
    expect(result).not.toBeNull()
    expect(result?.newAnnualSalary).toBe(720000)
    expect(result?.annualIncrease).toBe(120000)
    expect(result?.newMonthlySalary).toBe(60000)
    expect(result?.monthlyIncrease).toBe(10000)
  })

  test("handles invalid inputs", () => {
    const result = runSalaryHike({ currentSalary: -50000, hikePercentage: 10, mode: "monthly" })
    expect(result).toBeNull()
  })
})
