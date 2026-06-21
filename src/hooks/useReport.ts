import { useState, useEffect } from "react";
import { api } from "../api/lib/api";
import { useToast } from "../components/Toast/ToastContent";
import type { ReportProduct, ReportOrder, FilterType } from "../types/report";

export function useReport() {
  const { toast } = useToast();

  // Data State
  const [orders, setOrders] = useState<ReportOrder[]>([]);
  const [products, setProducts] = useState<ReportProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // Time Filter State
  const [filterType, setFilterType] = useState<FilterType>("monthly");
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedMonth, setSelectedMonth] = useState<number>(6); // June as default based on current system time
  const [startDate, setStartDate] = useState<string>("2026-06-01");
  const [endDate, setEndDate] = useState<string>("2026-06-30");

  // UI Navigation State
  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "products">("overview");

  // Table Search & Internal Filter State
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [productSearch, setProductSearch] = useState("");

  // Reactive Load of Report Data from Backend
  const loadReportData = async () => {
    setLoading(true);
    try {
      let ordersUrl = "";
      let productsUrl = "";

      if (filterType === "monthly") {
        ordersUrl = `/reports/orders/month?year=${selectedYear}&month=${selectedMonth}`;
        productsUrl = `/reports/products/month?year=${selectedYear}&month=${selectedMonth}`;
      } else {
        ordersUrl = `/reports/orders/period?start_date=${startDate}&end_date=${endDate}`;
        productsUrl = `/reports/products/period?start_date=${startDate}&end_date=${endDate}`;
      }

      const [productsRes, ordersRes] = await Promise.all([
        api.get(productsUrl),
        api.get(ordersUrl),
      ]);

      const prodList = productsRes.data?.products ?? [];
      const ordList = ordersRes.data?.orders ?? [];

      setProducts(prodList);
      setOrders(ordList);
    } catch (err: any) {
      toast("Erro ao carregar os dados dos relatórios temporais.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReportData();
  }, [filterType, selectedYear, selectedMonth, startDate, endDate]);

  // Compute stats on active subset focusing on all requested statuses
  const totalOrders = orders.length;

  const pendingVehicleOrders = orders.filter(
    (o) => !o.vehicle || !o.vehicle.plate
  ).length;

  const inProcessOrders = orders.filter(
    (o) => (o.vehicle && o.vehicle.plate) && o.status?.name?.toLowerCase().includes("processo")
  ).length;

  const transitOrders = orders.filter(
    (o) =>
      (o.vehicle && o.vehicle.plate) &&
      (o.status?.name?.toLowerCase().includes("trânsito") ||
        o.status?.name?.toLowerCase().includes("transito") ||
        o.status?.name?.toLowerCase().includes("saiu"))
  ).length;

  const deliveredOrders = orders.filter(
    (o) => (o.vehicle && o.vehicle.plate) && o.status?.name?.toLowerCase().includes("entregue")
  ).length;

  const completedOrOtherOrders = totalOrders - pendingVehicleOrders - inProcessOrders - transitOrders - deliveredOrders;

  const totalProducts = products.length;
  const totalQuantity = products.reduce((acc, p) => acc + (p.quantity || 0), 0);
  const avgProductsPerOrder = totalOrders > 0 ? (totalQuantity / totalOrders).toFixed(1) : "0";

  // Filter Orders list dynamically
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      (order.code && order.code.toLowerCase().includes(orderSearch.toLowerCase())) ||
      (order.recipient?.name && order.recipient.name.toLowerCase().includes(orderSearch.toLowerCase())) ||
      String(order.id).includes(orderSearch);

    if (orderStatusFilter === "all") return matchesSearch;

    if (orderStatusFilter === "pending_vehicle") {
      return matchesSearch && (!order.vehicle || !order.vehicle.plate);
    }

    const lowerStatus = order.status?.name?.toLowerCase() ?? "";
    if (orderStatusFilter === "in_process") {
      return matchesSearch && (order.vehicle && order.vehicle.plate) && lowerStatus.includes("processo");
    }

    if (orderStatusFilter === "transit") {
      return (
        matchesSearch &&
        (order.vehicle && order.vehicle.plate) &&
        (lowerStatus.includes("trânsito") ||
          lowerStatus.includes("transito") ||
          lowerStatus.includes("saiu"))
      );
    }

    if (orderStatusFilter === "delivered") {
      return matchesSearch && (order.vehicle && order.vehicle.plate) && lowerStatus.includes("entregue");
    }

    if (orderStatusFilter === "others") {
      return (
        matchesSearch &&
        (order.vehicle && order.vehicle.plate) &&
        !lowerStatus.includes("processo") &&
        !lowerStatus.includes("trânsito") &&
        !lowerStatus.includes("transito") &&
        !lowerStatus.includes("saiu") &&
        !lowerStatus.includes("entregue")
      );
    }
    return matchesSearch;
  });

  // Filter Products list dynamically
  const filteredProducts = products.filter((p) => {
    const orderCode = p.order_code ?? "";
    return (
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(productSearch.toLowerCase())) ||
      orderCode.toLowerCase().includes(productSearch.toLowerCase())
    );
  });

  // Top products from current list
  const topProducts = [...products]
    .sort((a, b) => (b.quantity || 0) - (a.quantity || 0))
    .slice(0, 5);

  const maxProductQty = topProducts.length > 0 ? Math.max(...topProducts.map((p) => p.quantity || 0)) : 1;

  // Export Filtered Orders as CSV
  const exportOrdersCSV = () => {
    if (filteredOrders.length === 0) {
      toast("Nenhum pedido para exportar.", "info");
      return;
    }
    const headers = ["ID", "Código", "Destinatário", "Status", "Veículo"];
    const rows = filteredOrders.map((o) => [
      o.id,
      o.code || `Sem Código`,
      o.recipient?.name || "",
      o.status?.name || "",
      o.vehicle?.plate || "Sem veículo",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(","), ...rows.map((e) => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `relatorio_pedidos_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast("Pedidos exportados com sucesso!", "success");
  };

  // Export Filtered Products as CSV
  const exportProductsCSV = () => {
    if (filteredProducts.length === 0) {
      toast("Nenhum produto para exportar.", "info");
      return;
    }
    const headers = ["ID", "Nome do Produto", "Descrição", "Quantidade", "Código do Pedido"];
    const rows = filteredProducts.map((p) => [
      p.id,
      p.name,
      p.description || "",
      p.quantity || 0,
      p.order_code || "Não Associado",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(","), ...rows.map((e) => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `relatorio_produtos_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast("Produtos exportados com sucesso!", "success");
  };

  const handlePrint = () => {
    window.print();
  };

  return {
    orders,
    products,
    loading,
    filterType,
    setFilterType,
    selectedYear,
    setSelectedYear,
    selectedMonth,
    setSelectedMonth,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    activeTab,
    setActiveTab,
    orderSearch,
    setOrderSearch,
    orderStatusFilter,
    setOrderStatusFilter,
    productSearch,
    setProductSearch,
    loadReportData,
    totalOrders,
    pendingVehicleOrders,
    inProcessOrders,
    transitOrders,
    deliveredOrders,
    completedOrOtherOrders,
    totalProducts,
    totalQuantity,
    avgProductsPerOrder,
    filteredOrders,
    filteredProducts,
    topProducts,
    maxProductQty,
    exportOrdersCSV,
    exportProductsCSV,
    handlePrint,
  };
}
