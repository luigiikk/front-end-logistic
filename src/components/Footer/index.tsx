import logoFooterImage from "../../img/logo2.png";

const footerLinks = [
  {
    title: "QUEM SOMOS",
    links: [
      { label: "Sobre", href: "#" },
      { label: "Central de ajuda", href: "#" },
    ],
  },
  {
    title: "NOSSAS SOLUÇÕES",
    links: [
      { label: "Rastrear encomenda", href: "#" },
      { label: "Transporte Nacional", href: "#" },
      { label: "Logística e Armazenagem", href: "#" },
      { label: "Soluções customizadas", href: "#" },
    ],
  },
  {
    title: "PARCERIAS",
    links: [
      { label: "Seja um ponto de coleta", href: "#" },
      { label: "Seja um entregador", href: "#" },
      { label: "Seja uma transportadora parceira", href: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#0F3B63] text-white py-10 px-4">
      {/* GRID PRINCIPAL */}
      <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {/* LOGO */}
        <div className="col-span-2 md:col-span-1 flex items-start">
          <img
            src={logoFooterImage}
            alt="LogiFast"
            className="h-16 w-auto"
          />
        </div>

        {footerLinks.map((section) => (
          <div key={section.title}>
            <h4 className="font-semibold mb-3 text-gray-200 text-sm tracking-wide">
              {section.title}
            </h4>

            <ul className="space-y-1">
              {section.links.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-gray-300 hover:text-white text-sm transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="container mx-auto mt-6">
        <hr className="border-gray-500" />
      </div>

      <div className="container mx-auto text-center mt-4">
        <p className="text-gray-300 text-sm">
          © 2025 LogiFast — Todos os direitos reservados
        </p>
      </div>
    </footer>
  );
}
