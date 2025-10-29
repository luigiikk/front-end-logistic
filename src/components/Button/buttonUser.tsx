type ButtonUserProps = {
  funcao: string; // nome do tipo (funcionário, empresa, cliente)
  selecionado: boolean; // indica se este botão está ativo
  onClick: () => void; // função chamada ao clicar
};

function ButtonUser({ funcao, selecionado, onClick }: ButtonUserProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1 rounded-full text-sm border transition cursor-pointer
        ${selecionado
          ? "bg-[#2f446a] text-white border-[#2f446a]" // quando está ativo
          : "border-gray-400 text-gray-700 hover:bg-gray-100" // estado normal
        }`}
    >
      {funcao}
    </button>
  );
}

export default ButtonUser;
