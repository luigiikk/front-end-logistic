import React from "react";
import type { ReactNode } from "react";
import { EntityLayout } from "./entity";

interface EmployeeLayoutProps {
  children: ReactNode;
  activeSection?: "register" | "update" | "delete" | "get" | "" ;
  backLink?: string;
}

export const EmployeeLayout: React.FC<EmployeeLayoutProps> = ({
  children,
  activeSection = "register",
  backLink = "/company/employee",
}) => {
  const sections = [
    { key: "register", label: "Cadastrar", link: "/company/employee/register" },
    { key: "update", label: "Atualizar", link: "/company/employee/update" },
    { key: "delete", label: "Deletar", link: "/company/employee/delete" },
    { key: "get", label: "Consultar", link: "/company/employee/get" },
  ];

  return (
    <EntityLayout
      backLink={backLink}
      title="Painel Funcionário - LogiFast"
      sections={sections}
      activeSection={activeSection}
    >
      {children}
    </EntityLayout>
  );
};
