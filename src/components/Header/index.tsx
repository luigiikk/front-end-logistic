const NavLink = ({ children }: { children: React.ReactNode }) => (
  <a href="#" className="text-gray-600 hover:text-blue-700 transition-colors">
    {children}
  </a>
);

function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-blue-800"></div>
        <div className="hidden md:flex items-center space-x-8">
          <NavLink>HOME</NavLink>
          <NavLink>SOBRE</NavLink>
          <NavLink>SERVIÇOS</NavLink>
          <NavLink>RASTREIO</NavLink>
          <NavLink>SOLUÇÕES</NavLink>
          <NavLink>CONTATO</NavLink>
        </div>
        <div className="hidden md:flex items-center space-x-2">
          <button className="px-6 py-2 text-blue-800 border border-gray-300 rounded hover:bg-gray-100 transition">
            ENTRE
          </button>
          <button className="px-6 py-2 bg-blue-800 text-white rounded hover:bg-blue-700 transition">
            CADASTRE-SE
          </button>
        </div>
      </nav>
    </header>
  );
}

export default Header;
