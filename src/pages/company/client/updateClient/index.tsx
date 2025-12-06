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
  address: string;
  cnpj: string;
};

export default function ClientEdit() {
  const [searchTerm, setSearchTerm] = useState("");
  const [foundClient, setFoundClient] = useState<ClientData | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    try {
      const response = await api.get(`/clients?search=${searchTerm}`);
      if (response.data?.length > 0) setFoundClient(response.data[0]);
      else {
        alert("Cliente não encontrado.");
        setFoundClient(null);
      }
    } catch (err) {
      console.error(err);
      alert("Erro na busca.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!foundClient) return;
    setFoundClient({ ...foundClient, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    if (!foundClient) return;
    try {
      await api.put(`/clients/${foundClient.id}`, foundClient);
      alert("Cliente atualizado com sucesso!");
      setIsEditing(false);
      setFoundClient(null);
      setSearchTerm("");
    } catch (err: any) {
      alert("Erro ao atualizar: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <ClientLayout activeSection="update">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-xl p-12 flex flex-col min-h-[600px]">
        {!isEditing ? (
          <>
            <p className="text-xl text-black text-center mb-12 px-8 leading-relaxed">
              Para editar um cliente, insira o nome ou registro no campo de busca.
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
              <div className="w-full flex flex-col items-center gap-8">
                <div className="w-full md:w-4/5 bg-[#d9d9d9] py-4 px-6 text-xl text-black rounded-sm shadow-sm">
                  {foundClient.name}
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
          <form
            onSubmit={handleUpdate}
            className="flex flex-col gap-4 w-full px-4 md:px-12"
          >
            <h2 className="text-2xl text-center mb-6 font-bold">
              Editando Cliente
            </h2>

            {["name", "email", "phone_number", "address"].map((field) => (
              <div key={field}>
                <label className="text-sm font-bold">{field.replace("_", " ")}</label>
                <input
                  name={field}
                  value={(foundClient as any)[field]}
                  onChange={handleChange}
                  className="w-full bg-[#d9d9d9] border border-gray-500 rounded-xl py-3 px-4"
                />
              </div>
            ))}

            <div className="flex justify-center gap-4 mt-6">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-red-400 text-white font-bold py-3 px-8 rounded-xl"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-green-500 text-white font-bold py-3 px-8 rounded-xl"
              >
                Salvar
              </button>
            </div>
          </form>
        )}
      </div>
    </ClientLayout>
  );
}
