import { Link } from "react-router-dom";
import { LuMountain } from "react-icons/lu";

export default function EmployeeForm() {
  // Configuração dos campos para o layout de CONSULTA 
  const fields = [
    { label: "Registro", name: "registro", type: "text", value: "12345" },
    { label: "Nome Completo", name: "nome", type: "text", value: "Fulano de Tal" },
    { label: "Telefone", name: "telefone", type: "text", value: "(71) 99999-9999" },
    { label: "Email", name: "email", type: "email", value: "fulano@logifast.com" },
    { label: "Cargo", name: "cargo", type: "text", value: "Motorista" },
  ];

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
            
            {/* Link para Cadastro */}
            <Link to="/admin/colaboradores/novo" className="w-full no-underline">
              <button className="w-full bg-[#f7b94d] hover:bg-[#e6aa3e] text-black font-medium py-3 rounded-full shadow-md transition-transform hover:scale-105 cursor-pointer border-none text-base">
                Cadastro
              </button>
            </Link>

            {/* Link para Edição (ADICIONADO) */}
            <Link to="/admin/colaboradores/edicao" className="w-full no-underline">
              <button className="w-full bg-[#f7b94d] hover:bg-[#e6aa3e] text-black font-medium py-3 rounded-full shadow-md transition-transform hover:scale-105 cursor-pointer border-none text-base">
                Edição
              </button>
            </Link>

            <button className="w-full bg-[#f7b94d] hover:bg-[#e6aa3e] text-black font-medium py-3 rounded-full shadow-md transition-transform hover:scale-105 cursor-pointer border-none text-base">
              Exclusão
            </button>

            {/* Consulta ATIVO */}
            <button className="w-full bg-[#f7b94d] text-black font-medium py-3 rounded-full shadow-md scale-105 cursor-default border-none text-base ring-2 ring-[#e6aa3e]">
              Consulta
            </button>

          </nav>
        </aside>

        {/* --- CONTEÚDO PRINCIPAL (Visualização) --- */}
        <main className="flex-1 p-8 flex justify-center items-center overflow-y-auto">
          <div className="bg-white w-full max-w-4xl rounded-3xl shadow-xl p-10 flex flex-col justify-center min-h-[500px]">
            <h1 className="text-3xl text-center mb-10 font-normal text-black">
              Informações do(a) Funcionário(a)
            </h1>

            <div className="flex flex-col gap-5 w-full px-4 md:px-10">
              {fields.map((field) => (
                <div key={field.name} className="flex flex-col md:flex-row gap-4 items-center">
                  <div className="w-full md:w-1/3 bg-[#d9d9d9] text-black text-lg py-3 px-6 rounded-xl flex items-center shadow-sm font-medium">
                    {field.label}
                  </div>
                  <input
                    type={field.type}
                    defaultValue={field.value}
                    readOnly
                    className="w-full md:w-2/3 border border-gray-500 rounded-xl py-3 px-4 text-lg bg-white outline-none text-gray-700 shadow-inner"
                  />
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}