import React from "react";
import { LuX, LuUser, LuMail, LuPhone, LuBuilding2, LuMapPin } from "react-icons/lu";
import type { Client, ClientForm } from "../../types/client";
import { maskPhone, maskCNPJ, maskZip } from "../../util/clientHelpers";

type ClientModalProps = {
  title: string;
  data: ClientForm | Client;
  onChange: (key: string, value: any) => void;
  onConfirm: () => void;
  onClose: () => void;
  confirmLabel: string;
  confirmClass: string;
  loading?: boolean;
};

function Field({
  label,
  icon: Icon,
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  icon?: React.ElementType;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label className="text-[10px] font-bold text-[#384A6C] uppercase tracking-widest">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94C0E0]">
            <Icon size={14} />
          </span>
        )}
        <input
          {...props}
          className={`w-full ${Icon ? "pl-8" : "pl-3"} pr-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-300 bg-white
            focus:outline-none focus:ring-2 focus:ring-[#94C0E0] focus:border-transparent transition-all`}
        />
      </div>
    </div>
  );
}

export function ClientModal({
  title,
  data,
  onChange,
  onConfirm,
  onClose,
  confirmLabel,
  confirmClass,
  loading,
}: ClientModalProps) {
  const d = data as any;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-7 pb-4 border-b border-gray-100">
          <h2 className="text-xl font-extrabold text-[#384A6C] tracking-tight">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition p-1 rounded-lg hover:bg-gray-100"
          >
            <LuX size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-8 py-6 space-y-6">
          {/* Dados principais */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
              Dados principais
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Field
                label="Nome"
                icon={LuUser}
                className="col-span-2"
                placeholder="Nome completo"
                value={d.name}
                onChange={(e) => onChange("name", e.target.value)}
              />
              <Field
                label="E-mail"
                icon={LuMail}
                type="email"
                placeholder="contato@empresa.com.br"
                value={d.email}
                onChange={(e) => onChange("email", e.target.value)}
              />
              <Field
                label="Telefone"
                icon={LuPhone}
                placeholder="(00) 00000-0000"
                value={maskPhone(String(d.phone_number ?? ""))}
                onChange={(e) =>
                  onChange("phone_number", maskPhone(e.target.value))
                }
              />
              <Field
                label="CNPJ"
                icon={LuBuilding2}
                placeholder="00.000.000/0001-00"
                value={maskCNPJ(String(d.CNPJ ?? ""))}
                onChange={(e) => onChange("CNPJ", maskCNPJ(e.target.value))}
              />
              <Field
                label="Senha"
                type="password"
                placeholder="••••••••"
                value={d.password ?? ""}
                onChange={(e) => onChange("password", e.target.value)}
              />
            </div>
          </div>

          {/* Endereço */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <LuMapPin size={12} /> Endereço
            </p>
            <div className="grid grid-cols-6 gap-3">
              <Field
                label="Rua"
                className="col-span-4"
                placeholder="Nome da rua"
                value={d.street ?? ""}
                onChange={(e) => onChange("street", e.target.value)}
              />
              <Field
                label="Número"
                className="col-span-2"
                type="number"
                placeholder="0"
                value={d.number ?? ""}
                onChange={(e) =>
                  onChange(
                    "number",
                    e.target.value === "" ? null : Number(e.target.value)
                  )
                }
              />
              <Field
                label="Complemento"
                className="col-span-3"
                placeholder="Apto, sala..."
                value={d.complement ?? ""}
                onChange={(e) => onChange("complement", e.target.value)}
              />
              <Field
                label="CEP"
                className="col-span-3"
                placeholder="00000-000"
                value={maskZip(String(d.zipcode ?? ""))}
                onChange={(e) => onChange("zipcode", maskZip(e.target.value))}
              />
              <Field
                label="Cidade"
                className="col-span-2"
                placeholder="Cidade"
                value={d.city ?? ""}
                onChange={(e) => onChange("city", e.target.value)}
              />
              <Field
                label="Estado"
                className="col-span-2"
                placeholder="UF"
                value={d.state ?? ""}
                onChange={(e) => onChange("state", e.target.value)}
              />
              <Field
                label="País"
                className="col-span-2"
                placeholder="Brasil"
                value={d.country ?? ""}
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
            className={`px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all active:scale-95 disabled:opacity-60 ${confirmClass}`}
          >
            {loading ? "Salvando..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
