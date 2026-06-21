import { Route } from "react-router-dom";
import DashboardLayout from "../components/Layout/DashboardLayout";
import OrderManager from "../pages/employee/order";
import InvoiceManager from "../pages/employee/invoice";
import OperadorDashboard from "../pages/employee/Dashboard";
import VehicleManager from "../pages/employee/vehicles";
import AllocateVehicleManager from "../pages/employee/allocate-vehicle";

const employeeNavLinks = [
  { name: "Pedidos", path: "/employee/order" },
  { name: "Faturas", path: "/employee/invoice" },
  { name: "Veículos", path: "/employee/vehicle" },
  { name: "Alocação de Veículo", path: "/employee/allocate-vehicle" },
];

export function EmployeeRoutes() {
  return [
    <Route
      path="/employee"
      element={
        <DashboardLayout
          pageTitle="Painel de Funcionário"
          userType="employee"
          navLinks={employeeNavLinks}
        />
      }
      key="employee-layout"
    >
      <Route index element={<OperadorDashboard />} />
      <Route path="order" element={<OrderManager />} />
      <Route path="invoice" element={<InvoiceManager />} />
      <Route path="vehicle" element={<VehicleManager />} />
      <Route path="allocate-vehicle" element={<AllocateVehicleManager />} />
    </Route>,
  ];
}