import { Outlet } from "react-router-dom"

export default function App() {
  return (
    <div
      className="
        min-h-screen
        bg-[url('/img/fundo-nuvem.png')]
        bg-cover
        bg-center
        bg-no-repeat
      "
    >
      <Outlet />
    </div>
  )
}
