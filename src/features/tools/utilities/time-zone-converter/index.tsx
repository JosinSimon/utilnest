import { useState, useMemo } from "react"
import { Globe, ArrowLeftRight, Clock } from "lucide-react"
import type { ToolDefinition } from "@/data/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { convertTimeZone, POPULAR_TIMEZONES } from "./engine"

export default function TimeZoneConverter({ tool: _tool }: { tool: ToolDefinition }) {
  const todayStr = new Date().toISOString().split("T")[0]
  const [dateStr, setDateStr] = useState<string>(todayStr)
  const [timeStr, setTimeStr] = useState<string>("12:00")
  const [sourceZone, setSourceZone] = useState<string>("Asia/Kolkata")
  const [targetZone, setTargetZone] = useState<string>("America/New_York")

  const result = useMemo(() => {
    return convertTimeZone({ dateStr, timeStr, sourceZone, targetZone })
  }, [dateStr, timeStr, sourceZone, targetZone])

  const handleSwap = () => {
    const prevSource = sourceZone
    setSourceZone(targetZone)
    setTargetZone(prevSource)
  }

  const sourceMeta = POPULAR_TIMEZONES.find((t) => t.iana === sourceZone)
  const targetMeta = POPULAR_TIMEZONES.find((t) => t.iana === targetZone)

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" /> World Time Zone Converter
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Source Date</Label>
              <Input
                type="date"
                value={dateStr}
                onChange={(e) => setDateStr(e.target.value)}
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label>Source Time (24h)</Label>
              <Input
                type="time"
                value={timeStr}
                onChange={(e) => setTimeStr(e.target.value)}
                className="font-mono"
              />
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-5 items-end">
            <div className="sm:col-span-2 space-y-2">
              <Label>From Time Zone</Label>
              <select
                value={sourceZone}
                onChange={(e) => setSourceZone(e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:ring-2 focus:ring-ring"
              >
                {POPULAR_TIMEZONES.map((t) => (
                  <option key={t.iana} value={t.iana}>
                    {t.label} ({t.city})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-center sm:col-span-1 pb-1">
              <Button onClick={handleSwap} variant="outline" size="icon" title="Swap Timezones">
                <ArrowLeftRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="sm:col-span-2 space-y-2">
              <Label>To Time Zone</Label>
              <select
                value={targetZone}
                onChange={(e) => setTargetZone(e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded-md bg-background focus:ring-2 focus:ring-ring"
              >
                {POPULAR_TIMEZONES.map((t) => (
                  <option key={t.iana} value={t.iana}>
                    {t.label} ({t.city})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Result Display */}
      {result.isValid && (
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Source Box */}
          <Card className="bg-muted/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-blue-500" /> Source Time ({sourceMeta?.city || sourceZone})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <p className="text-2xl font-bold font-mono text-foreground">{result.sourceFormatted}</p>
              <p className="text-xs text-muted-foreground">
                {sourceZone} ({result.sourceOffset})
              </p>
            </CardContent>
          </Card>

          {/* Converted Target Box */}
          <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-primary flex items-center gap-1.5">
                <Globe className="h-4 w-4 text-primary" /> Converted Target Time ({targetMeta?.city || targetZone})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <p className="text-2xl sm:text-3xl font-extrabold font-mono text-primary">
                {result.targetFormatted}
              </p>
              <p className="text-xs text-muted-foreground font-medium">
                {targetZone} ({result.targetOffset})
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
