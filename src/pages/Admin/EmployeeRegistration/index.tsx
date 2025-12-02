import { Link } from "react-router-dom";
import { LuMountain } from "react-icons/lu";
import {api} from "../../../api/lib/api"
import { useState } from "react";

export default function EmployeeRegistration() {
 type FormData = {
  name: string;
  employee_roles: number[];
  company_id: string;
  email: string;
  phone_number: string;
  password: string;
};

const [formData, setFormData] = useState<FormData>({
  name: "",
  employee_roles: [],
  company_id: "",
  email: "",
  phone_number: "",
  password: "",
});

function selectRoles(roleId: number) {
  setFormData(prev => ({
    ...prev,
    employee_roles: [roleId]
  }));
}

const getTeste = (roleId: number) => {
    setFormData(prev => ({
    ...prev,
    employee_roles: [roleId]
  }));
}

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api.post("/company", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        company_id: formData.company_id,
        phone_number: formData.phone_number,
      });
      alert("Cadastro realizado com sucesso! Agora faça login.");
      setFormData({ name: "", email: "", password: "", employee_roles: [], phone_number: "",company_id: "", });
    } catch (err: any) {
      alert("Erro ao cadastrar: " + (err?.response?.data?.message || err?.message));
    }
  }
  return (
    <div className="flex flex-col h-screen w-full bg-gray-200 font-sans">
      
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

      <div className="flex flex-1 overflow-hidden">
        
        <aside className="w-1/4 bg-[#bfdbf7] flex flex-col items-center py-10 gap-8 min-w-[250px]">
          <h2 className="text-xl font-bold text-center px-4 leading-tight text-black">
            Painel Funcionário – <br /> LogiFast
          </h2>

          <nav className="flex flex-col gap-6 w-full px-12">
            
            {/* Cadastro ATIVO (Sem link ou link para si mesmo) */}
            <button className="w-full bg-[#f7b94d] text-black font-medium py-3 rounded-full shadow-md scale-105 cursor-default border-none text-base ring-2 ring-[#e6aa3e]">
              Cadastro
            </button>

            {/* Link para Edição (CORRIGIDO) */}
            <Link to="/admin/colaboradores/edicao" className="w-full no-underline">
              <button className="w-full bg-[#f7b94d] hover:bg-[#e6aa3e] text-black font-medium py-3 rounded-full shadow-md transition-transform hover:scale-105 cursor-pointer border-none text-base">
                Edição
              </button>
            </Link>

            <button className="w-full bg-[#f7b94d] hover:bg-[#e6aa3e] text-black font-medium py-3 rounded-full shadow-md transition-transform hover:scale-105 cursor-pointer border-none text-base">
              Exclusão
            </button>

            <Link to="/admin/colaboradores/consulta" className="w-full no-underline">
              <button className="w-full bg-[#f7b94d] hover:bg-[#e6aa3e] text-black font-medium py-3 rounded-full shadow-md transition-transform hover:scale-105 cursor-pointer border-none text-base">
                Consulta
              </button>
            </Link>

          </nav>
        </aside>

        <main className="flex-1 p-8 flex justify-center items-center overflow-y-auto">
          <div className="bg-white w-full max-w-4xl rounded-3xl shadow-xl p-10 flex flex-col justify-center min-h-[600px]">
            <h1 className="text-3xl text-center mb-8 font-normal text-black">
              Cadastro de Funcionários
            </h1>

            <form className="flex flex-col gap-4 w-full px-4 md:px-12">
              <input name="name"value={formData.name} onChange={handleChange} type="text" placeholder="Nome Completo" className="w-full bg-[#d9d9d9] border border-gray-500 rounded-xl py-3 px-4 text-lg text-black placeholder-black outline-none focus:ring-2 focus:ring-gray-400 shadow-inner" />
              <input name="phone_number" value={formData.phone_number} onChange={handleChange} type="text" placeholder="Telefone" className="w-full bg-[#d9d9d9] border border-gray-500 rounded-xl py-3 px-4 text-lg text-black placeholder-black outline-none focus:ring-2 focus:ring-gray-400 shadow-inner" />
              <input name="email" value={formData.email} onChange={handleChange} type="email" placeholder="Email" className="w-full bg-[#d9d9d9] border border-gray-500 rounded-xl py-3 px-4 text-lg text-black placeholder-black outline-none focus:ring-2 focus:ring-gray-400 shadow-inner" />
              
              <select name="employeeRoles" onChange={(e) => selectRoles(Number(e.target.value))} className="w-full bg-[#d9d9d9] border border-gray-500 rounded-xl py-3 px-4 text-lg text-black outline-none focus:ring-2 focus:ring-gray-400 appearance-none shadow-inner cursor-pointer" defaultValue="">
                <option value="" disabled>Selecione o cargo</option>
                <option value="1">Motorista</option>
                <option value="2">Operador Logístico</option>
                <option value="3">Administrativo</option>
              </select>

              <input name="password" value={formData.password} onChange={handleChange} type="password" placeholder="Senha" className="w-full bg-[#d9d9d9] border border-gray-500 rounded-xl py-3 px-4 text-lg text-black placeholder-black outline-none focus:ring-2 focus:ring-gray-400 shadow-inner" />

              <div className="flex justify-center mt-6">
                <button onClick={handleSubmit} type="submit" className="bg-[#cfcfcf] border border-gray-600 text-black font-bold py-3 px-12 rounded-xl hover:bg-[#b0b0b0] transition-colors shadow-md cursor-pointer">
                  Cadastre
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}