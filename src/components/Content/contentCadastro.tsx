import logo2 from "../../img/logo2.png"
import ButtonForm from "../Button/buttonForm";
import { Link } from "react-router-dom";
import { useState } from "react";
import InputField from "../Input/inputField";

function ContentCadastro(){
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    cnpj: "",
    telefone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


    return(
    <main className="flex flex-col md:flex-row w-full h-[calc(100vh-4rem)] ">
      {/* Lado esquerdo */}
      <div className="bg-[#384A6C] text-white flex flex-col justify-center items-center md:items-start px-6 md:px-12 w-full md:w-2/5">
        <img src={logo2} alt="LogiFast" className="w-100 mb-6 relative -top-20" />
        <p className="text-2xl justify-center leading-relaxed max-w-md">
          Cadastre-se agora e tenha acesso a um sistema completo de gestão logística, simples, rápido e seguro.
        </p>
      </div>

      {/* Lado direito */}
      <div className="bg-[#94C0E0] flex justify-center items-center w-full md:w-2/2 px-6 md:px-12 ">
        <div className="bg-white rounded-2xl shadow-md w-full max-w-md p-8 relative">
          <h2 className="text-center text-xl font-semibold mb-6">CADASTRO</h2>

          {/* Campos */}
          <form className="flex flex-col gap-4">
            <InputField
            label="Nome completo"
            name="nome"
            placeholder="Digite seu nome completo"
            value={formData.nome}
            onChange={handleChange}
          />
          <InputField
            label="E-mail"
            name="email"
            type="email"
            placeholder="Digite seu e-mail"
            value={formData.email}
            onChange={handleChange}
          />
          <InputField
            label="CNPJ"
            name="cnpj"
            placeholder="Digite seu CNPJ"
            value={formData.cnpj}
            onChange={handleChange}
          />
          <InputField
            label="Telefone"
            name="telefone"
            placeholder="(00) 00000-0000"
            value={formData.telefone}
            onChange={handleChange}
          />
          <InputField
            label="Senha"
            name="senha"
            type="password"
            placeholder="Crie uma senha segura"
            value={formData.senha}
            onChange={handleChange}
          />
    

            <ButtonForm titulo={"Cadastre-se"}/>
            
          </form>

          {/* Cadastro */}
          <p className="text-center text-sm mt-4">
            Já possui uma conta?{" "}
            <Link to="/login" className="text-[#2f446a] font-medium hover:underline">
              Entre
            </Link>
          </p>
        </div>
      </div>
    </main>
    )
}


export default ContentCadastro;