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

// Funcionários
import EmployeeList from "./pages/Admin/EmployeeList";
import EmployeeRegistration from "./pages/Admin/EmployeeRegistration";
import EmployeeForm from "./pages/Admin/EmployeeForm";
import EmployeeEdit from "./pages/Admin/EmployeeEdit";
import EmployeeDeletion from "./pages/Admin/EmployeeDeletion";

// Clientes
import ClientList from "./pages/Admin/ClientList";
import ClientRegistration from "./pages/Admin/ClientRegistration";
import ClientEdit from "./pages/Admin/ClientEdit";
import ClientDeletion from "./pages/Admin/ClientDeletion";
import ClientInfo from "./pages/Admin/ClientInfo";

// Produtos
import ProductList from "./pages/Admin/ProductList";
import ProductRegistration from "./pages/Admin/ProductRegistration";
import ProductEdit from "./pages/Admin/ProductEdit";
import ProductDeletion from "./pages/Admin/ProductDeletion";
import ProductInfo from "./pages/Admin/ProductInfo";

// --- Página Operador ---
import OperadorDashboard from "./pages/Operador/Dashboard"; // <--- Importação Crítica

// Links de navegação
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
      {/* Rotas Públicas */}
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

      {/* Admin Dashboard */}
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

      {/* Rotas Admin Personalizadas - Funcionários */}
      <Route path="/admin/colaboradores" element={<EmployeeList />} />
      <Route
        path="/admin/colaboradores/novo"
        element={<EmployeeRegistration />}
      />
      <Route path="/admin/colaboradores/consulta" element={<EmployeeForm />} />
      <Route path="/admin/colaboradores/edicao" element={<EmployeeEdit />} />
      <Route
        path="/admin/colaboradores/exclusao"
        element={<EmployeeDeletion />}
      />

      {/* Rotas Admin Personalizadas - Clientes */}
      <Route path="/admin/clientes" element={<ClientList />} />
      <Route path="/admin/clientes/novo" element={<ClientRegistration />} />
      <Route path="/admin/clientes/edicao" element={<ClientEdit />} />
      <Route path="/admin/clientes/exclusao" element={<ClientDeletion />} />
      <Route path="/admin/clientes/consulta" element={<ClientInfo />} />

      {/* Rotas Admin Personalizadas - Produtos */}
      <Route path="/admin/produtos" element={<ProductList />} />
      <Route path="/admin/produtos/novo" element={<ProductRegistration />} />
      <Route path="/admin/produtos/edicao" element={<ProductEdit />} />
      <Route path="/admin/produtos/exclusao" element={<ProductDeletion />} />
      <Route path="/admin/produtos/consulta" element={<ProductInfo />} />

      {/* Painel Operador */}
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
