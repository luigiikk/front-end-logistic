import { Route } from "react-router-dom";
import DashboardLayout from "../components/Layout/DashboardLayout";
import CompanyDashboard from "../pages/company/Dashboard";
import EmployeeGetAll from "../pages/company/employee/getAllEmployee";
import EmployeeDelete from "../pages/company/employee//deleteEmployee";
import EmployeeUpdate from "../pages/company/employee/updateEmployee";
import EmployeeRegister from "../pages/company/employee/registerEmployee";
import EmployeeGet from "../pages/company/employee/getEmployee";
import ClientDelete from "../pages/company/client/deleteClient";
import ClientUpdate from "../pages/company/client/updateClient";
import ClientGetAll from "../pages/company/client/getAllClient";
import ClientGet from "../pages/company/client/getClient";
import ClientRegister from "../pages/company/client/registerClient";



const companyNavLinks = [
  { name: "Funcionários", path: "/company/employee" },
  { name: "Cliente", path: "/company/client" },
  { name: "Produtos", path: "/company/product" },
  { name: "Pedidos", path: "/company/order" },
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
      <Route path="employee" element={<EmployeeGetAll />} />
      <Route path="client" element={<ClientGetAll />} />
      <Route path="employee/register" element={<EmployeeRegister />} />
      <Route path="employee/get" element={<EmployeeGet />} />
      <Route path="employee/update" element={<EmployeeUpdate />} />
      <Route path="employee/delete" element={<EmployeeDelete />} />
      <Route path="client" element={<ClientGetAll />} />
      <Route path="client/register" element={<ClientRegister />} />
      <Route path="client/update" element={<ClientUpdate />} />
      <Route path="client/delete" element={<ClientDelete />} />
      <Route path="client/get" element={<ClientGet />} />

    </Route>,
  ];
}