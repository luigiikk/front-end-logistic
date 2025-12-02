// Correção na linha 1: Separamos o useState (valor) do FormEvent (tipo)
import { useState } from "react";
import type { FormEvent } from "react"; 

import { Link } from "react-router-dom";
import { LuSearch, LuMountain } from "react-icons/lu";

export default function EmployeeEdit() {
  // Estado para controlar a busca
  const [searchTerm, setSearchTerm] = useState("");
  // Estado para armazenar o resultado da busca (simulado)
  const [searchResult, setSearchResult] = useState<string | null>(null);

  // Função disparada ao enviar o formulário de busca
  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    // Simulação: Se houver texto, mostra o resultado fixo
    if (searchTerm.trim() !== "") {
      setSearchResult("Cauane Galdino, 001");
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-gray-200 font-sans">
      
      {/* --- CABEÇALHO --- */}
      <header className="flex justify-between items-center px-8 py-4 bg-white shadow-sm z-10">
        <Link 
          to="/admin/colaboradores" 
          className="bg-[#f7b94d] hover:bg-[#e6aa3e] text-black px-8 py-2 rounded-full font-medium transition-colors shadow-sm cursor-pointer no-underline flex items-center justify-center"
        >
          Voltar
        </Link>

        <div className="flex items-center gap-3">
          <div className="border-2 border-black rounded-full p-1">
            <LuMountain className="w-6 h-6 text-black" />
          </div>
          <span className="font-bold text-lg tracking-wide text-black">EMPRESA</span>
        </div>

        <button className="bg-[#f7b94d] hover:bg-[#e6aa3e] text-black px-8 py-2 rounded-full font-medium transition-colors shadow-sm cursor-pointer">
          Sair
        </button>
      </header>

      {/* --- CORPO DA PÁGINA --- */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* --- BARRA LATERAL --- */}
        <aside className="w-1/4 bg-[#bfdbf7] flex flex-col items-center py-10 gap-8 min-w-[250px]">
          <h2 className="text-xl font-bold text-center px-4 leading-tight text-black">
            Painel Funcionário – <br /> LogiFast
          </h2>

          <nav className="flex flex-col gap-6 w-full px-12">
            
            {/* Link para CADASTRO */}
            <Link to="/admin/colaboradores/novo" className="w-full no-underline">
              <button className="w-full bg-[#f7b94d] hover:bg-[#e6aa3e] text-black font-medium py-3 rounded-full shadow-md transition-transform hover:scale-105 cursor-pointer border-none text-base">
                Cadastro
              </button>
            </Link>

            {/* Botão EDIÇÃO (Ativo - sem link) */}
            <button className="w-full bg-[#f7b94d] text-black font-medium py-3 rounded-full shadow-md scale-105 cursor-default border-none text-base ring-2 ring-[#e6aa3e]">
              Edição
            </button>

            {/* Botão EXCLUSÃO */}
            <button className="w-full bg-[#f7b94d] hover:bg-[#e6aa3e] text-black font-medium py-3 rounded-full shadow-md transition-transform hover:scale-105 cursor-pointer border-none text-base">
              Exclusão
            </button>

            {/* Link para CONSULTA */}
            <Link to="/admin/colaboradores/consulta" className="w-full no-underline">
              <button className="w-full bg-[#f7b94d] hover:bg-[#e6aa3e] text-black font-medium py-3 rounded-full shadow-md transition-transform hover:scale-105 cursor-pointer border-none text-base">
                Consulta
              </button>
            </Link>

          </nav>
        </aside>

        {/* --- CONTEÚDO PRINCIPAL --- */}
        <main className="flex-1 p-8 flex justify-center items-center overflow-y-auto">
          
          {/* Card Branco */}
          <div className="bg-white w-full max-w-4xl rounded-3xl shadow-xl p-12 flex flex-col min-h-[600px]">
            
            <p className="text-xl text-black text-center mb-12 px-8 leading-relaxed">
              Para editar um funcionário, insira o nome ou o registro no campo de busca, 
              selecione o funcionário desejado e, em seguida, altere as informações necessárias.
            </p>

            {/* Formulário de Busca */}
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row justify-center items-center gap-4 mb-12">
              <input 
                type="text" 
                placeholder="Insira aqui o nome ou registro" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-3/5 border border-black rounded-lg py-3 px-4 text-lg text-black outline-none focus:ring-1 focus:ring-black"
              />
              <button 
                type="submit"
                className="flex items-center gap-2 border border-black rounded-lg px-6 py-3 bg-white hover:bg-gray-100 text-black cursor-pointer shadow-sm transition-colors"
              >
                <LuSearch className="w-5 h-5" />
                <span className="text-lg font-medium">Pesquisar</span>
              </button>
            </form>

            {/* Resultado da Busca (Aparece só depois de pesquisar) */}
            {searchResult && (
              <div className="w-full flex flex-col items-center gap-8 animate-pulse-once">
                {/* Barra Cinza com o Resultado */}
                <div className="w-full md:w-4/5 bg-[#d9d9d9] py-4 px-6 text-xl text-black rounded-sm shadow-sm">
                  {searchResult}
                </div>

                {/* Botão Editar (Ainda sem ação lógica definida, apenas visual) */}
                <button 
                  className="bg-[#cfcfcf] border border-black text-black font-bold py-3 px-16 rounded-xl hover:bg-[#b0b0b0] transition-colors shadow-md cursor-pointer text-lg"
                  onClick={() => alert("Funcionalidade de edição será implementada aqui")}
                >
                  Editar
                </button>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  )
}