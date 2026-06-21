import { useState, useEffect } from "react";
import { api } from "../api/lib/api";
import { useToast } from "../components/Toast/ToastContent";
import type { Order, Vehicle } from "../types/allocateVehicle";

export function useAllocateVehicle() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filtered, setFiltered] = useState<Order[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const [ordersRes, vehiclesRes] = await Promise.all([
        api.get("/order"),
        api.get("/vehicle?status=Ativo"),
      ]);

      const withoutVehicle: Order[] = (
        Array.isArray(ordersRes.data) ? ordersRes.data : ordersRes.data.data ?? []
      ).filter((o: Order) => !o.vehicle);

      const vehicleList: Vehicle[] = Array.isArray(vehiclesRes.data)
        ? vehiclesRes.data
        : vehiclesRes.data.data ?? [];

      setOrders(withoutVehicle);
      setFiltered(withoutVehicle);
      setVehicles(vehicleList);
    } catch (err) {
      toast("Erro ao carregar dados", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSearch = (value: string) => {
    setSearch(value);
    const lower = value.toLowerCase();
    setFiltered(
      orders.filter(
        (o) =>
          o.code.toLowerCase().includes(lower) ||
          o.recipient.toLowerCase().includes(lower) ||
          o.status.toLowerCase().includes(lower)
      )
    );
  };

  const allocateVehicle = async (orderId: number, vehicleId: number) => {
    setSaving(true);
    try {
      await api.patch(`/order/${orderId}/vehicle`, { vehicle_id: vehicleId });
      toast("Veículo alocado com sucesso!", "success");
      await loadData();
    } catch (err) {
      toast("Erro ao alocar veículo.", "error");
      throw err;
    } finally {
      setSaving(false);
    }
  };

  return {
    orders: filtered,
    vehicles,
    loading,
    saving,
    search,
    handleSearch,
    allocateVehicle,
  };
}
