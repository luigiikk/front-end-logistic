import { useState} from "react";
import type { FormEvent } from "react";
import { LuSearch } from "react-icons/lu";
import { api } from "../../../../api/lib/api";
import { ClientLayout } from "../../../../components/Layout/company/clientLayout";

type ClientData = {
  id: number;
  name: string;
  email: string;
  phone_number: string; 
  CNPJ: string;
  address: string;
};

export default function ClientGet() {
  const [searchTerm, setSearchTerm] = useState("");
  const [client, setClient] = useState<ClientData | null>(null);

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    try {
      const response = await api.get(`/client?search=${searchTerm}`);
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
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
console.log(client?.CNPJ)
  return (
    <ClientLayout activeSection="get">
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
                value={client.CNPJ}
                readOnly
                className="w-full md:w-2/3 border border-gray-500 rounded-xl py-3 px-4 text-lg bg-white outline-none text-gray-700 shadow-inner"
              />
            </div>
            {/* Outros campos como email, telefone e endereço */}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-10">
            Use a busca para encontrar um cliente.
          </p>
        )}
      </div>
    </ClientLayout>
  );
}
