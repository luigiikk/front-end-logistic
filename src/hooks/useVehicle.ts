import { useState, useEffect } from "react";
import { api } from "../api/lib/api";
import { useToast } from "../components/Toast/ToastContent";
import type {
  Vehicle,
  Status,
  VehicleForm,
  VehicleDetail,
  DocumentForm,
  MaintenanceForm,
} from "../types/vehicle";

export function useVehicles() {
  const { toast } = useToast();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filtered, setFiltered] = useState<Vehicle[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  // Detailed vehicle state
  const [selectedVehicleDetail, setSelectedVehicleDetail] = useState<VehicleDetail | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

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
      const msg = err.response?.data?.message || `${err}`;
      toast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchVehicleDetails = async (id: number) => {
    setLoadingDetails(true);
    try {
      const res = await api.get(`/vehicle/${id}`);
      setSelectedVehicleDetail(res.data);
    } catch (err: any) {
      toast("Erro ao carregar detalhes do veículo.", "error");
    } finally {
      setLoadingDetails(false);
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
          mileage: m.mileage ? Number(m.mileage) : undefined,
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
      if (selectedVehicleDetail && selectedVehicleDetail.id === id) {
        await fetchVehicleDetails(id);
      }
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
      const lower = search.toLowerCase();
      setFiltered(
        next.filter(
          (v) =>
            v.plate.toLowerCase().includes(lower) ||
            v.model.toLowerCase().includes(lower) ||
            v.status.toLowerCase().includes(lower) ||
            String(v.total_volume).includes(search)
        )
      );
      if (selectedVehicleDetail && selectedVehicleDetail.id === id) {
        setSelectedVehicleDetail(null);
      }
      toast("Veículo excluído com sucesso!", "success");
    } catch (err: any) {
      toast(`${err}`, "error");
    }
  };

  const addDocument = async (vehicleId: number, doc: DocumentForm) => {
    try {
      await api.post(`/vehicle/${vehicleId}/documents`, {
        type: doc.type,
        number: doc.number || undefined,
        notes: doc.notes || undefined,
        issued_at: doc.issued_at ? new Date(doc.issued_at).toISOString() : undefined,
        expires_at: doc.expires_at ? new Date(doc.expires_at).toISOString() : undefined,
        file_url: doc.file_url || undefined,
      });
      toast("Documento adicionado com sucesso!", "success");
      await fetchVehicleDetails(vehicleId);
    } catch (err: any) {
      toast("Erro ao adicionar documento.", "error");
      throw err;
    }
  };

  const updateDocument = async (vehicleId: number, docId: number, doc: DocumentForm) => {
    try {
      await api.put(`/vehicle/${vehicleId}/documents/${docId}`, {
        type: doc.type,
        number: doc.number || undefined,
        notes: doc.notes || undefined,
        issued_at: doc.issued_at ? new Date(doc.issued_at).toISOString() : undefined,
        expires_at: doc.expires_at ? new Date(doc.expires_at).toISOString() : undefined,
        file_url: doc.file_url || undefined,
      });
      toast("Documento atualizado com sucesso!", "success");
      await fetchVehicleDetails(vehicleId);
    } catch (err: any) {
      toast("Erro ao atualizar documento.", "error");
      throw err;
    }
  };

  const deleteDocument = async (vehicleId: number, docId: number) => {
    try {
      await api.delete(`/vehicle/${vehicleId}/documents/${docId}`);
      toast("Documento excluído com sucesso!", "success");
      await fetchVehicleDetails(vehicleId);
    } catch (err: any) {
      toast("Erro ao excluir documento.", "error");
    }
  };

  const addMaintenance = async (vehicleId: number, maint: MaintenanceForm) => {
    try {
      await api.post(`/vehicle/${vehicleId}/maintenance`, {
        type: maint.type,
        description: maint.description || undefined,
        cost: maint.cost ? Number(maint.cost) : undefined,
        mileage: maint.mileage ? Number(maint.mileage) : undefined,
        performed_at: maint.performed_at ? new Date(maint.performed_at).toISOString() : undefined,
        next_due_at: maint.next_due_at ? new Date(maint.next_due_at).toISOString() : undefined,
        performed_by: maint.performed_by || undefined,
      });
      toast("Registro de manutenção adicionado com sucesso!", "success");
      await fetchVehicleDetails(vehicleId);
    } catch (err: any) {
      toast("Erro ao adicionar manutenção.", "error");
      throw err;
    }
  };

  const updateMaintenance = async (vehicleId: number, maintId: number, maint: MaintenanceForm) => {
    try {
      await api.put(`/vehicle/${vehicleId}/maintenance/${maintId}`, {
        type: maint.type,
        description: maint.description || undefined,
        cost: maint.cost ? Number(maint.cost) : undefined,
        mileage: maint.mileage ? Number(maint.mileage) : undefined,
        performed_at: maint.performed_at ? new Date(maint.performed_at).toISOString() : undefined,
        next_due_at: maint.next_due_at ? new Date(maint.next_due_at).toISOString() : undefined,
        performed_by: maint.performed_by || undefined,
      });
      toast("Manutenção atualizada com sucesso!", "success");
      await fetchVehicleDetails(vehicleId);
    } catch (err: any) {
      toast("Erro ao atualizar manutenção.", "error");
      throw err;
    }
  };

  const deleteMaintenance = async (vehicleId: number, maintId: number) => {
    try {
      await api.delete(`/vehicle/${vehicleId}/maintenance/${maintId}`);
      toast("Manutenção excluída com sucesso!", "success");
      await fetchVehicleDetails(vehicleId);
    } catch (err: any) {
      toast("Erro ao excluir manutenção.", "error");
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
    selectedVehicleDetail,
    setSelectedVehicleDetail,
    loadingDetails,
    fetchVehicleDetails,
    addDocument,
    updateDocument,
    deleteDocument,
    addMaintenance,
    updateMaintenance,
    deleteMaintenance,
  };
}