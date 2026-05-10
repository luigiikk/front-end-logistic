import { useEffect, useState } from "react";
import { api } from "../../../api/lib/api";
import { GenericPanelLayout } from "../../../components/Layout/company/layoutOption";
import {
  LuSearch,
  LuTrash2,
  LuPencil,
  LuPlus,
  LuX,
  LuTruck,
  LuGauge,
} from "react-icons/lu";

// ─── Types ────────────────────────────────────────────────────────────────────

type Vehicle = {
  id: number;
  plate: string;
  model: string;
  total_volume: number;    
  available_volume: number;  
  status: string;
};

type Status = {
  id: number;
  name: string;
  type: "order" | "vehicle" | "invoice" | "purchase_order";
  is_default?: boolean;
};

type VehicleForm = {
  plate: string;
  model: string;
  total_volume: number; 
  status_id: number;
};

const EMPTY_FORM: VehicleForm = {
  plate: "",
  model: "",
  total_volume: 0,
  status_id: 0,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(model: string) {
  return model
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function maskPlate(v: string) {
  return v.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 7);
}

/**
 * Cruza o nome do status atual do veículo (string) com o array de statuses
 * para recuperar o id correto e pré-selecionar o select no modal de edição.
 */
function resolveStatusId(statusName: string, statuses: Status[]): number {
  const match = statuses.find(
    (s) => s.name.toLowerCase() === statusName.toLowerCase()
  );
  return match?.id ?? 0;
}

// ─── Field / Select ───────────────────────────────────────────────────────────

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

// ─── Modal ────────────────────────────────────────────────────────────────────

type ModalProps = {
  title: string;
  form: VehicleForm;
  statuses: Status[];
  onChange: (f: VehicleForm) => void;
  onConfirm: () => void;
  onClose: () => void;
  confirmLabel: string;
  loading: boolean;
};

function VehicleModal({
  title, form, statuses, onChange, onConfirm, onClose, confirmLabel, loading,
}: ModalProps) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl">
        <div className="flex items-center justify-between px-8 pt-7 pb-4 border-b border-gray-100">
          <h2 className="text-xl font-extrabold text-[#384A6C] tracking-tight">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition p-1 rounded-lg hover:bg-gray-100"
          >
            <LuX size={20} />
          </button>
        </div>

        <div className="px-8 py-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Placa"
              placeholder="ABC1D23"
              value={form.plate}
              onChange={(e) => onChange({ ...form, plate: maskPlate(e.target.value) })}
            />
            <Field
              label="Modelo"
              placeholder="Ex: Fiat Ducato"
              value={form.model}
              onChange={(e) => onChange({ ...form, model: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Volume total (m³)"
              type="number"
              min={0}
              step={0.1}
              placeholder="0"
              value={form.total_volume || ""}
              onChange={(e) => onChange({ ...form, total_volume: Number(e.target.value) })}
            />
            <SelectField
              label="Status"
              value={form.status_id}
              onChange={(e) => onChange({ ...form, status_id: Number(e.target.value) })}
            >
              <option value={0}>Selecione...</option>
              {/* ✅ Só exibe statuses do tipo "vehicle" */}
              {statuses.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </SelectField>
          </div>
        </div>

        <div className="flex justify-end gap-3 px-8 py-5 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-[#384A6C] hover:bg-[#2f3e5c] active:scale-95 transition-all disabled:opacity-60"
          >
            {loading ? "Salvando..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function VehicleManager() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filtered, setFiltered] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  // ✅ Apenas statuses cujo entity_type === "vehicle"
  const [statuses, setStatuses] = useState<Status[]>([]);

  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [editForm, setEditForm] = useState<VehicleForm>(EMPTY_FORM);
  const [creating, setCreating] = useState(false);
  const [newForm, setNewForm] = useState<VehicleForm>(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; plate: string } | null>(null);

  useEffect(() => {
    Promise.all([api.get("/vehicle"), api.get("/status/vehicle")])
      .then(([vRes, sRes]) => {
        // A rota /status/vehicle já retorna apenas os do tipo "vehicle"
        const vehicleStatuses: Status[] = Array.isArray(sRes.data)
          ? sRes.data
          : sRes.data.data ?? [];

        const vehicleList: Vehicle[] = Array.isArray(vRes.data)
          ? vRes.data
          : vRes.data.data ?? [];

        setVehicles(vehicleList);
        setFiltered(vehicleList);
        setStatuses(vehicleStatuses);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (value: string) => {
    setSearch(value);
    const lower = value.toLowerCase();
    setFiltered(
      vehicles.filter(
        (v) =>
          v.plate.toLowerCase().includes(lower) ||
          v.model.toLowerCase().includes(lower) ||
          v.status.toLowerCase().includes(lower) ||
          String(v.total_volume).includes(value)
      )
    );
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/vehicle/${deleteTarget.id}`);
      const next = vehicles.filter((v) => v.id !== deleteTarget.id);
      setVehicles(next);
      setFiltered(
        next.filter(
          (v) =>
            v.plate.toLowerCase().includes(search.toLowerCase()) ||
            v.model.toLowerCase().includes(search.toLowerCase())
        )
      );
    } catch {
      alert("Erro ao excluir veículo.");
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleOpenEdit = (v: Vehicle) => {
    setEditingVehicle(v);
    setEditForm({
      plate: v.plate,
      model: v.model,
      total_volume: v.total_volume,
      // ✅ Resolve o id correto cruzando o nome do status com o array
      status_id: resolveStatusId(v.status, statuses),
    });
  };

  const handleSave = async () => {
    if (!editingVehicle) return;
    try {
      setSaving(true);
      const payload = {
        plate: editForm.plate,
        model: editForm.model,
        total_volume: Number(editForm.total_volume),
        status_id: editForm.status_id,
      };
      await api.put(`/vehicle/${editingVehicle.id}`, payload);
      const next = vehicles.map((v) =>
        v.id === editingVehicle.id ? { ...v, ...payload } : v
      );
      setVehicles(next);
      setFiltered(next);
      setEditingVehicle(null);
    } catch {
      alert("Erro ao atualizar veículo.");
    } finally {
      setSaving(false);
    }
  };

  const handleCreate = async () => {
    try {
      setSaving(true);
      await api.post("/vehicle", {
        plate: newForm.plate,
        model: newForm.model,
        total_volume: Number(newForm.total_volume),
        status_id: newForm.status_id,
      });
      const list = await api.get("/vehicle");
      const vehicleList: Vehicle[] = Array.isArray(list.data)
        ? list.data
        : list.data.data ?? [];
      setVehicles(vehicleList);
      setFiltered(vehicleList);
      setCreating(false);
      setNewForm(EMPTY_FORM);
    } catch {
      alert("Erro ao cadastrar veículo.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <GenericPanelLayout panel="veiculo">
      <div className="w-full max-w-5xl mx-auto space-y-6">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#384A6C] tracking-tight flex items-center gap-2">
              <LuTruck size={22} /> Veículos
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {filtered.length} veículo{filtered.length !== 1 ? "s" : ""} encontrado
              {filtered.length !== 1 ? "s" : ""}
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

        {/* ── Lista ── */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <svg className="animate-spin h-6 w-6 text-[#94C0E0]" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <p className="text-sm text-gray-400">Carregando veículos...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-2 text-gray-400">
              <LuTruck size={32} className="opacity-30" />
              <p className="text-sm font-medium">Nenhum veículo encontrado.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-50">
              {filtered.map((v) => (
                <li
                  key={v.id}
                  className="flex items-center justify-between px-6 py-4 hover:bg-[#EEF5FB]/60 transition-colors"
                >
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
                          Volume:{" "}
                          <span className="font-semibold text-gray-600">
                            {v.available_volume} / {v.total_volume} m³
                          </span>
                        </span>
                        <span className="inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full border bg-[#384A6C]/10 text-[#384A6C] border-[#384A6C]/20">
                          {v.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-4">
                    <button
                      onClick={() => handleOpenEdit(v)}
                      className="p-2 rounded-xl text-[#384A6C] hover:bg-[#384A6C]/10 transition"
                      title="Editar"
                    >
                      <LuPencil size={16} />
                    </button>
                    <button
                      onClick={() => setDeleteTarget({ id: v.id, plate: v.plate })}
                      className="p-2 rounded-xl text-red-400 hover:bg-red-50 transition"
                      title="Excluir"
                    >
                      <LuTrash2 size={16} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* ── Modal Edição ── */}
      {editingVehicle && (
        <VehicleModal
          title={`Editar — ${editingVehicle.plate}`}
          form={editForm}
          statuses={statuses}
          onChange={setEditForm}
          onConfirm={handleSave}
          onClose={() => setEditingVehicle(null)}
          confirmLabel="Salvar alterações"
          loading={saving}
        />
      )}

      {/* ── Modal Criação ── */}
      {creating && (
        <VehicleModal
          title="Novo Veículo"
          form={newForm}
          statuses={statuses}
          onChange={setNewForm}
          onConfirm={handleCreate}
          onClose={() => { setCreating(false); setNewForm(EMPTY_FORM); }}
          confirmLabel="Cadastrar"
          loading={saving}
        />
      )}

      {/* ── Modal Exclusão ── */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 flex flex-col items-center text-center gap-4">
            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
              <LuTrash2 size={24} className="text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-gray-800">Excluir veículo?</h3>
              <p className="text-sm text-gray-400 mt-1">
                <span className="font-semibold text-gray-600">{deleteTarget.plate}</span> será
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