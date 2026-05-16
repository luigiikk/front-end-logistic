/* ProductManager.tsx */
import { useEffect, useState, useMemo, useCallback } from "react";
import { api } from "../../../api/lib/api";
import { LuSearch, LuTrash2 } from "react-icons/lu";
import { GenericPanelLayout } from "../../../components/Layout/company/layoutOption";
import { useToast } from "../../../components/Toast/ToastContent";

type Product = {
  id: number;
  name: string;
  description: string;
  quantity: number;
  order_id: number;
};

// Tipo apenas para a resposta da API de pedidos, para evitar 'any'
type OrderSummary = {
  id: number;
  code: string;
};

export default function ProductManager() {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [ordersLookup, setOrdersLookup] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // 1. Carregamento Unificado e Paralelo
  useEffect(() => {
    async function loadInitialData() {
      try {
        setLoading(true);
        
        // Dispara as duas requisições ao mesmo tempo
        const [productsRes, ordersRes] = await Promise.all([
          api.get("/product"),
          api.get("/order")
        ]);

        // Processa o Lookup de Pedidos imediatamente
        const lookupMap = ordersRes.data.reduce((acc: Record<number, string>, order: OrderSummary) => {
          acc[order.id] = order.code;
          return acc;
        }, {});

        setProducts(productsRes.data);
        setOrdersLookup(lookupMap);

      } catch (err) {
        toast("Erro ao carregar dados", "error");
      } finally {
        setLoading(false);
      }
    }

    loadInitialData();
  }, []);

  // 2. Filtragem Otimizada (Memoizada)
  // Só recalcula se produtos, busca ou o lookup mudarem
  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products;

    const lowerTerm = searchTerm.toLowerCase();

    return products.filter((p) => {
      const orderCode = ordersLookup[p.order_id] || "";
      return (
        p.name.toLowerCase().includes(lowerTerm) ||
        orderCode.toLowerCase().includes(lowerTerm)
      );
    });
  }, [products, searchTerm, ordersLookup]);

  // 3. Delete Otimizado
  const handleDeleteProduct = useCallback(async (productId: number) => {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;

    try {
      await api.delete(`/product/${productId}`);
      // Atualiza o estado local removendo o item, sem precisar recarregar tudo da API
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      toast("Produto excluído com sucesso!", "success");
    } catch (err: any) {
      toast("Erro ao excluir produto", "error");
    }
  }, []);

  return (
    <GenericPanelLayout panel="produto">
      <div className="bg-white max-w-5xl w-full rounded-3xl shadow-xl p-10 min-h-[600px]">
        <h1 className="text-3xl text-center mb-8">Produtos</h1>

        {/* Barra de busca */}
        <div className="flex justify-start mb-6">
          <div className="flex items-center gap-2 border border-black rounded-lg px-4 py-2 w-80 focus-within:ring-1 ring-black">
            <LuSearch className="text-gray-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nome ou código..."
              className="outline-none w-full"
            />
          </div>
        </div>

        {/* Lista de produtos */}
        <div className="border-t border-black">
          {loading ? (
            <div className="text-center py-8 text-gray-500 animate-pulse">Carregando dados...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? "Nenhum produto encontrado para a busca." : "Nenhum produto cadastrado."}
            </div>
          ) : (
            filteredProducts.map((p) => (
              <div
                key={p.id}
                className="flex justify-between border-b border-black py-4 items-center px-4 hover:bg-gray-50 transition-colors"
              >
                <div>
                  <p className="font-semibold text-lg">{p.name}</p>
                  <p className="text-sm text-gray-600">{p.description}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    <span className="bg-gray-200 px-2 py-0.5 rounded text-xs mr-2">
                      Qtd: {p.quantity}
                    </span>
                    <span className="text-xs">
                      Pedido: <b>{ordersLookup[p.order_id] ?? "N/A"}</b>
                    </span>
                  </p>
                </div>
                
                <button
                  onClick={() => handleDeleteProduct(p.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition-all"
                  title="Excluir Produto"
                >
                  <LuTrash2 size={20} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </GenericPanelLayout>
  );
}