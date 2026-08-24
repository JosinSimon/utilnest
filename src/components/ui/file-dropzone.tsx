import * as React from "react"
import { Upload, FileText, Image as ImageIcon, Music, CheckCircle2, X } from "lucide-react"
import { cn, formatBytes } from "@/lib/utils"

export interface FileDropzoneProps {
  /** Callback for single file selection */
  onFile?: (file: File) => void
  /** Callback for multiple file selection */
  onFiles?: (files: File[]) => void
  /** Currently selected single file (if single-file mode) */
  file?: File | null
  /** Currently selected multiple files (if multi-file mode) */
  files?: File[]
  /** Accepted file formats (e.g. "image/*", "application/pdf", ".pdf,.jpg") */
  accept?: string
  /** Allow multiple files selection */
  multiple?: boolean
  /** Primary label inside the drop area */
  title?: string
  /** Sub-label / helper hint */
  description?: string
  /** Additional helper hint (e.g. max size, supported extensions) */
  hint?: string
  /** Custom icon or predefined Lucide icon */
  icon?: React.ReactNode
  /** Enable clipboard paste listener for files */
  enablePaste?: boolean
  /** Compact style for tighter layout spaces */
  compact?: boolean
  /** Disabled state */
  disabled?: boolean
  /** Custom class name for container */
  className?: string
  /** Optional callback to clear the current selection */
  onClear?: () => void
}

function getDefaultIcon(accept?: string) {
  if (!accept) return <Upload className="size-6" />
  if (accept.includes("image")) return <ImageIcon className="size-6" />
  if (accept.includes("pdf")) return <FileText className="size-6" />
  if (accept.includes("audio")) return <Music className="size-6" />
  return <Upload className="size-6" />
}

export function FileDropzone({
  onFile,
  onFiles,
  file,
  files,
  accept,
  multiple = false,
  title,
  description,
  hint,
  icon,
  enablePaste = false,
  compact = false,
  disabled = false,
  className,
  onClear,
}: FileDropzoneProps) {
  const [isDragging, setIsDragging] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const dragCounter = React.useRef(0)

  const handleFiles = React.useCallback(
    (fileList: FileList | File[] | null | undefined) => {
      if (!fileList || fileList.length === 0 || disabled) return
      const arr = Array.from(fileList)

      if (multiple && onFiles) {
        onFiles(arr)
      } else if (onFile && arr[0]) {
        onFile(arr[0])
      } else if (onFiles) {
        onFiles(arr)
      }
    },
    [disabled, multiple, onFile, onFiles],
  )

  const handleDragEnter = React.useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      if (disabled) return
      dragCounter.current += 1
      if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
        setIsDragging(true)
      }
    },
    [disabled],
  )

  const handleDragLeave = React.useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      if (disabled) return
      dragCounter.current -= 1
      if (dragCounter.current <= 0) {
        dragCounter.current = 0
        setIsDragging(false)
      }
    },
    [disabled],
  )

  const handleDragOver = React.useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      if (disabled) return
      e.dataTransfer.dropEffect = "copy"
    },
    [disabled],
  )

  const handleDrop = React.useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      dragCounter.current = 0
      setIsDragging(false)
      if (disabled) return

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files)
        e.dataTransfer.clearData()
      }
    },
    [disabled, handleFiles],
  )

  React.useEffect(() => {
    if (!enablePaste || disabled) return

    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items
      if (!items) return

      const pastedFiles: File[] = []
      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        if (item.kind === "file") {
          const f = item.getAsFile()
          if (f) pastedFiles.push(f)
        }
      }

      if (pastedFiles.length > 0) {
        handleFiles(pastedFiles)
      }
    }

    window.addEventListener("paste", handlePaste)
    return () => window.removeEventListener("paste", handlePaste)
  }, [disabled, enablePaste, handleFiles])

  const handleClick = () => {
    if (disabled) return
    inputRef.current?.click()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      inputRef.current?.click()
    }
  }

  const defaultIcon = icon ?? getDefaultIcon(accept)
  const hasSelectedFile = Boolean(file || (files && files.length > 0))

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={title ?? (multiple ? "Upload files" : "Upload file")}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        compact ? "p-4 text-left sm:p-5" : "p-6 text-center sm:p-8",
        isDragging
          ? "border-primary bg-primary/10 shadow-md scale-[1.01]"
          : "border-border/80 bg-muted/20 hover:border-primary/50 hover:bg-muted/40",
        hasSelectedFile && !isDragging && "border-primary/40 bg-primary/5",
        disabled && "cursor-not-allowed opacity-50 hover:border-border/80 hover:bg-muted/20",
        className,
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files)
          // Reset value so selecting the same file again triggers onChange
          if (e.target) e.target.value = ""
        }}
      />

      {isDragging ? (
        <div className="flex flex-col items-center justify-center py-2 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
            <Upload className="size-7 animate-bounce" />
          </div>
          <p className="mt-3 text-base font-semibold text-primary">
            Drop your {multiple ? "files" : "file"} here
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Release to upload immediately</p>
        </div>
      ) : hasSelectedFile ? (
        <div className="flex w-full items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <CheckCircle2 className="size-6" />
            </div>
            <div className="min-w-0 text-left">
              <p className="truncate text-sm font-semibold text-foreground">
                {file ? file.name : `${files?.length ?? 0} files selected`}
              </p>
              <p className="text-xs text-muted-foreground">
                {file
                  ? `${formatBytes(file.size)} · Click or drop to replace`
                  : `${files?.reduce((acc, f) => acc + f.size, 0) ? formatBytes(files.reduce((acc, f) => acc + f.size, 0)) : ""} · Click or drop to add/change`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {onClear && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onClear()
                }}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                title="Remove file"
                aria-label="Remove file"
              >
                <X className="size-4" />
              </button>
            )}
            <span className="text-xs font-medium text-primary hover:underline underline-offset-4">
              Change
            </span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <div className="flex size-12 items-center justify-center rounded-xl bg-muted text-muted-foreground transition-transform duration-200 group-hover:scale-110 group-hover:bg-primary/10 group-hover:text-primary sm:size-14">
            {defaultIcon}
          </div>
          <p className="mt-3 text-sm sm:text-base font-semibold text-foreground">
            {title ?? (multiple ? "Drag & drop files here, or browse" : "Drag & drop your file here, or browse")}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {description ?? (enablePaste ? "Click to upload from device or press Ctrl+V / Cmd+V to paste" : "Supports all common browser-supported formats")}
          </p>
          {hint && <p className="mt-2 text-[11px] font-medium text-muted-foreground/80">{hint}</p>}
        </div>
      )}
    </div>
  )
}
