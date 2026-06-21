import { useState } from "react";
import { GenericPanelLayout } from "../../../components/Layout/company/layoutOption";
import {
  LuSearch,
  LuTrash2,
  LuPencil,
  LuPlus,
  LuBuilding2,
  LuMail,
  LuPhone,
  LuUser,
} from "react-icons/lu";
import { useClients } from "../../../hooks/useClient";
import { type Client, type ClientForm, EMPTY_FORM } from "../../../types/client";
import { maskPhone, maskCNPJ, getInitials } from "../../../util/clientHelpers";
import { ClientModal } from "../../../components/client/clientModal";
import { DeleteClientModal } from "../../../components/client/deleteClientModal";

export default function ClientManager() {
  const {
    clients,
    loading,
    saving,
    searchTerm,
    handleSearch,
    getClientDetails,
    createClient,
    updateClient,
    deleteClient,
  } = useClients();

  // Interface State
  const [editing, setEditing] = useState<Client | null>(null);
  const [creating, setCreating] = useState(false);
  const [newClient, setNewClient] = useState<ClientForm>(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string } | null>(null);

  const handleEdit = async (id: number) => {
    try {
      const details = await getClientDetails(id);
      setEditing(details);
    } catch {
      // Errors are handled in the hook
    }
  };

  const handleSave = async () => {
    if (!editing) return;
    try {
      await updateClient(editing.id, editing);
      setEditing(null);
    } catch {
      // Handled in the hook
    }
  };

  const handleCreate = async () => {
    try {
      await createClient(newClient);
      setCreating(false);
      setNewClient(EMPTY_FORM);
    } catch {
      // Handled in the hook
    }
  };

  const handleFormChange = (formSetter: React.Dispatch<React.SetStateAction<any>>) => (key: string, value: any) => {
    formSetter((prev: any) => ({ ...prev, [key]: value }));
  };

  return (
    <GenericPanelLayout panel="cliente">
      <div className="w-full max-w-5xl mx-auto space-y-6">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#384A6C] tracking-tight">Clientes</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {clients.length} cliente{clients.length !== 1 ? "s" : ""} encontrado{clients.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="flex items-center gap-3">
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
          ) : clients.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-2 text-gray-400">
              <LuUser size={32} className="opacity-30" />
              <p className="text-sm font-medium">Nenhum cliente encontrado.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-50">
              {clients.map((c) => (
                <li
                  key={c.id}
                  className="flex items-center justify-between px-6 py-4 hover:bg-[#EEF5FB]/60 transition-colors"
                >
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

                  <div className="flex items-center gap-2 shrink-0 ml-4">
                    <button
                      onClick={() => handleEdit(c.id)}
                      className="p-2 rounded-xl text-[#384A6C] hover:bg-[#384A6C]/10 transition"
                      title="Editar"
                    >
                      <LuPencil size={16} />
                    </button>
                    <button
                      onClick={() => setDeleteTarget({ id: c.id, name: c.name })}
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

      {/* Modais */}
      {editing && (
        <ClientModal
          title="Editar Cliente"
          data={editing}
          onChange={handleFormChange(setEditing)}
          onConfirm={handleSave}
          onClose={() => setEditing(null)}
          confirmLabel="Salvar alterações"
          confirmClass="bg-[#384A6C] hover:bg-[#2f3e5c]"
          loading={saving}
        />
      )}

      {creating && (
        <ClientModal
          title="Novo Cliente"
          data={newClient}
          onChange={handleFormChange(setNewClient)}
          onConfirm={handleCreate}
          onClose={() => {
            setCreating(false);
            setNewClient(EMPTY_FORM);
          }}
          confirmLabel="Cadastrar"
          confirmClass="bg-[#384A6C] hover:bg-[#2f3e5c]"
          loading={saving}
        />
      )}

      {deleteTarget && (
        <DeleteClientModal
          name={deleteTarget.name}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={async () => {
            await deleteClient(deleteTarget.id);
            setDeleteTarget(null);
          }}
        />
      )}
    </GenericPanelLayout>
  );
}