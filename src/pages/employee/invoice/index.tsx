import { useEffect, useState } from "react";
import { api } from "../../../api/lib/api";
import { GenericPanelLayout } from "../../../components/Layout/company/layoutOption";
import { LuSearch, LuFileText } from "react-icons/lu";

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
              </div>
            ))
          )}
          {filtered.length === 0 && !loading && (
            <p className="text-center py-6 text-gray-400">Nenhuma fatura encontrada.</p>
          )}
        </div>
      </div>
    </GenericPanelLayout>
  );
}