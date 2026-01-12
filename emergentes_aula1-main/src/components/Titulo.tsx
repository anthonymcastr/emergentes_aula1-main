import { Link, useNavigate } from "react-router-dom";
import { useClienteStore } from "../context/ClienteContext";
import { useAdminStore } from "../Admin/context/AdminContext";
import { useState } from "react";

export default function Titulo() {
  const { cliente, deslogaCliente } = useClienteStore();
  const { admin, deslogaAdmin } = useAdminStore();
  const navigate = useNavigate();
  const [menuAberto, setMenuAberto] = useState(false);

  function handleLogout() {
    deslogaCliente();
    deslogaAdmin();
    navigate("/login");
  }

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-blue-800 to-blue-700 shadow-md">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4 py-3">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
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
            
            <NavItem to="/" label="Home" onClick={() => setMenuAberto(false)} />

            {!admin && !cliente && (
              <NavItem to="/login" label="Login" onClick={() => setMenuAberto(false)} />
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
              <li>
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuAberto(false);
                  }}
                  className="
                    px-4 py-2
                    rounded-full
                    bg-white/10
                    hover:bg-red-600
                    transition
                    cursor-pointer
                    text-sm font-semibold
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
