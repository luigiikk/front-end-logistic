import { useState } from "react";
import { GenericPanelLayout } from "../../../components/Layout/company/layoutOption";
import { LuSearch, LuPlus, LuTruck, LuPencil, LuTrash2, LuGauge } from "react-icons/lu";
import { type Vehicle, type VehicleForm, EMPTY_FORM } from "../../../types/vehicle";
import { getInitials, resolveStatusId } from "./../../../util/vehicleHelpers";
import { useVehicles } from "../../../hooks/useVehicle";
import { VehicleModal } from "../../../components/vehicle/vehicleModal";
import { DeleteVehicleModal } from "../../../components/vehicle/deleteVehicleModal";

export default function VehicleManager() {
  const {
    vehicles,
    statuses,
    loading,
    saving,
    search,
    handleSearch,
    createVehicle,
    updateVehicle,
    deleteVehicle,
  } = useVehicles();

  // Estados de Interface (Modais)
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [editForm, setEditForm] = useState<VehicleForm>(EMPTY_FORM);
  
  const [creating, setCreating] = useState(false);
  const [newForm, setNewForm] = useState<VehicleForm>(EMPTY_FORM);
  
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; plate: string } | null>(null);

  // Handlers de UI
  const handleOpenEdit = (v: Vehicle) => {
    setEditingVehicle(v);
    setEditForm({
      plate: v.plate,
      model: v.model,
      total_volume: v.total_volume,
      status_id: resolveStatusId(v.status, statuses),
      documents: [],
      maintenances: [],
    });
  };

  const handleSaveEdit = async () => {
    if (!editingVehicle) return;
    try {
      await updateVehicle(editingVehicle.id, editForm);
      setEditingVehicle(null);
    } catch (error) {
      // O erro já é tratado no hook, apenas evitamos fechar o modal
    }
  };

  const handleSaveNew = async () => {
    try {
      await createVehicle(newForm);
      setCreating(false);
      setNewForm(EMPTY_FORM);
    } catch (error) {
      // Impede fechamento em caso de erro
    }
  };

  return (
    <GenericPanelLayout panel="veiculo">
      <div className="w-full max-w-5xl mx-auto space-y-6">
        
        {/* ── Header e Busca ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#384A6C] tracking-tight flex items-center gap-2">
              <LuTruck size={22} /> Veículos
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {vehicles.length} veículo{vehicles.length !== 1 ? "s" : ""} encontrado{vehicles.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm">
              <LuSearch size={15} className="text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder="Buscar por placa, modelo ou status..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="outline-none text-sm text-gray-700 placeholder-gray-300 w-52"
              />
            </div>
            <button
              onClick={() => setCreating(true)}
              className="flex items-center gap-2 bg-[#384A6C] text-white px-4 py-2.5 rounded-xl text-sm font-bold
                hover:bg-[#2f3e5c] active:scale-95 transition-all shadow-sm"
            >
              <LuPlus size={16} /> Novo veículo
            </button>
          </div>
        </div>

        {/* ── Lista de Veículos ── */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <svg className="animate-spin h-6 w-6 text-[#94C0E0]" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <p className="text-sm text-gray-400">Carregando veículos...</p>
            </div>
          ) : vehicles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-2 text-gray-400">
              <LuTruck size={32} className="opacity-30" />
              <p className="text-sm font-medium">Nenhum veículo encontrado.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-50">
              {vehicles.map((v) => (
                <li key={v.id} className="flex items-center justify-between px-6 py-4 hover:bg-[#EEF5FB]/60 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#384A6C]/10 flex items-center justify-center text-[#384A6C] text-xs font-bold shrink-0">
                      {getInitials(v.model)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-gray-800 text-sm">{v.plate}</p>
                        <span className="text-gray-400 text-xs">—</span>
                        <p className="text-sm text-gray-600">{v.model}</p>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5 flex-wrap">
                        <span className="flex items-center gap-1">
                          <LuGauge size={11} />
                          Volume: <span className="font-semibold text-gray-600">{v.available_volume} / {v.total_volume} m³</span>
                        </span>
                        <span className="inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full border bg-[#384A6C]/10 text-[#384A6C] border-[#384A6C]/20">
                          {v.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-4">
                    <button onClick={() => handleOpenEdit(v)} className="p-2 rounded-xl text-[#384A6C] hover:bg-[#384A6C]/10 transition">
                      <LuPencil size={16} />
                    </button>
                    <button onClick={() => setDeleteTarget({ id: v.id, plate: v.plate })} className="p-2 rounded-xl text-red-400 hover:bg-red-50 transition">
                      <LuTrash2 size={16} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* ── Modais ── */}
      {editingVehicle && (
        <VehicleModal
          title={`Editar — ${editingVehicle.plate}`}
          form={editForm}
          statuses={statuses}
          onChange={setEditForm}
          onConfirm={handleSaveEdit}
          onClose={() => setEditingVehicle(null)}
          confirmLabel="Salvar alterações"
          loading={saving}
          isCreating={false}
        />
      )}

      {creating && (
        <VehicleModal
          title="Novo Veículo"
          form={newForm}
          statuses={statuses}
          onChange={setNewForm}
          onConfirm={handleSaveNew}
          onClose={() => { setCreating(false); setNewForm(EMPTY_FORM); }}
          confirmLabel="Cadastrar"
          loading={saving}
          isCreating={true}
        />
      )}

      {deleteTarget && (
        <DeleteVehicleModal
          plate={deleteTarget.plate}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => {
            deleteVehicle(deleteTarget.id);
            setDeleteTarget(null);
          }}
        />
      )}
    </GenericPanelLayout>
  );
}