import { useState, useEffect } from "react";
import { api } from "../api/lib/api";
import { useToast } from "../components/Toast/ToastContent";
import type { Supplier, SupplierForm } from "../types/supplier";

export function useSuppliers() {
  const { toast } = useToast();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [filtered, setFiltered] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const loadSuppliers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/supplier");
      const data: Supplier[] = Array.isArray(res.data) ? res.data : res.data.data ?? [];
      setSuppliers(data);
      setFiltered(data);
    } catch (err: any) {
      toast("Erro ao carregar fornecedores.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSuppliers();
  }, []);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const lower = value.toLowerCase();
    setFiltered(
      suppliers.filter(
        (s) =>
          s.name.toLowerCase().includes(lower) ||
          s.CNPJ.includes(value) ||
          s.email.toLowerCase().includes(lower)
      )
    );
  };

  const createSupplier = async (form: SupplierForm) => {
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        CNPJ: form.CNPJ,
        contactPerson: form.contactPerson || null,
        notes: form.notes || null,
        street: form.street || null,
        number: form.number ? Number(form.number) : null,
        complement: form.complement || null,
        city: form.city || null,
        state: form.state || null,
        country: form.country || null,
        zipcode: form.zipcode || null,
      };
      await api.post("/supplier", payload);
      toast("Fornecedor criado com sucesso!", "success");
      await loadSuppliers();
    } catch (err: any) {
      toast("Erro ao cadastrar fornecedor.", "error");
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const updateSupplier = async (id: number, form: SupplierForm) => {
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        CNPJ: form.CNPJ,
        contactPerson: form.contactPerson || null,
        notes: form.notes || null,
        street: form.street || null,
        number: form.number ? Number(form.number) : null,
        complement: form.complement || null,
        city: form.city || null,
        state: form.state || null,
        country: form.country || null,
        zipcode: form.zipcode || null,
      };
      await api.put(`/supplier/${id}`, payload);
      toast("Fornecedor atualizado com sucesso!", "success");
      await loadSuppliers();
    } catch (err: any) {
      toast("Erro ao atualizar fornecedor.", "error");
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const deleteSupplier = async (id: number) => {
    try {
      await api.delete(`/supplier/${id}`);
      setSuppliers((prev) => prev.filter((s) => s.id !== id));
      setFiltered((prev) => prev.filter((s) => s.id !== id));
      toast("Fornecedor excluído com sucesso!", "success");
    } catch (err: any) {
      toast("Erro ao excluir fornecedor.", "error");
    }
  };

  return {
    suppliers: filtered,
    loading,
    saving,
    searchTerm,
    handleSearch,
    createSupplier,
    updateSupplier,
    deleteSupplier,
  };
}
