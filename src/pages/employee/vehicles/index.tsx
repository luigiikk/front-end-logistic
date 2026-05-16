import { useEffect, useState } from "react";
import { api } from "../../../api/lib/api";
import { GenericPanelLayout } from "../../../components/Layout/company/layoutOption";
import {
  LuSearch,
  LuTruck,
  LuHash,
  LuPackage,
} from "react-icons/lu";
import { useToast } from "../../../components/Toast/ToastContent";

type Vehicle = {
  id: number;
  plate: string;
  model: string;
  capacity: number;
  status: string;
};

export default function VehicleManager() {
  const { toast } = useToast();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filtered, setFiltered] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function loadVehicles() {
      try {
        const res = await api.get("/vehicle");
        setVehicles(res.data);
        setFiltered(res.data);
      } catch (err) {
        toast(`${err}`, "error");
      } finally {
        setLoading(false);
      }
    }
    loadVehicles();
  }, []);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (!value) { setFiltered(vehicles); return; }
    setFiltered(
      vehicles.filter(
        (v) =>
          v.plate.toLowerCase().includes(value.toLowerCase()) ||
          v.model.toLowerCase().includes(value.toLowerCase()) ||
          (v.status ?? "").toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  return (
    <GenericPanelLayout panel="veiculo">
      <div className="w-full max-w-5xl mx-auto space-y-6">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#384A6C] tracking-tight">Veículos</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {filtered.length} veículo{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm">
            <LuSearch size={15} className="text-gray-400 shrink-0" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Buscar por placa, modelo ou status..."
              className="outline-none text-sm text-gray-700 placeholder-gray-300 w-64"
            />
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="animate-spin h-6 w-6 border-2 border-[#94C0E0] border-t-transparent rounded-full" />
              <p className="text-sm text-gray-400">Carregando veículos...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-2 text-gray-400">
              <LuTruck size={32} className="opacity-30" />
              <p className="text-sm font-medium">Nenhum veículo encontrado.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-50">
              {filtered.map((vehicle) => (
                <li
                  key={vehicle.id}
                  className="flex items-center justify-between px-6 py-4 hover:bg-[#EEF5FB]/60 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#384A6C]/10 flex items-center justify-center text-[#384A6C] shrink-0">
                      <LuTruck size={18} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-800 text-sm">{vehicle.model}</p>
                        <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded font-bold uppercase">
                          ID {vehicle.id}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-400 mt-1 flex-wrap">
                        <span className="flex items-center gap-1">
                          <LuHash size={11} /> <b>Placa:</b> {vehicle.plate}
                        </span>
                        <span className="flex items-center gap-1">
                          <LuPackage size={11} /> <b>Capacidade:</b> {vehicle.capacity}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-[#EEF5FB] text-[#384A6C] text-[10px] font-bold uppercase tracking-wider border border-[#94C0E0]/30">
                    {vehicle.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </GenericPanelLayout>
  );
}