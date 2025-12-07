import { useEffect, useState } from "react";
import { api } from "../../../api/lib/api";
import { GenericPanelLayout } from "../../../components/Layout/company/layoutOption";
import { LuSearch, LuTrash2, LuPlus } from "react-icons/lu";

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

type NewOrderType = {
  vehicle_id: number | "";
  recipient: {
    name: string;
    cpf: string;
    email: string;
    address: {
      street: string;
      number: number;
      complement: string;
      city: string;
      state: string;
      country: string;
      zipcode: string;
    };
  };
  products: { name: string; description: string; quantity: number }[];
};

export default function OrderManager() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filtered, setFiltered] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [creating, setCreating] = useState(false);
  const [vehicles, setVehicles] = useState<
    { id: number; plate: string; model?: string }[]
  >([]);
  const [vehicleId, setVehicleId] = useState<number | "">("");

  const [newOrder, setNewOrder] = useState<NewOrderType>({
    vehicle_id: "",
    recipient: {
      name: "",
      cpf: "",
      email: "",
      address: {
        street: "",
        number: 0,
        complement: "",
        city: "",
        state: "",
        country: "",
        zipcode: "",
      },
    },
    products: [{ name: "", description: "", quantity: 1 }],
  });

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

  // Carrega veículos
  useEffect(() => {
    async function loadVehicles() {
      try {
        const res = await api.get("/vehicle");
        setVehicles(res.data);
      } catch (err) {
        console.error("Erro ao carregar veículos:", err);
      }
    }
    loadVehicles();
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

  // Adiciona produto no pedido novo
  const handleAddProduct = () => {
    setNewOrder({
      ...newOrder,
      products: [
        ...newOrder.products,
        { name: "", description: "", quantity: 1 },
      ],
    });
  };

  // Remove produto do pedido novo
  const handleRemoveProduct = (index: number) => {
    const updated = [...newOrder.products];
    updated.splice(index, 1);
    setNewOrder({ ...newOrder, products: updated });
  };

  // Criar pedido
  const handleCreateProductWithOrder = async () => {
    try {
      if (!vehicleId) return alert("Selecione um veículo");
      if (newOrder.products.length === 0)
        return alert("Adicione pelo menos um produto ao pedido");

      const orderPayload = {
        vehicle_id: vehicleId,
        recipient: {
          ...newOrder.recipient,
          address: {
            ...newOrder.recipient.address,
            number: Number(newOrder.recipient.address.number),
          },
        },
        products: newOrder.products,
      };

      const orderResponse = await api.post("/order/company", orderPayload);
      const createdOrder = orderResponse.data;

      setOrders([createdOrder, ...orders]);
      setFiltered([createdOrder, ...filtered]);
      setCreating(false);

      // Reset novo pedido
      setNewOrder({
        vehicle_id: "",
        recipient: {
          name: "",
          cpf: "",
          email: "",
          address: {
            street: "",
            number: 0,
            complement: "",
            city: "",
            state: "",
            country: "",
            zipcode: "",
          },
        },
        products: [{ name: "", description: "", quantity: 1 }],
      });

      alert("Pedido criado com sucesso!");
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Erro ao criar pedido");
    }
  };

  // Excluir pedido
  const handleDeleteOrder = async (orderId: number) => {
    if (!confirm("Tem certeza que deseja excluir este pedido?")) return;

    try {
      await api.delete(`/order/${orderId}`);
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      setFiltered((prev) => prev.filter((o) => o.id !== orderId));
      alert("Pedido excluído com sucesso!");
    } catch (err: any) {
      console.error(err);
       console.error("Erro ao excluir pedido:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Erro ao excluir pedido");
    }
  };

  return (
    <GenericPanelLayout panel="pedido">
      <div className="bg-white max-w-5xl w-full rounded-3xl shadow-xl p-10 min-h-[600px]">
        <h1 className="text-3xl text-center mb-8">Pedidos</h1>

        {/* Header */}
        <div className="flex justify-between mb-6">
          <button
            onClick={() => setCreating(true)}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            <LuPlus /> Criar Pedido
          </button>

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
                {/* Botão de excluir pedido */}
                <button
                  onClick={() => handleDeleteOrder(order.id)}
                  className="text-red-600 text-2xl hover:text-red-800"
                >
                  <LuTrash2 />
                </button>
              </div>
            ))
          )}
        </div>

        {/* MODAL DE CRIAÇÃO */}
        {creating && (
          <div className="fixed top-0 left-0 w-full h-full bg-black/40 flex justify-center items-center z-[1000]">
            <div className="bg-white w-[650px] p-6 rounded-2xl shadow-xl max-h-[90vh] overflow-auto z-[1001]">
              <h2 className="text-2xl font-semibold mb-4">Criar Pedido</h2>

              {/* Veículo */}
              <label className="block mb-1">Veículo</label>
              <select
                value={vehicleId}
                onChange={(e) => {
                  const id = Number(e.target.value);
                  setVehicleId(id);
                  setNewOrder({ ...newOrder, vehicle_id: id });
                }}
                className="border p-2 rounded w-full mb-4"
              >
                <option value="">Selecione um veículo</option>
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.plate} - {v.model}
                  </option>
                ))}
              </select>

              {/* Destinatário */}
              <h3 className="font-semibold text-lg mt-4 mb-2">Destinatário</h3>
              {["name", "cpf", "email"].map((key) => (
                <div key={key} className="mb-3">
                  <label className="block mb-1">{key.toUpperCase()}</label>
                  <input
                    className="border p-2 rounded w-full"
                    value={(newOrder.recipient as any)[key]}
                    onChange={(e) =>
                      setNewOrder({
                        ...newOrder,
                        recipient: {
                          ...newOrder.recipient,
                          [key]: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              ))}

              {/* Endereço */}
              <h3 className="font-semibold text-lg mt-4 mb-2">Endereço</h3>
              {[
                "street",
                "number",
                "complement",
                "city",
                "state",
                "country",
                "zipcode",
              ].map((key) => (
                <div key={key} className="mb-3">
                  <label className="block mb-1">{key.toUpperCase()}</label>
                  <input
                    className="border p-2 rounded w-full"
                    value={(newOrder.recipient.address as any)[key]}
                    onChange={(e) =>
                      setNewOrder({
                        ...newOrder,
                        recipient: {
                          ...newOrder.recipient,
                          address: {
                            ...newOrder.recipient.address,
                            [key]:
                              key === "number"
                                ? Number(e.target.value)
                                : e.target.value,
                          },
                        },
                      })
                    }
                  />
                </div>
              ))}

              {/* Produtos */}
              <h3 className="font-semibold text-lg mt-4 mb-2">Produtos</h3>
              {newOrder.products.map((p, index) => (
                <div key={index} className="border p-3 rounded mb-3">
                  <div className="grid grid-cols-3 gap-3">
                    <input
                      placeholder="Nome"
                      className="border p-2 rounded"
                      value={p.name}
                      onChange={(e) => {
                        const updated = [...newOrder.products];
                        updated[index].name = e.target.value;
                        setNewOrder({ ...newOrder, products: updated });
                      }}
                    />
                    <input
                      placeholder="Descrição"
                      className="border p-2 rounded"
                      value={p.description}
                      onChange={(e) => {
                        const updated = [...newOrder.products];
                        updated[index].description = e.target.value;
                        setNewOrder({ ...newOrder, products: updated });
                      }}
                    />
                    <input
                      type="number"
                      placeholder="Qtd"
                      className="border p-2 rounded"
                      value={p.quantity}
                      onChange={(e) => {
                        const updated = [...newOrder.products];
                        updated[index].quantity = Number(e.target.value);
                        setNewOrder({ ...newOrder, products: updated });
                      }}
                    />
                  </div>

                  {index > 0 && (
                    <button
                      onClick={() => handleRemoveProduct(index)}
                      className="text-red-600 mt-2 hover:underline"
                    >
                      Remover Produto
                    </button>
                  )}
                </div>
              ))}

              <button
                onClick={handleAddProduct}
                className="text-blue-600 hover:underline my-2"
              >
                + Adicionar Produto
              </button>

              {/* Botões */}
              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setCreating(false)}
                  className="text-gray-600 hover:underline"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreateProductWithOrder}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Criar Pedido
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </GenericPanelLayout>
  );
}
