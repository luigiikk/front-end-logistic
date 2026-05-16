import { useEffect, useState } from "react";
import { api } from "../../../api/lib/api";
import { GenericPanelLayout } from "../../../components/Layout/company/layoutOption";
import {
  LuSearch,
  LuTrash2,
  LuPencil,
  LuShoppingBag,
  LuX,
  LuHash,
  LuBoxes,
} from "react-icons/lu";
import { useToast } from "../../../components/Toast/ToastContent";

// ─── Types ────────────────────────────────────────────────────────────────────

type PurchaseOrderItem = {
  id: number;
  purchase_order_id: number;
  resource_id: number;
  quantity: number;
  unit_price: number;
  total_price: number;
  resource?: { name: string };
};

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

export default function PurchaseOrderItemManager() {
  const { toast } = useToast();
  const [items, setItems] = useState<PurchaseOrderItem[]>([]);
  const [filtered, setFiltered] = useState<PurchaseOrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editing, setEditing] = useState<PurchaseOrderItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string } | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/purchase-order-items");
      const data = Array.isArray(res.data) ? res.data : res.data.data ?? [];
      setItems(data);
      setFiltered(data);
    } catch (err) {
      toast(`${err}`, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const lower = value.toLowerCase();
    setFiltered(
      items.filter(
        (i) =>
          (i.resource?.name && i.resource.name.toLowerCase().includes(lower)) ||
          String(i.purchase_order_id).includes(value)
      )
    );
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/purchase-order-items/${deleteTarget.id}`);
      setItems((prev) => prev.filter((i) => i.id !== deleteTarget.id));
      setFiltered((prev) => prev.filter((i) => i.id !== deleteTarget.id));
    } catch(err) {
      toast(`${err}`, "error");
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleSaveEdit = async () => {
    if (!editing) return;
    try {
      setSaving(true);
      await api.put(`/purchase-order-items/${editing.id}`, {
        quantity: Number(editing.quantity),
        unit_price: Number(editing.unit_price),
      });
      setEditing(null);
      loadData();
    } catch (err) {
      toast(`${err}`, "error");
    } finally {
      setSaving(false);
    }
  };

  // Totais
  const totalGeral = filtered.reduce(
    (acc, i) => acc + Number(i.unit_price) * Number(i.quantity),
    0
  );

  return (
    <GenericPanelLayout panel="item_compra">
      <div className="w-full max-w-5xl mx-auto space-y-6">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#384A6C] tracking-tight flex items-center gap-2">
              <LuShoppingBag size={22} /> Itens de Compra
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {filtered.length} item{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm">
            <LuSearch size={15} className="text-gray-400 shrink-0" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Buscar por recurso ou ID do pedido..."
              className="outline-none text-sm text-gray-700 placeholder-gray-300 w-56"
            />
          </div>
        </div>

        {/* ── Tabela ── */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <svg className="animate-spin h-6 w-6 text-[#94C0E0]" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <p className="text-sm text-gray-400">Carregando itens...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-2 text-gray-400">
              <LuBoxes size={32} className="opacity-30" />
              <p className="text-sm font-medium">Nenhum item encontrado.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-100 bg-[#EEF5FB]">
                      {["Produto / Recurso", "Pedido", "Qtd", "Preço Unit.", "Total", ""].map(
                        (h) => (
                          <th
                            key={h}
                            className="py-3 px-6 text-[10px] font-bold text-[#384A6C] uppercase tracking-widest whitespace-nowrap last:text-right"
                          >
                            {h}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filtered.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-[#EEF5FB]/60 transition-colors"
                      >
                        {/* Recurso */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#384A6C]/10 flex items-center justify-center text-[#384A6C] shrink-0">
                              <LuShoppingBag size={14} />
                            </div>
                            <span className="font-semibold text-sm text-gray-800">
                              {item.resource?.name ?? `Recurso #${item.resource_id}`}
                            </span>
                          </div>
                        </td>

                        {/* Pedido */}
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#384A6C] bg-[#384A6C]/10 px-2.5 py-1 rounded-full">
                            <LuHash size={10} />
                            {item.purchase_order_id}
                          </span>
                        </td>

                        {/* Qtd */}
                        <td className="py-4 px-6">
                          <span className="text-sm font-bold text-gray-700">{item.quantity}</span>
                        </td>

                        {/* Preço unit */}
                        <td className="py-4 px-6">
                          <span className="text-sm text-gray-600">
                            R$ {Number(item.unit_price).toFixed(2)}
                          </span>
                        </td>

                        {/* Total */}
                        <td className="py-4 px-6">
                          <span className="text-sm font-bold text-[#384A6C]">
                            R$ {(Number(item.unit_price) * Number(item.quantity)).toFixed(2)}
                          </span>
                        </td>

                        {/* Ações */}
                        <td className="py-4 px-6">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => setEditing(item)}
                              className="p-2 rounded-xl text-[#384A6C] hover:bg-[#384A6C]/10 transition"
                              title="Editar"
                            >
                              <LuPencil size={15} />
                            </button>
                            <button
                              onClick={() =>
                                setDeleteTarget({
                                  id: item.id,
                                  name: item.resource?.name ?? `Recurso #${item.resource_id}`,
                                })
                              }
                              className="p-2 rounded-xl text-red-400 hover:bg-red-50 transition"
                              title="Excluir"
                            >
                              <LuTrash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Rodapé com total geral */}
              <div className="flex justify-end items-center gap-2 px-6 py-4 border-t border-gray-100 bg-[#EEF5FB]/50">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Total geral:
                </span>
                <span className="text-base font-extrabold text-[#384A6C]">
                  R$ {totalGeral.toFixed(2)}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Modal Edição ── */}
      {editing && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl">
            <div className="flex items-center justify-between px-8 pt-7 pb-4 border-b border-gray-100">
              <h2 className="text-xl font-extrabold text-[#384A6C] tracking-tight">Editar Item</h2>
              <button
                onClick={() => setEditing(null)}
                className="text-gray-400 hover:text-gray-600 transition p-1 rounded-lg hover:bg-gray-100"
              >
                <LuX size={20} />
              </button>
            </div>

            <div className="px-8 py-6 space-y-4">
              {/* Produto (read-only) */}
              <div className="flex items-center gap-3 bg-[#EEF5FB] border border-[#94C0E0]/30 rounded-xl px-4 py-3">
                <div className="w-8 h-8 rounded-full bg-[#384A6C]/10 flex items-center justify-center text-[#384A6C] shrink-0">
                  <LuShoppingBag size={14} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Produto</p>
                  <p className="text-sm font-semibold text-gray-800">
                    {editing.resource?.name ?? `Recurso #${editing.resource_id}`}
                  </p>
                </div>
              </div>

              <Field
                label="Quantidade"
                type="number"
                min={1}
                value={editing.quantity}
                onChange={(e) => setEditing({ ...editing, quantity: Number(e.target.value) })}
              />
              <Field
                label="Preço unitário (R$)"
                type="number"
                step="0.01"
                min={0}
                value={editing.unit_price}
                onChange={(e) => setEditing({ ...editing, unit_price: Number(e.target.value) })}
              />

              {/* Preview do total */}
              <div className="flex items-center justify-between bg-[#EEF5FB] border border-[#94C0E0]/30 rounded-xl px-4 py-3">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total calculado</span>
                <span className="text-base font-extrabold text-[#384A6C]">
                  R$ {(Number(editing.quantity) * Number(editing.unit_price)).toFixed(2)}
                </span>
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
                onClick={handleSaveEdit}
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
              <h3 className="text-lg font-extrabold text-gray-800">Excluir item?</h3>
              <p className="text-sm text-gray-400 mt-1">
                <span className="font-semibold text-gray-600">{deleteTarget.name}</span> será
                removido e afetará o valor total do pedido.
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