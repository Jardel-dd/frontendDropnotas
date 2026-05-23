import { ContratoEntity } from "@/app/entity/ContratoEntity";

export interface ContratoDropdownFieldProps {
    selectedContrato: ContratoEntity | null;
    selectedContratoId?: number | null;
    onContratoChange: (contrato: ContratoEntity | null) => void;
    reloadKey?: number;
    id?: string;
    hasError?: boolean;
    errorMessage?: string;
    placeholder?: string;
    topLabel?: string;
    showTopLabel?: boolean;
    required?: boolean;
    onAddClick?: () => void;
    className?:string;
    autoSelectSingle?: boolean;
    showAddButton?: boolean;
}