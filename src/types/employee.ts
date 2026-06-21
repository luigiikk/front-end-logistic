export type Role = {
  id: number;
  name: string;
};

export type Address = {
  street?: string;
  state?: string;
  country?: string;
  city?: string;
  zip_code?: string;
  number?: number;
  complement?: string;
};

export type Employee = {
  id: number;
  name: string;
  enrollment: string;
  email?: string;
  phone_number?: string;
  role?: Role;
  addres?: Address;
};

export type EmployeeForm = {
  name: string;
  role: string;
  email: string;
  phone_number: string;
  password?: string;
  country: string;
  state: string;
  city: string;
  street: string;
  number: string;
  zip_code: string;
  complement: string;
};

export const EMPTY_FORM: EmployeeForm = {
  name: "",
  role: "",
  email: "",
  phone_number: "",
  password: "",
  country: "",
  state: "",
  city: "",
  street: "",
  number: "",
  zip_code: "",
  complement: "",
};
