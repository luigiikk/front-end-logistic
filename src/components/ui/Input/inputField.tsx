import React from "react";
import { maskCNPJ, maskPhone, maskZip } from "../../../util/clientHelpers";
import { maskCPF } from "../../../util/orderHelpers";

export type MaskType = "cpf" | "cnpj" | "phone" | "cep" | "number";

interface InputFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label?: string;
  icon?: React.ComponentType<any>;
  maskType?: MaskType;
  customMask?: (v: string) => string;
  error?: string;
  containerClassName?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  icon: Icon,
  maskType,
  customMask,
  error,
  containerClassName = "",
  className = "",
  onChange,
  ...props
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (maskType) {
      let val = e.target.value;
      if (maskType === "cpf") val = maskCPF(val);
      else if (maskType === "cnpj") val = maskCNPJ(val);
      else if (maskType === "phone") val = maskPhone(val);
      else if (maskType === "cep") val = maskZip(val);
      else if (maskType === "number") val = val.replace(/\D/g, "");
      e.target.value = val;
    } else if (customMask) {
      e.target.value = customMask(e.target.value);
    }

    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
      {label && (
        <label className="text-[10px] font-bold text-[#384A6C] uppercase tracking-widest">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94C0E0]">
            <Icon size={14} className="h-3.5 w-3.5" />
          </span>
        )}
        <input
          {...props}
          onChange={handleChange}
          className={`w-full ${Icon ? "pl-8" : "pl-3"} pr-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-300 bg-white
            focus:outline-none focus:ring-2 focus:ring-[#94C0E0] focus:border-transparent transition-all ${
              error ? "border-red-300 focus:ring-red-200" : ""
            } ${className}`}
        />
      </div>
      {error && <span className="text-[10px] font-medium text-red-500 mt-0.5">{error}</span>}
    </div>
  );
};

export default InputField;
export { InputField };
export type { InputFieldProps };