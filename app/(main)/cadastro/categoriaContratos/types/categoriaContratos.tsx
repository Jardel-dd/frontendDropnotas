import { RefObject } from "react";
import { Messages } from "primereact/messages";
import { CategoryContratosEntity } from "@/app/entity/CategoryContratEntity";


export interface CategoriaContratoFormRef {
    handleSave: () => Promise<void>;
}
export interface CategoriaContratoFormProps {
    categoriaContrato: any;
    initialId?: string | null;
    preloadedCategoriaContrato?: CategoryContratosEntity | null;
    onSuccess?: () => void;
    msgs: RefObject<Messages | null>;
    onCategoriaContratoChange?: (servico: CategoryContratosEntity) => void;
    onErrorsChange?: (errors: Record<string, string>) => void;
    setCategoriaContrato: React.Dispatch<React.SetStateAction<CategoryContratosEntity>>;
    redirectAfterSave?: boolean;
    onSaved?: (created: CategoryContratosEntity) => void | Promise<void>;
    onClose?: () => void;
    onLoadingChange?: (loading: boolean) => void;
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
export interface CategoriaContratoDropdownFieldProps {
    selectedCategoriaContrato: CategoryContratosEntity | null;
    selectedCategoriaContratoId?: number | null;
    onCategoriaContratoChange: (categoriaContrato: CategoryContratosEntity | null) => void;
    onEditClick?: (categoriaContrato: CategoryContratosEntity) => void;
    reloadKey?: number;
    hasError?: boolean;
    errorMessage?: string;
    showAddButton?: boolean;
    onAddClick?: () => void;
    autoSelectSingle?: boolean;
    loadOnMount?: boolean;
    useCachedAllItems?: boolean;
}
export type FormCategoriaContratoCreatedProps = | CategoriaContratoFieldsProps | CategoriaContratoFormProps;
export const CATEGORIA_CONTRATO_DROPDOWN_CACHE_TIME_MS = 5 * 60 * 1000;
