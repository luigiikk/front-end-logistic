import { useEffect, useState, useMemo, useCallback } from "react";
import { api } from "../../../api/lib/api";
import { LuSearch, LuTrash2, LuPackage, LuHash, LuBoxes } from "react-icons/lu";
import { GenericPanelLayout } from "../../../components/Layout/company/layoutOption";
import { useToast } from "../../../components/Toast/ToastContent";

// ─── Types ────────────────────────────────────────────────────────────────────

type Product = {
  id: number;
  name: string;
  description: string;
  quantity: number;
  order_id: number;
};

type OrderSummary = {
  id: number;
  code: string;
};

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function ProductManager() {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [ordersLookup, setOrdersLookup] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string } | null>(null);

  useEffect(() => {
    async function loadInitialData() {
      try {
        const [productsRes, ordersRes] = await Promise.all([
          api.get("/product"),
          api.get("/order"),
        ]);
        const lookupMap = ordersRes.data.reduce(
          (acc: Record<number, string>, order: OrderSummary) => {
            acc[order.id] = order.code;
            return acc;
          },
          {}
        );
        setProducts(productsRes.data);
        setOrdersLookup(lookupMap);
      } catch (err) {
        toast(`${err}`, "error");
      } finally {
        setLoading(false);
      }
    }
    loadInitialData();
  }, []);

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products;
    const lower = searchTerm.toLowerCase();
    return products.filter((p) => {
      const orderCode = ordersLookup[p.order_id] ?? "";
      return (
        p.name.toLowerCase().includes(lower) ||
        orderCode.toLowerCase().includes(lower)
      );
    });
  }, [products, searchTerm, ordersLookup]);

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/product/${deleteTarget.id}`);
      setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    } catch (err: any) {
      toast(`${err.response?.data?.message}`, "error");
    } finally {
      setDeleteTarget(null);
    }
  }, [deleteTarget]);

  return (
    <GenericPanelLayout panel="produto">
      <div className="w-full max-w-5xl mx-auto space-y-6">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#384A6C] tracking-tight">Produtos</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {filteredProducts.length} produto{filteredProducts.length !== 1 ? "s" : ""} encontrado{filteredProducts.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm">
            <LuSearch size={15} className="text-gray-400 shrink-0" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-2 text-gray-400">
              <LuPackage size={32} className="opacity-30" />
              <p className="text-sm font-medium">
                {searchTerm ? "Nenhum produto encontrado para a busca." : "Nenhum produto cadastrado."}
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-50">
              {filteredProducts.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between px-6 py-4 hover:bg-[#EEF5FB]/60 transition-colors"
                >
                  {/* Ícone + info */}
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

                  {/* Ação */}
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

      {/* ── Modal confirmação de exclusão ── */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 flex flex-col items-center text-center gap-4">
            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
              <LuTrash2 size={24} className="text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-gray-800">Excluir produto?</h3>
              <p className="text-sm text-gray-400 mt-1">
                <span className="font-semibold text-gray-600">{deleteTarget.name}</span> será removido permanentemente.
              </p>
            </div>
            <div className="flex gap-3 w-full mt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 active:scale-95 transition-all"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </GenericPanelLayout>
  );
}