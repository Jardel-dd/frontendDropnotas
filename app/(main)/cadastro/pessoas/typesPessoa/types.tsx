import { PessoaEntity } from "@/app/entity/PessoaEntity";
import { TableCNAEEntity } from "@/app/entity/TableCNAEEntity";
import { DropdownChangeEvent } from "primereact/dropdown";
import { Messages } from "primereact/messages";
import { RefObject } from "react";

export interface PessoaFormProps {
    pessoa: any;
    initialId?: string | null;
    onSuccess?: () => void;
    msgs: RefObject<Messages | null>;
    onPessoaChange?: (pessoa: PessoaEntity) => void;
    onErrorsChange?: (errors: Record<string, string>) => void;
    setPessoa?: React.Dispatch<React.SetStateAction<any>>;
    redirectAfterSave?: boolean;
    onClose?: () => void;
    onSaved?: (created: PessoaEntity) => void;
    showBTNPGCreatedDialog?: boolean;
    showBTNPGCreatedAll?: boolean;
    onBackClick?: () => void;
}
export interface PessoaFormRef {
    handleSave: () => Promise<void>;
}
export type FormPessoaCreatedProps = PessoaFieldsProps | PessoaFormProps;

export interface PessoaFieldsProps {
    pessoa: PessoaEntity;
    errors: Record<string, string>;
    selectedContato: string[];
    selectedCNAE: TableCNAEEntity | null;
    loadingCnpj: boolean;
    hasFocused: boolean;
    onFocusFirstField: () => void;
    onChange: (event: any) => void;
    onDropdownChange: (event: DropdownChangeEvent) => void;
    onContatoChange: (event: any) => void;
    onCNAEChange: (cnae: TableCNAEEntity | null) => void;
    onSearchCnpj: () => Promise<void>;
    onValidateCnpj: () => void;
    fetchAllCnae: (...args: any[]) => any;
    fetchFilteredCnae: (...args: any[]) => any;
}

export interface PessoaDropdownFieldProps {
    selectedPessoa: PessoaEntity | null;
    onPessoaChange: (pessoa: PessoaEntity | null) => void;
    reloadKey?: number;
    hasError?: boolean;
    errorMessage?: string;
}
