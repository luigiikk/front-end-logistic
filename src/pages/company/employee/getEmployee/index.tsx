import { useState } from "react";
import type { FormEvent } from "react";
import { LuSearch } from "react-icons/lu";
import { api } from "../../../../api/lib/api";
import { EmployeeLayout } from "../../../../components/Layout/company/employeeLayout";

type EmployeeData = {
  id: number;
  name: string;
  email?: string;
  phone_number?: string;
};

export default function EmployeeGet() {
  const [searchTerm, setSearchTerm] = useState("");
  const [employee, setEmployee] = useState<EmployeeData | null>(null);

  const handleSearch = async (e: FormEvent) => {
  e.preventDefault();

  if (!searchTerm.trim()) {
    setEmployee(null);
    return;
  }

  try {
    // 1. Buscar todos os employees
    const response = await api.get("/employee");

    // 2. Filtrar pelo nome digitado
    const filtered = response.data.filter((emp: EmployeeData) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 3. Se achar alguém, exibe o primeiro
    if (filtered.length > 0) {
      setEmployee(filtered[0]);
    } else {
      setEmployee(null);
      alert("Funcionário não encontrado");
    }
  } catch (error) {
    console.error(error);
    setEmployee(null);
    alert("Erro ao buscar funcionário");
  }
};

  return (
    <EmployeeLayout activeSection="get">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-xl p-12 flex flex-col min-h-[600px]">
        <h1 className="text-3xl text-center mb-6 font-normal text-black">
          Informações do(a) Funcionário(a)
        </h1>

        <form
          onSubmit={handleSearch}
          className="flex gap-4 mb-8 w-full justify-center px-4 md:px-10"
        >
          <input
            type="text"
            placeholder="Buscar por nome ou ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 border border-gray-400 p-2 rounded-lg"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
          >
            <LuSearch /> Buscar
          </button>
        </form>

        {employee ? (
          <div className="flex flex-col gap-5 w-full px-4 md:px-10">
            {["Nome", "Email", "Telefone"].map((field, idx) => (
              <div
                key={idx}
                className="flex flex-col md:flex-row gap-4 items-center"
              >
                <div className="w-full md:w-1/3 bg-[#d9d9d9] text-black text-lg py-3 px-6 rounded-xl flex items-center shadow-sm font-medium">
                  {field}
                </div>
                <input
                  type="text"
                  value={
                    field === "Nome"
                      ? employee.name
                      : field === "Email"
                      ? employee.email || ""
                      : employee.phone_number || ""
                  }
                  readOnly
                  className="w-full md:w-2/3 border border-gray-500 rounded-xl py-3 px-4 text-lg bg-white outline-none text-gray-700 shadow-inner"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-10">
            <p>Nenhum funcionário selecionado.</p>
            <p className="text-sm">
              Use a busca acima para encontrar um colaborador.
            </p>
          </div>
        )}
      </div>
    </EmployeeLayout>
  );
}
