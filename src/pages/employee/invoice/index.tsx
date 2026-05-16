import { useEffect, useState } from "react";
import { api } from "../../../api/lib/api";
import { GenericPanelLayout } from "../../../components/Layout/company/layoutOption";
import {
  LuSearch,
  LuFileText,
  LuHash,
  LuCalendar,
  LuDollarSign,
} from "react-icons/lu";

type Invoice = {
  id: number;
  order_id: number;
  amount: number;
  status: string;
  due_date: string;
};

export default function InvoiceManager() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filtered, setFiltered] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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
    // @ts-ignore
    <GenericPanelLayout panel="invoice">
      <div className="w-full max-w-5xl mx-auto space-y-6">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#384A6C] tracking-tight">Faturas</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {filtered.length} fatura{filtered.length !== 1 ? "s" : ""} encontrada{filtered.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm">
            <LuSearch size={15} className="text-gray-400 shrink-0" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Buscar por ID ou status..."
              className="outline-none text-sm text-gray-700 placeholder-gray-300 w-64"
            />
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="animate-spin h-6 w-6 border-2 border-[#94C0E0] border-t-transparent rounded-full" />
              <p className="text-sm text-gray-400">Carregando faturas...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-2 text-gray-400">
              <LuFileText size={32} className="opacity-30" />
              <p className="text-sm font-medium">Nenhuma fatura encontrada.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-50">
              {filtered.map((inv) => (
                <li
                  key={inv.id}
                  className="flex items-center justify-between px-6 py-4 hover:bg-[#EEF5FB]/60 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#384A6C]/10 flex items-center justify-center text-[#384A6C] shrink-0">
                      <LuFileText size={18} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-800 text-sm">Fatura #{inv.id}</p>
                        <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded font-bold uppercase">
                          Pedido #{inv.order_id}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-400 mt-1 flex-wrap">
                        <span className="flex items-center gap-1">
                          <LuDollarSign size={11} /> <b>Valor:</b> R$ {Number(inv.amount).toFixed(2)}
                        </span>
                        <span className="flex items-center gap-1">
                          <LuCalendar size={11} /> <b>Venc:</b> {inv.due_date}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border
                    ${inv.status === "Pago"
                      ? "bg-green-50 text-green-600 border-green-200"
                      : "bg-[#EEF5FB] text-[#384A6C] border-[#94C0E0]/30"
                    }`}>
                    {inv.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </GenericPanelLayout>
  );
}