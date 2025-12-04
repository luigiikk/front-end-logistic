import { Routes } from "react-router-dom";
import { PublicRoutes } from "./routes/publicRoutes";
import { CompanyRoutes } from "./routes/companyRoutes";
// import { EmployeeRoutes } from "./routes/employeeRoutes";

export default function App() {
  return (
    <Routes>
      {PublicRoutes()}
      {CompanyRoutes()}
    </Routes>
  );
}