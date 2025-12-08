import { useEffect, useState } from "react";
import { api } from "../../../api/lib/api";
import { GenericPanelLayout } from "../../../components/Layout/company/layoutOption";
import { LuSearch, LuTrash2, LuPencil, LuPlus, LuShoppingBag } from "react-icons/lu";

// Definição do tipo PurchasedItem (Item Comprado)
type PurchasedItem = {
  id: number;
  invoice_id: number; // Vínculo com a Fatura (Nota Fiscal)
  name: string;
  quantity: number;
  unit_price: number;
};

export default function PurchasedItemManager() {
  const [items, setItems] = useState<PurchasedItem[]>([]);
  const [filtered, setFiltered] = useState<PurchasedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Modais
  const [editing, setEditing] = useState<PurchasedItem | null>(null);
  const [creating, setCreating] = useState(false);

  // Estado para novo item
  const [newItem, setNewItem] = useState({
    invoice_id: "",
    name: "",
    quantity: "",
    unit_price: "",
  });

  // 1. Carregar dados da API
  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.get("/purchased-item"); // Ajuste a rota conforme seu backend
        setItems(res.data);
        setFiltered(res.data);
      } catch (err) {
        console.error("Erro ao carregar itens comprados", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // 2. Busca (Filtro)
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setFiltered(
      items.filter(
        (i) =>
          i.name.toLowerCase().includes(value.toLowerCase()) ||
          String(i.invoice_id).includes(value)
      )
    );
  };

  // 3. Deletar
  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Deseja realmente excluir o item "${name}"?`)) return;
    try {
      await api.delete(`/purchased-item/${id}`);
      setItems(items.filter((i) => i.id !== id));
      setFiltered(filtered.filter((i) => i.id !== id));
      alert("Item excluído com sucesso!");
    } catch {
      alert("Erro ao deletar item.");
    }
  };

  // 4. Preparar Edição
  const handleEdit = async (id: number) => {
    try {
      const res = await api.get(`/purchased-item/${id}`);
      setEditing(res.data);
    } catch (err) {
      alert("Erro ao carregar dados do item");
    }
  };

  // 5. Salvar Edição
  const handleSave = async () => {
    if (!editing) return;
    try {
      const payload = {
        invoice_id: Number(editing.invoice_id),
        name: editing.name,
        quantity: Number(editing.quantity),
        unit_price: Number(editing.unit_price),
      };
      
      await api.put(`/purchased-item/${editing.id}`, payload);
      
      const updatedList = items.map((i) => (i.id === editing.id ? { ...editing, ...payload } : i));
      setItems(updatedList);
      setFiltered(updatedList);

      alert("Item atualizado com sucesso!");
      setEditing(null);
    } catch (error) {
      console.error(error);
      alert("Erro ao atualizar item.");
    }
  };

  // 6. Criar Item
  const handleCreate = async () => {
    try {
      const payload = {
        invoice_id: Number(newItem.invoice_id),
        name: newItem.name,
        quantity: Number(newItem.quantity),
        unit_price: Number(newItem.unit_price),
      };

      await api.post("/purchased-item", payload);
      
      const list = await api.get("/purchased-item");
      setItems(list.data);
      setFiltered(list.data);

      setCreating(false);
      setNewItem({ invoice_id: "", name: "", quantity: "", unit_price: "" });
      alert("Item cadastrado com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Erro ao cadastrar item.");
    }
  };

  return (
    <GenericPanelLayout panel="item_compra">
      <div className="bg-white max-w-5xl w-full rounded-3xl shadow-xl p-10 min-h-[600px]">
        <h1 className="text-3xl text-center mb-8 flex items-center justify-center gap-3">
          <LuShoppingBag /> Gestão de Itens Comprados
        </h1>

        {/* Header */}
        <div className="flex justify-between mb-6">
          <button
            onClick={() => setCreating(true)}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            <LuPlus /> Novo Item
          </button>

          <div className="flex items-center gap-2 border border-black rounded-lg px-4 py-2">
            <LuSearch />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Buscar por nome ou Fatura..."
              className="outline-none"
            />
          </div>
        </div>

        {/* Lista */}
        <div className="border-t border-black">
          {loading ? (
            <p className="text-center py-4 text-gray-500">Carregando...</p>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className="flex justify-between border-b border-black py-4 items-center px-4 hover:bg-gray-50"
              >
                <div>
                  <p className="font-semibold text-lg">{item.name}</p>
                  <p className="text-sm text-gray-600">Fatura Vinculada: #{item.invoice_id}</p>
                  <div className="flex gap-4 mt-1 text-sm font-medium">
                    <span className="text-gray-500">Qtd: {item.quantity}</span>
                    <span className="text-blue-600">Unit: R$ {Number(item.unit_price).toFixed(2)}</span>
                    <span className="text-green-600">Total: R$ {(item.quantity * item.unit_price).toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => handleEdit(item.id)}
                    className="text-blue-600 text-2xl hover:text-blue-800"
                  >
                    <LuPencil />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id, item.name)}
                    className="text-red-600 text-2xl hover:text-red-800"
                  >
                    <LuTrash2 />
                  </button>
                </div>
              </div>
            ))
          )}
          {filtered.length === 0 && !loading && (
            <p className="text-center py-6 text-gray-400">Nenhum item encontrado.</p>
          )}
        </div>

        {/* --- MODAL EDITAR --- */}
        {editing && (
          <div className="fixed top-0 left-0 w-full h-full bg-black/40 flex justify-center items-center z-[1000]">
            <div className="bg-white w-[500px] p-6 rounded-2xl shadow-xl z-[1001]">
              <h2 className="text-2xl font-semibold mb-4">Editar Item #{editing.id}</h2>
              
              <div className="flex flex-col gap-3">
                <label className="text-sm font-bold">ID da Fatura</label>
                <input
                  type="number"
                  value={editing.invoice_id}
                  onChange={(e) => setEditing({ ...editing, invoice_id: Number(e.target.value) })}
                  className="border p-2 rounded"
                />

                <label className="text-sm font-bold">Nome do Item</label>
                <input
                  type="text"
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  className="border p-2 rounded"
                />

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-bold">Quantidade</label>
                    <input
                      type="number"
                      value={editing.quantity}
                      onChange={(e) => setEditing({ ...editing, quantity: Number(e.target.value) })}
                      className="border p-2 rounded w-full"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold">Preço Unit. (R$)</label>
                    <input
                      type="number"
                      value={editing.unit_price}
                      onChange={(e) => setEditing({ ...editing, unit_price: Number(e.target.value) })}
                      className="border p-2 rounded w-full"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setEditing(null)} className="text-gray-600 hover:underline">
                  Cancelar
                </button>
                <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  Salvar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- MODAL CRIAR --- */}
        {creating && (
          <div className="fixed top-0 left-0 w-full h-full bg-black/40 flex justify-center items-center z-[1000]">
            <div className="bg-white w-[500px] p-6 rounded-2xl shadow-xl z-[1001]">
              <h2 className="text-2xl font-semibold mb-4">Novo Item Comprado</h2>
              
              <div className="flex flex-col gap-3">
                <label className="text-sm font-bold">ID da Fatura</label>
                <input
                  type="number"
                  placeholder="Ex: 10"
                  value={newItem.invoice_id}
                  onChange={(e) => setNewItem({ ...newItem, invoice_id: e.target.value })}
                  className="border p-2 rounded"
                />

                <label className="text-sm font-bold">Nome do Item</label>
                <input
                  type="text"
                  placeholder="Ex: Pneu Aro 16"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="border p-2 rounded"
                />

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-bold">Quantidade</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={newItem.quantity}
                      onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                      className="border p-2 rounded w-full"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold">Preço Unit. (R$)</label>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={newItem.unit_price}
                      onChange={(e) => setNewItem({ ...newItem, unit_price: e.target.value })}
                      className="border p-2 rounded w-full"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setCreating(false)} className="text-gray-600 hover:underline">
                  Cancelar
                </button>
                <button onClick={handleCreate} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                  Cadastrar
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </GenericPanelLayout>
  );
}