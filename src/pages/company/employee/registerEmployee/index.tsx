import { useEffect, useState } from "react";
import { api } from "../../../../api/lib/api";
import { EmployeeLayout } from "../../../../components/Layout/company/employeeLayout";
import { FormInput } from "../../../../components/ui/Input/formRegisterClient";
import { AddressFields } from "../../../../components/Form/addresField";
import { Button } from "../../../../components/ui/Button/buttonRegister";

export default function EmployeeRegistration() {
  const [employee, setEmployee] = useState({
    name: "",
    phone: "",
    email: "",
    role: "",
    password: "",
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

  const [roles, setRoles] = useState<{ id: number; name: string }[]>([]);

  const handleChangeEmployee = (field: string, value: string) =>
    setEmployee((prev) => ({ ...prev, [field]: value }));

  const handleChangeRole = (field: string, value: string) =>
    setRoles((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/employee", {
        ...employee,
        employee_roles: Number(employee.role),
        phone_number: employee.phone,
        addressData: {
          ...address,
          number: Number(address.number),
          zipcode: address.zip,
        },
      });

      alert("Funcionário cadastrado com sucesso!");
      setEmployee({ name: "", phone: "", email: "", role: "", password: "" });
      setAddress({
        country: "",
        state: "",
        city: "",
        street: "",
        number: "",
        zip: "",
        complement: "",
      });
    } catch (error: any) {
      alert(error.response?.data?.message || "Erro ao cadastrar funcionário");
    }
  };

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await api.get("/roules");
        setRoles(response.data);
      } catch (error) {
        console.error("Erro ao buscar cargos:", error);
      }
    };

    fetchRoles();
  }, []);

  return (
    <EmployeeLayout activeSection="register" backLink="/company/employee">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-xl p-10 flex flex-col justify-center min-h-[600px]">
        <h1 className="text-3xl text-center mb-8 font-normal text-black">
          Cadastro de Funcionários
        </h1>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 w-full px-4 md:px-12"
        >
          <FormInput
            placeholder="Nome Completo"
            value={employee.name}
            onChange={(e) => handleChangeEmployee("name", e.target.value)}
          />
          <FormInput
            placeholder="Telefone"
            value={employee.phone}
            onChange={(e) => handleChangeEmployee("phone", e.target.value)}
          />
          <FormInput
            type="email"
            placeholder="Email"
            value={employee.email}
            onChange={(e) => handleChangeEmployee("email", e.target.value)}
          />
          <FormInput
            type="password"
            placeholder="Senha"
            value={employee.password}
            onChange={(e) => handleChangeEmployee("password", e.target.value)}
          />
          <FormInput
            placeholder="Selecione o cargo"
            value={employee.role}
            onChange={(e) => handleChangeEmployee("role", e.target.value)}
            options={roles.map((role) => ({
              value: String(role.id),
              label: role.name,
            }))}
          />
          <AddressFields address={address} setAddress={setAddress} />
          <div className="flex justify-center mt-6">
            <Button type="submit">Cadastrar</Button>
          </div>
        </form>
      </div>
    </EmployeeLayout>
  );
}
