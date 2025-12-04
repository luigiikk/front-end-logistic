import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { LuSearch, LuMountain } from "react-icons/lu";
import { api } from "../../../api/lib/api";
import { AxiosError } from "axios";

type ProductData = {
  id: number;
  name: string;
  description: string;
  quantity: number;
  tracking_code: string;
};

export default function ProductEdit() {
  const [searchTerm, setSearchTerm] = useState("");
  const [foundProduct, setFoundProduct] = useState<ProductData | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const inputClass =
    "w-full bg-[#d9d9d9] border border-gray-500 rounded-xl py-3 px-4 text-lg text-black placeholder-black outline-none focus:ring-2 focus:ring-gray-400 shadow-inner";

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
    } catch (error) {
      console.error(error);
      alert("Erro na busca.");
    }
  };

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    if (!foundProduct) return;
    try {
      await api.put(`/products/${foundProduct.id}`, foundProduct);
      alert("Produto atualizado com sucesso!");
      setIsEditing(false);
      setFoundProduct(null);
      setSearchTerm("");
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      alert(
        "Erro ao atualizar: " + (error.response?.data?.message || error.message)
      );
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!foundProduct) return;
    setFoundProduct({ ...foundProduct, [e.target.name]: e.target.value });
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
            <button className="w-full bg-[#f7b94d] text-black font-medium py-3 rounded-full shadow-md scale-105 cursor-default border-none text-base ring-2 ring-[#e6aa3e]">
              Edição
            </button>
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

        <main className="flex-1 p-8 flex justify-center items-center overflow-y-auto">
          <div className="bg-white w-full max-w-4xl rounded-3xl shadow-xl p-12 flex flex-col min-h-[600px]">
            {!isEditing ? (
              <>
                <p className="text-xl text-black text-center mb-12 px-8 leading-relaxed">
                  Para editar um produto, insira o nome ou código de rastreio no
                  campo de busca, selecione o produto desejado e, em seguida,
                  altere as informações necessárias.
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
                  <div className="w-full flex flex-col items-center gap-8">
                    <div className="w-full md:w-4/5 bg-[#d9d9d9] py-4 px-6 text-xl text-black rounded-sm shadow-sm">
                      {foundProduct.name}, {foundProduct.tracking_code}
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
                  Editar Dados do Produto
                </h2>
                <input
                  name="name"
                  value={foundProduct?.name}
                  onChange={handleChange}
                  placeholder="Nome"
                  className={inputClass}
                />
                <input
                  name="description"
                  value={foundProduct?.description}
                  onChange={handleChange}
                  placeholder="Descrição"
                  className={inputClass}
                />
                <input
                  name="quantity"
                  type="number"
                  value={foundProduct?.quantity}
                  onChange={handleChange}
                  placeholder="Quantidade"
                  className={inputClass}
                />
                <input
                  name="tracking_code"
                  value={foundProduct?.tracking_code}
                  onChange={handleChange}
                  placeholder="Código de Rastreio"
                  className={inputClass}
                />

                <div className="flex justify-center gap-4 mt-6">
                  <button
                    type="submit"
                    className="bg-[#cfcfcf] border border-gray-600 text-black font-bold py-3 px-16 rounded-xl hover:bg-[#b0b0b0] transition-colors shadow-md cursor-pointer"
                  >
                    Salvar
                  </button>
                </div>
              </form>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
