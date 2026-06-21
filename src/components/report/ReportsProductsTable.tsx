import { LuSearch } from "react-icons/lu";
import type { ReportProduct } from "../../types/report";

type ReportsProductsTableProps = {
  productSearch: string;
  setProductSearch: (value: string) => void;
  filteredProducts: ReportProduct[];
};

export function ReportsProductsTable({
  productSearch,
  setProductSearch,
  filteredProducts,
}: ReportsProductsTableProps) {
  return (
    <div className="space-y-4">
      {/* Table Search */}
      <div className="flex flex-col sm:flex-row gap-3 print:hidden">
        <div className="flex-1 flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm">
          <LuSearch size={15} className="text-gray-400 shrink-0" />
          <input
            type="text"
            value={productSearch}
            onChange={(e) => setProductSearch(e.target.value)}
            placeholder="Filtrar por nome do produto ou código do pedido..."
            className="outline-none text-sm text-gray-700 placeholder-gray-300 w-full"
          />
        </div>
      </div>

      {/* Products Report Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Nome do Produto</th>
                <th className="px-6 py-4">Descrição</th>
                <th className="px-6 py-4 text-center">Quantidade Solicitada</th>
                <th className="px-6 py-4">Código do Pedido</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-gray-700">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-400">
                    Nenhum produto localizado com os filtros selecionados.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const orderCode = p.order_code;
                  const qty = p.quantity || 0;

                  return (
                    <tr key={p.id} className="hover:bg-[#EEF5FB]/40 transition-colors">
                      <td className="px-6 py-4 font-bold text-gray-400">{p.id}</td>
                      <td className="px-6 py-4 font-semibold text-gray-800">{p.name}</td>
                      <td className="px-6 py-4 text-xs text-gray-500 max-w-[200px] truncate" title={p.description || ""}>
                        {p.description || "—"}
                      </td>
                      <td className="px-6 py-4 font-bold text-center text-gray-800">{qty}</td>
                      <td className="px-6 py-4 font-semibold text-gray-500">
                        {orderCode ? (
                          <span className="text-[#384A6C]">{orderCode}</span>
                        ) : (
                          <span className="text-gray-400 italic">Não vinculado</span>
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
