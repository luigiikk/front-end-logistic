import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LuSearch, LuMountain } from "react-icons/lu";
import { api } from "../../../../api/lib/api";

type Client = {
  id: number;
  name: string;
  // Adicione outros campos se necessário
};

export default function ClientList() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    async function fetchClients() {
      try {
        const response = await api.get("/clients");
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
    <div className="flex flex-col h-screen w-full bg-gray-200 font-sans">
      {/* HEADER */}
      <header className="flex justify-between items-center px-8 py-4 bg-white shadow-sm z-10">
        <Link
          to="/admin"
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
        {/* SIDEBAR - Painel Cliente */}
        <aside className="w-1/4 bg-[#bfdbf7] flex flex-col items-center py-10 gap-8 min-w-[250px]">
          <h2 className="text-xl font-bold text-center px-4 leading-tight text-black">
            Painel Cliente – <br /> LogiFast
          </h2>
          <nav className="flex flex-col gap-6 w-full px-12">
            <Link to="/admin/clientes/novo" className="w-full no-underline">
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
            <Link to="/admin/clientes/edicao" className="w-full no-underline">
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
            <Link to="/admin/clientes/exclusao" className="w-full no-underline">
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
            <Link to="/admin/clientes/consulta" className="w-full no-underline">
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

        <main className="flex-1 p-8 flex justify-center items-start overflow-y-auto">
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
                  <p className="text-center py-4 text-gray-500">
                    Carregando...
                  </p>
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
        </main>
      </div>
    </div>
  );
}
