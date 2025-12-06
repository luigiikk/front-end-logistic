import { useState } from "react";
import type { FormEvent } from "react";
import { EmployeeLayout } from "../../../../components/Layout/company/employeeLayout";
import { api } from "../../../../api/lib/api";
import { AxiosError } from "axios";

type EmployeeData = {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  employee_roles: number[];
};

export default function EmployeeEdit() {
  const [searchTerm, setSearchTerm] = useState("");
  const [foundEmployee, setFoundEmployee] = useState<EmployeeData | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // --- BUSCA ---
  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setFoundEmployee(null);
    setIsEditing(false);

    try {
      const response = await api.get(`/employee?search=${searchTerm}`);
      const employee = Array.isArray(response.data) ? response.data[0] : response.data;

      if (employee) setFoundEmployee(employee);
      else alert("Funcionário não encontrado.");
    } catch (error) {
      console.error(error);
      alert("Erro ao buscar funcionário.");
    }
  };

  // --- ATUALIZAÇÃO ---
  const handleUpdate = async (e: FormEvent) => {
  e.preventDefault();
  if (!foundEmployee?.id) return alert("Selecione um funcionário válido.");

  const { name, email, phone_number, employee_roles } = foundEmployee;

  if (!name || !email || !phone_number || employee_roles == null) {
    return alert("Preencha todos os campos antes de atualizar.");
  }

  try {
    const body = { name, email, phone_number, employee_roles: Number(employee_roles) };
    await api.put(`/employee/${foundEmployee.id}`, body);

    alert("Dados atualizados com sucesso!");
    setIsEditing(false);
    setFoundEmployee(null);
    setSearchTerm("");
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    alert("Erro ao atualizar: " + (error.response?.data?.message || error.message));
  }
};

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!foundEmployee) return;
    setFoundEmployee({ ...foundEmployee, [e.target.name]: e.target.value });
  };

  return (
    <EmployeeLayout
      activeSection="update"
      backLink="/company/employee"
    >
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-xl p-12 flex flex-col min-h-[600px]">
        {!isEditing ? (
          <>
            <p className="text-xl text-black text-center mb-12 px-8 leading-relaxed">
              Para editar um funcionário, insira o nome ou registro no campo de busca,
              selecione o funcionário desejado e altere as informações necessárias.
            </p>

            <form
              onSubmit={handleSearch}
              className="flex flex-col md:flex-row justify-center items-center gap-4 mb-12"
            >
              <input
                type="text"
                placeholder="Nome ou registro"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-3/5 border border-black rounded-lg py-3 px-4 text-lg outline-none focus:ring-1 focus:ring-black"
              />
              <button
                type="submit"
                className="flex items-center gap-2 border border-black rounded-lg px-6 py-3 bg-white hover:bg-gray-100 text-black cursor-pointer shadow-sm transition-colors"
              >
                Pesquisar
              </button>
            </form>

            {foundEmployee && (
              <div className="w-full flex flex-col items-center gap-8 animate-pulse-once">
                <div className="w-full md:w-4/5 bg-[#d9d9d9] py-4 px-6 text-xl rounded-sm shadow-sm">
                  {foundEmployee.name} - ID: {foundEmployee.id}
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-[#cfcfcf] border border-black text-black font-bold py-3 px-16 rounded-xl hover:bg-[#b0b0b0] transition-colors shadow-md cursor-pointer text-lg"
                >
                  Editar
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="w-full">
            <h1 className="text-3xl text-center mb-8 font-normal text-black">
              Editar Dados de Funcionários
            </h1>

            <form
              onSubmit={handleUpdate}
              className="flex flex-col gap-4 w-full px-4 md:px-12"
            >
              <input
                type="text"
                value={String(foundEmployee?.id).padStart(3, "0")}
                readOnly
                className="w-full bg-[#d9d9d9] border border-gray-500 rounded-xl py-3 px-4 text-lg cursor-not-allowed shadow-inner"
              />

              <input
                name="name"
                value={foundEmployee?.name}
                onChange={handleChange}
                type="text"
                className="w-full bg-[#d9d9d9] border border-gray-500 rounded-xl py-3 px-4 text-lg focus:ring-2 focus:ring-gray-400 shadow-inner"
              />

              <input
                name="phone_number"
                value={foundEmployee?.phone_number}
                onChange={handleChange}
                type="text"
                className="w-full bg-[#d9d9d9] border border-gray-500 rounded-xl py-3 px-4 text-lg focus:ring-2 focus:ring-gray-400 shadow-inner"
              />

              <input
                name="email"
                value={foundEmployee?.email}
                onChange={handleChange}
                type="email"
                className="w-full bg-[#d9d9d9] border border-gray-500 rounded-xl py-3 px-4 text-lg focus:ring-2 focus:ring-gray-400 shadow-inner"
              />

              <input
                type="text"
                value="Cargo (Ex: Motorista)"
                readOnly
                className="w-full bg-[#d9d9d9] border border-gray-500 rounded-xl py-3 px-4 text-lg shadow-inner"
              />

              <div className="flex justify-center mt-6 gap-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="text-gray-500 font-bold py-3 px-8 hover:underline"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-[#cfcfcf] border border-gray-600 text-black font-bold py-3 px-16 rounded-xl hover:bg-[#b0b0b0] transition-colors shadow-md cursor-pointer"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </EmployeeLayout>
  );
}
