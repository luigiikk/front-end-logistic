import { useEffect, useState } from "react";
import { api } from "../../../api/lib/api";
import { GenericPanelLayout } from "../../../components/Layout/company/layoutOption";
import { LuSearch, LuTrash2, LuPlus, LuPencil, LuX, LuPackage } from "react-icons/lu";

// Tipagens
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
  // O back-end pode retornar a categoria populada ou não. 
  // Vamos tratar isso no front.
  category?: { name: string }; 
};

type ResourceForm = {
  name: string;
  description: string;
  quantity: number;
  category_id: number | "";
};

export default function ResourceManager() {
  const [loading, setLoading] = useState(true);
  
  // Dados
  const [resources, setResources] = useState<Resource[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filtered, setFiltered] = useState<Resource[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal e Formulário
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<ResourceForm>({
    name: "",
    description: "",
    quantity: 0,
    category_id: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // Busca Recursos e Categorias ao mesmo tempo
      const [resourcesRes, categoriesRes] = await Promise.all([
        api.get("/resource"), 
        api.get("/category-resource")  
      ]);

      setResources(resourcesRes.data);
      setFiltered(resourcesRes.data);
      setCategories(categoriesRes.data);
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text: string) => {
    setSearchTerm(text);
    const lower = text.toLowerCase();
    setFiltered(resources.filter(r => 
      r.name.toLowerCase().includes(lower) || 
      String(r.id).includes(lower)
    ));
  };

  // --- Ações de Salvar (Create/Update) ---
  const handleSave = async () => {
    try {
      // Validação básica
      if (!formData.name || !formData.category_id) {
        return alert("Preencha o Nome e selecione uma Categoria.");
      }

      // Payload preparado
      const payload = {
        name: formData.name,
        description: formData.description,
        quantity: Number(formData.quantity),
        category_id: Number(formData.category_id)
      };

      if (editingId) {
        // EDIÇÃO
        await api.put(`/resource/${editingId}`, payload);
        alert("Recurso atualizado com sucesso!");
      } else {
        await api.post("/resource", payload); 
        alert("Recurso criado com sucesso!");
      }

      closeModal();
      loadData(); // Recarrega a lista
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Erro ao salvar recurso.");
    }
  };

  // --- Ação de Excluir ---
  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este recurso?")) return;

    try {
      await api.delete(`/resource/${id}`);
      // Remove da lista localmente para não precisar recarregar tudo
      setResources(prev => prev.filter(r => r.id !== id));
      setFiltered(prev => prev.filter(r => r.id !== id));
      alert("Recurso excluído.");
    } catch (err: any) {
      console.error(err);
      alert("Erro ao excluir. O recurso pode estar vinculado a um pedido.");
    }
  };

  // --- Controle do Modal ---
  const openNew = () => {
    setEditingId(null);
    setFormData({ name: "", description: "", quantity: 0, category_id: "" });
    setIsModalOpen(true);
  };

  const openEdit = (item: Resource) => {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      description: item.description || "",
      quantity: item.quantity,
      category_id: item.category_id
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  return (
    <GenericPanelLayout panel="recurso">
      <div className="bg-white max-w-5xl w-full rounded-3xl shadow-xl p-10 min-h-[600px]">
        <h1 className="text-3xl text-center mb-8 font-bold text-gray-800">Gerenciar Recursos</h1>

        {/* Header da Tabela */}
        <div className="flex justify-between mb-6">
          <button 
            onClick={openNew}
            className="flex items-center gap-2 bg-orange-600 text-white px-5 py-2 rounded-lg hover:bg-orange-700 transition shadow-sm"
          >
            <LuPlus size={20} /> Novo Recurso
          </button>

          <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 focus-within:ring-2 ring-orange-200">
            <LuSearch className="text-gray-500" />
            <input 
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              type="text" 
              placeholder="Buscar recurso..." 
              className="bg-transparent outline-none w-64" 
            />
          </div>
        </div>

        {/* Tabela */}
        <div className="overflow-x-auto border rounded-xl shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100">
              <tr className="text-gray-600 text-xs uppercase font-bold tracking-wider">
                <th className="py-4 px-6">Nome</th>
                <th className="py-4 px-6">Categoria</th>
                <th className="py-4 px-6">Descrição</th>
                <th className="py-4 px-6 text-center">Estoque Atual</th>
                <th className="py-4 px-6 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={5} className="text-center py-8 text-gray-500">Carregando...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8 text-gray-500">Nenhum recurso encontrado.</td></tr>
              ) : filtered.map((r) => {
                // Tenta encontrar o nome da categoria no array de categorias carregado
                const catName = categories.find(c => c.id === r.category_id)?.name || r.category?.name || "Sem Categoria";

                return (
                  <tr key={r.id} className="hover:bg-gray-50 transition">
                    <td className="py-4 px-6 font-medium text-gray-800 flex items-center gap-2">
                      <div className="bg-orange-100 p-2 rounded text-orange-600"><LuPackage /></div>
                      {r.name}
                    </td>
                    <td className="py-4 px-6">
                      <span className="bg-gray-200 text-gray-700 py-1 px-3 rounded-full text-xs font-semibold">
                        {catName}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-500 text-sm max-w-xs truncate">{r.description}</td>
                    <td className="py-4 px-6 text-center font-bold text-gray-700">{r.quantity}</td>
                    <td className="py-4 px-6 flex justify-end gap-3">
                      <button onClick={() => openEdit(r)} className="text-blue-500 hover:bg-blue-50 p-2 rounded-full transition" title="Editar">
                        <LuPencil size={18} />
                      </button>
                      <button onClick={() => handleDelete(r.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-full transition" title="Excluir">
                        <LuTrash2 size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Modal Create/Edit */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-fadeIn">
              
              {/* Header Modal */}
              <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">
                  {editingId ? "Editar Recurso" : "Novo Recurso"}
                </h2>
                <button onClick={closeModal} className="text-gray-400 hover:text-red-500 transition">
                  <LuX size={24} />
                </button>
              </div>

              {/* Body Modal */}
              <div className="p-6 space-y-4">
                
                {/* Nome */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Recurso</label>
                  <input 
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-orange-500 outline-none transition"
                    placeholder="Ex: Cimento CP-II"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>

                {/* Categoria (Select) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                  <select 
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-orange-500 outline-none transition bg-white"
                    value={formData.category_id}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData({...formData, category_id: val === "" ? "" : Number(val)});
                    }}
                  >
                    <option value="">Selecione uma categoria...</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                {/* Descrição */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                  <textarea 
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-orange-500 outline-none transition resize-none h-24"
                    placeholder="Detalhes técnicos..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                {/* Quantidade Inicial */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estoque Inicial (Opcional)</label>
                  <input 
                    type="number"
                    min="0"
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-orange-500 outline-none transition"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: Number(e.target.value)})}
                  />
                  <p className="text-xs text-gray-500 mt-1">Geralmente 0. Use pedidos de compra para adicionar estoque posteriormente.</p>
                </div>

              </div>

              {/* Footer Modal */}
              <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t">
                <button 
                  onClick={closeModal} 
                  className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg font-medium transition"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleSave} 
                  className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium shadow-md transition transform active:scale-95"
                >
                  {editingId ? "Salvar Alterações" : "Criar Recurso"}
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </GenericPanelLayout>
  );
}