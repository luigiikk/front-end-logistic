export type Client = {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  password?: string;
  CNPJ: string;
  street?: string | null;
  number?: number | null;
  complement?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  zipcode?: string | null;
};

export type ClientForm = {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  password?: string;
  CNPJ: string;
  street: string;
  number: number | null;
  complement: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
};

export const EMPTY_FORM: ClientForm = {
  id: 0,
  name: "",
  email: "",
  phone_number: "",
  password: "",
  CNPJ: "",
  street: "",
  number: null,
  complement: "",
  city: "",
  state: "",
  country: "",
  zipcode: "",
};
