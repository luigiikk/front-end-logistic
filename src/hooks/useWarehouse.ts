import { useState, useEffect, useRef, useCallback } from "react";
import { api } from "../api/lib/api";
import { useToast } from "../components/Toast/ToastContent";
import type { Warehouse, WarehouseForm } from "../types/warehouse";

export function useWarehouses() {
  const { toast } = useToast();
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [filtered, setFiltered] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const loadWarehouses = async (currentSearch = searchTerm) => {
    setLoading(true);
    try {
      const res = await api.get("/warehouses");
      const data: Warehouse[] = Array.isArray(res.data) ? res.data : res.data.data ?? [];
      setWarehouses(data);

      const lower = currentSearch.toLowerCase();
      setFiltered(
        currentSearch
          ? data.filter(
              (w) =>
                w.name.toLowerCase().includes(lower) ||
                String(w.id).includes(currentSearch)
            )
          : data
      );
    } catch (err: any) {
      toast(`${err}`, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWarehouses();
  }, []);

  const handleSearch = useCallback(
    (value: string) => {
      setSearchTerm(value);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        const lower = value.toLowerCase();
        setFiltered(
          warehouses.filter(
            (w) =>
              w.name.toLowerCase().includes(lower) ||
              String(w.id).includes(value)
          )
        );
      }, 200);
    },
    [warehouses]
  );

  const createWarehouse = async (form: WarehouseForm) => {
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        street: form.street,
        number: Number(form.number),
        complement: form.complement || "",
        city: form.city,
        state: form.state,
        country: form.country,
        zipcode: form.zipcode,
        total_volume: form.total_volume !== "" ? Number(form.total_volume) : null,
      };
      await api.post("/warehouses", payload);
      await loadWarehouses(searchTerm);
      toast("Armazém criado com sucesso!", "success");
    } catch (err: any) {
      toast(`${err}`, "error");
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const updateWarehouse = async (id: number, form: WarehouseForm) => {
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        street: form.street,
        number: Number(form.number),
        complement: form.complement || "",
        city: form.city,
        state: form.state,
        country: form.country,
        zipcode: form.zipcode,
        total_volume: form.total_volume !== "" ? Number(form.total_volume) : null,
      };
      await api.put(`/warehouses/${id}`, payload);
      await loadWarehouses(searchTerm);
      toast("Armazém atualizado com sucesso!", "success");
    } catch (err: any) {
      toast(`${err}`, "error");
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const deleteWarehouse = async (id: number) => {
    try {
      await api.delete(`/warehouses/${id}`);
      setWarehouses((prev) => prev.filter((w) => w.id !== id));
      setFiltered((prev) => prev.filter((w) => w.id !== id));
      toast("Armazém excluído com sucesso!", "success");
    } catch (err: any) {
      toast(`${err}`, "error");
    }
  };

  return {
    warehouses: filtered,
    rawWarehouses: warehouses,
    loading,
    saving,
    searchTerm,
    handleSearch,
    createWarehouse,
    updateWarehouse,
    deleteWarehouse,
    reload: loadWarehouses,
  };
}
