import { useState, useMemo } from "react"
import { Printer, Download, Plus, Trash2 } from "lucide-react"
import type { ToolDefinition } from "@/data/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { printDocument, downloadPdf } from "@/features/tools/business/shared/documentHelpers"
import { convertNumberToWords } from "@/features/tools/business/shared/numberToWords"
import { formatINR } from "@/lib/utils"
import { computeDocumentTotals, type LineItem, type GstRate } from "./engine"
import { SegmentedControl } from "@/components/ui/segmented"

export default function QuotationGenerator({ tool: _tool }: { tool: ToolDefinition }) {
  const [businessInfo, setBusinessInfo] = useState({
    name: "", address: "", gstin: "", phone: "", email: ""
  })
  
  const [customerInfo, setCustomerInfo] = useState({
    name: "", address: "", gstin: "", phone: ""
  })

  const [quoteMeta, setQuoteMeta] = useState({
    quoteNumber: "QUO-001",
    date: new Date().toISOString().slice(0, 10),
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    interState: false
  })

  const [notes, setNotes] = useState("Terms & Conditions apply.")

  const [items, setItems] = useState<LineItem[]>([
    { id: crypto.randomUUID(), description: "", qty: 1, unitPrice: 0, discountPct: 0, gstRate: 18 }
  ])

  const totals = useMemo(() => computeDocumentTotals(items, quoteMeta.interState), [items, quoteMeta.interState])
  const amountInWords = useMemo(() => convertNumberToWords(totals.finalAmount, { system: "indian", mode: "currency" }).words, [totals.finalAmount])

  const addItem = () => setItems([...items, { id: crypto.randomUUID(), description: "", qty: 1, unitPrice: 0, discountPct: 0, gstRate: 18 }])
  const removeItem = (id: string) => setItems(items.filter(i => i.id !== id))
  
  const updateItem = (id: string, field: keyof LineItem, value: any) => {
    setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i))
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="lg:w-1/2 flex flex-col gap-6">
        <Card>
          <CardHeader><CardTitle>Business Info</CardTitle></CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2"><Label>Business Name</Label><Input value={businessInfo.name} onChange={e => setBusinessInfo({...businessInfo, name: e.target.value})} /></div>
            <div className="space-y-2"><Label>GSTIN</Label><Input value={businessInfo.gstin} onChange={e => setBusinessInfo({...businessInfo, gstin: e.target.value})} /></div>
            <div className="space-y-2 sm:col-span-2"><Label>Address</Label><Input value={businessInfo.address} onChange={e => setBusinessInfo({...businessInfo, address: e.target.value})} /></div>
            <div className="space-y-2"><Label>Phone</Label><Input value={businessInfo.phone} onChange={e => setBusinessInfo({...businessInfo, phone: e.target.value})} /></div>
            <div className="space-y-2"><Label>Email</Label><Input value={businessInfo.email} onChange={e => setBusinessInfo({...businessInfo, email: e.target.value})} /></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Customer Info</CardTitle></CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2"><Label>Customer Name</Label><Input value={customerInfo.name} onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})} /></div>
            <div className="space-y-2"><Label>GSTIN</Label><Input value={customerInfo.gstin} onChange={e => setCustomerInfo({...customerInfo, gstin: e.target.value})} /></div>
            <div className="space-y-2 sm:col-span-2"><Label>Address</Label><Input value={customerInfo.address} onChange={e => setCustomerInfo({...customerInfo, address: e.target.value})} /></div>
            <div className="space-y-2"><Label>Phone</Label><Input value={customerInfo.phone} onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})} /></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Quotation Details</CardTitle></CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2"><Label>Quote Number</Label><Input value={quoteMeta.quoteNumber} onChange={e => setQuoteMeta({...quoteMeta, quoteNumber: e.target.value})} /></div>
            <div className="space-y-2"><Label>Date</Label><Input type="date" value={quoteMeta.date} onChange={e => setQuoteMeta({...quoteMeta, date: e.target.value})} /></div>
            <div className="space-y-2"><Label>Valid Until</Label><Input type="date" value={quoteMeta.validUntil} onChange={e => setQuoteMeta({...quoteMeta, validUntil: e.target.value})} /></div>
            <div className="space-y-2"><Label>Supply Type</Label>
              <SegmentedControl<"intra" | "inter">
                options={[
                  { value: "intra", label: "Intra-state", sub: "CGST + SGST" },
                  { value: "inter", label: "Inter-state", sub: "IGST" },
                ]}
                value={quoteMeta.interState ? "inter" : "intra"}
                onChange={(val) => setQuoteMeta({...quoteMeta, interState: val === "inter"})}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>Items</CardTitle>
            <Button size="sm" onClick={addItem}><Plus className="h-4 w-4 mr-2" /> Add Item</Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.map((item, index) => (
              <div key={item.id} className="grid gap-2 p-4 border rounded-lg bg-gray-50/50">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-sm">Item {index + 1}</span>
                  {items.length > 1 && <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>}
                </div>
                <div className="grid gap-4 sm:grid-cols-12">
                  <div className="sm:col-span-12 space-y-1"><Label>Description</Label><Input value={item.description} onChange={e => updateItem(item.id, "description", e.target.value)} /></div>
                  <div className="sm:col-span-3 space-y-1"><Label>Qty</Label><Input type="number" min="1" value={item.qty || ""} onChange={e => updateItem(item.id, "qty", parseFloat(e.target.value) || 0)} /></div>
                  <div className="sm:col-span-3 space-y-1"><Label>Price (₹)</Label><Input type="number" min="0" value={item.unitPrice || ""} onChange={e => updateItem(item.id, "unitPrice", parseFloat(e.target.value) || 0)} /></div>
                  <div className="sm:col-span-3 space-y-1"><Label>Disc (%)</Label><Input type="number" min="0" max="100" value={item.discountPct || ""} onChange={e => updateItem(item.id, "discountPct", parseFloat(e.target.value) || 0)} /></div>
                  <div className="sm:col-span-3 space-y-1"><Label>GST (%)</Label>
                    <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" 
                      value={item.gstRate} onChange={e => updateItem(item.id, "gstRate", parseInt(e.target.value) as GstRate)}>
                      {[0, 3, 5, 12, 18, 28].map(r => <option key={r} value={r}>{r}%</option>)}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Notes & Terms</CardTitle></CardHeader>
          <CardContent>
            <textarea className="w-full min-h-[100px] p-3 rounded-md border text-sm" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Terms and conditions..." />
          </CardContent>
        </Card>
      </div>

      <div className="lg:w-1/2 flex flex-col gap-4">
        <div className="flex gap-2 sticky top-4 z-10 bg-background/95 p-2 backdrop-blur rounded-lg shadow-sm border">
          <Button onClick={() => printDocument("quotation-preview")} variant="outline" className="flex-1"><Printer className="mr-2 h-4 w-4" /> Print</Button>
          <Button onClick={() => downloadPdf("quotation-preview", `Quote-${quoteMeta.quoteNumber}.pdf`)} className="flex-1"><Download className="mr-2 h-4 w-4" /> Download PDF</Button>
        </div>

        <div className="border shadow-sm rounded-lg overflow-hidden bg-white text-black">
          <div id="quotation-preview" className="p-8 bg-white text-black min-h-[700px] text-sm leading-relaxed" style={{ background: "#ffffff", color: "#111827", padding: "32px", fontFamily: "sans-serif" }}>
            <div className="flex justify-between items-start mb-8 pb-6 border-b-2 border-gray-200" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px", paddingBottom: "24px", borderBottom: "2px solid #e5e7eb" }}>
              <div>
                <h1 className="text-3xl font-bold text-gray-800 uppercase tracking-wider mb-2" style={{ fontSize: "28px", fontWeight: "800", color: "#1f2937" }}>Quotation</h1>
                {businessInfo.name ? (
                  <div>
                    <p className="font-bold text-lg text-gray-800" style={{ fontSize: "18px", fontWeight: "700", color: "#1f2937" }}>{businessInfo.name}</p>
                    {businessInfo.address && <p style={{ color: "#4b5563" }}>{businessInfo.address}</p>}
                    {businessInfo.phone && <p style={{ color: "#4b5563" }}>Phone: {businessInfo.phone}</p>}
                    {businessInfo.email && <p style={{ color: "#4b5563" }}>Email: {businessInfo.email}</p>}
                    {businessInfo.gstin && <p className="mt-1 font-mono text-xs font-semibold" style={{ marginTop: "4px", fontFamily: "monospace", fontSize: "12px", fontWeight: "600" }}>GSTIN: {businessInfo.gstin}</p>}
                  </div>
                ) : (
                  <p className="text-gray-400 italic" style={{ color: "#9ca3af", fontStyle: "italic" }}>Your Business Details Here</p>
                )}
              </div>
              <div className="text-right" style={{ textAlign: "right" }}>
                <p className="text-sm font-semibold text-gray-500 uppercase mb-1" style={{ fontSize: "11px", fontWeight: "700", color: "#6b7280" }}>Quotation Details</p>
                <p><span className="font-semibold" style={{ fontWeight: "600" }}>Quote No:</span> {quoteMeta.quoteNumber}</p>
                <p><span className="font-semibold" style={{ fontWeight: "600" }}>Date:</span> {quoteMeta.date}</p>
                <p><span className="font-semibold" style={{ fontWeight: "600" }}>Valid Until:</span> {quoteMeta.validUntil}</p>
              </div>
            </div>

            <div className="mb-8" style={{ marginBottom: "32px" }}>
              <p className="text-sm font-semibold text-gray-500 uppercase mb-2" style={{ fontSize: "11px", fontWeight: "700", color: "#6b7280", textTransform: "uppercase", marginBottom: "8px" }}>Quote To:</p>
              <p className="font-bold text-lg text-gray-800" style={{ fontSize: "18px", fontWeight: "700", color: "#1f2937" }}>{customerInfo.name || "Client Name"}</p>
              {customerInfo.address && <p style={{ color: "#4b5563" }}>{customerInfo.address}</p>}
              {customerInfo.phone && <p style={{ color: "#4b5563" }}>{customerInfo.phone}</p>}
              {customerInfo.gstin && <p className="mt-1 font-mono text-xs font-semibold" style={{ marginTop: "4px", fontFamily: "monospace", fontSize: "12px", fontWeight: "600" }}>GSTIN: {customerInfo.gstin}</p>}
            </div>

            <table className="w-full mb-8 text-left border-collapse" style={{ width: "100%", marginBottom: "32px", borderCollapse: "collapse" }}>
              <thead>
                <tr className="bg-gray-100 border-y-2 border-gray-300" style={{ backgroundColor: "#f3f4f6", borderTop: "2px solid #d1d5db", borderBottom: "2px solid #d1d5db" }}>
                  <th className="py-2 px-3 font-semibold text-gray-700" style={{ padding: "8px 12px", textAlign: "left", fontWeight: "600", color: "#374151" }}>Description</th>
                  <th className="py-2 px-3 font-semibold text-gray-700 text-right" style={{ padding: "8px 12px", textAlign: "right", fontWeight: "600", color: "#374151" }}>Qty</th>
                  <th className="py-2 px-3 font-semibold text-gray-700 text-right" style={{ padding: "8px 12px", textAlign: "right", fontWeight: "600", color: "#374151" }}>Price</th>
                  <th className="py-2 px-3 font-semibold text-gray-700 text-right" style={{ padding: "8px 12px", textAlign: "right", fontWeight: "600", color: "#374151" }}>Disc %</th>
                  <th className="py-2 px-3 font-semibold text-gray-700 text-right" style={{ padding: "8px 12px", textAlign: "right", fontWeight: "600", color: "#374151" }}>GST %</th>
                  <th className="py-2 px-3 font-semibold text-gray-700 text-right" style={{ padding: "8px 12px", textAlign: "right", fontWeight: "600", color: "#374151" }}>Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {items.map((item) => {
                  const sub = item.qty * item.unitPrice
                  const disc = sub * (item.discountPct / 100)
                  const tax = sub - disc
                  const gst = tax * (item.gstRate / 100)
                  const lineTotal = tax + gst
                  return (
                    <tr key={item.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                      <td className="py-3 px-3" style={{ padding: "12px" }}>{item.description || "—"}</td>
                      <td className="py-3 px-3 text-right" style={{ padding: "12px", textAlign: "right" }}>{item.qty}</td>
                      <td className="py-3 px-3 text-right" style={{ padding: "12px", textAlign: "right" }}>{formatINR(item.unitPrice)}</td>
                      <td className="py-3 px-3 text-right" style={{ padding: "12px", textAlign: "right" }}>{item.discountPct}%</td>
                      <td className="py-3 px-3 text-right" style={{ padding: "12px", textAlign: "right" }}>{item.gstRate}%</td>
                      <td className="py-3 px-3 text-right" style={{ padding: "12px", textAlign: "right", fontWeight: "600" }}>{formatINR(lineTotal)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            <div className="flex justify-end mb-8" style={{ display: "flex", justifyContent: "flex-end", marginBottom: "32px" }}>
              <div className="w-64 space-y-2 text-gray-600" style={{ width: "260px", color: "#4b5563" }}>
                <div className="flex justify-between" style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}><p>Subtotal</p><p>{formatINR(totals.subtotal)}</p></div>
                {totals.totalDiscount > 0 && <div className="flex justify-between text-red-600" style={{ display: "flex", justifyContent: "space-between", color: "#dc2626", marginBottom: "4px" }}><p>Discount</p><p>- {formatINR(totals.totalDiscount)}</p></div>}
                <div className="flex justify-between font-medium" style={{ display: "flex", justifyContent: "space-between", fontWeight: "600", marginBottom: "4px" }}><p>Taxable Amount</p><p>{formatINR(totals.taxableAmount)}</p></div>
                
                {quoteMeta.interState ? (
                  <div className="flex justify-between" style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}><p>IGST</p><p>{formatINR(totals.igst)}</p></div>
                ) : (
                  <>
                    <div className="flex justify-between" style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}><p>CGST</p><p>{formatINR(totals.cgst)}</p></div>
                    <div className="flex justify-between" style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}><p>SGST</p><p>{formatINR(totals.sgst)}</p></div>
                  </>
                )}
                
                {totals.roundOff !== 0 && <div className="flex justify-between text-xs" style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "4px" }}><p>Round Off</p><p>{totals.roundOff > 0 ? "+" : ""}{totals.roundOff.toFixed(2)}</p></div>}
                <div className="flex justify-between font-bold text-lg text-gray-800 border-t-2 border-gray-300 pt-2 mt-2" style={{ display: "flex", justifyContent: "space-between", fontWeight: "700", fontSize: "18px", color: "#1f2937", borderTop: "2px solid #d1d5db", paddingTop: "8px", marginTop: "8px" }}>
                  <p>Grand Total</p><p>{formatINR(totals.finalAmount)}</p>
                </div>
              </div>
            </div>

            <div className="mb-12" style={{ marginBottom: "48px" }}>
              <p className="text-sm font-semibold text-gray-500 mb-1" style={{ fontSize: "11px", fontWeight: "700", color: "#6b7280", textTransform: "uppercase" }}>Amount in Words:</p>
              <p className="font-medium capitalize" style={{ fontWeight: "600", textTransform: "capitalize" }}>{amountInWords}</p>
            </div>

            {notes && (
              <div className="mt-8 pt-8 border-t border-gray-200" style={{ marginTop: "32px", paddingTop: "24px", borderTop: "1px solid #e5e7eb" }}>
                <p className="text-sm font-semibold text-gray-500 mb-2" style={{ fontSize: "11px", fontWeight: "700", color: "#6b7280", textTransform: "uppercase" }}>Terms & Conditions:</p>
                <p className="text-gray-600 whitespace-pre-wrap text-sm" style={{ color: "#4b5563", whiteSpace: "pre-wrap" }}>{notes}</p>
              </div>
            )}
            
            <div className="mt-8 text-center pt-4 opacity-50" style={{ marginTop: "32px", textAlign: "center", opacity: 0.6 }}>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium" style={{ fontSize: "11px", color: "#059669" }}>
                ● Generated via Toolza
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
