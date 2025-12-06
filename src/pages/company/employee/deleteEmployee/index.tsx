import { useState } from "react";
import type { FormEvent } from "react";
import { LuSearch } from "react-icons/lu";
import { api } from "../../../../api/lib/api";
import { AxiosError } from "axios";
import { EmployeeLayout } from "../../../../components/Layout/company/employeeLayout";

type EmployeeData = {
  id: number;
  name: string;
  email?: string;
  phone_number?: string;
};

export default function EmployeeDeletion() {
  const [searchTerm, setSearchTerm] = useState("");
  const [employee, setEmployee] = useState<EmployeeData | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeData | null>(null); // Para deletar

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setEmployee(null);
      return;
    }

    try {
      const response = await api.get(`/employee/${searchTerm}`);
      if (response.data) setEmployee(response.data);
      else {
        setEmployee(null);
        alert("Funcionário não encontrado");
      }
    } catch (error) {
      setEmployee(null);
      alert("Funcionário não encontrado");
    }
  };

  const handleSelect = () => {
    if (!employee?.id) return alert("Funcionário inválido");
    setSelectedEmployee(employee); 
  };

  const handleDelete = async () => {
    if (!selectedEmployee?.id) return alert("Funcionário inválido");

    const confirmDelete = window.confirm(`Deseja excluir ${selectedEmployee.name}?`);
    if (!confirmDelete) return;

    try {
      await api.delete(`/employee/${selectedEmployee.id}`);
      alert("Funcionário excluído com sucesso!");
      setEmployee(null);
      setSelectedEmployee(null);
      setSearchTerm("");
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      alert("Erro ao excluir: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <EmployeeLayout activeSection="delete">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-xl p-12 flex flex-col min-h-[600px]">
        <h1 className="text-3xl text-center mb-6 font-normal text-black">
          Excluir Funcionário
        </h1>

        <form
          onSubmit={handleSearch}
          className="flex gap-4 mb-8 w-full justify-center px-4 md:px-10"
        >
          <input
            type="text"
            placeholder="Buscar por ID..."
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

        {employee && (
          <div className="flex flex-col gap-5 w-full px-4 md:px-10 items-center">
            <div className="w-full md:w-4/5 bg-[#d9d9d9] py-4 px-6 text-xl text-black rounded-sm shadow-sm">
              {employee.name} - {employee.email || "Sem e-mail"}
            </div>

            {!selectedEmployee && (
              <button
                onClick={handleSelect}
                className="bg-yellow-500 text-black font-bold py-3 px-20 rounded-xl hover:bg-yellow-600 transition-colors shadow-md cursor-pointer text-lg"
              >
                Selecionar para deletar
              </button>
            )}

            {selectedEmployee && (
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white font-bold py-3 px-20 rounded-xl hover:bg-red-600 transition-colors shadow-md cursor-pointer text-lg"
              >
                Excluir
              </button>
            )}
          </div>
        )}
      </div>
    </EmployeeLayout>
  );
}
