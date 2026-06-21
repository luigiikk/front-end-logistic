import { GenericPanelLayout } from "../../../components/Layout/company/layoutOption";
import {
  LuSearch,
  LuTruck,
  LuHash,
  LuPackage,
  LuCircleCheck,
  LuCircleAlert,
} from "react-icons/lu";
import { useVehicles } from "../../../hooks/useVehicle";

export default function VehicleManager() {
  const {
    vehicles,
    loading,
    search,
    handleSearch,
  } = useVehicles();

  return (
    <GenericPanelLayout panel="veiculo">
      <div className="w-full max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#384A6C] tracking-tight flex items-center gap-2">
              <LuTruck size={24} className="text-[#384A6C]" /> Veículos da Frota
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Acompanhamento de status e capacidade de carga em tempo real
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm">
            <LuSearch size={15} className="text-gray-400 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Buscar por placa, modelo ou status..."
              className="outline-none text-sm text-gray-700 placeholder-gray-300 w-64"
            />
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-20 gap-3">
            <div className="animate-spin h-6 w-6 border-2 border-[#94C0E0] border-t-transparent rounded-full" />
            <p className="text-sm text-gray-400">Carregando veículos...</p>
          </div>
        ) : vehicles.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-20 gap-2 text-gray-400">
            <LuTruck size={32} className="opacity-30" />
            <p className="text-sm font-medium">Nenhum veículo encontrado.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {vehicles.map((vehicle) => {
              const usedVolume = Number((vehicle.total_volume - vehicle.available_volume).toFixed(2));
              const usedPercentage = Math.max(
                0,
                Math.min(100, Math.round((usedVolume / vehicle.total_volume) * 100))
              );

              const isAtivo = vehicle.status?.toLowerCase().includes("ativo");
              const statusBg = isAtivo
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-amber-50 text-amber-700 border-amber-200";

              return (
                <div
                  key={vehicle.id}
                  className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4"
                >
                  {/* Top info row */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[#384A6C]/10 flex items-center justify-center text-[#384A6C]">
                        <LuTruck size={22} />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800 text-base">{vehicle.model}</h3>
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5">
                          <LuHash size={12} />
                          <span>ID: {vehicle.id}</span>
                        </div>
                      </div>
                    </div>

                    {/* Status badge */}
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${statusBg}`}>
                      {isAtivo ? (
                        <LuCircleCheck size={10} className="shrink-0" />
                      ) : (
                        <LuCircleAlert size={10} className="shrink-0" />
                      )}
                      {vehicle.status}
                    </span>
                  </div>

                  {/* License Plate box styling */}
                  <div className="flex items-center gap-4 py-2 border-y border-gray-50">
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Placa</p>
                      <div className="mt-1 inline-flex flex-col border border-gray-400 rounded bg-white overflow-hidden shadow-xs shrink-0">
                        <div className="bg-blue-600 text-[6px] text-white font-bold text-center py-0.5 px-3 uppercase tracking-widest leading-none">
                          Mercosul
                        </div>
                        <div className="px-3.5 py-0.5 text-sm font-extrabold text-gray-800 tracking-wider font-mono uppercase bg-white">
                          {vehicle.plate}
                        </div>
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-end text-xs mb-1">
                        <span className="text-gray-400 font-semibold flex items-center gap-1">
                          <LuPackage size={12} /> Carga
                        </span>
                        <span className="font-bold text-gray-700">{usedPercentage}% Utilizado</span>
                      </div>
                      
                      {/* Utilization progress bar */}
                      <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            usedPercentage > 85
                              ? "bg-red-500"
                              : usedPercentage > 50
                              ? "bg-amber-500"
                              : "bg-blue-500"
                          }`}
                          style={{ width: `${usedPercentage}%` }}
                        />
                      </div>

                      <div className="flex justify-between text-[10px] text-gray-400 mt-1 font-semibold">
                        <span>{usedVolume} m³ ocupado</span>
                        <span>{vehicle.available_volume} m³ livre</span>
                      </div>
                    </div>
                  </div>

                  {/* Details row */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div>
                      Capacidade total: <span className="font-bold text-gray-700">{vehicle.total_volume} m³</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </GenericPanelLayout>
  );
}