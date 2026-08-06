import { Outlet } from "react-router-dom"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { Analytics } from "@/features/analytics/Analytics"
import { trackToolViewed } from "@/features/analytics/events"
import { useLocation } from "react-router-dom"
import { useEffect } from "react"

export function AppShell() {
  const { pathname } = useLocation()

  useEffect(() => {
    trackToolViewed(pathname)
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="flex min-h-screen flex-col">
      <Analytics />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}