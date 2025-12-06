import React from "react";
import { Link } from "react-router-dom";
import { LuMountain } from "react-icons/lu";

interface HeaderLayoutProps {
  backLink: string;
  title?: string; 
}

export const HeaderLayout: React.FC<HeaderLayoutProps> = ({ backLink, title = "EMPRESA" }) => {
  return (
    <header className="flex justify-between items-center px-8 py-4 bg-white shadow-sm z-10">
      <Link
        to={backLink}
        className="bg-[#f7b94d] hover:bg-[#e6aa3e] text-black px-8 py-2 rounded-full font-medium transition-colors shadow-sm cursor-pointer no-underline flex items-center justify-center"
      >
        Voltar
      </Link>

      <div className="flex items-center gap-3">
        <div className="border-2 border-black rounded-full p-1">
          <LuMountain className="w-6 h-6 text-black" />
        </div>
        <span className="font-bold text-lg tracking-wide text-black">{title}</span>
      </div>
    </header>
  );
};
