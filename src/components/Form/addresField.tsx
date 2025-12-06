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
      <FormInput placeholder="País" value={address.country} onChange={(e) => handleChange("country", e.target.value)} />
      <FormInput placeholder="Estado" value={address.state} onChange={(e) => handleChange("state", e.target.value)} />
      <FormInput placeholder="Cidade" value={address.city} onChange={(e) => handleChange("city", e.target.value)} />
      <FormInput placeholder="Rua" value={address.street} onChange={(e) => handleChange("street", e.target.value)} />
      <FormInput type="number" placeholder="Número" value={address.number} onChange={(e) => handleChange("number", e.target.value)} />
      <FormInput placeholder="CEP" value={address.zip} onChange={(e) => handleChange("zip", e.target.value)} />
      <FormInput placeholder="Complemento (opcional)" value={address.complement} onChange={(e) => handleChange("complement", e.target.value)} />
    </div>
  );
};
