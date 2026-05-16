import { useEffect, useState } from "react";
import { api } from "../../../api/lib/api";
import { GenericPanelLayout } from "../../../components/Layout/company/layoutOption";
import {
  LuSearch,
  LuTrash2,
  LuPencil,
  LuPlus,
  LuX,
  LuMail,
  LuPhone,
  LuMapPin,
  LuUser,
  LuBriefcase,
  LuHash,
} from "react-icons/lu";
import { useToast } from "../../../components/Toast/ToastContent";

// ─── Types ────────────────────────────────────────────────────────────────────

type Role = {
  id: number;
  name: string;
};

type Address = {
  street?: string;
  state?: string;
  country?: string;
  city?: string;
  zip_code?: string;
  number?: number;
  complement?: string;
};

type Employee = {
  id: number;
  name: string;
  enrollment: string;
  email?: string;
  phone_number?: string;
  role?: Role;
  addres?: Address;
};

const EMPTY_NEW = {
  name: "",
  role: "",
  email: "",
  phone_number: "",
  password: "",
  country: "",
  state: "",
  city: "",
  street: "",
  number: "",
  zip_code: "",
  complement: "",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function maskPhone(v: string) {
  return v
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d{1,4})$/, "$1-$2");
}

function maskZip(v: string) {
  return v
    .replace(/\D/g, "")
    .slice(0, 8)
    .replace(/(\d{5})(\d{1,3})$/, "$1-$2");
}

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

// ─── Field ────────────────────────────────────────────────────────────────────

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

// ─── Modal ────────────────────────────────────────────────────────────────────

type EditModalProps = {
  employee: Employee;
  roles: Role[];
  onChange: (updated: Employee) => void;
  onConfirm: () => void;
  onClose: () => void;
  loading: boolean;
};

function EditModal({ employee, roles, onChange, onConfirm, onClose, loading }: EditModalProps) {
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
              <Field
                label="Nome"
                icon={LuUser}
                className="col-span-2"
                placeholder="Nome completo"
                value={employee.name}
                onChange={(e) => onChange({ ...employee, name: e.target.value })}
              />
              <Field
                label="E-mail"
                icon={LuMail}
                type="email"
                placeholder="funcionario@empresa.com"
                value={employee.email ?? ""}
                onChange={(e) => onChange({ ...employee, email: e.target.value })}
              />
              <Field
                label="Telefone"
                icon={LuPhone}
                placeholder="(00) 00000-0000"
                value={maskPhone(employee.phone_number ?? "")}
                onChange={(e) => onChange({ ...employee, phone_number: maskPhone(e.target.value) })}
              />
              <SelectField
                label="Cargo"
                icon={LuBriefcase}
                className="col-span-2"
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
              <Field
                label="Rua"
                className="col-span-4"
                placeholder="Nome da rua"
                value={employee.addres?.street ?? ""}
                onChange={(e) => onChange({ ...employee, addres: { ...employee.addres, street: e.target.value } })}
              />
              <Field
                label="Número"
                className="col-span-2"
                type="number"
                placeholder="0"
                value={employee.addres?.number ?? ""}
                onChange={(e) => onChange({ ...employee, addres: { ...employee.addres, number: Number(e.target.value) } })}
              />
              <Field
                label="Complemento"
                className="col-span-3"
                placeholder="Apto, sala..."
                value={employee.addres?.complement ?? ""}
                onChange={(e) => onChange({ ...employee, addres: { ...employee.addres, complement: e.target.value } })}
              />
              <Field
                label="CEP"
                className="col-span-3"
                placeholder="00000-000"
                value={maskZip(employee.addres?.zip_code ?? "")}
                onChange={(e) => onChange({ ...employee, addres: { ...employee.addres, zip_code: maskZip(e.target.value) } })}
              />
              <Field
                label="Cidade"
                className="col-span-2"
                placeholder="Cidade"
                value={employee.addres?.city ?? ""}
                onChange={(e) => onChange({ ...employee, addres: { ...employee.addres, city: e.target.value } })}
              />
              <Field
                label="Estado"
                className="col-span-2"
                placeholder="UF"
                value={employee.addres?.state ?? ""}
                onChange={(e) => onChange({ ...employee, addres: { ...employee.addres, state: e.target.value } })}
              />
              <Field
                label="País"
                className="col-span-2"
                placeholder="Brasil"
                value={employee.addres?.country ?? ""}
                onChange={(e) => onChange({ ...employee, addres: { ...employee.addres, country: e.target.value } })}
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

type CreateModalProps = {
  data: typeof EMPTY_NEW;
  roles: Role[];
  onChange: (updated: typeof EMPTY_NEW) => void;
  onConfirm: () => void;
  onClose: () => void;
  loading: boolean;
};

function CreateModal({ data, roles, onChange, onConfirm, onClose, loading }: CreateModalProps) {
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
                value={data.password}
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

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function EmployeeManager() {
  const { toast } = useToast();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filtered, setFiltered] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [roles, setRoles] = useState<Role[]>([]);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [creating, setCreating] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ ...EMPTY_NEW });
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string } | null>(null);

  useEffect(() => {
    api.get("/employee")
      .then((r) => { setEmployees(r.data); setFiltered(r.data); })
      .catch((err) => toast("Erro ao ao carregar funcionário.", "error"))
      .finally(() => setLoading(false));

    api.get("/roules")
  .then((r) => {
    setRoles(r.data);
  })
  .catch((err) => toast("Erro ao carregar cargos.", "error"));  
  }, []);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setFiltered(
      employees.filter(
        (e) =>
          e.name.toLowerCase().includes(value.toLowerCase()) ||
          e.enrollment.includes(value)
      )
    );
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/employee/${deleteTarget.id}`);
      const next = employees.filter((e) => e.id !== deleteTarget.id);
      setEmployees(next);
      setFiltered(next.filter((e) => e.name.toLowerCase().includes(searchTerm.toLowerCase())));
    } catch {
      alert("Erro ao excluir funcionário.");
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleSave = async () => {
    if (!editing) return;
    try {
      setSaving(true);
      await api.put(`/employee/${editing.id}`, {
        name: editing.name,
        email: editing.email,
        phone_number: editing.phone_number?.replace(/\D/g, ""),
        employee_roles: editing.role?.id,
        addressData: {
          country: editing.addres?.country || "",
          state: editing.addres?.state || "",
          city: editing.addres?.city || "",
          street: editing.addres?.street || "",
          number: editing.addres?.number || 0,
          zipcode: editing.addres?.zip_code?.replace(/\D/g, "") || "",
          complement: editing.addres?.complement || "",
        },
      });
      const next = employees.map((e) => (e.id === editing.id ? { ...editing } : e));
      setEmployees(next);
      setFiltered(next);
      setEditing(null);
    } catch (err: any) {
      toast("Erro ao atualizar funcionário", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleCreate = async () => {
    try {
      setSaving(true);
      await api.post("/employee", {
        name: newEmployee.name,
        email: newEmployee.email,
        phone_number: newEmployee.phone_number.replace(/\D/g, ""),
        password: newEmployee.password,
        employee_roles: Number(newEmployee.role),
        addressData: {
          street: newEmployee.street || "",
          number: newEmployee.number === "" || isNaN(Number(newEmployee.number)) ? 0 : Number(newEmployee.number),
          complement: newEmployee.complement || "",
          city: newEmployee.city || "",
          state: newEmployee.state || "",
          country: newEmployee.country || "",
          zipcode: newEmployee.zip_code.replace(/\D/g, "") || "",
        },
      });
      const list = await api.get("/employee");
      setEmployees(list.data);
      setFiltered(list.data);
      setCreating(false);
      setNewEmployee({ ...EMPTY_NEW });
    } catch (err: any) {
      toast("Erro ao cadastrar funcionário. Verifique os dados.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <GenericPanelLayout panel="funcionario">
      <div className="w-full max-w-5xl mx-auto space-y-6">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#384A6C] tracking-tight">Funcionários</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {filtered.length} funcionário{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm">
              <LuSearch size={15} className="text-gray-400 shrink-0" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Buscar por nome ou matrícula..."
                className="outline-none text-sm text-gray-700 placeholder-gray-300 w-52"
              />
            </div>

            <button
              onClick={() => setCreating(true)}
              className="flex items-center gap-2 bg-[#384A6C] text-white px-4 py-2.5 rounded-xl text-sm font-bold
                hover:bg-[#2f3e5c] active:scale-95 transition-all shadow-sm"
            >
              <LuPlus size={16} />
              Novo funcionário
            </button>
          </div>
        </div>

        {/* ── Lista ── */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <svg className="animate-spin h-6 w-6 text-[#94C0E0]" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <p className="text-sm text-gray-400">Carregando funcionários...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-2 text-gray-400">
              <LuUser size={32} className="opacity-30" />
              <p className="text-sm font-medium">Nenhum funcionário encontrado.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-50">
              {filtered.map((emp) => (
                <li
                  key={emp.id}
                  className="flex items-center justify-between px-6 py-4 hover:bg-[#EEF5FB]/60 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#384A6C]/10 flex items-center justify-center text-[#384A6C] text-sm font-bold shrink-0">
                      {getInitials(emp.name)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{emp.name}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5 flex-wrap">
                        <span className="flex items-center gap-1">
                          <LuHash size={11} />
                          {String(emp.enrollment).padStart(3, "0")}
                        </span>
                        {emp.email && (
                          <span className="flex items-center gap-1">
                            <LuMail size={11} /> {emp.email}
                          </span>
                        )}
                        {emp.phone_number && (
                          <span className="flex items-center gap-1">
                            <LuPhone size={11} /> {maskPhone(emp.phone_number)}
                          </span>
                        )}
                        {emp.role && (
                          <span className="inline-flex items-center gap-1 bg-[#384A6C]/10 text-[#384A6C] px-2 py-0.5 rounded-full font-semibold">
                            <LuBriefcase size={10} /> {emp.role.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-4">
                    <button
                      onClick={() => setEditing(emp)}
                      className="p-2 rounded-xl text-[#384A6C] hover:bg-[#384A6C]/10 transition"
                      title="Editar"
                    >
                      <LuPencil size={16} />
                    </button>
                    <button
                      onClick={() => setDeleteTarget({ id: emp.id, name: emp.name })}
                      className="p-2 rounded-xl text-red-400 hover:bg-red-50 transition"
                      title="Excluir"
                    >
                      <LuTrash2 size={16} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* ── Modal Edição ── */}
      {editing && (
        <EditModal
          employee={editing}
          roles={roles}
          onChange={setEditing}
          onConfirm={handleSave}
          onClose={() => setEditing(null)}
          loading={saving}
        />
      )}

      {/* ── Modal Criação ── */}
      {creating && (
        <CreateModal
          data={newEmployee}
          roles={roles}
          onChange={setNewEmployee}
          onConfirm={handleCreate}
          onClose={() => { setCreating(false); setNewEmployee({ ...EMPTY_NEW }); }}
          loading={saving}
        />
      )}

      {/* ── Modal Confirmação de Exclusão ── */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 flex flex-col items-center text-center gap-4">
            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
              <LuTrash2 size={24} className="text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-gray-800">Excluir funcionário?</h3>
              <p className="text-sm text-gray-400 mt-1">
                <span className="font-semibold text-gray-600">{deleteTarget.name}</span> será removido permanentemente.
              </p>
            </div>
            <div className="flex gap-3 w-full mt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 active:scale-95 transition-all"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </GenericPanelLayout>
  );
}