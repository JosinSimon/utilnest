import { useState, useMemo } from "react"
import { Printer, Download } from "lucide-react"
import type { ToolDefinition } from "@/data/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { printDocument, downloadDocument } from "@/features/tools/business/shared/documentHelpers"
import { convertNumberToWords } from "@/features/tools/business/shared/numberToWords"
import { formatINR } from "@/lib/utils"

const PAYMENT_METHODS = ["Cash", "UPI", "Card", "Bank Transfer", "Cheque", "Other"] as const

export default function ReceiptGenerator({ tool: _tool }: { tool: ToolDefinition }) {
  const [data, setData] = useState({
    businessName: "",
    businessAddress: "",
    businessPhone: "",
    customerName: "",
    receiptNumber: "RCT-001",
    date: new Date().toISOString().slice(0, 10),
    amount: "",
    paymentMethod: "Cash",
    description: "",
    referenceNumber: "",
    notes: ""
  })

  const amountNum = parseFloat(data.amount)
  const isValidAmount = !isNaN(amountNum) && amountNum > 0
  const amountInWords = useMemo(() => {
    if (!isValidAmount) return ""
    return convertNumberToWords(amountNum, { system: "indian", mode: "currency" }).words
  }, [isValidAmount, amountNum])

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Receipt Details</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Business Name</Label>
                <Input value={data.businessName} onChange={(e) => setData({ ...data, businessName: e.target.value })} placeholder="Your Company Ltd" />
              </div>
              <div className="space-y-2">
                <Label>Business Phone</Label>
                <Input value={data.businessPhone} onChange={(e) => setData({ ...data, businessPhone: e.target.value })} placeholder="+91 9876543210" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Business Address</Label>
                <Input value={data.businessAddress} onChange={(e) => setData({ ...data, businessAddress: e.target.value })} placeholder="123 Business Street, City" />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Customer Name</Label>
                <Input value={data.customerName} onChange={(e) => setData({ ...data, customerName: e.target.value })} placeholder="Customer Name" />
              </div>
              <div className="space-y-2">
                <Label>Receipt Number</Label>
                <Input value={data.receiptNumber} onChange={(e) => setData({ ...data, receiptNumber: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Input type="date" value={data.date} onChange={(e) => setData({ ...data, date: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Amount (₹)</Label>
                <Input type="number" min="0" step="any" inputMode="decimal" value={data.amount} onChange={(e) => setData({ ...data, amount: e.target.value })} placeholder="0.00" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Payment Method</Label>
              <div className="flex flex-wrap gap-2">
                {PAYMENT_METHODS.map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setData({ ...data, paymentMethod: method })}
                    className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
                      data.paymentMethod === method
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description / Purpose</Label>
              <Input value={data.description} onChange={(e) => setData({ ...data, description: e.target.value })} placeholder="Payment for services rendered" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Reference Number (Optional)</Label>
                <Input value={data.referenceNumber} onChange={(e) => setData({ ...data, referenceNumber: e.target.value })} placeholder="e.g. UTR / Cheque No." />
              </div>
              <div className="space-y-2">
                <Label>Notes (Optional)</Label>
                <Input value={data.notes} onChange={(e) => setData({ ...data, notes: e.target.value })} placeholder="Thank you!" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <Button onClick={() => printDocument("receipt-preview")} variant="outline" className="w-full">
            <Printer className="mr-2 h-4 w-4" /> Print
          </Button>
          <Button onClick={() => downloadDocument("receipt-preview", `Receipt-${data.receiptNumber}.html`)} className="w-full">
            <Download className="mr-2 h-4 w-4" /> Download
          </Button>
        </div>
        
        <Card>
          <CardContent className="p-0">
            <div id="receipt-preview" className="bg-white p-8 text-black min-h-[500px]" style={{ background: "#ffffff", color: "#111827", padding: "32px", fontFamily: "sans-serif" }}>
              <div className="border-b-2 border-gray-200 pb-6 mb-6" style={{ borderBottom: "2px solid #e5e7eb", paddingBottom: "24px", marginBottom: "24px" }}>
                <h1 className="text-3xl font-bold text-gray-800 uppercase tracking-wider mb-2" style={{ fontSize: "28px", fontWeight: "800", color: "#1f2937" }}>Receipt</h1>
                {data.businessName ? (
                  <div className="text-gray-600" style={{ color: "#4b5563" }}>
                    <p className="font-bold text-lg text-gray-800" style={{ fontSize: "18px", fontWeight: "700", color: "#1f2937" }}>{data.businessName}</p>
                    {data.businessAddress && <p>{data.businessAddress}</p>}
                    {data.businessPhone && <p>{data.businessPhone}</p>}
                  </div>
                ) : (
                  <p className="text-gray-400 italic" style={{ color: "#9ca3af", fontStyle: "italic" }}>Your Business Details Here</p>
                )}
              </div>

              <div className="flex justify-between mb-8" style={{ display: "flex", justifyContent: "space-between", marginBottom: "32px" }}>
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase" style={{ fontSize: "11px", fontWeight: "700", color: "#6b7280" }}>Received From</p>
                  <p className="font-medium text-lg" style={{ fontSize: "18px", fontWeight: "600" }}>{data.customerName || "Customer Name"}</p>
                </div>
                <div className="text-right" style={{ textAlign: "right" }}>
                  <div className="mb-2">
                    <p className="text-sm font-semibold text-gray-500 uppercase inline-block mr-2" style={{ fontSize: "11px", fontWeight: "700", color: "#6b7280" }}>Receipt No:</p>
                    <span className="font-medium" style={{ fontWeight: "600" }}>{data.receiptNumber}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-500 uppercase inline-block mr-2" style={{ fontSize: "11px", fontWeight: "700", color: "#6b7280" }}>Date:</p>
                    <span className="font-medium" style={{ fontWeight: "600" }}>{data.date}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-8" style={{ backgroundColor: "#f9fafb", padding: "24px", borderRadius: "8px", border: "1px solid #e5e7eb", marginBottom: "32px" }}>
                <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-4" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e5e7eb", paddingBottom: "16px", marginBottom: "16px" }}>
                  <div>
                    <p className="text-sm font-semibold text-gray-500 uppercase" style={{ fontSize: "11px", fontWeight: "700", color: "#6b7280" }}>Amount Received</p>
                    <p className="text-3xl font-bold text-gray-800" style={{ fontSize: "28px", fontWeight: "800", color: "#1f2937" }}>{isValidAmount ? formatINR(amountNum) : "₹0.00"}</p>
                  </div>
                  <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold" style={{ backgroundColor: "#dbeafe", color: "#1e40af", padding: "4px 12px", borderRadius: "9999px", fontSize: "12px", fontWeight: "600" }}>
                    {data.paymentMethod}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase mb-1" style={{ fontSize: "11px", fontWeight: "700", color: "#6b7280" }}>Amount in Words</p>
                  <p className="font-medium text-gray-700 capitalize" style={{ fontWeight: "600", color: "#374151", textTransform: "capitalize" }}>{isValidAmount ? amountInWords : "Zero Rupees"}</p>
                </div>
              </div>

              <div className="mb-8" style={{ marginBottom: "32px" }}>
                <p className="text-sm font-semibold text-gray-500 uppercase mb-2" style={{ fontSize: "11px", fontWeight: "700", color: "#6b7280" }}>For Payment Of</p>
                <p className="text-gray-800 border-b border-gray-200 pb-2" style={{ color: "#1f2937", borderBottom: "1px solid #e5e7eb", paddingBottom: "8px" }}>{data.description || "—"}</p>
              </div>

              {(data.referenceNumber || data.notes) && (
                <div className="text-sm text-gray-600 space-y-1 mb-12" style={{ color: "#4b5563", marginBottom: "48px" }}>
                  {data.referenceNumber && <p><span className="font-semibold" style={{ fontWeight: "600" }}>Ref No:</span> {data.referenceNumber}</p>}
                  {data.notes && <p><span className="font-semibold" style={{ fontWeight: "600" }}>Notes:</span> {data.notes}</p>}
                </div>
              )}

              <div className="mt-12 flex justify-end" style={{ marginTop: "48px", display: "flex", justifyContent: "flex-end" }}>
                <div className="text-center w-48" style={{ textAlign: "center", width: "180px" }}>
                  <div className="border-b border-gray-400 mb-2 h-8" style={{ borderBottom: "1px solid #9ca3af", height: "32px", marginBottom: "8px" }}></div>
                  <p className="text-sm text-gray-500" style={{ fontSize: "12px", color: "#6b7280" }}>Authorized Signature</p>
                </div>
              </div>
              
              <div className="mt-8 text-center border-t border-gray-100 pt-4" style={{ marginTop: "32px", textAlign: "center", borderTop: "1px solid #f3f4f6", paddingTop: "16px" }}>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600" style={{ fontSize: "11px", color: "#059669" }}>
                  ● Generated via Toolza
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
