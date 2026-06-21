export function getStatus(status: { name?: string } | string | number | undefined | null) {
  let name = "";
  if (status && typeof status === "object") {
    name = status.name ?? "";
  } else if (status !== undefined && status !== null) {
    name = String(status);
  }
  
  const str = name.trim().toLowerCase();
  
  if (str.includes("pendente")) {
    return { label: "Pendente", cls: "bg-yellow-50 text-yellow-700 border-yellow-200" };
  }
  if (str.includes("paga") || str.includes("aprovado") || str.includes("recebido")) {
    return { label: "Paga", cls: "bg-green-50 text-green-700 border-green-200" };
  }
  if (str.includes("atrasada")) {
    return { label: "Atrasada", cls: "bg-red-50 text-red-700 border-red-200" };
  }
  if (str.includes("cancelada") || str.includes("cancelado")) {
    return { label: "Cancelada", cls: "bg-gray-100 text-gray-500 border-gray-200" };
  }
  
  // Fallback to legacy IDs just in case
  if (str === "1") return { label: "Pendente", cls: "bg-yellow-50 text-yellow-700 border-yellow-200" };
  if (str === "2") return { label: "Paga",     cls: "bg-green-50 text-green-700 border-green-200" };
  if (str === "3") return { label: "Atrasada", cls: "bg-red-50 text-red-700 border-red-200" };
  if (str === "4") return { label: "Cancelada",cls: "bg-gray-100 text-gray-500 border-gray-200" };
  
  return { label: "Desconhecido", cls: "bg-gray-100 text-gray-500 border-gray-200" };
}

export function formatDate(dateStr: string | null) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("pt-BR");
}

export function formatDateForInput(dateStr: string | null) {
  if (!dateStr) return "";
  return new Date(dateStr).toISOString().split("T")[0];
}
