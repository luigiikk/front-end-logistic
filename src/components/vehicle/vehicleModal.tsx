import { LuX, LuPlus, LuTrash2 } from "react-icons/lu";
import InputField from "../ui/Input/inputField";
import { SelectField } from "../ui/selectField";
import type { VehicleForm, Status } from "../../types/vehicle";
import { maskPlate } from "../../util/vehicleHelpers";

type ModalProps = {
  title: string;
  form: VehicleForm;
  statuses: Status[];
  onChange: (f: VehicleForm) => void;
  onConfirm: () => void;
  onClose: () => void;
  confirmLabel: string;
  loading: boolean;
  isCreating?: boolean;
};

export function VehicleModal({
  title, form, statuses, onChange, onConfirm, onClose, confirmLabel, loading, isCreating
}: ModalProps) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-7 pb-4 border-b border-gray-100 shrink-0">
          <h2 className="text-xl font-extrabold text-[#384A6C] tracking-tight">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition p-1 rounded-lg hover:bg-gray-100">
            <LuX size={20} />
          </button>
        </div>

        <div className="px-8 py-6 space-y-6 overflow-y-auto">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <InputField
                label="Placa"
                placeholder="ABC1D23"
                value={form.plate}
                onChange={(e) => onChange({ ...form, plate: maskPlate(e.target.value) })}
              />
              <InputField
                label="Modelo"
                placeholder="Ex: Fiat Ducato"
                value={form.model}
                onChange={(e) => onChange({ ...form, model: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <InputField
                label="Volume total (m³)"
                type="number"
                min={0}
                step={0.1}
                placeholder="0"
                value={form.total_volume}
                onChange={(e) => onChange({ ...form, total_volume: e.target.value })}
              />
              <SelectField
                label="Status"
                value={form.status_id}
                onChange={(e) => onChange({ ...form, status_id: Number(e.target.value) })}
              >
                <option value={0}>Selecione...</option>
                {statuses.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </SelectField>
            </div>
          </div>

          {/* Docs & Manutenções (Exibidos Apenas na Criação) */}
          {isCreating && (
            <>
              {/* Documentos */}
              <div className="border-t border-gray-100 pt-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[12px] font-bold text-[#384A6C] uppercase tracking-widest">Documentos</h3>
                  <button
                    onClick={() => onChange({ 
                      ...form, 
                      documents: [...form.documents, { type: "", number: "", notes: "", issued_at: "", expires_at: "", file_url: "" }] 
                    })}
                    className="flex items-center gap-1 text-xs font-bold text-[#94C0E0] hover:text-[#7bb0d6] transition-colors"
                  >
                    <LuPlus size={14} /> Adicionar Documento
                  </button>
                </div>
                {form.documents.length === 0 ? (
                  <p className="text-xs text-gray-400 italic mb-2">Nenhum documento adicionado.</p>
                ) : (
                  <div className="space-y-4">
                    {form.documents.map((doc, idx) => (
                      <div key={idx} className="flex flex-col gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100 relative">
                        <button
                          onClick={() => {
                            const newDocs = form.documents.filter((_, i) => i !== idx);
                            onChange({ ...form, documents: newDocs });
                          }}
                          className="absolute top-3 right-3 p-1.5 text-red-400 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          <LuTrash2 size={16} />
                        </button>
                        <div className="grid grid-cols-3 gap-3 pr-8">
                          <InputField
                            label="Tipo *"
                            placeholder="Ex: CRLV"
                            value={doc.type}
                            onChange={(e) => {
                              const newDocs = [...form.documents];
                              newDocs[idx].type = e.target.value;
                              onChange({ ...form, documents: newDocs });
                            }}
                          />
                          <InputField
                            label="Número"
                            placeholder="Opcional"
                            value={doc.number || ""}
                            onChange={(e) => {
                              const newDocs = [...form.documents];
                              newDocs[idx].number = e.target.value;
                              onChange({ ...form, documents: newDocs });
                            }}
                          />
                          <InputField
                            label="URL do Arquivo"
                            placeholder="https://..."
                            type="url"
                            value={doc.file_url || ""}
                            onChange={(e) => {
                              const newDocs = [...form.documents];
                              newDocs[idx].file_url = e.target.value;
                              onChange({ ...form, documents: newDocs });
                            }}
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <InputField
                            label="Data de Emissão"
                            type="date"
                            value={doc.issued_at || ""}
                            onChange={(e) => {
                              const newDocs = [...form.documents];
                              newDocs[idx].issued_at = e.target.value;
                              onChange({ ...form, documents: newDocs });
                            }}
                          />
                          <InputField
                            label="Data de Vencimento"
                            type="date"
                            value={doc.expires_at || ""}
                            onChange={(e) => {
                              const newDocs = [...form.documents];
                              newDocs[idx].expires_at = e.target.value;
                              onChange({ ...form, documents: newDocs });
                            }}
                          />
                          <InputField
                            label="Notas"
                            placeholder="Opcional"
                            value={doc.notes || ""}
                            onChange={(e) => {
                              const newDocs = [...form.documents];
                              newDocs[idx].notes = e.target.value;
                              onChange({ ...form, documents: newDocs });
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Manutenções */}
              <div className="border-t border-gray-100 pt-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[12px] font-bold text-[#384A6C] uppercase tracking-widest">Manutenções Iniciais</h3>
                  <button
                    onClick={() => onChange({ 
                      ...form, 
                      maintenances: [...form.maintenances, { type: "", description: "", cost: "", performed_at: "", next_due_at: "" }] 
                    })}
                    className="flex items-center gap-1 text-xs font-bold text-[#94C0E0] hover:text-[#7bb0d6] transition-colors"
                  >
                    <LuPlus size={14} /> Adicionar Manutenção
                  </button>
                </div>
                {form.maintenances.length === 0 ? (
                  <p className="text-xs text-gray-400 italic mb-2">Nenhuma manutenção adicionada.</p>
                ) : (
                  <div className="space-y-4">
                    {form.maintenances.map((maint, idx) => (
                      <div key={idx} className="flex flex-col gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100 relative">
                        <button
                          onClick={() => {
                            const newMaints = form.maintenances.filter((_, i) => i !== idx);
                            onChange({ ...form, maintenances: newMaints });
                          }}
                          className="absolute top-3 right-3 p-1.5 text-red-400 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          <LuTrash2 size={16} />
                        </button>

                        <div className="grid grid-cols-2 gap-3 pr-8">
                          <InputField
                            label="Tipo *"
                            placeholder="Ex: Troca de Óleo"
                            value={maint.type}
                            onChange={(e) => {
                              const newMaints = [...form.maintenances];
                              newMaints[idx].type = e.target.value;
                              onChange({ ...form, maintenances: newMaints });
                            }}
                          />
                          <InputField
                            label="Custo (R$)"
                            type="number"
                            step={0.01}
                            min={0}
                            placeholder="0.00"
                            value={maint.cost || ""}
                            onChange={(e) => {
                              const newMaints = [...form.maintenances];
                              newMaints[idx].cost = e.target.value;
                              onChange({ ...form, maintenances: newMaints });
                            }}
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <InputField
                            label="Data Realizada"
                            type="date"
                            value={maint.performed_at || ""}
                            onChange={(e) => {
                              const newMaints = [...form.maintenances];
                              newMaints[idx].performed_at = e.target.value;
                              onChange({ ...form, maintenances: newMaints });
                            }}
                          />
                          <InputField
                            label="Próxima Data"
                            type="date"
                            value={maint.next_due_at || ""}
                            onChange={(e) => {
                              const newMaints = [...form.maintenances];
                              newMaints[idx].next_due_at = e.target.value;
                              onChange({ ...form, maintenances: newMaints });
                            }}
                          />
                          <InputField
                            label="Descrição"
                            placeholder="Opcional"
                            value={maint.description || ""}
                            onChange={(e) => {
                              const newMaints = [...form.maintenances];
                              newMaints[idx].description = e.target.value;
                              onChange({ ...form, maintenances: newMaints });
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer / Botões */}
        <div className="flex justify-end gap-3 px-8 py-5 border-t border-gray-100 shrink-0">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition">
            Cancelar
          </button>
          <button onClick={onConfirm} disabled={loading} className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-[#384A6C] hover:bg-[#2f3e5c] active:scale-95 transition-all disabled:opacity-60">
            {loading ? "Salvando..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}