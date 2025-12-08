import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

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
      <input
        type="text"
        placeholder="Digite a sua matrícula"
        value={enrollment}
        onChange={(e) => setEnrollment(e.target.value)}
        className="border border-gray-400 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2f446a]"
        required
      />
      <input
        type="password"
        placeholder="Digite sua senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border border-gray-400 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2f446a]"
        required
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="bg-[#2f446a] text-white py-2 rounded hover:bg-[#24385a]"
      >
        {loading ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}

