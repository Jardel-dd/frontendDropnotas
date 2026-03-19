import { RefObject } from "react";
import { Messages } from "primereact/messages";
import { ServiceOrderEntity } from "@/app/entity/ServiceOrderEntity";

export type OrdemServicoParams = {
    termo?: string | null;
    idEmpresa?: number | null;
    idCliente?: number | null;
    idVendedor?: number | null;
    status?: string | null;
    data_hora_inicio?: string | null;
    data_hora_fim?: string | null;
    tipo_data?: string | null;
};
export type ApiListItem = { id: string;[key: string]: any };
export interface OrdemServicoFormRef {
    handleSave: () => Promise<void>;
}
export interface OrdemServicoFormProps {
    ordemServico: ServiceOrderEntity;
    initialId?: string | null;
    onSuccess?: () => void;
    msgs: RefObject<Messages | null>;
    onOrdemServicoChange?: (servico: ServiceOrderEntity) => void;
    onErrorsChange?: (errors: Record<string, string>) => void;
    setOrdemServico: React.Dispatch<React.SetStateAction<ServiceOrderEntity>>;
    redirectAfterSave?: boolean;
    onClose?: () => void;
    onSaved?: (created: ServiceOrderEntity) => void;
    showBTNPGCreatedDialog?: boolean;
    showBTNPGCreatedAll?: boolean;
    onBackClick?: () => void;
}