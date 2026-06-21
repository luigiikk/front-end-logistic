export type ReportProduct = {
  id: number;
  name: string;
  description: string | null;
  quantity: number;
  volume: number;
  height: number;
  width: number;
  length: number;
  order_id?: number;
  order_code?: string | null;
};

export type ReportOrder = {
  id: number;
  code: string | null;
  created_at: string;
  recipient: {
    name: string;
  };
  status: {
    name: string;
  };
  vehicle?: {
    plate: string;
  } | null;
  products: Array<{
    id?: number;
    name?: string | null;
    quantity: number | null;
    volume: number;
  }>;
};

export type FilterType = "monthly" | "period";

export type MonthOption = {
  value: number;
  label: string;
};

export const MONTHS: MonthOption[] = [
  { value: 1, label: "Janeiro" },
  { value: 2, label: "Fevereiro" },
  { value: 3, label: "Março" },
  { value: 4, label: "Abril" },
  { value: 5, label: "Maio" },
  { value: 6, label: "Junho" },
  { value: 7, label: "Julho" },
  { value: 8, label: "Agosto" },
  { value: 9, label: "Setembro" },
  { value: 10, label: "Outubro" },
  { value: 11, label: "Novembro" },
  { value: 12, label: "Dezembro" },
];

