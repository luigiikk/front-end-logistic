import { LuTrash2 } from "react-icons/lu";

type DeleteResourceModalProps = {
  name: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export function DeleteResourceModal({
  name,
  onCancel,
  onConfirm,
}: DeleteResourceModalProps) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 flex flex-col items-center text-center gap-4">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
          <LuTrash2 size={24} className="text-red-400" />
        </div>
        <div>
          <h3 className="text-lg font-extrabold text-gray-800">Excluir recurso?</h3>
          <p className="text-sm text-gray-400 mt-1">
            <span className="font-semibold text-gray-600">{name}</span> será removido. Verifique se não está vinculado a pedidos.
          </p>
        </div>
        <div className="flex gap-3 w-full mt-2">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 active:scale-95 transition-all"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}
