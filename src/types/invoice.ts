export type PurchaseOrder = {
  id: number;
  total_value: number;
  status_id: number;
  code?: string;
  status?: {
    name: string;
  };
};

export type Invoice = {
  id: number;
  invoice_number: number | null;
  purchase_order_id: number;
  company_id: number;
  issue_date: string;
  due_date: string | null;
  link_file: string | null;
  purchase_order: PurchaseOrder;
};

export type InvoiceForm = {
  invoice_number: string;
  issue_date: string;
  due_date: string;
  link_file: string;
};

export const EMPTY_FORM: InvoiceForm = {
  invoice_number: "",
  issue_date: "",
  due_date: "",
  link_file: "",
};
