export type CategorySlug =
  | "finance"
  | "pdf"
  | "image"
  | "government"
  | "text"
  | "business"
  | "utilities"

export type SchemaType = "Calculator" | "Converter" | "Generator" | "Utility"
export type EngineFamily = "calculator" | "text" | "file"
export type PrivacyNote = "none" | "client"

export interface FaqItem {
  question: string
  answer: string
}

export interface HowToStep {
  title: string
  description: string
}

export interface ContentSection {
  heading: string
  body: string
}

export interface Example {
  title: string
  input: string
  output: string
}

export interface Category {
  slug: CategorySlug
  name: string
  tagline: string
  description: string
  icon: string
  order: number
  keywords: string[]
  color?: string
  previewTags?: string[]
}

export interface ToolPreset {
  targetKb?: number
  width?: number
  height?: number
  presetIds?: string[]
  outputFormat?: "jpeg" | "png" | "webp"
}

export interface ToolDefinition {
  id: string
  name: string
  slug: string
  category: CategorySlug
  path: string

  shortDescription: string
  longDescription: string
  sections: ContentSection[]
  examples?: Example[]

  primaryKeyword: string
  keywords: string[]
  searchAliases: string[]
  searchWeight: number

  relatedTools: string[]
  featured: boolean
  trending: boolean
  popular: boolean
  addedAt: string
  lastUpdated: string

  schemaType: SchemaType
  icon: string
  faq: FaqItem[]
  howTo: HowToStep[]

  engine: EngineFamily
  privacyNote: PrivacyNote
  preset?: ToolPreset
}