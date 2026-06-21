import React from "react";
import { LuX, LuTruck, LuInfo, LuMapPin } from "react-icons/lu";
import type { SupplierForm } from "../../types/supplier";
import { InputField, type MaskType } from "../ui/Input/inputField";

type SupplierModalProps = {
  title: string;
  form: SupplierForm;
  onChange: (field: keyof SupplierForm, value: string) => void;
  onConfirm: () => void;
  onClose: () => void;
  loading: boolean;
};

function Field({
  label,
  className = "",
  maskType,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  className?: string;
  maskType?: MaskType;
}) {
  return (
    <InputField
      label={label}
      maskType={maskType}
      containerClassName={className}
      {...(props as any)}
    />
  );
}

export function SupplierModal({
  title,
  form,
  onChange,
  onConfirm,
  onClose,
  loading,
}: SupplierModalProps) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-7 pb-4 border-b border-gray-100">
          <h2 className="text-xl font-extrabold text-[#384A6C] tracking-tight flex items-center gap-2">
            <LuTruck size={18} />
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition p-1 rounded-lg hover:bg-gray-100"
          >
            <LuX size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-8 py-6 overflow-y-auto space-y-6">
          {/* Seção Dados da Empresa */}
          <div>
            <p className="text-[10px] font-bold text-[#384A6C] uppercase tracking-widest flex items-center gap-1 mb-3">
              <LuInfo size={11} /> Dados da Empresa
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field
                label="Nome da Empresa *"
                className="md:col-span-1"
                placeholder="Ex: Distribuidora ABC"
                value={form.name}
                onChange={(e) => onChange("name", e.target.value)}
              />
              <Field
                label="CNPJ *"
                className="md:col-span-1"
                maskType="cnpj"
                placeholder="00.000.000/0001-00"
                value={form.CNPJ}
                onChange={(e) => onChange("CNPJ", e.target.value)}
              />
              <Field
                label="Email *"
                className="md:col-span-1"
                type="email"
                placeholder="contato@empresa.com"
                value={form.email}
                onChange={(e) => onChange("email", e.target.value)}
              />
              <Field
                label="Telefone"
                className="md:col-span-1"
                maskType="phone"
                placeholder="(00) 00000-0000"
                value={form.phone}
                onChange={(e) => onChange("phone", e.target.value)}
              />
              <Field
                label="Pessoa de Contato"
                className="md:col-span-1"
                placeholder="Nome do responsável"
                value={form.contactPerson}
                onChange={(e) => onChange("contactPerson", e.target.value)}
              />
              <Field
                label="Notas / Observações"
                className="md:col-span-3"
                placeholder="Informações adicionais..."
                value={form.notes}
                onChange={(e) => onChange("notes", e.target.value)}
              />
            </div>
          </div>

          {/* Seção Endereço */}
          <div>
            <p className="text-[10px] font-bold text-[#384A6C] uppercase tracking-widest flex items-center gap-1 mb-3">
              <LuMapPin size={11} /> Endereço
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Field
                label="CEP"
                className="md:col-span-1"
                maskType="cep"
                placeholder="00000-000"
                value={form.zipcode}
                onChange={(e) => onChange("zipcode", e.target.value)}
              />
              <Field
                label="Rua / Logradouro"
                className="md:col-span-2"
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
                label="Cidade"
                className="md:col-span-1"
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
