"use client";

import { useState } from "react";
import { api } from "../../../api/lib/api";
import { MapPinIcon, DocumentTextIcon, MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon, ClockIcon, TruckIcon } from "@heroicons/react/24/solid";

type TrackingEvent = {
  id: number;
  location: string | null;
  description: string | null;
  estimated_delivery: string | null;
  occurred_at: string;
};

type OrderData = {
  order: {
    id: number;
    code: string | null;
    status: {
      id: number;
      name: string;
    };
  };
  tracking: TrackingEvent[];
};

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatTime(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function RastreioPage() {
  const [code, setCode] = useState("");
  const [cpf, setCpf] = useState("");
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    const trimmedCode = code.trim();
    const trimmedCpf = cpf.trim().replace(/\D/g, "");

    if (trimmedCode.length < 3) {
      setError("Informe um código de rastreio válido (mínimo 3 caracteres).");
      return;
    }
    if (trimmedCpf.length < 11) {
      setError("Informe um CPF válido (11 dígitos).");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/tracking", {
        params: { code: trimmedCode, cpf: trimmedCpf },
      });
      setOrderData(res.data);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Pedido não encontrado. Verifique os dados informados.");
      setOrderData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleClear = () => {
    setCode("");
    setCpf("");
    setOrderData(null);
    setError(null);
  };

  const formatCpf = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    return digits
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  };

  return (
    <main className="font-sans antialiased">
      {/* Hero Section */}
      <section className="relative bg-[#002347] text-white py-24 px-4 overflow-hidden">
        {/* Background decorativo */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 80% 50%, rgba(59,130,246,0.13) 0%, transparent 70%), radial-gradient(ellipse 40% 40% at 10% 80%, rgba(0,80,160,0.18) 0%, transparent 70%)",
          }}
        />

        <div className="relative container mx-auto max-w-6xl grid md:grid-cols-2 gap-14 items-center">
          {/* Texto */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 rounded-full px-4 py-1.5 text-blue-300 text-sm font-medium">
              <TruckIcon className="h-4 w-4" />
              Rastreamento em tempo real
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
              RASTREIE SUA <span className="text-blue-400">ENCOMENDA!</span>
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed">
              Na <span className="text-white font-semibold">LogiFast</span>, você acompanha cada etapa
              da sua entrega de forma rápida, simples e transparente.
            </p>
            <p className="text-gray-400">
              Insira o código de rastreamento e o CPF do destinatário para ver todas as atualizações
              da sua carga em segundos.
            </p>
          </div>

          {/* Card de busca */}
          <div className="bg-white text-gray-800 p-8 rounded-2xl shadow-2xl">
            <h2 className="text-2xl font-bold text-[#002347] mb-1">Onde está seu pedido?</h2>
            <p className="text-gray-500 text-sm mb-6">Preencha os dois campos para rastrear.</p>

            <div className="space-y-4">
              <div>
                <label htmlFor="trackingCode" className="block text-sm font-semibold text-gray-600 mb-1.5">
                  Código de rastreio
                </label>
                <input
                  type="text"
                  id="trackingCode"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Ex: LF2024001234"
                />
              </div>

              <div>
                <label htmlFor="cpf" className="block text-sm font-semibold text-gray-600 mb-1.5">
                  CPF do destinatário
                </label>
                <input
                  type="text"
                  id="cpf"
                  value={cpf}
                  onChange={(e) => setCpf(formatCpf(e.target.value))}
                  onKeyDown={handleKeyDown}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="000.000.000-00"
                  maxLength={14}
                />
              </div>

              {error && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm">
                  <XMarkIcon className="h-4 w-4 mt-0.5 shrink-0" />
                  {error}
                </div>
              )}

              <button
                onClick={handleSearch}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Buscando...
                  </>
                ) : (
                  <>
                    <MagnifyingGlassIcon className="h-5 w-5" />
                    Rastrear encomenda
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Resultado */}
      {orderData && (
        <section className="bg-gray-50 py-20 px-4">
          <div className="container mx-auto max-w-3xl">
            <h2 className="text-3xl font-extrabold text-center text-[#002347] mb-2">
              Acompanhe sua encomenda
            </h2>
            <p className="text-center text-gray-500 mb-10">
              Histórico de movimentações atualizado
            </p>

            {/* Card resumo do pedido */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-8">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Código do pedido</p>
                  <p className="text-xl font-bold text-[#002347]">{orderData.order.code ?? "—"}</p>
                </div>
                <span
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold"
                  style={{
                    background:
                      orderData.order.status.name.toLowerCase().includes("entregue")
                        ? "#dcfce7"
                        : "#dbeafe",
                    color: orderData.order.status.name.toLowerCase().includes("entregue")
                      ? "#166534"
                      : "#1e40af",
                  }}
                >
                  {orderData.order.status.name.toLowerCase().includes("entregue") ? (
                    <CheckCircleIcon className="h-4 w-4" />
                  ) : (
                    <ClockIcon className="h-4 w-4" />
                  )}
                  {orderData.order.status.name}
                </span>
              </div>
            </div>

            {/* Timeline de rastreamento */}
            {orderData.tracking.length > 0 ? (
              <div className="relative">
                {/* Linha vertical */}
                <div className="absolute left-5 top-2 bottom-2 w-0.5 bg-blue-100 rounded-full" />

                <ul className="space-y-0">
                  {orderData.tracking.map((event, idx) => {
                    const isFirst = idx === 0;
                    return (
                      <li key={event.id} className="relative pl-14 pb-8 last:pb-0">
                        {/* Bolinha */}
                        <div
                          className={`absolute left-0 top-1 w-10 h-10 rounded-full flex items-center justify-center shadow-sm border-2 ${
                            isFirst
                              ? "bg-blue-600 border-blue-600 text-white"
                              : "bg-white border-blue-200 text-blue-400"
                          }`}
                        >
                          {isFirst ? (
                            <TruckIcon className="h-5 w-5" />
                          ) : (
                            <MapPinIcon className="h-5 w-5" />
                          )}
                        </div>

                        {/* Conteúdo */}
                        <div
                          className={`bg-white border rounded-2xl p-5 shadow-sm ${
                            isFirst ? "border-blue-300 ring-1 ring-blue-200" : "border-gray-100"
                          }`}
                        >
                          <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                            <span className="text-sm font-semibold text-gray-500">
                              {formatDate(event.occurred_at)} · {formatTime(event.occurred_at)}
                            </span>
                            {event.location && (
                              <span className="inline-flex items-center gap-1 text-xs text-blue-600 bg-blue-50 border border-blue-100 rounded-full px-3 py-0.5 font-medium">
                                <MapPinIcon className="h-3.5 w-3.5" />
                                {event.location}
                              </span>
                            )}
                          </div>

                          <p className="text-gray-800 font-medium">
                            {event.description ?? "Movimentação registrada"}
                          </p>

                          {event.estimated_delivery && (
                            <p className="mt-2 text-sm text-gray-500 flex items-center gap-1">
                              <ClockIcon className="h-4 w-4 text-blue-400 shrink-0" />
                              Previsão de entrega:{" "}
                              <span className="font-semibold text-gray-700">
                                {formatDate(event.estimated_delivery)}
                              </span>
                            </p>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <ClockIcon className="h-10 w-10 mx-auto mb-3 opacity-40" />
                <p className="font-medium">Nenhuma movimentação registrada ainda.</p>
                <p className="text-sm mt-1">Tente novamente mais tarde.</p>
              </div>
            )}

            <div className="text-center mt-12">
              <button
                onClick={handleClear}
                className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:underline underline-offset-4 transition"
              >
                <MagnifyingGlassIcon className="h-4 w-4" />
                Buscar outra encomenda
              </button>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}