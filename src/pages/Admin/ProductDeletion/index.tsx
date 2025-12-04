import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { LuSearch, LuMountain } from "react-icons/lu";
import { api } from "../../../api/lib/api";
import { AxiosError } from "axios";

type ProductData = {
  id: number;
  name: string;
  tracking_code: string;
};

export default function ProductDeletion() {
  const [searchTerm, setSearchTerm] = useState("");
  const [foundProduct, setFoundProduct] = useState<ProductData | null>(null);

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim() === "") return;
    try {
      const response = await api.get(`/products?search=${searchTerm}`);
      if (
        response.data &&
        Array.isArray(response.data) &&
        response.data.length > 0
      ) {
        setFoundProduct(response.data[0]);
      } else {
        alert("Produto não encontrado.");
        setFoundProduct(null);
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao buscar.");
    }
  };

  const handleDelete = async () => {
    if (!foundProduct) return;
    const confirm = window.confirm(
      `Tem certeza que deseja excluir o produto "${foundProduct.name}"?`
    );
    if (!confirm) return;
    try {
      await api.delete(`/products/${foundProduct.id}`);
      alert("Produto excluído com sucesso!");
      setFoundProduct(null);
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
      <header className="flex justify-between items-center px-8 py-4 bg-white shadow-sm z-10">
        <Link
          to="/admin/produtos"
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
            <button className="w-full bg-[#f7b94d] text-black font-medium py-3 rounded-full shadow-md scale-105 cursor-default border-none text-base ring-2 ring-[#e6aa3e]">
              Exclusão
            </button>
            <Link to="/admin/produtos/consulta" className="w-full no-underline">
              <button className="w-full bg-[#f7b94d] hover:bg-[#e6aa3e] text-black font-medium py-3 rounded-full shadow-md transition-transform hover:scale-105 cursor-pointer border-none text-base">
                Consulta
              </button>
            </Link>
          </nav>
        </aside>

        <main className="flex-1 p-8 flex justify-center items-center overflow-y-auto">
          <div className="bg-white w-full max-w-4xl rounded-3xl shadow-xl p-12 flex flex-col min-h-[600px]">
            <p className="text-xl text-black text-center mb-12 px-8 leading-relaxed">
              Para excluir um produto, insira o nome ou o código de rastreio no
              campo de busca, selecione o cliente desejado e confirme a
              exclusão.
            </p>
            <form
              onSubmit={handleSearch}
              className="flex flex-col md:flex-row justify-center items-center gap-4 mb-12"
            >
              <input
                type="text"
                placeholder="Insira aqui o nome ou código"
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
            {foundProduct && (
              <div className="w-full flex flex-col items-center gap-12">
                <div className="w-full md:w-4/5 bg-[#d9d9d9] py-4 px-6 text-xl text-black rounded-sm shadow-sm">
                  {foundProduct.name}, {foundProduct.tracking_code}
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
