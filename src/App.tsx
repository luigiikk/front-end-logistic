import { Routes } from "react-router-dom";
import { PublicRoutes } from "./routes/publicRoutes";
import { CompanyRoutes } from "./routes/companyRoutes";
import { EmployeeRoutes } from "./routes/employeeRoutes";
import { ClientRoutes } from "./routes/clientRoutes";

export default function App() {
  return (
    <Routes>
      {PublicRoutes()}
      {CompanyRoutes()}
      {EmployeeRoutes()}
      {ClientRoutes()}
    </Routes>
  );
}