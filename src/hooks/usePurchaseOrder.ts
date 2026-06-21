import { useState, useEffect } from "react";
import { api } from "../api/lib/api";
import { useToast } from "../components/Toast/ToastContent";
import type { PurchaseOrderSummary, ResourceOption, SelectOption, OrderForm } from "../types/purchaseOrder";

export function usePurchaseOrders() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [orders, setOrders] = useState<PurchaseOrderSummary[]>([]);
  const [suppliers, setSuppliers] = useState<SelectOption[]>([]);
  const [resources, setResources] = useState<ResourceOption[]>([]);
  const [warehouses, setWarehouses] = useState<SelectOption[]>([]);
  const [statuses, setStatuses] = useState<SelectOption[]>([]);

  const extractData = (resData: any) => Array.isArray(resData) ? resData : resData.data ?? [];

  const loadData = async () => {
    setLoading(true);
    try {
      const [supRes, resRes, warRes, statRes, ordersRes] = await Promise.all([
        api.get("/supplier"),
        api.get("/resource"),
        api.get("/warehouses"),
        api.get("/status/purchase_order"),
        api.get("/purchase-orders"),
      ]);
      setSuppliers(extractData(supRes.data));
      setResources(extractData(resRes.data));
      setWarehouses(extractData(warRes.data));
      setStatuses(extractData(statRes.data));
      setOrders(extractData(ordersRes.data));
    } catch (err: any) {
      toast("Erro ao carregar dados dos pedidos de compra.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getOrderDetails = async (id: number): Promise<OrderForm> => {
    try {
      const res = await api.get(`/purchase-orders/${id}`);
      const order = res.data;
      return {
        supplier_id: order.supplier_id,
        status_id: order.status_id,
        items: order.items.map((item: any) => ({
          resource_id: item.resource_id,
          warehouse_id: item.warehouse_id || item.warehouse?.id || "",
          quantity: item.quantity,
          unit_price: item.unit_price,
        })),
      };
    } catch (err: any) {
      toast("Erro ao carregar detalhes do pedido.", "error");
      throw err;
    }
  };

  const createOrder = async (form: OrderForm) => {
    setSaving(true);
    try {
      const payload = {
        supplier_id: Number(form.supplier_id),
        status_id: Number(form.status_id),
        purchase_orders_items: form.items.map((item) => ({
          resource_id: Number(item.resource_id),
          warehouse_id: Number(item.warehouse_id),
          quantity: Number(item.quantity),
          unit_price: Number(item.unit_price),
        })),
      };
      await api.post("/purchase-orders", payload);
      toast("Pedido de compra criado com sucesso!", "success");
      await loadData();
    } catch (err: any) {
      toast("Erro ao criar pedido de compra.", "error");
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const updateOrder = async (id: number, form: OrderForm) => {
    setSaving(true);
    try {
      const payload = {
        supplier_id: Number(form.supplier_id),
        status_id: Number(form.status_id),
        purchase_orders_items: form.items.map((item) => ({
          resource_id: Number(item.resource_id),
          warehouse_id: Number(item.warehouse_id),
          quantity: Number(item.quantity),
          unit_price: Number(item.unit_price),
        })),
      };
      await api.put(`/purchase-orders/${id}`, payload);
      toast("Pedido de compra atualizado com sucesso!", "success");
      await loadData();
    } catch (err: any) {
      toast("Erro ao atualizar pedido de compra.", "error");
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const deleteOrder = async (id: number) => {
    try {
      await api.delete(`/purchase-orders/${id}`);
      setOrders((prev) => prev.filter((o) => o.id !== id));
      toast("Pedido de compra excluído com sucesso!", "success");
    } catch (err: any) {
      toast("Erro ao excluir pedido de compra.", "error");
    }
  };

  return {
    orders,
    suppliers,
    resources,
    warehouses,
    statuses,
    loading,
    saving,
    getOrderDetails,
    createOrder,
    updateOrder,
    deleteOrder,
  };
}
