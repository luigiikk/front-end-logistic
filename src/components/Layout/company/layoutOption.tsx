import React from "react";
import type { ReactNode } from "react";
import { EntityLayout } from "./entity";

type Panel =
  | "cliente"
  | "funcionario"
  | "produto"
  | "pedido"
  | "empresa"
  | "invoice"
  | "pedido_de_compra"
  | "item_compra"
  | "veiculo"
  | "fornecedor"
  | "armazem"
  | "recurso";

interface GenericPanelLayoutProps {
  children: ReactNode;
  panel: Panel;
}

const PANEL_TITLES: Record<Panel, string> = {
  cliente: "Clientes",
  funcionario: "Funcionários",
  produto: "Produtos",
  pedido: "Pedidos",
  empresa: "Empresa",
  invoice: "Faturas",
  pedido_de_compra: "Pedidos de Compra",
  item_compra: "Itens Comprados",
  veiculo: "Veículos",
  fornecedor: "Fornecedores",
  armazem: "Armazéns",
  recurso: "Recursos",
};

export const GenericPanelLayout: React.FC<GenericPanelLayoutProps> = ({
  children,
  panel,
}) => {
  return (
    <EntityLayout title={`${PANEL_TITLES[panel]} - LogiFast`}>
      {children}
    </EntityLayout>
  );
};