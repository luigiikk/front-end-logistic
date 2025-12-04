import { useState } from "react";
import { Link } from "react-router-dom";
import logo2 from "../../../Img/logo2.png";
import ButtonForm from "../../../components/ui/Button/buttonForm";
import InputField from "../../../components/ui/Input/inputField";
import { api } from "../../../api/lib/api"

export default function ContentCadastro() {
  const initialForm = {
    nome: "",
    email: "",
    senha: "",
    cnpj: "",
    telefone: "",
  };

  const [formData, setFormData] = useState(initialForm);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      await api.post("/company", {
        name: formData.nome,
        email: formData.email,
        password: formData.senha,
        CNPJ: formData.cnpj,
        phone_number: formData.telefone,
      });

      alert("Cadastro realizado com sucesso! Agora faça login.");
      setFormData(initialForm);
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err?.message || "Erro inesperado";
      alert("Erro ao cadastrar: " + message);
    }
  }

  return (
    <main className="flex flex-col md:flex-row w-full h-[calc(100vh-4rem)]">
      {/* Lado esquerdo */}
      <div className="bg-[#384A6C] text-white flex flex-col justify-center items-center md:items-start px-6 md:px-12 w-full md:w-2/5">
        <img
          src={logo2}
          alt="LogiFast"
          className="w-100 mb-6 relative -top-20"
        />
        <p className="text-2xl leading-relaxed max-w-md">
          Cadastre-se agora e tenha acesso a um sistema completo de gestão
          logística, simples, rápido e seguro.
        </p>
      </div>

      {/* Lado direito */}
      <div className="bg-[#94C0E0] flex justify-center items-center w-full md:w-3/5 px-6 md:px-12">
        <div className="bg-white rounded-2xl shadow-md w-full max-w-md p-8">
          <h2 className="text-center text-xl font-semibold mb-6">CADASTRO</h2>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <InputField
              label="Nome completo"
              name="nome"
              placeholder="Digite seu nome"
              value={formData.nome}
              onChange={handleChange}
            />

            <InputField
              label="E-mail"
              type="email"
              name="email"
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
              type="password"
              name="senha"
              placeholder="Crie uma senha"
              value={formData.senha}
              onChange={handleChange}
            />

            <ButtonForm titulo="Cadastre-se" />
          </form>

          <p className="text-center text-sm mt-4">
            Já possui uma conta?{" "}
            <Link
              to="/login"
              className="text-[#2f446a] font-medium hover:underline"
            >
              Entre
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
