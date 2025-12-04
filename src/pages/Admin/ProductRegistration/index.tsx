import { useState } from "react";
import { Link } from "react-router-dom";
import { LuMountain } from "react-icons/lu";
import { api } from "../../../api/lib/api";
import { AxiosError } from "axios";

export default function ProductRegistration() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    quantity: "",
    tracking_code: "",
  });

  const inputClass =
    "w-full bg-[#d9d9d9] border border-gray-500 rounded-xl py-3 px-4 text-lg text-black placeholder-black outline-none focus:ring-2 focus:ring-gray-400 shadow-inner";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        quantity: parseInt(formData.quantity, 10),
      };

      await api.post("/products", payload);
      alert("Produto cadastrado com sucesso!");
      setFormData({
        name: "",
        description: "",
        quantity: "",
        tracking_code: "",
      });
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      alert(
        "Erro ao cadastrar: " + (error.response?.data?.message || error.message)
      );
    }
  }

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
            <button className="w-full bg-[#f7b94d] text-black font-medium py-3 rounded-full shadow-md scale-105 cursor-default border-none text-base ring-2 ring-[#e6aa3e]">
              Cadastro
            </button>
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

        <main className="flex-1 p-8 flex justify-center items-center overflow-y-auto">
          <div className="bg-white w-full max-w-4xl rounded-3xl shadow-xl p-10 flex flex-col justify-center min-h-[600px]">
            <h1 className="text-3xl text-center mb-8 font-normal text-black">
              Cadastro do Produto
            </h1>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 w-full px-4 md:px-12"
            >
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                type="text"
                placeholder="Nome"
                className={inputClass}
                required
              />
              <input
                name="description"
                value={formData.description}
                onChange={handleChange}
                type="text"
                placeholder="Descrição"
                className={inputClass}
                required
              />
              <input
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                type="number"
                placeholder="Quantidade"
                className={inputClass}
                required
              />
              <input
                name="tracking_code"
                value={formData.tracking_code}
                onChange={handleChange}
                type="text"
                placeholder="Código De Rastreio"
                className={inputClass}
                required
              />

              <div className="flex justify-center mt-6">
                <button
                  type="submit"
                  className="bg-[#cfcfcf] border border-gray-600 text-black font-bold py-3 px-12 rounded-xl hover:bg-[#b0b0b0] transition-colors shadow-md cursor-pointer"
                >
                  Cadastre
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
