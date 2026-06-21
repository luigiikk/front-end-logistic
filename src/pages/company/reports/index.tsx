import { useState, useEffect } from "react";
import { api } from "../../../api/lib/api";
import { useToast } from "../../../components/Toast/ToastContent";
import { GenericPanelLayout } from "../../../components/Layout/company/layoutOption";
import {
  LuSearch,
  LuDownload,
  LuPrinter,
  LuBox,
  LuPackage,
  LuTruck,
  LuCircleCheck,
  LuCircleAlert,
  LuTrendingUp,
  LuFilter,
  LuCalendar,
} from "react-icons/lu";

// Define local types matching backend reports responses
type Product = {
  id: number;
  name: string;
  description: string | null;
  quantity: number;
  volume: number;
  height: number;
  width: number;
  length: number;
  order_id?: number;
  order_code?: string | null;
};

type Order = {
  id: number;
  code: string | null;
  created_at: string;
  recipient: {
    name: string;
  };
  status: {
    name: string;
  };
  vehicle?: {
    plate: string;
  } | null;
  products: Array<{
    id?: number;
    name?: string | null;
    quantity: number | null;
    volume: number;
  }>;
};

const MONTHS = [
  { value: 1, label: "Janeiro" },
  { value: 2, label: "Fevereiro" },
  { value: 3, label: "Março" },
  { value: 4, label: "Abril" },
  { value: 5, label: "Maio" },
  { value: 6, label: "Junho" },
  { value: 7, label: "Julho" },
  { value: 8, label: "Agosto" },
  { value: 9, label: "Setembro" },
  { value: 10, label: "Outubro" },
  { value: 11, label: "Novembro" },
  { value: 12, label: "Dezembro" },
];

export default function ReportsManager() {
  const { toast } = useToast();
  
  // Data State
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Time Filter State
  const [filterType, setFilterType] = useState<"monthly" | "period">("monthly");
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

  // Compute stats on active subset focusing on all requested statuses:
  // 1. Pendente de Veículo
  // 2. Em Processo
  // 3. Em Trânsito
  // 4. Entregue
  // 5. Outros
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

  return (
    <GenericPanelLayout panel="relatorio">
      <div className="w-full max-w-5xl mx-auto space-y-6 print:p-0 print:max-w-none print:bg-white">
        
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
          <div>
            <h1 className="text-2xl font-extrabold text-[#384A6C] tracking-tight flex items-center gap-2">
              <LuTrendingUp size={24} className="text-[#384A6C]" />
              Relatórios de Logística
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Análise operacional com base nos endpoints do backend corporativo.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-white text-gray-600 border border-gray-200 px-4 py-2.5 rounded-xl text-sm font-bold
                hover:bg-gray-50 active:scale-95 transition-all shadow-sm cursor-pointer"
            >
              <LuPrinter size={16} /> Imprimir / PDF
            </button>
            
            {activeTab === "orders" && (
              <button
                onClick={exportOrdersCSV}
                className="flex items-center gap-2 bg-[#384A6C] text-white px-4 py-2.5 rounded-xl text-sm font-bold
                  hover:bg-[#2f3e5c] active:scale-95 transition-all shadow-sm cursor-pointer"
              >
                <LuDownload size={16} /> Exportar CSV
              </button>
            )}

            {activeTab === "products" && (
              <button
                onClick={exportProductsCSV}
                className="flex items-center gap-2 bg-[#384A6C] text-white px-4 py-2.5 rounded-xl text-sm font-bold
                  hover:bg-[#2f3e5c] active:scale-95 transition-all shadow-sm cursor-pointer"
              >
                <LuDownload size={16} /> Exportar CSV
              </button>
            )}
          </div>
        </div>

        {/* Print Only Header */}
        <div className="hidden print:block border-b pb-4 mb-6">
          <h1 className="text-3xl font-extrabold text-[#384A6C]">LogiFast - Relatório de Desempenho</h1>
          <p className="text-sm text-gray-500">
            Filtro de busca: {filterType === "monthly" 
              ? `Mensal - ${MONTHS.find(m => m.value === selectedMonth)?.label} / ${selectedYear}`
              : `Período - de ${startDate} até ${endDate}`}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Emitido em: {new Date().toLocaleDateString("pt-BR")} às {new Date().toLocaleTimeString("pt-BR")}
          </p>
        </div>

        {/* ── Time Period Filter Panel (Interactive Control) ── */}
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm print:hidden space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#384A6C]/10 flex items-center justify-center text-[#384A6C]">
                <LuCalendar size={16} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#384A6C]">Filtro de Tempo do Relatório</h3>
                <p className="text-xs text-gray-400">Determine o escopo temporal das informações operacionais</p>
              </div>
            </div>

            {/* Toggle Switch */}
            <div className="flex bg-[#EEF5FB] p-1 rounded-xl w-fit">
              <button
                onClick={() => setFilterType("monthly")}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filterType === "monthly"
                    ? "bg-[#384A6C] text-white shadow-sm"
                    : "text-gray-500 hover:text-[#384A6C]"
                }`}
              >
                Relatório Mensal
              </button>
              <button
                onClick={() => setFilterType("period")}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filterType === "period"
                    ? "bg-[#384A6C] text-white shadow-sm"
                    : "text-gray-500 hover:text-[#384A6C]"
                }`}
              >
                Período Livre
              </button>
            </div>
          </div>

          {/* Conditional Inputs */}
          <div className="pt-2 border-t border-gray-50 flex flex-wrap gap-4 items-end">
            {filterType === "monthly" ? (
              <>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-[#384A6C] uppercase tracking-widest">Mês</label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(Number(e.target.value))}
                    className="bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs font-bold text-gray-700 outline-none w-44"
                  >
                    {MONTHS.map((m) => (
                      <option key={m.value} value={m.value}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-[#384A6C] uppercase tracking-widest">Ano</label>
                  <input
                    type="number"
                    min={2020}
                    max={2035}
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    className="bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-xl text-xs font-bold text-gray-700 outline-none w-28"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-[#384A6C] uppercase tracking-widest">Data Inicial</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-xl text-xs font-bold text-gray-700 outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-[#384A6C] uppercase tracking-widest">Data Final</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-xl text-xs font-bold text-gray-700 outline-none"
                  />
                </div>
              </>
            )}

            <button
              onClick={loadReportData}
              className="px-4 py-2 bg-[#EEF5FB] text-[#384A6C] hover:bg-[#94C0E0]/20 rounded-xl text-xs font-bold ml-auto transition-colors"
            >
              Recarregar Relatório
            </button>
          </div>
        </div>

        {/* ── Tabs Navigation ── */}
        <div className="flex border-b border-gray-200 gap-1 print:hidden">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-5 py-3 text-sm font-bold rounded-t-xl transition-all border-b-2 ${
              activeTab === "overview"
                ? "border-[#384A6C] text-[#384A6C] bg-white"
                : "border-transparent text-gray-400 hover:text-gray-600 hover:bg-white/50"
            }`}
          >
            Visão Geral
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-5 py-3 text-sm font-bold rounded-t-xl transition-all border-b-2 ${
              activeTab === "orders"
                ? "border-[#384A6C] text-[#384A6C] bg-white"
                : "border-transparent text-gray-400 hover:text-gray-600 hover:bg-white/50"
            }`}
          >
            Pedidos ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`px-5 py-3 text-sm font-bold rounded-t-xl transition-all border-b-2 ${
              activeTab === "products"
                ? "border-[#384A6C] text-[#384A6C] bg-white"
                : "border-transparent text-gray-400 hover:text-gray-600 hover:bg-white/50"
            }`}
          >
            Produtos ({products.length})
          </button>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center py-24 gap-3 w-full">
            <svg className="animate-spin h-8 w-8 text-[#94C0E0]" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <p className="text-sm text-gray-400 font-medium animate-pulse">
              Filtrando banco de dados no backend...
            </p>
          </div>
        ) : (
          <>
            {/* ── Tab: Visão Geral ── */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                
                {/* ── Summary Stats Grid (Responsive 6-column Grid) ── */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {/* Card 1: Pedidos Totais */}
                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[110px] group hover:border-[#94C0E0]/50 transition-all duration-300">
                    <div className="flex justify-between items-start w-full">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        Total
                      </p>
                      <div className="w-7 h-7 rounded-lg bg-[#384A6C]/10 flex items-center justify-center text-[#384A6C] shrink-0">
                        <LuBox size={14} />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-[#384A6C] leading-none mb-1">
                        {totalOrders}
                      </h3>
                      <p className="text-[9px] text-gray-400">Pedidos</p>
                    </div>
                  </div>

                  {/* Card 2: Pendente de Veículo */}
                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[110px] group hover:border-red-200 transition-all duration-300">
                    <div className="flex justify-between items-start w-full">
                      <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider">
                        Pend. Veíc.
                      </p>
                      <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center text-red-500 shrink-0">
                        <LuCircleAlert size={14} />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-red-600 leading-none mb-1">
                        {pendingVehicleOrders}
                      </h3>
                      <p className="text-[9px] text-red-500 font-semibold">
                        {totalOrders > 0 ? `${((pendingVehicleOrders / totalOrders) * 100).toFixed(0)}%` : "0%"} sem frota
                      </p>
                    </div>
                  </div>

                  {/* Card 3: Em Processo */}
                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[110px] group hover:border-purple-200 transition-all duration-300">
                    <div className="flex justify-between items-start w-full">
                      <p className="text-[10px] font-bold text-purple-500 uppercase tracking-wider">
                        Processo
                      </p>
                      <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                        <LuTrendingUp size={14} />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-purple-600 leading-none mb-1">
                        {inProcessOrders}
                      </h3>
                      <p className="text-[9px] text-purple-500 font-semibold">
                        {totalOrders > 0 ? `${((inProcessOrders / totalOrders) * 100).toFixed(0)}%` : "0%"} preparação
                      </p>
                    </div>
                  </div>

                  {/* Card 4: Em Trânsito */}
                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[110px] group hover:border-blue-200 transition-all duration-300">
                    <div className="flex justify-between items-start w-full">
                      <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">
                        Trânsito
                      </p>
                      <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                        <LuTruck size={14} />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-blue-600 leading-none mb-1">
                        {transitOrders}
                      </h3>
                      <p className="text-[9px] text-blue-500 font-semibold">
                        {totalOrders > 0 ? `${((transitOrders / totalOrders) * 100).toFixed(0)}%` : "0%"} em rota
                      </p>
                    </div>
                  </div>

                  {/* Card 5: Entregue */}
                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[110px] group hover:border-green-200 transition-all duration-300">
                    <div className="flex justify-between items-start w-full">
                      <p className="text-[10px] font-bold text-green-500 uppercase tracking-wider">
                        Entregue
                      </p>
                      <div className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                        <LuCircleCheck size={14} />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-green-600 leading-none mb-1">
                        {deliveredOrders}
                      </h3>
                      <p className="text-[9px] text-green-500 font-semibold">
                        {totalOrders > 0 ? `${((deliveredOrders / totalOrders) * 100).toFixed(0)}%` : "0%"} concluído
                      </p>
                    </div>
                  </div>

                  {/* Card 6: Total de Itens */}
                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[110px] group hover:border-amber-200 transition-all duration-300">
                    <div className="flex justify-between items-start w-full">
                      <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">
                        Total Itens
                      </p>
                      <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                        <LuPackage size={14} />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-amber-600 leading-none mb-1">
                        {totalQuantity}
                      </h3>
                      <p className="text-[9px] text-gray-400">Qtd. total enviada</p>
                    </div>
                  </div>
                </div>

                {/* ── Charts & Visual representations section ── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Status Distribution Visual Widget */}
                  <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                      <h4 className="text-base font-bold text-[#384A6C] tracking-tight">
                        Distribuição do Fluxo Operacional
                      </h4>
                      <span className="text-xs font-semibold text-gray-400 bg-gray-50 px-2.5 py-1 rounded-lg">
                        Gráfico Stacked
                      </span>
                    </div>

                    <div className="space-y-6">
                      {/* Custom Percentage Stacked Progress Bar */}
                      <div className="h-7 w-full bg-gray-100 rounded-full overflow-hidden flex">
                        {totalOrders > 0 ? (
                          <>
                            <div
                              style={{ width: `${(pendingVehicleOrders / totalOrders) * 100}%` }}
                              className="bg-red-500 h-full transition-all hover:opacity-90 cursor-help"
                              title={`Pendente de Veículo: ${pendingVehicleOrders}`}
                            />
                            <div
                              style={{ width: `${(inProcessOrders / totalOrders) * 100}%` }}
                              className="bg-purple-500 h-full transition-all hover:opacity-90 cursor-help"
                              title={`Em Processo: ${inProcessOrders}`}
                            />
                            <div
                              style={{ width: `${(transitOrders / totalOrders) * 100}%` }}
                              className="bg-blue-500 h-full transition-all hover:opacity-90 cursor-help"
                              title={`Em Trânsito: ${transitOrders}`}
                            />
                            <div
                              style={{ width: `${(deliveredOrders / totalOrders) * 100}%` }}
                              className="bg-green-500 h-full transition-all hover:opacity-90 cursor-help"
                              title={`Entregue: ${deliveredOrders}`}
                            />
                            <div
                              style={{ width: `${(completedOrOtherOrders / totalOrders) * 100}%` }}
                              className="bg-gray-300 h-full transition-all hover:opacity-90 cursor-help"
                              title={`Outros: ${completedOrOtherOrders}`}
                            />
                          </>
                        ) : (
                          <div className="w-full bg-gray-200 h-full text-center text-[10px] text-gray-400 leading-7">
                            Nenhum pedido registrado no intervalo selecionado
                          </div>
                        )}
                      </div>

                      {/* Legend Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-xs">
                        <div className="flex items-start gap-2">
                          <span className="w-3 h-3 rounded bg-red-500 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-gray-700">Pendente Veíc.</p>
                            <p className="text-[10px] text-gray-400">
                              {pendingVehicleOrders} ({totalOrders > 0 ? ((pendingVehicleOrders / totalOrders) * 100).toFixed(0) : 0}%)
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="w-3 h-3 rounded bg-purple-500 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-gray-700">Em Processo</p>
                            <p className="text-[10px] text-gray-400">
                              {inProcessOrders} ({totalOrders > 0 ? ((inProcessOrders / totalOrders) * 100).toFixed(0) : 0}%)
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="w-3 h-3 rounded bg-blue-500 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-gray-700">Em Trânsito</p>
                            <p className="text-[10px] text-gray-400">
                              {transitOrders} ({totalOrders > 0 ? ((transitOrders / totalOrders) * 100).toFixed(0) : 0}%)
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="w-3 h-3 rounded bg-green-500 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-gray-700">Entregues</p>
                            <p className="text-[10px] text-gray-400">
                              {deliveredOrders} ({totalOrders > 0 ? ((deliveredOrders / totalOrders) * 100).toFixed(0) : 0}%)
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="w-3 h-3 rounded bg-gray-300 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-gray-700">Outros</p>
                            <p className="text-[10px] text-gray-400">
                              {completedOrOtherOrders} ({totalOrders > 0 ? ((completedOrOtherOrders / totalOrders) * 100).toFixed(0) : 0}%)
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Top Products Widget */}
                  <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6">
                    <div className="flex items-center justify-between">
                      <h4 className="text-base font-bold text-[#384A6C] tracking-tight">
                        Itens mais Pedidos
                      </h4>
                      <span className="text-xs font-semibold text-amber-500 bg-amber-50 px-2.5 py-1 rounded-lg">
                        Qtd por Produto
                      </span>
                    </div>

                    <div className="space-y-4">
                      {topProducts.length === 0 ? (
                        <div className="text-center py-8 text-sm text-gray-400 italic">
                          Nenhum produto movimentado neste filtro.
                        </div>
                      ) : (
                        topProducts.map((p) => {
                          const percent = Math.min(100, Math.round(((p.quantity || 0) / maxProductQty) * 100));
                          return (
                            <div key={p.id} className="space-y-1.5">
                              <div className="flex justify-between text-xs font-medium text-gray-700">
                                <span className="truncate max-w-[150px]" title={p.name}>
                                  {p.name}
                                </span>
                                <span className="font-bold text-gray-900">{p.quantity} unid.</span>
                              </div>
                              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                <div
                                  style={{ width: `${percent}%` }}
                                  className="h-full bg-amber-500 rounded-full transition-all"
                                />
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>

                {/* Operational summary description card */}
                <div className="bg-gradient-to-r from-[#384A6C] to-[#4c628e] text-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <h4 className="text-lg font-bold flex items-center gap-2">
                      <LuTrendingUp size={20} />
                      Resumo Operacional Temporizado
                    </h4>
                    <p className="text-sm text-white/80 max-w-xl">
                      Com base no filtro temporal ativo, temos <span className="font-semibold text-white">{totalProducts}</span> produto(s) distinto(s) vinculados a <span className="font-semibold text-white">{totalOrders}</span> pedido(s) despachado(s). A média volumétrica e de itens por pedido computa-se em <span className="font-semibold text-white">{avgProductsPerOrder} unidades</span>.
                    </p>
                  </div>
                  <div className="flex gap-4 shrink-0">
                    <div className="bg-white/10 px-4 py-3 rounded-2xl text-center">
                      <span className="block text-2xl font-black">{avgProductsPerOrder}</span>
                      <span className="text-[9px] text-white/60 uppercase font-bold tracking-wider">Itens / Pedido</span>
                    </div>
                    <div className="bg-white/10 px-4 py-3 rounded-2xl text-center">
                      <span className="block text-2xl font-black">{totalQuantity}</span>
                      <span className="text-[9px] text-white/60 uppercase font-bold tracking-wider">Itens Totais</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── Tab: Pedidos (Detailed Table List) ── */}
            {activeTab === "orders" && (
              <div className="space-y-4">
                {/* Table Search & Status Filters */}
                <div className="flex flex-col sm:flex-row gap-3 print:hidden">
                  <div className="flex-1 flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm">
                    <LuSearch size={15} className="text-gray-400 shrink-0" />
                    <input
                      type="text"
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      placeholder="Filtrar por código ou destinatário..."
                      className="outline-none text-sm text-gray-700 placeholder-gray-300 w-full"
                    />
                  </div>

                  <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm min-w-[200px]">
                    <LuFilter size={14} className="text-gray-400" />
                    <select
                      value={orderStatusFilter}
                      onChange={(e) => setOrderStatusFilter(e.target.value)}
                      className="outline-none bg-transparent text-xs text-gray-600 font-bold w-full cursor-pointer"
                    >
                      <option value="all">Filtro: Todos</option>
                      <option value="pending_vehicle">Filtro: Pendente de Veículo</option>
                      <option value="in_process">Filtro: Em Processo</option>
                      <option value="transit">Filtro: Em Trânsito</option>
                      <option value="delivered">Filtro: Entregue</option>
                      <option value="others">Filtro: Outros</option>
                    </select>
                  </div>
                </div>

                {/* Orders Report Table */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 text-xs font-bold uppercase tracking-wider">
                          <th className="px-6 py-4">ID</th>
                          <th className="px-6 py-4">Código</th>
                          <th className="px-6 py-4">Destinatário</th>
                          <th className="px-6 py-4 text-center">Status</th>
                          <th className="px-6 py-4">Veículo Alocado</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50 text-gray-700">
                        {filteredOrders.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="text-center py-10 text-gray-400">
                              Nenhum pedido localizado com os filtros selecionados.
                            </td>
                          </tr>
                        ) : (
                          filteredOrders.map((order) => {
                            const lower = order.status?.name?.toLowerCase() ?? "";
                            const isDelivered = lower.includes("entregue");
                            const isProcess = lower.includes("processo");
                            const isTransit = lower.includes("trânsito") || lower.includes("transito") || lower.includes("saiu");
                            
                            const badgeCls = isDelivered
                              ? "bg-green-50 text-green-700 border-green-200"
                              : isProcess
                              ? "bg-purple-50 text-purple-700 border-purple-200"
                              : isTransit
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : "bg-gray-100 text-gray-600 border-gray-200";

                            return (
                              <tr key={order.id} className="hover:bg-[#EEF5FB]/40 transition-colors">
                                <td className="px-6 py-4 font-bold text-gray-400">{order.id}</td>
                                <td className="px-6 py-4 font-bold text-[#384A6C]">{order.code || "—"}</td>
                                <td className="px-6 py-4">{order.recipient?.name || "—"}</td>
                                <td className="px-6 py-4 text-center">
                                  <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full border ${badgeCls}`}>
                                    {order.status?.name || "Pendente"}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  {order.vehicle ? (
                                    <span className="flex items-center gap-1 text-xs font-medium text-gray-700">
                                      <LuTruck size={12} className="text-gray-400" />
                                      {order.vehicle.plate}
                                    </span>
                                  ) : (
                                    <span className="text-xs text-red-500 font-bold bg-red-50 px-2 py-0.5 rounded-lg border border-red-200">
                                      Pendente de Veículo
                                    </span>
                                  )}
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ── Tab: Produtos (Detailed Table List) ── */}
            {activeTab === "products" && (
              <div className="space-y-4">
                {/* Table Search */}
                <div className="flex flex-col sm:flex-row gap-3 print:hidden">
                  <div className="flex-1 flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm">
                    <LuSearch size={15} className="text-gray-400 shrink-0" />
                    <input
                      type="text"
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      placeholder="Filtrar por nome do produto ou código do pedido..."
                      className="outline-none text-sm text-gray-700 placeholder-gray-300 w-full"
                    />
                  </div>
                </div>

                {/* Products Report Table */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 text-xs font-bold uppercase tracking-wider">
                          <th className="px-6 py-4">ID</th>
                          <th className="px-6 py-4">Nome do Produto</th>
                          <th className="px-6 py-4">Descrição</th>
                          <th className="px-6 py-4 text-center">Quantidade Solicitada</th>
                          <th className="px-6 py-4">Código do Pedido</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50 text-gray-700">
                        {filteredProducts.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="text-center py-10 text-gray-400">
                              Nenhum produto localizado com os filtros selecionados.
                            </td>
                          </tr>
                        ) : (
                          filteredProducts.map((p) => {
                            const orderCode = p.order_code;
                            const qty = p.quantity || 0;

                            return (
                              <tr key={p.id} className="hover:bg-[#EEF5FB]/40 transition-colors">
                                <td className="px-6 py-4 font-bold text-gray-400">{p.id}</td>
                                <td className="px-6 py-4 font-semibold text-gray-800">{p.name}</td>
                                <td className="px-6 py-4 text-xs text-gray-500 max-w-[200px] truncate" title={p.description || ""}>
                                  {p.description || "—"}
                                </td>
                                <td className="px-6 py-4 font-bold text-center text-gray-800">{qty}</td>
                                <td className="px-6 py-4 font-semibold text-gray-500">
                                  {orderCode ? (
                                    <span className="text-[#384A6C]">{orderCode}</span>
                                  ) : (
                                    <span className="text-gray-400 italic">Não vinculado</span>
                                  )}
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </GenericPanelLayout>
  );
}
