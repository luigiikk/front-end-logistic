import { useEffect, useState } from "react";
import { LuSearch } from "react-icons/lu";
import { api } from "../../../../api/lib/api";
import { ClientLayout } from "../../../../components/Layout/company/clientLayout";

type Client = {
  id: number;
  name: string;
};

export default function ClientGet() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchClients() {
      try {
        const response = await api.get("/client");
        setClients(response.data);
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchClients();
  }, []);

  const totalRows = 10;
  const emptyRows = Math.max(0, totalRows - clients.length);

  return (
    <ClientLayout activeSection="get">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-xl overflow-hidden flex flex-col min-h-[600px]">
        <div className="p-8">
          <h1 className="text-3xl text-center mb-8 font-normal text-black">
            Lista de Clientes
          </h1>

          <div className="flex justify-end mb-4">
            <div className="relative">
              <button className="flex items-center gap-2 border border-black rounded-lg px-4 py-1 hover:bg-gray-50 bg-white text-gray-700 cursor-pointer">
                <LuSearch className="w-5 h-5" />
                <span className="text-lg">Pesquisar</span>
              </button>
            </div>
          </div>

          <div className="border-t-2 border-black">
            {loading ? (
              <p className="text-center py-4 text-gray-500">Carregando...</p>
            ) : (
              clients.map((client) => (
                <div
                  key={client.id}
                  className="border-b border-black py-3 px-4 text-lg text-gray-800 hover:bg-gray-50 transition-colors"
                >
                  {client.name}
                </div>
              ))
            )}

            {!loading &&
              Array.from({ length: emptyRows }).map((_, index) => (
                <div
                  key={`empty-${index}`}
                  className="border-b border-black py-3 px-4 h-[53px]"
                >
                  &nbsp;
                </div>
              ))}
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}
