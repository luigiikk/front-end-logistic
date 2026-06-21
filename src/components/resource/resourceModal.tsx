import React from "react";
import { LuX, LuPackage, LuRuler } from "react-icons/lu";
import type { ResourceForm, Category } from "../../types/resource";

type ResourceModalProps = {
  title: string;
  form: ResourceForm;
  categories: Category[];
  onChange: (form: ResourceForm) => void;
  onConfirm: () => void;
  onClose: () => void;
  loading: boolean;
};

function Field({
  label,
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  className?: string;
}) {
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

export function ResourceModal({
  title,
  form,
  categories,
  onChange,
  onConfirm,
  onClose,
  loading,
}: ResourceModalProps) {
  const previewVolume = (() => {
    const w = Number(form.width);
    const h = Number(form.height);
    const d = Number(form.length);
    if (form.width === "" || form.height === "" || form.length === "") {
      return null;
    }
    return w * h * d;
  })();

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-7 pb-4 border-b border-gray-100">
          <h2 className="text-xl font-extrabold text-[#384A6C] tracking-tight flex items-center gap-2">
            <LuPackage size={18} />
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition p-1 rounded-lg hover:bg-gray-100"
          >
            <LuX size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="px-8 py-6 overflow-y-auto space-y-4">
          <Field
            label="Nome do Recurso *"
            placeholder="Ex: Cimento CP-II"
            value={form.name}
            onChange={(e) => onChange({ ...form, name: e.target.value })}
          />

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-[#384A6C] uppercase tracking-widest">Categoria *</label>
            <select
              value={form.category_id}
              onChange={(e) =>
                onChange({
                  ...form,
                  category_id: e.target.value === "" ? "" : Number(e.target.value),
                })
              }
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#94C0E0] focus:border-transparent transition-all"
            >
              <option value="">Selecione uma categoria...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-[#384A6C] uppercase tracking-widest">Descrição</label>
            <textarea
              rows={3}
              placeholder="Detalhes técnicos..."
              value={form.description}
              onChange={(e) => onChange({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#94C0E0] focus:border-transparent transition-all resize-none"
            />
          </div>

          <div>
            <p className="text-[10px] font-bold text-[#384A6C] uppercase tracking-widest flex items-center gap-1 mb-3">
              <LuRuler size={11} /> Dimensões (metros)
            </p>
            <div className="grid grid-cols-3 gap-3">
              <Field
                label="Largura"
                placeholder="0.00"
                type="number"
                step="0.01"
                min={0}
                value={form.width}
                onChange={(e) => onChange({ ...form, width: e.target.value })}
              />
              <Field
                label="Altura"
                placeholder="0.00"
                type="number"
                step="0.01"
                min={0}
                value={form.height}
                onChange={(e) => onChange({ ...form, height: e.target.value })}
              />
              <Field
                label="Comprimento"
                placeholder="0.00"
                type="number"
                step="0.01"
                min={0}
                value={form.length}
                onChange={(e) => onChange({ ...form, length: e.target.value })}
              />
            </div>

            {previewVolume != null && (
              <div className="mt-3 flex items-center justify-between bg-[#EEF5FB] border border-[#94C0E0]/30 rounded-xl px-4 py-2.5">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Volume unitário</span>
                <span className="text-sm font-extrabold text-[#384A6C]">{previewVolume.toFixed(2)} m³</span>
              </div>
            )}
          </div>

          <p className="text-xs text-gray-400">Estoque inicial geralmente 0. Use pedidos de compra para adicionar estoque.</p>
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
