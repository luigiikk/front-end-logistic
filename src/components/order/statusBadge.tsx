type StatusBadgeProps = {
  status: string;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const lower = status?.toLowerCase() ?? "";
  const isDelivered = lower.includes("entregue");
  const isTransit = lower.includes("trânsito") || lower.includes("transito") || lower.includes("saiu");
  const isProcess = lower.includes("processo");
  const isPending = lower.includes("pendente");
  const isCancelled = lower.includes("cancelado") || lower.includes("cancelada");

  const cls = isDelivered
    ? "bg-green-50 text-green-700 border-green-200"
    : isTransit
    ? "bg-blue-50 text-blue-700 border-blue-200"
    : isProcess
    ? "bg-purple-50 text-purple-700 border-purple-200"
    : isPending
    ? "bg-amber-50 text-amber-700 border-amber-200"
    : isCancelled
    ? "bg-red-50 text-red-700 border-red-200"
    : "bg-gray-100 text-gray-600 border-gray-200";

  return (
    <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full border ${cls}`}>
      {status}
    </span>
  );
}
