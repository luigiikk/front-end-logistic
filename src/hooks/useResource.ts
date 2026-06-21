import { useState, useEffect } from "react";
import { api } from "../api/lib/api";
import { useToast } from "../components/Toast/ToastContent";
import type { Resource, Category, ResourceForm } from "../types/resource";

export function useResources() {
  const { toast } = useToast();
  const [resources, setResources] = useState<Resource[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filtered, setFiltered] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | "">("");

  const loadData = async () => {
    try {
      setLoading(true);
      const [resourcesRes, categoriesRes] = await Promise.all([
        api.get("/resource"),
        api.get("/category-resource"),
      ]);
      const data: Resource[] = Array.isArray(resourcesRes.data) ? resourcesRes.data : resourcesRes.data.data ?? [];
      setResources(data);
      setFiltered(data);
      const catData: Category[] = Array.isArray(categoriesRes.data)
        ? categoriesRes.data
        : categoriesRes.data.data ?? [];
      setCategories(catData);
    } catch (err) {
      toast("Erro ao carregar recursos.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSearch = (value: string, categoryId: number | "" = selectedCategory) => {
    setSearchTerm(value);
    const lower = value.toLowerCase();
    setFiltered(
      resources.filter((r) => {
        const matchesText = r.name.toLowerCase().includes(lower) || String(r.id).includes(value);
        const matchesCategory = categoryId === "" || r.category_id === categoryId;
        return matchesText && matchesCategory;
      })
    );
  };

  const handleCategoryFilter = (categoryId: number | "") => {
    setSelectedCategory(categoryId);
    handleSearch(searchTerm, categoryId);
  };

  const createResource = async (form: ResourceForm) => {
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        description: form.description,
        category_id: Number(form.category_id),
        width: form.width ? Number(form.width) : null,
        height: form.height ? Number(form.height) : null,
        length: form.length ? Number(form.length) : null,
      };
      await api.post("/resource", payload);
      toast("Recurso criado!", "success");
      await loadData();
    } catch (err: any) {
      const msg = err.response?.data?.message || "Erro ao criar recurso.";
      toast(msg, "error");
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const updateResource = async (id: number, form: ResourceForm) => {
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        description: form.description,
        category_id: Number(form.category_id),
        width: form.width ? Number(form.width) : null,
        height: form.height ? Number(form.height) : null,
        length: form.length ? Number(form.length) : null,
      };
      await api.put(`/resource/${id}`, payload);
      toast("Recurso atualizado!", "success");
      await loadData();
    } catch (err: any) {
      const msg = err.response?.data?.message || "Erro ao atualizar recurso.";
      toast(msg, "error");
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const deleteResource = async (id: number) => {
    try {
      await api.delete(`/resource/${id}`);
      setResources((prev) => prev.filter((r) => r.id !== id));
      setFiltered((prev) => prev.filter((r) => r.id !== id));
      toast("Recurso excluído.", "success");
    } catch (err) {
      toast("Erro ao excluir. O recurso pode estar vinculado a um pedido.", "error");
    }
  };

  return {
    resources: filtered,
    categories,
    loading,
    saving,
    searchTerm,
    selectedCategory,
    handleSearch,
    handleCategoryFilter,
    createResource,
    updateResource,
    deleteResource,
  };
}
