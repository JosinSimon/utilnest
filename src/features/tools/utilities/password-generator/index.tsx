import { useState, useMemo } from "react"
import { KeyRound, RefreshCw, Copy, Check, ShieldCheck, Trash2 } from "lucide-react"
import type { ToolDefinition } from "@/data/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { generatePasswords, type PasswordOptions } from "./engine"

export default function PasswordGenerator({ tool: _tool }: { tool: ToolDefinition }) {
  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    excludeAmbiguous: true,
    count: 1,
  })

  const [seed, setSeed] = useState<number>(0)
  const [copied, setCopied] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const result = useMemo(() => {
    return generatePasswords(options)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options, seed])

  const handleRegenerate = () => {
    setSeed((prev) => prev + 1)
  }

  const handleCopyPrimary = () => {
    if (!result.primaryPassword) return
    navigator.clipboard.writeText(result.primaryPassword)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCopySingle = (pwd: string, idx: number) => {
    navigator.clipboard.writeText(pwd)
    setCopiedIndex(idx)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const handleClear = () => {
    setOptions({
      length: 16,
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: true,
      excludeAmbiguous: true,
      count: 1,
    })
    setSeed((prev) => prev + 1)
  }

  const getStrengthBadge = (label: string) => {
    switch (label) {
      case "Very Strong":
        return "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
      case "Strong":
        return "bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/30"
      case "Fair":
        return "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30"
      case "Weak":
        return "bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30"
      default:
        return "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30"
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      {/* Primary Password Result Hero Card */}
      {result.isValid && result.primaryPassword && (
        <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20 shadow-md">
          <CardContent className="p-8 flex flex-col items-center gap-6 text-center">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-emerald-500" /> Generated Secure Password
            </div>

            <div className="w-full max-w-2xl bg-background p-4 rounded-xl border shadow-inner flex items-center justify-between gap-4 font-mono text-xl sm:text-2xl break-all">
              <span className="truncate select-all text-primary font-bold">{result.primaryPassword}</span>
              <div className="flex gap-2 shrink-0">
                <Button onClick={handleRegenerate} variant="ghost" size="icon" title="Regenerate">
                  <RefreshCw className="h-5 w-5" />
                </Button>
                <Button onClick={handleCopyPrimary} size="sm">
                  {copied ? <Check className="h-4 w-4 mr-2 text-green-500" /> : <Copy className="h-4 w-4 mr-2" />}
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </div>
            </div>

            {/* Strength Meter Bar */}
            <div className="w-full max-w-md space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground font-medium">Password Strength ({result.strength.bits} bits)</span>
                <span className={`px-2.5 py-0.5 rounded-full border text-xs font-bold ${getStrengthBadge(result.strength.label)}`}>
                  {result.strength.label}
                </span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    result.strength.score > 80
                      ? "bg-emerald-500"
                      : result.strength.score > 60
                      ? "bg-green-500"
                      : result.strength.score > 40
                      ? "bg-amber-500"
                      : "bg-red-500"
                  }`}
                  style={{ width: `${result.strength.score}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Options Form Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-primary" /> Customization Controls
          </CardTitle>
          <Button onClick={handleClear} variant="ghost" size="sm" className="text-muted-foreground">
            <Trash2 className="h-4 w-4 mr-1" /> Reset
          </Button>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm font-medium">
              <span>Password Length: <strong className="font-mono text-primary text-base">{options.length}</strong> characters</span>
            </div>
            <input
              type="range"
              min="6"
              max="64"
              value={options.length}
              onChange={(e) => setOptions({ ...options, length: parseInt(e.target.value) })}
              className="w-full cursor-pointer"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/20">
              <input
                type="checkbox"
                id="uppercase"
                checked={options.uppercase}
                onChange={(e) => setOptions({ ...options, uppercase: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="uppercase" className="text-sm font-medium cursor-pointer">
                Uppercase Letters (A-Z)
              </label>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/20">
              <input
                type="checkbox"
                id="lowercase"
                checked={options.lowercase}
                onChange={(e) => setOptions({ ...options, lowercase: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="lowercase" className="text-sm font-medium cursor-pointer">
                Lowercase Letters (a-z)
              </label>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/20">
              <input
                type="checkbox"
                id="numbers"
                checked={options.numbers}
                onChange={(e) => setOptions({ ...options, numbers: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="numbers" className="text-sm font-medium cursor-pointer">
                Numbers (0-9)
              </label>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/20">
              <input
                type="checkbox"
                id="symbols"
                checked={options.symbols}
                onChange={(e) => setOptions({ ...options, symbols: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="symbols" className="text-sm font-medium cursor-pointer">
                Symbols (!@#$%^&*)
              </label>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 pt-2 border-t">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="excludeAmbiguous"
                checked={options.excludeAmbiguous}
                onChange={(e) => setOptions({ ...options, excludeAmbiguous: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="excludeAmbiguous" className="text-sm font-medium cursor-pointer">
                Exclude Ambiguous Chars (O, 0, I, 1, l)
              </label>
            </div>

            <div className="flex items-center gap-3">
              <Label className="shrink-0">Quantity:</Label>
              <Input
                type="number"
                min="1"
                max="50"
                value={options.count || 1}
                onChange={(e) => setOptions({ ...options, count: Math.min(50, Math.max(1, parseInt(e.target.value) || 1)) })}
                className="font-mono w-24"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Multiple Passwords List */}
      {result.isValid && result.passwords.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Bulk Passwords ({result.passwords.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-60 overflow-y-auto p-4 rounded-lg bg-background border font-mono">
              {result.passwords.map((pwd, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-md bg-muted/40 hover:bg-muted/80">
                  <span className="text-sm font-semibold truncate select-all">{pwd}</span>
                  <Button onClick={() => handleCopySingle(pwd, idx)} variant="ghost" size="sm" className="ml-2 shrink-0">
                    {copiedIndex === idx ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
