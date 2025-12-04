import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LuSearch, LuMountain } from "react-icons/lu";
import { api } from "../../../api/lib/api";

type ProductListItem = {
  id: number;
  name: string;
  tracking_code: string;
  quantity: number;
};

export default function ProductList() {
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await api.get("/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const totalRows = 10;
  const emptyRows = Math.max(0, totalRows - products.length);

  return (
    <div className="flex flex-col h-screen w-full bg-gray-200 font-sans">
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
        <aside className="w-1/4 bg-[#bfdbf7] flex flex-col items-center py-10 gap-8 min-w-[250px]">
          <h2 className="text-xl font-bold text-center px-4 leading-tight text-black">
            Painel Produtos – <br /> LogiFast
          </h2>
          <nav className="flex flex-col gap-6 w-full px-12">
            <Link to="/admin/produtos/novo" className="w-full no-underline">
              <button className="w-full bg-[#f7b94d] hover:bg-[#e6aa3e] text-black font-medium py-3 rounded-full shadow-md transition-transform hover:scale-105 cursor-pointer border-none text-base">
                Cadastro
              </button>
            </Link>
            <Link to="/admin/produtos/edicao" className="w-full no-underline">
              <button className="w-full bg-[#f7b94d] hover:bg-[#e6aa3e] text-black font-medium py-3 rounded-full shadow-md transition-transform hover:scale-105 cursor-pointer border-none text-base">
                Edição
              </button>
            </Link>
            <Link to="/admin/produtos/exclusao" className="w-full no-underline">
              <button className="w-full bg-[#f7b94d] hover:bg-[#e6aa3e] text-black font-medium py-3 rounded-full shadow-md transition-transform hover:scale-105 cursor-pointer border-none text-base">
                Exclusão
              </button>
            </Link>
            <Link to="/admin/produtos/consulta" className="w-full no-underline">
              <button className="w-full bg-[#f7b94d] hover:bg-[#e6aa3e] text-black font-medium py-3 rounded-full shadow-md transition-transform hover:scale-105 cursor-pointer border-none text-base">
                Consulta
              </button>
            </Link>
          </nav>
        </aside>

        <main className="flex-1 p-8 flex justify-center items-start overflow-y-auto">
          <div className="bg-white w-full max-w-5xl rounded-3xl shadow-xl overflow-hidden flex flex-col min-h-[600px]">
            <div className="p-8">
              <h1 className="text-3xl text-center mb-8 font-normal text-black">
                Lista de Produtos
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
                  products.map((prod) => (
                    <div
                      key={prod.id}
                      className="border-b border-black py-3 px-4 text-lg text-gray-800 hover:bg-gray-50 transition-colors"
                    >
                      {prod.name}
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
