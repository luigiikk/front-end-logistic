type ButtonProps = {
  titulo: string;
};

function ButtonForm({ titulo }: ButtonProps) {
  return (
    <>
      <button
        type="submit"
        className="bg-[#f7b94d] text-black font-semibold py-2 px-6 rounded-xl hover:bg-[#e6aa3e] transition cursor-pointer mx-auto block"
      >
        {titulo}
      </button>
    </>
  );
}

export default ButtonForm;
