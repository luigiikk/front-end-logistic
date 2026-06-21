import { LuPackage, LuBoxes, LuWarehouse } from "react-icons/lu";
import type { GroupedResource } from "../../types/inventory";

type InventoryRowProps = {
  resource: GroupedResource;
  isOpen: boolean;
  onToggle: () => void;
};

export function InventoryRow({
  resource,
  isOpen,
  onToggle,
}: InventoryRowProps) {
  return (
    <div>
      {/* Linha do recurso */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-[#EEF5FB]/60 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#384A6C]/10 flex items-center justify-center text-[#384A6C] shrink-0">
            <LuPackage size={14} />
          </div>
          <div>
            <p className="font-semibold text-sm text-gray-800">{resource.resource_name}</p>
            <p className="text-xs text-gray-400">{resource.category_name}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#384A6C] bg-[#384A6C]/10 px-2.5 py-1 rounded-full">
            <LuBoxes size={11} /> {resource.total_quantity} un total
          </span>
          <span className="text-xs text-gray-400">
            {resource.warehouses.length} armazém{resource.warehouses.length !== 1 ? "ns" : ""}
          </span>
          <span className={`text-xs text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}>▼</span>
        </div>
      </button>

      {/* Detalhe por armazém */}
      {isOpen && (
        <div className="bg-[#EEF5FB]/40 border-t border-gray-100 px-6 py-3 space-y-2">
          {resource.warehouses.map((w) => (
            <div key={w.warehouse_id} className="flex items-center justify-between py-2 px-4 bg-white rounded-xl border border-gray-100">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <LuWarehouse size={14} className="text-gray-400" />
                {w.warehouse_name}
              </div>
              <span className="text-sm font-bold text-[#384A6C]">{w.quantity} un</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
