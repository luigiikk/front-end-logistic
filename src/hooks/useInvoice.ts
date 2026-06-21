import { useState, useEffect } from "react";
import { api } from "../api/lib/api";
import { useToast } from "../components/Toast/ToastContent";
import type { Invoice, InvoiceForm } from "../types/invoice";
import { getStatus } from "../util/invoiceHelpers";

export function useInvoices() {
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filtered, setFiltered] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const loadInvoices = async () => {
    setLoading(true);
    try {
      const res = await api.get("/invoice");
      const data: Invoice[] = Array.isArray(res.data) ? res.data : res.data.data ?? [];
      setInvoices(data);
      setFiltered(data);
    } catch (err: any) {
      toast("Erro ao carregar faturas.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const lower = value.toLowerCase();
    setFiltered(
      invoices.filter((inv) => {
        const statusLabel = getStatus(inv.purchase_order.status ?? inv.purchase_order.status_id).label.toLowerCase();
        return (
          String(inv.id).includes(value) ||
          String(inv.invoice_number ?? "").includes(value) ||
          String(inv.purchase_order_id).includes(value) ||
          statusLabel.includes(lower)
        );
      })
    );
  };

  const updateInvoice = async (id: number, form: InvoiceForm) => {
    setSaving(true);
    try {
      const payload = {
        invoice_number: form.invoice_number ? Number(form.invoice_number) : null,
        issue_date: new Date(form.issue_date),
        due_date: form.due_date ? new Date(form.due_date) : null,
        link_file: form.link_file || null,
      };
      await api.put(`/invoice/${id}`, payload);
      
      const updated = invoices.map((inv) =>
        inv.id === id
          ? {
              ...inv,
              invoice_number: payload.invoice_number,
              issue_date: payload.issue_date.toISOString(),
              due_date: payload.due_date?.toISOString() ?? null,
              link_file: payload.link_file,
            }
          : inv
      );
      setInvoices(updated);
      setFiltered(updated.filter((inv) => {
        const statusLabel = getStatus(inv.purchase_order.status ?? inv.purchase_order.status_id).label.toLowerCase();
        return (
          String(inv.id).includes(searchTerm) ||
          String(inv.invoice_number ?? "").includes(searchTerm) ||
          String(inv.purchase_order_id).includes(searchTerm) ||
          statusLabel.includes(searchTerm.toLowerCase())
        );
      }));
      toast("Fatura atualizada com sucesso!", "success");
    } catch (err: any) {
      toast("Erro ao atualizar fatura.", "error");
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const deleteInvoice = async (id: number) => {
    try {
      await api.delete(`/invoice/${id}`);
      const next = invoices.filter((i) => i.id !== id);
      setInvoices(next);
      setFiltered(next.filter((inv) => {
        const statusLabel = getStatus(inv.purchase_order.status ?? inv.purchase_order.status_id).label.toLowerCase();
        return (
          String(inv.id).includes(searchTerm) ||
          String(inv.invoice_number ?? "").includes(searchTerm) ||
          String(inv.purchase_order_id).includes(searchTerm) ||
          statusLabel.includes(searchTerm.toLowerCase())
        );
      }));
      toast("Fatura excluída com sucesso!", "success");
    } catch (err: any) {
      toast("Erro ao excluir fatura.", "error");
    }
  };

  return {
    invoices: filtered,
    loading,
    saving,
    searchTerm,
    handleSearch,
    updateInvoice,
    deleteInvoice,
  };
}
