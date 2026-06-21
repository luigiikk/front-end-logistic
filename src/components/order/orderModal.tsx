import React from "react";
import {
  LuX,
  LuTruck,
  LuPackage,
  LuUser,
  LuMapPin,
  LuBox,
  LuPlus,
  LuTrash2,
  LuRuler,
} from "react-icons/lu";
import type { OrderForm, Vehicle, Product } from "../../types/order";
import { maskCPF, maskZip, calcProductsVolume } from "../../util/orderHelpers";
import { EMPTY_PRODUCT } from "../../types/order";

type OrderModalProps = {
  form: OrderForm;
  vehicles: Vehicle[];
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
      <label className="text-[10px] font-bold text-[#384A6C] uppercase tracking-widest">
        {label}
      </label>
      <input
        {...props}
        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-300 bg-white
          focus:outline-none focus:ring-2 focus:ring-[#94C0E0] focus:border-transparent transition-all"
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
      <label className="text-[10px] font-bold text-[#384A6C] uppercase tracking-widest">
        {label}
      </label>
      <select
        {...props}
        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-800 bg-white appearance-none
          focus:outline-none focus:ring-2 focus:ring-[#94C0E0] focus:border-transparent transition-all"
      >
        {children}
      </select>
    </div>
  );
}

function SectionTitle({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="w-7 h-7 rounded-lg bg-[#384A6C]/10 flex items-center justify-center text-[#384A6C]">
        <Icon size={14} />
      </div>
      <p className="text-xs font-bold text-[#384A6C] uppercase tracking-widest">{label}</p>
    </div>
  );
}

export function OrderModal({
  form,
  vehicles,
  onChange,
  onConfirm,
  onClose,
  loading,
}: OrderModalProps) {
  const currentProductsVolume = calcProductsVolume(form.products);
  const selectedVehicle = vehicles.find((v) => v.id === Number(form.vehicle_id));

  const updateRecipient = (field: keyof OrderForm["recipient"], value: string) => {
    onChange({
      ...form,
      recipient: {
        ...form.recipient,
        [field]: value,
      },
    });
  };

  const updateAddress = (field: keyof OrderForm["recipient"]["address"], value: string) => {
    onChange({
      ...form,
      recipient: {
        ...form.recipient,
        address: {
          ...form.recipient.address,
          [field]: value,
        },
      },
    });
  };

  const handleAddProduct = () => {
    onChange({
      ...form,
      products: [...form.products, { ...EMPTY_PRODUCT }],
    });
  };

  const handleRemoveProduct = (index: number) => {
    onChange({
      ...form,
      products: form.products.filter((_, i) => i !== index),
    });
  };

  const updateProduct = (index: number, field: keyof Product, value: any) => {
    const updated = [...form.products];
    (updated[index] as any)[field] = value;
    onChange({
      ...form,
      products: updated,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-7 pb-4 border-b border-gray-100">
          <h2 className="text-xl font-extrabold text-[#384A6C] tracking-tight">
            Novo Pedido
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition p-1 rounded-lg hover:bg-gray-100"
          >
            <LuX size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-8 py-6 overflow-y-auto space-y-8">
          {/* Veículo — opcional */}
          <div>
            <SectionTitle
              icon={LuTruck}
              label="Veículo responsável (opcional)"
            />
            <SelectField
              label="Veículo"
              value={form.vehicle_id}
              onChange={(e) =>
                onChange({
                  ...form,
                  vehicle_id: e.target.value ? Number(e.target.value) : "",
                })
              }
            >
              <option value="">Sem veículo — alocar depois</option>
              {vehicles.map((v) => (
                <option
                  key={v.id}
                  value={v.id}
                  disabled={v.available_volume <= 0}
                >
                  {v.plate} — {v.model} • {v.available_volume.toFixed(2)} m³
                  disponível
                  {v.available_volume <= 0 ? " (cheio)" : ""}
                </option>
              ))}
            </SelectField>

            {/* Feedback de volume em tempo real */}
            {selectedVehicle && (
              <div
                className={`mt-2 flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl border ${
                  currentProductsVolume > selectedVehicle.available_volume
                    ? "bg-red-50 text-red-600 border-red-200"
                    : "bg-green-50 text-green-700 border-green-200"
                }`}
              >
                <LuPackage size={13} />
                Volume dos produtos: {currentProductsVolume.toFixed(2)} m³ •
                Disponível no veículo:{" "}
                {selectedVehicle.available_volume.toFixed(2)} m³
                {currentProductsVolume > selectedVehicle.available_volume &&
                  " — ⚠ excede capacidade!"}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Destinatário */}
            <div className="bg-[#EEF5FB] rounded-2xl p-5 border border-[#94C0E0]/30">
              <SectionTitle icon={LuUser} label="Destinatário" />
              <div className="space-y-3">
                <Field
                  label="Nome completo *"
                  placeholder="Nome do destinatário"
                  value={form.recipient.name}
                  onChange={(e) => updateRecipient("name", e.target.value)}
                />
                <Field
                  label="CPF *"
                  placeholder="000.000.000-00"
                  value={maskCPF(form.recipient.cpf)}
                  onChange={(e) =>
                    updateRecipient("cpf", maskCPF(e.target.value))
                  }
                />
                <Field
                  label="E-mail"
                  type="email"
                  placeholder="destinatario@email.com"
                  value={form.recipient.email}
                  onChange={(e) => updateRecipient("email", e.target.value)}
                />
              </div>
            </div>

            {/* Endereço */}
            <div className="bg-[#EEF5FB] rounded-2xl p-5 border border-[#94C0E0]/30">
              <SectionTitle icon={LuMapPin} label="Endereço de entrega" />
              <div className="grid grid-cols-6 gap-3">
                <Field
                  label="Rua"
                  className="col-span-4"
                  placeholder="Nome da rua"
                  value={form.recipient.address.street}
                  onChange={(e) => updateAddress("street", e.target.value)}
                />
                <Field
                  label="Número"
                  className="col-span-2"
                  type="number"
                  placeholder="0"
                  value={form.recipient.address.number}
                  onChange={(e) => updateAddress("number", e.target.value)}
                />
                <Field
                  label="CEP"
                  className="col-span-3"
                  placeholder="00000-000"
                  value={maskZip(form.recipient.address.zipcode)}
                  onChange={(e) =>
                    updateAddress("zipcode", maskZip(e.target.value))
                  }
                />
                <Field
                  label="Cidade"
                  className="col-span-2"
                  placeholder="Cidade"
                  value={form.recipient.address.city}
                  onChange={(e) => updateAddress("city", e.target.value)}
                />
                <Field
                  label="UF"
                  className="col-span-1"
                  placeholder="SP"
                  maxLength={2}
                  value={form.recipient.address.state}
                  onChange={(e) =>
                    updateAddress("state", e.target.value.toUpperCase())
                  }
                />
                <Field
                  label="Complemento"
                  className="col-span-6"
                  placeholder="Apto, bloco..."
                  value={form.recipient.address.complement}
                  onChange={(e) =>
                    updateAddress("complement", e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          {/* Produtos */}
          <div>
            <SectionTitle icon={LuBox} label="Itens do pedido" />
            <div className="space-y-3">
              {form.products.map((p, index) => (
                <div
                  key={index}
                  className="bg-[#EEF5FB] border border-[#94C0E0]/30 rounded-2xl p-4 space-y-3"
                >
                  {/* Linha 1: nome, descrição, qtd */}
                  <div className="flex gap-3 items-end">
                    <Field
                      label="Produto"
                      className="flex-1"
                      placeholder="Nome do item"
                      value={p.name}
                      onChange={(e) =>
                        updateProduct(index, "name", e.target.value)
                      }
                    />
                    <Field
                      label="Descrição"
                      className="flex-1"
                      placeholder="Breve descrição"
                      value={p.description}
                      onChange={(e) =>
                        updateProduct(index, "description", e.target.value)
                      }
                    />
                    <Field
                      label="Qtd"
                      className="w-20"
                      type="number"
                      min={1}
                      value={p.quantity}
                      onChange={(e) =>
                        updateProduct(
                          index,
                          "quantity",
                          Number(e.target.value),
                        )
                      }
                    />
                    {index > 0 && (
                      <button
                        onClick={() => handleRemoveProduct(index)}
                        className="p-2 rounded-xl text-red-400 hover:bg-red-50 transition shrink-0 mb-0.5"
                      >
                        <LuTrash2 size={16} />
                      </button>
                    )}
                  </div>

                  {/* Linha 2: dimensões */}
                  <div className="flex gap-3 items-end">
                    <div className="flex items-center gap-1 text-[10px] font-bold text-[#384A6C] uppercase tracking-widest shrink-0 pb-2.5">
                      <LuRuler size={12} /> Dimensões (m)
                    </div>
                    <Field
                      label="Altura"
                      className="flex-1"
                      type="number"
                      min={0}
                      step={0.01}
                      placeholder="0.00"
                      value={p.height || ""}
                      onChange={(e) =>
                        updateProduct(
                          index,
                          "height",
                          Number(e.target.value),
                        )
                      }
                    />
                    <Field
                      label="Largura"
                      className="flex-1"
                      type="number"
                      min={0}
                      step={0.01}
                      placeholder="0.00"
                      value={p.width || ""}
                      onChange={(e) =>
                        updateProduct(
                          index,
                          "width",
                          Number(e.target.value),
                        )
                      }
                    />
                    <Field
                      label="Profund."
                      className="flex-1"
                      type="number"
                      min={0}
                      step={0.01}
                      placeholder="0.00"
                      value={p.length || ""}
                      onChange={(e) =>
                        updateProduct(
                          index,
                          "length",
                          Number(e.target.value),
                        )
                      }
                    />
                    {/* Volume calculado do item */}
                    <div className="flex flex-col gap-1 shrink-0">
                      <span className="text-[10px] font-bold text-[#384A6C] uppercase tracking-widest">
                        Volume
                      </span>
                      <span className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-500 w-24 text-center">
                        {(
                          p.height *
                          p.width *
                          p.length *
                          p.quantity
                        ).toFixed(2)}{" "}
                        m³
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Total geral */}
            {form.products.length > 1 && (
              <div className="mt-2 flex items-center justify-end gap-2 text-xs text-[#384A6C] font-bold">
                <LuPackage size={13} />
                Volume total dos itens: {currentProductsVolume.toFixed(2)} m³
              </div>
            )}

            <button
              onClick={handleAddProduct}
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
            className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-[#384A6C] hover:bg-[#2f3e5c] active:scale-95 transition-all disabled:opacity-60"
          >
            {loading ? "Criando..." : "Confirmar pedido"}
          </button>
        </div>
      </div>
    </div>
  );
}
