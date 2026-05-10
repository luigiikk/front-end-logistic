import { useEffect, useState } from "react";
import { api } from "../../../api/lib/api";
import { GenericPanelLayout } from "../../../components/Layout/company/layoutOption";
import {
  LuSearch,
  LuTrash2,
  LuPlus,
  LuPencil,
  LuX,
  LuTruck,
  LuMapPin,
  LuInfo,
} from "react-icons/lu";

// ─── Types ────────────────────────────────────────────────────────────────────

type Address = {
  street?: string;
  number?: number;
  complement?: string;
  city?: string;
  state?: string;
  country?: string;
  zipcode?: string;
};

type Supplier = {
  id: number;
  name: string;
  email: string;
  phone: string;
  CNPJ: string;
  contactPerson?: string;
  notes?: string;
  address?: Address | null;
};

type SupplierForm = {
  name: string;
  email: string;
  phone: string;
  CNPJ: string;
  contactPerson: string;
  notes: string;
  street: string;
  number: string;
  complement: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const initialForm: SupplierForm = {
  name: "", email: "", phone: "", CNPJ: "", contactPerson: "", notes: "",
  street: "", number: "", complement: "", city: "", state: "", country: "", zipcode: "",
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

export default function SupplierManager() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [filtered, setFiltered] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<SupplierForm>(initialForm);
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string } | null>(null);

  const loadSuppliers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/supplier");
      const data: Supplier[] = Array.isArray(res.data) ? res.data : res.data.data ?? [];
      setSuppliers(data);
      setFiltered(data);
    } catch (err) {
      console.error("Erro ao carregar fornecedores", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSuppliers();
  }, []);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const lower = value.toLowerCase();
    setFiltered(
      suppliers.filter(
        (s) =>
          s.name.toLowerCase().includes(lower) ||
          s.CNPJ.includes(value) ||
          s.email.toLowerCase().includes(lower)
      )
    );
  };

  const handleChange = (field: keyof SupplierForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!formData.name || !formData.CNPJ || !formData.email) {
      alert("Nome, Email e CNPJ são obrigatórios.");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        CNPJ: formData.CNPJ,
        contactPerson: formData.contactPerson || null,
        notes: formData.notes || null,
        street: formData.street || null,
        number: formData.number ? Number(formData.number) : null,
        complement: formData.complement || null,
        city: formData.city || null,
        state: formData.state || null,
        country: formData.country || null,
        zipcode: formData.zipcode || null,
      };

      if (editingId) {
        await api.put(`/supplier/${editingId}`, payload);
      } else {
        await api.post("/supplier", payload);
      }

      closeModal();
      await loadSuppliers();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Erro ao salvar fornecedor.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/supplier/${deleteTarget.id}`);
      setSuppliers((prev) => prev.filter((s) => s.id !== deleteTarget.id));
      setFiltered((prev) => prev.filter((s) => s.id !== deleteTarget.id));
    } catch {
      alert("Erro ao excluir fornecedor.");
    } finally {
      setDeleteTarget(null);
    }
  };

  const openNew = () => {
    setEditingId(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const openEdit = (s: Supplier) => {
    setEditingId(s.id);
    const addr = s.address ?? {};
    setFormData({
      name: s.name,
      email: s.email,
      phone: s.phone ?? "",
      CNPJ: s.CNPJ,
      contactPerson: s.contactPerson ?? "",
      notes: s.notes ?? "",
      street: addr.street ?? "",
      number: addr.number ? String(addr.number) : "",
      complement: addr.complement ?? "",
      city: addr.city ?? "",
      state: addr.state ?? "",
      country: addr.country ?? "",
      zipcode: addr.zipcode ?? "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData(initialForm);
  };

  return (
    <GenericPanelLayout panel="fornecedor">
      <div className="w-full max-w-6xl mx-auto space-y-6">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#384A6C] tracking-tight flex items-center gap-2">
              <LuTruck size={22} /> Fornecedores
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {filtered.length} fornecedor{filtered.length !== 1 ? "es" : ""} encontrado
              {filtered.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm">
              <LuSearch size={15} className="text-gray-400 shrink-0" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Buscar por nome, CNPJ ou email..."
                className="outline-none text-sm text-gray-700 placeholder-gray-300 w-56"
              />
            </div>
            <button
              onClick={openNew}
              className="flex items-center gap-2 bg-[#384A6C] hover:bg-[#2f3e5c] active:scale-95 text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-sm transition-all"
            >
              <LuPlus size={16} /> Novo Fornecedor
            </button>
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
              <p className="text-sm text-gray-400">Carregando fornecedores...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-2 text-gray-400">
              <LuTruck size={32} className="opacity-30" />
              <p className="text-sm font-medium">Nenhum fornecedor encontrado.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100 bg-[#EEF5FB]">
                    {["Empresa", "Contato", "Localização", "CNPJ", ""].map((h) => (
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
                  {filtered.map((s) => {
                    const addr = s.address ?? {};
                    return (
                      <tr key={s.id} className="hover:bg-[#EEF5FB]/60 transition-colors">

                        {/* Empresa */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#384A6C]/10 flex items-center justify-center text-[#384A6C] shrink-0">
                              <LuTruck size={14} />
                            </div>
                            <div>
                              <p className="font-semibold text-sm text-gray-800">{s.name}</p>
                              <p className="text-xs text-gray-400">{s.email}</p>
                            </div>
                          </div>
                        </td>

                        {/* Contato */}
                        <td className="py-4 px-6">
                          <p className="text-sm text-gray-700">{s.phone || "—"}</p>
                          {s.contactPerson && (
                            <p className="text-xs text-gray-400">Ref: {s.contactPerson}</p>
                          )}
                        </td>

                        {/* Localização */}
                        <td className="py-4 px-6">
                          {addr.city ? (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#384A6C] bg-[#384A6C]/10 px-2.5 py-1 rounded-full">
                              <LuMapPin size={10} />
                              {addr.city} / {addr.state}
                            </span>
                          ) : (
                            <span className="text-xs text-gray-300">N/D</span>
                          )}
                        </td>

                        {/* CNPJ */}
                        <td className="py-4 px-6">
                          <span className="text-sm font-mono text-gray-600">{s.CNPJ}</span>
                        </td>

                        {/* Ações */}
                        <td className="py-4 px-6">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => openEdit(s)}
                              className="p-2 rounded-xl text-[#384A6C] hover:bg-[#384A6C]/10 transition"
                              title="Editar"
                            >
                              <LuPencil size={15} />
                            </button>
                            <button
                              onClick={() => setDeleteTarget({ id: s.id, name: s.name })}
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

      {/* ── Modal Edição / Criação ── */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh]">

            {/* Header */}
            <div className="flex items-center justify-between px-8 pt-7 pb-4 border-b border-gray-100">
              <h2 className="text-xl font-extrabold text-[#384A6C] tracking-tight flex items-center gap-2">
                <LuTruck size={18} />
                {editingId ? "Editar Fornecedor" : "Novo Fornecedor"}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition p-1 rounded-lg hover:bg-gray-100"
              >
                <LuX size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="px-8 py-6 overflow-y-auto space-y-6">

              {/* Seção Dados da Empresa */}
              <div>
                <p className="text-[10px] font-bold text-[#384A6C] uppercase tracking-widest flex items-center gap-1 mb-3">
                  <LuInfo size={11} /> Dados da Empresa
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Field
                    label="Nome da Empresa *"
                    className="md:col-span-1"
                    placeholder="Ex: Distribuidora ABC"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                  />
                  <Field
                    label="CNPJ *"
                    className="md:col-span-1"
                    placeholder="00.000.000/0001-00"
                    value={formData.CNPJ}
                    onChange={(e) => handleChange("CNPJ", e.target.value)}
                  />
                  <Field
                    label="Email *"
                    className="md:col-span-1"
                    type="email"
                    placeholder="contato@empresa.com"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                  <Field
                    label="Telefone"
                    className="md:col-span-1"
                    placeholder="(00) 00000-0000"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                  />
                  <Field
                    label="Pessoa de Contato"
                    className="md:col-span-1"
                    placeholder="Nome do responsável"
                    value={formData.contactPerson}
                    onChange={(e) => handleChange("contactPerson", e.target.value)}
                  />
                  <Field
                    label="Notas / Observações"
                    className="md:col-span-3"
                    placeholder="Informações adicionais..."
                    value={formData.notes}
                    onChange={(e) => handleChange("notes", e.target.value)}
                  />
                </div>
              </div>

              {/* Seção Endereço */}
              <div>
                <p className="text-[10px] font-bold text-[#384A6C] uppercase tracking-widest flex items-center gap-1 mb-3">
                  <LuMapPin size={11} /> Endereço
                </p>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Field
                    label="CEP"
                    className="md:col-span-1"
                    placeholder="00000-000"
                    value={formData.zipcode}
                    onChange={(e) => handleChange("zipcode", e.target.value)}
                  />
                  <Field
                    label="Rua / Logradouro"
                    className="md:col-span-2"
                    placeholder="Nome da rua"
                    value={formData.street}
                    onChange={(e) => handleChange("street", e.target.value)}
                  />
                  <Field
                    label="Número"
                    className="md:col-span-1"
                    type="number"
                    placeholder="0"
                    value={formData.number}
                    onChange={(e) => handleChange("number", e.target.value)}
                  />
                  <Field
                    label="Complemento"
                    className="md:col-span-1"
                    placeholder="Apto, Bloco..."
                    value={formData.complement}
                    onChange={(e) => handleChange("complement", e.target.value)}
                  />
                  <Field
                    label="Cidade"
                    className="md:col-span-1"
                    placeholder="Cidade"
                    value={formData.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                  />
                  <Field
                    label="UF"
                    className="md:col-span-1"
                    placeholder="SP"
                    maxLength={2}
                    value={formData.state}
                    onChange={(e) => handleChange("state", e.target.value)}
                  />
                  <Field
                    label="País"
                    className="md:col-span-1"
                    placeholder="Brasil"
                    value={formData.country}
                    onChange={(e) => handleChange("country", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
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
                {saving ? "Salvando..." : editingId ? "Salvar alterações" : "Cadastrar Fornecedor"}
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
              <h3 className="text-lg font-extrabold text-gray-800">Excluir fornecedor?</h3>
              <p className="text-sm text-gray-400 mt-1">
                <span className="font-semibold text-gray-600">{deleteTarget.name}</span> será
                removido permanentemente.
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