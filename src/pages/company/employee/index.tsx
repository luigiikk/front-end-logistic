import { useState } from "react";
import { GenericPanelLayout } from "../../../components/Layout/company/layoutOption";
import {
  LuSearch,
  LuTrash2,
  LuPencil,
  LuPlus,
  LuMail,
  LuPhone,
  LuUser,
  LuBriefcase,
  LuHash,
} from "react-icons/lu";
import { useEmployees } from "../../../hooks/useEmployee";
import { type Employee, type EmployeeForm, EMPTY_FORM } from "../../../types/employee";
import { maskPhone, getInitials } from "../../../util/employeeHelpers";
import { CreateEmployeeModal } from "../../../components/employee/createEmployeeModal";
import { EditEmployeeModal } from "../../../components/employee/editEmployeeModal";
import { DeleteEmployeeModal } from "../../../components/employee/deleteEmployeeModal";

export default function EmployeeManager() {
  const {
    employees,
    roles,
    loading,
    saving,
    search,
    handleSearch,
    createEmployee,
    updateEmployee,
    deleteEmployee,
  } = useEmployees();

  // Interface State
  const [editing, setEditing] = useState<Employee | null>(null);
  const [creating, setCreating] = useState(false);
  const [newEmployee, setNewEmployee] = useState<EmployeeForm>(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string } | null>(null);

  const handleSave = async () => {
    if (!editing) return;
    try {
      await updateEmployee(editing.id, editing);
      setEditing(null);
    } catch {
      // Errors are handled in hook
    }
  };

  const handleCreate = async () => {
    try {
      await createEmployee(newEmployee);
      setCreating(false);
      setNewEmployee(EMPTY_FORM);
    } catch {
      // Errors are handled in hook
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
              {employees.length} funcionário{employees.length !== 1 ? "s" : ""} encontrado{employees.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm">
              <LuSearch size={15} className="text-gray-400 shrink-0" />
              <input
                type="text"
                value={search}
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
          ) : employees.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-2 text-gray-400">
              <LuUser size={32} className="opacity-30" />
              <p className="text-sm font-medium">Nenhum funcionário encontrado.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-50">
              {employees.map((emp) => (
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

      {/* Modais */}
      {editing && (
        <EditEmployeeModal
          employee={editing}
          roles={roles}
          onChange={setEditing}
          onConfirm={handleSave}
          onClose={() => setEditing(null)}
          loading={saving}
        />
      )}

      {creating && (
        <CreateEmployeeModal
          data={newEmployee}
          roles={roles}
          onChange={setNewEmployee}
          onConfirm={handleCreate}
          onClose={() => { setCreating(false); setNewEmployee(EMPTY_FORM); }}
          loading={saving}
        />
      )}

      {deleteTarget && (
        <DeleteEmployeeModal
          name={deleteTarget.name}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={async () => {
            await deleteEmployee(deleteTarget.id);
            setDeleteTarget(null);
          }}
        />
      )}
    </GenericPanelLayout>
  );
}