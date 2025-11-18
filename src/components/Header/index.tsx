import { Link } from "react-router-dom";
import logoHeaderImage from "../../img/logo.png";

const navLinks = [
  { label: "HOME", to: "/" },
  { label: "SOBRE", to: "/sobre" },
  { label: "SERVIÇOS", to: "/servicos" },
  { label: "RASTREIO", to: "/rastreio" },
  { label: "SOLUÇÕES", to: "/solucoes" },
  { label: "CONTATO", to: "/contato" },
];

export default function Header() {
  return (
    <header className="w-full bg-white text-black px-4 py-2 sticky top-0 z-50 border-b border-gray-200 shadow-sm">
      <nav className="container mx-auto flex justify-between items-center">

        {/* Logo */}
        <Link to="/" aria-label="Ir para a página inicial">
          <img
            src={logoHeaderImage}
            alt="Logo LogiFast"
            className="h-14 w-auto"
          />
        </Link>

        {/* Navegação */}
        <div className="hidden md:flex space-x-6 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm font-medium hover:text-blue-600 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Botões */}
        <div className="hidden md:flex space-x-2">
          <Link
            to="/login"
            className="px-4 py-2 border border-blue-600 text-blue-600 rounded text-sm hover:bg-blue-50 transition"
          >
            ENTRE
          </Link>

          <Link
            to="/cadastro"
            className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition"
          >
            CADASTRE-SE
          </Link>
        </div>
      </nav>
    </header>
  );
}