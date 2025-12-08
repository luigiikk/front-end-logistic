import { Route } from "react-router-dom";
import Layout from "../components/Layout";

import Home from "../pages/public/Home";
import Login from "../pages/auth/login/login";
import Cadastro from "../pages/auth/register/cadastro";
import SobrePage from "../pages/public/Sobre";
import ServicosPage from "../pages/public/Servicos";
import RastreioPage from "../pages/public/Rastreio";
import SolucoesPage from "../pages/public/Solucoes";
import ContatoPage from "../pages/public/Contato";

export function PublicRoutes() {
  return [
    <Route element={<Layout />} key="public-layout">
      <Route path="/" element={<Home />} />
      <Route path="/sobre" element={<SobrePage />} />
      <Route path="/servicos" element={<ServicosPage />} />
      <Route path="/rastreio" element={<RastreioPage />} />
      <Route path="/solucoes" element={<SolucoesPage />} />
      <Route path="/contato" element={<ContatoPage />} />
    </Route>,

    <Route>
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
    </Route>
  ];

}
