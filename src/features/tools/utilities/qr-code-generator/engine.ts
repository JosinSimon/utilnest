import QRCode from "qrcode"

export type QrType = "text" | "url" | "email" | "phone" | "sms" | "wifi" | "vcard" | "upi"

export interface WifiInput {
  ssid: string
  password?: string
  encryption: "WPA" | "WEP" | "nopass"
  hidden?: boolean
}

export interface VCardInput {
  firstName: string
  lastName?: string
  organization?: string
  phone?: string
  email?: string
}

export interface UpiInput {
  upiId: string
  payeeName?: string
  amount?: number
  note?: string
}

export interface QrOptions {
  size: number
  margin: number
  errorCorrection: "L" | "M" | "Q" | "H"
  foregroundColor: string
  backgroundColor: string
}

export function buildQrPayload(type: QrType, data: Record<string, unknown>): string {
  switch (type) {
    case "url": {
      const url = String(data.url || "").trim()
      if (!url) return ""
      return /^https?:\/\//i.test(url) ? url : `https://${url}`
    }

    case "email": {
      const email = String(data.email || "").trim()
      const subject = encodeURIComponent(String(data.subject || ""))
      const body = encodeURIComponent(String(data.body || ""))
      return `mailto:${email}?subject=${subject}&body=${body}`
    }

    case "phone": {
      return `tel:${String(data.phone || "").trim()}`
    }

    case "sms": {
      const phone = String(data.phone || "").trim()
      const message = String(data.message || "").trim()
      return `smsto:${phone}:${message}`
    }

    case "wifi": {
      const wifi = data as unknown as WifiInput
      const ssid = (wifi.ssid || "").replace(/([\\;:,"])/g, "\\$1")
      const password = (wifi.password || "").replace(/([\\;:,"])/g, "\\$1")
      const hidden = wifi.hidden ? "true" : "false"
      return `WIFI:S:${ssid};T:${wifi.encryption};P:${password};H:${hidden};;`
    }

    case "vcard": {
      const card = data as unknown as VCardInput
      const fn = `${card.firstName} ${card.lastName || ""}`.trim()
      return [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `N:${card.lastName || ""};${card.firstName || ""};;;`,
        `FN:${fn}`,
        card.organization ? `ORG:${card.organization}` : "",
        card.phone ? `TEL;TYPE=CELL:${card.phone}` : "",
        card.email ? `EMAIL:${card.email}` : "",
        "END:VCARD",
      ]
        .filter(Boolean)
        .join("\n")
    }

    case "upi": {
      const upi = data as unknown as UpiInput
      const pa = encodeURIComponent((upi.upiId || "").trim())
      const pn = upi.payeeName ? encodeURIComponent(upi.payeeName.trim()) : ""
      const am = upi.amount && upi.amount > 0 ? String(upi.amount) : ""
      const tn = upi.note ? encodeURIComponent(upi.note.trim()) : ""

      let uri = `upi://pay?pa=${pa}`
      if (pn) uri += `&pn=${pn}`
      if (am) uri += `&am=${am}`
      if (tn) uri += `&tn=${tn}`
      uri += `&cu=INR`
      return uri
    }

    case "text":
    default:
      return String(data.text || "").trim()
  }
}

export async function generateQrPng(payload: string, options: QrOptions): Promise<string> {
  if (!payload) return ""
  return QRCode.toDataURL(payload, {
    width: options.size,
    margin: options.margin,
    errorCorrectionLevel: options.errorCorrection,
    color: {
      dark: options.foregroundColor || "#000000",
      light: options.backgroundColor || "#ffffff",
    },
  })
}

export async function generateQrSvg(payload: string, options: QrOptions): Promise<string> {
  if (!payload) return ""
  return QRCode.toString(payload, {
    type: "svg",
    margin: options.margin,
    errorCorrectionLevel: options.errorCorrection,
    color: {
      dark: options.foregroundColor || "#000000",
      light: options.backgroundColor || "#ffffff",
    },
  })
}

export default { family: "calculator" as const, run: generateQrPng }
