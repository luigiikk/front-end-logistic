import { useEffect, useState } from "react";
import { api } from "../../../api/lib/api";
import { GenericPanelLayout } from "../../../components/Layout/company/layoutOption";
import { LuSearch, LuTrash2, LuPencil, LuFileText, LuLink } from "react-icons/lu";

// 1. Definição atualizada conforme o Schema do Backend
type PurchaseOrder = {
  id: number;
  total_value: number;
  status_id: number;
  supplier_id: number;
};

type Invoice = {
  id: number;
  invoice_number: number | null;
  purchase_order_id: number;
  company_id: number;
  issue_date: string; // Vem como string ISO do JSON
  due_date: string | null;
  link_file: string | null;
  purchase_order: PurchaseOrder;
};

// Pequeno helper para simular nomes de status (idealmente viria do backend)
const getStatusName = (id: number) => {
  const map: Record<number, string> = { 1: "Pendente", 2: "Pago", 3: "Atrasado", 4: "Cancelado" };
  return map[id] || "Desconhecido";
};

// Helper para formatar data para o input HTML (yyyy-MM-dd)
const formatDateForInput = (dateString: string | null) => {
  if (!dateString) return "";
  return new Date(dateString).toISOString().split('T')[0];
};

export default function InvoiceManager() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filtered, setFiltered] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [editing, setEditing] = useState<Invoice | null>(null);

  // Form states para edição (para evitar mutar o objeto original diretamente antes de salvar)
  const [editForm, setEditForm] = useState({
    invoice_number: "",
    issue_date: "",
    due_date: "",
    link_file: ""
  });

  // 1. Carregar dados da API
  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.get("/invoice"); // Certifique-se que a rota é '/invoices' ou '' dependendo do prefixo
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
    const lowerValue = value.toLowerCase();
    
    setFiltered(
      invoices.filter((inv) => {
        const statusName = getStatusName(inv.purchase_order.status_id).toLowerCase();
        
        return (
          String(inv.id).includes(value) ||
          String(inv.invoice_number || "").includes(value) ||
          String(inv.purchase_order_id).includes(value) ||
          statusName.includes(lowerValue)
        );
      })
    );
  };

  // 3. Deletar
  const handleDelete = async (id: number) => {
    if (!confirm(`Deseja realmente excluir a fatura #${id}?`)) return;
    try {
      await api.delete(`/invoice/${id}`); // Ajuste a rota conforme seu backend
      const newList = invoices.filter((i) => i.id !== id);
      setInvoices(newList);
      setFiltered(newList); // Atualiza também a lista filtrada
      alert("Fatura excluída com sucesso!");
    } catch {
      alert("Erro ao deletar fatura.");
    }
  };

  // 4. Preparar Edição
  const handleEdit = (invoice: Invoice) => {
    setEditing(invoice);
    setEditForm({
      invoice_number: invoice.invoice_number ? String(invoice.invoice_number) : "",
      issue_date: formatDateForInput(invoice.issue_date),
      due_date: formatDateForInput(invoice.due_date),
      link_file: invoice.link_file || ""
    });
  };

  // 5. Salvar Edição
  const handleSave = async () => {
    if (!editing) return;

    try {
      // Payload conforme o Schema de Update (ajuste conforme necessário)
      const payload = {
        invoice_number: editForm.invoice_number ? Number(editForm.invoice_number) : null,
        issue_date: new Date(editForm.issue_date), // O Zod espera Date object ou string válida
        due_date: editForm.due_date ? new Date(editForm.due_date) : null,
        link_file: editForm.link_file || null
      };
      
      await api.put(`/invoice/${editing.id}`, payload);
      
      // Atualiza estado local
      const updatedList = invoices.map((inv) => {
        if (inv.id === editing.id) {
            return { 
                ...inv, 
                invoice_number: payload.invoice_number,
                issue_date: payload.issue_date.toISOString(),
                due_date: payload.due_date ? payload.due_date.toISOString() : null,
                link_file: payload.link_file
            };
        }
        return inv;
      });

      setInvoices(updatedList);
      setFiltered(updatedList); // Reseta filtro ou reaplica lógica se necessário

      alert("Fatura atualizada com sucesso!");
      setEditing(null);
    } catch (error) {
      console.error(error);
      alert("Erro ao atualizar fatura. Verifique os dados.");
    }
  };

  return (
    // @ts-ignore 
    <GenericPanelLayout panel="invoice">
      <div className="bg-white max-w-5xl w-full rounded-3xl shadow-xl p-10 min-h-[600px]">
        <h1 className="text-3xl text-center mb-8 flex items-center justify-center gap-3">
          <LuFileText /> Gestão de Faturas
        </h1>

        {/* Header: Busca */}
        <div className="flex justify-between mb-6">
          <div className="flex items-center gap-2 border border-black rounded-lg px-4 py-2 w-full max-w-md">
            <LuSearch />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Buscar por ID, Nº Nota, Pedido ou Status..."
              className="outline-none w-full"
            />
          </div>
        </div>

        {/* Lista de Faturas */}
        <div className="border-t border-black">
          {loading ? (
            <p className="text-center py-4 text-gray-500">Carregando...</p>
          ) : (
            filtered.map((inv) => {
                const statusName = getStatusName(inv.purchase_order.status_id);
                return (
                  <div
                    key={inv.id}
                    className="flex justify-between border-b border-black py-4 items-center px-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                          <p className="font-semibold text-lg">
                            Fatura #{inv.id} 
                            {inv.invoice_number && <span className="text-gray-500 text-sm ml-2">(Nota: {inv.invoice_number})</span>}
                          </p>
                      </div>
                      
                      <p className="text-sm text-gray-600">Referente ao Pedido: <strong>#{inv.purchase_order_id}</strong></p>
                      
                      <div className="flex gap-4 mt-2 text-sm font-medium items-center">
                        <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded">
                            R$ {Number(inv.purchase_order.total_value).toFixed(2)}
                        </span>
                        
                        <span className={`px-2 py-1 rounded ${
                            statusName === "Pago" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                        }`}>
                          {statusName}
                        </span>

                        <span className="text-gray-500">
                             Emissão: {new Date(inv.issue_date).toLocaleDateString()}
                        </span>
                        {inv.due_date && (
                             <span className="text-red-500">
                                Venc: {new Date(inv.due_date).toLocaleDateString()}
                             </span>
                        )}
                      </div>
                      
                      {inv.link_file && (
                          <a href={inv.link_file} target="_blank" rel="noreferrer" className="text-xs text-blue-500 flex items-center gap-1 mt-2 hover:underline">
                              <LuLink /> Ver Arquivo
                          </a>
                      )}
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={() => handleEdit(inv)}
                        className="text-blue-600 text-2xl hover:text-blue-800 transition-transform hover:scale-110"
                        title="Editar"
                      >
                        <LuPencil />
                      </button>
                      <button
                        onClick={() => handleDelete(inv.id)}
                        className="text-red-600 text-2xl hover:text-red-800 transition-transform hover:scale-110"
                        title="Excluir"
                      >
                        <LuTrash2 />
                      </button>
                    </div>
                  </div>
                );
            })
          )}
          
          {filtered.length === 0 && !loading && (
            <p className="text-center py-6 text-gray-400">Nenhuma fatura encontrada.</p>
          )}
        </div>

        {/* --- MODAL EDITAR --- */}
        {editing && (
          <div className="fixed top-0 left-0 w-full h-full bg-black/40 flex justify-center items-center z-[1000] backdrop-blur-sm">
            <div className="bg-white w-[500px] p-8 rounded-2xl shadow-2xl z-[1001]">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">Editar Fatura #{editing.id}</h2>
              
              <div className="flex flex-col gap-4">
                
                {/* Nota Fiscal */}
                <div>
                    <label className="text-sm font-bold text-gray-700">Número da Nota Fiscal</label>
                    <input
                    type="number"
                    value={editForm.invoice_number}
                    onChange={(e) => setEditForm({ ...editForm, invoice_number: e.target.value })}
                    className="border border-gray-300 p-2 rounded w-full mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Ex: 123456"
                    />
                </div>

                <div className="flex gap-4">
                    {/* Data Emissão */}
                    <div className="flex-1">
                        <label className="text-sm font-bold text-gray-700">Data de Emissão</label>
                        <input
                        type="date"
                        value={editForm.issue_date}
                        onChange={(e) => setEditForm({ ...editForm, issue_date: e.target.value })}
                        className="border border-gray-300 p-2 rounded w-full mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    {/* Data Vencimento */}
                    <div className="flex-1">
                        <label className="text-sm font-bold text-gray-700">Data de Vencimento</label>
                        <input
                        type="date"
                        value={editForm.due_date}
                        onChange={(e) => setEditForm({ ...editForm, due_date: e.target.value })}
                        className="border border-gray-300 p-2 rounded w-full mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                </div>

                {/* Link Arquivo */}
                <div>
                    <label className="text-sm font-bold text-gray-700">Link do Arquivo (PDF/Drive)</label>
                    <input
                    type="text"
                    value={editForm.link_file}
                    onChange={(e) => setEditForm({ ...editForm, link_file: e.target.value })}
                    className="border border-gray-300 p-2 rounded w-full mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="https://..."
                    />
                </div>

                {/* Aviso sobre dados Read-Only */}
                <div className="bg-gray-100 p-3 rounded text-xs text-gray-500 mt-2">
                    <p>O <strong>Valor</strong> e o <strong>Status</strong> são gerenciados através do Pedido de Compra associado (ID: {editing.purchase_order_id}).</p>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button 
                    onClick={() => setEditing(null)} 
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button 
                    onClick={handleSave} 
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                >
                  Salvar Alterações
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </GenericPanelLayout>
  );
}