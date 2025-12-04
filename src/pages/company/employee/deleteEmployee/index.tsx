import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import { LuSearch, LuMountain } from "react-icons/lu";
import { api } from "../../../../api/lib/api";
import { AxiosError } from "axios";

type EmployeeData = {
  id: number;
  name: string;
};

export default function EmployeeDeletion() {
  const [searchTerm, setSearchTerm] = useState("");
  const [foundEmployee, setFoundEmployee] = useState<EmployeeData | null>(null);
  const location = useLocation();

  // --- 1. BUSCA O FUNCIONÁRIO ---
  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim() === "") return;

    try {
      const response = await api.get(`/employees?search=${searchTerm}`);

      if (
        response.data &&
        Array.isArray(response.data) &&
        response.data.length > 0
      ) {
        setFoundEmployee(response.data[0]);
      } else {
        alert("Funcionário não encontrado.");
        setFoundEmployee(null);
      }
    } catch (err) {
      console.error("Erro na busca:", err);
      alert("Erro ao buscar funcionário.");
    }
  };

  // --- 2. DELETA O FUNCIONÁRIO ---
  const handleDelete = async () => {
    if (!foundEmployee) return;

    const confirm = window.confirm(
      `Tem certeza que deseja excluir ${foundEmployee.name}?`
    );
    if (!confirm) return;

    try {
      await api.delete(`/employees/${foundEmployee.id}`);
      alert("Funcionário excluído com sucesso!");
      setFoundEmployee(null);
      setSearchTerm("");
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      alert(
        "Erro ao excluir: " + (error.response?.data?.message || error.message)
      );
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-gray-200 font-sans">
      {/* HEADER */}
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
        {/* SIDEBAR */}
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
                  location.pathname.includes("/novo")
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
                  location.pathname.includes("/edicao")
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
                  location.pathname.includes("/exclusao")
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
                  location.pathname.includes("/consulta")
                    ? "bg-[#f7b94d] text-black ring-2 ring-[#e6aa3e]"
                    : "bg-[#f7b94d] hover:bg-[#e6aa3e] text-black"
                }`}
              >
                Consulta
              </button>
            </Link>
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 p-8 flex justify-center items-center overflow-y-auto">
          <div className="bg-white w-full max-w-4xl rounded-3xl shadow-xl p-12 flex flex-col min-h-[600px]">
            <p className="text-xl text-black text-center mb-12 px-8 leading-relaxed">
              Para excluir um funcionário, insira o nome ou o registro no campo
              de busca, selecione o funcionário desejado e confirme a exclusão.
            </p>

            {/* Formulário de Busca */}
            <form
              onSubmit={handleSearch}
              className="flex flex-col md:flex-row justify-center items-center gap-4 mb-12"
            >
              <input
                type="text"
                placeholder="Insira aqui o nome ou registro"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-3/5 border border-black rounded-lg py-3 px-4 text-lg text-black outline-none focus:ring-1 focus:ring-black"
              />
              <button
                type="submit"
                className="flex items-center gap-2 border border-black rounded-lg px-6 py-3 bg-white hover:bg-gray-100 text-black cursor-pointer shadow-sm transition-colors"
              >
                <LuSearch className="w-5 h-5" />
                <span className="text-lg font-medium">Pesquisar</span>
              </button>
            </form>

            {/* Resultado e Botão Excluir */}
            {foundEmployee && (
              <div className="w-full flex flex-col items-center gap-12 animate-pulse-once">
                <div className="w-full md:w-4/5 bg-[#d9d9d9] py-4 px-6 text-xl text-black rounded-sm shadow-sm">
                  {foundEmployee.name},{" "}
                  {String(foundEmployee.id).padStart(3, "0")}
                </div>

                <button
                  onClick={handleDelete}
                  className="bg-[#cfcfcf] border border-black text-black font-bold py-3 px-20 rounded-xl hover:bg-[#b0b0b0] transition-colors shadow-md cursor-pointer text-lg"
                >
                  Excluir
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
