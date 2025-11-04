import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // 1. Importe o BrowserRouter
import "./index.css";
import App from "./App"; // 2. Importe seu componente App principal

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      {" "}
      {/* 3. Envolva o <App> com ele */}
      <App />
    </BrowserRouter>
  </StrictMode>
);
