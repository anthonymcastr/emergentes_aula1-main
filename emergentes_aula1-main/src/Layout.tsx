import { Outlet } from "react-router-dom"
import Titulo from "./components/Titulo"
import Footer from "./components/Footer"

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Titulo />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}
