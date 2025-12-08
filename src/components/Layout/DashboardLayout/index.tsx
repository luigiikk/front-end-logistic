import { Outlet, useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import { api } from "../../../api/lib/api";

type NavLink = {
  name: string;
  path: string;
};

type DashboardLayoutProps = {
  pageTitle: string; 
  userType: string; 
  navLinks: NavLink[]; 
};

type NavButtonProps = {
  to: string;
  label: string;
};
const NavButton: React.FC<NavButtonProps> = ({ to, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `py-3 px-4 rounded-lg text-center font-medium transition ${
        isActive
          ? "bg-yellow-500 text-gray-900"
          : "bg-yellow-400 text-gray-900 hover:bg-yellow-500"
      }`
    }
  >
    {label}
  </NavLink>
);

function getCompanyIdFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const [, payloadBase64] = token.split(".");
    if (!payloadBase64) return null;
    const decoded = JSON.parse(atob(payloadBase64));
    return decoded?.sub ?? null;
  } catch (error) {
    console.error("Erro ao decodificar token:", error);
    return null;
  }
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  pageTitle,
  navLinks,
}) => {
  const [company, setCompany] = useState<any>(null);

  const navigate = useNavigate();

function handleLogout() {
  localStorage.removeItem("token"); 
  navigate("/login");
}

useEffect(() => {
    async function fetchCompany() {
      const token = localStorage.getItem("token");
      const companyId = getCompanyIdFromToken();

      if (!companyId || !token) {
        console.warn("Token ou ID da empresa não encontrado!");
        return;
      }

      try {
        const response = await api.get(`/company/${companyId}`); 

        setCompany(response.data);
      } catch (error) {
        console.error("Erro ao buscar empresa:", error);
      }
    }

    fetchCompany();
  }, []);
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
           {company ? (
        <span className="text-sm text-gray-500">{company.name}</span>
      ) : (
        <span className="text-sm text-gray-400 italic">Carregando...</span>
      )}
          </div>
          <button 
          onClick={handleLogout}
          className="bg-orange-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-orange-600 transition">
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
