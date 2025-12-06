import { useEffect, useState } from "react";
import { api } from "../../../../api/lib/api";
import { EmployeeLayout } from "../../../../components/Layout/company/employeeLayout";

// Definição do tipo de dado que vem da API
type Employee = {
  id: number;
  name: string;
  // adicione outros campos se necessário
};

export default function EmployeeList() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEmployees() {
      try {
        const response = await api.get("/employee");
        setEmployees(response.data);
      } catch (error) {
        console.error("Erro ao buscar funcionários:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchEmployees();
  }, []);

  return (
    <EmployeeLayout
      activeSection=""
      backLink="/company"
    >
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-xl overflow-hidden flex flex-col min-h-[600px]">
        <div className="p-8">
          <h1 className="text-3xl text-center mb-8 font-normal text-black">
            Lista de Funcionários
          </h1>

          <div className="flex justify-end mb-4">
            <div className="relative">
              <button className="flex items-center gap-2 border border-black rounded-lg px-4 py-1 hover:bg-gray-50 bg-white text-gray-700 cursor-pointer">
                🔍 Pesquisar
              </button>
            </div>
          </div>

          <div className="border-t-2 border-black">
            {loading ? (
              <p className="text-center py-4 text-gray-500">Carregando...</p>
            ) : (
              employees.map((emp) => (
                <div
                  key={emp.id}
                  className="border-b border-black py-3 px-4 text-lg text-gray-800 hover:bg-gray-50 transition-colors"
                >
                  {emp.name}
                </div>
              ))
            )}

            {!loading &&
              Array.from({ length: Math.max(0, 10 - employees.length) }).map(
                (_, index) => (
                  <div
                    key={`empty-${index}`}
                    className="border-b border-black py-3 px-4 h-[53px]"
                  >
                    &nbsp;
                  </div>
                )
              )}
          </div>
        </div>
      </div>
    </EmployeeLayout>
  );
}
