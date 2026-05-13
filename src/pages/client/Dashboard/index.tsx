import { GenericPanelLayout } from "../../../components/Layout/company/layoutOption";
// Substituímos LuCheckCircle por LuCircleCheck (ou LuCheckCircle2 se preferir)
import { LuBox, LuMapPin, LuClock, LuCircleCheck } from "react-icons/lu";

export default function ClientDashboard() {
  return (
    <GenericPanelLayout panel="pedido"> 
      <div className="w-full max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-extrabold text-[#384A6C] tracking-tight">Meus Pedidos</h1>
          <p className="text-sm text-gray-400 mt-0.5">Acompanhe as suas entregas em tempo real</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card: A caminho */}
          <div className="bg-[#384A6C] p-6 rounded-3xl shadow-lg text-white space-y-4">
            <LuBox size={30} className="text-[#94C0E0]" />
            <div>
              <p className="text-3xl font-black">04</p>
              <p className="text-sm opacity-80">Encomendas a caminho</p>
            </div>
          </div>

          {/* Card: Concluídas - Usando LuCircleCheck */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <LuCircleCheck size={30} className="text-emerald-500" />
            <div>
              <p className="text-3xl font-black text-[#384A6C]">12</p>
              <p className="text-sm text-gray-400">Entregas concluídas</p>
            </div>
          </div>

          {/* Card: Aguardando */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <LuClock size={30} className="text-orange-500" />
            <div>
              <p className="text-3xl font-black text-[#384A6C]">01</p>
              <p className="text-sm text-gray-400">Aguardando recolha</p>
            </div>
          </div>
        </div>
      </div>
    </GenericPanelLayout>
  );
}