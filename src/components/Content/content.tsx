import logo2 from "../../img/logo2.png"
import ButtonUser from "../Button/buttonUser";
import { Link } from "react-router-dom";
import { useState } from "react";
import FormFuncionario from "../Form/formFuncionario"
import FormEmpresa from "../Form/formEmpresa";
import FormCliente from "../Form/formCliente";
import type { UserType } from "../../hooks/useAuth";

const type: UserType[] = ["employee", "company", "client"];

export default function Content() {
  const [tipoUsuario, setTipoUsuario] = useState<UserType>("company");

  const renderForm = () => {
    switch (tipoUsuario) {
      case "employee":
        return <FormFuncionario />;
      case "company":
        return <FormEmpresa />;
      case "client":
        return <FormCliente />;
    }
  };

  return (
    <main className="flex flex-col md:flex-row w-full h-[calc(100vh-4rem)]">
      {/* Lado esquerdo */}
      <div className="bg-[#384A6C] text-white flex flex-col justify-center 
          items-center md:items-start px-6 md:px-12 w-full md:w-2/5">
        
        <img src={logo2} alt="LogiFast" className="w-100 mb-6 relative -top-20" />

        <p className="text-2xl leading-relaxed max-w-md text-center md:text-left">
          Entre com seus dados e tenha acesso a todas as soluções em um só lugar.
        </p>
      </div>

      {/* Lado direito */}
      <div className="bg-[#94C0E0] flex justify-center items-center w-full md:w-3/5 px-6 md:px-12">
        <div className="bg-white rounded-2xl shadow-md w-full max-w-md p-8">
          
          <h2 className="text-center text-xl font-semibold mb-6">LOGIN</h2>

          {/* Botões */}
          <div className="flex justify-center gap-3 mb-8">
            {type.map((type) => (
              <ButtonUser
                key={ type}
                funcao={type}
                selecionado={tipoUsuario === type}
                onClick={() => setTipoUsuario(type)}
              />
            ))}
          </div>

          {renderForm()}

          <div className="w-full text-right mt-2">
            <a href="#" className="text-sm text-black hover:underline">
              Esqueceu sua senha?
            </a>
          </div>

          <p className="text-center text-sm mt-3">
            Não é uma empresa parceira?{" "}
            <Link to="/cadastro" className="text-[#2f446a] font-medium hover:underline">
              Cadastre-se
            </Link>
          </p>

        </div>
      </div>
    </main>
  );
}