import React from "react";
import type { ReactNode } from "react";
import { EntityLayout } from "./entity";

interface OrderLayoutProps {
  children: ReactNode;
  backLink?: string;
}

export const OrderLayout: React.FC<OrderLayoutProps> = ({
  children,
  backLink,
}) => (
  <EntityLayout
    backLink={backLink || "/company/order"}
    title="Painel Pedidos - LogiFast"
  >
    {children}
  </EntityLayout>
);