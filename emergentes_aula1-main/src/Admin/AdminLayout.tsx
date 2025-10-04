import { Link, Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="flex h-screen">
      {/* Sidebar lateral */}
      <aside className="w-64 bg-blue-700 text-white p-6">
        <img className="" src="./public/img/logo_petpel.png" alt="" />
        <h2 className="text-2xl font-bold mb-4">Painel Admin</h2>
        <ul className="space-y-2">
          <li>
            <Link to="/admin" className="hover:underline">
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/admin/listagem"
              className="block py-2 px-3 text-white hover:font-bold rounded-sm md:bg-transparent md:p-0 md:hover:font-bold"
            >
              Listagem
            </Link>
          </li>
          <li>
            <Link to="/admin/outro-relatorio" className="hover:underline">
              Outro Relatório
            </Link>
          </li>
        </ul>
      </aside>

      {/* Conteúdo principal */}
      <main className="flex-1 p-6 bg-gray-100 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
