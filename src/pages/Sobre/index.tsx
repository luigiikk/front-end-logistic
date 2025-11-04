/* REMOVA os imports do Header, Footer, Link e o componente Logo daqui de cima.
  Eles não são mais necessários nesta página.
*/

function SobrePage() {
  return (
    // REMOVA o <div> principal, <header> e <footer>.
    // O conteúdo deve começar direto com <main>.
    <main>
      {/* Seção "A LOGIFAST" (Hero) */}
      <section className="bg-[#0a2540] text-white py-20 px-4">
        <div className="container mx-auto grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">A LOGIFAST</h2>
            <p className="text-lg text-gray-300">
              Na LogiFast, acreditamos que logística é muito mais do que
              transporte: é a ponte que conecta negócios, pessoas e
              oportunidades. Combinamos tecnologia, eficiência e comprometimento
              para oferecer soluções de transporte e distribuição que atendem às
              necessidades de cada cliente.
            </p>
          </div>
          <div className="flex items-center justify-center bg-gray-700 min-h-[250px] rounded-lg">
            <span className="text-gray-400 text-xl">LOGO OU IMAGEM</span>
          </div>
        </div>
      </section>

      {/* Seção "QUEM SOMOS" / "NOSSO COMPROMISSO" */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto grid md:grid-cols-2 gap-16 items-start">
          {/* Coluna da Imagem e "Quem Somos" */}
          <div className="flex flex-col items-center md:items-start">
            <div className="w-full max-w-lg h-72 bg-gray-100 rounded-lg mb-8 flex items-center justify-center">
              <span className="text-gray-500">Ilustração</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              QUEM SOMOS
            </h3>
            <p className="text-gray-600 text-lg text-center md:text-left">
              Somos uma equipe dedicada em garantir que sua carga chegue ao
              destino com segurança, agilidade e transparência.
            </p>
          </div>

          {/* Coluna "Nosso Compromisso" */}
          <div className="text-center md:text-left mt-0 md:mt-24">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              NOSSO COMPROMISSO
            </h3>
            <ul className="space-y-4">
              <li className="text-xl text-gray-700 font-medium">
                Cumprimento rigoroso de prazos
              </li>
              <li className="text-xl text-gray-700 font-medium">
                Rastreamento em tempo real
              </li>
              <li className="text-xl text-gray-700 font-medium">
                Atendimento personalizado
              </li>
              <li className="text-xl text-gray-700 font-medium">
                Frota moderna e preparada
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Seção Missão, Visão, Valores */}
      <section className="bg-[#f0c05a] py-20 px-4">
        <div className="container mx-auto grid md:grid-cols-3 gap-8 text-center">
          {/* Missão */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              NOSSA MISSÃO
            </h3>
            <div className="border-2 border-gray-800 p-6 rounded-lg bg-white/20 min-h-[220px]">
              <p className="text-lg text-gray-800">
                Garantir soluções logísticas eficientes, seguras e ágeis,
                conectando empresas e clientes com transparência e
                comprometimento.
              </p>
            </div>
          </div>
          {/* Visão */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              NOSSA VISÃO
            </h3>
            <div className="border-2 border-gray-800 p-6 rounded-lg bg-white/20 min-h-[220px]">
              <p className="text-lg text-gray-800">
                Ser reconhecida como uma das principais referências em logística
                inteligente e sustentável no Brasil, oferecendo inovação
                contínua e construindo parcerias duradouras.
              </p>
            </div>
          </div>
          {/* Valores */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              NOSSOS VALORES
            </h3>
            <div className="border-2 border-gray-800 p-6 rounded-lg bg-white/20 min-h-[220px] flex items-center justify-center">
              <ul className="space-y-2">
                <li className="text-lg text-gray-800 font-medium">Inovação</li>
                <li className="text-lg text-gray-800 font-medium">Segurança</li>
                <li className="text-lg text-gray-800 font-medium">
                  Compromisso
                </li>
                <li className="text-lg text-gray-800 font-medium">
                  Transparência
                </li>
                <li className="text-lg text-gray-800 font-medium">
                  Cliente no centro
                </li>
                <li className="text-lg text-gray-800 font-medium">
                  Trabalho em equipe
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
    // REMOVA o <footer> que estava aqui
  );
}

export default SobrePage;
