import { ContratoEntity } from "@/app/entity/ContratoEntity";
import { Messages } from "primereact/messages";
import { RefObject } from "react";

export type ApiListItem = { id: string;[key: string]: any };
export interface ContratoFormRef {
    handleSave: () => Promise<void>;
}
export interface ContratoFormProps {
    contrato: any;
    initialId?: string | null;
    onSuccess?: () => void;
    msgs: RefObject<Messages | null>;
    onContratoChange?: (contrato: ContratoEntity) => void;
    onErrorsChange?: (errors: Record<string, string>) => void;
    setContrato: React.Dispatch<React.SetStateAction<ContratoEntity>>;
    redirectAfterSave?: boolean;
    onClose?: () => void;
    onSaved?: (created: ContratoEntity) => void;
    showBTNPGCreatedDialog?: boolean;
    showBTNPGCreatedAll?: boolean;
    onBackClick?: () => void;
}
