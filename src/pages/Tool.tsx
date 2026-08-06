import { useParams, Navigate } from "react-router-dom"
import { getToolBySlug } from "@/data/registry"
import { ToolLayout } from "@/components/tool/ToolLayout"

export function ToolPage() {
  const { categorySlug, slug } = useParams<{ categorySlug: string; slug: string }>()
  const tool = slug ? getToolBySlug(slug) : undefined

  // Guard against category/slug mismatch or missing tool.
  if (!tool) return <Navigate to="/404" replace />
  if (tool.category !== categorySlug)
    return <Navigate to={`/category/${tool.category}/${tool.slug}`} replace />

  return <ToolLayout tool={tool} />
}