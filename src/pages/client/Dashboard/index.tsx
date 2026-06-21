import { useEffect, useState } from "react";
import { api } from "../../../api/lib/api";
import { LuBox, LuClock, LuCircleCheck } from "react-icons/lu";

type Order = {
  id: number;
  status: string;
};

export default function ClientDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const res = await api.get("/order");
        setOrders(res.data);
      } catch (err) {
        // Silently catch or handle
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const transitCount = orders.filter((o) => {
    const s = o.status?.toLowerCase() ?? "";
    return s.includes("trânsito") || s.includes("transito") || s.includes("processo") || s.includes("saiu");
  }).length;

  const deliveredCount = orders.filter((o) => {
    const s = o.status?.toLowerCase() ?? "";
    return s.includes("entregue");
  }).length;

  const pendingCount = orders.filter((o) => {
    const s = o.status?.toLowerCase() ?? "";
    return s.includes("pendente") || s.includes("aguardando") || s.includes("recolha");
  }).length;

  // Format numbers to 2 digits (e.g. 04, 12, 01)
  const formatNumber = (num: number) => String(num).padStart(2, "0");

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 text-gray-800">
      <div>
        <h1 className="text-2xl font-extrabold text-[#384A6C] tracking-tight">Meus Pedidos</h1>
        <p className="text-sm text-gray-400 mt-0.5">Acompanhe as suas entregas em tempo real</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <div className="animate-spin h-6 w-6 border-2 border-[#94C0E0] border-t-transparent rounded-full" />
          <p className="text-sm text-gray-400">Carregando painel...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card: A caminho */}
          <div className="bg-[#384A6C] p-6 rounded-3xl shadow-lg text-white space-y-4">
            <LuBox size={30} className="text-[#94C0E0]" />
            <div>
              <p className="text-3xl font-black">{formatNumber(transitCount)}</p>
              <p className="text-sm opacity-80">Encomendas a caminho</p>
            </div>
          </div>

          {/* Card: Concluídas */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <LuCircleCheck size={30} className="text-emerald-500" />
            <div>
              <p className="text-3xl font-black text-[#384A6C]">{formatNumber(deliveredCount)}</p>
              <p className="text-sm text-gray-400">Entregas concluídas</p>
            </div>
          </div>

          {/* Card: Aguardando */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <LuClock size={30} className="text-orange-500" />
            <div>
              <p className="text-3xl font-black text-[#384A6C]">{formatNumber(pendingCount)}</p>
              <p className="text-sm text-gray-400">Aguardando recolha</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}