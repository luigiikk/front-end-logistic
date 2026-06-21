import { useState } from "react";
import { GenericPanelLayout } from "../../../components/Layout/company/layoutOption";
import {
  LuSearch,
  LuTrash2,
  LuShoppingBag,
  LuHash,
  LuBoxes,
} from "react-icons/lu";
import { usePurchaseItems } from "../../../hooks/usePurchaseItem";
import { DeletePurchaseItemModal } from "../../../components/purchase-item/deletePurchaseItemModal";

export default function PurchaseOrderItemManager() {
  const {
    items,
    loading,
    searchTerm,
    handleSearch,
    deleteItem,
  } = usePurchaseItems();

  // Interface State
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string } | null>(null);

  // Totais
  const totalGeral = items.reduce(
    (acc, i) => acc + Number(i.unit_price) * Number(i.quantity),
    0
  );

  return (
    <GenericPanelLayout panel="item_compra">
      <div className="w-full max-w-5xl mx-auto space-y-6">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#384A6C] tracking-tight flex items-center gap-2">
              <LuShoppingBag size={22} /> Itens de Compra
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {items.length} item{items.length !== 1 ? "s" : ""} encontrado{items.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm">
            <LuSearch size={15} className="text-gray-400 shrink-0" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Buscar por recurso ou ID do pedido..."
              className="outline-none text-sm text-gray-700 placeholder-gray-300 w-56"
            />
          </div>
        </div>

        {/* ── Tabela ── */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <svg className="animate-spin h-6 w-6 text-[#94C0E0]" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <p className="text-sm text-gray-400">Carregando itens...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-2 text-gray-400">
              <LuBoxes size={32} className="opacity-30" />
              <p className="text-sm font-medium">Nenhum item encontrado.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-100 bg-[#EEF5FB]">
                      {["Produto / Recurso", "Pedido", "Qtd", "Preço Unit.", "Total", ""].map(
                        (h) => (
                          <th
                            key={h}
                            className="py-3 px-6 text-[10px] font-bold text-[#384A6C] uppercase tracking-widest whitespace-nowrap last:text-right"
                          >
                            {h}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {items.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-[#EEF5FB]/60 transition-colors"
                      >
                        {/* Recurso */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#384A6C]/10 flex items-center justify-center text-[#384A6C] shrink-0">
                              <LuShoppingBag size={14} />
                            </div>
                            <span className="font-semibold text-sm text-gray-800">
                              {item.resource?.name ?? `Recurso #${item.resource_id}`}
                            </span>
                          </div>
                        </td>

                        {/* Pedido */}
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#384A6C] bg-[#384A6C]/10 px-2.5 py-1 rounded-full">
                            <LuHash size={10} />
                            {item.purchase_order_id}
                          </span>
                        </td>

                        {/* Qtd */}
                        <td className="py-4 px-6">
                          <span className="text-sm font-bold text-gray-700">{item.quantity}</span>
                        </td>

                        {/* Preço unit */}
                        <td className="py-4 px-6">
                          <span className="text-sm text-gray-600">
                            R$ {Number(item.unit_price).toFixed(2)}
                          </span>
                        </td>

                        {/* Total */}
                        <td className="py-4 px-6">
                          <span className="text-sm font-bold text-[#384A6C]">
                            R$ {(Number(item.unit_price) * Number(item.quantity)).toFixed(2)}
                          </span>
                        </td>

                        {/* Ações */}
                        <td className="py-4 px-6">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() =>
                                setDeleteTarget({
                                  id: item.id,
                                  name: item.resource?.name ?? `Recurso #${item.resource_id}`,
                                })
                              }
                              className="p-2 rounded-xl text-red-400 hover:bg-red-50 transition"
                              title="Excluir"
                            >
                              <LuTrash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Rodapé com total geral */}
              <div className="flex justify-end items-center gap-2 px-6 py-4 border-t border-gray-100 bg-[#EEF5FB]/50">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Total geral:
                </span>
                <span className="text-base font-extrabold text-[#384A6C]">
                  R$ {totalGeral.toFixed(2)}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modais */}
      {deleteTarget && (
        <DeletePurchaseItemModal
          name={deleteTarget.name}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={async () => {
            await deleteItem(deleteTarget.id);
            setDeleteTarget(null);
          }}
        />
      )}
    </GenericPanelLayout>
  );
}