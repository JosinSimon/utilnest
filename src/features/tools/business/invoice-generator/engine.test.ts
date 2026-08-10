import { describe, it, expect } from "vitest"
import { computeDocumentTotals } from "./engine"

describe("computeDocumentTotals", () => {
  it("calculates totals correctly for intra-state", () => {
    const items = [
      { id: "1", description: "Test Item", qty: 2, unitPrice: 1000, discountPct: 10, gstRate: 18 as const }
    ]
    // Subtotal: 2000, Discount: 200, Taxable: 1800
    // GST 18% on 1800 = 324 (CGST: 162, SGST: 162)
    // Grand Total: 2124
    
    const result = computeDocumentTotals(items, false)
    expect(result.subtotal).toBe(2000)
    expect(result.totalDiscount).toBe(200)
    expect(result.taxableAmount).toBe(1800)
    expect(result.cgst).toBe(162)
    expect(result.sgst).toBe(162)
    expect(result.igst).toBe(0)
    expect(result.totalGst).toBe(324)
    expect(result.grandTotal).toBe(2124)
    expect(result.finalAmount).toBe(2124)
    expect(result.roundOff).toBe(0)
  })

  it("calculates totals correctly for inter-state", () => {
    const items = [
      { id: "1", description: "Test Item", qty: 1, unitPrice: 1000, discountPct: 0, gstRate: 5 as const }
    ]
    // Subtotal: 1000, Taxable: 1000
    // GST 5% on 1000 = 50 (IGST: 50)
    // Grand Total: 1050
    
    const result = computeDocumentTotals(items, true)
    expect(result.igst).toBe(50)
    expect(result.cgst).toBe(0)
    expect(result.sgst).toBe(0)
    expect(result.totalGst).toBe(50)
  })
})
