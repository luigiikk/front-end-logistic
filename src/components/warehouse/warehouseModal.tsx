import React from "react";
import { LuX, LuWarehouse, LuBoxes, LuMapPin } from "react-icons/lu";
import type { WarehouseForm } from "../../types/warehouse";

type WarehouseModalProps = {
  title: string;
  form: WarehouseForm;
  onChange: (field: keyof WarehouseForm, value: string) => void;
  onConfirm: () => void;
  onClose: () => void;
  loading: boolean;
};

function Field({
  label,
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; className?: string }) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label className="text-[10px] font-bold text-[#384A6C] uppercase tracking-widest">{label}</label>
      <input
        {...props}
        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#94C0E0] focus:border-transparent transition-all"
      />
    </div>
  );
}

export function WarehouseModal({
  title,
  form,
  onChange,
  onConfirm,
  onClose,
  loading,
}: WarehouseModalProps) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-7 pb-4 border-b border-gray-100">
          <h2 className="text-xl font-extrabold text-[#384A6C] tracking-tight flex items-center gap-2">
            <LuWarehouse size={18} /> {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition p-1 rounded-lg hover:bg-gray-100"
          >
            <LuX size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="px-8 py-6 overflow-y-auto space-y-5">
          <Field
            label="Nome do Armazém *"
            placeholder="Ex: Galpão Central"
            value={form.name}
            onChange={(e) => onChange("name", e.target.value)}
          />

          <div>
            <p className="text-[10px] font-bold text-[#384A6C] uppercase tracking-widest flex items-center gap-1 mb-3">
              <LuBoxes size={11} /> Capacidade Volumétrica
            </p>
            <Field
              label="Volume total (m³)"
              placeholder="Ex: 500.00 — deixe vazio para sem limite"
              type="number"
              step="0.01"
              min={0}
              value={form.total_volume}
              onChange={(e) => onChange("total_volume", e.target.value)}
            />
          </div>

          <div>
            <p className="text-[10px] font-bold text-[#384A6C] uppercase tracking-widest flex items-center gap-1 mb-3">
              <LuMapPin size={11} /> Localização
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Field
                label="CEP"
                className="md:col-span-1"
                placeholder="00000-000"
                value={form.zipcode}
                onChange={(e) => onChange("zipcode", e.target.value)}
              />
              <Field
                label="Rua *"
                className="md:col-span-3"
                placeholder="Nome da rua"
                value={form.street}
                onChange={(e) => onChange("street", e.target.value)}
              />
              <Field
                label="Número"
                className="md:col-span-1"
                type="number"
                placeholder="0"
                value={form.number}
                onChange={(e) => onChange("number", e.target.value)}
              />
              <Field
                label="Complemento"
                className="md:col-span-1"
                placeholder="Apto, Bloco..."
                value={form.complement}
                onChange={(e) => onChange("complement", e.target.value)}
              />
              <Field
                label="Cidade *"
                className="md:col-span-2"
                placeholder="Cidade"
                value={form.city}
                onChange={(e) => onChange("city", e.target.value)}
              />
              <Field
                label="UF"
                className="md:col-span-1"
                placeholder="SP"
                maxLength={2}
                value={form.state}
                onChange={(e) => onChange("state", e.target.value)}
              />
              <Field
                label="País"
                className="md:col-span-1"
                placeholder="Brasil"
                value={form.country}
                onChange={(e) => onChange("country", e.target.value)}
              />
            </div>
          </div>
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
            onClick={onConfirm}
            disabled={loading}
            className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-[#384A6C] hover:bg-[#2f3e5c] active:scale-95 transition-all disabled:opacity-60"
          >
            {loading ? "Salvando..." : "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  );
}
