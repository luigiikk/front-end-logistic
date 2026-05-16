import { useEffect, useState } from "react";
import { api } from "../../../api/lib/api";
import { GenericPanelLayout } from "../../../components/Layout/company/layoutOption";
import { 
  LuSearch, 
  LuPackage, 
  LuClipboardList, 
  LuUser, 
  LuTruck 
} from "react-icons/lu";

// ─── Tipos ────────────────────────────────────────────────────────────────────

type Product = {
  name?: string;
  description?: string;
  quantity?: number;
};

type Order = {
  id: number;
  code: string;
  vehicle_id: number;
  recipient: string;
  sender_client: string;
  status: string;
  products: Product[];
};

// ─── Componente Principal ─────────────────────────────────────────────────────

export default function OrderManager() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filtered, setFiltered] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function loadOrders() {
      try {
        const res = await api.get("/order");
        setOrders(res.data);
        setFiltered(res.data);
      } catch (err) {
        console.error("Erro ao carregar pedidos", err);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setFiltered(
      orders.filter(
        (o) =>
          String(o.id).includes(value) ||
          (o.recipient && o.recipient.toLowerCase().includes(value.toLowerCase())) ||
          (o.code && o.code.toLowerCase().includes(value.toLowerCase()))
      )
    );
  };

  return (
    <GenericPanelLayout panel="pedido">
      <div className="w-full max-w-5xl mx-auto space-y-6">
        
        {/* ── Cabeçalho (Estilo Company) ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#384A6C] tracking-tight">
              Gestão de Pedidos
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Visualização de entregas e status do sistema
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Busca Padronizada */}
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm">
              <LuSearch size={15} className="text-gray-400 shrink-0" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Buscar pedido ou destinatário..."
                className="outline-none text-sm text-gray-700 placeholder-gray-300 w-64"
              />
            </div>
          </div>
        </div>

        {/* ── Lista de Pedidos (Estilo Card) ── */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="animate-spin h-6 w-6 border-2 border-[#94C0E0] border-t-transparent rounded-full" />
              <p className="text-sm text-gray-400">Carregando listagem...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-2 text-gray-400">
              <LuClipboardList size={32} className="opacity-30" />
              <p className="text-sm font-medium">Nenhum pedido encontrado.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-50">
              {filtered.map((order) => (
                <li
                  key={order.id}
                  className="flex items-center justify-between px-6 py-4 hover:bg-[#EEF5FB]/60 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {/* Ícone Lateral */}
                    <div className="w-10 h-10 rounded-full bg-[#384A6C]/10 flex items-center justify-center text-[#384A6C] shrink-0">
                      <LuPackage size={18} />
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-800 text-sm">
                          Pedido: {order.code}
                        </p>
                        <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded font-bold uppercase">
                          ID {order.id}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-400 mt-1 flex-wrap">
                        <span className="flex items-center gap-1">
                          <LuUser size={11} /> <b>Destinatário:</b> {order.recipient}
                        </span>
                        <span className="flex items-center gap-1">
                          <LuTruck size={11} /> <b>Veículo:</b> {order.vehicle_id || "Não atribuído"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status do Pedido */}
                  <div className="flex items-center gap-4 ml-4">
                    <span className="px-3 py-1 rounded-full bg-[#EEF5FB] text-[#384A6C] text-[10px] font-bold uppercase tracking-wider border border-[#94C0E0]/30">
                      {order.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </GenericPanelLayout>
  );
}