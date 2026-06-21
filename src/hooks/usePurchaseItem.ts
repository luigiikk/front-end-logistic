import { useState, useEffect } from "react";
import { api } from "../api/lib/api";
import { useToast } from "../components/Toast/ToastContent";
import type { PurchaseOrderItem } from "../types/purchaseItem";

export function usePurchaseItems() {
  const { toast } = useToast();
  const [items, setItems] = useState<PurchaseOrderItem[]>([]);
  const [filtered, setFiltered] = useState<PurchaseOrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/purchase-order-items");
      const data = Array.isArray(res.data) ? res.data : res.data.data ?? [];
      setItems(data);
      setFiltered(data);
    } catch (err: any) {
      toast("Erro ao carregar itens de compra.", "error");
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
      items.filter(
        (i) =>
          (i.resource?.name && i.resource.name.toLowerCase().includes(lower)) ||
          String(i.purchase_order_id).includes(value)
      )
    );
  };

  const deleteItem = async (id: number) => {
    try {
      await api.delete(`/purchase-order-items/${id}`);
      const next = items.filter((i) => i.id !== id);
      setItems(next);
      setFiltered(
        next.filter(
          (i) =>
            (i.resource?.name && i.resource.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            String(i.purchase_order_id).includes(searchTerm)
        )
      );
      toast("Item de compra excluído com sucesso!", "success");
    } catch (err: any) {
      toast("Erro ao excluir item de compra.", "error");
    }
  };

  return {
    items: filtered,
    loading,
    searchTerm,
    handleSearch,
    deleteItem,
  };
}
