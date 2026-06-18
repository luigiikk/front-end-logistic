import React from "react";

type SelectFieldProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  className?: string;
};

export function SelectField({ label, className = "", children, ...props }: SelectFieldProps) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label className="text-[10px] font-bold text-[#384A6C] uppercase tracking-widest whitespace-nowrap overflow-hidden text-ellipsis">
        {label}
      </label>
      <select
        {...props}
        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-800 bg-white appearance-none
          focus:outline-none focus:ring-2 focus:ring-[#94C0E0] focus:border-transparent transition-all"
      >
        {children}
      </select>
    </div>
  );
}