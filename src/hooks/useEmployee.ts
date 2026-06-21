import { useState, useEffect } from "react";
import { api } from "../api/lib/api";
import { useToast } from "../components/Toast/ToastContent";
import type { Employee, Role, EmployeeForm } from "../types/employee";

export function useEmployees() {
  const { toast } = useToast();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filtered, setFiltered] = useState<Employee[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const [empRes, rolesRes] = await Promise.all([
        api.get("/employee"),
        api.get("/roules").catch(() => ({ data: [] })),
      ]);

      const employeeList = Array.isArray(empRes.data) ? empRes.data : empRes.data.data ?? [];
      const rolesList = Array.isArray(rolesRes.data) ? rolesRes.data : rolesRes.data.data ?? [];

      setEmployees(employeeList);
      setFiltered(employeeList);
      setRoles(rolesList);
    } catch (err: any) {
      toast("Erro ao carregar dados dos funcionários.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSearch = (value: string) => {
    setSearch(value);
    const lower = value.toLowerCase();
    setFiltered(
      employees.filter(
        (e) =>
          e.name.toLowerCase().includes(lower) ||
          e.enrollment.includes(value)
      )
    );
  };

  const createEmployee = async (form: EmployeeForm) => {
    setSaving(true);
    try {
      await api.post("/employee", {
        name: form.name,
        email: form.email,
        phone_number: form.phone_number.replace(/\D/g, ""),
        password: form.password,
        employee_roles: Number(form.role),
        addressData: {
          street: form.street || "",
          number: form.number === "" || isNaN(Number(form.number)) ? 0 : Number(form.number),
          complement: form.complement || "",
          city: form.city || "",
          state: form.state || "",
          country: form.country || "",
          zipcode: form.zip_code.replace(/\D/g, "") || "",
        },
      });
      // Refresh list
      const listRes = await api.get("/employee");
      const employeeList = Array.isArray(listRes.data) ? listRes.data : listRes.data.data ?? [];
      setEmployees(employeeList);
      setFiltered(employeeList);
      toast("Funcionário cadastrado com sucesso!", "success");
    } catch (err: any) {
      toast("Erro ao cadastrar funcionário.", "error");
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const updateEmployee = async (id: number, emp: Employee) => {
    setSaving(true);
    try {
      await api.put(`/employee/${id}`, {
        name: emp.name,
        email: emp.email,
        phone_number: emp.phone_number?.replace(/\D/g, ""),
        employee_roles: emp.role?.id,
        addressData: {
          country: emp.addres?.country || "",
          state: emp.addres?.state || "",
          city: emp.addres?.city || "",
          street: emp.addres?.street || "",
          number: emp.addres?.number || 0,
          zipcode: emp.addres?.zip_code?.replace(/\D/g, "") || "",
          complement: emp.addres?.complement || "",
        },
      });

      const next = employees.map((e) => (e.id === id ? { ...emp } : e));
      setEmployees(next);
      setFiltered(next);
      toast("Funcionário atualizado com sucesso!", "success");
    } catch (err: any) {
      toast("Erro ao atualizar funcionário.", "error");
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const deleteEmployee = async (id: number) => {
    try {
      await api.delete(`/employee/${id}`);
      const next = employees.filter((e) => e.id !== id);
      setEmployees(next);
      setFiltered(next.filter((e) => e.name.toLowerCase().includes(search.toLowerCase())));
      toast("Funcionário excluído com sucesso!", "success");
    } catch (err: any) {
      toast("Erro ao excluir funcionário.", "error");
    }
  };

  return {
    employees: filtered,
    roles,
    loading,
    saving,
    search,
    handleSearch,
    createEmployee,
    updateEmployee,
    deleteEmployee,
  };
}
