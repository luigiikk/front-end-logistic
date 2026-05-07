import React from "react";
import type { ReactNode } from "react";
import { EntityLayout } from "./entity";

interface GenericPanelLayoutProps {
  children: ReactNode;
  panel: "cliente" | "funcionario" | "produto" | "pedido" | "empresa" | "invoice" | "pedido_de_compra" | "item_compra" | "veiculo"| "alocar_veiculo"| "fornecedor" | "armazem" | "recurso"  ;
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
    pedido_de_compra: "Painel de pedido de compra - LogiFast",
    item_compra: "Painel de Itens Comprados - LogiFast",
    veiculo: "Painel de Veículos - Logifast",
    fornecedor: "Painel de Fornecedores - Logifast",
    armazem: "Painel de Armazens - Logifast",
    recurso: "Painel de Recursos - Logifast",
    alocar_veiculo: "Painel de Alocação - Logifast"
  };

  return <EntityLayout title={panelTitles[panel]}>{children}</EntityLayout>;
};
