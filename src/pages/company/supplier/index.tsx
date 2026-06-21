import { useState } from "react";
import { GenericPanelLayout } from "../../../components/Layout/company/layoutOption";
import {
  LuSearch,
  LuTrash2,
  LuPlus,
  LuPencil,
  LuTruck,
  LuMapPin,
} from "react-icons/lu";
import { useSuppliers } from "../../../hooks/useSupplier";
import { type Supplier, type SupplierForm, EMPTY_FORM } from "../../../types/supplier";
import { SupplierModal } from "../../../components/supplier/supplierModal";
import { DeleteSupplierModal } from "../../../components/supplier/deleteSupplierModal";

export default function SupplierManager() {
  const {
    suppliers,
    loading,
    saving,
    searchTerm,
    handleSearch,
    createSupplier,
    updateSupplier,
    deleteSupplier,
  } = useSuppliers();

  // Interface State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<SupplierForm>(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string } | null>(null);

  const handleFormChange = (field: keyof SupplierForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await updateSupplier(editingId, formData);
      } else {
        await createSupplier(formData);
      }
      closeModal();
    } catch {
      // Handled in hook
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteSupplier(deleteTarget.id);
      setDeleteTarget(null);
    } catch {
      // Handled in hook
    }
  };

  const openNew = () => {
    setEditingId(null);
    setFormData(EMPTY_FORM);
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
    setFormData(EMPTY_FORM);
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
              {suppliers.length} fornecedor{suppliers.length !== 1 ? "es" : ""} encontrado{suppliers.length !== 1 ? "s" : ""}
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
          ) : suppliers.length === 0 ? (
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
                  {suppliers.map((s) => {
                    const addr = s.address ?? {};
                    return (
                      <tr key={s.id} className="hover:bg-[#EEF5FB]/60 transition-colors">
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
                        <td className="py-4 px-6">
                          <p className="text-sm text-gray-700">{s.phone || "—"}</p>
                          {s.contactPerson && (
                            <p className="text-xs text-gray-400">Ref: {s.contactPerson}</p>
                          )}
                        </td>
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
                        <td className="py-4 px-6">
                          <span className="text-sm font-mono text-gray-600">{s.CNPJ}</span>
                        </td>
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

      {/* Modais */}
      {isModalOpen && (
        <SupplierModal
          title={editingId ? "Editar Fornecedor" : "Novo Fornecedor"}
          form={formData}
          onChange={handleFormChange}
          onConfirm={handleSave}
          onClose={closeModal}
          loading={saving}
        />
      )}

      {deleteTarget && (
        <DeleteSupplierModal
          name={deleteTarget.name}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </GenericPanelLayout>
  );
}