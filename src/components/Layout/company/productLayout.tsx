import React from "react";
import type { ReactNode } from "react";
import { EntityLayout } from "./entity";

interface ProductLayoutProps {
  children: ReactNode;
  backLink?: string;
}

export const ProductLayout: React.FC<ProductLayoutProps> = ({
  children,
  backLink,
}) => (
  <EntityLayout
    backLink={backLink || "/company/product"}
    title="Painel Produto - LogiFast"
  >
    {children}
  </EntityLayout>
);