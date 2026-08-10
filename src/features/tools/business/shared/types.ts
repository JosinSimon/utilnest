/**
 * Shared data types consumed by the three document-generator tools
 * (Invoice Generator, Quotation Generator, Receipt Generator).
 *
 * Keep this file free of logic — interfaces and literal types only.
 */

// ── Line items ────────────────────────────────────────────────────────────────

export type GstRate = 0 | 3 | 5 | 12 | 18 | 28

export interface LineItem {
  id: string
  description: string
  qty: number
  unitPrice: number
  discountPct: number
  gstRate: GstRate
}

export interface LineItemTotals {
  subtotal: number       // qty × unitPrice
  discountAmount: number // subtotal × discountPct / 100
  taxableAmount: number  // subtotal − discountAmount
  cgst: number           // taxableAmount × gstRate/2 / 100  (intra-state)
  sgst: number           // taxableAmount × gstRate/2 / 100
  igst: number           // taxableAmount × gstRate / 100    (inter-state)
  lineTotal: number      // taxableAmount + cgst + sgst + igst
}

// ── Business / Customer info ──────────────────────────────────────────────────

export interface BusinessInfo {
  name: string
  address: string
  gstin: string
  phone: string
  email: string
  logo: string   // data URL or "" — stored in browser only, never sent anywhere
  bankName: string
  accountNumber: string
  ifscCode: string
  upiId: string
}

export interface CustomerInfo {
  name: string
  address: string
  gstin: string
  phone: string
  email: string
}

// ── Document totals ───────────────────────────────────────────────────────────

export interface DocumentTotals {
  subtotal: number
  totalDiscount: number
  totalTaxable: number
  totalCgst: number
  totalSgst: number
  totalIgst: number
  grandTotal: number
  roundOff: number       // grandTotal rounded − exact grandTotal
  finalAmount: number    // Math.round(grandTotal)
}

// ── Invoice ───────────────────────────────────────────────────────────────────

export interface InvoiceData {
  business: BusinessInfo
  customer: CustomerInfo
  invoiceNumber: string
  invoiceDate: string   // ISO date string "YYYY-MM-DD"
  dueDate: string
  interState: boolean
  items: LineItem[]
  notes: string
  paymentTerms: string
}

// ── Quotation ─────────────────────────────────────────────────────────────────

export interface QuotationData {
  business: BusinessInfo
  customer: CustomerInfo
  quoteNumber: string
  quoteDate: string
  validUntil: string
  interState: boolean
  items: LineItem[]
  notes: string
  termsAndConditions: string
}

// ── Receipt ───────────────────────────────────────────────────────────────────

export type PaymentMethod = "Cash" | "Card" | "UPI" | "Bank Transfer" | "Cheque" | "Other"

export interface ReceiptData {
  businessName: string
  businessAddress: string
  businessPhone: string
  customerName: string
  receiptNumber: string
  date: string
  amount: number
  paymentMethod: PaymentMethod
  description: string
  referenceNumber: string
  notes: string
}
