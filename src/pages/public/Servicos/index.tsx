import {
  TruckIcon,
  ArchiveBoxIcon,
  MagnifyingGlassIcon,
  ClockIcon,
  WrenchScrewdriverIcon,
  ArrowUturnLeftIcon,
} from "@heroicons/react/24/outline";
import React from "react";

const servicos = [
  {
    icon: TruckIcon,
    title: "Transporte de Cargas",
    text: "Coleta e entrega rápidas, com frota moderna e segurança garantida.",
  },
  {
    icon: ArchiveBoxIcon,
    title: "Distribuição e Armazenagem",
    text: "Coleta e entrega rápidas, com frota moderna e segurança garantida.",
  },
  {
    icon: MagnifyingGlassIcon,
    title: "Rastreamento em tempo real",
    text: "Acompanhe sua carga com total transparência em cada etapa.",
  },
  {
    icon: ClockIcon,
    title: "Entrega expressa",
    text: "Atendimento a cargas urgentes com agilidade e pontualidade.",
  },
  {
    icon: WrenchScrewdriverIcon,
    title: "Gestão Logística Personalizada",
    text: "Planejamento sob medida para atender às necessidades do seu negócio.",
  },
  {
    icon: ArrowUturnLeftIcon,
    title: "Logística Reversa",
    text: "Soluções ágeis para devoluções, reduzindo custos e impactos.",
  },
];


type ServiceCardProps = {
  icon: React.ElementType; 
  title: string; 
  text: string; 
};

function ServiceCard({ icon: Icon, title, text }: ServiceCardProps) {
  return (
    <div className="bg-[#F9A826] border-2 border-[#002347] p-6 rounded-lg text-[#002347]">
      <Icon className="h-12 w-12 mb-4" strokeWidth={2} />
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-base leading-relaxed">{text}</p>
    </div>
  );
}

function ServicosPage() {
  return (
    <main>
      <section className="relative bg-gray-800 text-white py-32 px-4">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1887&auto=format&fit=crop')",
          }}
        ></div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <h1 className="text-4xl font-bold mb-6">NOSSOS SERVIÇOS</h1>
          <p className="text-lg max-w-2xl">
            Na LogiFast, sua carga está em boas mãos! Trabalhamos com soluções
            ágeis e inovadoras para tornar suas entregas mais rápidas, seguras e
            eficientes. Conheça nossos serviços e descubra como podemos
            impulsionar o seu negócio.
          </p>
        </div>
      </section>

      <section className="bg-orange-50 py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8">
            {servicos.map((servico) => (
              <ServiceCard
                key={servico.title}
                icon={servico.icon}
                title={servico.title}
                text={servico.text}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-orange-50 pb-20 px-4 text-center">
        <button className="bg-white text-[#002347] border-2 border-[#002347] px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">
          Entre em contato
        </button>
      </section>
    </main>
  );
}

export default ServicosPage;
