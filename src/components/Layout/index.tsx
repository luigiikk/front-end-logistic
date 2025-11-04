import { Link, Outlet } from "react-router-dom";

// Componente de Logo temporário
const Logo = ({ inFooter = false }) => (
  <span
    className={`text-2xl font-bold ${inFooter ? "text-white" : "text-white"}`}
  >
    <span className="text-blue-400">Logi</span>Fast
  </span>
);

function Layout() {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* === 1. HEADER (CABEÇALHO) === */}
      <header className="bg-[#0a2540] text-white p-4 sticky top-0 z-50">
        <nav className="container mx-auto flex justify-between items-center">
          <Logo />
          {/* Links da Navegação */}
          <div className="hidden md:flex space-x-6 items-center">
            {/* Aqui está a mágica: Usamos <Link to="..."> */}
            <Link to="/" className="hover:text-gray-300 text-sm font-medium">
              HOME
            </Link>
            <Link
              to="/sobre"
              className="hover:text-gray-300 text-sm font-medium"
            >
              SOBRE
            </Link>

            {/* Links futuros */}
            <a href="#" className="hover:text-gray-300 text-sm font-medium">
              SERVIÇOS
            </a>
            <a href="#" className="hover:text-gray-300 text-sm font-medium">
              RASTREIO
            </a>
            <a href="#" className="hover:text-gray-300 text-sm font-medium">
              SOLUÇÕES
            </a>
            <a href="#" className="hover:text-gray-300 text-sm font-medium">
              CONTATO
            </a>
          </div>
          {/* Botões de Ação */}
          <div className="hidden md:flex space-x-2">
            <button className="px-4 py-2 border border-white rounded text-sm hover:bg-white hover:text-blue-900 transition">
              ENTRE
            </button>
            <button className="px-4 py-2 bg-blue-600 rounded text-sm hover:bg-blue-700 transition">
              CADASTRE-SE
            </button>
          </div>
        </nav>
      </header>

      {/* === 2. CONTEÚDO DA PÁGINA (Outlet) === */}
      {/* O <Outlet /> é um espaço reservado. O react-router-dom
        vai renderizar a página da rota atual (Home ou Sobre) aqui.
      */}
      <div className="flex-grow">
        <Outlet />
      </div>

      {/* === 3. FOOTER (RODAPÉ) === */}
      <footer className="bg-[#33373a] text-white py-16 px-4">
        <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Col 1: Logo */}
          <div className="col-span-2 md:col-span-1">
            <Logo inFooter={true} />
          </div>
          {/* Col 2: Quem Somos */}
          <div>
            <h4 className="font-bold mb-4 text-gray-300">QUEM SOMOS</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-gray-300 text-gray-400">
                  Sobre
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-300 text-gray-400">
                  Central de ajuda
                </a>
              </li>
            </ul>
          </div>
          {/* Col 3: Nossas Soluções */}
          <div>
            <h4 className="font-bold mb-4 text-gray-300">NOSSAS SOLUÇÕES</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-gray-300 text-gray-400">
                  Rastrear encomenda
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-300 text-gray-400">
                  Transporte Nacional
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-300 text-gray-400">
                  Logística e Armazenagem
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-300 text-gray-400">
                  Soluções customizadas
                </a>
              </li>
            </ul>
          </div>
          {/* Col 4: Parcerias */}
          <div>
            <h4 className="font-bold mb-4 text-gray-300">PARCERIAS</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-gray-300 text-gray-400">
                  Seja um ponto de coleta
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-300 text-gray-400">
                  Seja um entregador
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-300 text-gray-400">
                  Seja uma transportadora parceira
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto text-center border-t border-gray-700 mt-12 pt-8">
          <p className="text-gray-500">
            &copy; 2025 LogiFast Todos os direitos reservados
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
