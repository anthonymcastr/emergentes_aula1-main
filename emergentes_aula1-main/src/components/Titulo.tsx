import { Link, useNavigate, useLocation } from "react-router-dom";
import { useClienteStore } from "../context/ClienteContext";
import { useAdminStore } from "../Admin/context/AdminContext";
import { useState } from "react";

export default function Titulo() {
  const { cliente, deslogaCliente } = useClienteStore();
  const { admin, deslogaAdmin } = useAdminStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuAberto, setMenuAberto] = useState(false);

  function handleLogout() {
    deslogaCliente();
    deslogaAdmin();
    navigate("/login");
  }

  function handleHomeClick() {
    // Se já está na home, força reload para limpar filtros
    if (location.pathname === "/") {
      window.location.reload();
    }
  }

  return (
    <nav className="sticky top-0 z-50 bg-blue-900 shadow-md">
      <div className="w-full flex items-center justify-between px-8 py-3">
        {/* Logo */}
        <Link to="/" onClick={handleHomeClick} className="flex items-center">
          <img
            src="/img/logo-novo-white.png"
            alt="Logo Petpel"
            className="h-16 transition-transform hover:scale-105"
          />
        </Link>

        {/* Hamburger */}
        <button
          onClick={() => setMenuAberto(!menuAberto)}
          className="md:hidden text-white focus:outline-none"
        >
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Menu */}
        <div
          className={`
            ${menuAberto ? "block" : "hidden"}
            md:flex md:items-center md:gap-8
            absolute md:static top-full left-0 w-full md:w-auto
            bg-blue-800 md:bg-transparent
            shadow-md md:shadow-none
          `}
        >
          <ul className="flex flex-col md:flex-row gap-2 md:gap-8 px-4 py-4 md:p-0 text-white font-medium">
            <NavItem
              to="/"
              label="Home"
              onClick={() => {
                handleHomeClick();
                setMenuAberto(false);
              }}
            />

            {!admin && !cliente && (
              <NavItem
                to="/login"
                label="Login"
                onClick={() => setMenuAberto(false)}
              />
            )}

            {(cliente || admin) && (
              <>
                <NavItem
                  to="/inclusao"
                  label="Inclusão"
                  onClick={() => setMenuAberto(false)}
                />
                <NavItem
                  to="/inbox"
                  label="Minhas Mensagens"
                  onClick={() => setMenuAberto(false)}
                />
              </>
            )}

            {(cliente || admin) && (
              <li className="flex items-center">
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuAberto(false);
                  }}
                  className="
                    px-4 py-1
                    rounded-full
                    bg-white/10
                    hover:bg-red-600
                    transition
                    cursor-pointer
                    font-medium
                  "
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

/* Item reutilizável */
function NavItem({
  to,
  label,
  onClick,
}: {
  to: string;
  label: string;
  onClick?: () => void;
}) {
  return (
    <li>
      <Link
        to={to}
        onClick={onClick}
        className="
          relative
          px-2 py-1
          transition
          hover:text-blue-200
          after:content-['']
          after:absolute
          after:left-0
          after:-bottom-1
          after:w-0
          after:h-0.5
          after:bg-blue-200
          after:transition-all
          hover:after:w-full
        "
      >
        {label}
      </Link>
    </li>
  );
}
