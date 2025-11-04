/* Arquivo: src/components/DashboardLayout/index.tsx
  Descrição: Layout REUTILIZÁVEL para Admin, Operador, etc.
*/

import { Link, Outlet } from "react-router-dom";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import React from "react"; // <-- 'React' é necessário para 'React.FC'

// --- Tipos para os Props ---
type NavLink = {
  name: string;
  path: string;
};

type DashboardLayoutProps = {
  pageTitle: string; // Ex: "Painel de Administração"
  userType: string; // Ex: "ADMINISTRADOR"
  navLinks: NavLink[]; // A lista de links da sidebar
};

// Componente do Botão da Sidebar (para não repetir)
type NavButtonProps = {
  to: string;
  label: string;
};
const NavButton: React.FC<NavButtonProps> = ({ to, label }) => (
  <Link
    to={to}
    className="bg-yellow-400 text-gray-900 font-medium py-3 px-4 rounded-lg text-center hover:bg-yellow-500 transition"
  >
    {label}
  </Link>
);

// *** A MUDANÇA ESTÁ AQUI ***
// Dizemos explicitamente ao React que este é um Componente Funcional
const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  pageTitle,
  userType,
  navLinks,
}) => {
  return (
    <div className="flex min-h-screen">
      {/* === 1. Sidebar (Menu Lateral) === */}
      <aside className="w-64 bg-blue-200 p-6 flex flex-col">
        <h2 className="text-xl font-bold mb-8 text-gray-800">{pageTitle}</h2>

        <nav className="flex flex-col space-y-3">
          {navLinks.map((link) => (
            <NavButton key={link.name} to={link.path} label={link.name} />
          ))}
        </nav>
      </aside>

      {/* === 2. Conteúdo Principal (Direita) === */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white p-4 shadow-sm flex justify-between items-center z-10">
          <div className="flex items-center gap-2">
            <UserCircleIcon className="h-8 w-8 text-gray-600" />
            <span className="font-medium text-gray-700">{userType}</span>
          </div>
          <button className="bg-orange-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-orange-600 transition">
            Sair
          </button>
        </header>

        <main className="flex-1 p-10 bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
