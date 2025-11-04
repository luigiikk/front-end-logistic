/* Arquivo: src/pages/Contato/index.tsx
  Descrição: Página "Fale Conosco"
*/

import React from "react";
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";

// --- Componente da Página ---
function ContatoPage() {
  return (
    <main>
      {/* ======================================= */}
      {/* Seção 1: Hero "Fale Conosco!"           */}
      {/* ======================================= */}
      {/* Na imagem, é um azul claro. Vamos usar 'bg-blue-300' */}
      <section className="bg-blue-300 text-gray-800 py-12 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            FALE CONOSCO!
          </h1>
          <p className="text-lg max-w-3xl mx-auto">
            Entre em contato com nossa equipe e descubra como podemos
            transformar a logística da sua empresa. Estamos prontos para
            esclarecer dúvidas, apresentar nossas soluções e oferecer o suporte
            que você precisa.
          </p>
        </div>
      </section>

      {/* ======================================= */}
      {/* Seção 2: Formulário e Informações       */}
      {/* ======================================= */}
      {/* Na imagem, o fundo é um cinza/azul bem claro. 'bg-gray-100' */}
      <section className="bg-gray-100 py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            {/* --- Coluna da Esquerda (Formulário) --- */}
            <div>
              <p className="text-gray-600 text-lg mb-6">
                Horário de atendimento de segunda à sexta, das 8:00 às 18:00
              </p>

              {/* O Card do Formulário */}
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <form>
                  {/* Grid para os 4 primeiros campos */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                    {/* Campo Nome */}
                    <div>
                      <label
                        htmlFor="nome"
                        className="block text-sm font-medium text-gray-700 sr-only"
                      >
                        Nome
                      </label>
                      <input
                        type="text"
                        id="nome"
                        placeholder="Nome"
                        className="w-full p-4 border border-gray-300 rounded-lg text-lg"
                      />
                    </div>
                    {/* Campo Email */}
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 sr-only"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        placeholder="Email"
                        className="w-full p-4 border border-gray-300 rounded-lg text-lg"
                      />
                    </div>
                    {/* Campo Telefone */}
                    <div>
                      <label
                        htmlFor="telefone"
                        className="block text-sm font-medium text-gray-700 sr-only"
                      >
                        Telefone
                      </label>
                      <input
                        type="tel"
                        id="telefone"
                        placeholder="Telefone"
                        className="w-full p-4 border border-gray-300 rounded-lg text-lg"
                      />
                    </div>
                    {/* Campo Assunto */}
                    <div>
                      <label
                        htmlFor="assunto"
                        className="block text-sm font-medium text-gray-700 sr-only"
                      >
                        Assunto
                      </label>
                      <input
                        type="text"
                        id="assunto"
                        placeholder="Assunto"
                        className="w-full p-4 border border-gray-300 rounded-lg text-lg"
                      />
                    </div>
                  </div>

                  {/* Campo Mensagem */}
                  <div className="mb-6">
                    <label
                      htmlFor="mensagem"
                      className="block text-sm font-medium text-gray-700 sr-only"
                    >
                      Mensagem
                    </label>
                    <textarea
                      id="mensagem"
                      rows={6}
                      placeholder="Mensagem"
                      className="w-full p-4 border border-gray-300 rounded-lg text-lg"
                    ></textarea>
                  </div>

                  {/* Botão Enviar */}
                  <div>
                    {/* Cor do botão (laranja/dourado) */}
                    <button
                      type="submit"
                      className="w-full bg-yellow-500 text-gray-900 py-4 px-6 rounded-lg font-bold text-lg hover:bg-yellow-600 transition"
                    >
                      Enviar mensagem
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* --- Coluna da Direita (Informações) --- */}
            {/* O 'md:pt-16' alinha visualmente com o formulário */}
            <div className="md:pt-16 space-y-12">
              {/* Item Localização */}
              <div className="flex items-start">
                <MapPinIcon className="h-8 w-8 text-gray-700 mt-1 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    LOCALIZAÇÃO
                  </h3>
                  <p className="text-lg text-gray-600 mt-1">
                    RODOVIA ALAGOINHAS / SALVADOR, BR110, KM 03. CEP: 48.000-000
                    - ALAGOINHAS - BA
                  </p>
                </div>
              </div>

              {/* Item Telefone */}
              <div className="flex items-start">
                <PhoneIcon className="h-8 w-8 text-gray-700 mt-1 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-gray-800">TELEFONE:</h3>
                  <p className="text-lg text-gray-600 mt-1">
                    +55 (71) 99999-9999
                  </p>
                </div>
              </div>

              {/* Item Email */}
              <div className="flex items-start">
                <EnvelopeIcon className="h-8 w-8 text-gray-700 mt-1 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-gray-800">EMAIL:</h3>
                  <p className="text-lg text-gray-600 mt-1">
                    contato@suasolucoeslog.com.br
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ContatoPage;
