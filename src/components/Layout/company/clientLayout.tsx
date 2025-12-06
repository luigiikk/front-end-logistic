import type { ReactNode } from "react";
import { HeaderLayout } from "./header";
import { SidebarLayout } from "./side";

interface ClientLayoutProps {
  children: ReactNode;
  activeSection?: "register" | "get" | "update" | "delete" | "";
  backLink?: string;
}

export function ClientLayout({
  children,
  activeSection = "register",
  backLink = "/company/client",
}: ClientLayoutProps) {
  const sections = [
    { key: "register", label: "Cadastrar", link: "/company/client/register" },
    { key: "get", label: "Consultar", link: "/company/client/get" },
    { key: "delete", label: "Deletar", link: "/company/client/delete" },
    { key: "update", label: "Atualizar", link: "/company/client/update" },
  ];

  return (
    <div className="flex flex-col h-screen w-full bg-gray-200 font-sans">
      <HeaderLayout backLink={backLink} title="EMPRESA" />
      <div className="flex flex-1 overflow-hidden">
        <SidebarLayout sections={sections} activeSection={activeSection} title="Painel Cliente - LogiFast" />
        <main className="flex-1 p-8 flex justify-center items-center overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
