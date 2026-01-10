import { Link, useNavigate } from "react-router-dom";
import { useClienteStore } from "../context/ClienteContext";
import { useState } from "react";
import { useAdminStore } from "../Admin/context/AdminContext";

export default function Titulo() {
  const { cliente, deslogaCliente } = useClienteStore();
  const navigate = useNavigate();
  const [menuAberto, setMenuAberto] = useState(false);
  const { admin, deslogaAdmin } = useAdminStore();

  function handleLogout() {
    deslogaCliente();
    deslogaAdmin();
    navigate("/login");
  }



  const toggleMenu = () => setMenuAberto(!menuAberto);

  return (
    <nav className="bg-blue-600 border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src="/img/logo_petpel.png" className="h-8" alt="Logo Petpel" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap text-white dark:text-white">
            PetPel
          </span>
        </Link>

        {/* Botão Hamburger */}
        <button
          className="md:hidden flex flex-col justify-between w-6 h-5 focus:outline-none"
          onClick={toggleMenu}
        >
          <span className="block w-full h-0.5 bg-white"></span>
          <span className="block w-full h-0.5 bg-white"></span>
          <span className="block w-full h-0.5 bg-white"></span>
        </button>

        {/* Lista desktop */}
        <div
          className={`${
            menuAberto ? "block" : "hidden"
          } w-full md:block md:w-auto`}
          id="navbar-default"
        >
          <ul className="font-medium flex flex-col p-4 md:flex-row md:space-x-5 md:p-0 rounded-lg  dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <Link
                to="/"
                className="block py-2 px-3 text-white hover:font-bold rounded-sm md:bg-transparent md:p-0 md:hover:font-bold"
                onClick={() => setMenuAberto(false)}
              >
                Home
              </Link>
            </li>

            {!admin && !cliente ? (
              <li>
                <Link
                  to="/login"
                  className="block py-2 px-3 text-white hover:font-bold rounded-sm md:bg-transparent md:p-0 md:hover:font-bold"
                  onClick={() => setMenuAberto(false)}
                >
                  Login
                </Link>
              </li>
            ) : (
              <>
                <li>
                  <Link
                    to="/inclusao"
                    className="block py-2 px-3 text-white hover:font-bold rounded-sm md:bg-transparent md:p-0 md:hover:font-bold"
                    onClick={() => setMenuAberto(false)}
                  >
                    Inclusão
                  </Link>
                </li>
                <li>
                  <Link
                    to="/inbox"
                    className="block py-2 px-3 hover:font-bold text-white md:p-0  md:hover:font-bold "
                    onClick={() => setMenuAberto(false)}
                  >
                    Minhas Mensagens
                  </Link>
                </li>
              </>
            )}



          

            { (cliente || admin) && (
              <li>
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuAberto(false);
                  }}
                  className="block py-2 px-3 text-white hover:font-bold rounded-sm md:bg-transparent md:p-0 md:hover:font-extrabold  md:hover:cursor-pointer" 
                >
                  Sair
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
