import { useEffect, useState } from "react";
import { api } from "../../../api/lib/api";
import { GenericPanelLayout } from "../../../components/Layout/company/layoutOption";
import { LuSearch, LuTrash2, LuPlus, LuBox, LuUser, LuMapPin, LuX, LuMail, LuFileText } from "react-icons/lu";
import { useToast } from "../../../components/Toast/ToastContent";
import { InputField } from "../../../components/ui/Input/inputField";

// --- TIPOS ---

type Product = {
  name: string;
  description: string;
  quantity: number;
};

type Order = {
  id: number;
  code: string;
  recipient: string; // Nome do destinatário para a tabela
  sender_client: string;
  status: string;
  products?: Product[];
};

type NewOrderForm = {
  recipient: {
    name: string;
    cpf: string; // Corresponde ao CNPJ do destinatário
    email: string;
    address: {
      street: string;
      number: string;
      complement: string;
      city: string;
      state: string;
      country: string;
      zipcode: string;
    }
  };
  products: Product[];
};

const initialOrderState: NewOrderForm = {
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
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filtered, setFiltered] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [creating, setCreating] = useState(false);
  const [newOrder, setNewOrder] = useState<NewOrderForm>(initialOrderState);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await api.get("/order");
      setOrders(res.data);
      setFiltered(res.data);
    } catch (err) {
      toast("Erro ao carregar pedidos.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setFiltered(orders.filter(o => 
      String(o.id).includes(value) || 
      (o.recipient && o.recipient.toLowerCase().includes(value.toLowerCase())) ||
      (o.code && o.code.toLowerCase().includes(value.toLowerCase()))
    ));
  };

  const updateRecipient = (field: keyof NewOrderForm['recipient'], value: string) => {
    setNewOrder(prev => ({
      ...prev,
      recipient: { ...prev.recipient, [field]: value }
    }));
  };

  const updateAddress = (field: keyof NewOrderForm['recipient']['address'], value: string) => {
    setNewOrder(prev => ({
      ...prev,
      recipient: {
        ...prev.recipient,
        address: { ...prev.recipient.address, [field]: value }
      }
    }));
  };

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

  const handleCreateProductWithOrder = async () => {
    try {
      if (!newOrder.recipient.name || !newOrder.recipient.cpf) {
        return toast("Preencha os dados do destinatário", "info");
      }

      const payload = {
        recipient: {
          name: newOrder.recipient.name,
          cpf: newOrder.recipient.cpf.replace(/\D/g, ""), // Limpa o CNPJ no submit
          email: newOrder.recipient.email,
          address: {
            street: newOrder.recipient.address.street,
            number: newOrder.recipient.address.number ? Number(newOrder.recipient.address.number) : null,
            complement: newOrder.recipient.address.complement,
            city: newOrder.recipient.address.city,
            state: newOrder.recipient.address.state,
            country: newOrder.recipient.address.country,
            zipcode: newOrder.recipient.address.zipcode.replace(/\D/g, ""),
          }
        },
        products: newOrder.products.map(p => ({
          name: p.name,
          description: p.description,
          quantity: Number(p.quantity)
        }))
      };

      await api.post("/order/client", payload);
      await loadOrders();
      setCreating(false);
      setNewOrder(initialOrderState);
      toast("Pedido e Destinatário criados com sucesso!", "success");
    } catch (err: any) {
      toast("Erro ao criar pedido", "error");
    }
  };

  const handleDeleteOrder = async (orderId: number) => {
    if (!confirm("Tem certeza que deseja excluir este pedido?")) return;
    try {
      await api.delete(`/order/${orderId}`);
      setOrders(prev => prev.filter(o => o.id !== orderId));
      setFiltered(prev => prev.filter(o => o.id !== orderId));
      toast("Pedido excluído com sucesso!", "success");
    } catch (err) { 
      toast("Erro ao excluir", "error"); 
    }
  };

  return (
    <GenericPanelLayout panel="pedido">
      <div className="w-full max-w-5xl mx-auto space-y-6">
        
        {/* ── Cabeçalho ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#384A6C] tracking-tight">Gerenciar Pedidos</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {filtered.length} pedido{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Busca padronizada */}
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm">
              <LuSearch size={15} className="text-gray-400 shrink-0" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Buscar destinatário..."
                className="outline-none text-sm text-gray-700 placeholder-gray-300 w-52"
              />
            </div>

            <button
              onClick={() => setCreating(true)}
              className="flex items-center gap-2 bg-[#384A6C] text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-[#2f3e5c] active:scale-95 transition-all shadow-sm cursor-pointer"
            >
              <LuPlus size={16} />
              Novo Pedido
            </button>
          </div>
        </div>

        {/* ── Lista de Pedidos (Estilo Card) ── */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
               <div className="animate-spin h-6 w-6 border-2 border-[#94C0E0] border-t-transparent rounded-full" />
               <p className="text-sm text-gray-400">Carregando pedidos...</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-50">
              {filtered.map((order) => (
                <li key={order.id} className="flex items-center justify-between px-6 py-4 hover:bg-[#EEF5FB]/60 transition-colors gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-[#384A6C]/10 flex items-center justify-center text-[#384A6C] font-bold shrink-0">
                      #{order.code?.slice(-2) || order.id}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 text-sm truncate">Pedido {order.code || `#${order.id}`}</p>
                      <p className="text-xs text-gray-400 truncate">Destinatário: {order.recipient}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="px-3 py-1 rounded-full bg-blue-50 text-[#384A6C] text-[10px] font-bold uppercase tracking-wider border border-blue-200">
                      {order.status}
                    </span>
                    <button onClick={() => handleDeleteOrder(order.id)} className="p-2 rounded-xl text-red-400 hover:bg-red-50 transition cursor-pointer" title="Excluir">
                      <LuTrash2 size={16} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* ── Modal de Criação ── */}
      {creating && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl max-h-[90vh] overflow-auto flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-8 pt-7 pb-4 border-b border-gray-100 shrink-0">
              <h2 className="text-xl font-extrabold text-[#384A6C] tracking-tight">Novo Pedido</h2>
              <button
                onClick={() => setCreating(false)}
                className="text-gray-400 hover:text-gray-600 transition p-1 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                <LuX size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="px-8 py-6 space-y-6 overflow-y-auto flex-1">
              {/* Dados do Destinatário */}
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <LuUser size={12} /> Dados do Destinatário
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <InputField
                    label="Nome completo *"
                    icon={LuUser}
                    placeholder="Nome do destinatário"
                    value={newOrder.recipient.name}
                    onChange={(e) => updateRecipient("name", e.target.value)}
                  />
                  <InputField
                    label="CNPJ do Destinatário *"
                    icon={LuFileText}
                    maskType="cnpj"
                    placeholder="00.000.000/0001-00"
                    value={newOrder.recipient.cpf}
                    onChange={(e) => updateRecipient("cpf", e.target.value)}
                  />
                  <InputField
                    label="E-mail"
                    icon={LuMail}
                    type="email"
                    placeholder="destinatario@email.com"
                    containerClassName="col-span-2"
                    value={newOrder.recipient.email}
                    onChange={(e) => updateRecipient("email", e.target.value)}
                  />
                </div>
              </div>

              {/* Endereço */}
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <LuMapPin size={12} /> Endereço de Entrega
                </p>
                <div className="grid grid-cols-6 gap-3">
                  <InputField
                    label="Rua"
                    containerClassName="col-span-4"
                    placeholder="Nome da rua"
                    value={newOrder.recipient.address.street}
                    onChange={(e) => updateAddress("street", e.target.value)}
                  />
                  <InputField
                    label="Número"
                    containerClassName="col-span-2"
                    placeholder="Ex: 123"
                    value={newOrder.recipient.address.number}
                    onChange={(e) => updateAddress("number", e.target.value)}
                  />
                  <InputField
                    label="Complemento"
                    containerClassName="col-span-3"
                    placeholder="Apto, sala, bloco..."
                    value={newOrder.recipient.address.complement}
                    onChange={(e) => updateAddress("complement", e.target.value)}
                  />
                  <InputField
                    label="CEP"
                    containerClassName="col-span-3"
                    maskType="cep"
                    placeholder="00000-000"
                    value={newOrder.recipient.address.zipcode}
                    onChange={(e) => updateAddress("zipcode", e.target.value)}
                  />
                  <InputField
                    label="Cidade"
                    containerClassName="col-span-2"
                    placeholder="Cidade"
                    value={newOrder.recipient.address.city}
                    onChange={(e) => updateAddress("city", e.target.value)}
                  />
                  <InputField
                    label="Estado"
                    containerClassName="col-span-2"
                    placeholder="UF"
                    value={newOrder.recipient.address.state}
                    onChange={(e) => updateAddress("state", e.target.value)}
                  />
                  <InputField
                    label="País"
                    containerClassName="col-span-2"
                    placeholder="Brasil"
                    value={newOrder.recipient.address.country}
                    onChange={(e) => updateAddress("country", e.target.value)}
                  />
                </div>
              </div>

              {/* Produtos */}
              <div className="border-t border-gray-100 pt-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                    <LuBox size={12} /> Produtos do Pedido
                  </p>
                  <button
                    onClick={handleAddProduct}
                    className="flex items-center gap-1 text-xs font-bold text-[#384A6C] hover:text-[#2f3e5c] transition-colors cursor-pointer"
                  >
                    <LuPlus size={14} /> Adicionar Produto
                  </button>
                </div>

                <div className="space-y-4">
                  {newOrder.products.map((p, idx) => (
                    <div key={idx} className="flex flex-col gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100 relative">
                      {newOrder.products.length > 1 && (
                        <button
                          onClick={() => handleRemoveProduct(idx)}
                          className="absolute right-3 top-3 text-red-400 hover:text-red-600 text-xs font-bold transition cursor-pointer"
                        >
                          Remover
                        </button>
                      )}
                      <div className="grid grid-cols-3 gap-3 pt-2">
                        <InputField
                          label="Nome do Produto *"
                          containerClassName="col-span-2"
                          placeholder="Ex: Teclado Mecânico"
                          value={p.name}
                          onChange={(e) => updateProduct(idx, "name", e.target.value)}
                        />
                        <InputField
                          label="Quantidade *"
                          type="number"
                          min={1}
                          placeholder="1"
                          value={p.quantity}
                          onChange={(e) => updateProduct(idx, "quantity", Number(e.target.value))}
                        />
                        <InputField
                          label="Descrição"
                          containerClassName="col-span-3"
                          placeholder="Informações adicionais do produto"
                          value={p.description}
                          onChange={(e) => updateProduct(idx, "description", e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-8 py-5 border-t border-gray-100 shrink-0">
              <button
                onClick={() => setCreating(false)}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateProductWithOrder}
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-[#384A6C] hover:bg-[#2f3e5c] active:scale-95 transition-all cursor-pointer"
              >
                Criar Pedido
              </button>
            </div>
          </div>
        </div>
      )}
    </GenericPanelLayout>
  );
}