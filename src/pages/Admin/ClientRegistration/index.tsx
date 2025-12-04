import { useState } from "react";
import { Link } from "react-router-dom";
import { LuMountain } from "react-icons/lu";
import { api } from "../../../api/lib/api";
import { AxiosError } from "axios";

export default function ClientRegistration() {
  const [formData, setFormData] = useState({
    name: "",
    cnpj: "",
    email: "",
    phone_number: "",
    address: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api.post("/clients", formData); // Ajuste a rota se necessário
      alert("Cliente cadastrado com sucesso!");
      setFormData({
        name: "",
        cnpj: "",
        email: "",
        phone_number: "",
        address: "",
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
            <button className="w-full bg-[#f7b94d] text-black font-medium py-3 rounded-full shadow-md scale-105 cursor-default border-none text-base ring-2 ring-[#e6aa3e]">
              Cadastro
            </button>
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
            <Link to="/admin/clientes/consulta" className="w-full no-underline">
              <button className="w-full bg-[#f7b94d] hover:bg-[#e6aa3e] text-black font-medium py-3 rounded-full shadow-md transition-transform hover:scale-105 cursor-pointer border-none text-base">
                Consulta
              </button>
            </Link>
          </nav>
        </aside>

        <main className="flex-1 p-8 flex justify-center items-center overflow-y-auto">
          <div className="bg-white w-full max-w-4xl rounded-3xl shadow-xl p-10 flex flex-col justify-center min-h-[600px]">
            <h1 className="text-3xl text-center mb-8 font-normal text-black">
              Cadastro de Clientes
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
                placeholder="Nome / Razão Social"
                className="w-full bg-[#d9d9d9] border border-gray-500 rounded-xl py-3 px-4 text-lg text-black placeholder-black outline-none focus:ring-2 focus:ring-gray-400 shadow-inner"
                required
              />
              <input
                name="cnpj"
                value={formData.cnpj}
                onChange={handleChange}
                type="text"
                placeholder="CNPJ / CPF"
                className="w-full bg-[#d9d9d9] border border-gray-500 rounded-xl py-3 px-4 text-lg text-black placeholder-black outline-none focus:ring-2 focus:ring-gray-400 shadow-inner"
                required
              />
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                placeholder="Email"
                className="w-full bg-[#d9d9d9] border border-gray-500 rounded-xl py-3 px-4 text-lg text-black placeholder-black outline-none focus:ring-2 focus:ring-gray-400 shadow-inner"
                required
              />
              <input
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                type="text"
                placeholder="Telefone"
                className="w-full bg-[#d9d9d9] border border-gray-500 rounded-xl py-3 px-4 text-lg text-black placeholder-black outline-none focus:ring-2 focus:ring-gray-400 shadow-inner"
                required
              />
              <input
                name="address"
                value={formData.address}
                onChange={handleChange}
                type="text"
                placeholder="Endereço Completo"
                className="w-full bg-[#d9d9d9] border border-gray-500 rounded-xl py-3 px-4 text-lg text-black placeholder-black outline-none focus:ring-2 focus:ring-gray-400 shadow-inner"
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
