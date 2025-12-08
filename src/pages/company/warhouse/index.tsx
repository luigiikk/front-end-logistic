import { useEffect, useState } from "react";
import { api } from "../../../api/lib/api";
import { GenericPanelLayout } from "../../../components/Layout/company/layoutOption";
import { LuSearch, LuTrash2, LuPlus, LuPencil, LuX, LuWarehouse, LuMapPin } from "react-icons/lu";


type Warehouse = {
  id: number;
  name: string;
  street?: string;
  number?: number;
  city?: string;
  state?: string;

  address?: {
    street: string;
    number: number;
    city: string;
    state: string;
    zipcode: string;
    complement?: string;
    country?: string;
  } | null;
  addres?: any; 
};

type WarehouseForm = {
  name: string;
  street: string;
  number: string; 
  complement: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
};

const initialForm: WarehouseForm = {
  name: "",
  street: "",
  number: "",
  complement: "",
  city: "",
  state: "",
  country: "",
  zipcode: ""
};

export default function WarehouseManager() {
  const [loading, setLoading] = useState(true);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [filtered, setFiltered] = useState<Warehouse[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<WarehouseForm>(initialForm);

  useEffect(() => {
    loadWarehouses();
  }, []);

  const loadWarehouses = async () => {
    try {
      setLoading(true);
      const res = await api.get("/warehouses"); 
      const data = Array.isArray(res.data) ? res.data : (res.data.data || []);
      setWarehouses(data);
      setFiltered(data);
    } catch (err) {
      console.error("Erro ao carregar armazéns", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text: string) => {
    setSearchTerm(text);
    const lower = text.toLowerCase();
    setFiltered(warehouses.filter(w => 
      w.name.toLowerCase().includes(lower) || 
      String(w.id).includes(lower)
    ));
  };

  const handleSave = async () => {
    try {
      if (!formData.name || !formData.street || !formData.city) {
        return alert("Nome, Rua e Cidade são obrigatórios.");
      }

      const payload = {
        name: formData.name,
        street: formData.street,
        number: Number(formData.number), 
        complement: formData.complement || "",
        city: formData.city,
        state: formData.state,
        country: formData.country,
        zipcode: formData.zipcode,
      };

      if (editingId) {
        await api.put(`/warehouses/${editingId}`, payload);
        alert("Armazém atualizado!");
      } else {

        await api.post("/warehouses", payload); 
        alert("Armazém criado!");
      }

      closeModal();
      await loadWarehouses();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Erro ao salvar armazém.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Excluir este armazém?")) return;
    try {
      await api.delete(`/warehouses/${id}`);
      setWarehouses(prev => prev.filter(w => w.id !== id));
      setFiltered(prev => prev.filter(w => w.id !== id));
    } catch (err) {
      alert("Erro ao excluir.");
    }
  };


  const openNew = () => {
    setEditingId(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const openEdit = (w: Warehouse) => {
    setEditingId(w.id);

    const addr = w.address || w.addres || w; 

    setFormData({
      name: w.name,
      street: addr.street || "",
      number: addr.number ? String(addr.number) : "",
      complement: addr.complement || "",
      city: addr.city || "",
      state: addr.state || "",
      country: addr.country || "",
      zipcode: addr.zipcode || ""
    });
    
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleChange = (field: keyof WarehouseForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <GenericPanelLayout panel="armazem">
      <div className="bg-white max-w-5xl w-full rounded-3xl shadow-xl p-10 min-h-[600px]">
        <h1 className="text-3xl text-center mb-8 font-bold text-gray-800">Gerenciar Armazéns</h1>

        {/* Header */}
        <div className="flex justify-between mb-6">
          <button onClick={openNew} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm">
            <LuPlus size={20} /> Novo Armazém
          </button>
          <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 focus-within:ring-2 ring-blue-200">
            <LuSearch className="text-gray-500" />
            <input 
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              type="text" 
              placeholder="Buscar armazém..." 
              className="bg-transparent outline-none w-64" 
            />
          </div>
        </div>

        {/* Tabela */}
        <div className="overflow-x-auto border rounded-xl shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100">
              <tr className="text-gray-600 text-xs uppercase font-bold tracking-wider">
                <th className="py-4 px-6">Nome / ID</th>
                <th className="py-4 px-6">Cidade/UF</th>
                <th className="py-4 px-6">Endereço</th>
                <th className="py-4 px-6 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={4} className="text-center py-8 text-gray-500">Carregando...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-8 text-gray-500">Nenhum armazém encontrado.</td></tr>
              ) : filtered.map((w) => {
                // Resolve visualização
                const addr = w.address || w.addres || w; 
                return (
                  <tr key={w.id} className="hover:bg-gray-50 transition">
                    <td className="py-4 px-6 font-medium text-gray-800 flex items-center gap-2">
                      <div className="bg-blue-100 p-2 rounded text-blue-600"><LuWarehouse /></div>
                      <div>
                        <p>{w.name}</p>
                        <span className="text-xs text-gray-400">ID: {w.id}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {addr.city ? `${addr.city} / ${addr.state}` : "N/D"}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500 max-w-xs truncate">
                      {addr.street}, {addr.number}
                    </td>
                    <td className="py-4 px-6 flex justify-end gap-3">
                      <button onClick={() => openEdit(w)} className="text-blue-500 hover:bg-blue-50 p-2 rounded-full transition"><LuPencil size={18} /></button>
                      <button onClick={() => handleDelete(w.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-full transition"><LuTrash2 size={18} /></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-fadeIn">
              
              <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
                <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800">
                  <LuWarehouse className="text-blue-600"/> {editingId ? "Editar" : "Novo"} Armazém
                </h2>
                <button onClick={closeModal}><LuX size={24}/></button>
              </div>

              <div className="p-8 overflow-y-auto">
                {/* Nome */}
                <div className="mb-6">
                  <label className="text-xs font-medium text-gray-700">Nome do Armazém *</label>
                  <input 
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none mt-1" 
                    placeholder="Ex: Galpão Central"
                    value={formData.name} 
                    onChange={e => handleChange("name", e.target.value)} 
                  />
                </div>

                {/* Endereço Grid */}
                <div>
                  <h3 className="text-sm font-bold text-gray-400 uppercase border-b pb-1 mb-4 flex gap-2"><LuMapPin/> Localização</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    
                    <div className="md:col-span-1">
                      <label className="text-xs font-medium text-gray-700">CEP</label>
                      <input className="w-full border rounded p-2" value={formData.zipcode} onChange={e => handleChange("zipcode", e.target.value)} />
                    </div>
                    
                    <div className="md:col-span-3">
                      <label className="text-xs font-medium text-gray-700">Rua *</label>
                      <input className="w-full border rounded p-2" value={formData.street} onChange={e => handleChange("street", e.target.value)} />
                    </div>

                    <div className="md:col-span-1">
                      <label className="text-xs font-medium text-gray-700">Número *</label>
                      <input type="number" className="w-full border rounded p-2" value={formData.number} onChange={e => handleChange("number", e.target.value)} />
                    </div>

                    <div className="md:col-span-1">
                      <label className="text-xs font-medium text-gray-700">Complemento</label>
                      <input className="w-full border rounded p-2" value={formData.complement} onChange={e => handleChange("complement", e.target.value)} />
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-xs font-medium text-gray-700">Cidade *</label>
                      <input className="w-full border rounded p-2" value={formData.city} onChange={e => handleChange("city", e.target.value)} />
                    </div>

                    <div className="md:col-span-1">
                      <label className="text-xs font-medium text-gray-700">Estado (UF) *</label>
                      <input className="w-full border rounded p-2" maxLength={2} value={formData.state} onChange={e => handleChange("state", e.target.value)} />
                    </div>

                    <div className="md:col-span-1">
                      <label className="text-xs font-medium text-gray-700">País</label>
                      <input className="w-full border rounded p-2" value={formData.country} onChange={e => handleChange("country", e.target.value)} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t">
                <button onClick={closeModal} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg">Cancelar</button>
                <button onClick={handleSave} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium">Salvar</button>
              </div>

            </div>
          </div>
        )}
      </div>
    </GenericPanelLayout>
  );
}