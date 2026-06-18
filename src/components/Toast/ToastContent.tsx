import { createContext, useContext } from "react";

export type ToastType = "success" | "error" | "info";

export type Toast = {
  id: number;
  message: string;
  type: ToastType;
};

export type ToastContextType = {
  toast: (message: string, type?: ToastType) => void;
};

export const ToastContext = createContext<ToastContextType>({ toast: () => {} });

export const useToast = () => useContext(ToastContext);