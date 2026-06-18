import React from "react";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  className = "",
  ...props 
}) => {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        {...props} // Repassa os atributos nativos diretamente para o input
        className="border border-gray-400 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2f446a] transition-all"
      />
    </div>
  );
};

export default InputField;