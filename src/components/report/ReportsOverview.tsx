import {
  LuBox,
  LuPackage,
  LuTruck,
  LuCircleCheck,
  LuCircleAlert,
  LuTrendingUp,
} from "react-icons/lu";
import type { ReportProduct } from "../../types/report";

type ReportsOverviewProps = {
  totalOrders: number;
  pendingVehicleOrders: number;
  inProcessOrders: number;
  transitOrders: number;
  deliveredOrders: number;
  completedOrOtherOrders: number;
  totalProducts: number;
  totalQuantity: number;
  avgProductsPerOrder: string;
  topProducts: ReportProduct[];
  maxProductQty: number;
};

export function ReportsOverview({
  totalOrders,
  pendingVehicleOrders,
  inProcessOrders,
  transitOrders,
  deliveredOrders,
  completedOrOtherOrders,
  totalProducts,
  totalQuantity,
  avgProductsPerOrder,
  topProducts,
  maxProductQty,
}: ReportsOverviewProps) {
  return (
    <div className="space-y-6">
      {/* ── Summary Stats Grid (Responsive 6-column Grid) ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Card 1: Pedidos Totais */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[110px] group hover:border-[#94C0E0]/50 transition-all duration-300">
          <div className="flex justify-between items-start w-full">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Total
            </p>
            <div className="w-7 h-7 rounded-lg bg-[#384A6C]/10 flex items-center justify-center text-[#384A6C] shrink-0">
              <LuBox size={14} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-[#384A6C] leading-none mb-1">
              {totalOrders}
            </h3>
            <p className="text-[9px] text-gray-400">Pedidos</p>
          </div>
        </div>

        {/* Card 2: Pendente de Veículo */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[110px] group hover:border-red-200 transition-all duration-300">
          <div className="flex justify-between items-start w-full">
            <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider">
              Pend. Veíc.
            </p>
            <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center text-red-500 shrink-0">
              <LuCircleAlert size={14} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-red-600 leading-none mb-1">
              {pendingVehicleOrders}
            </h3>
            <p className="text-[9px] text-red-500 font-semibold">
              {totalOrders > 0 ? `${((pendingVehicleOrders / totalOrders) * 100).toFixed(0)}%` : "0%"} sem frota
            </p>
          </div>
        </div>

        {/* Card 3: Em Processo */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[110px] group hover:border-purple-200 transition-all duration-300">
          <div className="flex justify-between items-start w-full">
            <p className="text-[10px] font-bold text-purple-500 uppercase tracking-wider">
              Processo
            </p>
            <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
              <LuTrendingUp size={14} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-purple-600 leading-none mb-1">
              {inProcessOrders}
            </h3>
            <p className="text-[9px] text-purple-500 font-semibold">
              {totalOrders > 0 ? `${((inProcessOrders / totalOrders) * 100).toFixed(0)}%` : "0%"} preparação
            </p>
          </div>
        </div>

        {/* Card 4: Em Trânsito */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[110px] group hover:border-blue-200 transition-all duration-300">
          <div className="flex justify-between items-start w-full">
            <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">
              Trânsito
            </p>
            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
              <LuTruck size={14} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-blue-600 leading-none mb-1">
              {transitOrders}
            </h3>
            <p className="text-[9px] text-blue-500 font-semibold">
              {totalOrders > 0 ? `${((transitOrders / totalOrders) * 100).toFixed(0)}%` : "0%"} em rota
            </p>
          </div>
        </div>

        {/* Card 5: Entregue */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[110px] group hover:border-green-200 transition-all duration-300">
          <div className="flex justify-between items-start w-full">
            <p className="text-[10px] font-bold text-green-500 uppercase tracking-wider">
              Entregue
            </p>
            <div className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center text-green-600 shrink-0">
              <LuCircleCheck size={14} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-green-600 leading-none mb-1">
              {deliveredOrders}
            </h3>
            <p className="text-[9px] text-green-500 font-semibold">
              {totalOrders > 0 ? `${((deliveredOrders / totalOrders) * 100).toFixed(0)}%` : "0%"} concluído
            </p>
          </div>
        </div>

        {/* Card 6: Total de Itens */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[110px] group hover:border-amber-200 transition-all duration-300">
          <div className="flex justify-between items-start w-full">
            <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">
              Total Itens
            </p>
            <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
              <LuPackage size={14} />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-amber-600 leading-none mb-1">
              {totalQuantity}
            </h3>
            <p className="text-[9px] text-gray-400">Qtd. total enviada</p>
          </div>
        </div>
      </div>

      {/* ── Charts & Visual representations section ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Status Distribution Visual Widget */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-bold text-[#384A6C] tracking-tight">
              Distribuição do Fluxo Operacional
            </h4>
            <span className="text-xs font-semibold text-gray-400 bg-gray-50 px-2.5 py-1 rounded-lg">
              Gráfico Stacked
            </span>
          </div>

          <div className="space-y-6">
            {/* Custom Percentage Stacked Progress Bar */}
            <div className="h-7 w-full bg-gray-100 rounded-full overflow-hidden flex">
              {totalOrders > 0 ? (
                <>
                  <div
                    style={{ width: `${(pendingVehicleOrders / totalOrders) * 100}%` }}
                    className="bg-red-500 h-full transition-all hover:opacity-90 cursor-help"
                    title={`Pendente de Veículo: ${pendingVehicleOrders}`}
                  />
                  <div
                    style={{ width: `${(inProcessOrders / totalOrders) * 100}%` }}
                    className="bg-purple-500 h-full transition-all hover:opacity-90 cursor-help"
                    title={`Em Processo: ${inProcessOrders}`}
                  />
                  <div
                    style={{ width: `${(transitOrders / totalOrders) * 100}%` }}
                    className="bg-blue-500 h-full transition-all hover:opacity-90 cursor-help"
                    title={`Em Trânsito: ${transitOrders}`}
                  />
                  <div
                    style={{ width: `${(deliveredOrders / totalOrders) * 100}%` }}
                    className="bg-green-500 h-full transition-all hover:opacity-90 cursor-help"
                    title={`Entregue: ${deliveredOrders}`}
                  />
                  <div
                    style={{ width: `${(completedOrOtherOrders / totalOrders) * 100}%` }}
                    className="bg-gray-300 h-full transition-all hover:opacity-90 cursor-help"
                    title={`Outros: ${completedOrOtherOrders}`}
                  />
                </>
              ) : (
                <div className="w-full bg-gray-200 h-full text-center text-[10px] text-gray-400 leading-7">
                  Nenhum pedido registrado no intervalo selecionado
                </div>
              )}
            </div>

            {/* Legend Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-xs">
              <div className="flex items-start gap-2">
                <span className="w-3 h-3 rounded bg-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-700">Pendente Veíc.</p>
                  <p className="text-[10px] text-gray-400">
                    {pendingVehicleOrders} ({totalOrders > 0 ? ((pendingVehicleOrders / totalOrders) * 100).toFixed(0) : 0}%)
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-3 h-3 rounded bg-purple-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-700">Em Processo</p>
                  <p className="text-[10px] text-gray-400">
                    {inProcessOrders} ({totalOrders > 0 ? ((inProcessOrders / totalOrders) * 100).toFixed(0) : 0}%)
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-3 h-3 rounded bg-blue-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-700">Em Trânsito</p>
                  <p className="text-[10px] text-gray-400">
                    {transitOrders} ({totalOrders > 0 ? ((transitOrders / totalOrders) * 100).toFixed(0) : 0}%)
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-3 h-3 rounded bg-green-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-700">Entregues</p>
                  <p className="text-[10px] text-gray-400">
                    {deliveredOrders} ({totalOrders > 0 ? ((deliveredOrders / totalOrders) * 100).toFixed(0) : 0}%)
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-3 h-3 rounded bg-gray-300 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-700">Outros</p>
                  <p className="text-[10px] text-gray-400">
                    {completedOrOtherOrders} ({totalOrders > 0 ? ((completedOrOtherOrders / totalOrders) * 100).toFixed(0) : 0}%)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Products Widget */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-bold text-[#384A6C] tracking-tight">
              Itens mais Pedidos
            </h4>
            <span className="text-xs font-semibold text-amber-500 bg-amber-50 px-2.5 py-1 rounded-lg">
              Qtd por Produto
            </span>
          </div>

          <div className="space-y-4">
            {topProducts.length === 0 ? (
              <div className="text-center py-8 text-sm text-gray-400 italic">
                Nenhum produto movimentado neste filtro.
              </div>
            ) : (
              topProducts.map((p) => {
                const percent = Math.min(100, Math.round(((p.quantity || 0) / maxProductQty) * 100));
                return (
                  <div key={p.id} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium text-gray-700">
                      <span className="truncate max-w-[150px]" title={p.name}>
                        {p.name}
                      </span>
                      <span className="font-bold text-gray-900">{p.quantity} unid.</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${percent}%` }}
                        className="h-full bg-amber-500 rounded-full transition-all"
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Operational summary description card */}
      <div className="bg-gradient-to-r from-[#384A6C] to-[#4c628e] text-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h4 className="text-lg font-bold flex items-center gap-2">
            <LuTrendingUp size={20} />
            Resumo Operacional Temporizado
          </h4>
          <p className="text-sm text-white/80 max-w-xl">
            Com base no filtro temporal ativo, temos <span className="font-semibold text-white">{totalProducts}</span> produto(s) distinto(s) vinculados a <span className="font-semibold text-white">{totalOrders}</span> pedido(s) despachado(s). A média volumétrica e de itens por pedido computa-se em <span className="font-semibold text-white">{avgProductsPerOrder} unidades</span>.
          </p>
        </div>
        <div className="flex gap-4 shrink-0">
          <div className="bg-white/10 px-4 py-3 rounded-2xl text-center">
            <span className="block text-2xl font-black">{avgProductsPerOrder}</span>
            <span className="text-[9px] text-white/60 uppercase font-bold tracking-wider">Itens / Pedido</span>
          </div>
          <div className="bg-white/10 px-4 py-3 rounded-2xl text-center">
            <span className="block text-2xl font-black">{totalQuantity}</span>
            <span className="text-[9px] text-white/60 uppercase font-bold tracking-wider">Itens Totais</span>
          </div>
        </div>
      </div>
    </div>
  );
}
