import { useState } from "react";
import { GenericPanelLayout } from "../../../components/Layout/company/layoutOption";
import {
  LuSearch, LuTrash2, LuPlus, LuPencil, LuPackage, LuBoxes,
} from "react-icons/lu";
import { useResources } from "../../../hooks/useResource";
import { type Resource, type ResourceForm, EMPTY_FORM } from "../../../types/resource";
import { unitVolume } from "../../../util/resourceHelpers";
import { ResourceModal } from "../../../components/resource/resourceModal";
import { DeleteResourceModal } from "../../../components/resource/deleteResourceModal";

export default function ResourceManager() {
  const {
    resources,
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
  } = useResources();

  // Interface State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<ResourceForm>(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string } | null>(null);

  const openNew = () => {
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setIsModalOpen(true);
  };

  const openEdit = (r: Resource) => {
    setEditingId(r.id);
    setFormData({
      name: r.name,
      description: r.description ?? "",
      category_id: r.category_id,
      width: r.width != null ? String(r.width) : "",
      height: r.height != null ? String(r.height) : "",
      length: r.length != null ? String(r.length) : "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData(EMPTY_FORM);
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await updateResource(editingId, formData);
      } else {
        await createResource(formData);
      }
      closeModal();
    } catch {
      // Handled in hook
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteResource(deleteTarget.id);
      setDeleteTarget(null);
    } catch {
      // Handled in hook
    }
  };

  const resolveCategoryName = (r: Resource) =>
    categories.find((c) => c.id === r.category_id)?.name ?? r.category?.name ?? "Sem Categoria";

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
              {resources.length} recurso{resources.length !== 1 ? "s" : ""} encontrado{resources.length !== 1 ? "s" : ""}
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
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-sm">
              <LuBoxes size={15} className="text-gray-400 shrink-0" />
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryFilter(e.target.value === "" ? "" : Number(e.target.value))}
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
          ) : resources.length === 0 ? (
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
                      <th
                        key={h}
                        className="py-3 px-6 text-[10px] font-bold text-[#384A6C] uppercase tracking-widest whitespace-nowrap last:text-right"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {resources.map((r) => {
                    const vol = unitVolume(r);
                    return (
                      <tr key={r.id} className="hover:bg-[#EEF5FB]/60 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#384A6C]/10 flex items-center justify-center text-[#384A6C] shrink-0">
                              <LuPackage size={14} />
                            </div>
                            <span className="font-semibold text-sm text-gray-800">{r.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center text-xs font-semibold text-[#384A6C] bg-[#384A6C]/10 px-2.5 py-1 rounded-full">
                            {resolveCategoryName(r)}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-500 max-w-xs truncate">
                          {r.description || <span className="text-gray-300">—</span>}
                        </td>
                        <td className="py-4 px-6">
                          {vol != null ? (
                            <span className="text-xs font-bold text-[#384A6C]">{vol.toFixed(2)} m³/un</span>
                          ) : (
                            <span className="text-xs text-gray-300">Não definido</span>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#384A6C] bg-[#384A6C]/10 px-2.5 py-1 rounded-full">
                            <LuBoxes size={11} />
                            {r.total_quantity ?? 0} un
                          </span>
                        </td>
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
                              onClick={() => setDeleteTarget({ id: r.id, name: r.name })}
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

      {/* Modais */}
      {isModalOpen && (
        <ResourceModal
          title={editingId ? "Editar Recurso" : "Novo Recurso"}
          form={formData}
          categories={categories}
          onChange={setFormData}
          onConfirm={handleSave}
          onClose={closeModal}
          loading={saving}
        />
      )}

      {deleteTarget && (
        <DeleteResourceModal
          name={deleteTarget.name}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </GenericPanelLayout>
  );
}