import { calculateGst } from "@/features/tools/finance/gst-calculator/engine"
import type { CalculatorEngine } from "@/features/tools/engine"

export type GstRate = 0 | 3 | 5 | 12 | 18 | 28

export interface LineItem {
  id: string
  description: string
  qty: number
  unitPrice: number
  discountPct: number
  gstRate: GstRate
}

export interface DocumentTotals {
  subtotal: number
  totalDiscount: number
  taxableAmount: number
  cgst: number
  sgst: number
  igst: number
  totalGst: number
  grandTotal: number
  roundOff: number
  finalAmount: number
}

export function computeDocumentTotals(items: LineItem[], interState: boolean): DocumentTotals {
  let subtotal = 0
  let totalDiscount = 0
  let taxableAmount = 0
  let cgst = 0
  let sgst = 0
  let igst = 0
  let totalGst = 0

  for (const item of items) {
    const itemSubtotal = item.qty * item.unitPrice
    const itemDiscount = itemSubtotal * (item.discountPct / 100)
    const itemTaxable = itemSubtotal - itemDiscount

    subtotal += itemSubtotal
    totalDiscount += itemDiscount
    taxableAmount += itemTaxable

    if (item.gstRate > 0) {
      const gstRes = calculateGst({ amount: itemTaxable, rate: item.gstRate, inclusive: false, interState })
      cgst += gstRes.cgst
      sgst += gstRes.sgst
      igst += gstRes.igst
      totalGst += gstRes.gstAmount
    }
  }

  const grandTotal = taxableAmount + totalGst
  const finalAmount = Math.round(grandTotal)
  const roundOff = finalAmount - grandTotal

  return { subtotal, totalDiscount, taxableAmount, cgst, sgst, igst, totalGst, grandTotal, roundOff, finalAmount }
}

export interface QuotationInput {
  items: LineItem[]
  interState: boolean
}

export const quotationEngine: CalculatorEngine<QuotationInput, DocumentTotals> = (input) => {
  return computeDocumentTotals(input.items, input.interState)
}

export default { family: "calculator" as const, run: quotationEngine }
