import { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";
import { LuX, LuCircleCheck, LuCircleAlert, LuInfo } from "react-icons/lu";

type ToastType = "success" | "error" | "info";

type Toast = {
  id: number;
  message: string;
  type: ToastType;
};

type ToastContextType = {
  toast: (message: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextType>({ toast: () => {} });

const icons = {
  success: <LuCircleCheck size={16} />,
  error: <LuCircleAlert size={16} />,
  info: <LuInfo size={16} />,
};

const styles = {
  success: "bg-emerald-50 border-emerald-200 text-emerald-700",
  error: "bg-red-50 border-red-200 text-red-600",
  info: "bg-blue-50 border-blue-200 text-blue-600",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismiss = (id: number) =>
    setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      {/* Portal de toasts */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 items-end">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`
              flex items-start gap-3 px-4 py-3 rounded-2xl border shadow-lg
              text-sm font-medium max-w-sm w-full
              animate-in slide-in-from-right-4 fade-in duration-300
              ${styles[t.type]}
            `}
          >
            <span className="mt-0.5 shrink-0">{icons[t.type]}</span>
            <span className="flex-1">{t.message}</span>
            <button
              onClick={() => dismiss(t.id)}
              className="shrink-0 opacity-50 hover:opacity-100 transition"
            >
              <LuX size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);