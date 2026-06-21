export type PurchaseOrderSummary = {
  id: number;
  total_value: number;
  supplier?: { name: string };
  status?: { name: string; id: number };
  status_id: number;
  created_at: string;
  items?: any[];
  code?: string;
};

export type ResourceOption = {
  id: number;
  name: string;
  width?: number | null;
  height?: number | null;
  length?: number | null;
};

export type SelectOption = {
  id: number;
  name: string;
};

export type FormItem = {
  resource_id: number | "";
  warehouse_id: number | "";
  quantity: number;
  unit_price: number;
};

export type OrderForm = {
  supplier_id: number | "";
  status_id: number | "";
  items: FormItem[];
};

export const EMPTY_ITEM: FormItem = {
  resource_id: "",
  warehouse_id: "",
  quantity: 1,
  unit_price: 0,
};

export const EMPTY_FORM: OrderForm = {
  supplier_id: "",
  status_id: "",
  items: [{ ...EMPTY_ITEM }],
};
