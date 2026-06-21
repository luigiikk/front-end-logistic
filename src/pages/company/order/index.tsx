import { useState } from "react";
import { GenericPanelLayout } from "../../../components/Layout/company/layoutOption";
import {
  LuSearch,
  LuTrash2,
  LuPlus,
  LuBox,
  LuUser,
  LuTruck,
  LuHash,
  LuPackage,
} from "react-icons/lu";
import { useOrders } from "../../../hooks/useOrder";
import { type Order, type OrderForm, EMPTY_FORM } from "../../../types/order";
import { StatusBadge } from "../../../components/order/statusBadge";
import { OrderModal } from "../../../components/order/orderModal";
import { DeleteOrderModal } from "../../../components/order/deleteOrderModal";
import OrderTrackingModal from "../../../components/Modal/OrderTrackingModal";

export default function OrderManager() {
  const {
    orders,
    vehicles,
    loading,
    saving,
    search,
    handleSearch,
    createOrder,
    deleteOrder,
    refreshOrders,
  } = useOrders();

  // Interface State
  const [creating, setCreating] = useState(false);
  const [newOrder, setNewOrder] = useState<OrderForm>(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; code: string } | null>(null);
  const [trackingTarget, setTrackingTarget] = useState<Order | null>(null);

  const handleCreate = async () => {
    try {
      await createOrder(newOrder);
      setCreating(false);
      setNewOrder(EMPTY_FORM);
    } catch {
      // Handled in hook
    }
  };

  return (
    <GenericPanelLayout panel="pedido">
      <div className="w-full max-w-5xl mx-auto space-y-6">
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#384A6C] tracking-tight">
              Pedidos
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {orders.length} pedido{orders.length !== 1 ? "s" : ""}{" "}
              encontrado{orders.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm">
              <LuSearch size={15} className="text-gray-400 shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Buscar por código ou destinatário..."
                className="outline-none text-sm text-gray-700 placeholder-gray-300 w-56"
              />
            </div>
            <button
              onClick={() => setCreating(true)}
              className="flex items-center gap-2 bg-[#384A6C] text-white px-4 py-2.5 rounded-xl text-sm font-bold
                hover:bg-[#2f3e5c] active:scale-95 transition-all shadow-sm"
            >
              <LuPlus size={16} /> Novo pedido
            </button>
          </div>
        </div>

        {/* ── Lista ── */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <svg
                className="animate-spin h-6 w-6 text-[#94C0E0]"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
              <p className="text-sm text-gray-400">Carregando pedidos...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-2 text-gray-400">
              <LuPackage size={32} className="opacity-30" />
              <p className="text-sm font-medium">
                {search
                  ? "Nenhum pedido encontrado para a busca."
                  : "Nenhum pedido cadastrado."}
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-50">
              {orders.map((order) => (
                <li
                  key={order.id}
                  onClick={() => setTrackingTarget(order)}
                  className="flex items-center justify-between px-6 py-4 hover:bg-[#EEF5FB]/60 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#384A6C]/10 flex items-center justify-center text-[#384A6C] shrink-0">
                      <LuBox size={18} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-gray-800 text-sm flex items-center gap-1">
                          <LuHash size={12} className="text-gray-400" />
                          {order.code || order.id}
                        </p>
                        {order.status && <StatusBadge status={order.status} />}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5 flex-wrap">
                        {order.recipient && (
                          <span className="flex items-center gap-1">
                            <LuUser size={11} /> {order.recipient}
                          </span>
                        )}
                        {order.vehicle ? (
                          <span className="flex items-center gap-1">
                            <LuTruck size={11} /> {order.vehicle.plate}
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-amber-500 font-semibold">
                            <LuTruck size={11} /> Sem veículo
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteTarget({
                        id: order.id,
                        code: order.code || String(order.id),
                      });
                    }}
                    className="p-2 rounded-xl text-red-400 hover:bg-red-50 transition shrink-0 ml-4"
                    title="Excluir pedido"
                  >
                    <LuTrash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Modais */}
      {creating && (
        <OrderModal
          form={newOrder}
          vehicles={vehicles}
          onChange={setNewOrder}
          onConfirm={handleCreate}
          onClose={() => {
            setCreating(false);
            setNewOrder(EMPTY_FORM);
          }}
          loading={saving}
        />
      )}

      {deleteTarget && (
        <DeleteOrderModal
          code={deleteTarget.code}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={async () => {
            await deleteOrder(deleteTarget.id);
            setDeleteTarget(null);
          }}
        />
      )}

      {trackingTarget && (
        <OrderTrackingModal
          orderId={trackingTarget.id}
          orderCode={trackingTarget.code}
          orderStatus={trackingTarget.status}
          orderRecipient={trackingTarget.recipient}
          onClose={() => setTrackingTarget(null)}
          onTrackingUpdated={refreshOrders}
        />
      )}
    </GenericPanelLayout>
  );
}