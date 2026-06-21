export type Address = {
  street?: string;
  number?: number;
  complement?: string;
  city?: string;
  state?: string;
  country?: string;
  zipcode?: string;
};

export type Supplier = {
  id: number;
  name: string;
  email: string;
  phone: string;
  CNPJ: string;
  contactPerson?: string;
  notes?: string;
  address?: Address | null;
};

export type SupplierForm = {
  name: string;
  email: string;
  phone: string;
  CNPJ: string;
  contactPerson: string;
  notes: string;
  street: string;
  number: string;
  complement: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
};

export const EMPTY_FORM: SupplierForm = {
  name: "",
  email: "",
  phone: "",
  CNPJ: "",
  contactPerson: "",
  notes: "",
  street: "",
  number: "",
  complement: "",
  city: "",
  state: "",
  country: "",
  zipcode: "",
};
