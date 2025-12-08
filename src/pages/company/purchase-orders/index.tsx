import { useEffect, useState } from "react";
import { api } from "../../../api/lib/api";
import { GenericPanelLayout } from "../../../components/Layout/company/layoutOption";
import { LuSearch, LuTrash2, LuPlus } from "react-icons/lu";

type ItemField = "resource_id" | "warehouse_id" | "quantity" | "unit_price";

export default function PurchaseOrderManager() {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const [supplierId, setSupplierId] = useState(0);
  const [items, setItems] = useState([
    { resource_id: 0, warehouse_id: 0, quantity: 1, unit_price: 0 },
  ]);

  const [creating, setCreating] = useState(false);

  async function loadData() {
    try {
      const [supRes, recRes, warRes, ordRes] = await Promise.all([
        api.get("/supplier"),
        api.get("/resource"),
        api.get("/warehouse"),
        api.get("/purchase-orders"),
      ]);

      setSuppliers(supRes.data);
      setResources(recRes.data);
      setWarehouses(warRes.data);

      setOrders(ordRes.data);
      setFilteredOrders(ordRes.data);
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const updateItem = (index: number, campo: ItemField, valor: any) => {
    const updated = [...items];
    updated[index][campo] = valor;
    setItems(updated);
  };
  const removeItem = (index: number) => {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
  };

  const addItem = () => {
    setItems([
      ...items,
      { resource_id: 0, warehouse_id: 0, quantity: 1, unit_price: 0 },
    ]);
  };

  async function createPurchaseOrder() {
    if (supplierId === 0) return alert("Selecione um fornecedor.");

    const filteredItems = items.filter((i) => i.resource_id !== 0);
    if (filteredItems.length === 0) return alert("Adicione ao menos um item.");

    try {
      await api.post("/purchase-orders", {
        supplier_id: supplierId,
        purchase_orders_items: filteredItems,
      });

      alert("Pedido criado com sucesso!");
      await loadData();
      setCreating(false);

      setSupplierId(0);
      setItems([
        { resource_id: 0, warehouse_id: 0, quantity: 1, unit_price: 0 },
      ]);
    } catch (err) {
      console.error("Erro ao criar pedido:", err);
      alert("Erro ao criar pedido!");
    }
  }

  async function deletePurchaseOrder(id: number) {
    if (!confirm("Deseja excluir esse pedido?")) return;

    try {
      await api.delete(`/purchase-orders/${id}`);
      setOrders((prev) => prev.filter((o) => o.id !== id));
      setFilteredOrders((prev) => prev.filter((o) => o.id !== id));
    } catch (err) {
      console.error("Erro ao excluir:", err);
    }
  }

  return (
    <GenericPanelLayout panel="pedido_de_compra">
      <div className="bg-white max-w-5xl w-full rounded-3xl shadow-xl p-10 min-h-[600px]">
        {/* HEADER */}
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
              value={search}
              onChange={(e) => {
                const value = e.target.value;
                setSearch(value);
                setFilteredOrders(
                  orders.filter(
                    (o) =>
                      o.supplier?.name
                        ?.toLowerCase()
                        .includes(value.toLowerCase()) ||
                      String(o.id).includes(value)
                  )
                );
              }}
              placeholder="Buscar fornecedor..."
              className="outline-none"
            />
          </div>
        </div>

        {/* LISTA DE PEDIDOS */}
        <div className="border-t border-black">
          {filteredOrders.map((o) => (
            <div
              key={o.id}
              className="flex justify-between border-b border-black py-4 px-4 hover:bg-gray-50"
            >
              <div>
                <p className="font-bold">Fornecedor: {o.supplier?.name}</p>
                <p className="text-gray-600">
                  <b>Status:</b> {o.status?.name ?? "Pendente"}
                </p>
                <p className="text-gray-500 text-sm">
                  <b>Itens:</b> {o.items?.length ?? 0}
                </p>
              </div>

              <button
                onClick={() => deletePurchaseOrder(o.id)}
                className="text-red-600 text-2xl hover:text-red-800"
              >
                <LuTrash2 />
              </button>
            </div>
          ))}

          {filteredOrders.length === 0 && (
            <p className="text-center text-gray-500 py-4">
              Nenhum pedido encontrado.
            </p>
          )}
        </div>

        {/* MODAL DE CRIAÇÃO */}
        {creating && (
          <div className="fixed top-0 left-0 w-full h-full bg-black/40 flex justify-center items-center z-[1000]">
            <div className="bg-white w-[650px] p-6 rounded-2xl shadow-xl max-h-[90vh] overflow-auto z-[1001]">
              <h2 className="text-2xl font-semibold mb-4">
                Criar Pedido de Compra
              </h2>

              {/* Fornecedor */}
              <label className="block mb-2">Fornecedor</label>
              <select
                className="border p-2 rounded w-full mb-4"
                value={supplierId}
                onChange={(e) => setSupplierId(Number(e.target.value))}
              >
                <option value={0}>Selecione...</option>
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>

              {/* Itens */}
              <h3 className="text-xl font-semibold mt-4 mb-2">Itens</h3>

              {items.map((item, index) => (
                <div key={index} className="border p-3 rounded mb-3">
                  <div className="grid grid-cols-5 gap-3 items-center">
                    {/* Recurso */}
                    <select
                      className="border p-2 rounded"
                      value={item.resource_id}
                      onChange={(e) =>
                        updateItem(index, "resource_id", Number(e.target.value))
                      }
                    >
                      <option value={0}>Recurso...</option>
                      {resources.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name}
                        </option>
                      ))}
                    </select>

                    {/* Depósito */}
                    <select
                      className="border p-2 rounded"
                      value={item.warehouse_id}
                      onChange={(e) =>
                        updateItem(
                          index,
                          "warehouse_id",
                          Number(e.target.value)
                        )
                      }
                    >
                      <option value={0}>Depósito...</option>
                      {warehouses.map((w) => (
                        <option key={w.id} value={w.id}>
                          {w.name}
                        </option>
                      ))}
                    </select>

                    {/* Quantidade */}
                    <input
                      type="number"
                      className="border p-2 rounded"
                      placeholder="Qtd"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(index, "quantity", Number(e.target.value))
                      }
                    />

                    {/* Valor unitário */}
                    <input
                      type="number"
                      className="border p-2 rounded"
                      placeholder="Valor unitário"
                      value={item.unit_price}
                      onChange={(e) =>
                        updateItem(index, "unit_price", Number(e.target.value))
                      }
                    />

                    {/* Botão excluir */}
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="text-red-600 hover:text-red-800 text-lg font-bold"
                      title="Excluir item"
                    >
                      X
                    </button>
                  </div>
                </div>
              ))}

              <button
                onClick={addItem}
                className="text-blue-600 hover:underline my-2"
              >
                + Adicionar Item
              </button>

              {/* BOTÕES */}
              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setCreating(false)}
                  className="text-gray-600 hover:underline"
                >
                  Cancelar
                </button>

                <button
                  onClick={createPurchaseOrder}
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
