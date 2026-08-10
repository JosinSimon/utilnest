import { useMemo, useState } from "react"
import type { ToolDefinition } from "@/data/types"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SegmentedControl } from "@/components/ui/segmented"
import { formatINR, formatNumber, copyToClipboard } from "@/lib/utils"
import { Copy, Check } from "lucide-react"
import { CURRENCY_PRESETS, type CurrencyPreset } from "@/features/tools/business/shared/numberToWords"
import { numberToWordsEngine } from "./engine"

export default function NumberToWordsConverter({ tool }: { tool: ToolDefinition }) {
  const [valueStr, setValueStr] = useState("1245678.50")
  const [system, setSystem] = useState<"indian" | "international">("indian")
  const [mode, setMode] = useState<"currency" | "plain">("currency")
  const [currencyCode, setCurrencyCode] = useState<CurrencyPreset>("INR")
  const [customCurrency, setCustomCurrency] = useState("")
  const [customFraction, setCustomFraction] = useState("")
  const [copied, setCopied] = useState(false)

  // Handle system switch auto-defaulting suitable currency
  const handleSystemChange = (newSystem: "indian" | "international") => {
    setSystem(newSystem)
    if (newSystem === "international" && currencyCode === "INR") {
      setCurrencyCode("USD")
    } else if (newSystem === "indian" && currencyCode === "USD") {
      setCurrencyCode("INR")
    }
  }

  const result = useMemo(() => {
    const value = parseFloat(valueStr)
    if (isNaN(value)) return null

    return numberToWordsEngine({
      value,
      system,
      mode,
      currencyCode,
      currencyName: currencyCode === "CUSTOM" ? customCurrency : undefined,
      paisaName: currencyCode === "CUSTOM" ? customFraction : undefined,
    })
  }, [valueStr, system, mode, currencyCode, customCurrency, customFraction])

  const parsedValue = parseFloat(valueStr)

  const handleCopy = (text: string) => {
    copyToClipboard(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Format preview according to chosen system and currency
  const formattedPreview = useMemo(() => {
    if (isNaN(parsedValue)) return ""
    if (mode === "plain") return formatNumber(parsedValue)

    const preset = CURRENCY_PRESETS[currencyCode]
    const symbol = preset?.symbol || ""

    if (system === "indian") {
      return formatINR(parsedValue)
    }

    // International number formatting with currency symbol
    const formatted = new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 2,
      minimumFractionDigits: parsedValue % 1 !== 0 ? 2 : 0,
    }).format(parsedValue)

    return symbol ? `${symbol}${formatted}` : formatted
  }, [parsedValue, system, mode, currencyCode])

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>{tool.name}</CardTitle>
        <CardDescription>{tool.shortDescription}</CardDescription>
      </CardHeader>
      <CardContent className="p-6 flex flex-col gap-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Numbering System</Label>
            <SegmentedControl
              options={[
                { label: "Indian (Lakh/Crore)", value: "indian" },
                { label: "International (Million/Billion)", value: "international" }
              ]}
              value={system}
              onChange={(val) => handleSystemChange(val as "indian" | "international")}
            />
          </div>

          <div className="space-y-2">
            <Label>Display Mode</Label>
            <SegmentedControl
              options={[
                { label: "Currency Mode", value: "currency" },
                { label: "Plain Number", value: "plain" }
              ]}
              value={mode}
              onChange={(val) => setMode(val as "currency" | "plain")}
            />
          </div>
        </div>

        {mode === "currency" && (
          <div className="space-y-2">
            <Label>Target Currency</Label>
            <div className="flex flex-wrap gap-2">
              {[
                { code: "INR", label: "INR (₹ Rupees)", symbol: "₹" },
                { code: "USD", label: "USD ($ Dollars)", symbol: "$" },
                { code: "EUR", label: "EUR (€ Euros)", symbol: "€" },
                { code: "GBP", label: "GBP (£ Pounds)", symbol: "£" },
                { code: "AED", label: "AED (Dh Dirhams)", symbol: "AED" },
                { code: "CUSTOM", label: "Custom Currency", symbol: "Custom" },
              ].map((c) => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => setCurrencyCode(c.code as CurrencyPreset)}
                  className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
                    currencyCode === c.code
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {currencyCode === "CUSTOM" && (
              <div className="grid gap-4 sm:grid-cols-2 mt-3 p-4 border rounded-lg bg-muted/40">
                <div className="space-y-1">
                  <Label className="text-xs">Main Unit (e.g. Yen, Pesos, Riyals)</Label>
                  <Input
                    placeholder="e.g. Riyal"
                    value={customCurrency}
                    onChange={(e) => setCustomCurrency(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Fractional Unit (e.g. Cents, Halalas)</Label>
                  <Input
                    placeholder="e.g. Halala"
                    value={customFraction}
                    onChange={(e) => setCustomFraction(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        <div className="space-y-2">
          <Label className="text-lg">Enter Amount / Number</Label>
          <Input
            type="number"
            step="any"
            value={valueStr}
            onChange={(e) => setValueStr(e.target.value)}
            placeholder="1245678.50"
            className="text-2xl py-6 font-mono"
          />
          {!isNaN(parsedValue) && (
            <p className="text-sm font-medium text-muted-foreground mt-2">
              Format Preview: <span className="font-semibold text-foreground">{formattedPreview}</span>
            </p>
          )}
        </div>

        {result ? (
          <div className="space-y-4">
            <div className="flex flex-col gap-3 rounded-lg bg-primary px-5 py-6 text-primary-foreground relative">
              <div className="flex items-center justify-between">
                <span className="font-medium text-xs uppercase tracking-wider opacity-85">
                  {mode === "currency" ? `Amount in Words (${currencyCode})` : "Number in Words"}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  className="gap-1.5 text-xs font-semibold"
                  onClick={() => handleCopy(result.words)}
                >
                  {copied ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
                  {copied ? "Copied!" : "Copy Words"}
                </Button>
              </div>

              <p className="text-xl md:text-2xl font-bold leading-relaxed">{result.words}</p>
            </div>

            <div className="rounded-lg border bg-card p-4 space-y-1 text-xs text-muted-foreground">
              <p className="font-semibold text-foreground text-sm mb-1">Example Reference:</p>
              {system === "indian" ? (
                <p>₹12,45,678.50 → Twelve Lakh Forty Five Thousand Six Hundred Seventy Eight Rupees and Fifty Paise Only</p>
              ) : (
                <p>$1,245,678.50 → One Million Two Hundred Forty Five Thousand Six Hundred Seventy Eight Dollars and Fifty Cents Only</p>
              )}
            </div>

            <div className="flex justify-center">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                100% private · in-browser
              </span>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Enter a valid number above to see words conversion.</p>
        )}
      </CardContent>
    </Card>
  )
}
