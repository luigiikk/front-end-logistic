import { useState, useEffect } from "react";
import { api } from "../api/lib/api";
import { useToast } from "../components/Toast/ToastContent";
import type { Order, Vehicle, OrderForm } from "../types/order";

export function useOrders() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filtered, setFiltered] = useState<Order[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  const loadOrders = async () => {
    try {
      const res = await api.get("/order");
      const list = Array.isArray(res.data) ? res.data : res.data.data ?? [];
      setOrders(list);
      setFiltered(list);
    } catch (err: any) {
      toast("Erro ao carregar pedidos.", "error");
    } finally {
      setLoading(false);
    }
  };

  const loadVehicles = async () => {
    if (window.location.pathname.includes("/employee")) {
      return;
    }
    try {
      const res = await api.get("/vehicle?status=Ativo");
      const list: Vehicle[] = Array.isArray(res.data) ? res.data : res.data.data ?? [];
      setVehicles(list);
    } catch (err: any) {
      toast("Erro ao carregar veículos.", "error");
    }
  };

  useEffect(() => {
    loadOrders();
    loadVehicles();
  }, []);

  const handleSearch = (value: string) => {
    setSearch(value);
    const lower = value.toLowerCase();
    setFiltered(
      orders.filter(
        (o) =>
          String(o.id).includes(value) ||
          (o.code && o.code.toLowerCase().includes(lower)) ||
          (o.recipient && o.recipient.toLowerCase().includes(lower))
      )
    );
  };

  const createOrder = async (form: OrderForm) => {
    setSaving(true);
    try {
      const payload = {
        ...(form.vehicle_id && { vehicle_id: Number(form.vehicle_id) }),
        recipient: {
          name: form.recipient.name,
          cpf: form.recipient.cpf.replace(/\D/g, ""),
          email: form.recipient.email,
          address: {
            street: form.recipient.address.street,
            number: form.recipient.address.number
              ? Number(form.recipient.address.number)
              : null,
            complement: form.recipient.address.complement,
            city: form.recipient.address.city,
            state: form.recipient.address.state,
            country: form.recipient.address.country,
            zipcode: form.recipient.address.zipcode.replace(/\D/g, ""),
          },
        },
        products: form.products.map((p) => ({
          name: p.name,
          description: p.description,
          quantity: Number(p.quantity),
          height: Number(p.height),
          width: Number(p.width),
          length: Number(p.length),
        })),
      };
      await api.post("/order/company", payload);
      await loadOrders();
      toast("Pedido criado com sucesso!", "success");
    } catch (err: any) {
      const msg = err.response?.data?.message || "Erro ao criar pedido.";
      toast(msg, "error");
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const deleteOrder = async (id: number) => {
    try {
      await api.delete(`/order/${id}`);
      const next = orders.filter((o) => o.id !== id);
      setOrders(next);
      setFiltered(next.filter((o) => {
        const lower = search.toLowerCase();
        return (
          String(o.id).includes(search) ||
          (o.code && o.code.toLowerCase().includes(lower)) ||
          (o.recipient && o.recipient.toLowerCase().includes(lower))
        );
      }));
      toast("Pedido excluído com sucesso!", "success");
    } catch (err: any) {
      toast("Erro ao excluir pedido.", "error");
    }
  };

  return {
    orders: filtered,
    vehicles,
    loading,
    saving,
    search,
    handleSearch,
    createOrder,
    deleteOrder,
    refreshOrders: loadOrders,
  };
}
