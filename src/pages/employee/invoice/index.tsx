import { GenericPanelLayout } from "../../../components/Layout/company/layoutOption";
import {
  LuSearch,
  LuFileText,
  LuCalendar,
  LuDollarSign,
  LuHash,
  LuLink,
  LuExternalLink,
} from "react-icons/lu";
import { useInvoices } from "../../../hooks/useInvoice";
import { getStatus, formatDate } from "../../../util/invoiceHelpers";

export default function InvoiceManager() {
  const {
    invoices,
    loading,
    searchTerm,
    handleSearch,
  } = useInvoices();

  return (
    // @ts-ignore
    <GenericPanelLayout panel="invoice">
      <div className="w-full max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#384A6C] tracking-tight flex items-center gap-2">
              <LuFileText size={24} className="text-[#384A6C]" /> Faturas
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Consulta de notas fiscais e comprovantes de faturamento
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm">
            <LuSearch size={15} className="text-gray-400 shrink-0" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Buscar por ID, nota, pedido ou status..."
              className="outline-none text-sm text-gray-700 placeholder-gray-300 w-64"
            />
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-20 gap-3">
            <div className="animate-spin h-6 w-6 border-2 border-[#94C0E0] border-t-transparent rounded-full" />
            <p className="text-sm text-gray-400">Carregando faturas...</p>
          </div>
        ) : invoices.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-20 gap-2 text-gray-400">
            <LuFileText size={32} className="opacity-30" />
            <p className="text-sm font-medium">Nenhuma fatura encontrada.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {invoices.map((inv) => {
              const status = getStatus(inv.purchase_order?.status ?? inv.purchase_order?.status_id);
              
              return (
                <div
                  key={inv.id}
                  className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4"
                >
                  {/* Top Header Row */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-[#384A6C]/10 flex items-center justify-center text-[#384A6C]">
                        <LuFileText size={20} />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800 text-sm">Fatura #{inv.id}</h3>
                        {inv.invoice_number ? (
                          <div className="flex items-center gap-0.5 text-xs text-gray-400 mt-0.5">
                            <LuHash size={11} />
                            <span>Nota: {inv.invoice_number}</span>
                          </div>
                        ) : (
                          <div className="text-xs text-gray-300 italic mt-0.5">Sem número de nota</div>
                        )}
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${status.cls}`}>
                      {status.label}
                    </span>
                  </div>

                  {/* Pricing / Order relation */}
                  <div className="bg-gray-50 rounded-xl p-3 flex justify-between items-center text-xs">
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Valor total</p>
                      <p className="text-base font-extrabold text-gray-800 flex items-center mt-0.5">
                        <LuDollarSign size={15} className="text-[#384A6C] -ml-0.5 shrink-0" />
                        {Number(inv.purchase_order?.total_value || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Pedido Relacionado</p>
                      <span className="inline-flex text-[10px] bg-white text-gray-600 border border-gray-200 px-2 py-0.5 rounded font-extrabold uppercase mt-1">
                        #{inv.purchase_order_id}
                      </span>
                    </div>
                  </div>

                  {/* Dates Row */}
                  <div className="flex items-center justify-between text-xs border-t border-gray-50 pt-3">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-1.5 text-gray-500">
                        <LuCalendar size={12} className="text-gray-400" />
                        <span>Emissão: <b>{formatDate(inv.issue_date)}</b></span>
                      </div>
                      
                      {inv.due_date && (
                        <div className="flex items-center gap-1.5 text-red-500 font-medium">
                          <LuCalendar size={12} className="text-red-400" />
                          <span>Vencimento: <b>{formatDate(inv.due_date)}</b></span>
                        </div>
                      )}
                    </div>

                    {/* View file link if exists */}
                    {inv.link_file && (
                      <a
                        href={inv.link_file}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-[#384A6C] bg-[#384A6C]/5 hover:bg-[#384A6C]/10 border border-[#384A6C]/10 rounded-xl transition-colors select-none shrink-0"
                      >
                        <LuLink size={12} />
                        Ver arquivo
                        <LuExternalLink size={10} />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </GenericPanelLayout>
  );
}