import logoFooterImage from "../../img/logo2.png";

function Footer() {
  return (
    <footer className="bg-[#33373a] text-white py-16 px-4">
      <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {/* Col 1: Logo */}
        <div className="col-span-2 md:col-span-1">
          <img
            src={logoFooterImage}
            alt="LogiFast"
            // MUDANÇA: Tamanho da logo aumentado para h-16
            className="h-16 w-auto"
          />
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

      {/* Copyright */}
      <div className="container mx-auto text-center border-t border-gray-700 mt-12 pt-8">
        <p className="text-gray-500">
          &copy; 2025 LogiFast Todos os direitos reservados
        </p>
      </div>
    </footer>
  );
}

export default Footer;
