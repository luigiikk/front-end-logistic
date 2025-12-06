import React from "react";
import { Link } from "react-router-dom";

interface SidebarLayoutProps {
  sections: { key: string; label: string; link: string }[];
  activeSection?: string;
  title: string;
}

export const SidebarLayout: React.FC<SidebarLayoutProps> = ({
  sections,
  activeSection,
  title,
}) => {
  return (
    <aside className="w-1/4 bg-[#bfdbf7] flex flex-col items-center py-10 gap-8 min-w-[250px]">
      <h2 className="text-xl font-bold text-center px-4 leading-tight text-black">
        {title}
      </h2>
      <nav className="flex flex-col gap-6 w-full px-12">
        {sections.map((section) =>
          section.key === activeSection ? (
            <button
              key={section.key}
              className="w-full bg-[#f7b94d] text-black font-medium py-3 rounded-full shadow-md scale-105 cursor-default border-none text-base ring-2 ring-[#e6aa3e]"
            >
              {section.label}
            </button>
          ) : (
            <Link key={section.key} to={section.link} className="w-full no-underline">
              <button className="w-full bg-[#f7b94d] hover:bg-[#e6aa3e] text-black font-medium py-3 rounded-full shadow-md transition-transform hover:scale-105 cursor-pointer border-none text-base">
                {section.label}
              </button>
            </Link>
          )
        )}
      </nav>
    </aside>
  );
};
