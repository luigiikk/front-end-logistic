import { Routes, Route } from "react-router-dom";

// --- Layouts ---
import Layout from "./components/Layout";
import DashboardLayout from "./components/DashboardLayout";

// --- Páginas Públicas ---
import Home from "./pages/Home";
import SobrePage from "./pages/Sobre";
import ServicosPage from "./pages/Servicos";
import RastreioPage from "./pages/Rastreio";
import SolucoesPage from "./pages/Solucoes";
import ContatoPage from "./pages/Contato";
import Cadastro from "./pages/cadastro";
import Login from "./pages/login";

// --- Páginas de Admin ---
import AdminDashboard from "./pages/Admin/Dashboard";

// Importação das telas do Painel de Funcionários
import EmployeeList from "./pages/Admin/EmployeeList";           // Lista
import EmployeeRegistration from "./pages/Admin/EmployeeRegistration"; // Cadastro
import EmployeeForm from "./pages/Admin/EmployeeForm";           // Consulta (Era EmployeeInfo)
import EmployeeEdit from "./pages/Admin/EmployeeEdit";           // Edição

// --- Página Operador ---
import OperadorDashboard from "./pages/Operador/Dashboard";

const adminNavLinks = [
  { name: "Colaboradores", path: "/admin/colaboradores" },
  { name: "Cliente", path: "/admin/clientes" },
  { name: "Produtos", path: "/admin/produtos" },
  { name: "Pedido", path: "/admin/pedido" },
  { name: "Nota Fiscal", path: "/admin/notas" },
  { name: "Recursos", path: "/admin/recursos" },
  { name: "Pedidos", path: "/admin/pedidos" },
  { name: "Itens comprados", path: "/admin/itens" },
];

const operadorNavLinks = adminNavLinks;

function App() {
  return (
    <Routes>
      {/* --- Rotas Públicas --- */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/sobre" element={<SobrePage />} />
        <Route path="/servicos" element={<ServicosPage />} />
        <Route path="/rastreio" element={<RastreioPage />} />
        <Route path="/solucoes" element={<SolucoesPage />} />
        <Route path="/contato" element={<ContatoPage />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/login" element={<Login />} />
      </Route>

      {/* --- Painel Admin --- */}
      <Route
        path="/admin"
        element={
          <DashboardLayout
            pageTitle="Painel de Administração"
            userType="ADMINISTRADOR"
            navLinks={adminNavLinks}
          />
        }
      >
        <Route index element={<AdminDashboard />} />
      </Route>

      {/* --- Rotas Admin Personalizadas (Layout Exclusivo) --- */}
      
      {/* 1. Lista */}
      <Route path="/admin/colaboradores" element={<EmployeeList />} />
      
      {/* 2. Cadastro */}
      <Route path="/admin/colaboradores/novo" element={<EmployeeRegistration />} />

      {/* 3. Consulta (Usa EmployeeForm) */}
      <Route path="/admin/colaboradores/consulta" element={<EmployeeForm />} />

      {/* 4. Edição */}
      <Route path="/admin/colaboradores/edicao" element={<EmployeeEdit />} />


      {/* --- Painel Operador --- */}
      <Route
        path="/operador"
        element={
          <DashboardLayout
            pageTitle="Painel do Operador"
            userType="OPERADOR"
            navLinks={operadorNavLinks}
          />
        }
      >
        <Route index element={<OperadorDashboard />} />
      </Route>
    </Routes>
  );
}

export default App;