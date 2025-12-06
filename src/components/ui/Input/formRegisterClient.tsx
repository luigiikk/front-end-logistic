import React from "react";

interface FormInputProps {
  label?: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  options?: { value: string; label: string }[]; // para select
}

export const FormInput: React.FC<FormInputProps> = ({ label, type = "text", placeholder, value, onChange, options }) => {
  if (options) {
    return (
      <select className="form-input cursor-pointer" value={value} onChange={onChange}>
        <option value="" disabled>{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    );
  }

  return (
    <input
      type={type}
      placeholder={placeholder}
      className="form-input"
      value={value}
      onChange={onChange}
    />
  );
};
