import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SobrePage from "./pages/Sobre";
import Layout from "./components/Layout"; // 1. Importe o Layout

function App() {
  return (
    <Routes>
      {/* 2. Crie uma rota "pai" que usa o Layout */}
      <Route element={<Layout />}>
        {/* 3. Coloque suas páginas como "filhas" do Layout */}
        <Route path="/" element={<Home />} />
        <Route path="/sobre" element={<SobrePage />} />

        {/* Outras páginas futuras também irão aqui dentro */}
      </Route>
    </Routes>
  );
}

export default App;
