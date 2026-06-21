type CapacityBarProps = {
  used: number;
  total: number;
};

export function CapacityBar({ used, total }: CapacityBarProps) {
  const pct = total > 0 ? Math.min((used / total) * 100, 100) : 0;
  const color = pct >= 90 ? "bg-red-400" : pct >= 70 ? "bg-yellow-400" : "bg-emerald-400";

  return (
    <div className="flex flex-col gap-2 min-w-[280px]">
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-gray-50 rounded-xl px-3 py-2">
          <p className="text-[10px] text-gray-400 mb-0.5">Total</p>
          <p className="text-sm font-semibold text-gray-700">{total.toFixed(2)} m³</p>
        </div>
        <div className="bg-gray-50 rounded-xl px-3 py-2">
          <p className="text-[10px] text-gray-400 mb-0.5">Ocupado</p>
          <p className="text-sm font-semibold text-gray-700">
            {used.toFixed(2)} m³{" "}
            <span className="text-[10px] text-gray-400">({pct.toFixed(0)}%)</span>
          </p>
        </div>
        <div className="bg-gray-50 rounded-xl px-3 py-2">
          <p className="text-[10px] text-gray-400 mb-0.5">Disponível</p>
          <p className="text-sm font-semibold text-gray-700">{(total - used).toFixed(2)} m³</p>
        </div>
      </div>

      <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[10px] text-gray-400 text-right">{pct.toFixed(0)}% ocupado</span>
    </div>
  );
}
