import { useEffect, useState } from "react";
import { api } from "../../../api/lib/api";
import { GenericPanelLayout } from "../../../components/Layout/company/layoutOption";
import {
  LuTrash2,
  LuPlus,
  LuPencil,
  LuX,
  LuShoppingCart,
} from "react-icons/lu";

// --- TIPAGENS ---

// O que vem do Back-end na listagem (Leitura simples)
type PurchaseOrderSummary = {
  id: number;
  total_value: number;
  supplier?: { name: string };
  status?: { name: string; id: number };
  status_id: number;
  created_at: string;
  items?: any[]; // Para contagem de categorias na tabela
};

// Dados auxiliares para os Selects
type SelectOption = { id: number; name: string };

// Tipagem do Item no Formulário
type FormItem = {
  resource_id: number | "";
  warehouse_id: number | "";
  quantity: number;
  unit_price: number;
};

// Estado do Formulário
type OrderForm = {
  supplier_id: number | "";
  status_id: number | "";
  items: FormItem[];
};

const initialFormState: OrderForm = {
  supplier_id: "",
  status_id: "",
  items: [{ resource_id: "", warehouse_id: "", quantity: 1, unit_price: 0 }],
};

export default function PurchaseOrderManager() {
  const [loading, setLoading] = useState(true);
  // Estado para a lista da tabela
  const [orders, setOrders] = useState<PurchaseOrderSummary[]>([]);
  // Estado para controlar se está editando e qual ID
  const [editingId, setEditingId] = useState<number | null>(null);

  // Listas de Opções (Dropdowns)
  const [suppliers, setSuppliers] = useState<SelectOption[]>([]);
  const [resources, setResources] = useState<SelectOption[]>([]);
  const [warehouses, setWarehouses] = useState<SelectOption[]>([]);
  const [statuses, setStatuses] = useState<SelectOption[]>([]);

  // Controle de Modal e Formulário
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<OrderForm>(initialFormState);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      // Carrega dados auxiliares e a lista principal em paralelo
      const [supRes, resRes, warRes, statRes, ordersRes] = await Promise.all([
        api.get("/supplier"),
        api.get("/resource"),
        api.get("/warehouses"),
        api.get("/status/purchase_order"), // Ajuste a rota se necessário
        api.get("/purchase-orders"),
      ]);

      // Função auxiliar para extrair dados de possíveis estruturas de resposta ({ data: [] } vs [])
      const extractData = (resData: any) =>
        Array.isArray(resData) ? resData : resData.data || [];

      setSuppliers(extractData(supRes.data));
      setResources(extractData(resRes.data));
      setWarehouses(extractData(warRes.data));
      setStatuses(extractData(statRes.data));
      setOrders(extractData(ordersRes.data));
    } catch (err: any) {
      console.error("Erro ao carregar dados iniciais:", err);
      alert("Erro ao carregar dados. Verifique o console.");
    } finally {
      setLoading(false);
    }
  };

  // --- Manipulação do Formulário ---

  const handleAddItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { resource_id: "", warehouse_id: "", quantity: 1, unit_price: 0 },
      ],
    }));
  };

  const handleRemoveItem = (index: number) => {
    if (formData.items.length === 1) return;
    const newItems = [...formData.items];
    newItems.splice(index, 1);
    setFormData((prev) => ({ ...prev, items: newItems }));
  };

  const updateItem = (index: number, field: keyof FormItem, value: any) => {
    const newItems = [...formData.items];
    // @ts-ignore
    newItems[index][field] = value;
    setFormData((prev) => ({ ...prev, items: newItems }));
  };

  // --- AÇÕES PRINCIPAIS (CRUD) ---

  // 1. Abrir Modal para CRIAR
  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  // 2. Abrir Modal para EDITAR (Busca dados completos do pedido)
  const handleEdit = async (id: number) => {
    try {
      setLoading(true);
      const { data: order } = await api.get(`/purchase-orders/${id}`);

      setFormData({
        supplier_id: order.supplier_id,
        status_id: order.status_id,

        items: order.items.map((item: any) => ({
          resource_id: item.resource_id,
          warehouse_id: item.warehouse_id || item.warehouse?.id || "",
          
          quantity: item.quantity,
          unit_price: item.unit_price,
        })),
      });

      setEditingId(id);
      setIsModalOpen(true);
    } catch (err) {
      console.error("Erro ao buscar dados do pedido:", err);
      alert("Não foi possível carregar os dados do pedido.");
    } finally {
      setLoading(false);
    }
  };


  const handleSave = async () => {
    try {

      if (!formData.supplier_id || !formData.status_id) {
        return alert("Selecione um Fornecedor e um Status.");
      }
      const invalidItems = formData.items.some(
        (i) => !i.resource_id || !i.warehouse_id || Number(i.quantity) <= 0
      );
      if (invalidItems) {
        return alert(
          "Preencha corretamente todos os itens (Recurso, Armazém e Quantidade > 0)."
        );
      }

      const payload = {
        supplier_id: Number(formData.supplier_id),
        status_id: Number(formData.status_id),
        purchase_orders_items: formData.items.map((item) => ({
          resource_id: Number(item.resource_id),
          warehouse_id: Number(item.warehouse_id),
          quantity: Number(item.quantity),
          unit_price: Number(item.unit_price),
        })),
      };

      if (editingId) {
        // --- LÓGICA DE ATUALIZAÇÃO (PUT) ---
        await api.put(`/purchase-orders/${editingId}`, payload);
        alert("Pedido atualizado com sucesso! Estoque recalculado.");
      } else {
        // --- LÓGICA DE CRIAÇÃO (POST) ---
        await api.post("/purchase-orders", payload);
        alert("Pedido criado com sucesso! Estoque atualizado.");
      }

      closeModal();
      loadInitialData(); // Recarrega a lista da tabela
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Erro ao salvar pedido.");
    }
  };

  // 4. DELETAR
  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza? Isso reverterá a entrada no estoque.")) return;
    try {
      await api.delete(`/purchase-orders/${id}`);
      setOrders((prev) => prev.filter((o) => o.id !== id));
      alert("Pedido excluído e estoque revertido.");
    } catch (err) {
      console.error(err);
      alert("Erro ao excluir pedido.");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData(initialFormState);
  };

  // Calcula total estimado no modal (apenas visual)
  const calculateModalTotal = () => {
    return formData.items.reduce(
      (acc, item) =>
        acc + Number(item.quantity || 0) * Number(item.unit_price || 0),
      0
    );
  };

  return (
    <GenericPanelLayout panel="pedido_de_compra">
      <div className="bg-white max-w-6xl w-full rounded-3xl shadow-xl p-10 min-h-[600px]">
        <h1 className="text-3xl text-center mb-8 font-bold text-gray-800">
          Pedidos de Compra
        </h1>

        {/* Header Actions */}
        <div className="flex justify-between mb-6">
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition shadow-sm"
          >
            <LuPlus size={20} /> Novo Pedido
          </button>
        </div>

        {/* Tabela de Listagem */}
        <div className="overflow-x-auto border rounded-xl shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100">
              <tr className="text-gray-600 text-xs uppercase font-bold tracking-wider">
                <th className="py-4 px-6">ID</th>
                <th className="py-4 px-6">Fornecedor</th>
                <th className="py-4 px-6">Categorias (Itens)</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Total</th>
                <th className="py-4 px-6 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading && orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">
                    Carregando pedidos...
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  // Lógica visual para extrair nomes das categorias
                  const categoryNames =
                    order.items
                      ?.map((i: any) => i.resource?.category?.name)
                      .filter(Boolean) || [];
                  const categoriesDisplay =
                    Array.from(new Set(categoryNames)).join(", ") || "-";

                  return (
                    <tr key={order.id} className="hover:bg-gray-50 transition">
                      <td className="py-4 px-6 font-medium text-gray-800">
                        #{order.id}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">
                        {order.supplier?.name || "N/A"}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">
                        <span
                          className="bg-gray-100 px-2 py-1 rounded text-xs border border-gray-200 block w-fit max-w-[200px] truncate"
                          title={categoriesDisplay}
                        >
                          {categoriesDisplay}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            String(order.status?.name || order.status_id)
                              .toLowerCase()
                              .includes("pendente")
                              ? "bg-yellow-100 text-yellow-800"
                              : String(order.status?.name || order.status_id)
                                  .toLowerCase()
                                  .includes("aprovado")
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {order.status?.name || order.status_id}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-bold text-green-700">
                        R$ {Number(order.total_value).toFixed(2)}
                      </td>
                      <td className="py-4 px-6 flex justify-end gap-2">
                        {/* Botão EDITAR */}
                        <button
                          onClick={() => handleEdit(order.id)}
                          className="text-blue-500 hover:bg-blue-50 p-2 rounded-full transition"
                          title="Editar"
                        >
                          <LuPencil size={18} />
                        </button>
                        {/* Botão EXCLUIR */}
                        <button
                          onClick={() => handleDelete(order.id)}
                          className="text-red-500 hover:bg-red-50 p-2 rounded-full transition"
                          title="Excluir (Reverter Estoque)"
                        >
                          <LuTrash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
          {!loading && orders.length === 0 && (
            <p className="text-center py-8 text-gray-500">
              Nenhum pedido encontrado.
            </p>
          )}
        </div>

        {/* MODAL DE CRIAÇÃO / EDIÇÃO */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
            <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-fadeIn">
              {/* Header Modal */}
              <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <LuShoppingCart className="text-green-600" />
                  {editingId ? `Editar Pedido #${editingId}` : "Novo Pedido"}
                </h2>
                <button onClick={closeModal}>
                  <LuX size={24} className="text-gray-500 hover:text-gray-700" />
                </button>
              </div>

              {/* Body Modal */}
              <div className="p-6 overflow-y-auto">
                {/* 1. Seleção de Fornecedor e Status */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fornecedor *
                    </label>
                    <select
                      className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 outline-none bg-white"
                      value={formData.supplier_id}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormData({
                          ...formData,
                          supplier_id: val === "" ? "" : Number(val),
                        });
                      }}
                    >
                      <option value="">Selecione...</option>
                      {suppliers.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status *
                    </label>
                    <select
                      className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 outline-none bg-white"
                      value={formData.status_id}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormData({
                          ...formData,
                          status_id: val === "" ? "" : Number(val),
                        });
                      }}
                    >
                      <option value="">Selecione...</option>
                      {statuses.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 2. Lista de Itens */}
                <div className="border-t pt-4">
                  <h3 className="font-bold text-gray-700 mb-3 flex justify-between items-center">
                    Itens do Pedido
                    <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      Total Estimado: R$ {calculateModalTotal().toFixed(2)}
                    </span>
                  </h3>

                  {formData.items.map((item, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-3 relative group transition-all hover:shadow-sm"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        {/* Recurso */}
                        <div className="md:col-span-4">
                          <label className="text-xs font-medium text-gray-500 block mb-1">
                            Recurso/Produto *
                          </label>
                          <select
                            className="w-full border rounded p-2 text-sm bg-white focus:ring-1 focus:ring-green-500 outline-none"
                            value={item.resource_id}
                            onChange={(e) =>
                              updateItem(
                                index,
                                "resource_id",
                                e.target.value === ""
                                  ? ""
                                  : Number(e.target.value)
                              )
                            }
                          >
                            <option value="">Selecione...</option>
                            {resources.map((r) => (
                              <option key={r.id} value={r.id}>
                                {r.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Armazém */}
                        <div className="md:col-span-4">
                          <label className="text-xs font-medium text-gray-500 block mb-1">
                            Armazém Destino *
                          </label>
                          <select
                            className="w-full border rounded p-2 text-sm bg-white focus:ring-1 focus:ring-green-500 outline-none"
                            value={item.warehouse_id}
                            onChange={(e) =>
                              updateItem(
                                index,
                                "warehouse_id",
                                e.target.value === ""
                                  ? ""
                                  : Number(e.target.value)
                              )
                            }
                          >
                            <option value="">Selecione...</option>
                            {warehouses.map((w) => (
                              <option key={w.id} value={w.id}>
                                {w.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Quantidade */}
                        <div className="md:col-span-2">
                          <label className="text-xs font-medium text-gray-500 block mb-1">
                            Qtd *
                          </label>
                          <input
                            type="number"
                            min="1"
                            className="w-full border rounded p-2 text-sm focus:ring-1 focus:ring-green-500 outline-none"
                            value={item.quantity}
                            onChange={(e) =>
                              updateItem(index, "quantity", e.target.value)
                            }
                          />
                        </div>

                        {/* Preço Unitário */}
                        <div className="md:col-span-2">
                          <label className="text-xs font-medium text-gray-500 block mb-1">
                            Preço Unit. (R$)
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            className="w-full border rounded p-2 text-sm focus:ring-1 focus:ring-green-500 outline-none"
                            value={item.unit_price}
                            onChange={(e) =>
                              updateItem(index, "unit_price", e.target.value)
                            }
                          />
                        </div>
                      </div>

                      {/* Botão Remover Item (só aparece se tiver mais de 1) */}
                      {formData.items.length > 1 && (
                        <button
                          onClick={() => handleRemoveItem(index)}
                          className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1.5 hover:bg-red-200 shadow-sm opacity-0 group-hover:opacity-100 transition"
                          title="Remover item"
                        >
                          <LuX size={14} />
                        </button>
                      )}
                    </div>
                  ))}

                  <button
                    onClick={handleAddItem}
                    className="text-sm text-green-600 font-medium hover:underline flex items-center gap-1 mt-3 py-2 px-3 rounded-lg hover:bg-green-50 transition"
                  >
                    <LuPlus /> Adicionar outro item
                  </button>
                </div>
              </div>

              {/* Footer Modal */}
              <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-medium shadow-md transition flex items-center gap-2"
                >
                  {editingId ? "Atualizar Pedido" : "Confirmar Pedido"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </GenericPanelLayout>
  );
}