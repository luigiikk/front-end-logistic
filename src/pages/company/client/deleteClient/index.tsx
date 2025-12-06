import { useState} from "react";
import type { FormEvent } from "react";
import { LuSearch } from "react-icons/lu";
import { api } from "../../../../api/lib/api";
import { AxiosError } from "axios";
import { ClientLayout } from "../../../../components/Layout/company/clientLayout";

type ClientData = {
  id: number;
  name: string;
};

export default function ClientDelete() {
  const [searchTerm, setSearchTerm] = useState("");
  const [foundClient, setFoundClient] = useState<ClientData | null>(null);

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    try {
      const response = await api.get(`/client?search=${searchTerm}`);
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        setFoundClient(response.data[0]);
      } else {
        alert("Cliente não encontrado.");
        setFoundClient(null);
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao buscar.");
    }
  };

  const handleDelete = async () => {
    if (!foundClient) return;
    const confirm = window.confirm(`Tem certeza que deseja excluir ${foundClient.name}?`);
    if (!confirm) return;
    try {
      await api.delete(`/client/${foundClient.id}`);
      alert("Cliente excluído com sucesso!");
      setFoundClient(null);
      setSearchTerm("");
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      alert("Erro ao excluir: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <ClientLayout activeSection="delete">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-xl p-12 flex flex-col min-h-[600px]">
        <p className="text-xl text-black text-center mb-12 px-8 leading-relaxed">
          Para excluir um cliente, insira o nome ou registro no campo de busca.
        </p>

        <form
          onSubmit={handleSearch}
          className="flex flex-col md:flex-row justify-center items-center gap-4 mb-12"
        >
          <input
            type="text"
            placeholder="Nome ou CNPJ"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-3/5 border border-black rounded-lg py-3 px-4 text-lg text-black outline-none"
          />
          <button
            type="submit"
            className="flex items-center gap-2 border border-black rounded-lg px-6 py-3 bg-white hover:bg-gray-100 text-black cursor-pointer shadow-sm"
          >
            <LuSearch className="w-5 h-5" />
            <span className="text-lg font-medium">Pesquisar</span>
          </button>
        </form>

        {foundClient && (
          <div className="w-full flex flex-col items-center gap-12">
            <div className="w-full md:w-4/5 bg-[#d9d9d9] py-4 px-6 text-xl text-black rounded-sm shadow-sm">
              {foundClient.name}
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
    </ClientLayout>
  );
}
