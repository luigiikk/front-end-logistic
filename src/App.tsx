import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Cadastro from "./pages/cadastro";
import Home from "./pages/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/index" element={<Home />} />
      </Routes>
    </BrowserRouter>

  );
}



export default App;// src/App.tsx

