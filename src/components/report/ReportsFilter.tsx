import { LuCalendar } from "react-icons/lu";
import type { FilterType } from "../../types/report";
import { MONTHS } from "../../types/report";

type ReportsFilterProps = {
  filterType: FilterType;
  setFilterType: (type: FilterType) => void;
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  selectedMonth: number;
  setSelectedMonth: (month: number) => void;
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  loadReportData: () => void;
};

export function ReportsFilter({
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
  loadReportData,
}: ReportsFilterProps) {
  return (
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
  );
}
