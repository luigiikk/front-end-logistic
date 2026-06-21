import { useState } from "react";
import { LuX, LuTruck, LuGauge, LuCircleCheck } from "react-icons/lu";
import type { Order, Vehicle } from "../../types/allocateVehicle";
import { getInitials, volumePercent } from "../../util/allocateVehicleHelpers";

type AllocateModalProps = {
  order: Order;
  vehicles: Vehicle[];
  onConfirm: (vehicleId: number) => Promise<void>;
  onClose: () => void;
  saving: boolean;
};

export function AllocateModal({
  order,
  vehicles,
  onConfirm,
  onClose,
  saving,
}: AllocateModalProps) {
  const [selected, setSelected] = useState<number | null>(null);

  const available = vehicles.filter((v) => v.available_volume > 0);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-7 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-extrabold text-[#384A6C] tracking-tight">
              Alocar Veículo
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Pedido{" "}
              <span className="font-semibold text-gray-600">#{order.code || order.id}</span>{" "}
              — {order.recipient}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition p-1 rounded-lg hover:bg-gray-100"
          >
            <LuX size={20} />
          </button>
        </div>

        {/* Lista de veículos */}
        <div className="overflow-y-auto px-6 py-4 space-y-3 flex-1">
          {available.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2 text-gray-400">
              <LuTruck size={32} className="opacity-30" />
              <p className="text-sm font-medium">Nenhum veículo com espaço disponível.</p>
            </div>
          ) : (
            available.map((v) => {
              const used = volumePercent(v);
              const isSelected = selected === v.id;

              return (
                <button
                  key={v.id}
                  onClick={() => setSelected(v.id)}
                  className={`w-full text-left px-4 py-4 rounded-2xl border-2 transition-all flex items-center gap-4
                    ${isSelected
                      ? "border-[#384A6C] bg-[#EEF5FB]"
                      : "border-gray-100 hover:border-[#94C0E0] hover:bg-[#EEF5FB]/40"
                    }`}
                >
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-[#384A6C]/10 flex items-center justify-center text-[#384A6C] text-xs font-bold shrink-0">
                    {getInitials(v.model)}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-800 text-sm">{v.plate}</p>
                      <span className="text-gray-400 text-xs">—</span>
                      <p className="text-sm text-gray-500 truncate">{v.model}</p>
                    </div>

                    <div className="flex items-center gap-2 mt-1.5">
                      <LuGauge size={11} className="text-gray-400 shrink-0" />
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            used >= 90
                              ? "bg-red-400"
                              : used >= 60
                              ? "bg-yellow-400"
                              : "bg-green-400"
                          }`}
                          style={{ width: `${used}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-400 whitespace-nowrap">
                        {v.available_volume} / {v.total_volume} m³ livre
                      </span>
                    </div>
                  </div>

                  {/* Check */}
                  {isSelected && (
                    <LuCircleCheck size={20} className="text-[#384A6C] shrink-0" />
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-8 py-5 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition"
          >
            Cancelar
          </button>
          <button
            disabled={!selected || saving}
            onClick={() => selected && onConfirm(selected)}
            className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-[#384A6C] hover:bg-[#2f3e5c]
              active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {saving ? "Alocando..." : "Confirmar alocação"}
          </button>
        </div>
      </div>
    </div>
  );
}
