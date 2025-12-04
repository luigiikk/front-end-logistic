import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import { LuMountain, LuSearch } from "react-icons/lu";
import { api } from "../../../../api/lib/api";

type EmployeeData = {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  // Adicione outros campos necessários
};

export default function EmployeeGet() {
  const [searchTerm, setSearchTerm] = useState("");
  const [employee, setEmployee] = useState<EmployeeData | null>(null);
  const location = useLocation();

  const handleSearch = async (e: FormEvent) => {
  e.preventDefault();

  if (searchTerm.trim() === "") {
    setEmployee(null);
    return;
  }

  try {
    const response = await api.get(`/employee/${searchTerm}`);

  if (response.data) {
    setEmployee(response.data); 
  } else {
    setEmployee(null);
    alert("Funcionário não encontrado");
  }
} catch (error) {
  setEmployee(null); 
  alert("Funcionário não encontrado");
}
};

  return (
    <div className="flex flex-col h-screen w-full bg-gray-200 font-sans">
      <header className="flex justify-between items-center px-8 py-4 bg-white shadow-sm z-10">
        <Link
          to="/company/employee"
          className="bg-[#f7b94d] hover:bg-[#e6aa3e] text-black px-8 py-2 rounded-full font-medium transition-colors shadow-sm cursor-pointer no-underline flex items-center justify-center"
        >
          Voltar
        </Link>
        <div className="flex items-center gap-3">
          <div className="border-2 border-black rounded-full p-1">
            <LuMountain className="w-6 h-6 text-black" />
          </div>
          <span className="font-bold text-lg tracking-wide text-black">
            EMPRESA
          </span>
        </div>
        <Link
          to="/company"
          className="bg-[#f7b94d] hover:bg-[#e6aa3e] text-black px-8 py-2 rounded-full font-medium transition-colors shadow-sm cursor-pointer"
        >
          Sair
        </Link>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-1/4 bg-[#bfdbf7] flex flex-col items-center py-10 gap-8 min-w-[250px]">
          <h2 className="text-xl font-bold text-center px-4 leading-tight text-black">
            Painel Funcionário – <br /> LogiFast
          </h2>
          <nav className="flex flex-col gap-6 w-full px-12">
            <Link
              to="/company/employee/register"
              className="w-full no-underline"
            >
              <button
                className={`w-full font-medium py-3 rounded-full shadow-md transition-transform hover:scale-105 cursor-pointer border-none text-base ${
                  location.pathname.includes("/register")
                    ? "bg-[#f7b94d] text-black ring-2 ring-[#e6aa3e]"
                    : "bg-[#f7b94d] hover:bg-[#e6aa3e] text-black"
                }`}
              >
                Cadastro
              </button>
            </Link>

            <Link to="/company/employee/update" className="w-full no-underline">
              <button
                className={`w-full font-medium py-3 rounded-full shadow-md transition-transform hover:scale-105 cursor-pointer border-none text-base ${
                  location.pathname.includes("/update")
                    ? "bg-[#f7b94d] text-black ring-2 ring-[#e6aa3e]"
                    : "bg-[#f7b94d] hover:bg-[#e6aa3e] text-black"
                }`}
              >
                Edição
              </button>
            </Link>

            <Link to="/company/employee/delete" className="w-full no-underline">
              <button
                className={`w-full font-medium py-3 rounded-full shadow-md transition-transform hover:scale-105 cursor-pointer border-none text-base ${
                  location.pathname.includes("/delete")
                    ? "bg-[#f7b94d] text-black ring-2 ring-[#e6aa3e]"
                    : "bg-[#f7b94d] hover:bg-[#e6aa3e] text-black"
                }`}
              >
                Exclusão
              </button>
            </Link>

            <Link to="/company/employee/get" className="w-full no-underline">
              <button
                className={`w-full font-medium py-3 rounded-full shadow-md transition-transform hover:scale-105 cursor-pointer border-none text-base ${
                  location.pathname.includes("/get")
                    ? "bg-[#f7b94d] text-black ring-2 ring-[#e6aa3e]"
                    : "bg-[#f7b94d] hover:bg-[#e6aa3e] text-black"
                }`}
              >
                Consulta
              </button>
            </Link>
          </nav>
        </aside>

        <main className="flex-1 p-8 flex justify-center items-center overflow-y-auto">
          <div className="bg-white w-full max-w-4xl rounded-3xl shadow-xl p-10 flex flex-col justify-center min-h-[500px]">
            <h1 className="text-3xl text-center mb-6 font-normal text-black">
              Informações do(a) Funcionário(a)
            </h1>

            {/* Barra de Busca para Consulta */}
            <form
              onSubmit={handleSearch}
              className="flex gap-4 mb-8 w-full px-4 md:px-10 justify-center"
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
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <div className="w-full md:w-1/3 bg-[#d9d9d9] text-black text-lg py-3 px-6 rounded-xl flex items-center shadow-sm font-medium">
                    Nome Completo
                  </div>
                  <input
                    type="text"
                    value={employee.name}
                    readOnly
                    className="w-full md:w-2/3 border border-gray-500 rounded-xl py-3 px-4 text-lg bg-white outline-none text-gray-700 shadow-inner"
                  />
                </div>
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <div className="w-full md:w-1/3 bg-[#d9d9d9] text-black text-lg py-3 px-6 rounded-xl flex items-center shadow-sm font-medium">
                    Email
                  </div>
                  <input
                    type="text"
                    value={employee.email}
                    readOnly
                    className="w-full md:w-2/3 border border-gray-500 rounded-xl py-3 px-4 text-lg bg-white outline-none text-gray-700 shadow-inner"
                  />
                </div>
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <div className="w-full md:w-1/3 bg-[#d9d9d9] text-black text-lg py-3 px-6 rounded-xl flex items-center shadow-sm font-medium">
                    Telefone
                  </div>
                  <input
                    type="text"
                    value={employee.phone_number}
                    readOnly
                    className="w-full md:w-2/3 border border-gray-500 rounded-xl py-3 px-4 text-lg bg-white outline-none text-gray-700 shadow-inner"
                  />
                </div>
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
        </main>
      </div>
    </div>
  );
}
