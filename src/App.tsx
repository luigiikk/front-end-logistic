import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import DashboardLayout from "./components/DashboardLayout";

// --- Páginas Públicas ---
import Home from "./pages/Home";
import SobrePage from "./pages/Sobre";
import ServicosPage from "./pages/Servicos";
import RastreioPage from "./pages/Rastreio";
import SolucoesPage from "./pages/Solucoes";
import ContatoPage from "./pages/Contato";
import Cadastro from "./pages/cadastro"
import Login from "./pages/login";
import AdminDashboard from "./pages/Admin/Dashboard";
import OperadorDashboard from "./pages/Operador/Dashboard";



const adminNavLinks = [
  { name: "Colaboradores", path: "/admin/colaboradores" },
  { name: "Cliente", path: "/admin/clientes" },
  { name: "Produtos", path: "/admin/produtos" },
  { name: "Pedidos", path: "/admin/pedido" },
  { name: "Nota Fiscal", path: "/admin/notas" },
  { name: "Recursos", path: "/admin/recursos" },
  { name: "Veículos", path: "/admin/veiculos" },
  { name: "Itens comprados", path: "/admin/itens" },
];

const operadorNavLinks = adminNavLinks;

function App() {
  return (
    <Routes>
      {/* --- Rotas Públicas (com o Layout principal) --- */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/sobre" element={<SobrePage />} />
        <Route path="/servicos" element={<ServicosPage />} />
        <Route path="/rastreio" element={<RastreioPage />} />
        <Route path="/solucoes" element={<SolucoesPage />} />
        <Route path="/contato" element={<ContatoPage />} />
        <Route path="/cadastro" element={<Cadastro/>}/>
        <Route path="/login" element={<Login/>}/>
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
