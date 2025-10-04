import { Outlet } from "react-router-dom";
import Titulo from "./components/Titulo";

export default function Layout() {
  return (
    <>
      <Titulo />
      <Outlet />
    </>
  );
}
