import { useEffect, useState } from "react";
import { api } from "../../../api/lib/api";
import { GenericPanelLayout } from "../../../components/Layout/company/layoutOption";
import {
  LuSearch,
  LuTrash2,
  LuPencil,
  LuFileText,
  LuLink,
  LuX,
  LuCalendar,
  LuHash,
  LuInfo,
} from "react-icons/lu";
import { useToast } from "../../../components/Toast/ToastContent";

// ─── Types ────────────────────────────────────────────────────────────────────

type PurchaseOrder = {
  id: number;
  total_value: number;
  status_id: number;
};

type Invoice = {
  id: number;
  invoice_number: number | null;
  purchase_order_id: number;
  company_id: number;
  issue_date: string;
  due_date: string | null;
  link_file: string | null;
  purchase_order: PurchaseOrder;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_MAP: Record<number, { label: string; cls: string }> = {
  1: { label: "Pendente", cls: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  2: { label: "Pago",     cls: "bg-green-50 text-green-700 border-green-200" },
  3: { label: "Atrasado", cls: "bg-red-50 text-red-700 border-red-200" },
  4: { label: "Cancelado",cls: "bg-gray-100 text-gray-500 border-gray-200" },
};

function getStatus(id: number) {
  return STATUS_MAP[id] ?? { label: "Desconhecido", cls: "bg-gray-100 text-gray-500 border-gray-200" };
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("pt-BR");
}

function formatDateForInput(dateStr: string | null) {
  if (!dateStr) return "";
  return new Date(dateStr).toISOString().split("T")[0];
}

// ─── Field ────────────────────────────────────────────────────────────────────

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

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function InvoiceManager() {
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filtered, setFiltered] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editing, setEditing] = useState<Invoice | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: number } | null>(null);

  const [editForm, setEditForm] = useState({
    invoice_number: "",
    issue_date: "",
    due_date: "",
    link_file: "",
  });

  useEffect(() => {
    api
      .get("/invoice")
      .then((r) => {
        setInvoices(r.data);
        setFiltered(r.data);
      })
      .catch((err) => toast(err, "error"))
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const lower = value.toLowerCase();
    setFiltered(
      invoices.filter((inv) => {
        const statusLabel = getStatus(inv.purchase_order.status_id).label.toLowerCase();
        return (
          String(inv.id).includes(value) ||
          String(inv.invoice_number ?? "").includes(value) ||
          String(inv.purchase_order_id).includes(value) ||
          statusLabel.includes(lower)
        );
      })
    );
  };

  const handleEdit = (invoice: Invoice) => {
    setEditing(invoice);
    setEditForm({
      invoice_number: invoice.invoice_number ? String(invoice.invoice_number) : "",
      issue_date: formatDateForInput(invoice.issue_date),
      due_date: formatDateForInput(invoice.due_date),
      link_file: invoice.link_file ?? "",
    });
  };

  const handleSave = async () => {
    if (!editing) return;
    try {
      setSaving(true);
      const payload = {
        invoice_number: editForm.invoice_number ? Number(editForm.invoice_number) : null,
        issue_date: new Date(editForm.issue_date),
        due_date: editForm.due_date ? new Date(editForm.due_date) : null,
        link_file: editForm.link_file || null,
      };
      await api.put(`/invoice/${editing.id}`, payload);
      const updated = invoices.map((inv) =>
        inv.id === editing.id
          ? {
              ...inv,
              invoice_number: payload.invoice_number,
              issue_date: payload.issue_date.toISOString(),
              due_date: payload.due_date?.toISOString() ?? null,
              link_file: payload.link_file,
            }
          : inv
      );
      setInvoices(updated);
      setFiltered(updated);
      setEditing(null);
    } catch (err) {
      toast(`${err}`, "error")
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/invoice/${deleteTarget.id}`);
      const next = invoices.filter((i) => i.id !== deleteTarget.id);
      setInvoices(next);
      setFiltered(next);
    } catch(err) {
      toast(`${err}`, "error")
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    // @ts-ignore
    <GenericPanelLayout panel="invoice">
      <div className="w-full max-w-5xl mx-auto space-y-6">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#384A6C] tracking-tight flex items-center gap-2">
              <LuFileText size={22} /> Faturas
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {filtered.length} fatura{filtered.length !== 1 ? "s" : ""} encontrada{filtered.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm">
            <LuSearch size={15} className="text-gray-400 shrink-0" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Buscar por ID, nota, pedido ou status..."
              className="outline-none text-sm text-gray-700 placeholder-gray-300 w-64"
            />
          </div>
        </div>

        {/* ── Lista ── */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <svg className="animate-spin h-6 w-6 text-[#94C0E0]" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <p className="text-sm text-gray-400">Carregando faturas...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-2 text-gray-400">
              <LuFileText size={32} className="opacity-30" />
              <p className="text-sm font-medium">Nenhuma fatura encontrada.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-50">
              {filtered.map((inv) => {
                const status = getStatus(inv.purchase_order.status_id);
                return (
                  <li
                    key={inv.id}
                    className="flex items-center justify-between px-6 py-4 hover:bg-[#EEF5FB]/60 transition-colors gap-4"
                  >
                    {/* Ícone + info */}
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-[#384A6C]/10 flex items-center justify-center text-[#384A6C] shrink-0 mt-0.5">
                        <LuFileText size={18} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-gray-800 text-sm">
                            Fatura #{inv.id}
                          </p>
                          {inv.invoice_number && (
                            <span className="text-xs text-gray-400 flex items-center gap-0.5">
                              <LuHash size={10} /> Nota {inv.invoice_number}
                            </span>
                          )}
                          <span className={`inline-flex text-xs font-semibold px-2.5 py-0.5 rounded-full border ${status.cls}`}>
                            {status.label}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-gray-400 mt-1 flex-wrap">
                          <span>
                            Pedido{" "}
                            <span className="font-semibold text-gray-600">
                              #{inv.purchase_order_id}
                            </span>
                          </span>
                          <span className="font-semibold text-[#384A6C]">
                            R$ {Number(inv.purchase_order.total_value).toFixed(2)}
                          </span>
                          <span className="flex items-center gap-1">
                            <LuCalendar size={10} />
                            Emissão: {formatDate(inv.issue_date)}
                          </span>
                          {inv.due_date && (
                            <span className="flex items-center gap-1 text-red-400">
                              <LuCalendar size={10} />
                              Venc: {formatDate(inv.due_date)}
                            </span>
                          )}
                        </div>

                        {inv.link_file && (
                          <a
                            href={inv.link_file}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-[#384A6C] font-semibold hover:underline underline-offset-4 mt-1.5"
                          >
                            <LuLink size={11} /> Ver arquivo
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Ações */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleEdit(inv)}
                        className="p-2 rounded-xl text-[#384A6C] hover:bg-[#384A6C]/10 transition"
                        title="Editar"
                      >
                        <LuPencil size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget({ id: inv.id })}
                        className="p-2 rounded-xl text-red-400 hover:bg-red-50 transition"
                        title="Excluir"
                      >
                        <LuTrash2 size={16} />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* ── Modal Edição ── */}
      {editing && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl">

            <div className="flex items-center justify-between px-8 pt-7 pb-4 border-b border-gray-100">
              <h2 className="text-xl font-extrabold text-[#384A6C] tracking-tight">
                Editar Fatura #{editing.id}
              </h2>
              <button
                onClick={() => setEditing(null)}
                className="text-gray-400 hover:text-gray-600 transition p-1 rounded-lg hover:bg-gray-100"
              >
                <LuX size={20} />
              </button>
            </div>

            <div className="px-8 py-6 space-y-4">
              <Field
                label="Número da nota fiscal"
                type="number"
                placeholder="Ex: 123456"
                value={editForm.invoice_number}
                onChange={(e) => setEditForm({ ...editForm, invoice_number: e.target.value })}
              />

              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="Data de emissão"
                  type="date"
                  value={editForm.issue_date}
                  onChange={(e) => setEditForm({ ...editForm, issue_date: e.target.value })}
                />
                <Field
                  label="Data de vencimento"
                  type="date"
                  value={editForm.due_date}
                  onChange={(e) => setEditForm({ ...editForm, due_date: e.target.value })}
                />
              </div>

              <Field
                label="Link do arquivo (PDF / Drive)"
                type="url"
                placeholder="https://..."
                value={editForm.link_file}
                onChange={(e) => setEditForm({ ...editForm, link_file: e.target.value })}
              />

              <div className="flex items-start gap-2 bg-[#EEF5FB] border border-[#94C0E0]/30 rounded-xl px-4 py-3 text-xs text-gray-500">
                <LuInfo size={14} className="text-[#384A6C] shrink-0 mt-0.5" />
                O <strong className="text-gray-700">valor</strong> e o{" "}
                <strong className="text-gray-700">status</strong> são gerenciados pelo Pedido de
                Compra #{editing.purchase_order_id}.
              </div>
            </div>

            <div className="flex justify-end gap-3 px-8 py-5 border-t border-gray-100">
              <button
                onClick={() => setEditing(null)}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-[#384A6C] hover:bg-[#2f3e5c] active:scale-95 transition-all disabled:opacity-60"
              >
                {saving ? "Salvando..." : "Salvar alterações"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal Exclusão ── */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 flex flex-col items-center text-center gap-4">
            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
              <LuTrash2 size={24} className="text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-gray-800">Excluir fatura?</h3>
              <p className="text-sm text-gray-400 mt-1">
                Fatura{" "}
                <span className="font-semibold text-gray-600">#{deleteTarget.id}</span>{" "}
                será removida permanentemente.
              </p>
            </div>
            <div className="flex gap-3 w-full mt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 active:scale-95 transition-all"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </GenericPanelLayout>
  );
}