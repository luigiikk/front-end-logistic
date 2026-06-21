export type Product = {
  id?: number;
  name: string;
  description: string;
  quantity: number;
  height: number;
  width: number;
  length: number;
};

export type Order = {
  id: number;
  code: string;
  vehicle_id: number;
  recipient: string;
  sender_client: string;
  status: string;
  recipient_data?: {
    name: string;
    cpf: string;
    email: string;
    address: {
      street: string;
      number: string;
      complement: string;
      city: string;
      state: string;
      country: string;
      zipcode: string;
    };
  };
  products?: Product[];
  vehicle?: {
    plate: string;
  };
};

export type Vehicle = {
  id: number;
  plate: string;
  model: string;
  total_volume: number;
  available_volume: number;
  status: string;
};

export type OrderForm = {
  vehicle_id: number | "";
  recipient: {
    name: string;
    cpf: string;
    email: string;
    address: {
      street: string;
      number: string;
      complement: string;
      city: string;
      state: string;
      country: string;
      zipcode: string;
    };
  };
  products: Product[];
};

export const EMPTY_PRODUCT: Product = {
  name: "",
  description: "",
  quantity: 1,
  height: 0,
  width: 0,
  length: 0,
};

export const EMPTY_FORM: OrderForm = {
  vehicle_id: "",
  recipient: {
    name: "",
    cpf: "",
    email: "",
    address: {
      street: "",
      number: "",
      complement: "",
      city: "",
      state: "",
      country: "Brasil",
      zipcode: "",
    },
  },
  products: [{ ...EMPTY_PRODUCT }],
};
