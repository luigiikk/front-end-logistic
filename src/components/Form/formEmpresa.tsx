import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { InputField } from "../ui/Input/inputField";

export default function FormEmpresa() {
  const [CNPJ, setCnpj] = useState("");
  const [password, setPassword] = useState("");
  
  const navigate = useNavigate();

  const { handleAuth, error, loading } = useAuth<{ id: number; name: string; CNPJ: string }>("company");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      // Strip formatting before sending to api
      await handleAuth(CNPJ.replace(/\D/g, ""), password);
      navigate("/company")
    } catch {}
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <InputField
        label="CNPJ"
        placeholder="Digite seu CNPJ"
        maskType="cnpj"
        value={CNPJ}
        onChange={(e) => setCnpj(e.target.value)}
      />
      <InputField
        label="Senha"
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
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
