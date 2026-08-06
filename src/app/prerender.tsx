import { renderToString } from "react-dom/server"
import { MemoryRouter } from "react-router-dom"
import { AppRoutes } from "./AppRoutes"

/** Renders a route's full body HTML. Used by the static pre-render step. */
export function renderRoute(path: string): string {
  return renderToString(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
    </MemoryRouter>,
  )
}