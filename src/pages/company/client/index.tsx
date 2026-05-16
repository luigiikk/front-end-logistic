import { useEffect, useState } from "react";
import { api } from "../../../api/lib/api";
import { GenericPanelLayout } from "../../../components/Layout/company/layoutOption";
import {
  LuSearch,
  LuTrash2,
  LuPencil,
  LuPlus,
  LuX,
  LuBuilding2,
  LuMail,
  LuPhone,
  LuMapPin,
  LuUser,
} from "react-icons/lu";
import { useToast } from "../../../components/Toast/ToastContent";

// ─── Types ────────────────────────────────────────────────────────────────────

type Client = {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  password?: string;
  CNPJ: string;
  street?: string | null;
  number?: number | null;
  complement?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  zipcode?: string | null;
};

const EMPTY_CLIENT = {
  id: 0,
  name: "",
  email: "",
  phone_number: "",
  password: "",
  CNPJ: "",
  street: "",
  number: null as number | null,
  complement: "",
  city: "",
  state: "",
  country: "",
  zipcode: "",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function maskCNPJ(v: string) {
  return v
    .replace(/\D/g, "")
    .slice(0, 14)
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
}

function maskPhone(v: string) {
  return v
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d{1,4})$/, "$1-$2");
}

function maskZip(v: string) {
  return v
    .replace(/\D/g, "")
    .slice(0, 8)
    .replace(/(\d{5})(\d{1,3})$/, "$1-$2");
}

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

// ─── Field Component ──────────────────────────────────────────────────────────

function Field({
  label,
  icon: Icon,
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  icon?: React.ElementType;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label className="text-[10px] font-bold text-[#384A6C] uppercase tracking-widest">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94C0E0]">
            <Icon size={14} />
          </span>
        )}
        <input
          {...props}
          className={`w-full ${Icon ? "pl-8" : "pl-3"} pr-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-300 bg-white
            focus:outline-none focus:ring-2 focus:ring-[#94C0E0] focus:border-transparent transition-all`}
        />
      </div>
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────

type ModalProps = {
  title: string;
  data: typeof EMPTY_CLIENT | Client;
  onChange: (key: string, value: string | number | null) => void;
  onConfirm: () => void;
  onClose: () => void;
  confirmLabel: string;
  confirmClass: string;
  loading?: boolean;
};

function ClientModal({
  title,
  data,
  onChange,
  onConfirm,
  onClose,
  confirmLabel,
  confirmClass,
  loading,
}: ModalProps) {
  const d = data as any;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-7 pb-4 border-b border-gray-100">
          <h2 className="text-xl font-extrabold text-[#384A6C] tracking-tight">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition p-1 rounded-lg hover:bg-gray-100"
          >
            <LuX size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-8 py-6 space-y-6">
          {/* Dados principais */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
              Dados principais
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Field
                label="Nome"
                icon={LuUser}
                className="col-span-2"
                placeholder="Nome completo"
                value={d.name}
                onChange={(e) => onChange("name", e.target.value)}
              />
              <Field
                label="E-mail"
                icon={LuMail}
                type="email"
                placeholder="contato@empresa.com.br"
                value={d.email}
                onChange={(e) => onChange("email", e.target.value)}
              />
              <Field
                label="Telefone"
                icon={LuPhone}
                placeholder="(00) 00000-0000"
                value={maskPhone(String(d.phone_number ?? ""))}
                onChange={(e) =>
                  onChange("phone_number", maskPhone(e.target.value))
                }
              />
              <Field
                label="CNPJ"
                icon={LuBuilding2}
                placeholder="00.000.000/0001-00"
                value={maskCNPJ(String(d.CNPJ ?? ""))}
                onChange={(e) => onChange("CNPJ", maskCNPJ(e.target.value))}
              />
              <Field
                label="Senha"
                type="password"
                placeholder="••••••••"
                value={d.password ?? ""}
                onChange={(e) => onChange("password", e.target.value)}
              />
            </div>
          </div>

          {/* Endereço */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <LuMapPin size={12} /> Endereço
            </p>
            <div className="grid grid-cols-6 gap-3">
              <Field
                label="Rua"
                className="col-span-4"
                placeholder="Nome da rua"
                value={d.street ?? ""}
                onChange={(e) => onChange("street", e.target.value)}
              />
              <Field
                label="Número"
                className="col-span-2"
                type="number"
                placeholder="0"
                value={d.number ?? ""}
                onChange={(e) =>
                  onChange(
                    "number",
                    e.target.value === "" ? null : Number(e.target.value)
                  )
                }
              />
              <Field
                label="Complemento"
                className="col-span-3"
                placeholder="Apto, sala..."
                value={d.complement ?? ""}
                onChange={(e) => onChange("complement", e.target.value)}
              />
              <Field
                label="CEP"
                className="col-span-3"
                placeholder="00000-000"
                value={maskZip(String(d.zipcode ?? ""))}
                onChange={(e) => onChange("zipcode", maskZip(e.target.value))}
              />
              <Field
                label="Cidade"
                className="col-span-2"
                placeholder="Cidade"
                value={d.city ?? ""}
                onChange={(e) => onChange("city", e.target.value)}
              />
              <Field
                label="Estado"
                className="col-span-2"
                placeholder="UF"
                value={d.state ?? ""}
                onChange={(e) => onChange("state", e.target.value)}
              />
              <Field
                label="País"
                className="col-span-2"
                placeholder="Brasil"
                value={d.country ?? ""}
                onChange={(e) => onChange("country", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-8 py-5 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all active:scale-95 disabled:opacity-60 ${confirmClass}`}
          >
            {loading ? "Salvando..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function ClientManager() {
  const { toast } = useToast();
  const [clients, setClients] = useState<Client[]>([]);
  const [filtered, setFiltered] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editing, setEditing] = useState<Client | null>(null);
  const [creating, setCreating] = useState(false);
  const [newClient, setNewClient] = useState({ ...EMPTY_CLIENT });
  const [deleteId, setDeleteId] = useState<{ id: number; name: string } | null>(null);

  useEffect(() => {
    api
      .get("/client")
      .then((r) => {
        setClients(r.data);
        setFiltered(r.data);
      })
      .catch()
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setFiltered(
      clients.filter(
        (c) =>
          c.name.toLowerCase().includes(value.toLowerCase()) ||
          String(c.id).includes(value) ||
          c.CNPJ.includes(value)
      )
    );
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/client/${deleteId.id}`);
      const next = clients.filter((c) => c.id !== deleteId.id);
      setClients(next);
      setFiltered(next.filter((c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    } catch {
      toast("Erro ao excluir cliente.", "error");
    } finally {
      setDeleteId(null);
    }
  };

  const handleEdit = async (id: number) => {
    try {
      const res = await api.get(`/client/${id}`);
      setEditing(res.data);
    } catch {
      toast("Erro ao carregar cliente.", "error");
    }
  };

  const handleSave = async () => {
    if (!editing) return;
    try {
      setSaving(true);
      await api.put(`/client/${editing.id}`, {
        name: editing.name,
        email: editing.email,
        phone_number: editing.phone_number.replace(/\D/g, ""),
        CNPJ: editing.CNPJ.replace(/\D/g, ""),
        password: editing.password,
        street: editing.street || null,
        number: editing.number || null,
        complement: editing.complement || null,
        city: editing.city || null,
        state: editing.state || null,
        country: editing.country || null,
        zipcode: editing.zipcode?.replace(/\D/g, "") || null,
      });
      const next = clients.map((c) =>
        c.id === editing.id ? { ...editing } : c
      );
      setClients(next);
      setFiltered(next);
      setEditing(null);
    } catch {
      toast("Erro ao atualizar cliente.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleCreate = async () => {
    try {
      setSaving(true);
      await api.post("/client", {
        name: newClient.name.trim(),
        email: newClient.email.trim(),
        password: newClient.password?.trim(),
        phone_number: newClient.phone_number.replace(/\D/g, ""),
        CNPJ: newClient.CNPJ.replace(/\D/g, ""),
        addressData: {
          street: newClient.street?.trim() || null,
          number: newClient.number ?? 1,
          complement: newClient.complement?.trim() || null,
          city: newClient.city?.trim() || null,
          state: newClient.state?.trim() || null,
          country: newClient.country?.trim() || null,
          zipcode: newClient.zipcode?.replace(/\D/g, "") || null,
        },
      });
      const list = await api.get("/client");
      setClients(list.data);
      setFiltered(list.data);
      setCreating(false);
      setNewClient({ ...EMPTY_CLIENT });
    } catch {
      toast("Erro ao cadastrar cliente.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <GenericPanelLayout panel="cliente">
      <div className="w-full max-w-5xl mx-auto space-y-6">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#384A6C] tracking-tight">Clientes</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {filtered.length} cliente{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Busca */}
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm">
              <LuSearch size={15} className="text-gray-400 shrink-0" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Buscar por nome ou CNPJ..."
                className="outline-none text-sm text-gray-700 placeholder-gray-300 w-52"
              />
            </div>

            {/* Novo cliente */}
            <button
              onClick={() => setCreating(true)}
              className="flex items-center gap-2 bg-[#384A6C] text-white px-4 py-2.5 rounded-xl text-sm font-bold
                hover:bg-[#2f3e5c] active:scale-95 transition-all shadow-sm"
            >
              <LuPlus size={16} />
              Novo cliente
            </button>
          </div>
        </div>

        {/* ── Lista ── */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <svg className="animate-spin h-6 w-6 text-[#94C0E0]" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <p className="text-sm text-gray-400">Carregando clientes...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-2 text-gray-400">
              <LuUser size={32} className="opacity-30" />
              <p className="text-sm font-medium">Nenhum cliente encontrado.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-50">
              {filtered.map((c) => (
                <li
                  key={c.id}
                  className="flex items-center justify-between px-6 py-4 hover:bg-[#EEF5FB]/60 transition-colors"
                >
                  {/* Avatar + info */}
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#384A6C]/10 flex items-center justify-center text-[#384A6C] text-sm font-bold shrink-0">
                      {getInitials(c.name)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{c.name}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5 flex-wrap">
                        <span className="flex items-center gap-1">
                          <LuMail size={11} /> {c.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <LuPhone size={11} /> {maskPhone(c.phone_number)}
                        </span>
                        <span className="flex items-center gap-1">
                          <LuBuilding2 size={11} /> {maskCNPJ(c.CNPJ)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex items-center gap-2 shrink-0 ml-4">
                    <button
                      onClick={() => handleEdit(c.id)}
                      className="p-2 rounded-xl text-[#384A6C] hover:bg-[#384A6C]/10 transition"
                      title="Editar"
                    >
                      <LuPencil size={16} />
                    </button>
                    <button
                      onClick={() => setDeleteId({ id: c.id, name: c.name })}
                      className="p-2 rounded-xl text-red-400 hover:bg-red-50 transition"
                      title="Excluir"
                    >
                      <LuTrash2 size={16} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* ── Modal Edição ── */}
      {editing && (
        <ClientModal
          title="Editar Cliente"
          data={editing}
          onChange={(key, value) => setEditing({ ...editing, [key]: value })}
          onConfirm={handleSave}
          onClose={() => setEditing(null)}
          confirmLabel="Salvar alterações"
          confirmClass="bg-[#384A6C] hover:bg-[#2f3e5c]"
          loading={saving}
        />
      )}

      {/* ── Modal Criação ── */}
      {creating && (
        <ClientModal
          title="Novo Cliente"
          data={newClient}
          onChange={(key, value) =>
            setNewClient((prev) => ({ ...prev, [key]: value }))
          }
          onConfirm={handleCreate}
          onClose={() => {
            setCreating(false);
            setNewClient({ ...EMPTY_CLIENT });
          }}
          confirmLabel="Cadastrar"
          confirmClass="bg-[#384A6C] hover:bg-[#2f3e5c]"
          loading={saving}
        />
      )}

      {/* ── Modal Confirmação de Exclusão ── */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 flex flex-col items-center text-center gap-4">
            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
              <LuTrash2 size={24} className="text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-gray-800">Excluir cliente?</h3>
              <p className="text-sm text-gray-400 mt-1">
                <span className="font-semibold text-gray-600">{deleteId.name}</span> será removido permanentemente.
              </p>
            </div>
            <div className="flex gap-3 w-full mt-2">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 active:scale-95 transition-all"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </GenericPanelLayout>
  );
}