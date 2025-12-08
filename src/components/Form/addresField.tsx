import React from "react";
import { FormInput } from "../ui/Input/formRegisterClient";

interface AddressProps {
  address: {
    country: string;
    state: string;
    city: string;
    street: string;
    number: string;
    zip: string;
    complement: string;
  };
  setAddress: React.Dispatch<React.SetStateAction<any>>;
}

export const AddressFields: React.FC<AddressProps> = ({ address, setAddress }) => {
  const handleChange = (field: string, value: string) => {
    setAddress((prev: any) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

      <FormInput
        label="País"
        placeholder="Digite o país"
        value={address.country}
        onChange={(e) => handleChange("country", e.target.value)}
      />

      <FormInput
        label="Estado"
        placeholder="Digite o estado"
        value={address.state}
        onChange={(e) => handleChange("state", e.target.value)}
      />

      <FormInput
        label="Cidade"
        placeholder="Digite a cidade"
        value={address.city}
        onChange={(e) => handleChange("city", e.target.value)}
      />

      <FormInput
        label="Rua"
        placeholder="Digite a rua"
        value={address.street}
        onChange={(e) => handleChange("street", e.target.value)}
      />

      <FormInput
        label="Número"
        type="number"
        placeholder="Digite o número"
        value={address.number}
        onChange={(e) => handleChange("number", e.target.value)}
      />

      <FormInput
        label="CEP"
        placeholder="Digite o CEP"
        value={address.zip}
        onChange={(e) => handleChange("zip", e.target.value)}
      />

      <FormInput
        label="Complemento"
        placeholder="Opcional"
        value={address.complement}
        onChange={(e) => handleChange("complement", e.target.value)}
      />

    </div>
  );
};
