import { Outlet, useNavigate, NavLink } from "react-router-dom";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import { api } from "../../../api/lib/api";
import { LuMenu, LuX, LuLogOut } from "react-icons/lu";
import logo2 from "../../../Img/logo2.png";

// ─── Types ────────────────────────────────────────────────────────────────────

type NavLinkItem = {
  name: string;
  path: string;
};

type DashboardLayoutProps = {
  pageTitle: string;
  userType: string;
  navLinks: NavLinkItem[];
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getCompanyIdFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const [, payloadBase64] = token.split(".");
    if (!payloadBase64) return null;
    const decoded = JSON.parse(atob(payloadBase64));
    return decoded?.sub ?? null;
  } catch {
    return null;
  }
}

// ─── Nav Button ───────────────────────────────────────────────────────────────

const NavButton: React.FC<{ to: string; label: string; onClick?: () => void }> = ({
  to,
  label,
  onClick,
}) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
        isActive
          ? "bg-white text-[#384A6C] shadow-sm"
          : "text-white/70 hover:bg-white/10 hover:text-white"
      }`
    }
  >
    {label}
  </NavLink>
);

// ─── Main ─────────────────────────────────────────────────────────────────────

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  pageTitle,
  navLinks,
}) => {
  const [company, setCompany] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  useEffect(() => {
    async function fetchCompany() {
      const companyId = getCompanyIdFromToken();
      if (!companyId) return;
      try {
        const res = await api.get(`/company/${companyId}`);
        setCompany(res.data);
      } catch (err) {
        console.error("Erro ao buscar empresa:", err);
      }
    }
    fetchCompany();
  }, []);

  // Fecha o menu ao redimensionar para desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div className="flex min-h-screen bg-[#EEF5FB]">

      {/* ── Overlay mobile ── */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-20 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-[#384A6C] flex flex-col z-30 transition-transform duration-300
          ${menuOpen ? "translate-x-0" : "-translate-x-full"}
          md:relative md:translate-x-0 md:flex
        `}
      >
        {/* Logo + fechar (mobile) */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <img src={logo2} alt="LogiFast" className="h-8 object-contain" />
          <button
            onClick={() => setMenuOpen(false)}
            className="text-white/60 hover:text-white transition md:hidden"
          >
            <LuX size={20} />
          </button>
        </div>

        {/* Título da seção */}
        <div className="px-6 pt-6 pb-2">
          <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
            {pageTitle}
          </p>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col gap-1 px-3 flex-1 overflow-y-auto">
          {navLinks.map((link) => (
            <NavButton
              key={link.name}
              to={link.path}
              label={link.name}
              onClick={() => setMenuOpen(false)}
            />
          ))}
        </nav>

        {/* Rodapé da sidebar */}
        <div className="px-6 py-5 border-t border-white/10">
          <p className="text-[10px] text-white/30 text-center">
            © {new Date().getFullYear()} LogiFast
          </p>
        </div>
      </aside>

      {/* ── Conteúdo principal ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Header */}
        <header className="bg-[#384A6C] px-6 py-3 flex justify-between items-center shadow-md z-10 shrink-0">
          {/* Hambúrguer (mobile) */}
          <button
            onClick={() => setMenuOpen(true)}
            className="text-white/70 hover:text-white transition md:hidden"
            aria-label="Abrir menu"
          >
            <LuMenu size={22} />
          </button>

          {/* Logo central (mobile) / espaço vazio (desktop) */}
          <img
            src={logo2}
            alt="LogiFast"
            className="h-7 object-contain md:hidden"
          />

          {/* Usuário + logout */}
          <div className="flex items-center gap-4 ml-auto">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <UserCircleIcon className="h-5 w-5 text-white/70" />
              </div>
              {company ? (
                <span className="text-sm text-white/80 font-medium hidden sm:block">
                  {company.name}
                </span>
              ) : (
                <span className="text-sm text-white/40 italic hidden sm:block">
                  Carregando...
                </span>
              )}
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold
                px-4 py-2 rounded-xl transition-all active:scale-95"
            >
              <LuLogOut size={15} />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </header>

        {/* Conteúdo */}
        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;