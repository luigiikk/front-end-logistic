import { useEffect, useState } from "react";
import { api } from "../../../api/lib/api";
import { GenericPanelLayout } from "../../../components/Layout/company/layoutOption";
import {
  LuSearch, LuPackage, LuWarehouse, LuBoxes,
} from "react-icons/lu";

type InventoryItem = {
  id: number;
  quantity: number;
  resource: {
    id: number;
    name: string;
    category?: { name: string } | null;
  };
  warehouse: {
    id: number;
    name: string;
  } | null;
};

type GroupedResource = {
  resource_id: number;
  resource_name: string;
  category_name: string;
  total_quantity: number;
  warehouses: {
    warehouse_id: number;
    warehouse_name: string;
    quantity: number;
  }[];
};

export default function InventoryManager() {
  const [inventory, setInventory] = useState<GroupedResource[]>([]);
  const [filtered, setFiltered] = useState<GroupedResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  const loadInventory = async () => {
    try {
      setLoading(true);
      const res = await api.get("/inventory");
      const data: InventoryItem[] = Array.isArray(res.data) ? res.data : res.data.data ?? [];

      // Agrupa por recurso
      const map = new Map<number, GroupedResource>();
      for (const item of data) {
        const rid = item.resource.id;
        if (!map.has(rid)) {
          map.set(rid, {
            resource_id: rid,
            resource_name: item.resource.name ?? "—",
            category_name: item.resource.category?.name ?? "Sem categoria",
            total_quantity: 0,
            warehouses: [],
          });
        }
        const group = map.get(rid)!;
        group.total_quantity += item.quantity ?? 0;
        group.warehouses.push({
          warehouse_id: item.warehouse?.id ?? 0,
          warehouse_name: item.warehouse?.name ?? "—",
          quantity: item.quantity ?? 0,
        });
      }

      const grouped = Array.from(map.values());
      setInventory(grouped);
      setFiltered(grouped);
    } catch (err) {
      console.error("Erro ao carregar inventário:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadInventory(); }, []);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const lower = value.toLowerCase();
    setFiltered(
      inventory.filter((r) =>
        r.resource_name.toLowerCase().includes(lower) ||
        r.category_name.toLowerCase().includes(lower)
      )
    );
  };

  const toggleExpand = (id: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

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
              {filtered.length} recurso{filtered.length !== 1 ? "s" : ""} em estoque
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
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-2 text-gray-400">
              <LuBoxes size={32} className="opacity-30" />
              <p className="text-sm font-medium">Nenhum item em estoque.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {filtered.map((r) => {
                const isOpen = expanded.has(r.resource_id);
                return (
                  <div key={r.resource_id}>
                    {/* Linha do recurso */}
                    <button
                      onClick={() => toggleExpand(r.resource_id)}
                      className="w-full flex items-center justify-between px-6 py-4 hover:bg-[#EEF5FB]/60 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#384A6C]/10 flex items-center justify-center text-[#384A6C] shrink-0">
                          <LuPackage size={14} />
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-gray-800">{r.resource_name}</p>
                          <p className="text-xs text-gray-400">{r.category_name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#384A6C] bg-[#384A6C]/10 px-2.5 py-1 rounded-full">
                          <LuBoxes size={11} /> {r.total_quantity} un total
                        </span>
                        <span className="text-xs text-gray-400">
                          {r.warehouses.length} armazém{r.warehouses.length !== 1 ? "ns" : ""}
                        </span>
                        <span className={`text-xs text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}>▼</span>
                      </div>
                    </button>

                    {/* Detalhe por armazém */}
                    {isOpen && (
                      <div className="bg-[#EEF5FB]/40 border-t border-gray-100 px-6 py-3 space-y-2">
                        {r.warehouses.map((w) => (
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
              })}
            </div>
          )}
        </div>
      </div>
    </GenericPanelLayout>
  );
}