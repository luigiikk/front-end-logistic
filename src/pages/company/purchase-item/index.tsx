import { useEffect, useState } from "react";
import { api } from "../../../api/lib/api";
import { GenericPanelLayout } from "../../../components/Layout/company/layoutOption";
import { LuSearch, LuTrash2, LuPencil, LuShoppingBag, LuX } from "react-icons/lu";

// Tipagem exata baseada no seu Zod Schema
type PurchaseOrderItem = {
  id: number;
  purchase_order_id: number;
  resource_id: number;
  quantity: number;
  unit_price: number;
  total_price: number;
  // O nome vem de dentro do recurso
  resource?: {
    name: string;
  };
};

export default function PurchaseOrderItemManager() {
  const [items, setItems] = useState<PurchaseOrderItem[]>([]);
  const [filtered, setFiltered] = useState<PurchaseOrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Modais
  const [editing, setEditing] = useState<PurchaseOrderItem | null>(null);
  
  // Como itens geralmente são criados DENTRO do pedido de compra, 
  // aqui focaremos apenas em LISTAR, EDITAR e DELETAR itens avulsos.
  // Se precisar criar item avulso, me avise.

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // Ajuste a rota para a que você definiu (ex: /purchase-orders-items)
      const res = await api.get("/purchase-order-items"); 
      
      const data = Array.isArray(res.data) ? res.data : (res.data.data || []);
      setItems(data);
      setFiltered(data);
    } catch (err) {
      console.error("Erro ao carregar itens", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const lower = value.toLowerCase();
    setFiltered(
      items.filter(
        (i) =>
          // Busca pelo nome do recurso ou ID do pedido
          (i.resource?.name && i.resource.name.toLowerCase().includes(lower)) ||
          String(i.purchase_order_id).includes(value)
      )
    );
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Deseja realmente excluir este item? Isso afetará o valor total do pedido.")) return;
    try {
      await api.delete(`/purchase-order-items/${id}`); // Verifique se essa rota existe
      setItems(prev => prev.filter((i) => i.id !== id));
      setFiltered(prev => prev.filter((i) => i.id !== id));
      alert("Item excluído!");
    } catch {
      alert("Erro ao deletar item.");
    }
  };

  const handleEdit = (item: PurchaseOrderItem) => {
    setEditing(item);
  };

  const handleSaveEdit = async () => {
    if (!editing) return;
    try {
      // Payload simplificado para atualização
      const payload = {
        quantity: Number(editing.quantity),
        unit_price: Number(editing.unit_price)
      };
      
      await api.put(`/purchase-order-items/${editing.id}`, payload);
      
      alert("Item atualizado!");
      setEditing(null);
      loadData(); // Recarrega para garantir cálculos de total
    } catch (error) {
      console.error(error);
      alert("Erro ao atualizar item.");
    }
  };

  return (
    <GenericPanelLayout panel="item_compra">
      <div className="bg-white max-w-6xl w-full rounded-3xl shadow-xl p-10 min-h-[600px]">
        <h1 className="text-3xl text-center mb-8 flex items-center justify-center gap-3 font-bold text-gray-800">
          <LuShoppingBag /> Itens dos Pedidos
        </h1>

        {/* Header Busca */}
        <div className="flex justify-end mb-6">
          <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 bg-gray-50">
            <LuSearch className="text-gray-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Buscar por Recurso ou ID Pedido..."
              className="outline-none bg-transparent w-64"
            />
          </div>
        </div>

        {/* Lista */}
        <div className="overflow-x-auto border rounded-xl shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100">
              <tr className="text-gray-600 text-xs uppercase font-bold tracking-wider">
                <th className="py-4 px-6">Produto / Recurso</th>
                <th className="py-4 px-6">Pedido ID</th>
                <th className="py-4 px-6">Qtd</th>
                <th className="py-4 px-6">Preço Unit.</th>
                <th className="py-4 px-6">Total Item</th>
                <th className="py-4 px-6 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={6} className="text-center py-8 text-gray-500">Carregando...</td></tr>
              ) : filtered.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition">
                  <td className="py-4 px-6 font-medium text-gray-800">
                    {item.resource?.name || `Recurso #${item.resource_id}`}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    #{item.purchase_order_id}
                  </td>
                  <td className="py-4 px-6 font-bold">
                    {item.quantity}
                  </td>
                  <td className="py-4 px-6 text-blue-600">
                    R$ {Number(item.unit_price).toFixed(2)}
                  </td>
                  <td className="py-4 px-6 text-green-700 font-bold">
                    R$ {(item.quantity * item.unit_price).toFixed(2)}
                  </td>
                  <td className="py-4 px-6 flex justify-end gap-3">
                    <button onClick={() => handleEdit(item)} className="text-blue-500 hover:bg-blue-50 p-2 rounded-full transition">
                      <LuPencil size={18} />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-full transition">
                      <LuTrash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && filtered.length === 0 && (
             <p className="text-center py-8 text-gray-400">Nenhum item encontrado.</p>
          )}
        </div>

        {/* --- MODAL EDITAR --- */}
        {editing && (
          <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
            <div className="bg-white w-[400px] p-6 rounded-2xl shadow-xl animate-fadeIn">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Editar Item</h2>
                <button onClick={() => setEditing(null)}><LuX size={24}/></button>
              </div>
              
              <div className="bg-gray-100 p-3 rounded mb-4">
                <p className="text-sm text-gray-500">Produto</p>
                <p className="font-semibold">{editing.resource?.name}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-bold text-gray-700">Quantidade</label>
                  <input
                    type="number"
                    value={editing.quantity}
                    onChange={(e) => setEditing({ ...editing, quantity: Number(e.target.value) })}
                    className="border p-2 rounded w-full mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-700">Preço Unitário (R$)</label>
                  <input
                    type="number" step="0.01"
                    value={editing.unit_price}
                    onChange={(e) => setEditing({ ...editing, unit_price: Number(e.target.value) })}
                    className="border p-2 rounded w-full mt-1"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 border-t pt-4">
                <button onClick={() => setEditing(null)} className="text-gray-600 px-4 py-2 hover:bg-gray-100 rounded">
                  Cancelar
                </button>
                <button onClick={handleSaveEdit} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-medium">
                  Salvar
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </GenericPanelLayout>
  );
}