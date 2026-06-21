import { useState } from "react";
import { GenericPanelLayout } from "../../../components/Layout/company/layoutOption";
import { 
  LuSearch, 
  LuPackage, 
  LuClipboardList, 
  LuUser, 
  LuTruck,
  LuHash
} from "react-icons/lu";
import { useOrders } from "../../../hooks/useOrder";
import { StatusBadge } from "../../../components/order/statusBadge";
import OrderTrackingModal from "../../../components/Modal/OrderTrackingModal";
import type { Order } from "../../../types/order";

export default function OrderManager() {
  const {
    orders,
    loading,
    search,
    handleSearch,
    refreshOrders,
  } = useOrders();

  const [trackingTarget, setTrackingTarget] = useState<Order | null>(null);

  return (
    <GenericPanelLayout panel="pedido">
      <div className="w-full max-w-5xl mx-auto space-y-6">
        
        {/* ── Cabeçalho (Estilo Company) ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#384A6C] tracking-tight">
              Gestão de Pedidos
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Visualização de entregas e status do sistema
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Busca Padronizada */}
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm">
              <LuSearch size={15} className="text-gray-400 shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Buscar pedido ou destinatário..."
                className="outline-none text-sm text-gray-700 placeholder-gray-300 w-64"
              />
            </div>
          </div>
        </div>

        {/* ── Lista de Pedidos (Estilo Card) ── */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="animate-spin h-6 w-6 border-2 border-[#94C0E0] border-t-transparent rounded-full" />
              <p className="text-sm text-gray-400">Carregando listagem...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-2 text-gray-400">
              <LuClipboardList size={32} className="opacity-30" />
              <p className="text-sm font-medium">Nenhum pedido encontrado.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-50">
              {orders.map((order) => (
                <li
                  key={order.id}
                  onClick={() => setTrackingTarget(order)}
                  className="flex items-center justify-between px-6 py-5 hover:bg-[#EEF5FB]/40 active:bg-[#EEF5FB]/70 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    {/* Ícone Lateral */}
                    <div className="w-11 h-11 rounded-xl bg-[#384A6C]/10 flex items-center justify-center text-[#384A6C] shrink-0 transition-transform group-hover:scale-110">
                      <LuPackage size={20} />
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-gray-800 text-sm flex items-center gap-1 group-hover:text-[#384A6C] transition-colors">
                          <LuHash size={12} className="text-gray-400" />
                          Pedido: {order.code || order.id}
                        </p>
                        <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded font-bold uppercase">
                          ID {order.id}
                        </span>
                        {order.status && <StatusBadge status={order.status} />}
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-400 mt-1 flex-wrap">
                        <span className="flex items-center gap-1">
                          <LuUser size={12} className="text-gray-400" /> <b>Destinatário:</b> {order.recipient}
                        </span>
                        <span className="flex items-center gap-1">
                          <LuTruck size={12} className={order.vehicle ? "text-gray-400" : "text-amber-500"} /> 
                          <b>Veículo:</b> {order.vehicle?.plate || order.vehicle_id || (
                            <span className="text-amber-500 font-semibold">Sem veículo</span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Seta indicativa de click */}
                  <div className="text-gray-300 group-hover:text-[#384A6C] group-hover:translate-x-1 transition-all">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

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