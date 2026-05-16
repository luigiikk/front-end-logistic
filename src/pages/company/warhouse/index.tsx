import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "../../../api/lib/api";
import { GenericPanelLayout } from "../../../components/Layout/company/layoutOption";
import {
  LuSearch, LuTrash2, LuPlus, LuPencil, LuX, LuWarehouse, LuMapPin, LuBoxes,
} from "react-icons/lu";
import { useToast } from "../../../components/Toast/ToastContent";

type Address = {
  street: string; number: number; city: string; state: string;
  zipcode: string; complement?: string; country?: string;
};

type Warehouse = {
  id: number;
  name: string;
  address?: Address | null;
  total_volume?: number | null;
  used_volume?: number | null;
  available_volume?: number | null;
};

type WarehouseForm = {
  name: string; street: string; number: string; complement: string;
  city: string; state: string; country: string; zipcode: string;
  total_volume: string;
};

const initialForm: WarehouseForm = {
  name: "", street: "", number: "", complement: "",
  city: "", state: "", country: "", zipcode: "", total_volume: "",
};

function resolveAddress(w: Warehouse): Partial<Address> { return w.address ?? {}; }

function CapacityBar({ used, total }: { used: number; total: number }) {
  const pct = total > 0 ? Math.min((used / total) * 100, 100) : 0;
  const color = pct >= 90 ? "bg-red-400" : pct >= 70 ? "bg-yellow-400" : "bg-emerald-400";

  return (
    <div className="flex flex-col gap-2 min-w-[280px]">
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-gray-50 rounded-xl px-3 py-2">
          <p className="text-[10px] text-gray-400 mb-0.5">Total</p>
          <p className="text-sm font-semibold text-gray-700">{total.toFixed(2)} m³</p>
        </div>
        <div className="bg-gray-50 rounded-xl px-3 py-2">
          <p className="text-[10px] text-gray-400 mb-0.5">Ocupado</p>
          <p className="text-sm font-semibold text-gray-700">
            {used.toFixed(2)} m³{" "}
            <span className="text-[10px] text-gray-400">({pct.toFixed(0)}%)</span>
          </p>
        </div>
        <div className="bg-gray-50 rounded-xl px-3 py-2">
          <p className="text-[10px] text-gray-400 mb-0.5">Disponível</p>
          <p className="text-sm font-semibold text-gray-700">{(total - used).toFixed(2)} m³</p>
        </div>
      </div>

      <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[10px] text-gray-400 text-right">{pct.toFixed(0)}% ocupado</span>
    </div>
  );
}

function Field({ label, className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string; className?: string }) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label className="text-[10px] font-bold text-[#384A6C] uppercase tracking-widest">{label}</label>
      <input
        {...props}
        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#94C0E0] focus:border-transparent transition-all"
      />
    </div>
  );
}

export default function WarehouseManager() {
  const { toast } = useToast();
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [filtered, setFiltered] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<WarehouseForm>(initialForm);
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string } | null>(null);

  // Debounce ref — stable across renders, no useMemo pitfall
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleans up on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  // Accepts current search term as parameter to avoid stale closure after save/reload
  const loadWarehouses = async (currentSearch = searchTerm) => {
    try {
      setLoading(true);
      const res = await api.get("/warehouses");
      const data: Warehouse[] = Array.isArray(res.data) ? res.data : res.data.data ?? [];
      setWarehouses(data);

      const lower = currentSearch.toLowerCase();
      setFiltered(
        currentSearch
          ? data.filter(
              (w) =>
                w.name.toLowerCase().includes(lower) ||
                String(w.id).includes(currentSearch)
            )
          : data
      );
    } catch (err) {
      toast(`${err}`, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadWarehouses(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // useCallback so the function reference is stable; debounceRef holds the timer
  const handleSearch = useCallback(
    (value: string) => {
      setSearchTerm(value);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        const lower = value.toLowerCase();
        setFiltered(
          warehouses.filter(
            (w) =>
              w.name.toLowerCase().includes(lower) ||
              String(w.id).includes(value)
          )
        );
      }, 200);
    },
    [warehouses] // re-bind only when the source list changes
  );

  const handleChange = (field: keyof WarehouseForm, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    if (!formData.name || !formData.street || !formData.city) {
      toast("Nome, Rua e Cidade são obrigatórios.", "info");
      return;
    }
    try {
      setSaving(true);
      const payload = {
        name: formData.name,
        street: formData.street,
        number: Number(formData.number),
        complement: formData.complement || "",
        city: formData.city,
        state: formData.state,
        country: formData.country,
        zipcode: formData.zipcode,
        // Guard against "" → NaN: empty string becomes null (no limit)
        total_volume: formData.total_volume !== "" ? Number(formData.total_volume) : null,
      };
      if (editingId) {
        await api.put(`/warehouses/${editingId}`, payload);
      } else {
        await api.post("/warehouses", payload);
      }
      closeModal();
      // Pass current searchTerm explicitly so loadWarehouses doesn't read a stale closure
      await loadWarehouses(searchTerm);
    } catch (err: any) {
      toast(`${err}`, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/warehouses/${deleteTarget.id}`);
      setWarehouses((prev) => prev.filter((w) => w.id !== deleteTarget.id));
      setFiltered((prev) => prev.filter((w) => w.id !== deleteTarget.id));
    } catch(err) {
      toast(`${err}`, "error");
    } finally {
      setDeleteTarget(null);
    }
  };

  const openNew = () => { setEditingId(null); setFormData(initialForm); setIsModalOpen(true); };

  const openEdit = (w: Warehouse) => {
    setEditingId(w.id);
    const addr = resolveAddress(w);
    setFormData({
      name: w.name,
      street: addr.street ?? "",
      number: addr.number ? String(addr.number) : "",
      complement: addr.complement ?? "",
      city: addr.city ?? "",
      state: addr.state ?? "",
      country: addr.country ?? "",
      zipcode: addr.zipcode ?? "",
      total_volume: w.total_volume != null ? String(w.total_volume) : "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData(initialForm);
  };

  return (
    <GenericPanelLayout panel="armazem">
      <div className="w-full max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#384A6C] tracking-tight flex items-center gap-2">
              <LuWarehouse size={22} /> Armazéns
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {filtered.length} armazém{filtered.length !== 1 ? "ns" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm">
              <LuSearch size={15} className="text-gray-400 shrink-0" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Buscar por nome ou ID..."
                className="outline-none text-sm text-gray-700 placeholder-gray-300 w-48"
              />
            </div>
            <button
              onClick={openNew}
              className="flex items-center gap-2 bg-[#384A6C] hover:bg-[#2f3e5c] active:scale-95 text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-sm transition-all"
            >
              <LuPlus size={16} /> Novo Armazém
            </button>
          </div>
        </div>

        {/* Tabela */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <svg className="animate-spin h-6 w-6 text-[#94C0E0]" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <p className="text-sm text-gray-400">Carregando armazéns...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-2 text-gray-400">
              <LuWarehouse size={32} className="opacity-30" />
              <p className="text-sm font-medium">Nenhum armazém encontrado.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100 bg-[#EEF5FB]">
                    {["Armazém", "Cidade / UF", "Endereço", "Capacidade", ""].map((h) => (
                      <th
                        key={h}
                        className="py-3 px-6 text-[10px] font-bold text-[#384A6C] uppercase tracking-widest whitespace-nowrap last:text-right"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((w) => {
                    const addr = resolveAddress(w);
                    const hasCapacity = w.total_volume != null;
                    const used = w.used_volume ?? 0;
                    return (
                      <tr key={w.id} className="hover:bg-[#EEF5FB]/60 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#384A6C]/10 flex items-center justify-center text-[#384A6C] shrink-0">
                              <LuWarehouse size={14} />
                            </div>
                            <div>
                              <p className="font-semibold text-sm text-gray-800">{w.name}</p>
                              <p className="text-xs text-gray-400">ID: {w.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          {addr.city ? (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#384A6C] bg-[#384A6C]/10 px-2.5 py-1 rounded-full">
                              <LuMapPin size={10} />{addr.city} / {addr.state}
                            </span>
                          ) : (
                            <span className="text-xs text-gray-300">N/D</span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-500 max-w-xs truncate">
                          {addr.street
                            ? `${addr.street}, ${addr.number ?? ""}`
                            : <span className="text-gray-300">—</span>}
                        </td>
                        <td className="py-4 px-6">
                          {hasCapacity ? (
                            <CapacityBar used={used} total={w.total_volume!} />
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs text-gray-300">
                              <LuBoxes size={11} /> Sem limite
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => openEdit(w)}
                              className="p-2 rounded-xl text-[#384A6C] hover:bg-[#384A6C]/10 transition"
                              title="Editar"
                            >
                              <LuPencil size={15} />
                            </button>
                            <button
                              onClick={() => setDeleteTarget({ id: w.id, name: w.name })}
                              className="p-2 rounded-xl text-red-400 hover:bg-red-50 transition"
                              title="Excluir"
                            >
                              <LuTrash2 size={15} />
                            </button>
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
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-8 pt-7 pb-4 border-b border-gray-100">
              <h2 className="text-xl font-extrabold text-[#384A6C] tracking-tight flex items-center gap-2">
                <LuWarehouse size={18} />{editingId ? "Editar" : "Novo"} Armazém
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition p-1 rounded-lg hover:bg-gray-100"
              >
                <LuX size={20} />
              </button>
            </div>

            <div className="px-8 py-6 overflow-y-auto space-y-5">
              <Field
                label="Nome do Armazém *"
                placeholder="Ex: Galpão Central"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />

              <div>
                <p className="text-[10px] font-bold text-[#384A6C] uppercase tracking-widest flex items-center gap-1 mb-3">
                  <LuBoxes size={11} /> Capacidade Volumétrica
                </p>
                <Field
                  label="Volume total (m³)"
                  placeholder="Ex: 500.00 — deixe vazio para sem limite"
                  type="number"
                  step="0.01"
                  min={0}
                  value={formData.total_volume}
                  onChange={(e) => handleChange("total_volume", e.target.value)}
                />
              </div>

              <div>
                <p className="text-[10px] font-bold text-[#384A6C] uppercase tracking-widest flex items-center gap-1 mb-3">
                  <LuMapPin size={11} /> Localização
                </p>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Field label="CEP" className="md:col-span-1" placeholder="00000-000" value={formData.zipcode} onChange={(e) => handleChange("zipcode", e.target.value)} />
                  <Field label="Rua *" className="md:col-span-3" placeholder="Nome da rua" value={formData.street} onChange={(e) => handleChange("street", e.target.value)} />
                  <Field label="Número" className="md:col-span-1" type="number" placeholder="0" value={formData.number} onChange={(e) => handleChange("number", e.target.value)} />
                  <Field label="Complemento" className="md:col-span-1" placeholder="Apto, Bloco..." value={formData.complement} onChange={(e) => handleChange("complement", e.target.value)} />
                  <Field label="Cidade *" className="md:col-span-2" placeholder="Cidade" value={formData.city} onChange={(e) => handleChange("city", e.target.value)} />
                  <Field label="UF" className="md:col-span-1" placeholder="SP" maxLength={2} value={formData.state} onChange={(e) => handleChange("state", e.target.value)} />
                  <Field label="País" className="md:col-span-1" placeholder="Brasil" value={formData.country} onChange={(e) => handleChange("country", e.target.value)} />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 px-8 py-5 border-t border-gray-100">
              <button
                onClick={closeModal}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-[#384A6C] hover:bg-[#2f3e5c] active:scale-95 transition-all disabled:opacity-60"
              >
                {saving ? "Salvando..." : editingId ? "Salvar alterações" : "Criar Armazém"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Exclusão */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 flex flex-col items-center text-center gap-4">
            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
              <LuTrash2 size={24} className="text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-gray-800">Excluir armazém?</h3>
              <p className="text-sm text-gray-400 mt-1">
                <span className="font-semibold text-gray-600">{deleteTarget.name}</span> será removido permanentemente.
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