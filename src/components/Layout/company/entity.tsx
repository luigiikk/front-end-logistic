import React from "react";
import type { ReactNode } from "react";
import { HeaderLayout } from "./header";
import { SidebarLayout } from "./side";

interface EntityLayoutProps {
  children: ReactNode;
  activeSection?: string;
  backLink?: string;
  title: string;
  sections: { key: string; label: string; link: string }[];
}

export const EntityLayout: React.FC<EntityLayoutProps> = ({
  children,
  activeSection,
  backLink = "#",
  title,
  sections,
}) => {
  return (
    <div className="flex flex-col h-screen w-full bg-gray-200 font-sans">
      <HeaderLayout backLink={backLink} title="EMPRESA" />
      <div className="flex flex-1 overflow-hidden">
        <SidebarLayout sections={sections} activeSection={activeSection} title={title} />
        <main className="flex-1 p-8 flex justify-center items-center overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
