import { useEffect, useState } from "react";
import { api } from "../../../api/lib/api";
import { GenericPanelLayout } from "../../../components/Layout/company/layoutOption";
import {
  LuTruck,
  LuPackage,
  LuSearch,
  LuCircleCheck,
  LuCircleAlert, // 👈
  LuChevronRight,
} from "react-icons/lu";

type Order = {
  id: number;
  code: string;
  recipient: string;
  status: string;
  vehicle: { plate: string } | null;
};

type Vehicle = {
  id: number;
  plate: string;
  model: string;
  available_volume: number;
  total_volume: number;
  status: string;
};

export default function AllocateVehicle() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | "">("");
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const [ordersRes, vehiclesRes] = await Promise.all([
        api.get("/order"),
        api.get("/vehicle"),
      ]);
      // Apenas pedidos sem veículo
      setOrders(ordersRes.data.filter((o: Order) => !o.vehicle));
      setVehicles(vehiclesRes.data);
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
    } finally {
      setLoading(false);
    }
  }

  const filtered = orders.filter(
    (o) =>
      o.code?.toLowerCase().includes(search.toLowerCase()) ||
      o.recipient?.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenModal = (order: Order) => {
    setSelectedOrder(order);
    setSelectedVehicleId("");
    setIsModalOpen(true);
  };

  const handleAllocate = async () => {
    if (!selectedOrder || !selectedVehicleId) return;

    setSaving(true);
    try {
      await api.patch(`/order/${selectedOrder.id}/vehicle`, {
        vehicle_id: Number(selectedVehicleId),
      });
      alert("Veículo alocado com sucesso!");
      setIsModalOpen(false);
      setSelectedOrder(null);
      setSelectedVehicleId("");
      await loadData();
    } catch (err: any) {
      alert(err.response?.data?.message || "Erro ao alocar veículo.");
    } finally {
      setSaving(false);
    }
  };

  const volumePercent = (v: Vehicle) => {
    if (!v.total_volume) return 0;
    const used = v.total_volume - v.available_volume;
    return Math.min(100, Math.max(0, Math.round((used / v.total_volume) * 100)));
  };

  return (
    <GenericPanelLayout panel="alocar_veiculo">
      <div className="bg-white max-w-5xl w-full rounded-3xl shadow-xl p-10 min-h-[600px]">
        <h1 className="text-3xl text-center mb-2 font-bold text-gray-800">
          Alocar Veículo
        </h1>
        <p className="text-center text-gray-500 text-sm mb-8">
          Pedidos sem veículo atribuído
        </p>

        {/* Busca */}
        <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 mb-6 w-full max-w-sm">
          <LuSearch className="text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar pedido ou destinatário..."
            className="outline-none text-sm w-full"
          />
        </div>

        {/* Lista */}
        <div className="border rounded-xl overflow-hidden">
          {loading ? (
            <p className="text-center py-10 text-gray-400">Carregando...</p>
          ) : filtered.length === 0 ? (
            <p className="text-center py-10 text-gray-400">
              Nenhum pedido sem veículo.
            </p>
          ) : (
            filtered.map((order) => (
              <div
                key={order.id}
                className="flex justify-between items-center px-6 py-4 border-b last:border-b-0 hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-yellow-100 text-yellow-700 p-2 rounded-full">
                    <LuPackage size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      Pedido #{order.code || order.id}
                    </p>
                    <p className="text-sm text-gray-500">
                      Destinatário: {order.recipient}
                    </p>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full mt-1 inline-block">
                      {order.status}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenModal(order)}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm font-medium"
                >
                  <LuTruck size={16} /> Alocar
                  <LuChevronRight size={14} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* MODAL */}
        {isModalOpen && selectedOrder && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-gray-50 px-6 py-4 border-b">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <LuTruck className="text-green-600" />
                  Alocar veículo — Pedido #{selectedOrder.code || selectedOrder.id}
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  Destinatário: {selectedOrder.recipient}
                </p>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4">
                {vehicles.length === 0 ? (
                  <p className="text-center text-gray-400 py-4">
                    Nenhum veículo disponível.
                  </p>
                ) : (
                  <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                    {vehicles.map((v) => {
                      const used = volumePercent(v);
                      const isFull = v.available_volume <= 0;
                      const isSelected = selectedVehicleId === v.id;

                      return (
                        <button
                          key={v.id}
                          disabled={isFull}
                          onClick={() => setSelectedVehicleId(v.id)}
                          className={`w-full text-left p-4 rounded-xl border-2 transition ${
                            isSelected
                              ? "border-green-500 bg-green-50"
                              : isFull
                                ? "border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed"
                                : "border-gray-200 hover:border-green-300 hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-2">
                              <LuTruck
                                className={
                                  isSelected
                                    ? "text-green-600"
                                    : "text-gray-500"
                                }
                              />
                              <span className="font-semibold text-gray-800">
                                {v.plate}
                              </span>
                              <span className="text-sm text-gray-500">
                                — {v.model}
                              </span>
                            </div>
                            {isSelected && (
                              <LuCircleCheck
                                className="text-green-500"
                                size={18}
                              />
                            )}
                            {isFull && (
                              <LuCircleAlert
                                className="text-red-400"
                                size={18}
                              /> // 👈
                            )}
                          </div>

                          {/* Barra de volume */}
                          <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mb-1">
                            <div
                              className={`h-full rounded-full transition-all ${
                                used >= 90
                                  ? "bg-red-500"
                                  : used >= 60
                                    ? "bg-yellow-400"
                                    : "bg-green-500"
                              }`}
                              style={{ width: used > 0 ? `${used}%` : "100%" }}
                            />
                          </div>
                          <p className="text-xs text-gray-400">
                            {isFull
                              ? "Cheio"
                              : `${v.available_volume} m³ disponível de ${v.total_volume} m³`}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-6 py-4 border-t flex justify-end gap-3">
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setSelectedOrder(null);
                    setSelectedVehicleId("");
                  }}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAllocate}
                  disabled={!selectedVehicleId || saving}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <LuTruck size={16} />
                  {saving ? "Alocando..." : "Confirmar Alocação"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </GenericPanelLayout>
  );
}