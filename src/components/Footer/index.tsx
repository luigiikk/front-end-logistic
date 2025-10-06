function Footer() {
  return (
    <footer className="bg-[#1E2A3A] text-white">
      <div className="container mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h2 className="text-2xl font-bold">LogiFast</h2>
        </div>
        <div>
          <h3 className="font-bold mb-4">QUEM SOMOS</h3>
          <ul className="space-y-2 text-gray-300">
            <li>
              <a href="#" className="hover:underline">
                Sobre
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Central de ajuda
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-4">NOSSAS SOLUÇÕES</h3>
          <ul className="space-y-2 text-gray-300">
            <li>
              <a href="#" className="hover:underline">
                Rastrear encomenda
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Transporte Nacional
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Logística e Armazenagem
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Soluções customizadas
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-4">PARCERIAS</h3>
          <ul className="space-y-2 text-gray-300">
            <li>
              <a href="#" className="hover:underline">
                Seja um ponto de coleta
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Seja um entregador
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Seja uma transportadora parceira
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="bg-[#111827] py-4">
        <p className="text-center text-gray-400 text-sm">
          © 2025 LogiFast Todos os direitos reservados
        </p>
      </div>
    </footer>
  );
}

export default Footer;
