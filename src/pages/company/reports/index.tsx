import { GenericPanelLayout } from "../../../components/Layout/company/layoutOption";
import {
  LuPrinter,
  LuDownload,
  LuTrendingUp,
} from "react-icons/lu";
import { useReport } from "../../../hooks/useReport";
import { MONTHS } from "../../../types/report";
import { ReportsFilter } from "../../../components/report/ReportsFilter";
import { ReportsOverview } from "../../../components/report/ReportsOverview";
import { ReportsOrdersTable } from "../../../components/report/ReportsOrdersTable";
import { ReportsProductsTable } from "../../../components/report/ReportsProductsTable";

export default function ReportsManager() {
  const {
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
  } = useReport();

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

        {/* ── Time Period Filter Panel ── */}
        <ReportsFilter
          filterType={filterType}
          setFilterType={setFilterType}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          loadReportData={loadReportData}
        />

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
            {activeTab === "overview" && (
              <ReportsOverview
                totalOrders={totalOrders}
                pendingVehicleOrders={pendingVehicleOrders}
                inProcessOrders={inProcessOrders}
                transitOrders={transitOrders}
                deliveredOrders={deliveredOrders}
                completedOrOtherOrders={completedOrOtherOrders}
                totalProducts={totalProducts}
                totalQuantity={totalQuantity}
                avgProductsPerOrder={avgProductsPerOrder}
                topProducts={topProducts}
                maxProductQty={maxProductQty}
              />
            )}

            {activeTab === "orders" && (
              <ReportsOrdersTable
                orderSearch={orderSearch}
                setOrderSearch={setOrderSearch}
                orderStatusFilter={orderStatusFilter}
                setOrderStatusFilter={setOrderStatusFilter}
                filteredOrders={filteredOrders}
              />
            )}

            {activeTab === "products" && (
              <ReportsProductsTable
                productSearch={productSearch}
                setProductSearch={setProductSearch}
                filteredProducts={filteredProducts}
              />
            )}
          </>
        )}
      </div>
    </GenericPanelLayout>
  );
}
