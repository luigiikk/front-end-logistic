import { useState, useEffect } from "react";
import { api } from "../api/lib/api";
import { useToast } from "../components/Toast/ToastContent";
import type { InventoryItem, GroupedResource } from "../types/inventory";

export function useInventory() {
  const { toast } = useToast();
  const [inventory, setInventory] = useState<GroupedResource[]>([]);
  const [filtered, setFiltered] = useState<GroupedResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  const loadInventory = async () => {
    try {
      setLoading(true);
      const res = await api.get("/inventory");
      const data: InventoryItem[] = Array.isArray(res.data) ? res.data : res.data.data ?? [];

      const map = new Map<number, GroupedResource>();
      for (const item of data) {
        const rid = item.resource.id;
        if (!map.has(rid)) {
          map.set(rid, {
            resource_id: rid,
            resource_name: item.resource.name ?? "—",
            category_name: item.resource.category?.name ?? "Sem categoria",
            total_quantity: 0,
            warehouses: [],
          });
        }
        const group = map.get(rid)!;
        group.total_quantity += item.quantity ?? 0;
        group.warehouses.push({
          warehouse_id: item.warehouse?.id ?? 0,
          warehouse_name: item.warehouse?.name ?? "—",
          quantity: item.quantity ?? 0,
        });
      }

      const grouped = Array.from(map.values());
      setInventory(grouped);
      setFiltered(grouped);
    } catch (err) {
      toast("Erro ao carregar inventário.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const lower = value.toLowerCase();
    setFiltered(
      inventory.filter((r) =>
        r.resource_name.toLowerCase().includes(lower) ||
        r.category_name.toLowerCase().includes(lower)
      )
    );
  };

  const toggleExpand = (id: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return {
    inventory: filtered,
    loading,
    searchTerm,
    handleSearch,
    expanded,
    toggleExpand,
    reload: loadInventory,
  };
}
