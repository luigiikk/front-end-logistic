import { useState } from "react";
import { GenericPanelLayout } from "../../../components/Layout/company/layoutOption";
import {
  LuSearch,
  LuTruck,
  LuPackage,
} from "react-icons/lu";
import { useAllocateVehicle } from "../../../hooks/useAllocateVehicle";
import { type Order } from "../../../types/allocateVehicle";
import { AllocateModal } from "../../../components/allocate-vehicle/allocateModal";

export default function AllocateVehicleManager() {
  const {
    orders,
    vehicles,
    loading,
    saving,
    search,
    handleSearch,
    allocateVehicle,
  } = useAllocateVehicle();

  // Interface State
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleAllocate = async (vehicleId: number) => {
    if (!selectedOrder) return;
    try {
      await allocateVehicle(selectedOrder.id, vehicleId);
      setSelectedOrder(null);
    } catch {
      // Errors are handled in the hook
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
              {orders.length} pedido{orders.length !== 1 ? "s" : ""} sem veículo
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
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-2 text-gray-400">
              <LuPackage size={32} className="opacity-30" />
              <p className="text-sm font-medium">Nenhum pedido pendente de veículo.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-50">
              {orders.map((order) => (
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