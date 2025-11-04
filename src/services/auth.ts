import { api } from "../api/lib/api";

interface AuthCompany {
  cnpj: string;
  password: string;
}

interface AuthEmployee {
  enrollment: string;
  password: string;
}

export async function authCompany(data: AuthCompany) {
  const response = await api.post("/auth/company", data);
  return response.data; 
}

export async function authEmployee(data: AuthEmployee) {
  const response = await api.post("/auth/employee", data);
  return response.data; 
}