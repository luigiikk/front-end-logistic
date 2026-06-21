import { useState } from "react";
import { GenericPanelLayout } from "../../../components/Layout/company/layoutOption";
import {
  LuTrash2, LuPlus, LuPencil, LuShoppingCart, LuHash, LuBoxes,
} from "react-icons/lu";
import { usePurchaseOrders } from "../../../hooks/usePurchaseOrder";
import { type OrderForm, EMPTY_FORM } from "../../../types/purchaseOrder";
import { getStatusStyle } from "../../../util/purchaseOrderHelpers";
import { PurchaseOrderModal } from "../../../components/purchase-order/purchaseOrderModal";
import { DeletePurchaseOrderModal } from "../../../components/purchase-order/deletePurchaseOrderModal";

export default function PurchaseOrderManager() {
  const {
    orders,
    suppliers,
    resources,
    warehouses,
    statuses,
    loading,
    saving,
    getOrderDetails,
    createOrder,
    updateOrder,
    deleteOrder,
  } = usePurchaseOrders();

  // Interface State
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: number } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<OrderForm>(EMPTY_FORM);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setIsModalOpen(true);
  };

  const handleEdit = async (id: number) => {
    try {
      const details = await getOrderDetails(id);
      setFormData(details);
      setEditingId(id);
      setIsModalOpen(true);
    } catch {
      // Handled in hook
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData(EMPTY_FORM);
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await updateOrder(editingId, formData);
      } else {
        await createOrder(formData);
      }
      closeModal();
    } catch {
      // Handled in hook
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteOrder(deleteTarget.id);
      setDeleteTarget(null);
    } catch {
      // Handled in hook
    }
  };

  return (
    <GenericPanelLayout panel="pedido_de_compra">
      <div className="w-full max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#384A6C] tracking-tight flex items-center gap-2">
              <LuShoppingCart size={22} /> Pedidos de Compra
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {orders.length} pedido{orders.length !== 1 ? "s" : ""} cadastrado{orders.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 bg-[#384A6C] text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-[#2f3e5c] active:scale-95 transition-all shadow-sm"
          >
            <LuPlus size={16} /> Novo pedido
          </button>
        </div>

        {/* Tabela */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {loading && orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <svg className="animate-spin h-6 w-6 text-[#94C0E0]" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <p className="text-sm text-gray-400">Carregando pedidos...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-2 text-gray-400">
              <LuShoppingCart size={32} className="opacity-30" />
              <p className="text-sm font-medium">Nenhum pedido de compra cadastrado.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100 bg-[#EEF5FB]">
                    {["Pedido", "Fornecedor", "Categorias", "Status", "Total", "Volume", ""].map((h) => (
                      <th
                        key={h}
                        className="py-3 px-6 text-[10px] font-bold text-[#384A6C] uppercase tracking-widest whitespace-nowrap last:text-right"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {orders.map((order) => {
                    const categoryNames =
                      order.items?.map((i: any) => i.resource?.category?.name).filter(Boolean) ?? [];
                    const categoriesDisplay = Array.from(new Set(categoryNames)).join(", ") || "—";
                    const statusName = order.status?.name ?? String(order.status_id);

                    const orderVolume =
                      order.items?.reduce((acc: number, i: any) => {
                        const r = i.resource;
                        if (!r?.width || !r?.height || !r?.length) return acc;
                        return acc + r.width * r.height * r.length * (i.quantity ?? 1);
                      }, 0) ?? null;

                    return (
                      <tr key={order.id} className="hover:bg-[#EEF5FB]/60 transition-colors">
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center gap-1 text-sm font-bold text-[#384A6C]">
                            <LuHash size={12} className="opacity-60" />
                            {order.id}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-700 font-medium">{order.supplier?.name ?? "—"}</td>
                        <td className="py-4 px-6">
                          <span
                            className="text-xs text-gray-500 bg-gray-100 border border-gray-200 px-2.5 py-1 rounded-full block w-fit max-w-[180px] truncate"
                            title={categoriesDisplay}
                          >
                            {categoriesDisplay}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getStatusStyle(
                              statusName
                            )}`}
                          >
                            {statusName}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-sm font-extrabold text-[#384A6C]">
                            R$ {Number(order.total_value).toFixed(2)}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          {orderVolume != null && orderVolume > 0 ? (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#384A6C] bg-[#384A6C]/10 px-2.5 py-1 rounded-full">
                              <LuBoxes size={10} />
                              {orderVolume.toFixed(2)} m³
                            </span>
                          ) : (
                            <span className="text-xs text-gray-300">—</span>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEdit(order.id)}
                              className="p-2 rounded-xl text-[#384A6C] hover:bg-[#384A6C]/10 transition"
                              title="Editar"
                            >
                              <LuPencil size={15} />
                            </button>
                            <button
                              onClick={() => setDeleteTarget({ id: order.id })}
                              className="p-2 rounded-xl text-red-400 hover:bg-red-50 transition"
                              title="Excluir"
                            >
                              <LuTrash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modais */}
      {isModalOpen && (
        <PurchaseOrderModal
          title={editingId ? `Editar Pedido #${editingId}` : "Novo Pedido de Compra"}
          form={formData}
          suppliers={suppliers}
          statuses={statuses}
          resources={resources}
          warehouses={warehouses}
          onChange={setFormData}
          onConfirm={handleSave}
          onClose={closeModal}
          loading={saving}
        />
      )}

      {deleteTarget && (
        <DeletePurchaseOrderModal
          id={deleteTarget.id}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </GenericPanelLayout>
  );
}