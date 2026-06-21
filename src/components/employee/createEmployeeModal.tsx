import React from "react";
import { LuX, LuUser, LuMail, LuPhone, LuMapPin, LuBriefcase } from "react-icons/lu";
import type { EmployeeForm, Role } from "../../types/employee";
import { maskPhone, maskZip } from "../../util/employeeHelpers";

type CreateModalProps = {
  data: EmployeeForm;
  roles: Role[];
  onChange: (updated: EmployeeForm) => void;
  onConfirm: () => void;
  onClose: () => void;
  loading: boolean;
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

function SelectField({
  label,
  icon: Icon,
  className = "",
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
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
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94C0E0] pointer-events-none">
            <Icon size={14} />
          </span>
        )}
        <select
          {...props}
          className={`w-full ${Icon ? "pl-8" : "pl-3"} pr-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-800 bg-white appearance-none
            focus:outline-none focus:ring-2 focus:ring-[#94C0E0] focus:border-transparent transition-all`}
        >
          {children}
        </select>
      </div>
    </div>
  );
}

export function CreateEmployeeModal({
  data,
  roles,
  onChange,
  onConfirm,
  onClose,
  loading,
}: CreateModalProps) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between px-8 pt-7 pb-4 border-b border-gray-100">
          <h2 className="text-xl font-extrabold text-[#384A6C] tracking-tight">Novo Funcionário</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition p-1 rounded-lg hover:bg-gray-100">
            <LuX size={20} />
          </button>
        </div>

        <div className="px-8 py-6 space-y-6">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Dados pessoais</p>
            <div className="grid grid-cols-2 gap-3">
              <Field
                label="Nome"
                icon={LuUser}
                className="col-span-2"
                placeholder="Nome completo"
                value={data.name}
                onChange={(e) => onChange({ ...data, name: e.target.value })}
              />
              <Field
                label="E-mail"
                icon={LuMail}
                type="email"
                placeholder="funcionario@empresa.com"
                value={data.email}
                onChange={(e) => onChange({ ...data, email: e.target.value })}
              />
              <Field
                label="Telefone"
                icon={LuPhone}
                placeholder="(00) 00000-0000"
                value={maskPhone(data.phone_number)}
                onChange={(e) => onChange({ ...data, phone_number: maskPhone(e.target.value) })}
              />
              <Field
                label="Senha"
                type="password"
                placeholder="••••••••"
                value={data.password || ""}
                onChange={(e) => onChange({ ...data, password: e.target.value })}
              />
              <SelectField
                label="Cargo"
                icon={LuBriefcase}
                value={data.role}
                onChange={(e) => onChange({ ...data, role: e.target.value })}
              >
                <option value="">Selecione o cargo</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </SelectField>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <LuMapPin size={12} /> Endereço
            </p>
            <div className="grid grid-cols-6 gap-3">
              <Field
                label="Rua"
                className="col-span-4"
                placeholder="Nome da rua"
                value={data.street}
                onChange={(e) => onChange({ ...data, street: e.target.value })}
              />
              <Field
                label="Número"
                className="col-span-2"
                type="number"
                placeholder="0"
                value={data.number}
                onChange={(e) => onChange({ ...data, number: e.target.value })}
              />
              <Field
                label="Complemento"
                className="col-span-3"
                placeholder="Apto, sala..."
                value={data.complement}
                onChange={(e) => onChange({ ...data, complement: e.target.value })}
              />
              <Field
                label="CEP"
                className="col-span-3"
                placeholder="00000-000"
                value={maskZip(data.zip_code)}
                onChange={(e) => onChange({ ...data, zip_code: maskZip(e.target.value) })}
              />
              <Field
                label="Cidade"
                className="col-span-2"
                placeholder="Cidade"
                value={data.city}
                onChange={(e) => onChange({ ...data, city: e.target.value })}
              />
              <Field
                label="Estado"
                className="col-span-2"
                placeholder="UF"
                value={data.state}
                onChange={(e) => onChange({ ...data, state: e.target.value })}
              />
              <Field
                label="País"
                className="col-span-2"
                placeholder="Brasil"
                value={data.country}
                onChange={(e) => onChange({ ...data, country: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 px-8 py-5 border-t border-gray-100">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition">
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-[#384A6C] hover:bg-[#2f3e5c] active:scale-95 transition-all disabled:opacity-60"
          >
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>
        </div>
      </div>
    </div>
  );
}
