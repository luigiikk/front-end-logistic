function FormCliente() {
  return (
    <form className="flex flex-col gap-4">
      <input
        type="text"
        placeholder="Digite seu CPF"
        className="border border-gray-400 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2f446a]"
      />
      <input
        type="password"
        placeholder="Digite sua senha"
        className="border border-gray-400 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2f446a]"
      />
    </form>
  );
}

export default FormCliente;