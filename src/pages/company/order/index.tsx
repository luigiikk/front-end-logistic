import { useEffect, useState } from "react";
import { api } from "../../../api/lib/api";
import { GenericPanelLayout } from "../../../components/Layout/company/layoutOption";
import {
  LuSearch,
  LuTrash2,
  LuPlus,
  LuBox,
  LuUser,
  LuMapPin,
  LuX,
  LuTruck,
  LuHash,
  LuPackage,
} from "react-icons/lu";

// ─── Types ────────────────────────────────────────────────────────────────────

type Product = {
  name: string;
  description: string;
  quantity: number;
};

type Order = {
  id: number;
  code: string;
  vehicle_id: number;
  recipient: string;
  sender_client: string;
  status: string;
  products?: Product[];
  vehicle?: string;
};

type NewOrderForm = {
  vehicle_id: number | "";
  recipient: {
    name: string;
    cpf: string;
    email: string;
    address: {
      street: string;
      number: string;
      complement: string;
      city: string;
      state: string;
      country: string;
      zipcode: string;
    };
  };
  products: Product[];
};

const initialOrderState: NewOrderForm = {
  vehicle_id: "",
  recipient: {
    name: "",
    cpf: "",
    email: "",
    address: {
      street: "",
      number: "",
      complement: "",
      city: "",
      state: "",
      country: "Brasil",
      zipcode: "",
    },
  },
  products: [{ name: "", description: "", quantity: 1 }],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function maskCPF(v: string) {
  return v
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function maskZip(v: string) {
  return v
    .replace(/\D/g, "")
    .slice(0, 8)
    .replace(/(\d{5})(\d{1,3})$/, "$1-$2");
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

function SectionTitle({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="w-7 h-7 rounded-lg bg-[#384A6C]/10 flex items-center justify-center text-[#384A6C]">
        <Icon size={14} />
      </div>
      <p className="text-xs font-bold text-[#384A6C] uppercase tracking-widest">{label}</p>
    </div>
  );
}

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const lower = status?.toLowerCase() ?? "";
  const isDelivered = lower.includes("entregue");
  const isTransit = lower.includes("trânsito") || lower.includes("transito");

  const cls = isDelivered
    ? "bg-green-50 text-green-700 border-green-200"
    : isTransit
    ? "bg-blue-50 text-blue-700 border-blue-200"
    : "bg-gray-100 text-gray-600 border-gray-200";

  return (
    <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full border ${cls}`}>
      {status}
    </span>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function OrderManager() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filtered, setFiltered] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [vehicles, setVehicles] = useState<{ id: number; plate: string; model?: string }[]>([]);
  const [creating, setCreating] = useState(false);
  const [newOrder, setNewOrder] = useState<NewOrderForm>(initialOrderState);
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; code: string } | null>(null);

  useEffect(() => {
    loadOrders();
    loadVehicles();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await api.get("/order");
      setOrders(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadVehicles = async () => {
    try {
      const res = await api.get("/vehicle");
      setVehicles(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setFiltered(
      orders.filter(
        (o) =>
          String(o.id).includes(value) ||
          (o.code && o.code.toLowerCase().includes(value.toLowerCase())) ||
          (o.recipient && o.recipient.toLowerCase().includes(value.toLowerCase()))
      )
    );
  };

  // ── Form helpers ──

  const updateRecipient = (field: keyof NewOrderForm["recipient"], value: string) =>
    setNewOrder((prev) => ({ ...prev, recipient: { ...prev.recipient, [field]: value } }));

  const updateAddress = (field: keyof NewOrderForm["recipient"]["address"], value: string) =>
    setNewOrder((prev) => ({
      ...prev,
      recipient: { ...prev.recipient, address: { ...prev.recipient.address, [field]: value } },
    }));

  const handleAddProduct = () =>
    setNewOrder((prev) => ({
      ...prev,
      products: [...prev.products, { name: "", description: "", quantity: 1 }],
    }));

  const handleRemoveProduct = (index: number) =>
    setNewOrder((prev) => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index),
    }));

  const updateProduct = (index: number, field: keyof Product, value: any) =>
    setNewOrder((prev) => {
      const updated = [...prev.products];
      (updated[index] as any)[field] = value;
      return { ...prev, products: updated };
    });

  // ── CRUD ──

  const handleCreate = async () => {
    if (!newOrder.vehicle_id) return alert("Selecione um veículo.");
    if (!newOrder.recipient.name || !newOrder.recipient.cpf)
      return alert("Preencha nome e CPF do destinatário.");
    try {
      setSaving(true);
      const payload = {
        vehicle_id: Number(newOrder.vehicle_id),
        recipient: {
          name: newOrder.recipient.name,
          cpf: newOrder.recipient.cpf.replace(/\D/g, ""),
          email: newOrder.recipient.email,
          address: {
            street: newOrder.recipient.address.street,
            number: newOrder.recipient.address.number
              ? Number(newOrder.recipient.address.number)
              : null,
            complement: newOrder.recipient.address.complement,
            city: newOrder.recipient.address.city,
            state: newOrder.recipient.address.state,
            country: newOrder.recipient.address.country,
            zipcode: newOrder.recipient.address.zipcode.replace(/\D/g, ""),
          },
        },
        products: newOrder.products.map((p) => ({
          name: p.name,
          description: p.description,
          quantity: Number(p.quantity),
        })),
      };
      await api.post("/order/company", payload);
      await loadOrders();
      setCreating(false);
      setNewOrder(initialOrderState);
    } catch (err: any) {
      alert(err.response?.data?.message || "Erro ao criar pedido.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/order/${deleteTarget.id}`);
      setOrders((prev) => prev.filter((o) => o.id !== deleteTarget.id));
      setFiltered((prev) => prev.filter((o) => o.id !== deleteTarget.id));
    } catch {
      alert("Erro ao excluir pedido.");
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <GenericPanelLayout panel="pedido">
      <div className="w-full max-w-5xl mx-auto space-y-6">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#384A6C] tracking-tight">Pedidos</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {filtered.length} pedido{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm">
              <LuSearch size={15} className="text-gray-400 shrink-0" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Buscar por código ou destinatário..."
                className="outline-none text-sm text-gray-700 placeholder-gray-300 w-56"
              />
            </div>

            <button
              onClick={() => setCreating(true)}
              className="flex items-center gap-2 bg-[#384A6C] text-white px-4 py-2.5 rounded-xl text-sm font-bold
                hover:bg-[#2f3e5c] active:scale-95 transition-all shadow-sm"
            >
              <LuPlus size={16} />
              Novo pedido
            </button>
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
              <p className="text-sm text-gray-400">Carregando pedidos...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-2 text-gray-400">
              <LuPackage size={32} className="opacity-30" />
              <p className="text-sm font-medium">
                {searchTerm ? "Nenhum pedido encontrado para a busca." : "Nenhum pedido cadastrado."}
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-50">
              {filtered.map((order) => (
                <li
                  key={order.id}
                  className="flex items-center justify-between px-6 py-4 hover:bg-[#EEF5FB]/60 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#384A6C]/10 flex items-center justify-center text-[#384A6C] shrink-0">
                      <LuBox size={18} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-gray-800 text-sm flex items-center gap-1">
                          <LuHash size={12} className="text-gray-400" />
                          {order.code || order.id}
                        </p>
                        {order.status && <StatusBadge status={order.status} />}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5 flex-wrap">
                        {order.recipient && (
                          <span className="flex items-center gap-1">
                            <LuUser size={11} /> {order.recipient}
                          </span>
                        )}
                        {order.vehicle && (
                          <span className="flex items-center gap-1">
                            <LuTruck size={11} /> {order.vehicle}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setDeleteTarget({ id: order.id, code: order.code || String(order.id) })}
                    className="p-2 rounded-xl text-red-400 hover:bg-red-50 transition shrink-0 ml-4"
                    title="Excluir pedido"
                  >
                    <LuTrash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* ── Modal Criação ── */}
      {creating && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between px-8 pt-7 pb-4 border-b border-gray-100">
              <h2 className="text-xl font-extrabold text-[#384A6C] tracking-tight">Novo Pedido</h2>
              <button
                onClick={() => { setCreating(false); setNewOrder(initialOrderState); }}
                className="text-gray-400 hover:text-gray-600 transition p-1 rounded-lg hover:bg-gray-100"
              >
                <LuX size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="px-8 py-6 overflow-y-auto space-y-8">

              {/* Veículo */}
              <div>
                <SectionTitle icon={LuTruck} label="Veículo responsável" />
                <SelectField
                  label="Veículo *"
                  value={newOrder.vehicle_id}
                  onChange={(e) => setNewOrder({ ...newOrder, vehicle_id: Number(e.target.value) })}
                >
                  <option value="">Selecione um veículo...</option>
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.plate}{v.model ? ` — ${v.model}` : ""}
                    </option>
                  ))}
                </SelectField>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Destinatário */}
                <div className="bg-[#EEF5FB] rounded-2xl p-5 border border-[#94C0E0]/30">
                  <SectionTitle icon={LuUser} label="Destinatário" />
                  <div className="space-y-3">
                    <Field
                      label="Nome completo *"
                      placeholder="Nome do destinatário"
                      value={newOrder.recipient.name}
                      onChange={(e) => updateRecipient("name", e.target.value)}
                    />
                    <Field
                      label="CPF *"
                      placeholder="000.000.000-00"
                      value={maskCPF(newOrder.recipient.cpf)}
                      onChange={(e) => updateRecipient("cpf", maskCPF(e.target.value))}
                    />
                    <Field
                      label="E-mail"
                      type="email"
                      placeholder="destinatario@email.com"
                      value={newOrder.recipient.email}
                      onChange={(e) => updateRecipient("email", e.target.value)}
                    />
                  </div>
                </div>

                {/* Endereço */}
                <div className="bg-[#EEF5FB] rounded-2xl p-5 border border-[#94C0E0]/30">
                  <SectionTitle icon={LuMapPin} label="Endereço de entrega" />
                  <div className="grid grid-cols-6 gap-3">
                    <Field
                      label="Rua"
                      className="col-span-4"
                      placeholder="Nome da rua"
                      value={newOrder.recipient.address.street}
                      onChange={(e) => updateAddress("street", e.target.value)}
                    />
                    <Field
                      label="Número"
                      className="col-span-2"
                      type="number"
                      placeholder="0"
                      value={newOrder.recipient.address.number}
                      onChange={(e) => updateAddress("number", e.target.value)}
                    />
                    <Field
                      label="CEP"
                      className="col-span-3"
                      placeholder="00000-000"
                      value={maskZip(newOrder.recipient.address.zipcode)}
                      onChange={(e) => updateAddress("zipcode", maskZip(e.target.value))}
                    />
                    <Field
                      label="Cidade"
                      className="col-span-2"
                      placeholder="Cidade"
                      value={newOrder.recipient.address.city}
                      onChange={(e) => updateAddress("city", e.target.value)}
                    />
                    <Field
                      label="UF"
                      className="col-span-1"
                      placeholder="SP"
                      maxLength={2}
                      value={newOrder.recipient.address.state}
                      onChange={(e) => updateAddress("state", e.target.value.toUpperCase())}
                    />
                    <Field
                      label="Complemento"
                      className="col-span-6"
                      placeholder="Apto, bloco..."
                      value={newOrder.recipient.address.complement}
                      onChange={(e) => updateAddress("complement", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Produtos */}
              <div>
                <SectionTitle icon={LuBox} label="Itens do pedido" />
                <div className="space-y-3">
                  {newOrder.products.map((p, index) => (
                    <div
                      key={index}
                      className="flex gap-3 items-end bg-[#EEF5FB] border border-[#94C0E0]/30 rounded-2xl p-4"
                    >
                      <Field
                        label="Produto"
                        className="flex-1"
                        placeholder="Nome do item"
                        value={p.name}
                        onChange={(e) => updateProduct(index, "name", e.target.value)}
                      />
                      <Field
                        label="Descrição"
                        className="flex-1"
                        placeholder="Breve descrição"
                        value={p.description}
                        onChange={(e) => updateProduct(index, "description", e.target.value)}
                      />
                      <Field
                        label="Qtd"
                        className="w-20"
                        type="number"
                        value={p.quantity}
                        onChange={(e) => updateProduct(index, "quantity", Number(e.target.value))}
                      />
                      {index > 0 && (
                        <button
                          onClick={() => handleRemoveProduct(index)}
                          className="p-2 rounded-xl text-red-400 hover:bg-red-50 transition shrink-0 mb-0.5"
                        >
                          <LuTrash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleAddProduct}
                  className="mt-3 flex items-center gap-1.5 text-sm text-[#384A6C] font-bold hover:underline underline-offset-4"
                >
                  <LuPlus size={15} /> Adicionar item
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-8 py-5 border-t border-gray-100">
              <button
                onClick={() => { setCreating(false); setNewOrder(initialOrderState); }}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreate}
                disabled={saving}
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-[#384A6C] hover:bg-[#2f3e5c] active:scale-95 transition-all disabled:opacity-60"
              >
                {saving ? "Criando..." : "Confirmar pedido"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal Confirmação de Exclusão ── */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 flex flex-col items-center text-center gap-4">
            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
              <LuTrash2 size={24} className="text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-gray-800">Excluir pedido?</h3>
              <p className="text-sm text-gray-400 mt-1">
                Pedido{" "}
                <span className="font-semibold text-gray-600">#{deleteTarget.code}</span>{" "}
                será removido permanentemente.
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