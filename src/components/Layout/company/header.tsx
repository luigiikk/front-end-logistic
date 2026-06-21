import React from "react";
import { Link } from "react-router-dom";
import { LuArrowLeft } from "react-icons/lu";
import logo2 from "../../../Img/logo2.png";

interface HeaderLayoutProps {
  title?: string;
}

function getHomeRoute() {
  const token = localStorage.getItem("token");
  if (!token) return "/login";
  try {
    const [, payloadBase64] = token.split(".");
    if (!payloadBase64) return "/login";
    const decoded = JSON.parse(atob(payloadBase64));
    if (decoded.role === "company") return "/company";
    if (decoded.role === "client") return "/client";
    return "/employee";
  } catch {
    return "/login";
  }
}

export const HeaderLayout: React.FC<HeaderLayoutProps> = ({
  title = "EMPRESA",
}) => {
  const homeRoute = getHomeRoute();

  return (
    <header className="flex justify-between items-center px-8 py-3 bg-[#384A6C] shadow-md z-10">
      {/* Voltar */}
      <Link
        to={homeRoute}
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