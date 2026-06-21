import type { ResourceOption } from "../types/purchaseOrder";

export function getStatusStyle(name: string) {
  const lower = name.toLowerCase();
  if (lower.includes("pendente")) return "bg-yellow-50 text-yellow-700 border-yellow-200";
  if (lower.includes("aprovado") || lower.includes("concluído")) return "bg-green-50 text-green-700 border-green-200";
  if (lower.includes("cancelado")) return "bg-red-50 text-red-700 border-red-200";
  return "bg-blue-50 text-blue-700 border-blue-200";
}

export function calcItemVolume(resource: ResourceOption | undefined, quantity: number): number | null {
  if (!resource?.width || !resource?.height || !resource?.length) return null;
  return resource.width * resource.height * resource.length * quantity;
}
