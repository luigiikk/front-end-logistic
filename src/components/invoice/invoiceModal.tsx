import React from "react";
import { LuX, LuInfo } from "react-icons/lu";
import type { InvoiceForm } from "../../types/invoice";

type InvoiceModalProps = {
  invoiceId: number;
  purchaseOrderId: number;
  form: InvoiceForm;
  onChange: (form: InvoiceForm) => void;
  onConfirm: () => void;
  onClose: () => void;
  loading: boolean;
};

function Field({
  label,
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label className="text-[10px] font-bold text-[#384A6C] uppercase tracking-widest">
        {label}
      </label>
      <input
        {...props}
        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-300 bg-white
          focus:outline-none focus:ring-2 focus:ring-[#94C0E0] focus:border-transparent transition-all"
      />
    </div>
  );
}

export function InvoiceModal({
  invoiceId,
  purchaseOrderId,
  form,
  onChange,
  onConfirm,
  onClose,
  loading,
}: InvoiceModalProps) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl">
        <div className="flex items-center justify-between px-8 pt-7 pb-4 border-b border-gray-100">
          <h2 className="text-xl font-extrabold text-[#384A6C] tracking-tight">
            Editar Fatura #{invoiceId}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition p-1 rounded-lg hover:bg-gray-100"
          >
            <LuX size={20} />
          </button>
        </div>

        <div className="px-8 py-6 space-y-4">
          <Field
            label="Número da nota fiscal"
            type="number"
            placeholder="Ex: 123456"
            value={form.invoice_number}
            onChange={(e) => onChange({ ...form, invoice_number: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Data de emissão"
              type="date"
              value={form.issue_date}
              onChange={(e) => onChange({ ...form, issue_date: e.target.value })}
            />
            <Field
              label="Data de vencimento"
              type="date"
              value={form.due_date}
              onChange={(e) => onChange({ ...form, due_date: e.target.value })}
            />
          </div>

          <Field
            label="Link do arquivo (PDF / Drive)"
            type="url"
            placeholder="https://..."
            value={form.link_file}
            onChange={(e) => onChange({ ...form, link_file: e.target.value })}
          />

          <div className="flex items-start gap-2 bg-[#EEF5FB] border border-[#94C0E0]/30 rounded-xl px-4 py-3 text-xs text-gray-500">
            <LuInfo size={14} className="text-[#384A6C] shrink-0 mt-0.5" />
            O <strong className="text-gray-700">valor</strong> e o{" "}
            <strong className="text-gray-700">status</strong> são gerenciados pelo Pedido de
            Compra #{purchaseOrderId}.
          </div>
        </div>

        <div className="flex justify-end gap-3 px-8 py-5 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-[#384A6C] hover:bg-[#2f3e5c] active:scale-95 transition-all disabled:opacity-60"
          >
            {loading ? "Salvando..." : "Salvar alterações"}
          </button>
        </div>
      </div>
    </div>
  );
}
