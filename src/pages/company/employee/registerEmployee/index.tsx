import { Link } from "react-router-dom";
import { LuMountain } from "react-icons/lu";

export default function EmployeeRegistration() {
  return (
    <div className="flex flex-col h-screen w-full bg-gray-200 font-sans">
      {/* HEADER */}
      <header className="flex justify-between items-center px-8 py-4 bg-white shadow-sm z-10">
        <Link
          to="/company/employee"
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

        <Link
          to="/company"
          className="bg-[#f7b94d] hover:bg-[#e6aa3e] text-black px-8 py-2 rounded-full font-medium transition-colors shadow-sm cursor-pointer"
        >
          Sair
        </Link>
      </header>

      {/* LAYOUT */}
      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <aside className="w-1/4 bg-[#bfdbf7] flex flex-col items-center py-10 gap-8 min-w-[250px]">
          <h2 className="text-xl font-bold text-center px-4 leading-tight text-black">
            Painel Funcionário – <br /> LogiFast
          </h2>

          <nav className="flex flex-col gap-6 w-full px-12">
            <button className="w-full bg-[#f7b94d] text-black font-medium py-3 rounded-full shadow-md scale-105 cursor-default border-none text-base ring-2 ring-[#e6aa3e]">
              Cadastro
            </button>

            <Link to="/company/employee/update" className="w-full no-underline">
              <button className="w-full bg-[#f7b94d] hover:bg-[#e6aa3e] text-black font-medium py-3 rounded-full shadow-md transition-transform hover:scale-105 cursor-pointer border-none text-base">
                Edição
              </button>
            </Link>

            <button className="w-full bg-[#f7b94d] hover:bg-[#e6aa3e] text-black font-medium py-3 rounded-full shadow-md transition-transform hover:scale-105 cursor-pointer border-none text-base">
              Exclusão
            </button>

            <Link to="/company/employee/get" className="w-full no-underline">
              <button className="w-full bg-[#f7b94d] hover:bg-[#e6aa3e] text-black font-medium py-3 rounded-full shadow-md transition-transform hover:scale-105 cursor-pointer border-none text-base">
                Consulta
              </button>
            </Link>
          </nav>
        </aside>

        {/* MAIN */}
        <main className="flex-1 p-8 flex justify-center items-center overflow-y-auto">
          <div className="bg-white w-full max-w-4xl rounded-3xl shadow-xl p-10 flex flex-col justify-center min-h-[600px]">
            <h1 className="text-3xl text-center mb-8 font-semibold text-black">
              Cadastro de Funcionários
            </h1>

            <form className="flex flex-col gap-6 w-full px-4 md:px-12">
              {/* ------------------- DADOS DO FUNCIONÁRIO ------------------- */}
              <h2 className="text-xl font-bold text-gray-700 mt-4">
                Dados do Funcionário
              </h2>

              <input
                type="text"
                placeholder="Nome Completo"
                className="form-input"
              />

              <input
                type="text"
                placeholder="Telefone"
                className="form-input"
              />

              <input
                type="email"
                placeholder="Email"
                className="form-input"
              />

              <select
                className="form-input cursor-pointer"
                defaultValue=""
              >
                <option value="" disabled>
                  Selecione o cargo
                </option>
                <option value="1">Motorista</option>
                <option value="2">Operador Logístico</option>
                <option value="3">Administrativo</option>
              </select>

              <input
                type="password"
                placeholder="Senha"
                className="form-input"
              />

              {/* ------------------- ENDEREÇO ------------------- */}
              <h2 className="text-xl font-bold text-gray-700 mt-6">
                Endereço
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="País" className="form-input" />
                <input type="text" placeholder="Estado" className="form-input" />
              </div>

              <input type="text" placeholder="Cidade" className="form-input" />

              <input type="text" placeholder="Rua" className="form-input" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="number" placeholder="Número" className="form-input" />
                <input type="text" placeholder="CEP" className="form-input" />
              </div>

              <input
                type="text"
                placeholder="Complemento (opcional)"
                className="form-input"
              />

              {/* BOTÃO */}
              <div className="flex justify-center mt-6">
                <button
                  type="submit"
                  className="bg-[#f7b94d] border border-gray-600 text-black font-bold py-3 px-16 rounded-full hover:bg-[#e6aa3e] transition-colors shadow-md cursor-pointer"
                >
                  Cadastrar
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
