import { describe, it, expect } from "vitest"
import { buildQrPayload, generateQrPng, generateQrSvg } from "./engine"

describe("QR Code Generator Engine", () => {
  it("builds correct URL payload with auto-http protocol", () => {
    const p1 = buildQrPayload("url", { url: "toolza.com" })
    expect(p1).toBe("https://toolza.com")

    const p2 = buildQrPayload("url", { url: "http://example.com" })
    expect(p2).toBe("http://example.com")
  })

  it("builds correct UPI payment payload", () => {
    const p = buildQrPayload("upi", {
      upiId: "merchant@upi",
      payeeName: "Acme Store",
      amount: 500,
      note: "Bill #101",
    })
    expect(p).toContain("upi://pay?pa=merchant%40upi")
    expect(p).toContain("pn=Acme%20Store")
    expect(p).toContain("am=500")
    expect(p).toContain("tn=Bill%20%23101")
    expect(p).toContain("cu=INR")
  })

  it("builds correct Wi-Fi payload", () => {
    const p = buildQrPayload("wifi", {
      ssid: "HomeNet",
      password: "secretpassword",
      encryption: "WPA",
      hidden: false,
    })
    expect(p).toBe("WIFI:S:HomeNet;T:WPA;P:secretpassword;H:false;;")
  })

  it("builds correct vCard payload", () => {
    const p = buildQrPayload("vcard", {
      firstName: "John",
      lastName: "Doe",
      phone: "+919876543210",
      email: "john@example.com",
    })
    expect(p).toContain("BEGIN:VCARD")
    expect(p).toContain("FN:John Doe")
    expect(p).toContain("TEL;TYPE=CELL:+919876543210")
    expect(p).toContain("END:VCARD")
  })

  it("renders PNG data URL successfully", async () => {
    const png = await generateQrPng("Hello World", {
      size: 200,
      margin: 2,
      errorCorrection: "M",
      foregroundColor: "#000000",
      backgroundColor: "#ffffff",
    })
    expect(png).toContain("data:image/png;base64,")
  })

  it("renders SVG string successfully", async () => {
    const svg = await generateQrSvg("Hello World", {
      size: 200,
      margin: 2,
      errorCorrection: "M",
      foregroundColor: "#000000",
      backgroundColor: "#ffffff",
    })
    expect(svg).toContain("<svg")
    expect(svg).toContain("</svg>")
  })
})
