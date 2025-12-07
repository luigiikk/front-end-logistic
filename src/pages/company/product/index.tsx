/* ProductManager.tsx */
import { useEffect, useState } from "react";
import { api } from "../../../api/lib/api";
import { LuSearch } from "react-icons/lu";
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

  const [ordersLookup, setOrdersLookup] = useState<{ [id: number]: string }>(
    {}
  );

  // Carregar produtos
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

  useEffect(() => {
  async function loadOrders() {
    try {
      const res = await api.get("/order");
      const lookup: { [id: number]: string } = {};
      res.data.forEach((o: any) => {
        lookup[o.id] = o.code; // <-- id do pedido para code
      });
      setOrdersLookup(lookup);
    } catch (err) {
      console.error(err);
    }
  }
  loadOrders();
}, []);


  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setFiltered(
      products.filter(
        (p) =>
          p.name.toLowerCase().includes(value.toLowerCase()) ||
          (ordersLookup[p.order_id] ?? "")
            .toLowerCase()
            .includes(value.toLowerCase())
      )
    );
  };

  // Atualizar filtro quando ordersLookup mudar
  useEffect(() => {
    if (searchTerm) {
      handleSearch(searchTerm);
    }
  }, [ordersLookup]);

  return (
    <GenericPanelLayout panel="produto">
      <div className="bg-white max-w-5xl w-full rounded-3xl shadow-xl p-10 min-h-[600px]">
        <h1 className="text-3xl text-center mb-8">Produtos</h1>

        {/* Barra de busca */}
        <div className="flex justify-start mb-6">
          <div className="flex items-center gap-2 border border-black rounded-lg px-4 py-2 w-80">
            <LuSearch />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Buscar por nome ou código do pedido..."
              className="outline-none w-full"
            />
          </div>
        </div>

        {/* Lista de produtos */}
        <div className="border-t border-black">
          {loading ? (
            <p className="text-center py-4 text-gray-500">Carregando...</p>
          ) : filtered.length === 0 ? (
            <p className="text-center py-4 text-gray-500">
              Nenhum produto encontrado
            </p>
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
                    <p className="text-sm text-gray-500">
                      <b>Quantidade</b> {p.quantity} — <b>Pedido:</b>{" "}
                      {ordersLookup[p.order_id] ?? "-----"}
                    </p>
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </GenericPanelLayout>
  );
}
