import { useState, useMemo } from "react"
import { Printer, Download, Plus, Trash2 } from "lucide-react"
import type { ToolDefinition } from "@/data/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SegmentedControl } from "@/components/ui/segmented"
import { printDocument, downloadPdf } from "@/features/tools/business/shared/documentHelpers"
import { convertNumberToWords } from "@/features/tools/business/shared/numberToWords"
import { formatINR } from "@/lib/utils"
import { computeDocumentTotals, type LineItem, type GstRate } from "./engine"

export default function InvoiceGenerator({ tool: _tool }: { tool: ToolDefinition }) {
  const [activeTab, setActiveTab] = useState("Business")

  const [businessInfo, setBusinessInfo] = useState({
    name: "", address: "", gstin: "", phone: "", email: "",
    bankName: "", accountNo: "", ifsc: "", upi: ""
  })
  
  const [customerInfo, setCustomerInfo] = useState({
    name: "", address: "", gstin: "", phone: "", email: ""
  })

  const [invoiceMeta, setInvoiceMeta] = useState({
    invoiceNumber: "INV-001",
    date: new Date().toISOString().slice(0, 10),
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    interState: false
  })

  const [notes, setNotes] = useState("Thank you for your business.")
  const [terms, setTerms] = useState("Payment due within 30 days.")
  const [logoUrl, setLogoUrl] = useState<string>("")

  const [items, setItems] = useState<LineItem[]>([
    { id: crypto.randomUUID(), description: "", qty: 1, unitPrice: 0, discountPct: 0, gstRate: 18 }
  ])

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 200 * 1024) {
        alert("File is too large. Max 200KB")
        return
      }
      const reader = new FileReader()
      reader.onload = (event) => setLogoUrl(event.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const totals = useMemo(() => computeDocumentTotals(items, invoiceMeta.interState), [items, invoiceMeta.interState])
  const amountInWords = useMemo(() => convertNumberToWords(totals.finalAmount, { system: "indian", mode: "currency" }).words, [totals.finalAmount])

  const addItem = () => setItems([...items, { id: crypto.randomUUID(), description: "", qty: 1, unitPrice: 0, discountPct: 0, gstRate: 18 }])
  const removeItem = (id: string) => setItems(items.filter(i => i.id !== id))
  const updateItem = (id: string, field: keyof LineItem, value: any) => setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i))

  return (
    <div className="flex flex-col xl:flex-row gap-8">
      <div className="xl:w-1/2 flex flex-col gap-6">
        
        <div className="bg-muted p-1 rounded-lg">
        <SegmentedControl<"Business" | "Customer" | "Invoice" | "Items">
            options={[
              { value: "Business", label: "Business" },
              { value: "Customer", label: "Customer" },
              { value: "Invoice", label: "Invoice" },
              { value: "Items", label: "Items" },
            ]}
            value={activeTab as "Business" | "Customer" | "Invoice" | "Items"}
            onChange={setActiveTab}
            className="grid-cols-4"
          />
        </div>

        {activeTab === "Business" && (
          <Card>
            <CardHeader><CardTitle>Business Information</CardTitle></CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2 space-y-2">
                <Label>Business Logo (Max 200KB)</Label>
                <div className="flex items-center gap-4">
                  <Input type="file" accept="image/png, image/jpeg" onChange={handleLogoUpload} className="w-full" />
                  {logoUrl && <img src={logoUrl} alt="Logo" className="h-10 object-contain" />}
                </div>
              </div>
              <div className="space-y-2"><Label>Business Name</Label><Input value={businessInfo.name} onChange={e => setBusinessInfo({...businessInfo, name: e.target.value})} /></div>
              <div className="space-y-2"><Label>GSTIN (Optional)</Label><Input value={businessInfo.gstin} onChange={e => setBusinessInfo({...businessInfo, gstin: e.target.value})} /></div>
              <div className="space-y-2 sm:col-span-2"><Label>Address</Label><Input value={businessInfo.address} onChange={e => setBusinessInfo({...businessInfo, address: e.target.value})} /></div>
              <div className="space-y-2"><Label>Phone</Label><Input value={businessInfo.phone} onChange={e => setBusinessInfo({...businessInfo, phone: e.target.value})} /></div>
              <div className="space-y-2"><Label>Email</Label><Input value={businessInfo.email} onChange={e => setBusinessInfo({...businessInfo, email: e.target.value})} /></div>
              
              <div className="sm:col-span-2 mt-4 border-t pt-4 font-semibold">Payment / Bank Details</div>
              <div className="space-y-2"><Label>Bank Name</Label><Input value={businessInfo.bankName} onChange={e => setBusinessInfo({...businessInfo, bankName: e.target.value})} /></div>
              <div className="space-y-2"><Label>Account Number</Label><Input value={businessInfo.accountNo} onChange={e => setBusinessInfo({...businessInfo, accountNo: e.target.value})} /></div>
              <div className="space-y-2"><Label>IFSC Code</Label><Input value={businessInfo.ifsc} onChange={e => setBusinessInfo({...businessInfo, ifsc: e.target.value})} /></div>
              <div className="space-y-2"><Label>UPI ID</Label><Input value={businessInfo.upi} onChange={e => setBusinessInfo({...businessInfo, upi: e.target.value})} /></div>
            </CardContent>
          </Card>
        )}

        {activeTab === "Customer" && (
          <Card>
            <CardHeader><CardTitle>Customer Information</CardTitle></CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label>Customer Name</Label><Input value={customerInfo.name} onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})} /></div>
              <div className="space-y-2"><Label>GSTIN (Optional)</Label><Input value={customerInfo.gstin} onChange={e => setCustomerInfo({...customerInfo, gstin: e.target.value})} /></div>
              <div className="space-y-2 sm:col-span-2"><Label>Address</Label><Input value={customerInfo.address} onChange={e => setCustomerInfo({...customerInfo, address: e.target.value})} /></div>
              <div className="space-y-2"><Label>Phone</Label><Input value={customerInfo.phone} onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})} /></div>
              <div className="space-y-2"><Label>Email</Label><Input value={customerInfo.email} onChange={e => setCustomerInfo({...customerInfo, email: e.target.value})} /></div>
            </CardContent>
          </Card>
        )}

        {activeTab === "Invoice" && (
          <Card>
            <CardHeader><CardTitle>Invoice Meta & Notes</CardTitle></CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label>Invoice Number</Label><Input value={invoiceMeta.invoiceNumber} onChange={e => setInvoiceMeta({...invoiceMeta, invoiceNumber: e.target.value})} /></div>
              <div className="space-y-2"><Label>Supply Type</Label>
                <SegmentedControl<"intra" | "inter">
                  options={[
                    { value: "intra", label: "Intra-state", sub: "CGST + SGST" },
                    { value: "inter", label: "Inter-state", sub: "IGST" },
                  ]}
                  value={invoiceMeta.interState ? "inter" : "intra"}
                  onChange={(val) => setInvoiceMeta({...invoiceMeta, interState: val === "inter"})}
                />
              </div>
              <div className="space-y-2"><Label>Invoice Date</Label><Input type="date" value={invoiceMeta.date} onChange={e => setInvoiceMeta({...invoiceMeta, date: e.target.value})} /></div>
              <div className="space-y-2"><Label>Due Date</Label><Input type="date" value={invoiceMeta.dueDate} onChange={e => setInvoiceMeta({...invoiceMeta, dueDate: e.target.value})} /></div>
              <div className="sm:col-span-2 space-y-2"><Label>Notes (e.g. Thank you message)</Label><Input value={notes} onChange={e => setNotes(e.target.value)} /></div>
              <div className="sm:col-span-2 space-y-2"><Label>Terms & Conditions</Label><Input value={terms} onChange={e => setTerms(e.target.value)} /></div>
            </CardContent>
          </Card>
        )}

        {activeTab === "Items" && (
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>Line Items</CardTitle>
              <Button size="sm" onClick={addItem}><Plus className="h-4 w-4 mr-2" /> Add Item</Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item, index) => {
                const sub = item.qty * item.unitPrice
                const disc = sub * (item.discountPct / 100)
                const tax = sub - disc
                const gst = tax * (item.gstRate / 100)
                const lineTotal = tax + gst

                return (
                  <div key={item.id} className="grid gap-3 p-4 border rounded-lg bg-gray-50/50">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-sm">Item {index + 1}</span>
                      {items.length > 1 && <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>}
                    </div>
                    <div className="grid gap-3 sm:grid-cols-12">
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
                    <div className="text-right text-xs text-muted-foreground mt-2">
                      Taxable: {formatINR(tax)} | GST: {formatINR(gst)} | <span className="font-semibold text-foreground">Total: {formatINR(lineTotal)}</span>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        )}
      </div>

      <div className="xl:w-1/2 flex flex-col gap-4">
        <div className="flex gap-2 sticky top-4 z-10 bg-background/95 p-2 backdrop-blur rounded-lg shadow-sm border">
          <Button onClick={() => printDocument("invoice-preview")} variant="outline" className="flex-1"><Printer className="mr-2 h-4 w-4" /> Print</Button>
          <Button onClick={() => downloadPdf("invoice-preview", `Invoice-${invoiceMeta.invoiceNumber}.pdf`)} className="flex-1"><Download className="mr-2 h-4 w-4" /> Download PDF</Button>
        </div>

        <div className="border shadow-sm rounded-lg overflow-hidden bg-white text-black">
          <div id="invoice-preview" className="p-8 min-h-[900px] text-[13px] leading-relaxed relative" style={{ background: "#ffffff", color: "#111827", padding: "32px", fontFamily: "sans-serif" }}>
            <div className="flex justify-between items-start mb-8 pb-6 border-b-2 border-gray-800" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px", paddingBottom: "24px", borderBottom: "2px solid #1f2937" }}>
              <div className="w-1/2" style={{ width: "50%" }}>
                {logoUrl && (
                  <img 
                    src={logoUrl} 
                    alt="Logo" 
                    className="max-h-16 object-contain mb-4" 
                    style={{ maxHeight: "64px", maxWidth: "220px", objectFit: "contain", marginBottom: "16px", display: "block" }} 
                  />
                )}
                <h2 className="font-bold text-xl text-gray-900" style={{ fontSize: "20px", fontWeight: "700", color: "#111827" }}>{businessInfo.name || "Your Business Name"}</h2>
                {businessInfo.address && <p className="text-gray-600 mt-1 whitespace-pre-wrap" style={{ color: "#4b5563", marginTop: "4px", whiteSpace: "pre-wrap" }}>{businessInfo.address}</p>}
                {businessInfo.phone && <p className="text-gray-600" style={{ color: "#4b5563" }}>Phone: {businessInfo.phone}</p>}
                {businessInfo.email && <p className="text-gray-600" style={{ color: "#4b5563" }}>Email: {businessInfo.email}</p>}
                {businessInfo.gstin && <p className="mt-2 font-mono font-bold text-gray-800" style={{ marginTop: "8px", fontFamily: "monospace", fontWeight: "700", color: "#1f2937" }}>GSTIN: {businessInfo.gstin}</p>}
              </div>
              <div className="w-1/2 text-right" style={{ width: "50%", textAlign: "right" }}>
                <h1 className="text-4xl font-bold text-gray-800 uppercase tracking-wider" style={{ fontSize: "32px", fontWeight: "800", color: "#1f2937", textTransform: "uppercase", letterSpacing: "1px" }}>Tax Invoice</h1>
                <div className="mt-4 grid grid-cols-2 gap-2 text-right" style={{ marginTop: "16px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", textAlign: "right" }}>
                  <div className="text-gray-500 font-semibold" style={{ color: "#6b7280", fontWeight: "600" }}>Invoice No:</div>
                  <div className="font-bold text-gray-900" style={{ fontWeight: "700", color: "#111827" }}>{invoiceMeta.invoiceNumber}</div>
                  <div className="text-gray-500 font-semibold" style={{ color: "#6b7280", fontWeight: "600" }}>Date:</div>
                  <div className="font-medium" style={{ fontWeight: "500" }}>{invoiceMeta.date}</div>
                  <div className="text-gray-500 font-semibold" style={{ color: "#6b7280", fontWeight: "600" }}>Due Date:</div>
                  <div className="font-medium" style={{ fontWeight: "500" }}>{invoiceMeta.dueDate}</div>
                </div>
              </div>
            </div>

            <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200" style={{ marginBottom: "32px", padding: "16px", backgroundColor: "#f9fafb", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2" style={{ fontSize: "11px", fontWeight: "700", color: "#6b7280", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>Billed To:</p>
              <h3 className="font-bold text-lg text-gray-900" style={{ fontSize: "18px", fontWeight: "700", color: "#111827" }}>{customerInfo.name || "Customer Name"}</h3>
              {customerInfo.address && <p className="text-gray-700 mt-1 whitespace-pre-wrap" style={{ color: "#374151", marginTop: "4px", whiteSpace: "pre-wrap" }}>{customerInfo.address}</p>}
              <div className="mt-2 grid grid-cols-2 gap-2" style={{ marginTop: "8px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                {customerInfo.phone && <p className="text-gray-600" style={{ color: "#4b5563" }}>Phone: {customerInfo.phone}</p>}
                {customerInfo.email && <p className="text-gray-600" style={{ color: "#4b5563" }}>Email: {customerInfo.email}</p>}
              </div>
              {customerInfo.gstin && <p className="mt-2 font-mono font-bold text-gray-800" style={{ marginTop: "8px", fontFamily: "monospace", fontWeight: "700", color: "#1f2937" }}>GSTIN: {customerInfo.gstin}</p>}
            </div>

            <table className="w-full mb-6 border-collapse" style={{ width: "100%", marginBottom: "24px", borderCollapse: "collapse" }}>
              <thead>
                <tr className="bg-gray-800 text-white" style={{ backgroundColor: "#1f2937", color: "#ffffff" }}>
                  <th className="py-2 px-3 font-semibold text-left" style={{ padding: "8px 12px", textAlign: "left", fontWeight: "600" }}>Description</th>
                  <th className="py-2 px-3 font-semibold text-right" style={{ padding: "8px 12px", textAlign: "right", fontWeight: "600" }}>Qty</th>
                  <th className="py-2 px-3 font-semibold text-right" style={{ padding: "8px 12px", textAlign: "right", fontWeight: "600" }}>Rate</th>
                  <th className="py-2 px-3 font-semibold text-right" style={{ padding: "8px 12px", textAlign: "right", fontWeight: "600" }}>Disc</th>
                  <th className="py-2 px-3 font-semibold text-right" style={{ padding: "8px 12px", textAlign: "right", fontWeight: "600" }}>Taxable</th>
                  <th className="py-2 px-3 font-semibold text-right" style={{ padding: "8px 12px", textAlign: "right", fontWeight: "600" }}>GST %</th>
                  <th className="py-2 px-3 font-semibold text-right" style={{ padding: "8px 12px", textAlign: "right", fontWeight: "600" }}>Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 border-b-2 border-gray-800">
                {items.map((item) => {
                  const sub = item.qty * item.unitPrice
                  const disc = sub * (item.discountPct / 100)
                  const tax = sub - disc
                  const gst = tax * (item.gstRate / 100)
                  const lineTotal = tax + gst
                  return (
                    <tr key={item.id} className="hover:bg-gray-50" style={{ borderBottom: "1px solid #e5e7eb" }}>
                      <td className="py-3 px-3" style={{ padding: "12px" }}>{item.description || "—"}</td>
                      <td className="py-3 px-3 text-right" style={{ padding: "12px", textAlign: "right" }}>{item.qty}</td>
                      <td className="py-3 px-3 text-right" style={{ padding: "12px", textAlign: "right" }}>{formatINR(item.unitPrice)}</td>
                      <td className="py-3 px-3 text-right" style={{ padding: "12px", textAlign: "right" }}>{item.discountPct > 0 ? `${item.discountPct}%` : "-"}</td>
                      <td className="py-3 px-3 text-right" style={{ padding: "12px", textAlign: "right" }}>{formatINR(tax)}</td>
                      <td className="py-3 px-3 text-right" style={{ padding: "12px", textAlign: "right" }}>{item.gstRate}%</td>
                      <td className="py-3 px-3 text-right font-medium" style={{ padding: "12px", textAlign: "right", fontWeight: "600" }}>{formatINR(lineTotal)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            <div className="flex flex-row justify-between mb-8" style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginBottom: "32px" }}>
              <div className="w-1/2 pr-8" style={{ width: "50%", paddingRight: "32px" }}>
                <div className="mb-6" style={{ marginBottom: "24px" }}>
                  <p className="text-xs font-bold text-gray-500 uppercase mb-1" style={{ fontSize: "11px", fontWeight: "700", color: "#6b7280", textTransform: "uppercase", marginBottom: "4px" }}>Invoice Amount In Words</p>
                  <p className="font-semibold text-gray-800 capitalize" style={{ fontWeight: "600", color: "#1f2937", textTransform: "capitalize" }}>{amountInWords}</p>
                </div>
                
                {(businessInfo.bankName || businessInfo.accountNo || businessInfo.upi) && (
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200" style={{ backgroundColor: "#f9fafb", padding: "16px", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
                    <p className="text-xs font-bold text-gray-500 uppercase mb-2" style={{ fontSize: "11px", fontWeight: "700", color: "#6b7280", textTransform: "uppercase", marginBottom: "8px" }}>Payment Details</p>
                    {businessInfo.bankName && <p style={{ color: "#374151" }}><span style={{ fontWeight: "600" }}>Bank:</span> {businessInfo.bankName}</p>}
                    {businessInfo.accountNo && <p style={{ color: "#374151" }}><span style={{ fontWeight: "600" }}>A/c No:</span> {businessInfo.accountNo}</p>}
                    {businessInfo.ifsc && <p style={{ color: "#374151" }}><span style={{ fontWeight: "600" }}>IFSC:</span> {businessInfo.ifsc}</p>}
                    {businessInfo.upi && <p style={{ color: "#374151", marginTop: "4px" }}><span style={{ fontWeight: "600" }}>UPI ID:</span> {businessInfo.upi}</p>}
                  </div>
                )}
              </div>
              
              <div className="w-1/2 md:w-2/5" style={{ width: "45%" }}>
                <div className="space-y-2 text-gray-700" style={{ color: "#374151" }}>
                  <div className="flex justify-between" style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}><p>Subtotal</p><p>{formatINR(totals.subtotal)}</p></div>
                  {totals.totalDiscount > 0 && <div className="flex justify-between text-red-600" style={{ display: "flex", justifyContent: "space-between", color: "#dc2626", marginBottom: "6px" }}><p>Total Discount</p><p>- {formatINR(totals.totalDiscount)}</p></div>}
                  <div className="flex justify-between font-medium pt-2 border-t" style={{ display: "flex", justifyContent: "space-between", fontWeight: "600", paddingTop: "8px", borderTop: "1px solid #e5e7eb", marginBottom: "6px" }}><p>Taxable Amount</p><p>{formatINR(totals.taxableAmount)}</p></div>
                  
                  {invoiceMeta.interState ? (
                    <div className="flex justify-between" style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}><p>IGST</p><p>{formatINR(totals.igst)}</p></div>
                  ) : (
                    <>
                      <div className="flex justify-between" style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}><p>CGST</p><p>{formatINR(totals.cgst)}</p></div>
                      <div className="flex justify-between" style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}><p>SGST</p><p>{formatINR(totals.sgst)}</p></div>
                    </>
                  )}
                  
                  {totals.roundOff !== 0 && <div className="flex justify-between text-xs" style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "6px" }}><p>Round Off</p><p>{totals.roundOff > 0 ? "+" : ""}{totals.roundOff.toFixed(2)}</p></div>}
                  <div className="flex justify-between font-bold text-xl text-gray-900 border-y-2 border-gray-800 py-3 mt-3 bg-gray-50 px-2 rounded-sm" style={{ display: "flex", justifyContent: "space-between", fontWeight: "700", fontSize: "18px", color: "#111827", borderTop: "2px solid #1f2937", borderBottom: "2px solid #1f2937", padding: "12px 8px", backgroundColor: "#f9fafb", marginTop: "12px" }}>
                    <p>Grand Total</p><p>{formatINR(totals.finalAmount)}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-gray-200 pt-6" style={{ marginTop: "32px", borderTop: "1px solid #e5e7eb", paddingTop: "24px" }}>
              {notes && (
                <div className="mb-4" style={{ marginBottom: "16px" }}>
                  <p className="font-semibold text-gray-700" style={{ fontWeight: "600", color: "#374151" }}>Notes:</p>
                  <p className="text-gray-600" style={{ color: "#4b5563" }}>{notes}</p>
                </div>
              )}
              {terms && (
                <div style={{ marginTop: "8px" }}>
                  <p className="font-semibold text-gray-700" style={{ fontWeight: "600", color: "#374151" }}>Terms & Conditions:</p>
                  <p className="text-gray-600" style={{ color: "#4b5563" }}>{terms}</p>
                </div>
              )}
            </div>

            <div className="mt-16 flex justify-between items-end" style={{ marginTop: "48px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <div className="text-xs font-semibold text-gray-400 tracking-widest uppercase border-2 border-gray-200 p-2 rounded opacity-50 transform -rotate-12 inline-block" style={{ fontSize: "11px", fontWeight: "600", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "2px", border: "2px solid #e5e7eb", padding: "8px", borderRadius: "4px", opacity: 0.7 }}>
                Original for Recipient
              </div>
              <div className="text-center w-48" style={{ textAlign: "center", width: "180px" }}>
                <div className="border-b-2 border-gray-800 mb-2 h-12" style={{ borderBottom: "2px solid #1f2937", height: "40px", marginBottom: "8px" }}></div>
                <p className="text-sm font-bold text-gray-800" style={{ fontSize: "13px", fontWeight: "700", color: "#1f2937" }}>Authorized Signature</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
