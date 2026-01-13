import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";

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
      <Toaster richColors position="top-center" />
      <Outlet />
    </div>
  );
}
