import { useEffect, useState } from "react";
import { api } from "../../../api/lib/api";
import { GenericPanelLayout } from "../../../components/Layout/company/layoutOption";
import {
  LuSearch,
  LuTruck,
  LuGauge,
  LuX,
  LuPackage,
  LuCircleCheck,
} from "react-icons/lu";

// ─── Types ────────────────────────────────────────────────────────────────────

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
  total_volume: number;
  available_volume: number;
  status: string;
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

function volumePercent(v: Vehicle) {
  if (v.total_volume <= 0) return 0;
  return Math.min(
    100,
    Math.round(((v.total_volume - v.available_volume) / v.total_volume) * 100)
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────

type ModalProps = {
  order: Order;
  vehicles: Vehicle[];
  onConfirm: (vehicleId: number) => Promise<void>;
  onClose: () => void;
  saving: boolean;
};

function AllocateModal({ order, vehicles, onConfirm, onClose, saving }: ModalProps) {
  const [selected, setSelected] = useState<number | null>(null);

  const available = vehicles.filter((v) => v.available_volume > 0);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-7 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-extrabold text-[#384A6C] tracking-tight">
              Alocar Veículo
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Pedido{" "}
              <span className="font-semibold text-gray-600">#{order.code || order.id}</span>{" "}
              — {order.recipient}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition p-1 rounded-lg hover:bg-gray-100"
          >
            <LuX size={20} />
          </button>
        </div>

        {/* Lista de veículos */}
        <div className="overflow-y-auto px-6 py-4 space-y-3 flex-1">
          {available.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2 text-gray-400">
              <LuTruck size={32} className="opacity-30" />
              <p className="text-sm font-medium">Nenhum veículo com espaço disponível.</p>
            </div>
          ) : (
            available.map((v) => {
              const used = volumePercent(v);
              const isSelected = selected === v.id;

              return (
                <button
                  key={v.id}
                  onClick={() => setSelected(v.id)}
                  className={`w-full text-left px-4 py-4 rounded-2xl border-2 transition-all flex items-center gap-4
                    ${isSelected
                      ? "border-[#384A6C] bg-[#EEF5FB]"
                      : "border-gray-100 hover:border-[#94C0E0] hover:bg-[#EEF5FB]/40"
                    }`}
                >
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-[#384A6C]/10 flex items-center justify-center text-[#384A6C] text-xs font-bold shrink-0">
                    {getInitials(v.model)}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-800 text-sm">{v.plate}</p>
                      <span className="text-gray-400 text-xs">—</span>
                      <p className="text-sm text-gray-500 truncate">{v.model}</p>
                    </div>

                    <div className="flex items-center gap-2 mt-1.5">
                      <LuGauge size={11} className="text-gray-400 shrink-0" />
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            used >= 90
                              ? "bg-red-400"
                              : used >= 60
                              ? "bg-yellow-400"
                              : "bg-green-400"
                          }`}
                          style={{ width: `${used}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-400 whitespace-nowrap">
                        {v.available_volume} / {v.total_volume} m³ livre
                      </span>
                    </div>
                  </div>

                  {/* Check */}
                  {isSelected && (
                    <LuCircleCheck size={20} className="text-[#384A6C] shrink-0" />
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-8 py-5 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition"
          >
            Cancelar
          </button>
          <button
            disabled={!selected || saving}
            onClick={() => selected && onConfirm(selected)}
            className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-[#384A6C] hover:bg-[#2f3e5c]
              active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {saving ? "Alocando..." : "Confirmar alocação"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function AllocateVehicleManager() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filtered, setFiltered] = useState<Order[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

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
      const withoutVehicle: Order[] = (
        Array.isArray(ordersRes.data) ? ordersRes.data : ordersRes.data.data ?? []
      ).filter((o: Order) => !o.vehicle);

      const vehicleList: Vehicle[] = Array.isArray(vehiclesRes.data)
        ? vehiclesRes.data
        : vehiclesRes.data.data ?? [];

      setOrders(withoutVehicle);
      setFiltered(withoutVehicle);
      setVehicles(vehicleList);
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleSearch = (value: string) => {
    setSearch(value);
    const lower = value.toLowerCase();
    setFiltered(
      orders.filter(
        (o) =>
          o.code.toLowerCase().includes(lower) ||
          o.recipient.toLowerCase().includes(lower) ||
          o.status.toLowerCase().includes(lower)
      )
    );
  };

  const handleAllocate = async (vehicleId: number) => {
    if (!selectedOrder) return;
    try {
      setSaving(true);
      await api.patch(`/order/${selectedOrder.id}/vehicle`, { vehicle_id: vehicleId });
      setSelectedOrder(null);
      await loadData(); // Recarrega — pedido some da lista pois agora tem veículo
    } catch (err: any) {
      alert(err.response?.data?.message || "Erro ao alocar veículo.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <GenericPanelLayout panel="pedido">
      <div className="w-full max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#384A6C] tracking-tight flex items-center gap-2">
              <LuTruck size={22} /> Alocar Veículos
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {filtered.length} pedido{filtered.length !== 1 ? "s" : ""} sem veículo
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm">
            <LuSearch size={15} className="text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Buscar por código, destinatário ou status..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="outline-none text-sm text-gray-700 placeholder-gray-300 w-60"
            />
          </div>
        </div>

        {/* Lista */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <svg className="animate-spin h-6 w-6 text-[#94C0E0]" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <p className="text-sm text-gray-400">Carregando pedidos...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-2 text-gray-400">
              <LuPackage size={32} className="opacity-30" />
              <p className="text-sm font-medium">Nenhum pedido pendente de veículo.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-50">
              {filtered.map((order) => (
                <li
                  key={order.id}
                  className="flex items-center justify-between px-6 py-4 hover:bg-[#EEF5FB]/60 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#384A6C]/10 flex items-center justify-center text-[#384A6C] text-xs font-bold shrink-0">
                      #{order.id}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">
                        Pedido {order.code || `#${order.id}`}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Destinatário:{" "}
                        <span className="text-gray-600 font-medium">{order.recipient}</span>
                      </p>
                      <span className="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full bg-[#384A6C]/10 text-[#384A6C] mt-1">
                        {order.status}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white bg-[#384A6C]
                      hover:bg-[#2f3e5c] active:scale-95 transition-all shadow-sm"
                  >
                    <LuTruck size={15} /> Alocar veículo
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Modal */}
      {selectedOrder && (
        <AllocateModal
          order={selectedOrder}
          vehicles={vehicles}
          onConfirm={handleAllocate}
          onClose={() => setSelectedOrder(null)}
          saving={saving}
        />
      )}
    </GenericPanelLayout>
  );
}