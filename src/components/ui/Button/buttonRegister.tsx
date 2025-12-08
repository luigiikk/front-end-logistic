import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({ children, type = "button", onClick }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className="bg-[#f7b94d] border border-gray-600 text-black font-bold py-3 px-16 rounded-full hover:bg-[#e6aa3e] transition-colors shadow-md cursor-pointer"
    >
      {children}
    </button>
  );
};
