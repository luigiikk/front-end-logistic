import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
// import { useNavigate } from "react-router-dom";

export default function FormCliente() {
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");

  // const navigate = useNavigate();

  const { handleAuth, error, loading } =
    useAuth<{ id: number; name: string; CPF: string }>("client");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      await handleAuth(cpf, password);
      // navigate("/cliente");
    } catch {}
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <input
        type="text"
        placeholder="Digite seu CPF"
        value={cpf}
        onChange={(e) => setCpf(e.target.value)}
        className="border border-gray-400 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2f446a]"
      />

      <input
        type="password"
        placeholder="Digite sua senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border border-gray-400 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2f446a]"
      />

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="bg-[#2f446a] text-white py-2 rounded hover:bg-[#24385a] disabled:opacity-50"
      >
        {loading ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
