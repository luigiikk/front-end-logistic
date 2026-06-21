import { Route } from "react-router-dom";
import DashboardLayout from "../components/Layout/DashboardLayout";
import OrderManager from "../pages/client/order";
import ClientDashboard from "../pages/client/Dashboard";
import ProductManager from "../pages/client/product";


const clientNavLinks = [
  { name: "Pedidos", path: "/client/order" },
  { name: "Produtos", path: "/client/product" },

];

export function ClientRoutes() {
  return [
    <Route
      path="/client"
      element={
        <DashboardLayout
          pageTitle="Painel de Cliente"
          userType="client"
          navLinks={clientNavLinks}
        />
      }
      key="client-layout"
    >
      <Route index element={<ClientDashboard />} />
      <Route path="order" element={<OrderManager />} />
      <Route path="product" element={<ProductManager />} />
    </Route>,
  ];
}