import { useState } from "react";
import { GenericPanelLayout } from "../../../components/Layout/company/layoutOption";
import {
  LuSearch,
  LuFileText,
  LuLink,
  LuCalendar,
  LuHash,
  LuPencil,
  LuTrash2,
} from "react-icons/lu";
import { useInvoices } from "../../../hooks/useInvoice";
import { type Invoice, type InvoiceForm, EMPTY_FORM } from "../../../types/invoice";
import { getStatus, formatDate, formatDateForInput } from "../../../util/invoiceHelpers";
import { InvoiceModal } from "../../../components/invoice/invoiceModal";
import { DeleteInvoiceModal } from "../../../components/invoice/deleteInvoiceModal";

export default function InvoiceManager() {
  const {
    invoices,
    loading,
    saving,
    searchTerm,
    handleSearch,
    updateInvoice,
    deleteInvoice,
  } = useInvoices();

  // Interface State
  const [editing, setEditing] = useState<Invoice | null>(null);
  const [editForm, setEditForm] = useState<InvoiceForm>(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = useState<{ id: number } | null>(null);

  const handleEdit = (invoice: Invoice) => {
    setEditing(invoice);
    setEditForm({
      invoice_number: invoice.invoice_number ? String(invoice.invoice_number) : "",
      issue_date: formatDateForInput(invoice.issue_date),
      due_date: formatDateForInput(invoice.due_date),
      link_file: invoice.link_file ?? "",
    });
  };

  const handleSave = async () => {
    if (!editing) return;
    try {
      await updateInvoice(editing.id, editForm);
      setEditing(null);
    } catch {
      // Handled in hook
    }
  };

  return (
    // @ts-ignore
    <GenericPanelLayout panel="invoice">
      <div className="w-full max-w-5xl mx-auto space-y-6">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#384A6C] tracking-tight flex items-center gap-2">
              <LuFileText size={22} /> Faturas
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {invoices.length} fatura{invoices.length !== 1 ? "s" : ""} encontrada{invoices.length !== 1 ? "s" : ""}
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

        {/* ── Lista ── */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <svg className="animate-spin h-6 w-6 text-[#94C0E0]" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <p className="text-sm text-gray-400">Carregando faturas...</p>
            </div>
          ) : invoices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-2 text-gray-400">
              <LuFileText size={32} className="opacity-30" />
              <p className="text-sm font-medium">Nenhuma fatura encontrada.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-50">
              {invoices.map((inv) => {
                const status = getStatus(inv.purchase_order.status ?? inv.purchase_order.status_id);
                return (
                  <li
                    key={inv.id}
                    className="flex items-center justify-between px-6 py-4 hover:bg-[#EEF5FB]/60 transition-colors gap-4"
                  >
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-[#384A6C]/10 flex items-center justify-center text-[#384A6C] shrink-0 mt-0.5">
                        <LuFileText size={18} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-gray-800 text-sm">
                            Fatura #{inv.id}
                          </p>
                          {inv.invoice_number && (
                            <span className="text-xs text-gray-400 flex items-center gap-0.5">
                              <LuHash size={10} /> Nota {inv.invoice_number}
                            </span>
                          )}
                          <span className={`inline-flex text-xs font-semibold px-2.5 py-0.5 rounded-full border ${status.cls}`}>
                            {status.label}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-gray-400 mt-1 flex-wrap">
                          <span>
                            Pedido{" "}
                            <span className="font-semibold text-gray-600">
                              #{inv.purchase_order_id}
                            </span>
                          </span>
                          <span className="font-semibold text-[#384A6C]">
                            R$ {Number(inv.purchase_order.total_value).toFixed(2)}
                          </span>
                          <span className="flex items-center gap-1">
                            <LuCalendar size={10} />
                            Emissão: {formatDate(inv.issue_date)}
                          </span>
                          {inv.due_date && (
                            <span className="flex items-center gap-1 text-red-400">
                              <LuCalendar size={10} />
                              Venc: {formatDate(inv.due_date)}
                            </span>
                          )}
                        </div>

                        {inv.link_file && (
                          <a
                            href={inv.link_file}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-[#384A6C] font-semibold hover:underline underline-offset-4 mt-1.5"
                          >
                            <LuLink size={11} /> Ver arquivo
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleEdit(inv)}
                        className="p-2 rounded-xl text-[#384A6C] hover:bg-[#384A6C]/10 transition"
                        title="Editar"
                      >
                        <LuPencil size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget({ id: inv.id })}
                        className="p-2 rounded-xl text-red-400 hover:bg-red-50 transition"
                        title="Excluir"
                      >
                        <LuTrash2 size={16} />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* Modais */}
      {editing && (
        <InvoiceModal
          invoiceId={editing.id}
          purchaseOrderId={editing.purchase_order_id}
          form={editForm}
          onChange={setEditForm}
          onConfirm={handleSave}
          onClose={() => setEditing(null)}
          loading={saving}
        />
      )}

      {deleteTarget && (
        <DeleteInvoiceModal
          id={deleteTarget.id}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={async () => {
            await deleteInvoice(deleteTarget.id);
            setDeleteTarget(null);
          }}
        />
      )}
    </GenericPanelLayout>
  );
}