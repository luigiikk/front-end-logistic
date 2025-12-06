{
  /* ClientManager.tsx */
}
import { useEffect, useState } from "react";
import { api } from "../../../api/lib/api";
import { GenericPanelLayout } from "../../../components/Layout/company/layoutOption";
import { LuSearch, LuTrash2, LuPencil, LuPlus } from "react-icons/lu";

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

export default function ClientManager() {
  const [clients, setClients] = useState<Client[]>([]);
  const [filtered, setFiltered] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [editing, setEditing] = useState<Client | null>(null);
  const [creating, setCreating] = useState(false);

  const [newClient, setNewClient] = useState({
    id: 0,
    name: "",
    email: "",
    phone_number: "",
    password: "",
    CNPJ: "",
    street: "",
    number: null,
    complement: "",
    city: "",
    state: "",
    country: "",
    zipcode: "",
  });

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.get("/client");
        setClients(res.data);
        setFiltered(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setFiltered(
      clients.filter(
        (c) =>
          c.name.toLowerCase().includes(value.toLowerCase()) ||
          String(c.id).includes(value)
      )
    );
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Deseja realmente excluir ${name}?`)) return;
    try {
      await api.delete(`/client/${id}`);
      setClients(clients.filter((c) => c.id !== id));
      setFiltered(filtered.filter((c) => c.id !== id));
      alert("Cliente excluído com sucesso!");
    } catch {
      alert("Erro ao deletar cliente");
    }
  };

  const handleEdit = async (id: number) => {
    try {
      const res = await api.get(`/client/${id}`);
      setEditing(res.data);
    } catch (err) {
      alert("Erro ao carregar informações do cliente");
      console.error(err);
    }
  };

  const handleSave = async () => {
    if (!editing) return;
    try {
      const payload = {
        name: editing.name,
        email: editing.email,
        phone_number: editing.phone_number,
        CNPJ: editing.CNPJ,
        password: editing.password,
        street: editing.street || null,
        number: editing.number || null,
        complement: editing.complement || null,
        city: editing.city || null,
        state: editing.state || null,
        country: editing.country || null,
        zipcode: editing.zipcode || null,
      };
      console.log("Payload para update:", payload);
      await api.put(`/client/${editing.id}`, payload);
      setClients(
        clients.map((c) => (c.id === editing.id ? { ...editing } : c))
      );
      setFiltered(
        filtered.map((c) => (c.id === editing.id ? { ...editing } : c))
      );

      alert("Cliente atualizado com sucesso!");
      setEditing(null);
    } catch (error: any) {
      console.error(
        "Erro ao atualizar cliente:",
        error.response?.data || error
      );
      alert("Erro ao atualizar cliente. Verifique os dados.");
    }
  };

  const handleCreate = async () => {
    try {
      const payload = {
        name: newClient.name.trim(),
        email: newClient.email.trim(),
        password: newClient.password.trim(),
        phone_number: newClient.phone_number.trim(),
        CNPJ: newClient.CNPJ.trim(),
        addressData: {
          street: newClient.street?.trim(),
          number:
            newClient.number === null || newClient.number === undefined
              ? 1
              : Math.floor(newClient.number),
          complement: newClient.complement?.trim(),
          city: newClient.city?.trim(),
          state: newClient.state?.trim(),
          country: newClient.country?.trim(),
          zipcode: newClient.zipcode?.trim(),
        },
      };
      console.log(payload);
      await api.post("/client", payload);
      const list = await api.get("/client");
      setClients(list.data);
      setFiltered(list.data);
      setCreating(false);
      setNewClient({
        id: 0,
        name: "",
        email: "",
        phone_number: "",
        CNPJ: "",
        password: "",
        street: "",
        number: null,
        complement: "",
        city: "",
        state: "",
        country: "",
        zipcode: "",
      });
      alert("Cliente cadastrado com sucesso!");
    } catch (err: any) {
      alert(`Erro ao cadastrar`);
    }
  };

  return (
    <GenericPanelLayout panel="cliente" >
      <div className="bg-white max-w-5xl w-full rounded-3xl shadow-xl p-10 min-h-[600px]">
        <h1 className="text-3xl text-center mb-8">Clientes</h1>

        {/* Botão criar + busca */}
        <div className="flex justify-between mb-6">
          <button
            onClick={() => setCreating(true)}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            <LuPlus /> Cadastrar Cliente
          </button>

          <div className="flex items-center gap-2 border border-black rounded-lg px-4 py-2">
            <LuSearch />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Buscar por nome ou ID..."
              className="outline-none"
            />
          </div>
        </div>

        {/* Lista de cards */}
        <div className="border-t border-black">
          {loading ? (
            <p className="text-center py-4 text-gray-500">Carregando...</p>
          ) : (
            filtered.map((c) => (
              <div
                key={c.id}
                className="flex justify-between border-b border-black py-4 items-center px-4 hover:bg-gray-50"
              >
                <div>
                  <p className="font-semibold text-lg">{c.name}</p>
                  <p className="text-sm text-gray-600">
                    {c.email} — {c.phone_number}
                  </p>
                  <p className="text-sm text-gray-500">{c.CNPJ}</p>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => handleEdit(c.id)}
                    className="text-blue-600 text-2xl hover:text-blue-800"
                  >
                    <LuPencil />
                  </button>
                  <button
                    onClick={() => handleDelete(c.id, c.name)}
                    className="text-red-600 text-2xl hover:text-red-800"
                  >
                    <LuTrash2 />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* MODAL EDIÇÃO CLIENT */}
        {editing && (
          <div className="fixed top-0 left-0 w-full h-full bg-black/40 flex justify-center items-center z-[1000]">
            <div className="bg-white w-[600px] p-6 rounded-2xl shadow-xl max-h-[85vh] overflow-auto z-[1001]">
              <h2 className="text-2xl font-semibold mb-4">Editar Cliente</h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  "name",
                  "email",
                  "phone_number",
                  "CNPJ",
                  "street",
                  "number",
                  "complement",
                  "city",
                  "state",
                  "country",
                  "zipcode",
                ].map((field) => (
                  <div key={field}>
                    <label className="block mb-1">
                      {field.replace("_", " ")}
                    </label>
                    <input
                      type={field === "number" ? "number" : "text"}
                      value={(editing as any)[field] ?? ""}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          [field]:
                            field === "number"
                              ? e.target.value === ""
                                ? null
                                : Number(e.target.value)
                              : e.target.value,
                        })
                      }
                      className="border p-2 rounded w-full"
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setEditing(null)}
                  className="text-gray-600 hover:underline"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL CRIAÇÃO CLIENT */}
        {creating && (
          <div className="fixed top-0 left-0 w-full h-full bg-black/40 flex justify-center items-center z-[1000]">
            <div className="bg-white w-[600px] p-6 rounded-2xl shadow-xl max-h-[85vh] overflow-auto z-[1001]">
              <h2 className="text-2xl font-semibold mb-4">Cadastrar Cliente</h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  "name",
                  "email",
                  "phone_number",
                  "CNPJ",
                  "password",
                  "street",
                  "number",
                  "complement",
                  "city",
                  "state",
                  "country",
                  "zipcode",
                ].map((field) => (
                  <div key={field}>
                    <label className="block mb-1">
                      {field.replace("_", " ")}
                    </label>
                    <input
                      // Lógica para definir o tipo do input
                      type={
                        field === "number"
                          ? "number"
                          : field === "password"
                          ? "password" // Adicione essa linha
                          : "text"
                      }
                      value={(newClient as any)[field] ?? ""}
                      onChange={(e) =>
                        setNewClient({
                          ...newClient,
                          [field]:
                            field === "number"
                              ? e.target.value === ""
                                ? null
                                : Number(e.target.value)
                              : e.target.value,
                        })
                      }
                      className="border p-2 rounded w-full"
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setCreating(false)}
                  className="text-gray-600 hover:underline"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreate}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Cadastrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </GenericPanelLayout>
  );
}
