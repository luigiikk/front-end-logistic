import { useEffect, useState } from "react";
import { api } from "../../../api/lib/api";
import { GenericPanelLayout } from "../../../components/Layout/company/layoutOption";
import {
  LuSearch,
  LuTrash2,
  LuPlus,
  LuPencil,
  LuX,
  LuPackage,
  LuBoxes,
} from "react-icons/lu";

// ─── Types ────────────────────────────────────────────────────────────────────

type Category = {
  id: number;
  name: string;
};

type Resource = {
  id: number;
  name: string;
  description: string;
  quantity: number;
  category_id: number;
  category?: { name: string };
};

type ResourceForm = {
  name: string;
  description: string;
  quantity: number;
  category_id: number | "";
};

// ─── Constants ────────────────────────────────────────────────────────────────

const initialForm: ResourceForm = {
  name: "",
  description: "",
  quantity: 0,
  category_id: "",
};

// ─── Field ────────────────────────────────────────────────────────────────────

function Field({
  label,
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label className="text-[10px] font-bold text-[#384A6C] uppercase tracking-widest">
        {label}
      </label>
      <input
        {...props}
        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-300 bg-white
          focus:outline-none focus:ring-2 focus:ring-[#94C0E0] focus:border-transparent transition-all"
      />
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function ResourceManager() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filtered, setFiltered] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | "">("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<ResourceForm>(initialForm);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [resourcesRes, categoriesRes] = await Promise.all([
        api.get("/resource"),
        api.get("/category-resource"),
      ]);
      const data: Resource[] = Array.isArray(resourcesRes.data)
        ? resourcesRes.data
        : resourcesRes.data.data ?? [];
      setResources(data);
      setFiltered(data);
      setCategories(categoriesRes.data);
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSearch = (
    value: string,
    categoryId: number | "" = selectedCategory
  ) => {
    setSearchTerm(value);
    const lower = value.toLowerCase();
    setFiltered(
      resources.filter((r) => {
        const matchesText =
          r.name.toLowerCase().includes(lower) || String(r.id).includes(value);
        const matchesCategory =
          categoryId === "" || r.category_id === categoryId;
        return matchesText && matchesCategory;
      })
    );
  };

  const handleCategoryFilter = (categoryId: number | "") => {
    setSelectedCategory(categoryId);
    handleSearch(searchTerm, categoryId);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.category_id) {
      alert("Preencha o Nome e selecione uma Categoria.");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        name: formData.name,
        description: formData.description,
        quantity: Number(formData.quantity),
        category_id: Number(formData.category_id),
      };

      if (editingId) {
        await api.put(`/resource/${editingId}`, payload);
      } else {
        await api.post("/resource", payload);
      }

      closeModal();
      await loadData();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Erro ao salvar recurso.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/resource/${deleteTarget.id}`);
      setResources((prev) => prev.filter((r) => r.id !== deleteTarget.id));
      setFiltered((prev) => prev.filter((r) => r.id !== deleteTarget.id));
    } catch {
      alert("Erro ao excluir. O recurso pode estar vinculado a um pedido.");
    } finally {
      setDeleteTarget(null);
    }
  };

  const openNew = () => {
    setEditingId(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const openEdit = (r: Resource) => {
    setEditingId(r.id);
    setFormData({
      name: r.name,
      description: r.description ?? "",
      quantity: r.quantity,
      category_id: r.category_id,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData(initialForm);
  };

  const resolveCategoryName = (r: Resource) =>
    categories.find((c) => c.id === r.category_id)?.name ??
    r.category?.name ??
    "Sem Categoria";

  return (
    <GenericPanelLayout panel="recurso">
      <div className="w-full max-w-5xl mx-auto space-y-6">
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#384A6C] tracking-tight flex items-center gap-2">
              <LuPackage size={22} /> Recursos
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {filtered.length} recurso{filtered.length !== 1 ? "s" : ""}{" "}
              encontrado
              {filtered.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm">
              <LuSearch size={15} className="text-gray-400 shrink-0" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Buscar por nome ou ID..."
                className="outline-none text-sm text-gray-700 placeholder-gray-300 w-48"
              />
            </div>
            <button
              onClick={openNew}
              className="flex items-center gap-2 bg-[#384A6C] hover:bg-[#2f3e5c] active:scale-95 text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-sm transition-all"
            >
              <LuPlus size={16} /> Novo Recurso
            </button>

            {/* Filtro por Categoria */}
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-sm">
              <LuBoxes size={15} className="text-gray-400 shrink-0" />
              <select
                value={selectedCategory}
                onChange={(e) =>
                  handleCategoryFilter(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
                className="outline-none text-sm text-gray-700 bg-transparent cursor-pointer"
              >
                <option value="">Todas as categorias</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ── Tabela ── */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <svg
                className="animate-spin h-6 w-6 text-[#94C0E0]"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
              <p className="text-sm text-gray-400">Carregando recursos...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-2 text-gray-400">
              <LuBoxes size={32} className="opacity-30" />
              <p className="text-sm font-medium">Nenhum recurso encontrado.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100 bg-[#EEF5FB]">
                    {["Nome", "Categoria", "Descrição", "Estoque", ""].map(
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
                  {filtered.map((r) => (
                    <tr
                      key={r.id}
                      className="hover:bg-[#EEF5FB]/60 transition-colors"
                    >
                      {/* Nome */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#384A6C]/10 flex items-center justify-center text-[#384A6C] shrink-0">
                            <LuPackage size={14} />
                          </div>
                          <span className="font-semibold text-sm text-gray-800">
                            {r.name}
                          </span>
                        </div>
                      </td>

                      {/* Categoria */}
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center text-xs font-semibold text-[#384A6C] bg-[#384A6C]/10 px-2.5 py-1 rounded-full">
                          {resolveCategoryName(r)}
                        </span>
                      </td>

                      {/* Descrição */}
                      <td className="py-4 px-6 text-sm text-gray-500 max-w-xs truncate">
                        {r.description || (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>

                      {/* Estoque */}
                      <td className="py-4 px-6">
                        <span className="text-sm font-bold text-[#384A6C]">
                          {r.quantity}
                        </span>
                      </td>

                      {/* Ações */}
                      <td className="py-4 px-6">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEdit(r)}
                            className="p-2 rounded-xl text-[#384A6C] hover:bg-[#384A6C]/10 transition"
                            title="Editar"
                          >
                            <LuPencil size={15} />
                          </button>
                          <button
                            onClick={() =>
                              setDeleteTarget({ id: r.id, name: r.name })
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
          )}
        </div>
      </div>

      {/* ── Modal Edição / Criação ── */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between px-8 pt-7 pb-4 border-b border-gray-100">
              <h2 className="text-xl font-extrabold text-[#384A6C] tracking-tight flex items-center gap-2">
                <LuPackage size={18} />
                {editingId ? "Editar Recurso" : "Novo Recurso"}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition p-1 rounded-lg hover:bg-gray-100"
              >
                <LuX size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="px-8 py-6 overflow-y-auto space-y-4">
              <Field
                label="Nome do Recurso *"
                placeholder="Ex: Cimento CP-II"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />

              {/* Categoria (select estilizado) */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-[#384A6C] uppercase tracking-widest">
                  Categoria *
                </label>
                <select
                  value={formData.category_id}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category_id:
                        e.target.value === "" ? "" : Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-800 bg-white
                    focus:outline-none focus:ring-2 focus:ring-[#94C0E0] focus:border-transparent transition-all"
                >
                  <option value="">Selecione uma categoria...</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Descrição (textarea estilizado) */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-[#384A6C] uppercase tracking-widest">
                  Descrição
                </label>
                <textarea
                  rows={3}
                  placeholder="Detalhes técnicos..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-300 bg-white
                    focus:outline-none focus:ring-2 focus:ring-[#94C0E0] focus:border-transparent transition-all resize-none"
                />
              </div>

              <Field
                label="Estoque inicial"
                type="number"
                min={0}
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: Number(e.target.value) })
                }
              />

              <p className="text-xs text-gray-400">
                Geralmente 0. Use pedidos de compra para adicionar estoque
                posteriormente.
              </p>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-8 py-5 border-t border-gray-100">
              <button
                onClick={closeModal}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-[#384A6C] hover:bg-[#2f3e5c] active:scale-95 transition-all disabled:opacity-60"
              >
                {saving
                  ? "Salvando..."
                  : editingId
                  ? "Salvar alterações"
                  : "Criar Recurso"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal Exclusão ── */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 flex flex-col items-center text-center gap-4">
            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
              <LuTrash2 size={24} className="text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-gray-800">
                Excluir recurso?
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                <span className="font-semibold text-gray-600">
                  {deleteTarget.name}
                </span>{" "}
                será removido. Verifique se não está vinculado a pedidos.
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
