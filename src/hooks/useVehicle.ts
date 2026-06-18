import { useState, useEffect } from "react";
import { api } from "../api/lib/api";
import { useToast } from "../components/Toast/ToastContent";
import type { Vehicle, Status, VehicleForm } from "../types/vehicle";

export function useVehicles() {
  const { toast } = useToast();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filtered, setFiltered] = useState<Vehicle[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  const loadVehicles = async () => {
    setLoading(true);
    try {
      const [vRes, sRes] = await Promise.all([
        api.get("/vehicle"),
        api.get("/status/vehicle").catch(() => ({ data: [] }))
      ]);

      const vehicleList = Array.isArray(vRes.data) ? vRes.data : vRes.data.data ?? [];
      const vehicleStatuses = Array.isArray(sRes.data) ? sRes.data : sRes.data.data ?? [];

      setVehicles(vehicleList);
      setFiltered(vehicleList);
      setStatuses(vehicleStatuses);
    } catch (err: any) {
      toast(`${err}`, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  const handleSearch = (value: string) => {
    setSearch(value);
    const lower = value.toLowerCase();
    setFiltered(
      vehicles.filter(
        (v) =>
          v.plate.toLowerCase().includes(lower) ||
          v.model.toLowerCase().includes(lower) ||
          v.status.toLowerCase().includes(lower) ||
          String(v.total_volume).includes(value)
      )
    );
  };

  const createVehicle = async (form: VehicleForm) => {
    setSaving(true);
    try {
      const validDocuments = form.documents
        .filter((d) => d.type.trim() !== "")
        .map((d) => ({
          ...d,
          issued_at: d.issued_at ? new Date(d.issued_at).toISOString() : undefined,
          expires_at: d.expires_at ? new Date(d.expires_at).toISOString() : undefined,
        }));

      const validMaintenances = form.maintenances
        .filter((m) => m.type.trim() !== "")
        .map((m) => ({
          ...m,
          cost: m.cost ? Number(m.cost) : undefined,
          performed_at: m.performed_at ? new Date(m.performed_at).toISOString() : undefined,
          next_due_at: m.next_due_at ? new Date(m.next_due_at).toISOString() : undefined,
        }));

      await api.post("/vehicle", {
        plate: form.plate,
        model: form.model,
        total_volume: Number(form.total_volume),
        status_id: form.status_id,
        documents: validDocuments,
        maintenances: validMaintenances,
      });

      await loadVehicles();
      toast("Veículo criado com sucesso!", "success");
    } catch (err: any) {
      toast(`${err}`, "error");
      throw err; // Lança o erro para o componente não fechar o modal
    } finally {
      setSaving(false);
    }
  };

  const updateVehicle = async (id: number, form: VehicleForm) => {
    setSaving(true);
    try {
      const payload = {
        plate: form.plate,
        model: form.model,
        total_volume: Number(form.total_volume),
        ...(form.status_id && { status_id: form.status_id }),
      };
      await api.put(`/vehicle/${id}`, payload);
      await loadVehicles();
      toast("Veículo atualizado com sucesso!", "success");
    } catch (err: any) {
      toast(`${err}`, "error");
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const deleteVehicle = async (id: number) => {
    try {
      await api.delete(`/vehicle/${id}`);
      const next = vehicles.filter((v) => v.id !== id);
      setVehicles(next);
      handleSearch(search); // Atualiza os filtros
      toast("Veículo excluído com sucesso!", "success");
    } catch (err: any) {
      toast(`${err}`, "error");
    }
  };

  return {
    vehicles: filtered,
    statuses,
    loading,
    saving,
    search,
    handleSearch,
    createVehicle,
    updateVehicle,
    deleteVehicle,
  };
}