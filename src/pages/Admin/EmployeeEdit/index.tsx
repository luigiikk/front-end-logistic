import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import { LuSearch, LuMountain } from "react-icons/lu";
import { api } from "../../../api/lib/api";
import { AxiosError } from "axios";

type EmployeeData = {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  employee_roles: number[]; // Array de IDs de cargo
};

export default function EmployeeEdit() {
  const [searchTerm, setSearchTerm] = useState("");
  const [foundEmployee, setFoundEmployee] = useState<EmployeeData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const location = useLocation();

  // --- 1. BUSCA ---
  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim() === "") return;

    try {
      // Ajuste o endpoint de busca conforme sua API
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
    } catch (error) {
      console.error("Erro na busca:", error);
      alert("Erro ao buscar funcionário.");
    }
  };

  // --- 2. ATUALIZAÇÃO ---
  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    if (!foundEmployee) return;

    try {
      // Ajuste o endpoint de update conforme sua API
      await api.put(`/employees/${foundEmployee.id}`, {
        name: foundEmployee.name,
        email: foundEmployee.email,
        phone_number: foundEmployee.phone_number,
        employee_roles: foundEmployee.employee_roles,
      });
      alert("Dados atualizados com sucesso!");
      setIsEditing(false);
      setFoundEmployee(null);
      setSearchTerm("");
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      alert(
        "Erro ao atualizar: " + (error.response?.data?.message || error.message)
      );
    }
  };

  // Atualiza os inputs do formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!foundEmployee) return;
    setFoundEmployee({ ...foundEmployee, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex flex-col h-screen w-full bg-gray-200 font-sans">
      {/* HEADER */}
      <header className="flex justify-between items-center px-8 py-4 bg-white shadow-sm z-10">
        <Link
          to="/admin/colaboradores"
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
        <button className="bg-[#f7b94d] hover:bg-[#e6aa3e] text-black px-8 py-2 rounded-full font-medium transition-colors shadow-sm cursor-pointer">
          Sair
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <aside className="w-1/4 bg-[#bfdbf7] flex flex-col items-center py-10 gap-8 min-w-[250px]">
          <h2 className="text-xl font-bold text-center px-4 leading-tight text-black">
            Painel Funcionário – <br /> LogiFast
          </h2>
          <nav className="flex flex-col gap-6 w-full px-12">
            <Link
              to="/admin/colaboradores/novo"
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

            <Link
              to="/admin/colaboradores/edicao"
              className="w-full no-underline"
            >
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

            <Link
              to="/admin/colaboradores/exclusao"
              className="w-full no-underline"
            >
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

            <Link
              to="/admin/colaboradores/consulta"
              className="w-full no-underline"
            >
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
            {/* TELA 1: BUSCA (Se não estiver editando) */}
            {!isEditing ? (
              <>
                <p className="text-xl text-black text-center mb-12 px-8 leading-relaxed">
                  Para editar um funcionário, insira o nome ou o registro no
                  campo de busca, selecione o funcionário desejado e, em
                  seguida, altere as informações necessárias.
                </p>

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

                {/* Resultado da Busca */}
                {foundEmployee && (
                  <div className="w-full flex flex-col items-center gap-8 animate-pulse-once">
                    <div className="w-full md:w-4/5 bg-[#d9d9d9] py-4 px-6 text-xl text-black rounded-sm shadow-sm">
                      {foundEmployee.name} - ID: {foundEmployee.id}
                    </div>
                    {/* Ao clicar aqui, vamos para a TELA 2 */}
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
              // --- TELA 2: FORMULÁRIO DE EDIÇÃO ---
              <div className="w-full">
                <h1 className="text-3xl text-center mb-8 font-normal text-black">
                  Editar Dados de Funcionários
                </h1>

                <form
                  onSubmit={handleUpdate}
                  className="flex flex-col gap-4 w-full px-4 md:px-12"
                >
                  {/* ID / Registro (Readonly) */}
                  <input
                    type="text"
                    value={String(foundEmployee?.id).padStart(3, "0")}
                    readOnly
                    className="w-full bg-[#d9d9d9] border border-gray-500 rounded-xl py-3 px-4 text-lg text-black outline-none shadow-inner cursor-not-allowed"
                  />

                  {/* Nome */}
                  <input
                    name="name"
                    value={foundEmployee?.name}
                    onChange={handleChange}
                    type="text"
                    className="w-full bg-[#d9d9d9] border border-gray-500 rounded-xl py-3 px-4 text-lg text-black outline-none focus:ring-2 focus:ring-gray-400 shadow-inner"
                  />

                  {/* Telefone */}
                  <input
                    name="phone_number"
                    value={foundEmployee?.phone_number}
                    onChange={handleChange}
                    type="text"
                    className="w-full bg-[#d9d9d9] border border-gray-500 rounded-xl py-3 px-4 text-lg text-black outline-none focus:ring-2 focus:ring-gray-400 shadow-inner"
                  />

                  {/* Email */}
                  <input
                    name="email"
                    value={foundEmployee?.email}
                    onChange={handleChange}
                    type="email"
                    className="w-full bg-[#d9d9d9] border border-gray-500 rounded-xl py-3 px-4 text-lg text-black outline-none focus:ring-2 focus:ring-gray-400 shadow-inner"
                  />

                  {/* Cargo (Exibindo estático ou input) */}
                  <input
                    type="text"
                    value="Cargo (Ex: Motorista)" // Pode vir do foundEmployee.role se tiver
                    readOnly
                    className="w-full bg-[#d9d9d9] border border-gray-500 rounded-xl py-3 px-4 text-lg text-black outline-none shadow-inner"
                  />

                  {/* Botão Salvar (Cinza e Centralizado) */}
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
        </main>
      </div>
    </div>
  );
}
