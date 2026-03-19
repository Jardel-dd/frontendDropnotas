import { RefObject } from "react";
import { Messages } from "primereact/messages";
import { DropdownChangeEvent } from "primereact/dropdown";
import { VendedorEntity } from "@/app/entity/VendedorEntity";

export interface VendedorFormRef {
    handleSave: () => Promise<void>;
}
export interface VendedorFieldsProps {
    vendedor: VendedorEntity;
    errors: Record<string, string>;
    loadingCnpj: boolean;
    hasFocused: boolean;
    onFocusFirstField: () => void;
    onChange: (event: any) => void;
    onDropdownChange: (event: DropdownChangeEvent) => void;
    onSearchCnpj: () => Promise<void>;
    onValidateCnpj: () => void;
    onValidateTelefone?: () => void;
}
export interface VendedorFormProps {
    vendedor: any;
    initialId?: string | null;
    onSuccess?: () => void;
    msgs: RefObject<Messages | null>;
    onVendedorChange?: (servico: VendedorEntity) => void;
    onErrorsChange?: (errors: Record<string, string>) => void;
    setVendedor: React.Dispatch<React.SetStateAction<VendedorEntity>>;
    redirectAfterSave?: boolean;
    onClose?: () => void;
    onSaved?: (created: VendedorEntity) => void;
    showBTNPGCreatedDialog?: boolean;
    showBTNPGCreatedAll?: boolean;
    onBackClick?: () => void;
}
export type FormCreatedVendedorProps = VendedorFieldsProps | VendedorFormProps;
