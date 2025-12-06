import { useEffect, useState } from "react";
import { api } from "../../../api/lib/api";
import { GenericPanelLayout } from "../../../components/Layout/company/layoutOption";
import { LuSearch, LuTrash2, LuPencil, LuPlus } from "react-icons/lu";

type Product = {
  name?: string;
  description?: string;
  quantity?: number;
};

type Recipient = {
  name: string;
  cpf: string;
  email: string;
  address: {
    street?: string | null;
    number?: number | null;
    complement?: string | null;
    city?: string | null;
    state?: string | null;
    country?: string | null;
    zipcode?: string | null;
  };
};

type Order = {
  id: number;
  vehicle_id: number;
  recipient: Recipient;
  products: Product[];
};

export default function OrderManager() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filtered, setFiltered] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal
  const [creating, setCreating] = useState(false);

  // Dados do pedido novo
  const [newOrder, setNewOrder] = useState({
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
        country: "",
        zipcode: "",
      },
    },
    products: [
      { name: "", description: "", quantity: 1 }
    ],
  });

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
      orders.filter((o) =>
        String(o.id).includes(value) ||
        o.recipient.name.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  const handleAddProduct = () => {
    setNewOrder({
      ...newOrder,
      products: [...newOrder.products, { name: "", description: "", quantity: 1 }],
    });
  };

  const handleRemoveProduct = (index: number) => {
    const updated = [...newOrder.products];
    updated.splice(index, 1);
    setNewOrder({ ...newOrder, products: updated });
  };

  const handleCreate = async () => {
    try {
      const payload = {
        vehicle_id: Number(newOrder.vehicle_id),
        recipient: {
          ...newOrder.recipient,
          address: {
            ...newOrder.recipient.address,
            number: Number(newOrder.recipient.address.number) || null,
          },
        },
        products: newOrder.products.map((p) => ({
          name: p.name,
          description: p.description,
          quantity: Number(p.quantity),
        })),
      };

      await api.post("/order/company", payload);

      const list = await api.get("/order");
      setOrders(list.data);
      setFiltered(list.data);

      setCreating(false);
      alert("Pedido criado com sucesso!");

      setNewOrder({
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
            country: "",
            zipcode: "",
          },
        },
        products: [{ name: "", description: "", quantity: 1 }],
      });
    } catch (err) {
      console.error(err);
      alert("Erro ao criar pedido");
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
              placeholder="Buscar por ID ou destinatário..."
              className="outline-none"
            />
          </div>
        </div>

        {/* Lista */}
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
                  <p className="font-bold">Pedido #{order.id}</p>
                  <p className="text-gray-600">
                    Destinatário: {order.recipient.name}
                  </p>
                  <p className="text-gray-500 text-sm">
                    Produtos: {order.products?.length ?? 0}
                  </p>
                </div>

                <button className="text-red-600 text-2xl hover:text-red-800">
                  <LuTrash2 />
                </button>
              </div>
            ))
          )}
        </div>

        {/* MODAL CRIAÇÃO */}
        {creating && (
          <div className="fixed top-0 left-0 w-full h-full bg-black/40 flex justify-center items-center z-[1000]">
            <div className="bg-white w-[650px] p-6 rounded-2xl shadow-xl max-h-[90vh] overflow-auto z-[1001]">
              <h2 className="text-2xl font-semibold mb-4">Criar Pedido</h2>

              {/* Veículo */}
              <div className="mb-3">
                <label className="block mb-1">ID do Veículo</label>
                <input
                  className="border p-2 rounded w-full"
                  value={newOrder.vehicle_id}
                  onChange={(e) =>
                    setNewOrder({ ...newOrder, vehicle_id: e.target.value })
                  }
                />
              </div>

              {/* Destinatário */}
              <h3 className="font-semibold text-lg mt-4 mb-2">Destinatário</h3>
              {Object.entries(newOrder.recipient).map(([field, value]) => {
                if (field === "address") return null;
                return (
                  <div key={field} className="mb-3">
                    <label className="block mb-1">{field}</label>
                    <input
                      className="border p-2 rounded w-full"
                      value={value as string}
                      onChange={(e) =>
                        setNewOrder({
                          ...newOrder,
                          recipient: {
                            ...newOrder.recipient,
                            [field]: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                );
              })}

              {/* Endereço */}
              <h3 className="font-semibold text-lg mt-4 mb-2">Endereço</h3>
              {Object.entries(newOrder.recipient.address).map(([field, value]) => (
                <div key={field} className="mb-3">
                  <label className="block mb-1">{field}</label>
                  <input
                    className="border p-2 rounded w-full"
                    value={value as string}
                    onChange={(e) =>
                      setNewOrder({
                        ...newOrder,
                        recipient: {
                          ...newOrder.recipient,
                          address: {
                            ...newOrder.recipient.address,
                            [field]: e.target.value,
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
                      Remover
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
                  onClick={handleCreate}
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
