import { useEffect, useState } from "react";
import { api } from "../../../api/lib/api";
import { GenericPanelLayout } from "../../../components/Layout/company/layoutOption";
import { LuSearch, LuTrash2, LuPencil, LuPlus } from "react-icons/lu";

type Vehicle = {
  id: number;
  plate: string;
  model: string;
  capacity: number;
  status: string;
};

type Status = {
  id: number;
  name: string;
  description?: string | null;
  entity_type?: string | null;
};

type VehicleForm = {
  plate: string;
  model: string;
  capacity: number;
  status_id: number;
};

export default function VehicleManager() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filtered, setFiltered] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statuses, setStatuses] = useState<Status[]>([]);

  const [editing, setEditing] = useState<Vehicle | null>(null);
  const [creating, setCreating] = useState(false);

  const [editVehicle, setEditVehicle] = useState<VehicleForm>({
    plate: "",
    model: "",
    capacity: 0,
    status_id: 0,
  });

  // Estado de criação
  const [newVehicle, setNewVehicle] = useState<VehicleForm>({
    plate: "",
    model: "",
    capacity: 0,
    status_id: 0,
  });

  // Carregar lista
  useEffect(() => {
    async function loadVehicles() {
      try {
        const res = await api.get("/vehicle");
        setVehicles(res.data);
        setFiltered(res.data);
      } catch (err) {
        console.error("Erro ao carregar veículos", err);
      } finally {
        setLoading(false);
      }
    }
    loadVehicles();
  }, []);

  useEffect(() => {
    async function loadStatus() {
      try {
        const res = await api.get("/status/vehicle");
        setStatuses(res.data);
      } catch (err) {
        console.error("Erro ao carregar status", err);
      }
    }

    loadStatus();
  }, []);

  // Buscar
  const handleSearch = (value: string) => {
    setSearch(value);
    setFiltered(
      vehicles.filter(
        (v) =>
          v.plate.toLowerCase().includes(value.toLowerCase()) ||
          v.model.toLowerCase().includes(value.toLowerCase()) ||
          v.status.toLowerCase().includes(value.toLowerCase()) ||
          String(v.capacity).includes(value)
      )
    );
  };

  // Deletar
  const handleDelete = async (id: number, label: string) => {
    if (!confirm(`Deseja realmente excluir o veículo ${label}?`)) return;
    try {
      await api.delete(`/vehicle/${id}`);
      setVehicles(vehicles.filter((v) => v.id !== id));
      setFiltered(filtered.filter((v) => v.id !== id));
      alert("Veículo deletado com sucesso!");
    } catch {
      alert("Erro ao deletar veículo.");
    }
  };

  // Salvar edição
  const handleSave = async () => {
    if (!editing) return;

    try {
      const payload = {
        plate: editing.plate,
        model: editing.model,
        capacity: Number(editing.capacity),
        status_id: editVehicle.status_id, // usar status_id selecionado
      };

      await api.put(`/vehicle/${editing.id}`, payload);

      // Atualizar lista local
      setVehicles(
        vehicles.map((v) => (v.id === editing.id ? { ...v, ...payload } : v))
      );
      setFiltered(
        filtered.map((v) => (v.id === editing.id ? { ...v, ...payload } : v))
      );

      alert("Veículo atualizado!");
      setEditing(null);
    } catch (err) {
      console.error(err);
      alert("Erro ao atualizar veículo");
    }
  };

  // Criar novo
  const handleCreate = async () => {
    try {
      const payload = {
        plate: newVehicle.plate,
        model: newVehicle.model,
        capacity: Number(newVehicle.capacity),
        status_id: newVehicle.status_id, // usar status_id selecionado
      };

      await api.post("/vehicle", payload);

      const list = await api.get("/vehicle");
      setVehicles(list.data);
      setFiltered(list.data);
      setCreating(false);

      // reset form
      setNewVehicle({
        plate: "",
        model: "",
        capacity: 0,
        status_id: 0,
      });

      alert("Veículo cadastrado com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Erro ao cadastrar veículo.");
    }
  };

  return (
    <GenericPanelLayout panel="veiculo">
      <div className="bg-white max-w-5xl w-full rounded-3xl shadow-xl p-10 min-h-[600px]">
        <h1 className="text-3xl text-center mb-8">Veículos</h1>

        {/* Barra de busca + botão */}
        <div className="flex justify-between mb-6">
          <button
            onClick={() => setCreating(true)}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            <LuPlus /> Cadastrar Veículo
          </button>

          <div className="flex items-center gap-2 border border-black rounded-lg px-4 py-2">
            <LuSearch />
            <input
              type="text"
              placeholder="Buscar veículo..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="outline-none"
            />
          </div>
        </div>

        {/* Lista */}
        <div className="border-t border-black">
          {loading ? (
            <p className="text-center py-4 text-gray-500">Carregando...</p>
          ) : (
            filtered.map((v) => (
              <div
                key={v.id}
                className="flex justify-between border-b border-black py-4 items-center px-4 hover:bg-gray-50"
              >
                <div>
                  <p className="font-semibold text-lg">
                    {v.plate} — {v.model}
                  </p>
                  <p className="text-sm text-gray-600">
                    Capacidade: {v.capacity} • Status: {v.status}
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setEditing(v)}
                    className="text-blue-600 text-2xl hover:text-blue-800"
                  >
                    <LuPencil />
                  </button>

                  <button
                    onClick={() => handleDelete(v.id, v.plate)}
                    className="text-red-600 text-2xl hover:text-red-800"
                  >
                    <LuTrash2 />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* MODAL EDITAR */}
        {editing && (
          <div className="fixed top-0 left-0 w-full h-full bg-black/40 flex justify-center items-center z-[1000]">
            <div className="bg-white w-[450px] p-6 rounded-2xl shadow-xl">
              <h2 className="text-2xl font-semibold mb-4">Editar Veículo</h2>

              {/* Placa */}
              <div className="mb-3">
                <label className="block mb-1">Placa</label>
                <input
                  value={editing.plate}
                  onChange={(e) =>
                    setEditing({ ...editing, plate: e.target.value })
                  }
                  className="border p-2 rounded w-full"
                />
              </div>

              {/* Modelo */}
              <div className="mb-3">
                <label className="block mb-1">Modelo</label>
                <input
                  value={editing.model}
                  onChange={(e) =>
                    setEditing({ ...editing, model: e.target.value })
                  }
                  className="border p-2 rounded w-full"
                />
              </div>

              {/* Capacidade */}
              <div className="mb-3">
                <label className="block mb-1">Capacidade</label>
                <input
                  type="number"
                  value={editing.capacity}
                  onChange={(e) =>
                    setEditing({ ...editing, capacity: Number(e.target.value) })
                  }
                  className="border p-2 rounded w-full"
                />
              </div>

              {/* Status */}
              <div className="mb-3">
                <label className="block mb-1">Status</label>

                <select
                  value={editVehicle.status_id}
                  onChange={(e) =>
                    setEditVehicle({
                      ...editVehicle,
                      status_id: Number(e.target.value),
                    })
                  }
                  className="border p-2 rounded w-full"
                >
                  <option value={0}>Selecione um status...</option>
                  {statuses.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.description ?? s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setEditing(null)}
                  className="text-gray-600 hover:underline"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL CRIAR */}
        {creating && (
          <div className="fixed top-0 left-0 w-full h-full bg-black/40 flex justify-center items-center z-[1000]">
            <div className="bg-white w-[450px] p-6 rounded-2xl shadow-xl">
              <h2 className="text-2xl font-semibold mb-4">Cadastrar Veículo</h2>

              {/* Placa */}
              <div className="mb-3">
                <label className="block mb-1">Placa</label>
                <input
                  value={newVehicle.plate}
                  onChange={(e) =>
                    setNewVehicle({ ...newVehicle, plate: e.target.value })
                  }
                  className="border p-2 rounded w-full"
                />
              </div>

              {/* Modelo */}
              <div className="mb-3">
                <label className="block mb-1">Modelo</label>
                <input
                  value={newVehicle.model}
                  onChange={(e) =>
                    setNewVehicle({ ...newVehicle, model: e.target.value })
                  }
                  className="border p-2 rounded w-full"
                />
              </div>

              {/* Capacidade */}
              <div className="mb-3">
                <label className="block mb-1">Capacidade</label>
                <input
                  type="number"
                  value={newVehicle.capacity || ""}
                  onChange={(e) =>
                    setNewVehicle({
                      ...newVehicle,
                      capacity: Number(e.target.value), // ⚡ converte string para number
                    })
                  }
                  className="border p-2 rounded w-full"
                />
              </div>

              {/* Status */}
              <div className="mb-3">
                <select
                  value={newVehicle.status_id}
                  onChange={(e) =>
                    setNewVehicle({
                      ...newVehicle,
                      status_id: Number(e.target.value),
                    })
                  }
                  className="border p-2 rounded w-full"
                >
                  <option value={0}>Selecione um status...</option>
                  {statuses.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.description ?? s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setCreating(false)}
                  className="text-gray-600 hover:underline"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreate}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Cadastrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </GenericPanelLayout>
  );
}
