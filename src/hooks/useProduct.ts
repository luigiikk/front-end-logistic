import { useState, useEffect } from "react";
import { api } from "../api/lib/api";
import { useToast } from "../components/Toast/ToastContent";
import type { Product, OrderSummary } from "../types/product";

export function useProducts() {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [ordersLookup, setOrdersLookup] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const [productsRes, ordersRes] = await Promise.all([
        api.get("/product"),
        api.get("/order"),
      ]);

      const lookupMap = (ordersRes.data || []).reduce(
        (acc: Record<number, string>, order: OrderSummary) => {
          acc[order.id] = order.code;
          return acc;
        },
        {}
      );

      const prodList = Array.isArray(productsRes.data) ? productsRes.data : productsRes.data.data ?? [];
      setProducts(prodList);
      setFiltered(prodList);
      setOrdersLookup(lookupMap);
    } catch (err: any) {
      toast("Erro ao carregar produtos.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const lower = value.toLowerCase();
    setFiltered(
      products.filter((p) => {
        const orderCode = ordersLookup[p.order_id] ?? "";
        return (
          p.name.toLowerCase().includes(lower) ||
          orderCode.toLowerCase().includes(lower)
        );
      })
    );
  };

  const deleteProduct = async (id: number) => {
    try {
      await api.delete(`/product/${id}`);
      const next = products.filter((p) => p.id !== id);
      setProducts(next);
      setFiltered(
        next.filter((p) => {
          const orderCode = ordersLookup[p.order_id] ?? "";
          const lower = searchTerm.toLowerCase();
          return (
            p.name.toLowerCase().includes(lower) ||
            orderCode.toLowerCase().includes(lower)
          );
        })
      );
      toast("Produto excluído com sucesso!", "success");
    } catch (err: any) {
      const msg = err.response?.data?.message || "Erro ao excluir produto.";
      toast(msg, "error");
      throw err;
    }
  };

  return {
    products: filtered,
    ordersLookup,
    loading,
    searchTerm,
    handleSearch,
    deleteProduct,
  };
}
