import React from "react";
import type { ReactNode } from "react";
import { EntityLayout } from "./entity";

interface GenericPanelLayoutProps {
  children: ReactNode;
  panel: "cliente" | "funcionario" | "produto" | "pedido" | "empresa" | "invoice" | "item_compra";
}

export const GenericPanelLayout: React.FC<GenericPanelLayoutProps> = ({
  children,
  panel,
}) => {
  const panelTitles: Record<GenericPanelLayoutProps["panel"], string> = {
    cliente: "Painel do Cliente - LogiFast",
    funcionario: "Painel do Funcionário - LogiFast",
    produto: "Painel de Produtos - LogiFast",
    pedido: "Painel de Pedidos - LogiFast",
    empresa: "Painel da Empresa - LogiFast",
    invoice: "Painel de Faturas - LogiFast",
    item_compra: "Painel de Itens Comprados - LogiFast"
  };

  return <EntityLayout title={panelTitles[panel]}>{children}</EntityLayout>;
};
