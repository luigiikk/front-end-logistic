import { useEffect, useState } from "react";
import { api } from "../../../api/lib/api";
import { GenericPanelLayout } from "../../../components/Layout/company/layoutOption";
import {
  LuSearch, LuTrash2, LuPlus, LuPencil, LuX, LuPackage, LuBoxes, LuRuler,
} from "react-icons/lu";
import { useToast } from "../../../components/Toast/ToastContent";

type Category = { id: number; name: string };

type Resource = {
  id: number;
  name: string;
  description: string;
  category_id: number;
  category?: { name: string };
  width?: number | null;
  height?: number | null;
  length?: number | null;
  total_quantity?: number; 
};

type ResourceForm = {
  name: string;
  description: string;
  category_id: number | "";
  width: string;
  height: string;
  length: string;
};

const initialForm: ResourceForm = {
  name: "", description: "", category_id: "",
  width: "", height: "", length: "",
};

function unitVolume(r: {
  width?: number | null;
  height?: number | null;
  length?: number | null;
}) {
  if (
    r.width == null ||
    r.height == null ||
    r.length == null
  ) {
    return null;
  }

  return r.width * r.height * r.length;
}

function Field({ label, className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string; className?: string }) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label className="text-[10px] font-bold text-[#384A6C] uppercase tracking-widest">{label}</label>
      <input {...props} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#94C0E0] focus:border-transparent transition-all" />
    </div>
  );
}

export default function ResourceManager() {
  const { toast } = useToast();
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
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string } | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [resourcesRes, categoriesRes] = await Promise.all([api.get("/resource"), api.get("/category-resource")]);
      const data: Resource[] = Array.isArray(resourcesRes.data) ? resourcesRes.data : resourcesRes.data.data ?? [];
      setResources(data);
      setFiltered(data);
      const catData: Category[] = Array.isArray(categoriesRes.data)
        ? categoriesRes.data
        : categoriesRes.data.data ?? [];
      setCategories(catData);
    } catch (err) {
      toast(`${err}`, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleSearch = (value: string, categoryId: number | "" = selectedCategory) => {
    setSearchTerm(value);
    const lower = value.toLowerCase();
    setFiltered(resources.filter((r) => {
      const matchesText = r.name.toLowerCase().includes(lower) || String(r.id).includes(value);
      const matchesCategory = categoryId === "" || r.category_id === categoryId;
      return matchesText && matchesCategory;
    }));
  };

  const handleCategoryFilter = (categoryId: number | "") => {
    setSelectedCategory(categoryId);
    handleSearch(searchTerm, categoryId);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.category_id) {  toast("Preencha o Nome e selecione uma Categoria.", "error"); return; }
    try {
      setSaving(true);
      const payload = {
        name: formData.name,
        description: formData.description,
        category_id: Number(formData.category_id),
        width: formData.width ? Number(formData.width) : null,
        height: formData.height ? Number(formData.height) : null,
        length: formData.length ? Number(formData.length) : null,
      };
      if (editingId) { await api.put(`/resource/${editingId}`, payload); }
      else { await api.post("/resource", payload); }
      closeModal();
      await loadData();
      toast(editingId ? "Recurso atualizado!" : "Recurso criado!", "success");
    } catch (err: any) {
      toast(err.response?.data?.message || "Erro ao salvar recurso.", "error");
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
      toast("Recurso excluído.", "success");
    } catch {
      toast("Erro ao excluir. O recurso pode estar vinculado a um pedido.", "error"); }
    finally { setDeleteTarget(null); }
  };

  const openNew = () => { setEditingId(null); setFormData(initialForm); setIsModalOpen(true); };

  const openEdit = (r: Resource) => {
    setEditingId(r.id);
    setFormData({
      name: r.name, description: r.description ?? "", category_id: r.category_id,
      width: r.width != null ? String(r.width) : "",
      height: r.height != null ? String(r.height) : "",
      length: r.length != null ? String(r.length) : "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => { setIsModalOpen(false); setEditingId(null); setFormData(initialForm); };

  const resolveCategoryName = (r: Resource) =>
    categories.find((c) => c.id === r.category_id)?.name ?? r.category?.name ?? "Sem Categoria";

  // Preview volume no form
  const previewVolume = (() => {
  const w = Number(formData.width);
  const h = Number(formData.height);
  const d = Number(formData.length);

  if (
    formData.width === "" ||
    formData.height === "" ||
    formData.length === ""
  ) {
    return null;
  }

  return w * h * d;
})();

  return (
    <GenericPanelLayout panel="recurso">
      <div className="w-full max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#384A6C] tracking-tight flex items-center gap-2">
              <LuPackage size={22} /> Recursos
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {filtered.length} recurso{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm">
              <LuSearch size={15} className="text-gray-400 shrink-0" />
              <input type="text" value={searchTerm} onChange={(e) => handleSearch(e.target.value)} placeholder="Buscar por nome ou ID..." className="outline-none text-sm text-gray-700 placeholder-gray-300 w-48" />
            </div>
            <button onClick={openNew} className="flex items-center gap-2 bg-[#384A6C] hover:bg-[#2f3e5c] active:scale-95 text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-sm transition-all">
              <LuPlus size={16} /> Novo Recurso
            </button>
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-sm">
              <LuBoxes size={15} className="text-gray-400 shrink-0" />
              <select value={selectedCategory} onChange={(e) => handleCategoryFilter(e.target.value === "" ? "" : Number(e.target.value))} className="outline-none text-sm text-gray-700 bg-transparent cursor-pointer">
                <option value="">Todas as categorias</option>
                {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Tabela */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <svg className="animate-spin h-6 w-6 text-[#94C0E0]" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
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
                    {["Nome", "Categoria", "Descrição", "Dimensões (m³)", "Estoque", ""].map((h) => (
                      <th key={h} className="py-3 px-6 text-[10px] font-bold text-[#384A6C] uppercase tracking-widest whitespace-nowrap last:text-right">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((r) => {
                    const vol = unitVolume(r);
                    return (
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

                        {/* Dimensões */}
                        <td className="py-4 px-6">
                          {vol != null ? (
                            <span className="text-xs font-bold text-[#384A6C]">
                              {vol.toFixed(2)} m³/un
                            </span>
                          ) : (
                            <span className="text-xs text-gray-300">
                              Não definido
                            </span>
                          )}
                        </td>

                        {/* Estoque */}
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#384A6C] bg-[#384A6C]/10 px-2.5 py-1 rounded-full">
                            <LuBoxes size={11} />
                            {r.total_quantity ?? 0} un
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
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal Criação/Edição */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-8 pt-7 pb-4 border-b border-gray-100">
              <h2 className="text-xl font-extrabold text-[#384A6C] tracking-tight flex items-center gap-2">
                <LuPackage size={18} />{editingId ? "Editar Recurso" : "Novo Recurso"}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition p-1 rounded-lg hover:bg-gray-100"><LuX size={20} /></button>
            </div>

            <div className="px-8 py-6 overflow-y-auto space-y-4">
              <Field label="Nome do Recurso *" placeholder="Ex: Cimento CP-II" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-[#384A6C] uppercase tracking-widest">Categoria *</label>
                <select value={formData.category_id} onChange={(e) => setFormData({ ...formData, category_id: e.target.value === "" ? "" : Number(e.target.value) })} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#94C0E0] focus:border-transparent transition-all">
                  <option value="">Selecione uma categoria...</option>
                  {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-[#384A6C] uppercase tracking-widest">Descrição</label>
                <textarea rows={3} placeholder="Detalhes técnicos..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#94C0E0] focus:border-transparent transition-all resize-none" />
              </div>
              {/* Dimensões */}
              <div>
                <p className="text-[10px] font-bold text-[#384A6C] uppercase tracking-widest flex items-center gap-1 mb-3">
                  <LuRuler size={11} /> Dimensões (metros)
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <Field label="Largura" placeholder="0.00" type="number" step="0.01" min={0} value={formData.width} onChange={(e) => setFormData({ ...formData, width: e.target.value })} />
                  <Field label="Altura" placeholder="0.00" type="number" step="0.01" min={0} value={formData.height} onChange={(e) => setFormData({ ...formData, height: e.target.value })} />
                  <Field label="Profundidade" placeholder="0.00" type="number" step="0.01" min={0} value={formData.length} onChange={(e) => setFormData({ ...formData, length: e.target.value })} />
                </div>

                {/* Preview volume unitário */}
                {previewVolume != null && (
                  <div className="mt-3 flex items-center justify-between bg-[#EEF5FB] border border-[#94C0E0]/30 rounded-xl px-4 py-2.5">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Volume unitário</span>
                    <span className="text-sm font-extrabold text-[#384A6C]">{previewVolume.toFixed(2)} m³</span>
                  </div>
                )}
              </div>

              <p className="text-xs text-gray-400">Estoque inicial geralmente 0. Use pedidos de compra para adicionar estoque.</p>
            </div>

            <div className="flex justify-end gap-3 px-8 py-5 border-t border-gray-100">
              <button onClick={closeModal} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition">Cancelar</button>
              <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-[#384A6C] hover:bg-[#2f3e5c] active:scale-95 transition-all disabled:opacity-60">
                {saving ? "Salvando..." : editingId ? "Salvar alterações" : "Criar Recurso"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Exclusão */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 flex flex-col items-center text-center gap-4">
            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center"><LuTrash2 size={24} className="text-red-400" /></div>
            <div>
              <h3 className="text-lg font-extrabold text-gray-800">Excluir recurso?</h3>
              <p className="text-sm text-gray-400 mt-1"><span className="font-semibold text-gray-600">{deleteTarget.name}</span> será removido. Verifique se não está vinculado a pedidos.</p>
            </div>
            <div className="flex gap-3 w-full mt-2">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition">Cancelar</button>
              <button onClick={handleDelete} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 active:scale-95 transition-all">Excluir</button>
            </div>
          </div>
        </div>
      )}
    </GenericPanelLayout>
  );
}