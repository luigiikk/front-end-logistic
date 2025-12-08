import { useEffect, useState } from "react";
import { api } from "../../../api/lib/api";
import { GenericPanelLayout } from "../../../components/Layout/company/layoutOption";
import { LuSearch, LuTrash2, LuPlus, LuBox, LuUser, LuMapPin } from "react-icons/lu";

// --- TIPOS ---

type Product = {
  name: string;
  description: string;
  quantity: number;
};

// Tipo para LEITURA (Listagem) - Mantive simples pois a listagem costuma retornar resumido
type Order = {
  id: number;
  code: string;
  vehicle_id: number;
  recipient: string; // Nome resumido do destinatário para a tabela
  sender_client: string;
  status: string;
  products?: Product[];
  vehicle?: string; 
};

type Status = {
  id: number;
  name: string;
};

// Tipo para CRIAÇÃO (Estrutura complexa que o Back-end exige)
type NewOrderForm = {
  vehicle_id: number | "";
  recipient: {
    name: string;
    cpf: string;
    email: string;
    address: {
      street: string;
      number: string; // Input é string, convertemos no submit
      complement: string;
      city: string;
      state: string;
      country: string;
      zipcode: string;
    }
  };
  products: Product[];
};

// Estado Inicial Limpo
const initialOrderState: NewOrderForm = {
  vehicle_id: "",
  recipient: {
    name: "",
    cpf: "",
    email: "",
    address: {
      street: "",
      number: "",
      complement: "",
      city: "",
      state: "",
      country: "Brasil",
      zipcode: ""
    }
  },
  products: [{ name: "", description: "", quantity: 1 }],
};

export default function OrderManager() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filtered, setFiltered] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [vehicles, setVehicles] = useState<{ id: number; plate: string; model?: string }[]>([]);

  const [creating, setCreating] = useState(false);

  
  const [newOrder, setNewOrder] = useState<NewOrderForm>(initialOrderState);

  useEffect(() => {
    loadOrders();
    loadStatuses();
    loadVehicles();
  }, []);

  // --- CARREGAMENTOS ---
  const loadOrders = async () => {
    try {
      const res = await api.get("/order");
      setOrders(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadStatuses = async () => { /* ... sua lógica ... */ };
  const loadVehicles = async () => {
    try {
      const res = await api.get("/vehicle");
      setVehicles(res.data);
    } catch (err) { console.error(err); }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setFiltered(orders.filter(o => 
      String(o.id).includes(value) || 
      (o.recipient && o.recipient.toLowerCase().includes(value.toLowerCase()))
    ));
  };

  // --- MANIPULAÇÃO DE ESTADO DO FORMULÁRIO ---

  // Atualiza dados simples do destinatário (nome, cpf, email)
  const updateRecipient = (field: keyof NewOrderForm['recipient'], value: string) => {
    setNewOrder(prev => ({
      ...prev,
      recipient: { ...prev.recipient, [field]: value }
    }));
  };

  // Atualiza dados do endereço
  const updateAddress = (field: keyof NewOrderForm['recipient']['address'], value: string) => {
    setNewOrder(prev => ({
      ...prev,
      recipient: {
        ...prev.recipient,
        address: { ...prev.recipient.address, [field]: value }
      }
    }));
  };

  // --- PRODUTOS ---
  const handleAddProduct = () => {
    setNewOrder(prev => ({
      ...prev,
      products: [...prev.products, { name: "", description: "", quantity: 1 }],
    }));
  };

  const handleRemoveProduct = (index: number) => {
    const updated = [...newOrder.products];
    updated.splice(index, 1);
    setNewOrder({ ...newOrder, products: updated });
  };

  const updateProduct = (index: number, field: keyof Product, value: any) => {
    const updated = [...newOrder.products];
    // @ts-ignore
    updated[index][field] = value;
    setNewOrder({ ...newOrder, products: updated });
  };

  // --- AÇÕES DO CRUD ---

  const handleCreateProductWithOrder = async () => {
    try {
      if (!newOrder.vehicle_id) return alert("Selecione um veículo");
      if (!newOrder.recipient.name || !newOrder.recipient.cpf) return alert("Preencha os dados do destinatário");

      // Montando payload conforme interface OrderRegisterCompanyParams
      const payload = {
        vehicle_id: Number(newOrder.vehicle_id),
        recipient: {
          name: newOrder.recipient.name,
          cpf: newOrder.recipient.cpf,
          email: newOrder.recipient.email,
          address: {
            street: newOrder.recipient.address.street,
            number: newOrder.recipient.address.number ? Number(newOrder.recipient.address.number) : null,
            complement: newOrder.recipient.address.complement,
            city: newOrder.recipient.address.city,
            state: newOrder.recipient.address.state,
            country: newOrder.recipient.address.country,
            zipcode: newOrder.recipient.address.zipcode,
          }
        },
        products: newOrder.products.map(p => ({
          name: p.name,
          description: p.description,
          quantity: Number(p.quantity)
        }))
      };

      await api.post("/order/company", payload); // Ajuste a rota se necessário

      await loadOrders();
      setCreating(false);
      setNewOrder(initialOrderState);
      alert("Pedido e Destinatário criados com sucesso!");
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Erro ao criar pedido");
    }
  };

  const handleDeleteOrder = async (orderId: number) => {
    if (!confirm("Tem certeza que deseja excluir este pedido?")) return;
    try {
      await api.delete(`/order/${orderId}`);
      setOrders(prev => prev.filter(o => o.id !== orderId));
      setFiltered(prev => prev.filter(o => o.id !== orderId));
    } catch (err) { alert("Erro ao excluir"); }
  };

  // --- RENDERIZAÇÃO ---

  return (
    <GenericPanelLayout panel="pedido">
      <div className="bg-white max-w-6xl w-full rounded-3xl shadow-xl p-10 min-h-[600px]">
        <h1 className="text-3xl text-center mb-8 font-bold text-gray-800">Gerenciar Pedidos</h1>

        <div className="flex justify-between mb-6">
          <button onClick={() => setCreating(true)} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
            <LuPlus /> Criar Pedido
          </button>
          <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2">
            <LuSearch className="text-gray-500" />
            <input 
              value={searchTerm} onChange={(e) => handleSearch(e.target.value)} 
              placeholder="Buscar destinatário..." className="outline-none" 
            />
          </div>
        </div>

        {/* Tabela de Listagem */}
        <div className="border rounded-lg overflow-hidden">
          {filtered.map((order) => (
            <div key={order.id} className="flex justify-between border-b p-4 hover:bg-gray-50 items-center">
              <div>
                <p className="font-bold text-lg text-gray-800">Pedido #{order.code || order.id}</p>
                <p className="text-gray-600 text-sm">Destinatário: {order.recipient}</p>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{order.status}</span>
              </div>
              <button onClick={() => handleDeleteOrder(order.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-full">
                <LuTrash2 size={20} />
              </button>
            </div>
          ))}
        </div>

        {/* --- MODAL DE CRIAÇÃO COMPLETO --- */}
        {creating && (
          <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-[1000] p-4">
            <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
              
              <div className="bg-gray-50 px-6 py-4 border-b">
                <h2 className="text-xl font-bold text-gray-800">Novo Pedido de Entrega</h2>
              </div>

              <div className="p-8 overflow-y-auto space-y-8">
                
                {/* 1. Seleção de Veículo */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Veículo Responsável *</label>
                  <select
                    value={newOrder.vehicle_id}
                    onChange={(e) => setNewOrder({ ...newOrder, vehicle_id: Number(e.target.value) })}
                    className="w-full border p-2.5 rounded-lg bg-white focus:ring-2 ring-green-500 outline-none"
                  >
                    <option value="">Selecione um veículo...</option>
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.id}>{v.plate} - {v.model}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* 2. Dados do Destinatário */}
                  <div className="bg-gray-50 p-4 rounded-xl border">
                    <h3 className="flex items-center gap-2 font-bold text-gray-700 mb-4 border-b pb-2">
                      <LuUser /> Dados do Destinatário
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-semibold text-gray-500">Nome Completo *</label>
                        <input className="w-full border rounded p-2" 
                          value={newOrder.recipient.name} onChange={e => updateRecipient('name', e.target.value)} />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500">CPF *</label>
                        <input className="w-full border rounded p-2" 
                          value={newOrder.recipient.cpf} onChange={e => updateRecipient('cpf', e.target.value)} />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500">Email</label>
                        <input className="w-full border rounded p-2" 
                          value={newOrder.recipient.email} onChange={e => updateRecipient('email', e.target.value)} />
                      </div>
                    </div>
                  </div>

                  {/* 3. Endereço */}
                  <div className="bg-gray-50 p-4 rounded-xl border">
                    <h3 className="flex items-center gap-2 font-bold text-gray-700 mb-4 border-b pb-2">
                      <LuMapPin /> Endereço de Entrega
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="col-span-2">
                        <label className="text-xs font-semibold text-gray-500">Rua</label>
                        <input className="w-full border rounded p-2" 
                          value={newOrder.recipient.address.street} onChange={e => updateAddress('street', e.target.value)} />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500">Número</label>
                        <input type="number" className="w-full border rounded p-2" 
                          value={newOrder.recipient.address.number} onChange={e => updateAddress('number', e.target.value)} />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500">CEP</label>
                        <input className="w-full border rounded p-2" 
                          value={newOrder.recipient.address.zipcode} onChange={e => updateAddress('zipcode', e.target.value)} />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500">Cidade</label>
                        <input className="w-full border rounded p-2" 
                          value={newOrder.recipient.address.city} onChange={e => updateAddress('city', e.target.value)} />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500">Estado</label>
                        <input className="w-full border rounded p-2" maxLength={2}
                          value={newOrder.recipient.address.state} onChange={e => updateAddress('state', e.target.value)} />
                      </div>
                      <div className="col-span-2">
                        <label className="text-xs font-semibold text-gray-500">Complemento</label>
                        <input className="w-full border rounded p-2" 
                          value={newOrder.recipient.address.complement} onChange={e => updateAddress('complement', e.target.value)} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Produtos */}
                <div>
                  <h3 className="flex items-center gap-2 font-bold text-gray-700 mb-4 border-b pb-2">
                    <LuBox /> Itens do Pedido
                  </h3>
                  {newOrder.products.map((p, index) => (
                    <div key={index} className="flex gap-3 mb-3 items-end bg-gray-50 p-3 rounded border">
                      <div className="flex-1">
                        <label className="text-xs text-gray-500">Produto</label>
                        <input className="w-full border rounded p-2" placeholder="Nome"
                          value={p.name} onChange={e => updateProduct(index, 'name', e.target.value)} />
                      </div>
                      <div className="flex-1">
                        <label className="text-xs text-gray-500">Descrição</label>
                        <input className="w-full border rounded p-2" placeholder="Desc"
                          value={p.description} onChange={e => updateProduct(index, 'description', e.target.value)} />
                      </div>
                      <div className="w-20">
                        <label className="text-xs text-gray-500">Qtd</label>
                        <input type="number" className="w-full border rounded p-2"
                          value={p.quantity} onChange={e => updateProduct(index, 'quantity', e.target.value)} />
                      </div>
                      {index > 0 && (
                        <button onClick={() => handleRemoveProduct(index)} className="text-red-500 p-2 hover:bg-red-100 rounded">
                          <LuTrash2 />
                        </button>
                      )}
                    </div>
                  ))}
                  <button onClick={handleAddProduct} className="text-sm text-green-600 font-bold hover:underline flex items-center gap-1">
                    <LuPlus /> Adicionar Item
                  </button>
                </div>

              </div>

              <div className="bg-gray-50 px-6 py-4 border-t flex justify-end gap-3">
                <button onClick={() => setCreating(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg">Cancelar</button>
                <button onClick={handleCreateProductWithOrder} className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-bold shadow-md">
                  Confirmar Pedido
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </GenericPanelLayout>
  );
}