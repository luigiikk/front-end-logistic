import { Outlet } from "react-router-dom";

// 1. Importe os componentes que acabamos de criar
import Header from "../Header";
import Footer from "../Footer";

function Layout() {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* 2. Use o componente Header */}
      <Header />

      {/* 3. O Outlet renderiza o conteúdo da página (Home, Sobre) */}
      {/* Note que adicionei <main> para semântica, o que é uma boa prática */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* 4. Use o componente Footer */}
      <Footer />
    </div>
  );
}

export default Layout;
