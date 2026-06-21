import { useEffect, useState } from "react";
import axios from "axios";

import {
  LuX,
  LuMapPin,
  LuClock,
  LuPackage,
  LuPlus,
  LuCircleCheck,
  LuCircle,
  LuLoader,
  LuHash,
  LuTruck,
} from "react-icons/lu";
import { api } from "../../api/lib/api";
import { useToast } from "../Toast/ToastContent";

// ─── Types ────────────────────────────────────────────────────────────────────

type TrackingStatus = {
  id: number;
  name: string;
};

type TrackingEvent = {
  id: number;
  location: string | null;
  description: string | null;
  estimated_delivery: string | null;
  occurred_at: string;
  status: TrackingStatus | null;
};

type OrderTracking = {
  order: {
    id: number;
    code: string;
    status: string;
  };
  tracking: TrackingEvent[];
};

type NewTrackingForm = {
  status_id: number | "";
  location: string;
  description: string;
  occurred_at: string;
  estimated_delivery: string;
};

// Status são carregados da API em runtime via /status/order

const INITIAL_FORM: NewTrackingForm = {
  status_id: "",
  location: "",
  description: "",
  occurred_at: "",
  estimated_delivery: "",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function StatusBadge({ status }: { status: string }) {
  const lower = status?.toLowerCase() ?? "";
  const isDelivered = lower.includes("entregue");
  const isTransit = lower.includes("trânsito") || lower.includes("transito") || lower.includes("saiu");
  const isProcess = lower.includes("processo");
  const isPending = lower.includes("pendente");
  const isCancelled = lower.includes("cancelado") || lower.includes("cancelada");

  const cls = isDelivered
    ? "bg-green-50 text-green-700 border-green-200"
    : isTransit
    ? "bg-blue-50 text-blue-700 border-blue-200"
    : isProcess
    ? "bg-purple-50 text-purple-700 border-purple-200"
    : isPending
    ? "bg-amber-50 text-amber-700 border-amber-200"
    : isCancelled
    ? "bg-red-50 text-red-700 border-red-200"
    : "bg-gray-100 text-gray-600 border-gray-200";

  return (
    <span
      className={`inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full border ${cls}`}
    >
      {status}
    </span>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Field({
  label,
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label className="text-[10px] font-bold text-[#384A6C] uppercase tracking-widest">
        {label}
      </label>
      <input
        {...props}
        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-300 bg-white
          focus:outline-none focus:ring-2 focus:ring-[#94C0E0] focus:border-transparent transition-all"
      />
    </div>
  );
}

function SelectField({
  label,
  className = "",
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label className="text-[10px] font-bold text-[#384A6C] uppercase tracking-widest">
        {label}
      </label>
      <select
        {...props}
        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-800 bg-white appearance-none
          focus:outline-none focus:ring-2 focus:ring-[#94C0E0] focus:border-transparent transition-all"
      >
        {children}
      </select>
    </div>
  );
}

function TextareaField({
  label,
  className = "",
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label className="text-[10px] font-bold text-[#384A6C] uppercase tracking-widest">
        {label}
      </label>
      <textarea
        {...props}
        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-300 bg-white resize-none
          focus:outline-none focus:ring-2 focus:ring-[#94C0E0] focus:border-transparent transition-all"
      />
    </div>
  );
}

// ─── Timeline ─────────────────────────────────────────────────────────────────

function TrackingTimeline({ events }: { events: TrackingEvent[] }) {
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
        <LuPackage size={32} className="opacity-30" />
        <p className="text-sm font-medium">Nenhum evento de rastreio ainda.</p>
      </div>
    );
  }

  return (
    <ol className="relative flex flex-col gap-0">
      {events.map((event, index) => {
        const isFirst = index === 0;
        const isLast = index === events.length - 1;

        return (
          <li key={event.id} className="flex gap-4">
            {/* Coluna da linha + ícone */}
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10
                  ${isFirst
                    ? "bg-[#384A6C] text-white"
                    : "bg-[#EEF5FB] text-[#384A6C] border border-[#94C0E0]"
                  }`}
              >
                {isFirst ? (
                  <LuTruck size={14} />
                ) : (
                  <LuCircleCheck size={14} />
                )}
              </div>
              {!isLast && (
                <div className="w-0.5 flex-1 bg-[#94C0E0]/40 my-1" />
              )}
            </div>

            {/* Conteúdo do evento */}
            <div className={`pb-6 flex-1 ${isLast ? "pb-0" : ""}`}>
              <div className="flex items-center gap-2 flex-wrap">
                {event.status && (
                  <p
                    className={`text-sm font-bold ${
                      isFirst ? "text-[#384A6C]" : "text-gray-700"
                    }`}
                  >
                    {event.status.name}
                  </p>
                )}
              </div>

              {event.description && (
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  {event.description}
                </p>
              )}

              <div className="flex items-center gap-4 mt-2 flex-wrap">
                {event.location && (
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <LuMapPin size={11} />
                    {event.location}
                  </span>
                )}
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <LuClock size={11} />
                  {formatDate(event.occurred_at)}
                </span>
                {event.estimated_delivery && (
                  <span className="flex items-center gap-1 text-xs text-amber-500 font-semibold">
                    <LuClock size={11} />
                    Previsão: {formatDate(event.estimated_delivery)}
                  </span>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

// ─── Props do Modal ───────────────────────────────────────────────────────────

type Props = {
  orderId: number;
  orderCode: string;
  orderStatus: string;
  orderRecipient: string;
  onClose: () => void;
  onTrackingUpdated?: () => void;
};

// ─── Modal principal ──────────────────────────────────────────────────────────

export default function OrderTrackingModal({
  orderId,
  orderCode,
  orderStatus,
  orderRecipient,
  onClose,
  onTrackingUpdated,
}: Props) {
  const { toast } = useToast();

  const [tab, setTab] = useState<"history" | "new">("history");
  const [tracking, setTracking] = useState<OrderTracking | null>(null);
  const [statuses, setStatuses] = useState<TrackingStatus[]>([]);
  const [loadingTracking, setLoadingTracking] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<NewTrackingForm>(INITIAL_FORM);

  // Rota única e normalização da resposta — usada na carga inicial e após criar evento
  async function fetchTracking() {
    const res = await api.get(`tracking/order/${orderId}`);
    const data = res.data;
    // Suporta { order, tracking: [] } e array direto
    if (data && Array.isArray(data.tracking)) {
      setTracking(data);
    } else if (Array.isArray(data)) {
      setTracking({
        order: { id: orderId, code: orderCode, status: orderStatus },
        tracking: data,
      });
    } else {
      setTracking({
        order: { id: orderId, code: orderCode, status: orderStatus },
        tracking: [],
      });
    }
  }

  // Carrega histórico + status disponíveis ao abrir
  useEffect(() => {
    async function load() {
      try {
        await Promise.all([
          fetchTracking(),
          api.get(`/status/order`).then((res) =>
            setStatuses(Array.isArray(res.data) ? res.data : [])
          ),
        ]);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          toast(
            err.response?.data?.message || "Erro ao carregar rastreio.",
            "error"
          );
        }
        onClose();
      } finally {
        setLoadingTracking(false);
      }
    }
    load();
  }, [orderId]);

  // Fecha com ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Converte "2024-01-15T10:30" (datetime-local) para ISO 8601 completo
  function toISO(value: string): string | null {
    if (!value) return null;
    // datetime-local não tem segundos nem Z — adiciona :00.000Z manualmente
    const normalized = value.length === 16 ? `${value}:00.000Z` : value;
    const date = new Date(normalized);
    return isNaN(date.getTime()) ? null : date.toISOString();
  }

  const handleCreate = async () => {
    if (!form.status_id) {
      toast("Selecione o tipo do evento.", "info");
      return;
    }

    try {
      setSaving(true);
      await api.post(`tracking/order/${orderId}`, {
        status_id: Number(form.status_id),
        location: form.location || null,
        description: form.description || null,
        occurred_at: toISO(form.occurred_at) ?? new Date().toISOString(),
        estimated_delivery: toISO(form.estimated_delivery),
      });

      toast("Evento registrado com sucesso!", "success");

      await fetchTracking();
      if (onTrackingUpdated) {
        onTrackingUpdated();
      }
      setTab("history");
      setForm(INITIAL_FORM);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast(
          err.response?.data?.message || "Erro ao salvar evento.",
          "error"
        );
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">

        {/* ── Header ── */}
        <div className="flex items-start justify-between px-8 pt-7 pb-4 border-b border-gray-100 gap-4">
          <div className="flex flex-col gap-1.5">
            <h2 className="text-xl font-extrabold text-[#384A6C] tracking-tight flex items-center gap-2">
              <LuHash size={16} className="text-gray-400" />
              {orderCode || `Pedido #${orderId}`}
            </h2>
            <div className="flex items-center gap-2 flex-wrap">
              <StatusBadge status={tracking?.order?.status ?? orderStatus} />
              <span className="text-xs text-gray-400">
                Destinatário: {orderRecipient}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition p-1.5 rounded-xl hover:bg-gray-100 shrink-0"
            aria-label="Fechar"
          >
            <LuX size={20} />
          </button>
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-1 px-8 pt-4 border-b border-gray-100">
          <button
            onClick={() => setTab("history")}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-t-xl border-b-2 transition-all
              ${tab === "history"
                ? "border-[#384A6C] text-[#384A6C]"
                : "border-transparent text-gray-400 hover:text-[#384A6C]"
              }`}
          >
            <LuCircle size={12} />
            Histórico
          </button>
          <button
            onClick={() => setTab("new")}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-t-xl border-b-2 transition-all
              ${tab === "new"
                ? "border-[#384A6C] text-[#384A6C]"
                : "border-transparent text-gray-400 hover:text-[#384A6C]"
              }`}
          >
            <LuPlus size={12} />
            Novo evento
          </button>
        </div>

        {/* ── Body ── */}
        <div className="overflow-y-auto flex-1 px-8 py-6">

          {/* Tab: Histórico */}
          {tab === "history" && (
            <>
              {loadingTracking ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <LuLoader
                    size={22}
                    className="animate-spin text-[#94C0E0]"
                  />
                  <p className="text-sm text-gray-400">
                    Carregando histórico...
                  </p>
                </div>
              ) : (
                <TrackingTimeline events={tracking?.tracking ?? []} />
              )}
            </>
          )}

          {/* Tab: Novo evento */}
          {tab === "new" && (
            <div className="flex flex-col gap-4">
              <SelectField
                label="Tipo do evento *"
                value={form.status_id}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    status_id: e.target.value ? Number(e.target.value) : "",
                  }))
                }
              >
                <option value="">Selecione o status...</option>
                {statuses.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </SelectField>

              <Field
                label="Localização"
                placeholder="Ex: Salvador, BA"
                value={form.location}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, location: e.target.value }))
                }
              />

              <TextareaField
                label="Descrição"
                placeholder="Descreva o que aconteceu com o pedido..."
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, description: e.target.value }))
                }
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field
                  label="Data / hora do evento"
                  type="datetime-local"
                  value={form.occurred_at}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      occurred_at: e.target.value,
                    }))
                  }
                />
                <Field
                  label="Previsão de entrega"
                  type="datetime-local"
                  value={form.estimated_delivery}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      estimated_delivery: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="flex justify-end gap-3 px-8 py-5 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition"
          >
            Fechar
          </button>

          {tab === "new" && (
            <button
              onClick={handleCreate}
              disabled={saving}
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-[#384A6C] hover:bg-[#2f3e5c] active:scale-95 transition-all disabled:opacity-60 flex items-center gap-2"
            >
              {saving ? (
                <>
                  <LuLoader size={14} className="animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <LuPlus size={14} />
                  Salvar evento
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}