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
  | "recurso"
  | "inventario"
  | "alocar_veiculo"
  | "relatorio";

interface GenericPanelLayoutProps {
  children: ReactNode;
  panel: Panel;
  hideBackButton?: boolean;
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
  inventario: "Inventário",
  alocar_veiculo: "Alocar Veículo", 
  relatorio: "Relatórios",
};

export const GenericPanelLayout: React.FC<GenericPanelLayoutProps> = ({
  children,
  panel,
  hideBackButton,
}) => {
  return (
    <EntityLayout title={`${PANEL_TITLES[panel]} - LogiFast`} hideBackButton={hideBackButton}>
      {children}
    </EntityLayout>
  );
};