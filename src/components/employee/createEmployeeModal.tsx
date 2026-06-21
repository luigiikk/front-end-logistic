import { LuX, LuUser, LuMail, LuPhone, LuMapPin, LuBriefcase } from "react-icons/lu";
import type { EmployeeForm, Role } from "../../types/employee";
import { InputField } from "../ui/Input/inputField";
import { SelectField } from "../ui/selectField";

type CreateModalProps = {
  data: EmployeeForm;
  roles: Role[];
  onChange: (updated: EmployeeForm) => void;
  onConfirm: () => void;
  onClose: () => void;
  loading: boolean;
};

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
              <InputField
                label="Nome"
                icon={LuUser}
                containerClassName="col-span-2"
                placeholder="Nome completo"
                value={data.name}
                onChange={(e) => onChange({ ...data, name: e.target.value })}
              />
              <InputField
                label="E-mail"
                icon={LuMail}
                type="email"
                placeholder="funcionario@empresa.com"
                value={data.email}
                onChange={(e) => onChange({ ...data, email: e.target.value })}
              />
              <InputField
                label="Telefone"
                icon={LuPhone}
                maskType="phone"
                placeholder="(00) 00000-0000"
                value={data.phone_number}
                onChange={(e) => onChange({ ...data, phone_number: e.target.value })}
              />
              <InputField
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
              <InputField
                label="Rua"
                containerClassName="col-span-4"
                placeholder="Nome da rua"
                value={data.street}
                onChange={(e) => onChange({ ...data, street: e.target.value })}
              />
              <InputField
                label="Número"
                containerClassName="col-span-2"
                type="number"
                placeholder="0"
                value={data.number}
                onChange={(e) => onChange({ ...data, number: e.target.value })}
              />
              <InputField
                label="Complemento"
                containerClassName="col-span-3"
                placeholder="Apto, sala..."
                value={data.complement}
                onChange={(e) => onChange({ ...data, complement: e.target.value })}
              />
              <InputField
                label="CEP"
                containerClassName="col-span-3"
                maskType="cep"
                placeholder="00000-000"
                value={data.zip_code}
                onChange={(e) => onChange({ ...data, zip_code: e.target.value })}
              />
              <InputField
                label="Cidade"
                containerClassName="col-span-2"
                placeholder="Cidade"
                value={data.city}
                onChange={(e) => onChange({ ...data, city: e.target.value })}
              />
              <InputField
                label="Estado"
                containerClassName="col-span-2"
                placeholder="UF"
                value={data.state}
                onChange={(e) => onChange({ ...data, state: e.target.value })}
              />
              <InputField
                label="País"
                containerClassName="col-span-2"
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
