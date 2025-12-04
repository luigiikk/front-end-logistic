import { Route } from "react-router-dom";
import DashboardLayout from "../components/Layout/DashboardLayout";
import CompanyDashboard from "../pages/company/Dashboard";
import EmployeeList from "../pages/company/employee/listEmployee";
import EmployeeDeletion from "../pages/company/employee//deleteEmployee";
import EmployeeEdit from "../pages/company/employee/editEmployee";
import EmployeeRegistration from "../pages/company/employee/registerEmployee";
// import ClientDeletion from "../pages/company/client/ClientDeletion";
// import ClientEdit from "../pages/company/client/ClientEdit";
import ClientList from "../pages/company/client/listClient";
import EmployeeGet from "../pages/company/employee/getEmployee";


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
      <Route path="employee" element={<EmployeeList />} />
      <Route path="client" element={<ClientList />} />
      <Route path="employee/register" element={<EmployeeRegistration />} />
      <Route path="employee/get" element={<EmployeeGet />} />
      <Route path="employee/update" element={<EmployeeEdit />} />
      <Route path="employee/delete" element={<EmployeeDeletion />} />

    </Route>,
  ];
}