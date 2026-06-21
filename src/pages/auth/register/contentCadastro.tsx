import { useState } from "react";
import { Link } from "react-router-dom";
import logo2 from "../../../Img/logo2.png";
import { api } from "../../../api/lib/api";
import { AddressFields } from "../../../components/Form/addresField";
import Header from "../../../components/Layout/Header";
import {
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  BuildingOffice2Icon,
  PhoneIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";

// ─── Types ───────────────────────────────────────────────────────────────────

type FormData = {
  nome: string;
  email: string;
  senha: string;
  cnpj: string;
  telefone: string;
};

type Address = {
  country: string;
  state: string;
  city: string;
  street: string;
  number: string;
  zip: string;
  complement: string;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const STEPS = ["Dados da empresa", "Endereço"] as const;

import { InputField, type MaskType } from "../../../components/ui/Input/inputField";

// ─── Input Component ─────────────────────────────────────────────────────────

function Field({
  label,
  icon,
  error,
  maskType,
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  icon?: any;
  error?: string;
  maskType?: MaskType;
  className?: string;
}) {
  return (
    <InputField
      label={label}
      icon={icon}
      error={error}
      maskType={maskType}
      className={className}
      {...(props as any)}
    />
  );
}

// ─── Step Indicator ───────────────────────────────────────────────────────────

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {STEPS.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={label} className="flex items-center gap-2">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all
                  ${done ? "bg-[#384A6C] border-[#384A6C] text-white" : active ? "bg-white border-[#384A6C] text-[#384A6C]" : "bg-white border-gray-200 text-gray-300"}`}
              >
                {done ? <CheckCircleIcon className="h-4 w-4" /> : i + 1}
              </div>
              <span
                className={`text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap
                  ${active ? "text-[#384A6C]" : done ? "text-[#384A6C]" : "text-gray-300"}`}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`h-0.5 w-10 mb-4 rounded-full transition-all ${done ? "bg-[#384A6C]" : "bg-gray-200"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ContentCadastro() {
  const initialForm: FormData = { nome: "", email: "", senha: "", cnpj: "", telefone: "" };
  const initialAddress: Address = { country: "", state: "", city: "", street: "", number: "", zip: "", complement: "" };

  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialForm);
  const [address, setAddress] = useState<Address>(initialAddress);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validateStep1 = () => {
    const e: Partial<FormData> = {};
    if (!formData.nome.trim()) e.nome = "Nome obrigatório";
    if (!formData.email.includes("@")) e.email = "E-mail inválido";
    if (formData.cnpj.replace(/\D/g, "").length < 14) e.cnpj = "CNPJ inválido";
    if (formData.telefone.replace(/\D/g, "").length < 10) e.telefone = "Telefone inválido";
    if (formData.senha.length < 6) e.senha = "Mínimo 6 caracteres";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) setStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post("/company", {
        name: formData.nome,
        email: formData.email,
        password: formData.senha,
        CNPJ: formData.cnpj.replace(/\D/g, ""),
        phone_number: formData.telefone.replace(/\D/g, ""),
        street: address.street || null,
        number: address.number ? Number(address.number) : null,
        complement: address.complement || null,
        city: address.city || null,
        state: address.state || null,
        country: address.country || null,
        zipcode: address.zip || null,
      });
      setSuccess(true);
      setFormData(initialForm);
      setAddress(initialAddress);
      setStep(0);
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Erro inesperado";
      alert("Erro ao cadastrar: " + msg);
    } finally {
      setLoading(false);
    }
  };

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
                Comece agora sua<br />
                <span className="text-[#94C0E0]">gestão logística</span>
              </h1>
              <p className="text-gray-300 text-sm leading-relaxed max-w-xs">
                Cadastre sua empresa e tenha acesso a um sistema completo, simples, rápido e seguro.
              </p>
            </div>

            {/* Diferenciais */}
            <ul className="space-y-3 mt-4">
              {[
                "Rastreamento em tempo real",
                "Gestão de destinatários",
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
          <div className="w-full max-w-lg">

            {success ? (
              /* ── Sucesso ── */
              <div className="bg-white rounded-3xl shadow-lg p-10 flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[#384A6C]/10 flex items-center justify-center">
                  <CheckCircleIcon className="h-8 w-8 text-[#384A6C]" />
                </div>
                <h2 className="text-2xl font-bold text-[#384A6C]">Cadastro realizado!</h2>
                <p className="text-gray-500 text-sm">
                  Sua empresa foi cadastrada com sucesso. Agora faça login para continuar.
                </p>
                <Link
                  to="/login"
                  className="mt-4 inline-flex items-center gap-2 bg-[#384A6C] text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#2f3e5c] transition"
                >
                  Ir para o login <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              /* ── Formulário ── */
              <div className="bg-white rounded-3xl shadow-lg p-8 md:p-10">
                <div className="mb-6">
                  <h2 className="text-2xl font-extrabold text-[#384A6C] tracking-tight">Criar conta</h2>
                  <p className="text-sm text-gray-400 mt-1">
                    {step === 0 ? "Preencha os dados da sua empresa." : "Informe o endereço (opcional)."}
                  </p>
                </div>

                <StepIndicator current={step} />

                <form onSubmit={step === 0 ? (e) => { e.preventDefault(); handleNext(); } : handleSubmit} className="flex flex-col gap-4">

                  {step === 0 && (
                    <>
                      <Field
                        label="Nome da empresa"
                        name="nome"
                        icon={UserIcon}
                        placeholder="Razão social ou nome fantasia"
                        value={formData.nome}
                        onChange={handleChange}
                        error={errors.nome}
                      />
                      <Field
                        label="E-mail"
                        name="email"
                        type="email"
                        icon={EnvelopeIcon}
                        placeholder="contato@empresa.com.br"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <Field
                          label="CNPJ"
                          name="cnpj"
                          maskType="cnpj"
                          icon={BuildingOffice2Icon}
                          placeholder="00.000.000/0001-00"
                          value={formData.cnpj}
                          onChange={handleChange}
                          error={errors.cnpj}
                        />
                        <Field
                          label="Telefone"
                          name="telefone"
                          maskType="phone"
                          icon={PhoneIcon}
                          placeholder="(00) 00000-0000"
                          value={formData.telefone}
                          onChange={handleChange}
                          error={errors.telefone}
                        />
                      </div>
                      <Field
                        label="Senha"
                        name="senha"
                        type="password"
                        icon={LockClosedIcon}
                        placeholder="Mínimo 6 caracteres"
                        value={formData.senha}
                        onChange={handleChange}
                        error={errors.senha}
                      />

                      <button
                        type="submit"
                        className="mt-2 w-full bg-[#384A6C] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#2f3e5c] active:scale-95 transition-all flex items-center justify-center gap-2"
                      >
                        Próximo passo <ArrowRightIcon className="h-4 w-4" />
                      </button>
                    </>
                  )}

                  {step === 1 && (
                    <>
                      <div className="flex items-center gap-2 mb-1 text-[#384A6C]">
                        <MapPinIcon className="h-5 w-5" />
                        <span className="text-sm font-semibold">Endereço da empresa</span>
                      </div>
                      <AddressFields address={address} setAddress={setAddress} />

                      <div className="flex gap-3 mt-2">
                        <button
                          type="button"
                          onClick={() => setStep(0)}
                          className="flex-1 border border-[#384A6C] text-[#384A6C] py-3 rounded-xl font-bold text-sm hover:bg-[#384A6C]/5 transition"
                        >
                          Voltar
                        </button>
                        <button
                          type="submit"
                          disabled={loading}
                          className="flex-1 bg-[#384A6C] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#2f3e5c] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                        >
                          {loading ? (
                            <>
                              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                              </svg>
                              Cadastrando...
                            </>
                          ) : (
                            <>Finalizar cadastro</>
                          )}
                        </button>
                      </div>
                    </>
                  )}
                </form>

                <p className="text-center text-sm text-gray-400 mt-6">
                  Já possui conta?{" "}
                  <Link to="/login" className="text-[#384A6C] font-semibold hover:underline underline-offset-4">
                    Entrar
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}