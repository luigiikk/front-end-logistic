import { Link } from "react-router-dom";
import logoHeaderImage from "../../img/logo.png";

function Header() {
  return (
    <header className="w-full bg-white text-black px-4 py-2 sticky top-0 z-50 border-b border-gray-200 shadow-sm">
      <nav className="container mx-auto flex justify-between items-center">
        <Link to="/">
          <img
            src={logoHeaderImage}
            alt="LogiFast"
            className="h-14 w-auto" // Logo h-14
          />
        </Link>

        {/* Links */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link to="/" className="hover:text-blue-600 text-sm font-medium">
            HOME
          </Link>
          <Link to="/sobre" className="hover:text-blue-600 text-sm font-medium">
            SOBRE
          </Link>
          <Link
            to="/servicos"
            className="hover:text-blue-600 text-sm font-medium"
          >
            SERVIÇOS
          </Link>
          <Link
            to="/rastreio"
            className="hover:text-blue-600 text-sm font-medium"
          >
            RASTREIO
          </Link>
          <Link
            to="/solucoes"
            className="hover:text-blue-600 text-sm font-medium"
          >
            SOLUÇÕES
          </Link>
          <Link
            to="/contato"
            className="hover:text-blue-600 text-sm font-medium"
          >
            CONTATO
          </Link>
        </div>

        {/* Botões */}
        <div className="hidden md:flex space-x-2">
          <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded text-sm hover:bg-blue-50 transition">
            ENTRE
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition">
            CADASTRE-SE
          </button>
        </div>
      </nav>
    </header>
  );
}

export default Header;
