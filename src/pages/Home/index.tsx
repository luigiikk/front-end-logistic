import { FiCpu, FiMapPin, FiLock, FiTrendingUp } from "react-icons/fi";
type FeatureCardProps = {
  icon: React.ReactElement;
  title: string;
  description: string;
};

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <div className="flex items-start text-left space-x-4">
    <div className="text-4xl text-blue-800 flex-shrink-0 mt-1">{icon}</div>
    <div>
      <h3 className="font-bold text-lg mb-1">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  </div>
);

function Home() {
  return (
    <>
      <section
        className="relative min-h-[550px] bg-cover bg-center flex items-center justify-center text-white"
        style={{ backgroundImage: "url('/home-bg.svg')" }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>{" "}
        {/* Isso escurece a imagem de fundo */}
        <div className="relative z-10 text-center max-w-4xl px-4">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            A PLATAFORMA DE LOGÍSTICA DIGITAL QUE CONECTA EMPRESAS A SOLUÇÕES
            RÁPIDAS E INTELIGENTES.
          </h1>
          <p className="text-lg md:text-xl mb-8">
            Automatizamos processos, otimizamos rotas e fornecemos informações
            em tempo real para você ter total controle sobre sua operação.
          </p>
          <button className="bg-white text-black font-bold py-3 px-8 rounded-full hover:bg-gray-200 transition text-lg ">
            Saiba mais
          </button>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 text-center flex flex-col justify-center items-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-16">
            VANTAGENS PARA SUA EMPRESA
          </h2>
          <div className="flex justify-center items-center gap-30">
            <div className="flex flex-col gap-8">
            <FeatureCard
              icon={<FiCpu />}
              title="Eficiência Operacional"
              description="Otimização de rotas para reduzir custos e prazos de entrega."
            />
            <FeatureCard
              icon={<FiMapPin />}
              title="Rastreamento e Transparência"
              description="Acompanhamento em tempo real das entregas."
            />
            </div>
            <div className="flex flex-col gap-8">
            <FeatureCard
              icon={<FiLock />}
              title="Segurança e Confiabilidade"
              description="Monitoramento contínuo das cargas."
            />
            <FeatureCard
              icon={<FiTrendingUp />}
              title="Gestão Inteligente"
              description="Controle centralizado de transporte, cargas e estoques."
            />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
