import { useState } from "react";
import { LuSearch, LuTrash2, LuPackage, LuHash, LuBoxes } from "react-icons/lu";
import { GenericPanelLayout } from "../../../components/Layout/company/layoutOption";
import { useProducts } from "../../../hooks/useProduct";
import { DeleteProductModal } from "../../../components/product/deleteProductModal";

export default function ProductManager() {
  const {
    products,
    ordersLookup,
    loading,
    searchTerm,
    handleSearch,
    deleteProduct,
  } = useProducts();

  // Interface State
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string } | null>(null);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteProduct(deleteTarget.id);
      setDeleteTarget(null);
    } catch {
      // Handled in hook
    }
  };

  return (
    <GenericPanelLayout panel="produto">
      <div className="w-full max-w-5xl mx-auto space-y-6">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#384A6C] tracking-tight">Produtos</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {products.length} produto{products.length !== 1 ? "s" : ""} encontrado{products.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm">
            <LuSearch size={15} className="text-gray-400 shrink-0" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Buscar por nome ou código do pedido..."
              className="outline-none text-sm text-gray-700 placeholder-gray-300 w-64"
            />
          </div>
        </div>

        {/* ── Lista ── */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <svg className="animate-spin h-6 w-6 text-[#94C0E0]" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <p className="text-sm text-gray-400">Carregando produtos...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-2 text-gray-400">
              <LuPackage size={32} className="opacity-30" />
              <p className="text-sm font-medium">
                {searchTerm ? "Nenhum produto encontrado para a busca." : "Nenhum produto cadastrado."}
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-50">
              {products.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between px-6 py-4 hover:bg-[#EEF5FB]/60 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#384A6C]/10 flex items-center justify-center text-[#384A6C] shrink-0">
                      <LuPackage size={18} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{p.name}</p>
                      {p.description && (
                        <p className="text-xs text-gray-400 mt-0.5">{p.description}</p>
                      )}
                      <div className="flex items-center gap-3 text-xs text-gray-400 mt-1 flex-wrap">
                        <span className="flex items-center gap-1">
                          <LuBoxes size={11} />
                          Qtd:{" "}
                          <span className="font-semibold text-gray-600">{p.quantity}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <LuHash size={11} />
                          Pedido:{" "}
                          <span className="font-semibold text-gray-600">
                            {ordersLookup[p.order_id] ?? "N/A"}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setDeleteTarget({ id: p.id, name: p.name })}
                    className="p-2 rounded-xl text-red-400 hover:bg-red-50 transition shrink-0 ml-4"
                    title="Excluir produto"
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
      {deleteTarget && (
        <DeleteProductModal
          name={deleteTarget.name}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </GenericPanelLayout>
  );
}