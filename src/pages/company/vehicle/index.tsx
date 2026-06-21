import { useState } from "react";
import { GenericPanelLayout } from "../../../components/Layout/company/layoutOption";
import {
  LuSearch,
  LuPlus,
  LuTruck,
  LuPencil,
  LuTrash2,
  LuGauge,
  LuFileText,
  LuWrench,
  LuCalendar,
  LuDollarSign,
  LuLink,
  LuUser,
} from "react-icons/lu";
import {
  type Vehicle,
  type VehicleForm,
  type VehicleDocument,
  type VehicleMaintenance,
  EMPTY_FORM,
} from "../../../types/vehicle";
import { getInitials, resolveStatusId } from "./../../../util/vehicleHelpers";
import { useVehicles } from "../../../hooks/useVehicle";
import { VehicleModal } from "../../../components/vehicle/vehicleModal";
import { DeleteVehicleModal } from "../../../components/vehicle/deleteVehicleModal";

export default function VehicleManager() {
  const {
    vehicles,
    statuses,
    loading,
    saving,
    search,
    handleSearch,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    selectedVehicleDetail,
    loadingDetails,
    fetchVehicleDetails,
    addDocument,
    updateDocument,
    deleteDocument,
    addMaintenance,
    updateMaintenance,
    deleteMaintenance,
  } = useVehicles();

  // Estados de Interface (Modais de Veículo)
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [editForm, setEditForm] = useState<VehicleForm>(EMPTY_FORM);
  
  const [creating, setCreating] = useState(false);
  const [newForm, setNewForm] = useState<VehicleForm>(EMPTY_FORM);
  
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; plate: string } | null>(null);

  // Estados do Painel de Detalhes
  const [activeTab, setActiveTab] = useState<"docs" | "maintenances">("docs");
  const [showDocForm, setShowDocForm] = useState(false);
  const [showMaintForm, setShowMaintForm] = useState(false);

  // Estados de Edição
  const [editingDocId, setEditingDocId] = useState<number | null>(null);
  const [editingMaintId, setEditingMaintId] = useState<number | null>(null);

  // Formulário de Novo Documento
  const [docType, setDocType] = useState("CRLV");
  const [customDocType, setCustomDocType] = useState("");
  const [docNumber, setDocNumber] = useState("");
  const [docIssuedAt, setDocIssuedAt] = useState("");
  const [docExpiresAt, setDocExpiresAt] = useState("");
  const [docNotes, setDocNotes] = useState("");
  const [docFileUrl, setDocFileUrl] = useState("");

  // Formulário de Nova Manutenção
  const [maintType, setMaintType] = useState("Troca de Óleo");
  const [customMaintType, setCustomMaintType] = useState("");
  const [maintDescription, setMaintDescription] = useState("");
  const [maintCost, setMaintCost] = useState("");
  const [maintMileage, setMaintMileage] = useState("");
  const [maintPerformedAt, setMaintPerformedAt] = useState("");
  const [maintNextDueAt, setMaintNextDueAt] = useState("");
  const [maintPerformedBy, setMaintPerformedBy] = useState("");

  // Handlers de UI
  const handleOpenEdit = (v: Vehicle, e: React.MouseEvent) => {
    e.stopPropagation(); // Evita selecionar a linha ao clicar no botão de editar
    setEditingVehicle(v);
    setEditForm({
      plate: v.plate,
      model: v.model,
      total_volume: v.total_volume,
      status_id: resolveStatusId(v.status, statuses),
      documents: [],
      maintenances: [],
    });
  };

  const handleDeleteClick = (v: Vehicle, e: React.MouseEvent) => {
    e.stopPropagation(); // Evita selecionar a linha ao clicar no botão de excluir
    setDeleteTarget({ id: v.id, plate: v.plate });
  };

  const handleSaveEdit = async () => {
    if (!editingVehicle) return;
    try {
      await updateVehicle(editingVehicle.id, editForm);
      setEditingVehicle(null);
    } catch (error) {
      // Tratado no hook
    }
  };

  const handleSaveNew = async () => {
    try {
      await createVehicle(newForm);
      setCreating(false);
      setNewForm(EMPTY_FORM);
    } catch (error) {
      // Tratado no hook
    }
  };

  const handleOpenNewDocForm = () => {
    setEditingDocId(null);
    setDocType("CRLV");
    setCustomDocType("");
    setDocNumber("");
    setDocIssuedAt("");
    setDocExpiresAt("");
    setDocNotes("");
    setDocFileUrl("");
    setShowDocForm(true);
  };

  const handleEditDocumentClick = (doc: VehicleDocument) => {
    setEditingDocId(doc.id);
    const standardTypes = ["CRLV", "IPVA", "Licenciamento", "CNH", "Seguro"];
    if (standardTypes.includes(doc.type)) {
      setDocType(doc.type);
      setCustomDocType("");
    } else {
      setDocType("Outro");
      setCustomDocType(doc.type);
    }
    setDocNumber(doc.number || "");
    setDocIssuedAt(doc.issued_at ? new Date(doc.issued_at).toISOString().split("T")[0] : "");
    setDocExpiresAt(doc.expires_at ? new Date(doc.expires_at).toISOString().split("T")[0] : "");
    setDocNotes(doc.notes || "");
    setDocFileUrl(doc.file_url || "");
    setShowDocForm(true);
  };

  const handleAddDocumentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVehicleDetail) return;

    const finalType = docType === "Outro" ? customDocType : docType;
    if (!finalType.trim()) return;

    try {
      if (editingDocId) {
        await updateDocument(selectedVehicleDetail.id, editingDocId, {
          type: finalType,
          number: docNumber || undefined,
          notes: docNotes || undefined,
          issued_at: docIssuedAt || undefined,
          expires_at: docExpiresAt || undefined,
          file_url: docFileUrl || undefined,
        });
      } else {
        await addDocument(selectedVehicleDetail.id, {
          type: finalType,
          number: docNumber || undefined,
          notes: docNotes || undefined,
          issued_at: docIssuedAt || undefined,
          expires_at: docExpiresAt || undefined,
          file_url: docFileUrl || undefined,
        });
      }
      // Resetar form
      setEditingDocId(null);
      setDocType("CRLV");
      setCustomDocType("");
      setDocNumber("");
      setDocIssuedAt("");
      setDocExpiresAt("");
      setDocNotes("");
      setDocFileUrl("");
      setShowDocForm(false);
    } catch {
      // Tratado no hook
    }
  };

  const handleOpenNewMaintForm = () => {
    setEditingMaintId(null);
    setMaintType("Troca de Óleo");
    setCustomMaintType("");
    setMaintDescription("");
    setMaintCost("");
    setMaintMileage("");
    setMaintPerformedAt("");
    setMaintNextDueAt("");
    setMaintPerformedBy("");
    setShowMaintForm(true);
  };

  const handleEditMaintenanceClick = (maint: VehicleMaintenance) => {
    setEditingMaintId(maint.id);
    const standardTypes = ["Troca de Óleo", "Alinhamento/Balanceamento", "Freios", "Motor", "Pneus", "Preventiva", "Corretiva"];
    if (standardTypes.includes(maint.type)) {
      setMaintType(maint.type);
      setCustomMaintType("");
    } else {
      setMaintType("Outro");
      setCustomMaintType(maint.type);
    }
    setMaintDescription(maint.description || "");
    setMaintCost(maint.cost ? String(maint.cost) : "");
    setMaintMileage(maint.mileage ? String(maint.mileage) : "");
    setMaintPerformedAt(maint.performed_at ? new Date(maint.performed_at).toISOString().split("T")[0] : "");
    setMaintNextDueAt(maint.next_due_at ? new Date(maint.next_due_at).toISOString().split("T")[0] : "");
    setMaintPerformedBy(maint.performed_by || "");
    setShowMaintForm(true);
  };

  const handleAddMaintenanceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVehicleDetail) return;

    const finalType = maintType === "Outro" ? customMaintType : maintType;
    if (!finalType.trim()) return;

    try {
      if (editingMaintId) {
        await updateMaintenance(selectedVehicleDetail.id, editingMaintId, {
          type: finalType,
          description: maintDescription || undefined,
          cost: maintCost || undefined,
          mileage: maintMileage || undefined,
          performed_at: maintPerformedAt || undefined,
          next_due_at: maintNextDueAt || undefined,
          performed_by: maintPerformedBy || undefined,
        });
      } else {
        await addMaintenance(selectedVehicleDetail.id, {
          type: finalType,
          description: maintDescription || undefined,
          cost: maintCost || undefined,
          mileage: maintMileage || undefined,
          performed_at: maintPerformedAt || undefined,
          next_due_at: maintNextDueAt || undefined,
          performed_by: maintPerformedBy || undefined,
        });
      }
      // Resetar form
      setEditingMaintId(null);
      setMaintType("Troca de Óleo");
      setCustomMaintType("");
      setMaintDescription("");
      setMaintCost("");
      setMaintMileage("");
      setMaintPerformedAt("");
      setMaintNextDueAt("");
      setMaintPerformedBy("");
      setShowMaintForm(false);
    } catch {
      // Tratado no hook
    }
  };

  // Agrupamento por tipos
  const docsByType = selectedVehicleDetail?.documents?.reduce((acc, doc) => {
    const t = doc.type || "Outros";
    if (!acc[t]) acc[t] = [];
    acc[t].push(doc);
    return acc;
  }, {} as Record<string, VehicleDocument[]>) ?? {};

  const maintsByType = selectedVehicleDetail?.maintenances?.reduce((acc, maint) => {
    const t = maint.type || "Outros";
    if (!acc[t]) acc[t] = [];
    acc[t].push(maint);
    return acc;
  }, {} as Record<string, VehicleMaintenance[]>) ?? {};

  return (
    <GenericPanelLayout panel="veiculo">
      <div className="w-full max-w-6xl mx-auto space-y-6">
        
        {/* ── Header e Busca ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#384A6C] tracking-tight flex items-center gap-2">
              <LuTruck size={22} /> Veículos, Documentos e Manutenção
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {vehicles.length} veículo{vehicles.length !== 1 ? "s" : ""} cadastrado{vehicles.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm">
              <LuSearch size={15} className="text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder="Buscar veículo..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="outline-none text-sm text-gray-700 placeholder-gray-300 w-44 sm:w-52"
              />
            </div>
            <button
              onClick={() => setCreating(true)}
              className="flex items-center gap-2 bg-[#384A6C] text-white px-4 py-2.5 rounded-xl text-sm font-bold
                hover:bg-[#2f3e5c] active:scale-95 transition-all shadow-sm shrink-0"
            >
              <LuPlus size={16} /> Novo veículo
            </button>
          </div>
        </div>

        {/* ── Painel Principal Dividido (Split Layout) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Painel Esquerdo: Lista de Veículos (col-span-5) */}
          <div className="lg:col-span-5 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="text-sm font-bold text-[#384A6C] uppercase tracking-wider">Frota de Veículos</h3>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <svg className="animate-spin h-6 w-6 text-[#94C0E0]" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <p className="text-sm text-gray-400">Carregando veículos...</p>
              </div>
            ) : vehicles.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-2 text-gray-400">
                <LuTruck size={32} className="opacity-30" />
                <p className="text-sm font-medium">Nenhum veículo encontrado.</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-50">
                {vehicles.map((v) => {
                  const isSelected = selectedVehicleDetail?.id === v.id;
                  return (
                    <li
                      key={v.id}
                      onClick={() => fetchVehicleDetails(v.id)}
                      className={`flex items-center justify-between px-6 py-4 hover:bg-[#EEF5FB]/40 transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#EEF5FB]/80 border-l-4 border-[#384A6C] pl-5"
                          : "border-l-4 border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-full bg-[#384A6C]/10 flex items-center justify-center text-[#384A6C] text-xs font-extrabold shrink-0">
                          {getInitials(v.model)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <p className="font-bold text-gray-800 text-sm">{v.plate}</p>
                            <span className="text-gray-300 text-xs">—</span>
                            <p className="text-sm text-gray-600 truncate max-w-[120px]">{v.model}</p>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5 flex-wrap">
                            <span className="flex items-center gap-0.5">
                              <LuGauge size={10} />
                              {v.available_volume}/{v.total_volume} m³
                            </span>
                            <span className="inline-flex items-center text-[10px] font-semibold px-2 py-0.1 rounded-full border bg-[#384A6C]/5 text-[#384A6C] border-[#384A6C]/10">
                              {v.status}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0 ml-2">
                        <button
                          onClick={(e) => handleOpenEdit(v, e)}
                          className="p-1.5 rounded-lg text-[#384A6C] hover:bg-[#384A6C]/10 transition"
                          title="Editar veículo"
                        >
                          <LuPencil size={14} />
                        </button>
                        <button
                          onClick={(e) => handleDeleteClick(v, e)}
                          className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition"
                          title="Excluir veículo"
                        >
                          <LuTrash2 size={14} />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Painel Direito: Detalhes, Docs e Manutenção (col-span-7) */}
          <div className="lg:col-span-7 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden min-h-[520px]">
            {loadingDetails ? (
              <div className="flex flex-col items-center justify-center py-40 gap-3">
                <svg className="animate-spin h-6 w-6 text-[#94C0E0]" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <p className="text-sm text-gray-400">Carregando documentos e manutenções...</p>
              </div>
            ) : !selectedVehicleDetail ? (
              <div className="flex flex-col items-center justify-center py-40 text-gray-400 px-6 text-center">
                <LuFileText size={48} className="opacity-20 mb-3" />
                <h3 className="text-base font-bold text-gray-600">Selecione um veículo</h3>
                <p className="text-xs max-w-xs mt-1 leading-relaxed">
                  Clique em um veículo na frota para visualizar seus documentos ativos, histórico de manutenção e registrar novos dados.
                </p>
              </div>
            ) : (
              <div className="flex flex-col h-full">
                
                {/* ── Sub-header do Veículo Selecionado ── */}
                <div className="bg-[#EEF5FB] px-6 py-4 border-b border-[#94C0E0]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-extrabold text-gray-800 text-base flex items-center gap-1.5">
                      <LuTruck className="text-[#384A6C]" size={18} />
                      {selectedVehicleDetail.plate}
                    </h3>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">{selectedVehicleDetail.model}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold bg-[#384A6C]/10 text-[#384A6C] px-2.5 py-1 rounded-full">
                      Vol. Máx: {selectedVehicleDetail.total_volume} m³
                    </span>
                    <span className="text-xs font-semibold bg-white border border-gray-200 text-gray-600 px-2.5 py-1 rounded-full">
                      Status: {typeof selectedVehicleDetail.status === "object" && selectedVehicleDetail.status ? (selectedVehicleDetail.status as any).name : selectedVehicleDetail.status}
                    </span>
                  </div>
                </div>

                {/* ── Tabs ── */}
                <div className="flex border-b border-gray-100 bg-gray-50/30">
                  <button
                    onClick={() => {
                      setActiveTab("docs");
                      setShowDocForm(false);
                      setShowMaintForm(false);
                    }}
                    className={`flex-1 py-3 text-center text-xs font-bold border-b-2 uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                      activeTab === "docs"
                        ? "border-[#384A6C] text-[#384A6C]"
                        : "border-transparent text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    <LuFileText size={14} /> Documentos ({selectedVehicleDetail.documents?.length ?? 0})
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab("maintenances");
                      setShowDocForm(false);
                      setShowMaintForm(false);
                    }}
                    className={`flex-1 py-3 text-center text-xs font-bold border-b-2 uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                      activeTab === "maintenances"
                        ? "border-[#384A6C] text-[#384A6C]"
                        : "border-transparent text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    <LuWrench size={14} /> Manutenções ({selectedVehicleDetail.maintenances?.length ?? 0})
                  </button>
                </div>

                {/* ── Conteúdo Tab: Documentos ── */}
                {activeTab === "docs" && (
                  <div className="p-6 space-y-6">
                    
                    {/* Botão de Adicionar */}
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Documentos Separados por Tipo</h4>
                      {!showDocForm && (
                        <button
                          onClick={handleOpenNewDocForm}
                          className="flex items-center gap-1 text-xs text-[#384A6C] font-bold hover:underline"
                        >
                          <LuPlus size={14} /> Novo Documento
                        </button>
                      )}
                    </div>

                    {/* Formulário Novo Doc */}
                    {showDocForm && (
                      <form onSubmit={handleAddDocumentSubmit} className="bg-gray-50 border border-gray-200 rounded-2xl p-5 space-y-4">
                        <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                          <h5 className="text-xs font-bold text-[#384A6C] uppercase tracking-wider flex items-center gap-1">
                            <LuFileText size={12} /> {editingDocId ? "Editar Documento" : "Adicionar Novo Documento"}
                          </h5>
                          <button
                            type="button"
                            onClick={() => {
                              setShowDocForm(false);
                              setEditingDocId(null);
                            }}
                            className="text-xs text-gray-400 hover:text-gray-600 font-medium"
                          >
                            Cancelar
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Tipo *</label>
                            <select
                              value={docType}
                              onChange={(e) => setDocType(e.target.value)}
                              className="px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 bg-white outline-none focus:ring-2 focus:ring-[#94C0E0]"
                            >
                              <option value="CRLV">CRLV</option>
                              <option value="IPVA">IPVA</option>
                              <option value="Licenciamento">Licenciamento</option>
                              <option value="CNH">CNH</option>
                              <option value="Seguro">Seguro</option>
                              <option value="Outro">Outro...</option>
                            </select>
                          </div>

                          {docType === "Outro" && (
                            <div className="flex flex-col gap-1">
                              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Nome do Tipo *</label>
                              <input
                                type="text"
                                required
                                placeholder="Ex: ANTT"
                                value={customDocType}
                                onChange={(e) => setCustomDocType(e.target.value)}
                                className="px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-[#94C0E0]"
                              />
                            </div>
                          )}

                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Número</label>
                            <input
                              type="text"
                              placeholder="Ex: 123456789"
                              value={docNumber}
                              onChange={(e) => setDocNumber(e.target.value)}
                              className="px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-[#94C0E0]"
                            />
                          </div>

                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Data de Emissão</label>
                            <input
                              type="date"
                              value={docIssuedAt}
                              onChange={(e) => setDocIssuedAt(e.target.value)}
                              className="px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-[#94C0E0]"
                            />
                          </div>

                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Data de Vencimento</label>
                            <input
                              type="date"
                              value={docExpiresAt}
                              onChange={(e) => setDocExpiresAt(e.target.value)}
                              className="px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-[#94C0E0]"
                            />
                          </div>

                          <div className="flex flex-col gap-1 md:col-span-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Link / URL do Arquivo</label>
                            <input
                              type="text"
                              placeholder="Ex: https://..."
                              value={docFileUrl}
                              onChange={(e) => setDocFileUrl(e.target.value)}
                              className="px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-[#94C0E0]"
                            />
                          </div>

                          <div className="flex flex-col gap-1 md:col-span-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Observações</label>
                            <textarea
                              placeholder="Notas sobre o documento..."
                              value={docNotes}
                              onChange={(e) => setDocNotes(e.target.value)}
                              className="px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-[#94C0E0] min-h-[60px]"
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-[#384A6C] hover:bg-[#2f3e5c] text-white py-2 rounded-xl font-bold text-xs transition active:scale-98"
                        >
                          {editingDocId ? "Salvar Alterações" : "Adicionar Documento"}
                        </button>
                      </form>
                    )}

                    {/* Lista Agrupada por Tipo */}
                    {Object.keys(docsByType).length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-gray-400 bg-gray-50/50 rounded-2xl border border-dashed border-gray-100 text-center px-4">
                        <LuFileText size={24} className="opacity-20 mb-1" />
                        <p className="text-xs font-semibold">Nenhum documento cadastrado</p>
                        {!showDocForm && (
                          <button
                            type="button"
                            onClick={handleOpenNewDocForm}
                            className="mt-3 px-4 py-2 bg-[#384A6C] hover:bg-[#2f3e5c] text-white rounded-xl text-xs font-bold transition-all active:scale-95 shadow-sm"
                          >
                            Adicionar Primeiro Documento
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {Object.entries(docsByType).map(([type, list]) => (
                          <div key={type} className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-extrabold text-[#384A6C] uppercase tracking-wider bg-[#384A6C]/10 px-2 py-0.5 rounded">
                                {type}
                              </span>
                              <span className="h-px bg-gray-100 flex-1"></span>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {list.map((doc) => {
                                const isExpired = doc.expires_at ? new Date(doc.expires_at) < new Date() : false;
                                return (
                                  <div
                                    key={doc.id}
                                    className="bg-white border border-gray-100 rounded-xl p-3.5 shadow-sm relative group hover:border-gray-200 transition-all flex flex-col justify-between min-h-[110px]"
                                  >
                                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                      <button
                                        type="button"
                                        onClick={() => handleEditDocumentClick(doc)}
                                        className="text-[#384A6C] hover:text-[#2f3e5c] p-1 rounded-md hover:bg-[#384A6C]/10 transition"
                                        title="Editar"
                                      >
                                        <LuPencil size={13} />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => deleteDocument(selectedVehicleDetail.id, doc.id)}
                                        className="text-red-400 hover:text-red-600 p-1 rounded-md hover:bg-red-50 transition"
                                        title="Excluir"
                                      >
                                        <LuTrash2 size={13} />
                                      </button>
                                    </div>

                                    <div>
                                      {doc.number && (
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nº {doc.number}</p>
                                      )}
                                      
                                      <div className="mt-1.5 space-y-0.5">
                                        {doc.issued_at && (
                                          <p className="text-xs text-gray-500 flex items-center gap-1">
                                            <LuCalendar size={11} className="text-gray-300" />
                                            Emissão: {new Date(doc.issued_at).toLocaleDateString("pt-BR")}
                                          </p>
                                        )}
                                        {doc.expires_at && (
                                          <p className="text-xs text-gray-500 flex items-center gap-1">
                                            <LuCalendar size={11} className="text-gray-300" />
                                            Vence:{" "}
                                            <span className={`font-semibold ${isExpired ? "text-red-500" : "text-gray-700"}`}>
                                              {new Date(doc.expires_at).toLocaleDateString("pt-BR")}
                                              {isExpired && " (Vencido)"}
                                            </span>
                                          </p>
                                        )}
                                      </div>
                                    </div>

                                    {(doc.notes || doc.file_url) && (
                                      <div className="mt-3 pt-2.5 border-t border-gray-50 flex items-center justify-between flex-wrap gap-2">
                                        {doc.notes ? (
                                          <p className="text-[11px] text-gray-400 italic truncate max-w-[130px]" title={doc.notes}>
                                            {doc.notes}
                                          </p>
                                        ) : (
                                          <span></span>
                                        )}
                                        {doc.file_url && (
                                          <a
                                            href={doc.file_url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-[11px] text-[#384A6C] font-semibold hover:underline flex items-center gap-0.5 shrink-0"
                                          >
                                            Ver Anexo <LuLink size={10} />
                                          </a>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* ── Conteúdo Tab: Manutenções ── */}
                {activeTab === "maintenances" && (
                  <div className="p-6 space-y-6">
                    
                    {/* Botão de Adicionar */}
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Histórico de Manutenções</h4>
                      {!showMaintForm && (
                        <button
                          onClick={handleOpenNewMaintForm}
                          className="flex items-center gap-1 text-xs text-[#384A6C] font-bold hover:underline"
                        >
                          <LuPlus size={14} /> Nova Manutenção
                        </button>
                      )}
                    </div>

                    {/* Formulário Nova Manutenção */}
                    {showMaintForm && (
                      <form onSubmit={handleAddMaintenanceSubmit} className="bg-gray-50 border border-gray-200 rounded-2xl p-5 space-y-4">
                        <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                          <h5 className="text-xs font-bold text-[#384A6C] uppercase tracking-wider flex items-center gap-1">
                            <LuWrench size={12} /> {editingMaintId ? "Editar Manutenção" : "Registrar Manutenção"}
                          </h5>
                          <button
                            type="button"
                            onClick={() => {
                              setShowMaintForm(false);
                              setEditingMaintId(null);
                            }}
                            className="text-xs text-gray-400 hover:text-gray-600 font-medium"
                          >
                            Cancelar
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Tipo *</label>
                            <select
                              value={maintType}
                              onChange={(e) => setMaintType(e.target.value)}
                              className="px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 bg-white outline-none focus:ring-2 focus:ring-[#94C0E0]"
                            >
                              <option value="Troca de Óleo">Troca de Óleo</option>
                              <option value="Alinhamento/Balanceamento">Alinhamento/Balanceamento</option>
                              <option value="Freios">Freios</option>
                              <option value="Motor">Motor</option>
                              <option value="Pneus">Pneus</option>
                              <option value="Preventiva">Revisão Preventiva</option>
                              <option value="Corretiva">Conserto Corretivo</option>
                              <option value="Outro">Outro...</option>
                            </select>
                          </div>

                          {maintType === "Outro" && (
                            <div className="flex flex-col gap-1">
                              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Nome do Tipo *</label>
                              <input
                                type="text"
                                required
                                placeholder="Ex: Suspensão"
                                value={customMaintType}
                                onChange={(e) => setCustomMaintType(e.target.value)}
                                className="px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-[#94C0E0]"
                              />
                            </div>
                          )}

                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Custo (R$)</label>
                            <input
                              type="number"
                              step="0.01"
                              placeholder="Ex: 250.00"
                              value={maintCost}
                              onChange={(e) => setMaintCost(e.target.value)}
                              className="px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-[#94C0E0]"
                            />
                          </div>

                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Quilometragem (Km)</label>
                            <input
                              type="number"
                              placeholder="Ex: 45000"
                              value={maintMileage}
                              onChange={(e) => setMaintMileage(e.target.value)}
                              className="px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-[#94C0E0]"
                            />
                          </div>

                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Data Realizada</label>
                            <input
                              type="date"
                              value={maintPerformedAt}
                              onChange={(e) => setMaintPerformedAt(e.target.value)}
                              className="px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-[#94C0E0]"
                            />
                          </div>

                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Próxima Revisão</label>
                            <input
                              type="date"
                              value={maintNextDueAt}
                              onChange={(e) => setMaintNextDueAt(e.target.value)}
                              className="px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-[#94C0E0]"
                            />
                          </div>

                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Realizado por (Oficina/Mecânico)</label>
                            <input
                              type="text"
                              placeholder="Ex: Auto Mecânica Silva"
                              value={maintPerformedBy}
                              onChange={(e) => setMaintPerformedBy(e.target.value)}
                              className="px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-[#94C0E0]"
                            />
                          </div>

                          <div className="flex flex-col gap-1 md:col-span-2">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Descrição dos Serviços</label>
                            <textarea
                              placeholder="Detalhes dos serviços realizados ou peças trocadas..."
                              value={maintDescription}
                              onChange={(e) => setMaintDescription(e.target.value)}
                              className="px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-[#94C0E0] min-h-[60px]"
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-[#384A6C] hover:bg-[#2f3e5c] text-white py-2 rounded-xl font-bold text-xs transition active:scale-98"
                        >
                          {editingMaintId ? "Salvar Alterações" : "Salvar Manutenção"}
                        </button>
                      </form>
                    )}

                    {/* Lista Agrupada por Tipo */}
                    {Object.keys(maintsByType).length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-gray-400 bg-gray-50/50 rounded-2xl border border-dashed border-gray-100 text-center px-4">
                        <LuWrench size={24} className="opacity-20 mb-1" />
                        <p className="text-xs font-semibold">Nenhuma manutenção registrada</p>
                        {!showMaintForm && (
                          <button
                            type="button"
                            onClick={handleOpenNewMaintForm}
                            className="mt-3 px-4 py-2 bg-[#384A6C] hover:bg-[#2f3e5c] text-white rounded-xl text-xs font-bold transition-all active:scale-95 shadow-sm"
                          >
                            Registrar Primeira Manutenção
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {Object.entries(maintsByType).map(([type, list]) => (
                          <div key={type} className="space-y-3">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-extrabold text-[#384A6C] uppercase tracking-wider bg-[#384A6C]/10 px-2 py-0.5 rounded">
                                {type}
                              </span>
                              <span className="h-px bg-gray-100 flex-1"></span>
                            </div>

                            <div className="space-y-2">
                              {list.map((maint) => (
                                <div
                                  key={maint.id}
                                  className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm relative group hover:border-gray-200 transition-all flex flex-col justify-between gap-3"
                                >
                                  <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                    <button
                                      type="button"
                                      onClick={() => handleEditMaintenanceClick(maint)}
                                      className="text-[#384A6C] hover:text-[#2f3e5c] p-1 rounded-md hover:bg-[#384A6C]/10 transition"
                                      title="Editar"
                                    >
                                      <LuPencil size={13} />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => deleteMaintenance(selectedVehicleDetail.id, maint.id)}
                                      className="text-red-400 hover:text-red-600 p-1 rounded-md hover:bg-red-50 transition"
                                      title="Excluir"
                                    >
                                      <LuTrash2 size={13} />
                                    </button>
                                  </div>

                                  <div className="pr-6">
                                    {maint.description ? (
                                      <p className="text-sm font-semibold text-gray-800">{maint.description}</p>
                                    ) : (
                                      <p className="text-xs text-gray-400 italic">Sem descrição adicional</p>
                                    )}
                                  </div>

                                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 border-t border-gray-50 text-xs text-gray-500">
                                    {maint.cost != null && (
                                      <div className="space-y-0.5">
                                        <p className="font-bold text-[#384A6C] flex items-center gap-0.5">
                                          <LuDollarSign size={10} /> Custo
                                        </p>
                                        <p className="text-gray-700 font-medium">R$ {Number(maint.cost).toFixed(2)}</p>
                                      </div>
                                    )}
                                    {maint.mileage != null && (
                                      <div className="space-y-0.5">
                                        <p className="font-bold text-[#384A6C] flex items-center gap-0.5">
                                          <LuGauge size={10} /> Km
                                        </p>
                                        <p className="text-gray-700 font-medium">{maint.mileage} km</p>
                                      </div>
                                    )}
                                    {maint.performed_at && (
                                      <div className="space-y-0.5">
                                        <p className="font-bold text-[#384A6C] flex items-center gap-0.5">
                                          <LuCalendar size={10} /> Realizada
                                        </p>
                                        <p className="text-gray-700 font-medium">
                                          {new Date(maint.performed_at).toLocaleDateString("pt-BR")}
                                        </p>
                                      </div>
                                    )}
                                    {maint.next_due_at && (
                                      <div className="space-y-0.5">
                                        <p className="font-bold text-[#384A6C] flex items-center gap-0.5">
                                          <LuCalendar size={10} /> Próxima
                                        </p>
                                        <p className="text-gray-700 font-medium">
                                          {new Date(maint.next_due_at).toLocaleDateString("pt-BR")}
                                        </p>
                                      </div>
                                    )}
                                  </div>

                                  {maint.performed_by && (
                                    <div className="pt-2 text-[10px] text-gray-400 flex items-center gap-1 border-t border-dashed border-gray-50">
                                      <LuUser size={10} /> Realizado por: <span className="font-semibold text-gray-500">{maint.performed_by}</span>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

              </div>
            )}
          </div>
          
        </div>
      </div>

      {/* ── Modais de Veículo ── */}
      {editingVehicle && (
        <VehicleModal
          title={`Editar — ${editingVehicle.plate}`}
          form={editForm}
          statuses={statuses}
          onChange={setEditForm}
          onConfirm={handleSaveEdit}
          onClose={() => setEditingVehicle(null)}
          confirmLabel="Salvar alterações"
          loading={saving}
          isCreating={false}
        />
      )}

      {creating && (
        <VehicleModal
          title="Novo Veículo"
          form={newForm}
          statuses={statuses}
          onChange={setNewForm}
          onConfirm={handleSaveNew}
          onClose={() => { setCreating(false); setNewForm(EMPTY_FORM); }}
          confirmLabel="Cadastrar"
          loading={saving}
          isCreating={true}
        />
      )}

      {deleteTarget && (
        <DeleteVehicleModal
          plate={deleteTarget.plate}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => {
            deleteVehicle(deleteTarget.id);
            setDeleteTarget(null);
          }}
        />
      )}
    </GenericPanelLayout>
  );
}