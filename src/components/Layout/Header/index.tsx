import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LuMenu, LuX } from "react-icons/lu";
import logoHeaderImage from "../../../Img/logo.png";

const navLinks = [
  { label: "HOME", to: "/" },
  { label: "SOBRE", to: "/sobre" },
  { label: "SERVIÇOS", to: "/servicos" },
  { label: "RASTREIO", to: "/rastreio" },
  { label: "SOLUÇÕES", to: "/solucoes" },
  { label: "CONTATO", to: "/contato" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (to: string) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  return (
    <header className="w-full bg-white text-black px-4 py-2 sticky top-0 z-50 border-b border-gray-200 shadow-sm">
      <nav className="container mx-auto flex justify-between items-center">

        {/* Logo */}
        <Link to="/" aria-label="Ir para a página inicial">
          <img
            src={logoHeaderImage}
            alt="Logo LogiFast"
            className="h-14 w-auto"
          />
        </Link>

        {/* Navegação desktop */}
        <div className="hidden md:flex space-x-6 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-medium transition-colors ${
                isActive(link.to)
                  ? "text-[#0A3D62] font-bold border-b-2 border-[#0A3D62] pb-0.5"
                  : "hover:text-blue-600"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Botões desktop */}
        <div className="hidden md:flex space-x-2">
          <Link
            to="/login"
            className="px-4 py-2 border border-[#0A3D62] text-black rounded text-sm hover:bg-[#C8DEEE] transition"
          >
            ENTRE
          </Link>
          <Link
            to="/cadastro"
            className="px-4 py-2 bg-[#0A3D62] text-white rounded text-sm hover:bg-[#1B4F72] transition"
          >
            CADASTRE-SE
          </Link>
        </div>

        {/* Botão hambúrguer (mobile) */}
        <button
          className="md:hidden p-2 rounded-lg text-[#0A3D62] hover:bg-[#C8DEEE] transition"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
        >
          {menuOpen ? <LuX size={24} /> : <LuMenu size={24} />}
        </button>
      </nav>

      {/* Menu mobile */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 flex flex-col gap-1 animate-fadeIn">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive(link.to)
                  ? "bg-[#EEF5FB] text-[#0A3D62] font-bold"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* Botões mobile */}
          <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-gray-100">
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="w-full text-center px-4 py-2.5 border border-[#0A3D62] text-[#0A3D62] rounded text-sm font-medium hover:bg-[#C8DEEE] transition"
            >
              ENTRE
            </Link>
            <Link
              to="/cadastro"
              onClick={() => setMenuOpen(false)}
              className="w-full text-center px-4 py-2.5 bg-[#0A3D62] text-white rounded text-sm font-medium hover:bg-[#1B4F72] transition"
            >
              CADASTRE-SE
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}