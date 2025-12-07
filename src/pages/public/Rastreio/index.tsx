"use client";

import { useState } from "react";
import { api } from "../../../api/lib/api"; // ajuste o caminho conforme seu projeto
import {
  MapPinIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

type TrackingHistory = {
  date: string;
  time: string;
  status: string;
};

type ProgressStep = {
  name: string;
  date: string;
  completed: boolean;
};

type OrderData = {
  code: string;
  sender_client: { name: string };
  recipient: { name: string };
  status: { name: string };
  history?: TrackingHistory[]; // opcional, se quiser mostrar histórico
  progress?: ProgressStep[];   // opcional, se quiser mostrar progresso
};

export default function RastreioPage() {
  const [trackingCode, setTrackingCode] = useState("");
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (trackingCode.trim() === "") return;

    try {
      setLoading(true);
      const res = await api.get(`/order/code/${trackingCode}`);
      setOrderData(res.data);
      console.log(res.data)
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Erro ao buscar pedido");
      setOrderData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setTrackingCode("");
    setOrderData(null);
  };

  return (
    <main>
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
              {loading ? "Carregando..." : "Rastrear encomenda"}
            </button>
          </div>
        </div>
      </section>

      {orderData && (
        <section className="bg-white py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-16">
              ACOMPANHE SUA ENCOMENDA
            </h2>

            <div className="mb-8 border border-gray-200 rounded-lg p-6 shadow">
              <p>
                <b>Código do pedido:</b> {orderData.code}
              </p>
              <p>
                <b>Cliente:</b> {orderData.sender_client.name}
              </p>
              <p>
                <b>Destinatário:</b> {orderData.recipient.name}
              </p>
              <p>
                <b>Status:</b> {orderData.status.name}
              </p>
              <a
                href="#"
                className="inline-flex items-center text-blue-600 hover:underline font-medium mt-4"
              >
                <DocumentTextIcon className="h-5 w-5 mr-1" />
                Visualizar Nota Fiscal
              </a>
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
