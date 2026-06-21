import { useState, useEffect } from "react";
import { api } from "../api/lib/api";
import { useToast } from "../components/Toast/ToastContent";
import type { Client, ClientForm } from "../types/client";

export function useClients() {
  const { toast } = useToast();
  const [clients, setClients] = useState<Client[]>([]);
  const [filtered, setFiltered] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const loadClients = async () => {
    setLoading(true);
    try {
      const res = await api.get("/client");
      const list = Array.isArray(res.data) ? res.data : res.data.data ?? [];
      setClients(list);
      setFiltered(list);
    } catch (err) {
      toast("Erro ao carregar clientes.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const lower = value.toLowerCase();
    setFiltered(
      clients.filter(
        (c) =>
          c.name.toLowerCase().includes(lower) ||
          String(c.id).includes(value) ||
          c.CNPJ.includes(value)
      )
    );
  };

  const getClientDetails = async (id: number): Promise<Client> => {
    try {
      const res = await api.get(`/client/${id}`);
      return res.data;
    } catch (err) {
      toast("Erro ao carregar detalhes do cliente.", "error");
      throw err;
    }
  };

  const createClient = async (form: ClientForm) => {
    setSaving(true);
    try {
      await api.post("/client", {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password?.trim(),
        phone_number: form.phone_number.replace(/\D/g, ""),
        CNPJ: form.CNPJ.replace(/\D/g, ""),
        addressData: {
          street: form.street?.trim() || null,
          number: form.number ?? 1,
          complement: form.complement?.trim() || null,
          city: form.city?.trim() || null,
          state: form.state?.trim() || null,
          country: form.country?.trim() || null,
          zipcode: form.zipcode?.replace(/\D/g, "") || null,
        },
      });
      await loadClients();
      toast("Cliente cadastrado com sucesso!", "success");
    } catch (err) {
      toast("Erro ao cadastrar cliente.", "error");
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const updateClient = async (id: number, form: ClientForm | Client) => {
    setSaving(true);
    try {
      await api.put(`/client/${id}`, {
        name: form.name,
        email: form.email,
        phone_number: form.phone_number.replace(/\D/g, ""),
        CNPJ: form.CNPJ.replace(/\D/g, ""),
        password: form.password,
        street: form.street || null,
        number: form.number || null,
        complement: form.complement || null,
        city: form.city || null,
        state: form.state || null,
        country: form.country || null,
        zipcode: form.zipcode?.replace(/\D/g, "") || null,
      });
      await loadClients();
      toast("Cliente atualizado com sucesso!", "success");
    } catch (err) {
      toast("Erro ao atualizar cliente.", "error");
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const deleteClient = async (id: number) => {
    try {
      await api.delete(`/client/${id}`);
      const next = clients.filter((c) => c.id !== id);
      setClients(next);
      setFiltered(next.filter((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase())));
      toast("Cliente excluído com sucesso!", "success");
    } catch (err) {
      toast("Erro ao excluir cliente.", "error");
    }
  };

  return {
    clients: filtered,
    loading,
    saving,
    searchTerm,
    handleSearch,
    getClientDetails,
    createClient,
    updateClient,
    deleteClient,
  };
}
