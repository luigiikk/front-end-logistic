function SobrePage() {
  return (
    <main>
      <section className="bg-[#0F4F7E] text-white py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-4xl font-bold mb-12 text-center">A LOGIFAST</h1>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-lg text-gray-200 space-y-4 text-justify">
              <p>
                A <strong className="font-bold text-[#F9A826]">LogiFast</strong>{" "}
                é uma empresa de logística integrada que atua no mercado há mais
                de 10 anos, oferecendo soluções completas e personalizadas para
                seus clientes. Nosso objetivo é garantir a eficiência e a
                segurança no transporte, armazenagem e distribuição de cargas, com agilidade e confiabilidade.
              </p>
              <p>
                Contamos com uma equipe qualificada e experiente, além de uma
                frota moderna e equipada com tecnologia de ponta.
              </p>
            </div>

            <div className="flex items-center justify-center min-h-[250px]">
              <div className="p-8 rounded-lg flex items-center justify-center">
                <img  
                src="src\img\logo2.png"
                alt="Logo"
                className="w-full max-w-sm h-auto" 
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl grid md:grid-cols-2 gap-16 items-center">
          <div className="flex justify-center">
            <div className="w-full max-w-lg h-72 bg-white rounded-lg flex items-center justify-center">
              <span className="text-gray-500 text-lg">
                <img src="src\img\sobre.png" alt="Ilustração" />
              </span>
            </div>
          </div>
          <div className="text-gray-800">
            <h2 className="text-3xl font-bold text-[#002347] mb-4">
              QUEM SOMOS
            </h2>
            <p className="text-gray-600 text-lg mb-10">
              A LogiFast é uma empresa de logística integrada que atua no
              mercado há mais de 10 anos, oferecendo soluções completas e
              personalizadas para seus clientes.
            </p>
            <h2 className="text-3xl font-bold text-[#002347] mb-4">
              NOSSO COMPROMISSO
            </h2>
            <p className="text-gray-600 text-lg">
              Nosso compromisso é garantir a eficiência e a segurança no
              transporte, armazenagem e distribuição de cargas, com agilidade e
              confiabilidade.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#F6BD61] py-20 px-4">
        <div className="container mx-auto max-w-6xl grid md:grid-cols-3 gap-12 text-center">
          <div className="text-[#002347]">
            <h3 className="text-2xl font-bold mb-4">NOSSA MISSÃO</h3>
            <div className="border-2 border-[#002347] p-6 rounded-lg min-h-[220px] flex items-center justify-center">
              <p className="text-lg leading-relaxed">
                Oferecer soluções logísticas integradas e personalizadas, com
                agilidade, segurança e eficiência, garantindo a satisfação de
                nossos clientes.
              </p>
            </div>
          </div>

          <div className="text-[#002347]">
            <h3 className="text-2xl font-bold mb-4">NOSSA VISÃO</h3>
            <div className="border-2 border-[#002347] p-6 rounded-lg min-h-[220px] flex items-center justify-center">
              <p className="text-lg leading-relaxed">
                Ser referência no mercado de logística integrada, reconhecida
                pela excelência em nossos serviços e pelo compromisso com nossos
                clientes.
              </p>
            </div>
          </div>

          <div className="text-[#002347]">
            <h3 className="text-2xl font-bold mb-4">NOSSOS VALORES</h3>
            <div className="border-2 border-[#002347] p-6 rounded-lg min-h-[220px] flex items-center justify-center">
              <p className="text-lg leading-relaxed">
                Ética, transparência, comprometimento, responsabilidade social e
                ambiental, valorização de nossos colaboradores.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default SobrePage;
