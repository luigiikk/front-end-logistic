import { LuSearch, LuFilter, LuTruck } from "react-icons/lu";
import type { ReportOrder } from "../../types/report";

type ReportsOrdersTableProps = {
  orderSearch: string;
  setOrderSearch: (value: string) => void;
  orderStatusFilter: string;
  setOrderStatusFilter: (value: string) => void;
  filteredOrders: ReportOrder[];
};

export function ReportsOrdersTable({
  orderSearch,
  setOrderSearch,
  orderStatusFilter,
  setOrderStatusFilter,
  filteredOrders,
}: ReportsOrdersTableProps) {
  return (
    <div className="space-y-4">
      {/* Table Search & Status Filters */}
      <div className="flex flex-col sm:flex-row gap-3 print:hidden">
        <div className="flex-1 flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm">
          <LuSearch size={15} className="text-gray-400 shrink-0" />
          <input
            type="text"
            value={orderSearch}
            onChange={(e) => setOrderSearch(e.target.value)}
            placeholder="Filtrar por código ou destinatário..."
            className="outline-none text-sm text-gray-700 placeholder-gray-300 w-full"
          />
        </div>

        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm min-w-[200px]">
          <LuFilter size={14} className="text-gray-400" />
          <select
            value={orderStatusFilter}
            onChange={(e) => setOrderStatusFilter(e.target.value)}
            className="outline-none bg-transparent text-xs text-gray-600 font-bold w-full cursor-pointer"
          >
            <option value="all">Filtro: Todos</option>
            <option value="pending_vehicle">Filtro: Pendente de Veículo</option>
            <option value="in_process">Filtro: Em Processo</option>
            <option value="transit">Filtro: Em Trânsito</option>
            <option value="delivered">Filtro: Entregue</option>
            <option value="others">Filtro: Outros</option>
          </select>
        </div>
      </div>

      {/* Orders Report Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Código</th>
                <th className="px-6 py-4">Destinatário</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4">Veículo Alocado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-gray-700">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-400">
                    Nenhum pedido localizado com os filtros selecionados.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const lower = order.status?.name?.toLowerCase() ?? "";
                  const isDelivered = lower.includes("entregue");
                  const isProcess = lower.includes("processo");
                  const isTransit = lower.includes("trânsito") || lower.includes("transito") || lower.includes("saiu");

                  const badgeCls = isDelivered
                    ? "bg-green-50 text-green-700 border-green-200"
                    : isProcess
                    ? "bg-purple-50 text-purple-700 border-purple-200"
                    : isTransit
                    ? "bg-blue-50 text-blue-700 border-blue-200"
                    : "bg-gray-100 text-gray-600 border-gray-200";

                  return (
                    <tr key={order.id} className="hover:bg-[#EEF5FB]/40 transition-colors">
                      <td className="px-6 py-4 font-bold text-gray-400">{order.id}</td>
                      <td className="px-6 py-4 font-bold text-[#384A6C]">{order.code || "—"}</td>
                      <td className="px-6 py-4">{order.recipient?.name || "—"}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full border ${badgeCls}`}>
                          {order.status?.name || "Pendente"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {order.vehicle ? (
                          <span className="flex items-center gap-1 text-xs font-medium text-gray-700">
                            <LuTruck size={12} className="text-gray-400" />
                            {order.vehicle.plate}
                          </span>
                        ) : (
                          <span className="text-xs text-red-500 font-bold bg-red-50 px-2 py-0.5 rounded-lg border border-red-200">
                            Pendente de Veículo
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
