import React from "react";
import { Link } from "react-router-dom";
import { LuArrowLeft } from "react-icons/lu";
import logo2 from "../../../Img/logo2.png";

interface HeaderLayoutProps {
  title?: string;
}

export const HeaderLayout: React.FC<HeaderLayoutProps> = ({
  title = "EMPRESA",
}) => {
  return (
    <header className="flex justify-between items-center px-8 py-3 bg-[#384A6C] shadow-md z-10">
      {/* Voltar */}
      <Link
        to="/company"
        className="flex items-center gap-2 text-white/70 hover:text-white text-sm font-semibold transition-colors no-underline"
      >
        <LuArrowLeft size={16} />
        Voltar
      </Link>

      {/* Logo */}
      <img src={logo2} alt="LogiFast" className="h-8 object-contain" />

      {/* Título da página */}
      <span className="text-sm font-bold text-white/80 tracking-wide uppercase">
        {title.replace(" - LogiFast", "")}
      </span>
    </header>
  );
};