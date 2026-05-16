import logo2 from "../../../Img/logo2.png";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/Layout/Header";
import type { UserType } from "../../../hooks/useAuth";
import {
  LockClosedIcon,
  ArrowRightIcon,
  BuildingOffice2Icon,
  IdentificationIcon,
  UserIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { useToast } from "../../../components/Toast/ToastContent";

// ─── Tipos de usuário ────────────────────────────────────────────────────────

type UserTab = {
  type: UserType;
  label: string;
  icon: React.ElementType;
  placeholder: string;
  mask?: (v: string) => string;
};

const TABS: UserTab[] = [
  {
    type: "employee",
    label: "Funcionário",
    icon: UserIcon,
    placeholder: "Digite sua matrícula",
  },
  {
    type: "company",
    label: "Empresa",
    icon: BuildingOffice2Icon,
    placeholder: "00.000.000/0001-00",
    mask: (v: string) =>
      v
        .replace(/\D/g, "")
        .slice(0, 14)
        .replace(/(\d{2})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1/$2")
        .replace(/(\d{4})(\d{1,2})$/, "$1-$2"),
  },
  {
    type: "client",
    label: "Cliente",
    icon: IdentificationIcon,
    placeholder: "000.000.000-00",
    mask: (v: string) =>
      v
        .replace(/\D/g, "")
        .slice(0, 11)
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2"),
  },
];

const NAVIGATE_MAP: Record<UserType, string> = {
  employee: "/employee",
  company: "/company",
  client: "/",
};

// ─── Input reutilizável ──────────────────────────────────────────────────────

function Field({
  label,
  icon: Icon,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  icon?: React.ElementType;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-[#384A6C] uppercase tracking-widest">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94C0E0]">
            <Icon className="h-4 w-4" />
          </span>
        )}
        <input
          {...props}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-300 bg-white
            focus:outline-none focus:ring-2 focus:ring-[#94C0E0] focus:border-transparent transition-all"
        />
      </div>
    </div>
  );
}

// ─── Formulário unificado ────────────────────────────────────────────────────

function LoginForm({ tab }: { tab: UserTab }) {
  const { toast } = useToast();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { handleAuth, error, loading } = useAuth<any>(tab.type);

  const handleIdentifierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = tab.mask ? tab.mask(e.target.value) : e.target.value;
    setIdentifier(val);
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const raw = tab.mask ? identifier.replace(/\D/g, "") : identifier;
      await handleAuth(raw, password);
      toast("Login realizado com sucesso!", "success");
      navigate(NAVIGATE_MAP[tab.type]);
    } catch (err: any) {
      const message = err.response?.data?.message || "Erro ao fazer login.";
      toast(message, "error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <Field
        label={tab.type === "employee" ? "Matrícula" : tab.type === "company" ? "CNPJ" : "CPF"}
        icon={tab.icon}
        placeholder={tab.placeholder}
        value={identifier}
        onChange={handleIdentifierChange}
        required
      />
      <Field
        label="Senha"
        icon={LockClosedIcon}
        type="password"
        placeholder="Digite sua senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      
      <button
        type="submit"
        disabled={loading}
        className="mt-1 w-full bg-[#384A6C] text-white py-3 rounded-xl font-bold text-sm
          hover:bg-[#2f3e5c] active:scale-95 transition-all flex items-center justify-center gap-2
          disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Entrando...
          </>
        ) : (
          <>
            Entrar <ArrowRightIcon className="h-4 w-4" />
          </>
        )}
      </button>
    </form>
  );
}

// ─── Página principal ────────────────────────────────────────────────────────

export default function ContentLogin() {
  const [activeType, setActiveType] = useState<UserType>("company");
  const activeTab = TABS.find((t) => t.type === activeType)!;

  return (
    <>
      <Header />

      <main className="flex flex-col md:flex-row w-full min-h-[calc(100vh-4rem)]">
        {/* ── Painel esquerdo ── */}
        <div className="relative bg-[#384A6C] text-white flex flex-col justify-between px-10 py-14 w-full md:w-2/5 overflow-hidden">
          {/* Círculos decorativos */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-20 -left-20 w-72 h-72 rounded-full opacity-10"
            style={{ background: "#94C0E0" }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-16 -right-16 w-56 h-56 rounded-full opacity-10"
            style={{ background: "#94C0E0" }}
          />

          <div className="relative z-10 flex flex-col gap-8">
            <img src={logo2} alt="LogiFast" className="w-40" />

            <div className="space-y-4 mt-4">
              <h1 className="text-3xl font-extrabold leading-tight tracking-tight">
                Bem-vindo de<br />
                <span className="text-[#94C0E0]">volta!</span>
              </h1>
              <p className="text-gray-300 text-sm leading-relaxed max-w-xs">
                Entre com seus dados e acesse todas as soluções da LogiFast em um só lugar.
              </p>
            </div>

            <ul className="space-y-3 mt-4">
              {[
                "Rastreamento em tempo real",
                "Gestão de pedidos e destinatários",
                "Relatórios e histórico completo",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-gray-200">
                  <CheckCircleIcon className="h-4 w-4 text-[#94C0E0] shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <p className="relative z-10 text-xs text-gray-400 mt-12">
            © {new Date().getFullYear()} LogiFast. Todos os direitos reservados.
          </p>
        </div>

        {/* ── Painel direito ── */}
        <div className="bg-[#EEF5FB] flex justify-center items-center w-full md:w-3/5 px-6 py-12">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-3xl shadow-lg p-8 md:p-10">

              <div className="mb-7">
                <h2 className="text-2xl font-extrabold text-[#384A6C] tracking-tight">Entrar</h2>
                <p className="text-sm text-gray-400 mt-1">Selecione seu tipo de acesso.</p>
              </div>

              {/* Seletor de tipo */}
              <div className="flex gap-2 mb-8 bg-[#EEF5FB] p-1 rounded-2xl">
                {TABS.map(({ type, label, icon: Icon }) => {
                  const active = activeType === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setActiveType(type)}
                      className={`flex-1 flex flex-col items-center gap-1 py-2.5 px-2 rounded-xl text-xs font-bold transition-all
                        ${active
                          ? "bg-[#384A6C] text-white shadow-sm"
                          : "text-gray-400 hover:text-[#384A6C]"
                        }`}
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </button>
                  );
                })}
              </div>

              {/* Formulário — key força remount ao trocar aba, limpando estado */}
              <LoginForm key={activeType} tab={activeTab} />

              <div className="flex items-center justify-between mt-4">
                <a
                  href="#"
                  className="text-xs text-gray-400 hover:text-[#384A6C] hover:underline underline-offset-4 transition"
                >
                  Esqueceu sua senha?
                </a>
              </div>

              <p className="text-center text-sm text-gray-400 mt-6">
                Não tem uma conta?{" "}
                <Link
                  to="/cadastro"
                  className="text-[#384A6C] font-semibold hover:underline underline-offset-4"
                >
                  Cadastre-se
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}