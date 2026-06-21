import React from "react";

type SelectFieldProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  icon?: React.ComponentType<any>;
  containerClassName?: string;
};

export function SelectField({
  label,
  icon: Icon,
  containerClassName = "",
  className = "",
  children,
  ...props
}: SelectFieldProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
      <label className="text-[10px] font-bold text-[#384A6C] uppercase tracking-widest whitespace-nowrap overflow-hidden text-ellipsis">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94C0E0] pointer-events-none">
            <Icon size={14} className="h-3.5 w-3.5" />
          </span>
        )}
        <select
          {...props}
          className={`w-full ${Icon ? "pl-8" : "pl-3"} pr-8 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 bg-white appearance-none
            focus:outline-none focus:ring-2 focus:ring-[#94C0E0] focus:border-transparent transition-all ${className}`}
        >
          {children}
        </select>
        <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-xs text-gray-400">
          ▼
        </span>
      </div>
    </div>
  );
}

export default SelectField;