import { useEffect, useState } from "react";
import { api } from "../../../api/lib/api";
import { GenericPanelLayout } from "../../../components/Layout/company/layoutOption";
import { LuSearch } from "react-icons/lu";

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


export default function OrderManager() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filtered, setFiltered] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");


  // Carrega pedidos
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


  // Filtro de busca
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setFiltered(
      orders.filter(
        (o) =>
          String(o.id).includes(value) ||
          (o.recipient &&
            o.recipient.toLowerCase().includes(value.toLowerCase())) ||
          (o.code && o.code.toLowerCase().includes(value.toLowerCase()))
      )
    );
  };


  return (
    <GenericPanelLayout panel="pedido">
      <div className="bg-white max-w-5xl w-full rounded-3xl shadow-xl p-10 min-h-[600px]">
        <h1 className="text-3xl text-center mb-8">Pedidos</h1>

        {/* Header */}
        <div className="flex justify-between mb-6">
          <div className="flex items-center gap-2 border border-black rounded-lg px-4 py-2">
            <LuSearch />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Buscar por destinatário..."
              className="outline-none"
            />
          </div>
        </div>

        {/* Lista de pedidos */}
        <div className="border-t border-black">
          {loading ? (
            <p className="text-center py-4 text-gray-500">Carregando...</p>
          ) : (
            filtered.map((order) => (
              <div
                key={order.id}
                className="flex justify-between border-b border-black py-4 px-4 hover:bg-gray-50"
              >
                <div>
                  <p className="font-bold">Pedido: {order.code}</p>
                  <p className="text-gray-600">
                    <b>Destinatário:</b> {order.recipient}
                  </p>
                  <p className="text-gray-500 text-sm">
                    <b>Status:</b> {order.status}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
        </div>
    </GenericPanelLayout>
  );
}
