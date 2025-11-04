import { Routes, Route } from "react-router-dom";

// --- Layouts ---
import Layout from "./components/Layout";
// 1. Importe o NOVO layout renomeado
import DashboardLayout from "./components/DashboardLayout";

// --- Páginas Públicas ---
import Home from "./pages/Home";
import SobrePage from "./pages/Sobre";
import ServicosPage from "./pages/Servicos";
import RastreioPage from "./pages/Rastreio";
import SolucoesPage from "./pages/Solucoes";
import ContatoPage from "./pages/Contato";

// --- Páginas de Admin ---
import AdminDashboard from "./pages/Admin/Dashboard";

// 2. Importe a nova página do Operador
import OperadorDashboard from "./pages/Operador/Dashboard";

// --- 3. Definição dos Links da Sidebar ---
// Como você disse que são iguais, vamos definir a lista uma vez
const adminNavLinks = [
  { name: "Usuário", path: "/admin/usuarios" },
  { name: "Cliente", path: "/admin/clientes" },
  { name: "Produtos", path: "/admin/produtos" },
  { name: "Pedido", path: "/admin/pedido" },
  { name: "Nota Fiscal", path: "/admin/notas" },
  { name: "Recursos", path: "/admin/recursos" },
  { name: "Pedidos", path: "/admin/pedidos" },
  { name: "Itens comprados", path: "/admin/itens" },
];

// (Se o Operador tiver links diferentes, você pode criar uma nova lista)
// Por enquanto, vamos usar a mesma, como você pediu:
const operadorNavLinks = adminNavLinks;

function App() {
  return (
    <Routes>
      {/* --- Rotas Públicas (com o Layout principal) --- */}
      <Route element={<Layout />}>
        {/* ... (todas as suas rotas públicas: /, /sobre, /contato, etc.) ... */}
        <Route path="/" element={<Home />} />
        <Route path="/sobre" element={<SobrePage />} />
        <Route path="/servicos" element={<ServicosPage />} />
        <Route path="/rastreio" element={<RastreioPage />} />
        <Route path="/solucoes" element={<SolucoesPage />} />
        <Route path="/contato" element={<ContatoPage />} />
      </Route>

      {/* --- Rotas de Admin --- */}
      {/* 4. Usamos o DashboardLayout e passamos os props de ADMIN */}
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
        {/* <Route path="usuarios" element={<PaginaDeUsuarios />} /> */}
      </Route>

      {/* --- Rotas de Operador --- */}
      {/* 5. Usamos O MESMO DashboardLayout e passamos os props de OPERADOR */}
      <Route
        path="/operador"
        element={
          <DashboardLayout
            pageTitle="Painel do Operador"
            userType="OPERADOR"
            navLinks={operadorNavLinks} // Usando a mesma lista por enquanto
          />
        }
      >
        <Route index element={<OperadorDashboard />} />
        {/* <Route path="pedidos" element={<PaginaDePedidos />} /> */}
      </Route>
    </Routes>
  );
}

export default App;
