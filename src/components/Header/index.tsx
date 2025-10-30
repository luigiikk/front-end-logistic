const NavLink = ({ children }: { children: React.ReactNode }) => (
  <a href="#" className="text-black hover:text-[#3C91E6] transition-colors">
    {children}
  </a>
);

function Header() {
  return (
    <header className="w-full bg-white border-b border-gray-200">
      <nav className="max-w-7xl mx-auto flex items-center justify-between h-16 px-6">
        <div className="flex items-center gap-2">
          <img src="../src/Img/logo.png" alt="" srcSet="w-40 h-20" />
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-black">
          <NavLink>HOME</NavLink>
          <NavLink>SOBRE</NavLink>
          <NavLink>SERVIÇOS</NavLink>
          <NavLink>RASTREIO</NavLink>
          <NavLink>SOLUÇÕES</NavLink>
          <NavLink>CONTATO</NavLink>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-6 py-2 text-black border border-gray-300 rounded-xl hover:bg-gray-100 transition cursor-pointer">
            ENTRE
          </button>
          <button className="px-6 py-2 bg-[#0A3D62] text-white rounded-xl hover:bg-[#3C91E6] transition cursor-pointer">
            CADASTRE-SE
          </button>
        </div>
      </nav>
    </header>
  );
}

export default Header;
