import { useState } from "react";
import { GenericPanelLayout } from "../../../components/Layout/company/layoutOption";
import {
  LuSearch, LuTrash2, LuPlus, LuPencil, LuWarehouse, LuMapPin, LuBoxes,
} from "react-icons/lu";
import { useToast } from "../../../components/Toast/ToastContent";
import { useWarehouses } from "../../../hooks/useWarehouse";
import { type Warehouse, type WarehouseForm, EMPTY_FORM } from "../../../types/warehouse";
import { resolveAddress } from "../../../util/warehouseHelpers";
import { CapacityBar } from "../../../components/warehouse/capacityBar";
import { WarehouseModal } from "../../../components/warehouse/warehouseModal";
import { DeleteWarehouseModal } from "../../../components/warehouse/deleteWarehouseModal";

export default function WarehouseManager() {
  const { toast } = useToast();
  const {
    warehouses,
    loading,
    saving,
    searchTerm,
    handleSearch,
    createWarehouse,
    updateWarehouse,
    deleteWarehouse,
  } = useWarehouses();

  // Interface State (Modals)
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null);
  const [editForm, setEditForm] = useState<WarehouseForm>(EMPTY_FORM);
  const [creating, setCreating] = useState(false);
  const [newForm, setNewForm] = useState<WarehouseForm>(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string } | null>(null);

  // Form Field Change Handlers
  const handleFormChange = (formSetter: React.Dispatch<React.SetStateAction<WarehouseForm>>) => (field: keyof WarehouseForm, value: string) => {
    formSetter((prev) => ({ ...prev, [field]: value }));
  };

  // Open Edit Dialog
  const handleOpenEdit = (w: Warehouse) => {
    setEditingWarehouse(w);
    const addr = resolveAddress(w);
    setEditForm({
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
  };

  // Save Edit Dialog
  const handleSaveEdit = async () => {
    if (!editingWarehouse) return;
    if (!editForm.name || !editForm.street || !editForm.city) {
      toast("Nome, Rua e Cidade são obrigatórios.", "info");
      return;
    }
    try {
      await updateWarehouse(editingWarehouse.id, editForm);
      setEditingWarehouse(null);
    } catch (error) {
      // Errors are handled in the hook
    }
  };

  // Save New Dialog
  const handleSaveNew = async () => {
    if (!newForm.name || !newForm.street || !newForm.city) {
      toast("Nome, Rua e Cidade são obrigatórios.", "info");
      return;
    }
    try {
      await createWarehouse(newForm);
      setCreating(false);
      setNewForm(EMPTY_FORM);
    } catch (error) {
      // Errors are handled in the hook
    }
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
              {warehouses.length} armazém{warehouses.length !== 1 ? "ns" : ""} encontrado{warehouses.length !== 1 ? "s" : ""}
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
              onClick={() => setCreating(true)}
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
          ) : warehouses.length === 0 ? (
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
                  {warehouses.map((w) => {
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
                              onClick={() => handleOpenEdit(w)}
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

      {/* Modais */}
      {editingWarehouse && (
        <WarehouseModal
          title="Editar Armazém"
          form={editForm}
          onChange={handleFormChange(setEditForm)}
          onConfirm={handleSaveEdit}
          onClose={() => setEditingWarehouse(null)}
          loading={saving}
        />
      )}

      {creating && (
        <WarehouseModal
          title="Novo Armazém"
          form={newForm}
          onChange={handleFormChange(setNewForm)}
          onConfirm={handleSaveNew}
          onClose={() => {
            setCreating(false);
            setNewForm(EMPTY_FORM);
          }}
          loading={saving}
        />
      )}

      {deleteTarget && (
        <DeleteWarehouseModal
          name={deleteTarget.name}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={async () => {
            await deleteWarehouse(deleteTarget.id);
            setDeleteTarget(null);
          }}
        />
      )}
    </GenericPanelLayout>
  );
}