/* OrderManager.tsx */
import { useEffect, useState } from "react";
import { api } from "../../../api/lib/api";
import { LuSearch, LuTrash2, LuPencil, LuPlus } from "react-icons/lu";
import { OrderLayout } from "../../../components/Layout/company/orderLyout"; // Pode criar um OrderLayout similar

type Address = {
  street?: string | null;
  number?: number | null;
  complement?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  zipcode?: string | null;
};

type Recipient = {
  name: string;
  cpf: string;
  email: string;
  address?: Address;
};

type Order = {
  id: number;
  company_id: number;
  recipient: Recipient;
  vehicle_id?: number | null;
  status_id?: number | null;
};

export default function OrderManager() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filtered, setFiltered] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [editing, setEditing] = useState<Order | null>(null);
  const [creating, setCreating] = useState(false);

  const [newOrder, setNewOrder] = useState<Order>({
    id: 0,
    company_id: 0,
    recipient: {
      name: "",
      cpf: "",
      email: "",
      address: {
        street: "",
        number: null,
        complement: "",
        city: "",
        state: "",
        country: "",
        zipcode: "",
      },
    },
    vehicle_id: null,
    status_id: null,
  });

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.get("/order");
        setOrders(res.data);
        setFiltered(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setFiltered(
      orders.filter(
        (o) =>
          o.recipient.name.toLowerCase().includes(value.toLowerCase()) ||
          String(o.id).includes(value)
      )
    );
  };

  const handleDelete = async (id: number) => {
    if (!confirm(`Deseja realmente excluir o pedido #${id}?`)) return;
    try {
      await api.delete(`/order/${id}`);
      setOrders(orders.filter((o) => o.id !== id));
      setFiltered(filtered.filter((o) => o.id !== id));
      alert("Pedido excluído com sucesso!");
    } catch {
      alert("Erro ao deletar pedido");
    }
  };

  const handleEdit = async (id: number) => {
    try {
      const res = await api.get(`/order/${id}`);
      setEditing(res.data);
    } catch (err) {
      alert("Erro ao carregar informações do pedido");
      console.error(err);
    }
  };

  const handleSave = async () => {
    if (!editing) return;
    try {
      const payload = {
        vehicle_id: editing.vehicle_id ?? undefined,
        status_id: editing.status_id ?? undefined,
        recipient: {
          name: editing.recipient.name,
          cpf: editing.recipient.cpf,
          email: editing.recipient.email,
          address: editing.recipient.address,
        },
      };
      await api.put(`/order/${editing.id}`, payload);
      setOrders(orders.map((o) => (o.id === editing.id ? { ...editing } : o)));
      setFiltered(filtered.map((o) => (o.id === editing.id ? { ...editing } : o)));
      alert("Pedido atualizado com sucesso!");
      setEditing(null);
    } catch (error: any) {
      console.error("Erro ao atualizar pedido:", error.response?.data || error);
      alert("Erro ao atualizar pedido. Verifique os dados.");
    }
  };

  const handleCreate = async () => {
    try {
      const payload = {
        company_id: newOrder.company_id,
        recipient: newOrder.recipient,
      };
      await api.post("/order", payload);
      const list = await api.get("/order");
      setOrders(list.data);
      setFiltered(list.data);
      setCreating(false);
      setNewOrder({
        id: 0,
        company_id: 0,
        recipient: { name: "", cpf: "", email: "", address: {} },
        vehicle_id: null,
        status_id: null,
      });
      alert("Pedido cadastrado com sucesso!");
    } catch (err: any) {
      alert("Erro ao cadastrar pedido");
    }
  };

  return (
    <OrderLayout backLink="/company">
      <div className="bg-white max-w-5xl w-full rounded-3xl shadow-xl p-10 min-h-[600px]">
        <h1 className="text-3xl text-center mb-8">Pedidos</h1>

        <div className="flex justify-between mb-6">
          <button
            onClick={() => setCreating(true)}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            <LuPlus /> Cadastrar Pedido
          </button>

          <div className="flex items-center gap-2 border border-black rounded-lg px-4 py-2">
            <LuSearch />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Buscar por nome ou ID..."
              className="outline-none"
            />
          </div>
        </div>

        <div className="border-t border-black">
          {loading ? (
            <p className="text-center py-4 text-gray-500">Carregando...</p>
          ) : (
            filtered.map((o) => (
              <div
                key={o.id}
                className="flex justify-between border-b border-black py-4 items-center px-4 hover:bg-gray-50"
              >
                <div>
                  <p className="font-semibold text-lg">
                    Pedido #{o.id} — {o.recipient.name}
                  </p>
                  <p className="text-sm text-gray-600">{o.recipient.email}</p>
                  <p className="text-sm text-gray-500">
                    CPF: {o.recipient.cpf}
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => handleEdit(o.id)}
                    className="text-blue-600 text-2xl hover:text-blue-800"
                  >
                    <LuPencil />
                  </button>
                  <button
                    onClick={() => handleDelete(o.id)}
                    className="text-red-600 text-2xl hover:text-red-800"
                  >
                    <LuTrash2 />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* MODAL EDIÇÃO */}
        {editing && (
          <div className="fixed top-0 left-0 w-full h-full bg-black/40 flex justify-center items-center z-[1000]">
            <div className="bg-white w-[600px] p-6 rounded-2xl shadow-xl max-h-[85vh] overflow-auto z-[1001]">
              <h2 className="text-2xl font-semibold mb-4">Editar Pedido</h2>
              <div className="grid grid-cols-2 gap-4">
                {["name", "cpf", "email"].map((field) => (
                  <div key={field}>
                    <label className="block mb-1">{field}</label>
                    <input
                      type="text"
                      value={(editing.recipient as any)[field]}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          recipient: {
                            ...editing.recipient,
                            [field]: e.target.value,
                          },
                        })
                      }
                      className="border p-2 rounded w-full"
                    />
                  </div>
                ))}
                {/* Endereço */}
                {editing.recipient.address &&
                  Object.entries(editing.recipient.address).map(([key, value]) => (
                    <div key={key}>
                      <label className="block mb-1">{key}</label>
                      <input
                        type={key === "number" ? "number" : "text"}
                        value={value ?? ""}
                        onChange={(e) =>
                          setEditing({
                            ...editing,
                            recipient: {
                              ...editing.recipient,
                              address: {
                                ...editing.recipient.address,
                                [key]: key === "number" ? Number(e.target.value) : e.target.value,
                              },
                            },
                          })
                        }
                        className="border p-2 rounded w-full"
                      />
                    </div>
                  ))}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setEditing(null)}
                  className="text-gray-600 hover:underline"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL CRIAÇÃO */}
        {creating && (
          <div className="fixed top-0 left-0 w-full h-full bg-black/40 flex justify-center items-center z-[1000]">
            <div className="bg-white w-[600px] p-6 rounded-2xl shadow-xl max-h-[85vh] overflow-auto z-[1001]">
              <h2 className="text-2xl font-semibold mb-4">Cadastrar Pedido</h2>
              <div className="grid grid-cols-2 gap-4">
                {["name", "cpf", "email"].map((field) => (
                  <div key={field}>
                    <label className="block mb-1">{field}</label>
                    <input
                      type="text"
                      value={(newOrder.recipient as any)[field]}
                      onChange={(e) =>
                        setNewOrder({
                          ...newOrder,
                          recipient: {
                            ...newOrder.recipient,
                            [field]: e.target.value,
                            address: newOrder.recipient.address,
                          },
                        })
                      }
                      className="border p-2 rounded w-full"
                    />
                  </div>
                ))}
                {/* Endereço */}
                {Object.entries(newOrder.recipient.address || {}).map(([key, value]) => (
                  <div key={key}>
                    <label className="block mb-1">{key}</label>
                    <input
                      type={key === "number" ? "number" : "text"}
                      value={value ?? ""}
                      onChange={(e) =>
                        setNewOrder({
                          ...newOrder,
                          recipient: {
                            ...newOrder.recipient,
                            address: {
                              ...newOrder.recipient.address,
                              [key]: key === "number" ? Number(e.target.value) : e.target.value,
                            },
                          },
                        })
                      }
                      className="border p-2 rounded w-full"
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3 mt-6">
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
                  Cadastrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </OrderLayout>
  );
}
