import logo from "../../img/logo.png"

function Header(){
  return (
    <header className="w-full bg-white border-b border-gray-200 ">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src={logo} alt="LogiFast" className="w-40 h-20" />
        </div>

        {/* Menu */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-black">
          <a href="#" className="hover:text-[#3C91E6] transition-colors">HOME</a>
          <a href="#" className="hover:text-[#3C91E6] transition-colors">SOBRE</a>
          <a href="#" className="hover:text-[#3C91E6] transition-colors">SERVIÇOS</a>
          <a href="#" className="hover:text-[#3C91E6] transition-colors">RASTREIO</a>
          <a href="#" className="hover:text-[#3C91E6] transition-colors">SOLUÇÕES</a>
          <a href="#" className="hover:text-[#3C91E6] transition-colors">CONTATO</a>
        </nav>

        {/* Botões */}
        <div className="flex items-center gap-3">
          <button className="border border-[#0A3D62] text-[#3C91E6] font-medium px-4 py-1.5 rounded-xl hover:bg-[#0c2340] hover:text-white transition cursor-pointer">
            ENTRE
          </button>
          <button className="bg-[#0A3D62] text-white font-medium px-4 py-1.5 rounded-xl hover:bg-[#3C91E6] transition cursor-pointer">
            CADASTRE-SE
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;