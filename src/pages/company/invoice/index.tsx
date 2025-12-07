import { useEffect, useState } from "react";
import { api } from "../../../api/lib/api";
import { GenericPanelLayout } from "../../../components/Layout/company/layoutOption";
import { LuSearch, LuTrash2, LuPencil, LuPlus, LuFileText } from "react-icons/lu";

// Definição do tipo Invoice (Fatura)
type Invoice = {
  id: number;
  order_id: number;
  amount: number;
  status: string; // Ex: 'Pendente', 'Pago', 'Atrasado'
  due_date: string;
};

export default function InvoiceManager() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filtered, setFiltered] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Modais
  const [editing, setEditing] = useState<Invoice | null>(null);
  const [creating, setCreating] = useState(false);

  // Estado para nova fatura (Corrigido de GWInvoice para setNewInvoice)
  const [newInvoice, setNewInvoice] = useState({
    order_id: "",
    amount: "",
    status: "Pendente",
    due_date: "",
  });

  // 1. Carregar dados da API
  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.get("/invoice");
        setInvoices(res.data);
        setFiltered(res.data);
      } catch (err) {
        console.error("Erro ao carregar faturas", err);
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
      invoices.filter(
        (inv) =>
          String(inv.id).includes(value) ||
          String(inv.order_id).includes(value) ||
          inv.status.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  // 3. Deletar
  const handleDelete = async (id: number) => {
    if (!confirm(`Deseja realmente excluir a fatura #${id}?`)) return;
    try {
      await api.delete(`/invoice/${id}`);
      setInvoices(invoices.filter((i) => i.id !== id));
      setFiltered(filtered.filter((i) => i.id !== id));
      alert("Fatura excluída com sucesso!");
    } catch {
      alert("Erro ao deletar fatura.");
    }
  };

  // 4. Preparar Edição (Corrigido erro de sintaxe)
  const handleEdit = async (id: number) => {
    try {
      const res = await api.get(`/invoice/${id}`);
      setEditing(res.data);
    } catch (err) {
      alert("Erro ao carregar dados da fatura");
    }
  };

  // 5. Salvar Edição
  const handleSave = async () => {
    if (!editing) return;
    try {
      const payload = {
        order_id: Number(editing.order_id),
        amount: Number(editing.amount),
        status: editing.status,
        due_date: editing.due_date,
      };
      
      await api.put(`/invoice/${editing.id}`, payload);
      
      // Atualiza listas locais
      const updatedList = invoices.map((i) => (i.id === editing.id ? { ...editing, ...payload } : i));
      setInvoices(updatedList);
      setFiltered(updatedList);

      alert("Fatura atualizada com sucesso!");
      setEditing(null);
    } catch (error) {
      console.error(error);
      alert("Erro ao atualizar fatura.");
    }
  };

  // 6. Criar Fatura
  const handleCreate = async () => {
    try {
      const payload = {
        order_id: Number(newInvoice.order_id),
        amount: Number(newInvoice.amount),
        status: newInvoice.status,
        due_date: newInvoice.due_date,
      };

      await api.post("/invoice", payload);
      
      // Recarrega lista completa
      const list = await api.get("/invoice");
      setInvoices(list.data);
      setFiltered(list.data);

      setCreating(false);
      setNewInvoice({ order_id: "", amount: "", status: "Pendente", due_date: "" });
      alert("Fatura gerada com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Erro ao gerar fatura.");
    }
  };

  return (
    // Lembre-se de adicionar "invoice" no arquivo layoutOption.tsx conforme instruído anteriormente
    // @ts-ignore 
    <GenericPanelLayout panel="invoice">
      <div className="bg-white max-w-5xl w-full rounded-3xl shadow-xl p-10 min-h-[600px]">
        <h1 className="text-3xl text-center mb-8 flex items-center justify-center gap-3">
          <LuFileText /> Gestão de Faturas
        </h1>
        {/* Header: Botão Criar + Busca */}
        <div className="flex justify-between mb-6">
          <div className="flex items-center gap-2 border border-black rounded-lg px-4 py-2">
            <LuSearch />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Buscar por ID ou Status..."
              className="outline-none"
            />
          </div>
        </div>

        {/* Lista de Faturas */}
        <div className="border-t border-black">
          {loading ? (
            <p className="text-center py-4 text-gray-500">Carregando...</p>
          ) : (
            filtered.map((inv) => (
              <div
                key={inv.id}
                className="flex justify-between border-b border-black py-4 items-center px-4 hover:bg-gray-50"
              >
                <div>
                  <p className="font-semibold text-lg">Fatura #{inv.id}</p>
                  <p className="text-sm text-gray-600">Referente ao Pedido: #{inv.order_id}</p>
                  <div className="flex gap-4 mt-1 text-sm font-medium">
                    <span className="text-blue-600">R$ {Number(inv.amount).toFixed(2)}</span>
                    <span
                      className={`${
                        inv.status === "Pago" ? "text-green-600" : "text-orange-500"
                      }`}
                    >
                      {inv.status}
                    </span>
                    <span className="text-gray-500">Venc: {inv.due_date}</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => handleEdit(inv.id)}
                    className="text-blue-600 text-2xl hover:text-blue-800"
                  >
                    <LuPencil />
                  </button>
                  <button
                    onClick={() => handleDelete(inv.id)}
                    className="text-red-600 text-2xl hover:text-red-800"
                  >
                    <LuTrash2 />
                  </button>
                </div>
              </div>
            ))
          )}
          {filtered.length === 0 && !loading && (
            <p className="text-center py-6 text-gray-400">Nenhuma fatura encontrada.</p>
          )}
        </div>

        {/* --- MODAL EDITAR --- */}
        {editing && (
          <div className="fixed top-0 left-0 w-full h-full bg-black/40 flex justify-center items-center z-[1000]">
            <div className="bg-white w-[500px] p-6 rounded-2xl shadow-xl z-[1001]">
              <h2 className="text-2xl font-semibold mb-4">Editar Fatura #{editing.id}</h2>
              
              <div className="flex flex-col gap-3">
                <label className="text-sm font-bold">Valor (R$)</label>
                <input
                  type="number"
                  value={editing.amount}
                  onChange={(e) => setEditing({ ...editing, amount: Number(e.target.value) })}
                  className="border p-2 rounded"
                />

                <label className="text-sm font-bold">Status</label>
                <select
                  value={editing.status}
                  onChange={(e) => setEditing({ ...editing, status: e.target.value })}
                  className="border p-2 rounded bg-white"
                >
                  <option value="Pendente">Pendente</option>
                  <option value="Pago">Pago</option>
                  <option value="Cancelado">Cancelado</option>
                  <option value="Atrasado">Atrasado</option>
                </select>

                <label className="text-sm font-bold">Data de Vencimento</label>
                <input
                  type="date"
                  value={editing.due_date}
                  onChange={(e) => setEditing({ ...editing, due_date: e.target.value })}
                  className="border p-2 rounded"
                />
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

      </div>
    </GenericPanelLayout>
  );
}