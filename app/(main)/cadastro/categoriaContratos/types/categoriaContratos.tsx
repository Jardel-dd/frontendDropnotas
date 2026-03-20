import { CategoryContratosEntity } from "@/app/entity/CategoryContratEntity";
import { Messages } from "primereact/messages";
import { RefObject } from "react";

export interface CategoriaContratoFormRef {
    handleSave: () => Promise<void>;
}

export interface CategoriaContratoFormProps {
    categoriaContrato: any;
    initialId?: string | null;
    onSuccess?: () => void;
    msgs: RefObject<Messages | null>;
    onCategoriaContratoChange?: (servico: CategoryContratosEntity) => void;
    onErrorsChange?: (errors: Record<string, string>) => void;
    setCategoriaContrato: React.Dispatch<React.SetStateAction<CategoryContratosEntity>>;
    redirectAfterSave?: boolean;
    onSaved?: (created: CategoryContratosEntity) => void;
    onClose?: () => void;
    showBTNPGCreatedDialog?: boolean;
    showBTNPGCreatedAll?: boolean;
    onBackClick?: () => void;
}


export interface CategoriaContratoFieldsProps {
    categoriaContrato: CategoryContratosEntity;
    errors: Record<string, string>;
    onChange: (event: {
        target: {
            id: string;
            value: any;
            checked?: any;
            type: string;
        };
    }) => void;
    onValidateDescricao: () => void;
}

export type FormCategoriaContratoCreatedProps =
    | CategoriaContratoFieldsProps
    | CategoriaContratoFormProps;

export interface CategoriaContratoDropdownFieldProps {
    selectedCategoriaContrato: CategoryContratosEntity | null;
    onCategoriaContratoChange: (categoriaContrato: CategoryContratosEntity | null) => void;
    reloadKey?: number;
    hasError?: boolean;
    errorMessage?: string;
    showAddButton?: boolean;
    onAddClick?: () => void;
    autoSelectSingle?: boolean;
}
