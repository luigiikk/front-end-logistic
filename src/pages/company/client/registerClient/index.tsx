import { useState } from "react";
import { api } from "../../../../api/lib/api";
import { ClientLayout } from "../../../../components/Layout/company/clientLayout";
import { FormInput } from "../../../../components/ui/Input/formRegisterClient";
import { AddressFields } from "../../../../components/Form/addresField";
import { Button } from "../../../../components/ui/Button/buttonRegister";

export default function ClientRegistration() {
  const [client, setClient] = useState({
    name: "",
    email: "",
    password: "",
    CPF: "",
    phone: "",
    CNPJ: "",
  });

  const [address, setAddress] = useState({
    country: "",
    state: "",
    city: "",
    street: "",
    number: "",
    zip: "",
    complement: "",
  });

  const handleChange = (field: string, value: string) =>
    setClient((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/client", {
        ...client,
        phone_number: client.phone,
        addressData: {
          ...address,
          number: Number(address.number),
          zipcode: address.zip,
        },
      });
      alert("Cliente cadastrado com sucesso!");
      setClient({ name: "", email: "", password: "", CPF: "", phone: "", CNPJ: "" });
      setAddress({ country: "", state: "", city: "", street: "", number: "", zip: "", complement: "" });
    } catch (error: any) {
      alert(error.response?.data?.message || "Erro ao cadastrar cliente");
    }
  };

  return (
    <ClientLayout activeSection="register" backLink="/company/client">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-xl p-10 flex flex-col justify-center min-h-[600px]">
        <h1 className="text-3xl text-center mb-8 font-normal text-black">
          Cadastro de Clientes
        </h1>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 w-full px-4 md:px-12"
        >
          <FormInput
            placeholder="Nome Completo"
            value={client.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
          <FormInput
            type="email"
            placeholder="Email"
            value={client.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
          <FormInput
            placeholder="CNPJ"
            value={client.CNPJ}
            onChange={(e) => handleChange("CNPJ", e.target.value)}
          />
          <FormInput
            placeholder="Telefone"
            value={client.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
          />
          <FormInput
            type="password"
            placeholder="Senha"
            value={client.password}
            onChange={(e) => handleChange("password", e.target.value)}
          />

          <AddressFields address={address} setAddress={setAddress} />

          <div className="flex justify-center mt-6">
            <Button type="submit">Cadastrar</Button>
          </div>
        </form>
      </div>
    </ClientLayout>
  );
}
