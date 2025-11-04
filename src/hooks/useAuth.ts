import { useState } from "react";
import { api } from "../api/lib/api";

export type UserType = "company" | "employee" ;

export interface AuthResponse<T = any> {
  token: string;
  user: T;
}

export function useAuth<T = any>(userType: UserType) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleAuth(identifier: string, password: string) {
    setError(null);
    setLoading(true);

    try {
      const routeMap: Record<UserType, string> = {
        company: "/auth/company",
        employee: "/auth/employee",
      };

      let body: any = {};
      if (userType === "company") body = { CNPJ: identifier, password };
      else if (userType === "employee") body = { enrollment: identifier, password };

      const response = await api.post<AuthResponse<T>>(routeMap[userType], body);

      localStorage.setItem("token", response.data.token);
      api.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;

      console.log(`${userType} logado com sucesso:`, response.data);
      return response.data;
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Erro ao fazer login");
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { handleAuth, loading, error };
}