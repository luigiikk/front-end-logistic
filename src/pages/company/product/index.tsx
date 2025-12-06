/* ProductManager.tsx */
import { useEffect, useState } from "react";
import { api } from "../../../api/lib/api";
import { LuSearch, LuTrash2, LuPencil, LuPlus } from "react-icons/lu";
import { GenericPanelLayout } from "../../../components/Layout/company/layoutOption";

type Product = {
  id: number;
  name: string;
  description: string;
  quantity: number;
  order_id: number;
};

export default function ProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    quantity: 1,
    order_id: 0,
  });

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.get("/product");
        setProducts(res.data);
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
      products.filter(
        (p) =>
          p.name.toLowerCase().includes(value.toLowerCase()) ||
          String(p.id).includes(value)
      )
    );
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Deseja realmente excluir ${name}?`)) return;
    try {
      await api.delete(`/product/${id}`);
      setProducts(products.filter((p) => p.id !== id));
      setFiltered(filtered.filter((p) => p.id !== id));
      alert("Produto excluído com sucesso!");
    } catch {
      alert("Erro ao deletar produto");
    }
  };

  const handleEdit = async (id: number) => {
    try {
      const res = await api.get(`/product/${id}`);
      setEditing(res.data);
    } catch (err) {
      alert("Erro ao carregar informações do produto");
      console.error(err);
    }
  };

  const handleSave = async () => {
    if (!editing) return;
    try {
      const payload = {
        name: editing.name,
        description: editing.description,
        quantity: editing.quantity,
        order_id: editing.order_id,
      };
      await api.put(`/product/${editing.id}`, payload);
      setProducts(products.map((p) => (p.id === editing.id ? { ...editing } : p)));
      setFiltered(filtered.map((p) => (p.id === editing.id ? { ...editing } : p)));
      alert("Produto atualizado com sucesso!");
      setEditing(null);
    } catch (error: any) {
      console.error("Erro ao atualizar produto:", error.response?.data || error);
      alert("Erro ao atualizar produto. Verifique os dados.");
    }
  };

  const handleCreate = async () => {
    try {
      const payload = {
        name: newProduct.name.trim(),
        description: newProduct.description.trim(),
        quantity: Math.floor(newProduct.quantity),
        order_id: Math.floor(newProduct.order_id),
      };
      await api.post("/product", payload);
      const list = await api.get("/product");
      setProducts(list.data);
      setFiltered(list.data);
      setCreating(false);
      setNewProduct({ name: "", description: "", quantity: 1, order_id: 0 });
      alert("Produto cadastrado com sucesso!");
    } catch (err: any) {
      alert("Erro ao cadastrar produto");
    }
  };

  return (
    <GenericPanelLayout panel="produto">
      <div className="bg-white max-w-5xl w-full rounded-3xl shadow-xl p-10 min-h-[600px]">
        <h1 className="text-3xl text-center mb-8">Produtos</h1>

        {/* Botão criar + busca */}
        <div className="flex justify-between mb-6">
          <button
            onClick={() => setCreating(true)}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            <LuPlus /> Cadastrar Produto
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
            filtered.map((p) => (
              <div
                key={p.id}
                className="flex justify-between border-b border-black py-4 items-center px-4 hover:bg-gray-50"
              >
                <div>
                  <p className="font-semibold text-lg">{p.name}</p>
                  <p className="text-sm text-gray-600">{p.description}</p>
                  <p className="text-sm text-gray-500">
                    Quantidade: {p.quantity} — Pedido: {p.order_id}
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => handleEdit(p.id)}
                    className="text-blue-600 text-2xl hover:text-blue-800"
                  >
                    <LuPencil />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id, p.name)}
                    className="text-red-600 text-2xl hover:text-red-800"
                  >
                    <LuTrash2 />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* MODAL EDIÇÃO PRODUTO */}
        {editing && (
          <div className="fixed top-0 left-0 w-full h-full bg-black/40 flex justify-center items-center z-[1000]">
            <div className="bg-white w-[600px] p-6 rounded-2xl shadow-xl max-h-[85vh] overflow-auto z-[1001]">
              <h2 className="text-2xl font-semibold mb-4">Editar Produto</h2>
              <div className="grid grid-cols-2 gap-4">
                {["name", "description", "quantity", "order_id"].map((field) => (
                  <div key={field}>
                    <label className="block mb-1">{field.replace("_", " ")}</label>
                    <input
                      type={field === "quantity" || field === "order_id" ? "number" : "text"}
                      value={(editing as any)[field] ?? ""}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          [field]:
                            field === "quantity" || field === "order_id"
                              ? Number(e.target.value)
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

        {/* MODAL CRIAÇÃO PRODUTO */}
        {creating && (
          <div className="fixed top-0 left-0 w-full h-full bg-black/40 flex justify-center items-center z-[1000]">
            <div className="bg-white w-[600px] p-6 rounded-2xl shadow-xl max-h-[85vh] overflow-auto z-[1001]">
              <h2 className="text-2xl font-semibold mb-4">Cadastrar Produto</h2>
              <div className="grid grid-cols-2 gap-4">
                {["name", "description", "quantity", "order_id"].map((field) => (
                  <div key={field}>
                    <label className="block mb-1">{field.replace("_", " ")}</label>
                    <input
                      type={field === "quantity" || field === "order_id" ? "number" : "text"}
                      value={(newProduct as any)[field] ?? ""}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          [field]:
                            field === "quantity" || field === "order_id"
                              ? Number(e.target.value)
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
