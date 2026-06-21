import { LuX, LuUser, LuMail, LuPhone, LuMapPin, LuBriefcase } from "react-icons/lu";
import type { Employee, Role } from "../../types/employee";
import { InputField } from "../ui/Input/inputField";
import { SelectField } from "../ui/selectField";

type EditModalProps = {
  employee: Employee;
  roles: Role[];
  onChange: (updated: Employee) => void;
  onConfirm: () => void;
  onClose: () => void;
  loading: boolean;
};

export function EditEmployeeModal({
  employee,
  roles,
  onChange,
  onConfirm,
  onClose,
  loading,
}: EditModalProps) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between px-8 pt-7 pb-4 border-b border-gray-100">
          <h2 className="text-xl font-extrabold text-[#384A6C] tracking-tight">Editar Funcionário</h2>
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
                value={employee.name}
                onChange={(e) => onChange({ ...employee, name: e.target.value })}
              />
              <InputField
                label="E-mail"
                icon={LuMail}
                type="email"
                placeholder="funcionario@empresa.com"
                value={employee.email ?? ""}
                onChange={(e) => onChange({ ...employee, email: e.target.value })}
              />
              <InputField
                label="Telefone"
                icon={LuPhone}
                maskType="phone"
                placeholder="(00) 00000-0000"
                value={employee.phone_number ?? ""}
                onChange={(e) => onChange({ ...employee, phone_number: e.target.value })}
              />
              <SelectField
                label="Cargo"
                icon={LuBriefcase}
                containerClassName="col-span-2"
                value={employee.role?.id?.toString() ?? ""}
                onChange={(e) => {
                  const selected = roles.find((r) => r.id === Number(e.target.value));
                  onChange({ ...employee, role: selected });
                }}
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
                value={employee.addres?.street ?? ""}
                onChange={(e) => onChange({ ...employee, addres: { ...(employee.addres || {}), street: e.target.value } as any })}
              />
              <InputField
                label="Número"
                containerClassName="col-span-2"
                type="number"
                placeholder="0"
                value={employee.addres?.number ?? ""}
                onChange={(e) => onChange({ ...employee, addres: { ...(employee.addres || {}), number: Number(e.target.value) } as any })}
              />
              <InputField
                label="Complemento"
                containerClassName="col-span-3"
                placeholder="Apto, sala..."
                value={employee.addres?.complement ?? ""}
                onChange={(e) => onChange({ ...employee, addres: { ...(employee.addres || {}), complement: e.target.value } as any })}
              />
              <InputField
                label="CEP"
                containerClassName="col-span-3"
                maskType="cep"
                placeholder="00000-000"
                value={employee.addres?.zip_code ?? ""}
                onChange={(e) => onChange({ ...employee, addres: { ...(employee.addres || {}), zip_code: e.target.value } as any })}
              />
              <InputField
                label="Cidade"
                containerClassName="col-span-2"
                placeholder="Cidade"
                value={employee.addres?.city ?? ""}
                onChange={(e) => onChange({ ...employee, addres: { ...(employee.addres || {}), city: e.target.value } as any })}
              />
              <InputField
                label="Estado"
                containerClassName="col-span-2"
                placeholder="UF"
                value={employee.addres?.state ?? ""}
                onChange={(e) => onChange({ ...employee, addres: { ...(employee.addres || {}), state: e.target.value } as any })}
              />
              <InputField
                label="País"
                containerClassName="col-span-2"
                placeholder="Brasil"
                value={employee.addres?.country ?? ""}
                onChange={(e) => onChange({ ...employee, addres: { ...(employee.addres || {}), country: e.target.value } as any })}
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
            {loading ? "Salvando..." : "Salvar alterações"}
          </button>
        </div>
      </div>
    </div>
  );
}
