interface InputFieldProps {
  label?: string;
  placeholder: string;
  type?: string;
  name?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  type = "text",
  name,
  value,
  onChange,
}) => {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="border border-gray-400 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2f446a]"
      />
    </div>
  );
};

export default InputField;
