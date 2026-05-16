import { useEffect, useState } from "react";
import { api } from "../../../api/lib/api";
import { GenericPanelLayout } from "../../../components/Layout/company/layoutOption";
import { LuSearch, LuTrash2, LuPlus, LuBox, LuUser, LuMapPin } from "react-icons/lu";
import { useToast } from "../../../components/Toast/ToastContent";

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
  recipient: string; // Nome resumido do destinatário para a tabela
  sender_client: string;
  status: string;
  products?: Product[];
};

type Status = {
  id: number;
  name: string;
};

// Tipo para CRIAÇÃO (Estrutura complexa que o Back-end exige)
type NewOrderForm = {
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
    loadStatuses();
  }, []);

  // --- CARREGAMENTOS ---
  const loadOrders = async () => {
    try {
      const res = await api.get("/order");
      setOrders(res.data);
      setFiltered(res.data);
    } catch (err) {
      toast("Erro ao carregar pedidos:", "error");
    } finally {
      setLoading(false);
    }
  };

  const loadStatuses = async () => { /* ... sua lógica ... */ };
  

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
      if (!newOrder.recipient.name || !newOrder.recipient.cpf) return toast("Preencha os dados do destinatário", "info");

      // Montando payload conforme interface OrderRegisterCompanyParams
      const payload = {
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

      await api.post("/order/client", payload); // Ajuste a rota se necessário

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
    } catch (err) { toast("Erro ao excluir", "error"); }
  };

  // --- RENDERIZAÇÃO ---

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
            className="flex items-center gap-2 bg-[#384A6C] text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-[#2f3e5c] active:scale-95 transition-all shadow-sm"
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
             {/* Spinner padronizado conforme a tela de company/client */}
             <div className="animate-spin h-6 w-6 border-2 border-[#94C0E0] border-t-transparent rounded-full" />
             <p className="text-sm text-gray-400">Carregando pedidos...</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-50">
            {filtered.map((order) => (
              <li key={order.id} className="flex items-center justify-between px-6 py-4 hover:bg-[#EEF5FB]/60 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#384A6C]/10 flex items-center justify-center text-[#384A6C] font-bold">
                    #{order.code?.slice(-2) || order.id}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">Pedido {order.code}</p>
                    <p className="text-xs text-gray-400">Destinatário: {order.recipient}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-blue-50 text-[#384A6C] text-[10px] font-bold uppercase tracking-wider">
                    {order.status}
                  </span>
                  <button onClick={() => handleDeleteOrder(order.id)} className="p-2 rounded-xl text-red-400 hover:bg-red-50 transition">
                    <LuTrash2 size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
    
    {/* O modal de criação deve seguir o estilo do ClientModal de company/client/index.tsx */}
  </GenericPanelLayout>
);
}