import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { LuSearch, LuMountain } from "react-icons/lu";
import { api } from "../../../api/lib/api";

type ClientData = {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  cnpj: string;
  address: string;
};

export default function ClientInfo() {
  const [searchTerm, setSearchTerm] = useState("");
  const [client, setClient] = useState<ClientData | null>(null);

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim() === "") return;
    try {
      const response = await api.get(`/clients?search=${searchTerm}`);
      if (
        response.data &&
        Array.isArray(response.data) &&
        response.data.length > 0
      ) {
        setClient(response.data[0]);
      } else {
        alert("Cliente não encontrado");
        setClient(null);
      }
    } catch (error) {
      console.error(error);
      alert("Erro na busca");
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-gray-200 font-sans">
      <header className="flex justify-between items-center px-8 py-4 bg-white shadow-sm z-10">
        <Link
          to="/admin/clientes"
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
        <aside className="w-1/4 bg-[#bfdbf7] flex flex-col items-center py-10 gap-8 min-w-[250px]">
          <h2 className="text-xl font-bold text-center px-4 leading-tight text-black">
            Painel Cliente – <br /> LogiFast
          </h2>
          <nav className="flex flex-col gap-6 w-full px-12">
            <Link to="/admin/clientes/novo" className="w-full no-underline">
              <button className="w-full bg-[#f7b94d] hover:bg-[#e6aa3e] text-black font-medium py-3 rounded-full shadow-md transition-transform hover:scale-105 cursor-pointer border-none text-base">
                Cadastro
              </button>
            </Link>
            <Link to="/admin/clientes/edicao" className="w-full no-underline">
              <button className="w-full bg-[#f7b94d] hover:bg-[#e6aa3e] text-black font-medium py-3 rounded-full shadow-md transition-transform hover:scale-105 cursor-pointer border-none text-base">
                Edição
              </button>
            </Link>
            <Link to="/admin/clientes/exclusao" className="w-full no-underline">
              <button className="w-full bg-[#f7b94d] hover:bg-[#e6aa3e] text-black font-medium py-3 rounded-full shadow-md transition-transform hover:scale-105 cursor-pointer border-none text-base">
                Exclusão
              </button>
            </Link>
            <button className="w-full bg-[#f7b94d] text-black font-medium py-3 rounded-full shadow-md scale-105 cursor-default border-none text-base ring-2 ring-[#e6aa3e]">
              Consulta
            </button>
          </nav>
        </aside>

        <main className="flex-1 p-8 flex justify-center items-center overflow-y-auto">
          <div className="bg-white w-full max-w-4xl rounded-3xl shadow-xl p-10 flex flex-col justify-center min-h-[500px]">
            <h1 className="text-3xl text-center mb-6 font-normal text-black">
              Informações do Cliente
            </h1>
            <form
              onSubmit={handleSearch}
              className="flex gap-4 mb-8 w-full px-4 md:px-10 justify-center"
            >
              <input
                type="text"
                placeholder="Buscar por nome ou CNPJ..."
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

            {client ? (
              <div className="flex flex-col gap-5 w-full px-4 md:px-10">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <div className="w-full md:w-1/3 bg-[#d9d9d9] text-black text-lg py-3 px-6 rounded-xl flex items-center shadow-sm font-medium">
                    Nome
                  </div>
                  <input
                    type="text"
                    value={client.name}
                    readOnly
                    className="w-full md:w-2/3 border border-gray-500 rounded-xl py-3 px-4 text-lg bg-white outline-none text-gray-700 shadow-inner"
                  />
                </div>
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <div className="w-full md:w-1/3 bg-[#d9d9d9] text-black text-lg py-3 px-6 rounded-xl flex items-center shadow-sm font-medium">
                    CNPJ
                  </div>
                  <input
                    type="text"
                    value={client.cnpj}
                    readOnly
                    className="w-full md:w-2/3 border border-gray-500 rounded-xl py-3 px-4 text-lg bg-white outline-none text-gray-700 shadow-inner"
                  />
                </div>
                {/* Outros campos... */}
              </div>
            ) : (
              <p className="text-center text-gray-500 mt-10">
                Use a busca para encontrar um cliente.
              </p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
