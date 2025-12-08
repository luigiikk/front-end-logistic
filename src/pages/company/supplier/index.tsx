import { useEffect, useState } from "react";
import { api } from "../../../api/lib/api";
import { GenericPanelLayout } from "../../../components/Layout/company/layoutOption";
import { LuSearch, LuTrash2, LuPlus, LuPencil, LuX, LuTruck, LuMapPin, LuInfo } from "react-icons/lu";

// Interface baseada na resposta da API (Com address aninhado)
type Supplier = {
  id: number;
  name: string;
  email: string;
  phone: string;
  CNPJ: string;
  contactPerson?: string;
  notes?: string;
  // O Front agora espera receber um objeto address
  address?: {
    street?: string;
    number?: number;
    complement?: string;
    city?: string;
    state?: string;
    country?: string;
    zipcode?: string;
  } | null;
  // Mantemos 'addres' apenas por segurança caso o back antigo responda
  addres?: any; 
};

// Interface do estado do formulário (Campos soltos para facilitar a edição)
type SupplierFormState = {
  name: string;
  email: string;
  phone: string;
  CNPJ: string;
  contactPerson: string;
  notes: string;
  street: string;
  number: string;
  complement: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
};

const initialForm: SupplierFormState = {
  name: "", email: "", phone: "", CNPJ: "", contactPerson: "", notes: "",
  street: "", number: "", complement: "", city: "", state: "", country: "", zipcode: ""
};

export default function SupplierManager() {
  const [loading, setLoading] = useState(true);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [filtered, setFiltered] = useState<Supplier[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<SupplierFormState>(initialForm);

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/supplier"); 
      setSuppliers(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.error("Erro ao carregar fornecedores", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text: string) => {
    setSearchTerm(text);
    const lower = text.toLowerCase();
    setFiltered(suppliers.filter(s => 
      s.name.toLowerCase().includes(lower) || 
      s.CNPJ.includes(text) ||
      (s.email && s.email.toLowerCase().includes(lower))
    ));
  };

  const handleSave = async () => {
    try {
      if (!formData.name || !formData.CNPJ || !formData.email) {
        return alert("Nome, Email e CNPJ são obrigatórios.");
      }

      // Prepara o payload "flat" (solto) para envio ao Back-end
      // (Seus controllers de create/update esperam assim)
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        CNPJ: formData.CNPJ,
        contactPerson: formData.contactPerson || null,
        notes: formData.notes || null,
        
        street: formData.street || null,
        number: formData.number ? Number(formData.number) : null,
        complement: formData.complement || null,
        city: formData.city || null,
        state: formData.state || null,
        country: formData.country || null,
        zipcode: formData.zipcode || null,
      };

      if (editingId) {
        await api.put(`/supplier/${editingId}`, payload);
        alert("Fornecedor atualizado!");
      } else {
        await api.post("/supplier", payload); // Ajuste a rota se necessário
        alert("Fornecedor criado!");
      }

      closeModal();
      await loadSuppliers();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Erro ao salvar.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Deseja realmente excluir este fornecedor?")) return;
    try {
      await api.delete(`/supplier/${id}`);
      setSuppliers(prev => prev.filter(s => s.id !== id));
      setFiltered(prev => prev.filter(s => s.id !== id));
      alert("Excluído com sucesso.");
    } catch (err) {
      alert("Erro ao excluir fornecedor.");
    }
  };

  // --- LÓGICA DE ABRIR EDIÇÃO (Onde a mágica acontece) ---
  const openEdit = (s: Supplier) => {
    setEditingId(s.id);
    
    // Tenta pegar o objeto 'address', ou 'addres' (erro antigo), ou vazio
    const addr = s.address || s.addres || {}; 

    setFormData({
      name: s.name,
      email: s.email,
      phone: s.phone || "",
      CNPJ: s.CNPJ,
      contactPerson: s.contactPerson || "",
      notes: s.notes || "",
      
      // Mapeia o objeto aninhado de volta para o formulário plano
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

  const openNew = () => {
    setEditingId(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleChange = (field: keyof SupplierFormState, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <GenericPanelLayout panel="fornecedor">
      <div className="bg-white max-w-6xl w-full rounded-3xl shadow-xl p-10 min-h-[600px]">
        <h1 className="text-3xl text-center mb-8 font-bold text-gray-800">Gerenciar Fornecedores</h1>

        {/* Header */}
        <div className="flex justify-between mb-6">
          <button onClick={openNew} className="flex items-center gap-2 bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition shadow-sm">
            <LuPlus size={20} /> Novo Fornecedor
          </button>
          <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 focus-within:ring-2 ring-green-200">
            <LuSearch className="text-gray-500" />
            <input 
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              type="text" 
              placeholder="Buscar (Nome, CNPJ, Email)..." 
              className="bg-transparent outline-none w-72" 
            />
          </div>
        </div>

        {/* Tabela */}
        <div className="overflow-x-auto border rounded-xl shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100">
              <tr className="text-gray-600 text-xs uppercase font-bold tracking-wider">
                <th className="py-4 px-6">Empresa</th>
                <th className="py-4 px-6">Contato</th>
                <th className="py-4 px-6">Localização</th>
                <th className="py-4 px-6">CNPJ</th>
                <th className="py-4 px-6 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={5} className="text-center py-8 text-gray-500">Carregando...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8 text-gray-500">Nenhum fornecedor encontrado.</td></tr>
              ) : filtered.map((s) => {
                // Prepara endereço para visualização na tabela
                const addr = s.address || s.addres || {};
                return (
                  <tr key={s.id} className="hover:bg-gray-50 transition">
                    <td className="py-4 px-6 font-medium text-gray-800 flex items-center gap-2">
                      <div className="bg-green-100 p-2 rounded text-green-600"><LuTruck /></div>
                      <div>
                        <p>{s.name}</p>
                        <span className="text-xs text-gray-400">{s.email}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      <p>{s.phone}</p>
                      {s.contactPerson && <p className="text-xs text-gray-400">Ref: {s.contactPerson}</p>}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {addr.city ? `${addr.city} - ${addr.state}` : "Endereço n/d"}
                    </td>
                    <td className="py-4 px-6 text-sm font-mono text-gray-700">{s.CNPJ}</td>
                    <td className="py-4 px-6 flex justify-end gap-3">
                      <button onClick={() => openEdit(s)} className="text-blue-500 hover:bg-blue-50 p-2 rounded-full transition"><LuPencil size={18} /></button>
                      <button onClick={() => handleDelete(s.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-full transition"><LuTrash2 size={18} /></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Modal Grande */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden animate-fadeIn flex flex-col max-h-[90vh]">
              
              {/* Header Modal */}
              <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center shrink-0">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <LuTruck className="text-green-600"/>
                  {editingId ? "Editar Fornecedor" : "Novo Fornecedor"}
                </h2>
                <button onClick={closeModal} className="text-gray-400 hover:text-red-500 transition"><LuX size={24} /></button>
              </div>

              {/* Body Modal */}
              <div className="p-8 overflow-y-auto">
                
                {/* SEÇÃO 1: DADOS BÁSICOS */}
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b pb-1 flex items-center gap-2">
                    <LuInfo /> Dados da Empresa
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-1">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Nome da Empresa *</label>
                      <input className="w-full border rounded p-2 text-sm focus:ring-2 ring-green-500 outline-none" 
                        value={formData.name} onChange={e => handleChange("name", e.target.value)} />
                    </div>
                    <div className="md:col-span-1">
                      <label className="block text-xs font-medium text-gray-700 mb-1">CNPJ *</label>
                      <input className="w-full border rounded p-2 text-sm focus:ring-2 ring-green-500 outline-none" 
                        value={formData.CNPJ} onChange={e => handleChange("CNPJ", e.target.value)} />
                    </div>
                    <div className="md:col-span-1">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Email *</label>
                      <input type="email" className="w-full border rounded p-2 text-sm focus:ring-2 ring-green-500 outline-none" 
                        value={formData.email} onChange={e => handleChange("email", e.target.value)} />
                    </div>
                    
                    <div className="md:col-span-1">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Telefone</label>
                      <input className="w-full border rounded p-2 text-sm focus:ring-2 ring-green-500 outline-none" 
                        value={formData.phone} onChange={e => handleChange("phone", e.target.value)} />
                    </div>
                    <div className="md:col-span-1">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Pessoa de Contato</label>
                      <input className="w-full border rounded p-2 text-sm focus:ring-2 ring-green-500 outline-none" 
                        value={formData.contactPerson} onChange={e => handleChange("contactPerson", e.target.value)} />
                    </div>
                    
                    <div className="md:col-span-3">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Notas / Observações</label>
                      <input className="w-full border rounded p-2 text-sm focus:ring-2 ring-green-500 outline-none" 
                        value={formData.notes} onChange={e => handleChange("notes", e.target.value)} />
                    </div>
                  </div>
                </div>

                {/* SEÇÃO 2: ENDEREÇO */}
                <div>
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b pb-1 flex items-center gap-2">
                    <LuMapPin /> Endereço
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-1">
                      <label className="block text-xs font-medium text-gray-700 mb-1">CEP</label>
                      <input className="w-full border rounded p-2 text-sm focus:ring-2 ring-green-500 outline-none" 
                        value={formData.zipcode} onChange={e => handleChange("zipcode", e.target.value)} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Rua / Logradouro</label>
                      <input className="w-full border rounded p-2 text-sm focus:ring-2 ring-green-500 outline-none" 
                        value={formData.street} onChange={e => handleChange("street", e.target.value)} />
                    </div>
                    <div className="md:col-span-1">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Número</label>
                      <input type="number" className="w-full border rounded p-2 text-sm focus:ring-2 ring-green-500 outline-none" 
                        value={formData.number} onChange={e => handleChange("number", e.target.value)} />
                    </div>

                    <div className="md:col-span-1">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Complemento</label>
                      <input className="w-full border rounded p-2 text-sm focus:ring-2 ring-green-500 outline-none" 
                        value={formData.complement} onChange={e => handleChange("complement", e.target.value)} />
                    </div>
                    <div className="md:col-span-1">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Cidade</label>
                      <input className="w-full border rounded p-2 text-sm focus:ring-2 ring-green-500 outline-none" 
                        value={formData.city} onChange={e => handleChange("city", e.target.value)} />
                    </div>
                    <div className="md:col-span-1">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Estado (UF)</label>
                      <input className="w-full border rounded p-2 text-sm focus:ring-2 ring-green-500 outline-none" maxLength={2}
                        value={formData.state} onChange={e => handleChange("state", e.target.value)} />
                    </div>
                    <div className="md:col-span-1">
                      <label className="block text-xs font-medium text-gray-700 mb-1">País</label>
                      <input className="w-full border rounded p-2 text-sm focus:ring-2 ring-green-500 outline-none" 
                        value={formData.country} onChange={e => handleChange("country", e.target.value)} />
                    </div>
                  </div>
                </div>

              </div>

              {/* Footer Modal */}
              <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t shrink-0">
                <button onClick={closeModal} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg font-medium transition">
                  Cancelar
                </button>
                <button onClick={handleSave} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium shadow-md transition transform active:scale-95">
                  {editingId ? "Salvar Alterações" : "Cadastrar Fornecedor"}
                </button>
              </div>

            </div>
          </div>
        )}
      </div>
    </GenericPanelLayout>
  );
}