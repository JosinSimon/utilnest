import { useState, useEffect } from "react"
import { QrCode, Download, Printer, Copy, Check } from "lucide-react"
import type { ToolDefinition } from "@/data/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  buildQrPayload,
  generateQrPng,
  generateQrSvg,
  type QrType,
  type QrOptions,
} from "./engine"

export default function QrCodeGenerator({ tool: _tool }: { tool: ToolDefinition }) {
  const [type, setType] = useState<QrType>("url")
  
  // Data state
  const [text, setText] = useState("Hello Toolza!")
  const [url, setUrl] = useState("https://toolza.com")
  const [email, setEmail] = useState({ email: "contact@example.com", subject: "Inquiry", body: "" })
  const [phone, setPhone] = useState("+919876543210")
  const [sms, setSms] = useState({ phone: "+919876543210", message: "Hello!" })
  const [wifi, setWifi] = useState<{ ssid: string; password?: string; encryption: "WPA" | "WEP" | "nopass"; hidden?: boolean }>({ ssid: "MyWiFiNetwork", password: "Password123", encryption: "WPA" })
  const [vcard, setVcard] = useState({ firstName: "John", lastName: "Doe", phone: "+919876543210", email: "john@example.com", organization: "Acme Inc" })
  const [upi, setUpi] = useState({ upiId: "merchant@upi", payeeName: "Acme Business", amount: 100, note: "Invoice Payment" })

  // Customization options
  const [options, setOptions] = useState<QrOptions>({
    size: 256,
    margin: 2,
    errorCorrection: "M",
    foregroundColor: "#000000",
    backgroundColor: "#ffffff",
  })

  // Rendered outputs
  const [pngUrl, setPngUrl] = useState<string>("")
  const [svgContent, setSvgContent] = useState<string>("")
  const [copied, setCopied] = useState(false)

  // Re-generate QR preview whenever payload or options change
  useEffect(() => {
    let payloadData: Record<string, unknown> = {}
    if (type === "url") payloadData = { url }
    else if (type === "text") payloadData = { text }
    else if (type === "email") payloadData = email
    else if (type === "phone") payloadData = { phone }
    else if (type === "sms") payloadData = sms
    else if (type === "wifi") payloadData = wifi
    else if (type === "vcard") payloadData = vcard
    else if (type === "upi") payloadData = upi

    const payload = buildQrPayload(type, payloadData)

    if (!payload) {
      setPngUrl("")
      setSvgContent("")
      return
    }

    generateQrPng(payload, options).then(setPngUrl)
    generateQrSvg(payload, options).then(setSvgContent)
  }, [type, text, url, email, phone, sms, wifi, vcard, upi, options])

  const handleDownloadPng = () => {
    if (!pngUrl) return
    const a = document.createElement("a")
    a.href = pngUrl
    a.download = `QRCode-${type}.png`
    a.click()
  }

  const handleDownloadSvg = () => {
    if (!svgContent) return
    const blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" })
    const urlStr = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = urlStr
    a.download = `QRCode-${type}.svg`
    a.click()
    URL.revokeObjectURL(urlStr)
  }

  const handleCopyPng = async () => {
    if (!pngUrl) return
    try {
      const res = await fetch(pngUrl)
      const blob = await res.blob()
      await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })])
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      alert("Failed to copy image to clipboard.")
    }
  }

  const handlePrint = () => {
    if (!pngUrl) return
    const win = window.open("", "_blank", "width=600,height=600")
    if (!win) return
    win.document.write(`
      <html>
        <head><title>Print QR Code</title></head>
        <body style="display:flex;justify-content:center;align-items:center;height:100vh;margin:0;">
          <img src="${pngUrl}" style="max-width:80%;height:auto;" />
          <script>window.onload = function() { window.print(); window.close(); };</script>
        </body>
      </html>
    `)
    win.document.close()
  }

  const typesList: { id: QrType; label: string }[] = [
    { id: "url", label: "Website URL" },
    { id: "upi", label: "UPI Payment" },
    { id: "wifi", label: "Wi-Fi Network" },
    { id: "vcard", label: "vCard Contact" },
    { id: "text", label: "Plain Text" },
    { id: "email", label: "Email" },
    { id: "phone", label: "Phone Call" },
    { id: "sms", label: "SMS Message" },
  ]

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      {/* Type Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5 text-primary" /> QR Code Type
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {typesList.map((t) => (
              <button
                key={t.id}
                onClick={() => setType(t.id)}
                className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all ${
                  type === t.id
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-background text-muted-foreground border-input hover:border-accent hover:text-foreground"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* Form Controls */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Content Details</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {type === "url" && (
                <div className="space-y-2">
                  <Label>Website URL</Label>
                  <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com" />
                </div>
              )}

              {type === "upi" && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <Label>UPI ID (VPA) *</Label>
                    <Input value={upi.upiId} onChange={(e) => setUpi({ ...upi, upiId: e.target.value })} placeholder="merchant@upi" />
                  </div>
                  <div className="space-y-2">
                    <Label>Payee Name (Optional)</Label>
                    <Input value={upi.payeeName} onChange={(e) => setUpi({ ...upi, payeeName: e.target.value })} placeholder="Acme Store" />
                  </div>
                  <div className="space-y-2">
                    <Label>Amount in ₹ (Optional)</Label>
                    <Input type="number" value={upi.amount || ""} onChange={(e) => setUpi({ ...upi, amount: parseFloat(e.target.value) || 0 })} placeholder="500" />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label>Transaction Note (Optional)</Label>
                    <Input value={upi.note} onChange={(e) => setUpi({ ...upi, note: e.target.value })} placeholder="Payment for Order #123" />
                  </div>
                </div>
              )}

              {type === "wifi" && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <Label>Network Name (SSID) *</Label>
                    <Input value={wifi.ssid} onChange={(e) => setWifi({ ...wifi, ssid: e.target.value })} placeholder="MyWiFiNetwork" />
                  </div>
                  <div className="space-y-2">
                    <Label>Password</Label>
                    <Input type="password" value={wifi.password} onChange={(e) => setWifi({ ...wifi, password: e.target.value })} placeholder="Password" />
                  </div>
                  <div className="space-y-2">
                    <Label>Encryption</Label>
                    <select
                      value={wifi.encryption}
                      onChange={(e) => setWifi({ ...wifi, encryption: e.target.value as "WPA" | "WEP" | "nopass" })}
                      className="w-full px-3 py-2 text-sm border rounded-md bg-background"
                    >
                      <option value="WPA">WPA / WPA2 / WPA3</option>
                      <option value="WEP">WEP</option>
                      <option value="nopass">None (Open Network)</option>
                    </select>
                  </div>
                </div>
              )}

              {type === "vcard" && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>First Name *</Label>
                    <Input value={vcard.firstName} onChange={(e) => setVcard({ ...vcard, firstName: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name</Label>
                    <Input value={vcard.lastName} onChange={(e) => setVcard({ ...vcard, lastName: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input value={vcard.phone} onChange={(e) => setVcard({ ...vcard, phone: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input value={vcard.email} onChange={(e) => setVcard({ ...vcard, email: e.target.value })} />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label>Organization / Company</Label>
                    <Input value={vcard.organization} onChange={(e) => setVcard({ ...vcard, organization: e.target.value })} />
                  </div>
                </div>
              )}

              {type === "text" && (
                <div className="space-y-2">
                  <Label>Plain Text</Label>
                  <textarea
                    rows={4}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Enter any text to encode into QR code..."
                    className="w-full p-3 text-sm border rounded-md bg-background"
                  />
                </div>
              )}

              {type === "email" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Email Address</Label>
                    <Input value={email.email} onChange={(e) => setEmail({ ...email, email: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Subject</Label>
                    <Input value={email.subject} onChange={(e) => setEmail({ ...email, subject: e.target.value })} />
                  </div>
                </div>
              )}

              {type === "phone" && (
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
              )}

              {type === "sms" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <Input value={sms.phone} onChange={(e) => setSms({ ...sms, phone: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Message</Label>
                    <Input value={sms.message} onChange={(e) => setSms({ ...sms, message: e.target.value })} />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Customization Options */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Customization Options</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Foreground Color</Label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={options.foregroundColor}
                    onChange={(e) => setOptions({ ...options, foregroundColor: e.target.value })}
                    className="h-9 w-12 rounded border cursor-pointer"
                  />
                  <Input value={options.foregroundColor} onChange={(e) => setOptions({ ...options, foregroundColor: e.target.value })} className="font-mono" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Background Color</Label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={options.backgroundColor}
                    onChange={(e) => setOptions({ ...options, backgroundColor: e.target.value })}
                    className="h-9 w-12 rounded border cursor-pointer"
                  />
                  <Input value={options.backgroundColor} onChange={(e) => setOptions({ ...options, backgroundColor: e.target.value })} className="font-mono" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Error Correction</Label>
                <select
                  value={options.errorCorrection}
                  onChange={(e) => setOptions({ ...options, errorCorrection: e.target.value as "L" | "M" | "Q" | "H" })}
                  className="w-full px-3 py-2 text-sm border rounded-md bg-background"
                >
                  <option value="L">Low (7% recovery)</option>
                  <option value="M">Medium (15% recovery)</option>
                  <option value="Q">Quartile (25% recovery)</option>
                  <option value="H">High (30% recovery)</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label>Resolution Size ({options.size}px)</Label>
                <input
                  type="range"
                  min="128"
                  max="1024"
                  step="32"
                  value={options.size}
                  onChange={(e) => setOptions({ ...options, size: parseInt(e.target.value) })}
                  className="w-full cursor-pointer"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Preview Panel */}
        <div className="lg:col-span-5 flex flex-col gap-4 sticky top-4">
          <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Live QR Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-6 p-6">
              {pngUrl ? (
                <div className="p-4 rounded-xl bg-white shadow-md border flex items-center justify-center">
                  <img src={pngUrl} alt="Generated QR Code" style={{ width: "240px", height: "240px" }} />
                </div>
              ) : (
                <div className="h-60 w-60 rounded-xl border border-dashed flex items-center justify-center text-muted-foreground text-sm">
                  Enter content to generate
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 w-full">
                <Button onClick={handleDownloadPng} disabled={!pngUrl} className="w-full">
                  <Download className="h-4 w-4 mr-2" /> PNG
                </Button>
                <Button onClick={handleDownloadSvg} disabled={!svgContent} variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" /> SVG
                </Button>
                <Button onClick={handleCopyPng} disabled={!pngUrl} variant="outline" className="w-full">
                  {copied ? <Check className="h-4 w-4 mr-2 text-green-500" /> : <Copy className="h-4 w-4 mr-2" />}
                  {copied ? "Copied!" : "Copy"}
                </Button>
                <Button onClick={handlePrint} disabled={!pngUrl} variant="outline" className="w-full">
                  <Printer className="h-4 w-4 mr-2" /> Print
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
