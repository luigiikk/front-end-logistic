import { useEffect, useState } from "react";
import { api } from "../../../api/lib/api";
import { EmployeeLayout } from "../../../components/Layout/company/employeeLayout";
import { LuSearch, LuTrash2, LuPencil, LuPlus } from "react-icons/lu";

type Employee = {
  id: number;
  name: string;
  enrollment: string;
  email?: string;
  phone_number?: string;
  role?: Role;
  addres?: Addres;
};

type Role = {
  id: number;
  name: string;
};

type Addres = {
  street: string;
  state: string;
  country: string;
  city: string;
  zip_code: string;
  number: number;
  complement: string;
};

export default function EmployeeManager() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filtered, setFiltered] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [roles, setRoles] = useState<Role[]>([]);
  const [addres, setAddres] = useState<Addres[]>([]);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [creating, setCreating] = useState(false);

  const [newEmployee, setNewEmployee] = useState({
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
    zipcode: "",
    complement: "",
  });

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.get("/employee");
        setEmployees(res.data);
        setFiltered(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    async function loadRoles() {
      try {
        const res = await api.get("/roules");
        setRoles(res.data);
      } catch (err) {
        console.error("Erro ao carregar roles", err);
      }
    }
    loadRoles();
  }, []);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setFiltered(
      employees.filter(
        (emp) =>
          emp.name.toLowerCase().includes(value.toLowerCase()) ||
          String(emp.id).includes(value)
      )
    );
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Deseja realmente excluir ${name}?`)) return;
    try {
      await api.delete(`/employee/${id}`);
      setEmployees(employees.filter((e) => e.id !== id));
      setFiltered(filtered.filter((e) => e.id !== id));
      alert("Funcionário excluído com sucesso!");
    } catch {
      alert("Erro ao deletar funcionário");
    }
  };

  const handleSave = async () => {
    if (!editing) return;
    try {
    const payload = {
    name: editing.name,
    email: editing.email,
    employee_roles: editing.role?.id,
    phone_number: editing.phone_number,
  addressData: {
    country: editing.addres?.country || "",
    state: editing.addres?.state || "",
    city: editing.addres?.city || "",
    street: editing.addres?.street || "",
    number: editing.addres?.number || 0,
    zipcode: editing.addres?.zip_code || "",
    complement: editing.addres?.complement || "",
  },
};
      console.log("Payload para update:", payload);
      await api.put(`/employee/${editing.id}`, payload);
      setEmployees(
        employees.map((c) => (c.id === editing.id ? { ...editing } : c))
      );
      setFiltered(
        filtered.map((c) => (c.id === editing.id ? { ...editing } : c))
      );

      alert("Employee atualizado com sucesso!");
      setEditing(null);
    } catch (error: any) {
      console.error(
        "Erro ao atualizar cliente:",
        error.response?.data || error
      );
      alert("Erro ao atualizar cliente. Verifique os dados.");
    }
  };

  const handleCreate = async () => {
    try {
      const payload = {
        name: newEmployee.name,
        email: newEmployee.email,
        phone_number: newEmployee.phone_number,
        password: newEmployee.password,
        employee_roles: Number(newEmployee.role),
        addressData: {
          country: newEmployee.country,
          state: newEmployee.state,
          city: newEmployee.city,
          street: newEmployee.street,
          number:
            newEmployee.number === "" || isNaN(Number(newEmployee.number))
              ? null
              : Number(newEmployee.number),
          zipcode: newEmployee.zipcode,
          complement: newEmployee.complement,
        },
      };
      await api.post("/employee", payload);
      const list = await api.get("/employee");
      setEmployees(list.data);
      setFiltered(list.data);
      setCreating(false);
      setNewEmployee({
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
        zipcode: "",
        complement: "",
      });
      alert("Funcionário cadastrado com sucesso!");
    } catch {
      alert("Erro ao cadastrar funcionário. Verifique os dados.");
    }
  };

  return (
    <EmployeeLayout backLink="/company">
      <div className="bg-white max-w-5xl w-full rounded-3xl shadow-xl p-10 min-h-[600px]">
        <h1 className="text-3xl text-center mb-8">Funcionários</h1>

        {/* Busca + botão cadastrar */}
        <div className="flex justify-between mb-6">
          <button
            onClick={() => setCreating(true)}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            <LuPlus /> Cadastrar Funcionário
          </button>

          <div className="flex items-center gap-2 border border-black rounded-lg px-4 py-2">
            <LuSearch />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Buscar por nome ou ID..."
              className="outline-none"
            />
          </div>
        </div>

        <div className="border-t border-black">
          {loading ? (
            <p className="text-center py-4 text-gray-500">Carregando...</p>
          ) : (
            filtered.map((emp) => (
              <div
                key={emp.id}
                className="flex justify-between border-b border-black py-4 items-center px-4 hover:bg-gray-50"
              >
                <div>
                  <p className="font-semibold text-lg">{emp.name}</p>
                  <p className="text-sm text-gray-600">
                    Registro: {String(emp.enrollment).padStart(3, "0")} —{" "}
                    {emp.email}
                  </p>
                  <p className="text-sm text-gray-500">{emp.role?.name}</p>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setEditing(emp)}
                    className="text-blue-600 text-2xl hover:text-blue-800"
                  >
                    <LuPencil />
                  </button>
                  <button
                    onClick={() => handleDelete(emp.id, emp.name)}
                    className="text-red-600 text-2xl hover:text-red-800"
                  >
                    <LuTrash2 />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* MODAL EDIÇÃO */}
{editing && (
  <div className="fixed top-0 left-0 w-full h-full bg-black/40 flex justify-center items-center z-[1000]">
    <div className="bg-white w-[450px] p-6 rounded-2xl shadow-xl max-h-[80vh] overflow-auto z-[1001]">
      <h2 className="text-2xl font-semibold mb-4">Editar Funcionário</h2>

      {/* Nome */}
      <div className="mb-3">
        <label className="block mb-1">Nome</label>
        <input
          value={editing.name}
          onChange={(e) =>
            setEditing({ ...editing, name: e.target.value })
          }
          className="w-full border p-2 rounded"
        />
      </div>

      {/* Email */}
      <div className="mb-3">
        <label className="block mb-1">Email</label>
        <input
          value={editing.email || ""}
          onChange={(e) =>
            setEditing({ ...editing, email: e.target.value })
          }
          className="w-full border p-2 rounded"
        />
      </div>

      {/* Telefone */}
      <div className="mb-3">
        <label className="block mb-1">Telefone</label>
        <input
          value={editing.phone_number || ""}
          onChange={(e) =>
            setEditing({ ...editing, phone_number: e.target.value })
          }
          className="w-full border p-2 rounded"
        />
      </div>

      {/* Cargo */}
      <div className="mb-3">
        <label className="block mb-1">Cargo</label>
        <select
          value={editing.role?.id.toString() ?? ""}
          onChange={(e) => {
            const selectedRole = roles.find(
              (r) => r.id === Number(e.target.value)
            );
            setEditing({
              ...editing,
              role: selectedRole,
            });
          }}
          className="w-full border p-2 rounded bg-white"
        >
          <option value="">Selecione o cargo</option>
          {roles.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
      </div>

      {/* Campos do Endereço
      <div className="mb-3">
        <label className="block mb-1">País</label>
        <input
          value={editing.addres?.country || ""}
          onChange={(e) =>
            setEditing({ ...editing, country: e.target.value })
          }
          className="w-full border p-2 rounded"
        />
      </div>

      <div className="mb-3">
        <label className="block mb-1">Estado</label>
        <input
          value={editing.state || ""}
          onChange={(e) =>
            setEditing({ ...editing, state: e.target.value })
          }
          className="w-full border p-2 rounded"
        />
      </div>

      <div className="mb-3">
        <label className="block mb-1">Cidade</label>
        <input
          value={editing.city || ""}
          onChange={(e) =>
            setEditing({ ...editing, city: e.target.value })
          }
          className="w-full border p-2 rounded"
        />
      </div>

      <div className="mb-3">
        <label className="block mb-1">Rua</label>
        <input
          value={editing.street || ""}
          onChange={(e) =>
            setEditing({ ...editing, street: e.target.value })
          }
          className="w-full border p-2 rounded"
        />
      </div>

      <div className="mb-3">
        <label className="block mb-1">Número</label>
        <input
          type="number"
          value={editing.number || 0}
          onChange={(e) =>
            setEditing({ ...editing, number: Number(e.target.value) })
          }
          className="w-full border p-2 rounded"
        />
      </div>

      <div className="mb-3">
        <label className="block mb-1">CEP</label>
        <input
          value={editing.zip_code || ""}
          onChange={(e) =>
            setEditing({ ...editing, zip_code: e.target.value })
          }
          className="w-full border p-2 rounded"
        />
      </div>

      <div className="mb-3">
        <label className="block mb-1">Complemento</label>
        <input
          value={editing.complement || ""}
          onChange={(e) =>
            setEditing({ ...editing, complement: e.target.value })
          }
          className="w-full border p-2 rounded"
        />
      </div> */}

      {/* Botões */}
      <div className="flex justify-end gap-3 mt-4">
        <button
          onClick={() => setEditing(null)}
          className="text-gray-600 hover:underline"
        >
          Cancelar
        </button>
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Salvar
        </button>
      </div>
    </div>
  </div>
)}

        {/* MODAL CRIAÇÃO */}
        {creating && (
          <div className="fixed top-0 left-0 w-full h-full bg-black/40 flex justify-center items-center z-[1000]">
            <div className="bg-white w-[600px] p-6 rounded-2xl shadow-xl max-h-[85vh] overflow-auto z-[1001]">
              <h2 className="text-2xl font-semibold mb-4">
                Cadastrar Funcionário
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  "Nome",
                  "Cargo",
                  "Email",
                  "Telefone",
                  "Senha",
                  "País",
                  "Estado",
                  "Cidade",
                  "Rua",
                  "Número",
                  "CEP",
                  "Complemento",
                ].map((field) => (
                  <div key={field}>
                    <label className="block mb-1">
                      {field.replace("_", " ")}
                    </label>

                    {field === "Cargo" ? (
                      <select
                        value={(newEmployee as any).role || ""}
                        onChange={(e) =>
                          setNewEmployee({
                            ...newEmployee,
                            role: e.target.value,
                          })
                        }
                        className="border p-2 rounded w-full"
                      >
                        <option value="">Selecione o cargo</option>
                        {roles.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={
                          field === "Senha"
                            ? "password"
                            : field === "Número"
                            ? "number"
                            : "text"
                        }
                        value={(newEmployee as any)[field.toLowerCase()] || ""}
                        onChange={(e) =>
                          setNewEmployee({
                            ...newEmployee,
                            [field.toLowerCase()]: e.target.value,
                          })
                        }
                        className="border p-2 rounded w-full"
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setCreating(false)}
                  className="text-gray-600 hover:underline"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreate}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Cadastrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </EmployeeLayout>
  );
}
