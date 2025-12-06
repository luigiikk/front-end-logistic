import React  from "react";
import type { ReactNode } from "react";
import { EntityLayout } from "./entity";

interface ClientLayoutProps {
  children: ReactNode;
  backLink?: string;
}

export const ClientLayout: React.FC<ClientLayoutProps> = ({
  children,
  backLink,
}) => (
  <EntityLayout
    backLink={backLink || "/company/client"}
    title="Painel Cliente - LogiFast"
  >
    {children}
  </EntityLayout>
);