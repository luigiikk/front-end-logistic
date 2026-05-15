import { useEffect, useState } from "react";
import { api } from "../../../api/lib/api";
import { GenericPanelLayout } from "../../../components/Layout/company/layoutOption";
import {
  LuTrash2, LuPlus, LuPencil, LuX, LuShoppingCart, LuHash, LuPackage, LuWarehouse, LuBoxes,
} from "react-icons/lu";

// ─── Types ────────────────────────────────────────────────────────────────────

type PurchaseOrderSummary = {
  id: number; total_value: number;
  supplier?: { name: string }; status?: { name: string; id: number };
  status_id: number; created_at: string; items?: any[];
};

type ResourceOption = { id: number; name: string; width?: number | null; height?: number | null; length?: number | null };
type SelectOption = { id: number; name: string };

type FormItem = {
  resource_id: number | "";
  warehouse_id: number | "";
  quantity: number;
  unit_price: number;
};

type OrderForm = {
  supplier_id: number | "";
  status_id: number | "";
  items: FormItem[];
};

const initialFormState: OrderForm = {
  supplier_id: "", status_id: "",
  items: [{ resource_id: "", warehouse_id: "", quantity: 1, unit_price: 0 }],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getStatusStyle(name: string) {
  const lower = name.toLowerCase();
  if (lower.includes("pendente")) return "bg-yellow-50 text-yellow-700 border-yellow-200";
  if (lower.includes("aprovado") || lower.includes("concluído")) return "bg-green-50 text-green-700 border-green-200";
  if (lower.includes("cancelado")) return "bg-red-50 text-red-700 border-red-200";
  return "bg-blue-50 text-blue-700 border-blue-200";
}

function calcItemVolume(resource: ResourceOption | undefined, quantity: number): number | null {
  if (!resource?.width || !resource?.height || !resource?.length) return null;
  return resource.width * resource.height * resource.length * quantity;
}

// ─── Field / Select ───────────────────────────────────────────────────────────

function Field({ label, className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string; className?: string }) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label className="text-[10px] font-bold text-[#384A6C] uppercase tracking-widest">{label}</label>
      <input {...props} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#94C0E0] focus:border-transparent transition-all" />
    </div>
  );
}

function SelectField({ label, className = "", children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { label: string; className?: string }) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label className="text-[10px] font-bold text-[#384A6C] uppercase tracking-widest">{label}</label>
      <select {...props} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-800 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#94C0E0] focus:border-transparent transition-all">
        {children}
      </select>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function PurchaseOrderManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [orders, setOrders] = useState<PurchaseOrderSummary[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: number } | null>(null);

  const [suppliers, setSuppliers] = useState<SelectOption[]>([]);
  const [resources, setResources] = useState<ResourceOption[]>([]);
  const [warehouses, setWarehouses] = useState<SelectOption[]>([]);
  const [statuses, setStatuses] = useState<SelectOption[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<OrderForm>(initialFormState);

  const extractData = (resData: any) => Array.isArray(resData) ? resData : resData.data ?? [];

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [supRes, resRes, warRes, statRes, ordersRes] = await Promise.all([
        api.get("/supplier"), api.get("/resource"), api.get("/warehouses"),
        api.get("/status/purchase_order"), api.get("/purchase-orders"),
      ]);
      setSuppliers(extractData(supRes.data));
      setResources(extractData(resRes.data)); // inclui width/height/length
      setWarehouses(extractData(warRes.data));
      setStatuses(extractData(statRes.data));
      setOrders(extractData(ordersRes.data));
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadInitialData(); }, []);

  // ── Form helpers ──

  const handleAddItem = () =>
    setFormData((prev) => ({ ...prev, items: [...prev.items, { resource_id: "", warehouse_id: "", quantity: 1, unit_price: 0 }] }));

  const handleRemoveItem = (index: number) => {
    if (formData.items.length === 1) return;
    setFormData((prev) => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }));
  };

  const updateItem = (index: number, field: keyof FormItem, value: any) =>
    setFormData((prev) => {
      const items = [...prev.items];
      (items[index] as any)[field] = value;
      return { ...prev, items };
    });

  const modalTotal = formData.items.reduce((acc, i) => acc + Number(i.quantity || 0) * Number(i.unit_price || 0), 0);

  // Volume total do pedido em tempo real
  const modalTotalVolume = formData.items.reduce((acc, item) => {
    const resource = resources.find((r) => r.id === Number(item.resource_id));
    const vol = calcItemVolume(resource, Number(item.quantity || 0));
    return acc + (vol ?? 0);
  }, 0);

  const hasAnyVolume = formData.items.some((item) => {
    const resource = resources.find((r) => r.id === Number(item.resource_id));
    return calcItemVolume(resource, 1) != null;
  });

  // ── CRUD ──

  const handleOpenCreate = () => { setEditingId(null); setFormData(initialFormState); setIsModalOpen(true); };

  const handleEdit = async (id: number) => {
    try {
      setLoading(true);
      const { data: order } = await api.get(`/purchase-orders/${id}`);
      setFormData({
        supplier_id: order.supplier_id, status_id: order.status_id,
        items: order.items.map((item: any) => ({
          resource_id: item.resource_id,
          warehouse_id: item.warehouse_id || item.warehouse?.id || "",
          quantity: item.quantity, unit_price: item.unit_price,
        })),
      });
      setEditingId(id);
      setIsModalOpen(true);
    } catch { alert("Não foi possível carregar os dados do pedido."); }
    finally { setLoading(false); }
  };

  const handleSave = async () => {
    if (!formData.supplier_id || !formData.status_id) return alert("Selecione um fornecedor e um status.");
    const invalid = formData.items.some((i) => !i.resource_id || !i.warehouse_id || Number(i.quantity) <= 0);
    if (invalid) return alert("Preencha recurso, armazém e quantidade > 0 em todos os itens.");
    try {
      setSaving(true);
      const payload = {
        supplier_id: Number(formData.supplier_id), status_id: Number(formData.status_id),
        purchase_orders_items: formData.items.map((item) => ({
          resource_id: Number(item.resource_id), warehouse_id: Number(item.warehouse_id),
          quantity: Number(item.quantity), unit_price: Number(item.unit_price),
        })),
      };
      if (editingId) { await api.put(`/purchase-orders/${editingId}`, payload); }
      else { await api.post("/purchase-orders", payload); }
      closeModal();
      loadInitialData();
    } catch (err: any) {
      alert(err.response?.data?.message || "Erro ao salvar pedido.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/purchase-orders/${deleteTarget.id}`);
      setOrders((prev) => prev.filter((o) => o.id !== deleteTarget.id));
    } catch { alert("Erro ao excluir pedido."); }
    finally { setDeleteTarget(null); }
  };

  const closeModal = () => { setIsModalOpen(false); setEditingId(null); setFormData(initialFormState); };

  return (
    <GenericPanelLayout panel="pedido_de_compra">
      <div className="w-full max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#384A6C] tracking-tight flex items-center gap-2">
              <LuShoppingCart size={22} /> Pedidos de Compra
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {orders.length} pedido{orders.length !== 1 ? "s" : ""} cadastrado{orders.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button onClick={handleOpenCreate} className="flex items-center gap-2 bg-[#384A6C] text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-[#2f3e5c] active:scale-95 transition-all shadow-sm">
            <LuPlus size={16} /> Novo pedido
          </button>
        </div>

        {/* Tabela */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {loading && orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <svg className="animate-spin h-6 w-6 text-[#94C0E0]" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <p className="text-sm text-gray-400">Carregando pedidos...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-2 text-gray-400">
              <LuShoppingCart size={32} className="opacity-30" />
              <p className="text-sm font-medium">Nenhum pedido de compra cadastrado.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100 bg-[#EEF5FB]">
                    {["Pedido", "Fornecedor", "Categorias", "Status", "Total", "Volume", ""].map((h) => (
                      <th key={h} className="py-3 px-6 text-[10px] font-bold text-[#384A6C] uppercase tracking-widest whitespace-nowrap last:text-right">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {orders.map((order) => {
                    const categoryNames = order.items?.map((i: any) => i.resource?.category?.name).filter(Boolean) ?? [];
                    const categoriesDisplay = Array.from(new Set(categoryNames)).join(", ") || "—";
                    const statusName = order.status?.name ?? String(order.status_id);
                    // volume total do pedido calculado a partir dos itens
                    const orderVolume = order.items?.reduce((acc: number, i: any) => {
                      const r = i.resource;
                      if (!r?.width || !r?.height || !r?.length) return acc;
                      return acc + r.width * r.height * r.length * (i.quantity ?? 1);
                    }, 0) ?? null;

                    return (
                      <tr key={order.id} className="hover:bg-[#EEF5FB]/60 transition-colors">
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center gap-1 text-sm font-bold text-[#384A6C]">
                            <LuHash size={12} className="opacity-60" />{order.id}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-700 font-medium">{order.supplier?.name ?? "—"}</td>
                        <td className="py-4 px-6">
                          <span className="text-xs text-gray-500 bg-gray-100 border border-gray-200 px-2.5 py-1 rounded-full block w-fit max-w-[180px] truncate" title={categoriesDisplay}>{categoriesDisplay}</span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getStatusStyle(statusName)}`}>{statusName}</span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-sm font-extrabold text-[#384A6C]">R$ {Number(order.total_value).toFixed(2)}</span>
                        </td>
                        {/* Volume total do pedido */}
                        <td className="py-4 px-6">
                          {orderVolume != null && orderVolume > 0 ? (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#384A6C] bg-[#384A6C]/10 px-2.5 py-1 rounded-full">
                              <LuBoxes size={10} />{orderVolume.toFixed(2)} m³
                            </span>
                          ) : <span className="text-xs text-gray-300">—</span>}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => handleEdit(order.id)} className="p-2 rounded-xl text-[#384A6C] hover:bg-[#384A6C]/10 transition" title="Editar"><LuPencil size={15} /></button>
                            <button onClick={() => setDeleteTarget({ id: order.id })} className="p-2 rounded-xl text-red-400 hover:bg-red-50 transition" title="Excluir"><LuTrash2 size={15} /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal Criação/Edição */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between px-8 pt-7 pb-4 border-b border-gray-100">
              <h2 className="text-xl font-extrabold text-[#384A6C] tracking-tight flex items-center gap-2">
                <LuShoppingCart size={20} />{editingId ? `Editar Pedido #${editingId}` : "Novo Pedido de Compra"}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition p-1 rounded-lg hover:bg-gray-100"><LuX size={20} /></button>
            </div>

            <div className="px-8 py-6 overflow-y-auto space-y-6">
              {/* Fornecedor + Status */}
              <div className="grid grid-cols-2 gap-4">
                <SelectField label="Fornecedor *" value={formData.supplier_id} onChange={(e) => setFormData({ ...formData, supplier_id: e.target.value === "" ? "" : Number(e.target.value) })}>
                  <option value="">Selecione...</option>
                  {suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </SelectField>
                <SelectField label="Status *" value={formData.status_id} onChange={(e) => setFormData({ ...formData, status_id: e.target.value === "" ? "" : Number(e.target.value) })}>
                  <option value="">Selecione...</option>
                  {statuses.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </SelectField>
              </div>

              {/* Itens */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#384A6C]/10 flex items-center justify-center text-[#384A6C]">
                      <LuPackage size={14} />
                    </div>
                    <p className="text-xs font-bold text-[#384A6C] uppercase tracking-widest">Itens do pedido</p>
                  </div>
                  {/* Totais no rodapé do header */}
                  <div className="flex items-center gap-3">
                    {hasAnyVolume && (
                      <span className="text-sm font-bold text-gray-500 bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-full flex items-center gap-1">
                        <LuBoxes size={13} /> {modalTotalVolume.toFixed(2)} m³
                      </span>
                    )}
                    <span className="text-sm font-extrabold text-[#384A6C] bg-[#EEF5FB] border border-[#94C0E0]/30 px-4 py-1.5 rounded-full">
                      Total: R$ {modalTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  {formData.items.map((item, index) => {
                    const selectedResource = resources.find((r) => r.id === Number(item.resource_id));
                    const itemVolume = calcItemVolume(selectedResource, Number(item.quantity || 0));

                    return (
                      <div key={index} className="bg-[#EEF5FB] border border-[#94C0E0]/30 rounded-2xl p-4 relative group">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                          <SelectField label="Recurso / Produto *" className="md:col-span-4" value={item.resource_id} onChange={(e) => updateItem(index, "resource_id", e.target.value === "" ? "" : Number(e.target.value))}>
                            <option value="">Selecione...</option>
                            {resources.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                          </SelectField>

                          <SelectField label="Armazém destino *" className="md:col-span-4" value={item.warehouse_id} onChange={(e) => updateItem(index, "warehouse_id", e.target.value === "" ? "" : Number(e.target.value))}>
                            <option value="">Selecione...</option>
                            {warehouses.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
                          </SelectField>

                          <Field label="Qtd *" className="md:col-span-2" type="number" min={1} value={item.quantity} onChange={(e) => updateItem(index, "quantity", e.target.value)} />
                          <Field label="Preço unit. (R$)" className="md:col-span-2" type="number" min={0} step="0.01" value={item.unit_price} onChange={(e) => updateItem(index, "unit_price", e.target.value)} />
                        </div>

                        {/* Preview volume do item */}
                        {itemVolume != null && (
                          <div className="mt-2 flex items-center gap-2">
                            <LuWarehouse size={11} className="text-gray-400" />
                            <span className="text-[11px] text-gray-400">
                              Volume ocupado:{" "}
                              <span className="font-bold text-[#384A6C]">{itemVolume.toFixed(2)} m³</span>
                              {selectedResource && (
                                <span className="ml-1 text-gray-300">
                                  ({selectedResource.width}×{selectedResource.height}×{selectedResource.length} m × {item.quantity} un)
                                </span>
                              )}
                            </span>
                          </div>
                        )}

                        {formData.items.length > 1 && (
                          <button onClick={() => handleRemoveItem(index)} className="absolute -top-2 -right-2 bg-red-100 text-red-500 rounded-full p-1.5 hover:bg-red-200 shadow-sm opacity-0 group-hover:opacity-100 transition" title="Remover item">
                            <LuX size={13} />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                <button onClick={handleAddItem} className="mt-3 flex items-center gap-1.5 text-sm text-[#384A6C] font-bold hover:underline underline-offset-4">
                  <LuPlus size={15} /> Adicionar item
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-3 px-8 py-5 border-t border-gray-100">
              <button onClick={closeModal} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition">Cancelar</button>
              <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-[#384A6C] hover:bg-[#2f3e5c] active:scale-95 transition-all disabled:opacity-60 flex items-center gap-2">
                {saving ? (
                  <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>Salvando...</>
                ) : editingId ? "Atualizar pedido" : "Confirmar pedido"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Exclusão */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 flex flex-col items-center text-center gap-4">
            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center"><LuTrash2 size={24} className="text-red-400" /></div>
            <div>
              <h3 className="text-lg font-extrabold text-gray-800">Excluir pedido?</h3>
              <p className="text-sm text-gray-400 mt-1">O pedido <span className="font-semibold text-gray-600">#{deleteTarget.id}</span> será removido e o estoque será revertido.</p>
            </div>
            <div className="flex gap-3 w-full mt-2">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition">Cancelar</button>
              <button onClick={handleDelete} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 active:scale-95 transition-all">Excluir</button>
            </div>
          </div>
        </div>
      )}
    </GenericPanelLayout>
  );
}