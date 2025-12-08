import { useEffect, useState } from "react";
import { api } from "../../../api/lib/api";
import { GenericPanelLayout } from "../../../components/Layout/company/layoutOption";
import { LuSearch } from "react-icons/lu";

type Vehicle = {
  id: number;
  plate: string;
  model: string;
  capacity: number;
  status: string;
};

export default function VehicleManager() {
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
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadVehicles();
  }, []);

  const handleSearch = (value: string) => {
    setSearchTerm(value);

    if (!value) {
      setFiltered(vehicles);
      return;
    }

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
      <div className="bg-white max-w-5xl w-full rounded-3xl shadow-xl p-10 min-h-[600px]">
        <h1 className="text-3xl text-center mb-8">Veículos</h1>

        <div className="flex justify-between mb-6">
          <div className="flex items-center gap-2 border border-black rounded-lg px-4 py-2 w-80">
            <LuSearch />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Buscar por placa, modelo ou status..."
              className="outline-none w-full"
            />
          </div>
        </div>

        <div className="border-t border-black">
          {loading ? (
            <p className="text-center py-4 text-gray-500">Carregando...</p>
          ) : filtered.length === 0 ? (
            <p className="text-center py-4 text-gray-500">
              Nenhum veículo encontrado
            </p>
          ) : (
            filtered.map((vehicle) => (
              <div
                key={vehicle.id}
                className="flex justify-between border-b border-black py-4 px-4 hover:bg-gray-50"
              >
                <div>
                  <p className="font-bold">Placa: {vehicle.plate}</p>
                  <p className="text-gray-600">
                    <b>Modelo:</b> {vehicle.model}
                  </p>
                  <p className="text-gray-500 text-sm">
                    <b>Capacidade:</b> {vehicle.capacity} —{" "}
                    <b>Status:</b> {vehicle.status}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </GenericPanelLayout>
  );
}
