import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function FormEmpresa() {
  const [CNPJ, setCnpj] = useState("");
  const [password, setPassword] = useState("");
  
  const navigate = useNavigate();

  const { handleAuth, error, loading } = useAuth<{ id: number; name: string; CNPJ: string }>("company");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const data = await handleAuth(CNPJ, password);
      navigate("/admin")
    } catch {}
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <input
        type="text"
        placeholder="Digite seu CNPJ"
        value={CNPJ}
        onChange={(e) => setCnpj(e.target.value)}
        className="border p-2 rounded"
      />
      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 rounded"
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
