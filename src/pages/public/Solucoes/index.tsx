import React from "react";

import trucksImage from "../../../Img/caminhoesSolucoes.png";

const solucoes = [
  {
    title: "Rastreamento em Tempo Real",
    text: "Monitoramento de veículos e cargas com localização precisa e atualizada.",
  },
  {
    title: "Segurança de Dados e Operações",
    text: "Tecnologia robusta para manter informações e operações sempre protegidas.",
  },
  {
    title: "Gestão de Transportes (TMS)",
    text: "Controle completo de frotas, cargas e entregas em uma única plataforma.",
  },
  {
    title: "Automação de Processos",
    text: "Redução de atividades manuais com emissão automática de relatórios e alertas.",
  },
  {
    title: "Gestão de Estoque",
    text: "Controle inteligente de mercadorias, com atualização em tempo real, redução de perdas.",
  },
  {
    title: "Picking Inteligente",
    text: "Processo de separação de pedidos otimizado, garantindo mais agilidade e redução de erros na expedição.",
  },
];

function SolucoesPage() {
  return (
    <main>
      <section className="grid grid-cols-1 md:grid-cols-3">
        <div className="bg-blue-600 text-white p-10 flex flex-col justify-center">
          <h1 className="text-4xl font-bold mb-6">
            Soluções que otimizam sua logística
          </h1>
          <p className="text-lg text-blue-100">
            Combinamos tecnologia e experiência para oferecer soluções que
            reduzem custos, aumentam a eficiência e elevam o nível da sua gestão
            logística.
          </p>
        </div>

        <div className="md:col-span-2 bg-white p-1">
          <img
            src={trucksImage} // <-- A variável do import
            alt="Caminhões da LogiFast"
            className="w-full h-auto rounded-lg shadow-md"
          />
        </div>
      </section>

      <section className="bg-blue-600 py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {solucoes.map((solucao) => (
              <div
                key={solucao.title}
                className="bg-[#0a2540] p-8 rounded-lg shadow-lg text-white"
              >
                <h3 className="text-xl font-bold mb-4">{solucao.title}</h3>
                <p className="text-gray-300">{solucao.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default SolucoesPage;
