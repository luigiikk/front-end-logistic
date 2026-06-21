import { GenericPanelLayout } from "../../../components/Layout/company/layoutOption";
import {
  LuSearch, LuBoxes,
} from "react-icons/lu";
import { useInventory } from "../../../hooks/useInventory";
import { InventoryRow } from "../../../components/inventory/inventoryRow";

export default function InventoryManager() {
  const {
    inventory,
    loading,
    searchTerm,
    handleSearch,
    expanded,
    toggleExpand,
  } = useInventory();

  return (
    <GenericPanelLayout panel="inventario">
      <div className="w-full max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#384A6C] tracking-tight flex items-center gap-2">
              <LuBoxes size={22} /> Inventário
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {inventory.length} recurso{inventory.length !== 1 ? "s" : ""} em estoque
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm">
            <LuSearch size={15} className="text-gray-400 shrink-0" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Buscar recurso ou categoria..."
              className="outline-none text-sm text-gray-700 placeholder-gray-300 w-48"
            />
          </div>
        </div>

        {/* Lista */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <svg className="animate-spin h-6 w-6 text-[#94C0E0]" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <p className="text-sm text-gray-400">Carregando inventário...</p>
            </div>
          ) : inventory.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-2 text-gray-400">
              <LuBoxes size={32} className="opacity-30" />
              <p className="text-sm font-medium">Nenhum item em estoque.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {inventory.map((r) => (
                <InventoryRow
                  key={r.resource_id}
                  resource={r}
                  isOpen={expanded.has(r.resource_id)}
                  onToggle={() => toggleExpand(r.resource_id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </GenericPanelLayout>
  );
}