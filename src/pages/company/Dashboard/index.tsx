import { useEffect, useState } from "react";
import { api } from "../../../api/lib/api";
import { GenericPanelLayout } from "../../../components/Layout/company/layoutOption";
import { LuBox, LuTruck, LuClock } from "react-icons/lu";

type Order = {
  id: number;
  status: { name: string } | string;
};

type Vehicle = {
  id: number;
  status?: { name: string } | string;
};

export default function CompanyDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [ordersRes, vehiclesRes] = await Promise.all([
          api.get("/order").catch(() => ({ data: [] })),
          api.get("/vehicle").catch(() => ({ data: [] })),
        ]);

        setOrders(Array.isArray(ordersRes.data) ? ordersRes.data : ordersRes.data.data ?? []);
        setVehicles(Array.isArray(vehiclesRes.data) ? vehiclesRes.data : vehiclesRes.data.data ?? []);
      } catch (err) {
        // Silently catch
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  // Orders in route (em rota / em trânsito)
  const transitOrdersCount = orders.filter((o) => {
    const statusName = typeof o.status === "object" && o.status ? o.status.name : (typeof o.status === "string" ? o.status : "");
    const s = statusName.toLowerCase();
    return s.includes("trânsito") || s.includes("transito") || s.includes("saiu");
  }).length;

  // Pending orders
  const pendingOrdersCount = orders.filter((o) => {
    const statusName = typeof o.status === "object" && o.status ? o.status.name : (typeof o.status === "string" ? o.status : "");
    const s = statusName.toLowerCase();
    return s.includes("pendente") || s.includes("processo") || s.includes("aguardando");
  }).length;

  // Active vehicles count
  const activeVehiclesCount = vehicles.filter((v) => {
    const statusName = typeof v.status === "object" && v.status ? v.status.name : (typeof v.status === "string" ? v.status : "");
    const s = statusName.toLowerCase();
    return s.includes("ativo") || s.includes("disponível") || s.includes("disponivel");
  }).length;

  const formatNumber = (num: number) => String(num).padStart(2, "0");

  return (
    <GenericPanelLayout panel="empresa" hideBackButton={true}>
      <div className="w-full max-w-5xl mx-auto space-y-8 text-gray-800">
        <div>
          <h1 className="text-2xl font-extrabold text-[#384A6C] tracking-tight">Painel Operacional</h1>
          <p className="text-sm text-gray-400 mt-0.5">Visão geral do status das suas operações</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <div className="animate-spin h-6 w-6 border-2 border-[#94C0E0] border-t-transparent rounded-full" />
            <p className="text-sm text-gray-400">Carregando informações...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card: Pedidos em Rota */}
            <div className="bg-[#384A6C] p-6 rounded-3xl shadow-lg text-white space-y-4">
              <LuBox size={30} className="text-[#94C0E0]" />
              <div>
                <p className="text-3xl font-black">{formatNumber(transitOrdersCount)}</p>
                <p className="text-sm opacity-80">Pedidos em Rota / Em Trânsito</p>
              </div>
            </div>

            {/* Card: Pedidos Pendentes */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <LuClock size={30} className="text-orange-500" />
              <div>
                <p className="text-3xl font-black text-[#384A6C]">{formatNumber(pendingOrdersCount)}</p>
                <p className="text-sm text-gray-400">Pedidos Pendentes</p>
              </div>
            </div>

            {/* Card: Veículos Ativos */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <LuTruck size={30} className="text-emerald-500" />
              <div>
                <p className="text-3xl font-black text-[#384A6C]">{formatNumber(activeVehiclesCount)}</p>
                <p className="text-sm text-gray-400">Veículos Ativos</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </GenericPanelLayout>
  );
}
