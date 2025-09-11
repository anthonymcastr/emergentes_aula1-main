import { Link, useNavigate } from "react-router-dom";
import { useClienteStore } from "../context/ClienteContext";

export default function Titulo() {
  const { cliente, deslogaCliente } = useClienteStore();
  const navigate = useNavigate();

  function handleLogout() {
    deslogaCliente(); // aqui a gente faz a limpeza geral, tanto do zustand quanto do localstorage
    navigate("/login");
  }

  return (
    <nav className="bg-blue-600 border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link
          to="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <img
            src="/img/logo_petpel.png"
            className="h-8"
            alt="Logo Petpel"
          />
          <span className="self-center text-2xl font-semibold whitespace-nowrap text-white dark:text-white ">
            PetPel
          </span>
        </Link>

        <div className="hidden w-full md:block md:w-auto" id="navbar-default">
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg 
                         md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 
                         dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">

            <li>
              <Link
                to="/"
                className="block py-2 px-3 text-white bg-blue-700 rounded-sm md:bg-transparent md:p-0 md:text-white md:hover:font-bold"
              >
                Home
              </Link>
            </li>

            {!cliente ? (
              // caso o usuário n esteja logado, a gente mostra login
              <li>
                <Link
                  to="/login"
                  className="block py-2 px-3 text-white bg-blue-700 rounded-sm md:bg-transparent md:p-0 md:text-white md:hover:font-bold"
                >
                  Login
                </Link>
              </li>
            ) : (
              <>
                
                <li>
                  <Link
                    to="/inclusao"
                    className="block py-2 px-3 text-white bg-blue-700 rounded-sm md:bg-transparent md:p-0 md:text-white md:hover:font-bold"
                  >
                    Inclusão
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contato"
                    className="block py-2 px-3 text-white bg-blue-100 rounded-sm md:py-1 md:px-1 md:bg-blue-950 md:p-0 md:text-white md:hover:font-bold"
                  >
                    Minhas Mensagens
                  </Link>
                </li>
                
              </>
            )}

            <li>
              <Link
                to="/listagem"
                className="block py-2 px-3 text-white bg-blue-700 rounded-sm md:bg-transparent md:p-0 md:text-white md:hover:font-bold"
              >
                Listagem
              </Link>
            </li>
            <li>
              <Link
                to="/sobre"
                className="block py-2 px-3 text-white bg-blue-700 rounded-sm md:bg-transparent md:p-0 md:text-white md:hover:font-bold"
              >
                Sobre
              </Link>
            </li>
            {cliente && (
            <li>
                  <button
                    onClick={handleLogout}
                    className="block py-2 px-3 text-white bg-blue-700 rounded-sm md:bg-transparent md:p-0 md:text-white md:hover:font-extrabold md:hover:text-red-500"
                  >
                    Sair
                  </button>
                </li>)}
          </ul>
        </div>
      </div>
    </nav>
  );
}
