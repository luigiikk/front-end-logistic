/* Arquivo: src/pages/Rastreio/index.tsx
  Descrição: Página de Rastreio com os tipos TypeScript corrigidos.
*/

import { useState } from "react";
import React from "react"; // Importe o React
import {
  MapPinIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
  ArchiveBoxIcon,
  TruckIcon,
  HomeIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

// --- 1. Definição dos Tipos ---
type TrackingHistory = {
  date: string;
  time: string;
  status: string;
};

type ProgressStep = {
  name: string;
  date: string;
  icon: React.ElementType; // Tipo para um componente
  completed: boolean;
};

type OrderData = {
  eta: string;
  history: TrackingHistory[];
  progress: ProgressStep[];
};

// --- 2. Dados Falsos (Mock Data) com o tipo aplicado ---
const mockTrackingData: OrderData = {
  eta: "Entrega até 07/11/25",
  history: [
    {
      date: "01/11/2025",
      time: "16:00",
      status: "Entrega realizada com sucesso.",
    },
    {
      date: "28/10/2025",
      time: "14:00",
      status: "Seu produto está a caminho.",
    },
    {
      date: "27/10/2025",
      time: "10:00",
      status:
        "O seu pedido está na unidade da Transportadora mais próximo de você.",
    },
    {
      date: "26/10/2025",
      time: "09:00",
      status:
        "O seu pedido está em trânsito para a unidade da Transportadora mais próximo de você.",
    },
    {
      date: "26/10/2025",
      time: "08:00",
      status: "O seu pedido já está com a transportadora.",
    },
  ],
  progress: [
    {
      name: "Pedido feito",
      date: "20/10/25 - 14:00",
      icon: CheckCircleIcon,
      completed: true,
    },
    {
      name: "Pagamento aprovado",
      date: "20/10/25 - 14:10",
      icon: CurrencyDollarIcon,
      completed: true,
    },
    {
      name: "Em separação",
      date: "22/10/25 - 7:00",
      icon: ArchiveBoxIcon,
      completed: true,
    },
    {
      name: "Em transporte",
      date: "26/10/25 - 10:00",
      icon: TruckIcon,
      completed: true,
    },
    {
      name: "Pedido entregue",
      date: "01/11/25 - 16:00",
      icon: HomeIcon,
      completed: true,
    },
  ],
};

// --- Componente da Página ---
function RastreioPage() {
  const [trackingCode, setTrackingCode] = useState("");

  const [orderData, setOrderData] = useState<OrderData | null>(null);

  const handleSearch = () => {
    if (trackingCode.trim() !== "") {
      setOrderData(mockTrackingData);
    }
  };

  const handleClearSearch = () => {
    setTrackingCode("");
    setOrderData(null);
  };

  return (
    <main>
      {/* ======================================= */}
      {/* Seção 1: Formulário de Busca            */}
      {/* ======================================= */}
      <section className="bg-[#002347] text-white py-20 px-4">
        <div className="container mx-auto max-w-6xl grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <MapPinIcon className="h-16 w-16 text-blue-400" />
            <h1 className="text-4xl font-bold">RASTREIE SUA ENCOMENDA!</h1>
            <p className="text-lg text-gray-300">
              Na LogiFast, você acompanha cada etapa da sua entrega de forma
              rápida, simples e transparente.
            </p>
            <p className="text-lg text-gray-300">
              {" "}
              {/* <-- ERRO CORRIGIDO AQUI (era </(p>) */}
              Basta inserir o código de rastreamento no campo abaixo e pronto:
              em segundos você terá todas as informações atualizadas sobre o
              status da sua carga.
            </p>
            <p className="text-lg text-gray-300">
              Porque aqui, sua carga está sempre no seu controle.
            </p>
          </div>

          <div className="bg-white text-gray-800 p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-[#002347] mb-4">
              Quer saber onde está seu pedido?
            </h2>
            <p className="text-gray-600 mb-6">
              Coloque o código e acompanhe já!
            </p>

            <label
              htmlFor="trackingCode"
              className="block text-sm font-medium text-gray-600 mb-2"
            >
              Digite o código de rastreio ou CPF
            </label>
            <input
              type="text"
              id="trackingCode"
              value={trackingCode}
              onChange={(e) => setTrackingCode(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg mb-6 text-gray-900"
              placeholder="Digite o código de rastreio ou CPF"
            />
            <button
              onClick={handleSearch}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition"
            >
              Rastrear encomenda
            </button>
          </div>
        </div>
      </section>

      {/* ======================================= */}
      {/* Seção 2: Resultados (Condicional)       */}
      {/* ======================================= */}
      {orderData && (
        <section className="bg-white py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-16">
              ACOMPANHE SUA ENCOMENDA
            </h2>

            <div className="flex mb-16">
              {orderData.progress.map((step: ProgressStep, index: number) => (
                <div
                  key={step.name}
                  className="flex-1 text-center relative px-2"
                >
                  <div
                    className={`relative z-10 w-16 h-16 mx-auto rounded-full flex items-center justify-center
                    ${
                      step.completed
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    <step.icon className="h-8 w-8" />
                  </div>
                  <p className="font-bold mt-2 text-sm md:text-base text-gray-700">
                    {step.name}
                  </p>
                  <p className="text-xs md:text-sm text-gray-500">
                    {step.date}
                  </p>
                  {index < orderData.progress.length - 1 && (
                    <div
                      className={`absolute top-8 left-1/2 w-full h-1 
                      ${step.completed ? "bg-blue-600" : "bg-gray-200"}`}
                    ></div>
                  )}
                </div>
              ))}
            </div>

            <div className="mb-8">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Encomenda</h3>
                  <p className="text-gray-600">{orderData.eta}</p>
                </div>
                <a
                  href="#"
                  className="inline-flex items-center text-blue-600 hover:underline font-medium"
                >
                  <DocumentTextIcon className="h-5 w-5 mr-1" />
                  Visualizar Nota Fiscal
                </a>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg overflow-hidden shadow">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hora
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orderData.history.map((entry: TrackingHistory) => (
                    <tr
                      key={entry.date + entry.time}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {entry.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {entry.time}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800">
                        {entry.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="text-center mt-12">
              <button
                onClick={handleClearSearch}
                className="text-blue-600 font-medium hover:underline"
              >
                Buscar outra encomenda
              </button>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

export default RastreioPage;
