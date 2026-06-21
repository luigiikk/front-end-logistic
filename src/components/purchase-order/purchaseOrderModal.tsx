import React from "react";
import { LuX, LuShoppingCart, LuPackage, LuPlus, LuBoxes, LuWarehouse } from "react-icons/lu";
import type { OrderForm, SelectOption, ResourceOption, FormItem } from "../../types/purchaseOrder";
import { calcItemVolume } from "../../util/purchaseOrderHelpers";
import { EMPTY_ITEM } from "../../types/purchaseOrder";

type PurchaseOrderModalProps = {
  title: string;
  form: OrderForm;
  suppliers: SelectOption[];
  statuses: SelectOption[];
  resources: ResourceOption[];
  warehouses: SelectOption[];
  onChange: (form: OrderForm) => void;
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

function SelectField({
  label,
  className = "",
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label className="text-[10px] font-bold text-[#384A6C] uppercase tracking-widest">{label}</label>
      <select
        {...props}
        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-800 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#94C0E0] focus:border-transparent transition-all"
      >
        {children}
      </select>
    </div>
  );
}

export function PurchaseOrderModal({
  title,
  form,
  suppliers,
  statuses,
  resources,
  warehouses,
  onChange,
  onConfirm,
  onClose,
  loading,
}: PurchaseOrderModalProps) {
  const handleAddItem = () => {
    onChange({
      ...form,
      items: [...form.items, { ...EMPTY_ITEM }],
    });
  };

  const handleRemoveItem = (index: number) => {
    if (form.items.length === 1) return;
    onChange({
      ...form,
      items: form.items.filter((_, i) => i !== index),
    });
  };

  const updateItem = (index: number, field: keyof FormItem, value: any) => {
    const items = [...form.items];
    (items[index] as any)[field] = value;
    onChange({
      ...form,
      items,
    });
  };

  const modalTotal = form.items.reduce((acc, i) => acc + Number(i.quantity || 0) * Number(i.unit_price || 0), 0);

  const modalTotalVolume = form.items.reduce((acc, item) => {
    const resource = resources.find((r) => r.id === Number(item.resource_id));
    const vol = calcItemVolume(resource, Number(item.quantity || 0));
    return acc + (vol ?? 0);
  }, 0);

  const hasAnyVolume = form.items.some((item) => {
    const resource = resources.find((r) => r.id === Number(item.resource_id));
    return calcItemVolume(resource, 1) != null;
  });

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-7 pb-4 border-b border-gray-100">
          <h2 className="text-xl font-extrabold text-[#384A6C] tracking-tight flex items-center gap-2">
            <LuShoppingCart size={20} /> {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition p-1 rounded-lg hover:bg-gray-100"
          >
            <LuX size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="px-8 py-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <SelectField
              label="Fornecedor *"
              value={form.supplier_id}
              onChange={(e) =>
                onChange({
                  ...form,
                  supplier_id: e.target.value === "" ? "" : Number(e.target.value),
                })
              }
            >
              <option value="">Selecione...</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </SelectField>
            <SelectField
              label="Status *"
              value={form.status_id}
              onChange={(e) =>
                onChange({
                  ...form,
                  status_id: e.target.value === "" ? "" : Number(e.target.value),
                })
              }
            >
              <option value="">Selecione...</option>
              {statuses.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </SelectField>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#384A6C]/10 flex items-center justify-center text-[#384A6C]">
                  <LuPackage size={14} />
                </div>
                <p className="text-xs font-bold text-[#384A6C] uppercase tracking-widest">Itens do pedido</p>
              </div>
              <div className="flex items-center gap-3">
                {hasAnyVolume && (
                  <span className="text-sm font-bold text-gray-500 bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-full flex items-center gap-1">
                    <LuBoxes size={13} /> {modalTotalVolume.toFixed(2)} m³
                  </span>
                )}
                <span className="text-sm font-extrabold text-[#384A6C] bg-[#EEF5FB] border border-[#94C0E0]/30 px-4 py-1.5 rounded-full">
                  Total: R$ {modalTotal.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {form.items.map((item, index) => {
                const selectedResource = resources.find((r) => r.id === Number(item.resource_id));
                const itemVolume = calcItemVolume(selectedResource, Number(item.quantity || 0));

                return (
                  <div key={index} className="bg-[#EEF5FB] border border-[#94C0E0]/30 rounded-2xl p-4 relative group">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                      <SelectField
                        label="Recurso / Produto *"
                        className="md:col-span-4"
                        value={item.resource_id}
                        onChange={(e) =>
                          updateItem(
                            index,
                            "resource_id",
                            e.target.value === "" ? "" : Number(e.target.value)
                          )
                        }
                      >
                        <option value="">Selecione...</option>
                        {resources.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.name}
                          </option>
                        ))}
                      </SelectField>

                      <SelectField
                        label="Armazém destino *"
                        className="md:col-span-4"
                        value={item.warehouse_id}
                        onChange={(e) =>
                          updateItem(
                            index,
                            "warehouse_id",
                            e.target.value === "" ? "" : Number(e.target.value)
                          )
                        }
                      >
                        <option value="">Selecione...</option>
                        {warehouses.map((w) => (
                          <option key={w.id} value={w.id}>
                            {w.name}
                          </option>
                        ))}
                      </SelectField>

                      <Field
                        label="Qtd *"
                        className="md:col-span-2"
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) => updateItem(index, "quantity", Number(e.target.value))}
                      />
                      <Field
                        label="Preço unit. (R$)"
                        className="md:col-span-2"
                        type="number"
                        min={0}
                        step="0.01"
                        value={item.unit_price}
                        onChange={(e) => updateItem(index, "unit_price", Number(e.target.value))}
                      />
                    </div>

                    {itemVolume != null && (
                      <div className="mt-2 flex items-center gap-2">
                        <LuWarehouse size={11} className="text-gray-400" />
                        <span className="text-[11px] text-gray-400">
                          Volume ocupado:{" "}
                          <span className="font-bold text-[#384A6C]">{itemVolume.toFixed(2)} m³</span>
                          {selectedResource && (
                            <span className="ml-1 text-gray-300">
                              ({selectedResource.width}×{selectedResource.height}×{selectedResource.length} m ×{" "}
                              {item.quantity} un)
                            </span>
                          )}
                        </span>
                      </div>
                    )}

                    {form.items.length > 1 && (
                      <button
                        onClick={() => handleRemoveItem(index)}
                        className="absolute -top-2 -right-2 bg-red-100 text-red-500 rounded-full p-1.5 hover:bg-red-200 shadow-sm opacity-0 group-hover:opacity-100 transition"
                        title="Remover item"
                      >
                        <LuX size={13} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              onClick={handleAddItem}
              className="mt-3 flex items-center gap-1.5 text-sm text-[#384A6C] font-bold hover:underline underline-offset-4"
            >
              <LuPlus size={15} /> Adicionar item
            </button>
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
            className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-[#384A6C] hover:bg-[#2f3e5c] active:scale-95 transition-all disabled:opacity-60 flex items-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                Salvando...
              </>
            ) : (
              "Confirmar pedido"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
