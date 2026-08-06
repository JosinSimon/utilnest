import { Routes, Route } from "react-router-dom"
import { AppShell } from "./AppShell"
import { HomePage } from "@/pages/Home"
import { ToolsPage } from "@/pages/Tools"
import { CategoryPage } from "@/pages/Category"
import { ToolPage } from "@/pages/Tool"
import { SearchPage } from "@/pages/Search"
import { NotFoundPage } from "@/pages/NotFound"
import {
  AboutPage,
  PrivacyPage,
  TermsPage,
  ContactPage,
} from "@/pages/legal"

/** Single declarative route tree used by both the client router and SSR. */
export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/tools" element={<ToolsPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/category/:categorySlug" element={<CategoryPage />} />
        <Route
          path="/category/:categorySlug/:slug"
          element={<ToolPage />}
        />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}