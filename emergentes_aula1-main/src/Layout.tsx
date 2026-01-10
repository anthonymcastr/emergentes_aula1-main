import { Outlet } from "react-router-dom";
import Titulo from "./components/Titulo";
import Footer from "./components/Footer";

export default function Layout() {
  return (
    <>
      <Titulo />
      <Outlet />
      <Footer />
    </>
  );
}
