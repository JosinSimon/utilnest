import { useEffect, useMemo, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import * as Dialog from "@radix-ui/react-dialog"
import { Search, Command } from "lucide-react"
import { searchTools, getPopularSearches } from "./search-index"
import type { ToolDefinition } from "@/data/types"
import { getIcon } from "@/components/icons"
import { toolPath } from "@/data/derive"
import { cn } from "@/lib/utils"
import { track } from "@/features/analytics/events"

const isMac = typeof navigator !== "undefined" && /Mac/i.test(navigator.platform)

export function SearchTrigger({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => track({ name: "search_opened" })}
      className={cn(
        "flex h-10 w-full items-center gap-2 rounded-lg border border-input bg-card px-3 text-sm text-muted-foreground shadow-sm transition-colors hover:bg-secondary/60",
        className,
      )}
      aria-label="Search tools"
    >
      <Search className="size-4 shrink-0" aria-hidden="true" />
      <span className="flex-1 text-left">Search tools…</span>
      <kbd className="hidden items-center gap-0.5 rounded border border-border bg-secondary px-1.5 py-0.5 text-[11px] font-medium sm:flex">
        <Command className="size-3" aria-hidden="true" />
        K
      </kbd>
    </button>
  )
}

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [active, setActive] = useState(0)
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const results = useMemo(() => (query ? searchTools(query, 10) : []), [query])
  const popular = useMemo(() => (query ? [] : getPopularSearches(6)), [query])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setOpen((v) => !v)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  useEffect(() => {
    setActive(0)
  }, [query])

  const items = query ? results.map((r) => r.tool) : []

  function go(tool: ToolDefinition | undefined) {
    if (tool) navigate(toolPath(tool.category, tool.slug))
    setOpen(false)
    setQuery("")
  }

  function onKeyDown(e: React.KeyboardEvent) {
    const count = items.length
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActive((a) => Math.min(a + 1, count - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActive((a) => Math.max(a - 1, 0))
    } else if (e.key === "Enter") {
      e.preventDefault()
      if (items[active]) go(items[active])
    }
  }

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [open])

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <span>
          <SearchTrigger />
        </span>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
        <Dialog.Content
          className="fixed left-1/2 top-[15%] z-50 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 overflow-hidden rounded-2xl border bg-card shadow-2xl focus:outline-none"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <div className="flex items-center gap-3 border-b px-4">
            <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Search tools…"
              className="h-12 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              aria-label="Search tools"
              role="combobox"
              aria-expanded="true"
            />
            <kbd className="rounded border border-border bg-secondary px-1.5 py-0.5 text-[11px] text-muted-foreground">
              Esc
            </kbd>
          </div>

          <div ref={listRef} className="max-h-80 overflow-y-auto p-2">
            {query === "" ? (
              <div className="p-3">
                <p className="px-2 pb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Popular searches
                </p>
                <div className="flex flex-wrap gap-2">
                  {popular.map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => {
                        setQuery(term)
                        inputRef.current?.focus()
                      }}
                      className="rounded-full border bg-secondary px-3 py-1 text-xs hover:bg-accent"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            ) : items.length === 0 ? (
              <p className="px-3 py-6 text-center text-sm text-muted-foreground">
                No tools found for “{query}”
              </p>
            ) : (
              items.map((tool, i) => {
                const Icon = getIcon(tool.icon)
                return (
                  <button
                    key={tool.id}
                    type="button"
                    onClick={() => go(tool)}
                    onMouseEnter={() => setActive(i)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left",
                      i === active && "bg-secondary",
                    )}
                  >
                    <span className="flex size-8 items-center justify-center rounded-lg bg-secondary">
                      <Icon className="size-4" aria-hidden="true" />
                    </span>
                    <span className="flex-1">
                      <span className="block text-sm font-medium">{tool.name}</span>
                      <span className="block text-xs text-muted-foreground">
                        {tool.category}
                      </span>
                    </span>
                  </button>
                )
              })
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export { isMac }