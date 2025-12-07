import { Route } from "react-router-dom";
import DashboardLayout from "../components/Layout/DashboardLayout";
import CompanyDashboard from "../pages/company/Dashboard";
import EmployeeManager from "../pages/company/employee";
import ClientManager from "../pages/company/client";
import ProductManager from "../pages/company/product";
import OrderManager from "../pages/company/order";
import InvoiceManager from "../pages/company/invoice";
import PurchasedItemManager from "../pages/company/purchasedItem";




const companyNavLinks = [
  { name: "Funcionários", path: "/company/employee" },
  { name: "Cliente", path: "/company/client" },
  { name: "Produtos", path: "/company/product" },
  { name: "Pedidos", path: "/company/order" },
  { name: "Faturas", path: "/company/invoice" },
  { name: "Itens comprados", path: "/company/purchased" },

];

export function CompanyRoutes() {
  return [
    <Route
      path="/company"
      element={
        <DashboardLayout
          pageTitle="Painel da Empresa"
          userType="company"
          navLinks={companyNavLinks}
        />
      }
      key="company-layout"
    >
      <Route index element={<CompanyDashboard />} />
      <Route path="employee" element={<EmployeeManager />} />
      <Route path="client" element={<ClientManager />} />
      <Route path="product" element={<ProductManager />} />
      <Route path="order" element={<OrderManager />} />
      <Route path="invoice" element={<InvoiceManager />} />
      <Route path="purchased_item" element={<PurchasedItemManager/>} />


    </Route>,
  ];
}