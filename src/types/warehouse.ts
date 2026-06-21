export type Address = {
  street: string;
  number: number;
  city: string;
  state: string;
  zipcode: string;
  complement?: string;
  country?: string;
};

export type Warehouse = {
  id: number;
  name: string;
  address?: Address | null;
  total_volume?: number | null;
  used_volume?: number | null;
  available_volume?: number | null;
};

export type WarehouseForm = {
  name: string;
  street: string;
  number: string;
  complement: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  total_volume: string;
};

export const EMPTY_FORM: WarehouseForm = {
  name: "",
  street: "",
  number: "",
  complement: "",
  city: "",
  state: "",
  country: "",
  zipcode: "",
  total_volume: "",
};
