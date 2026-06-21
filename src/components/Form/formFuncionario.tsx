import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { InputField } from "../ui/Input/inputField";

export default function FormFuncionario() {
  const [enrollment, setEnrollment] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const { handleAuth, error, loading } = useAuth<{ id: number; name: string; enrollment: string }>("employee");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const data = await handleAuth(enrollment, password);
      console.log("Funcionário logado:", data);
      navigate("/employee")
    } catch {}
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <InputField
        label="Matrícula"
        placeholder="Digite a sua matrícula"
        value={enrollment}
        onChange={(e) => setEnrollment(e.target.value)}
        required
      />
      <InputField
        label="Senha"
        type="password"
        placeholder="Digite sua senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="bg-[#2f446a] text-white py-2.5 rounded-xl hover:bg-[#24385a] font-bold text-sm disabled:opacity-50 transition-all active:scale-95 cursor-pointer"
      >
        {loading ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}

