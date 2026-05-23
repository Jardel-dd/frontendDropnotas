import { ContratoEntity } from "@/app/entity/ContratoEntity";
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
export type ClienteFornecedorFilter = {
        cliente: boolean;
        fornecedor: boolean;
    };
export interface PessoaFieldsProps {
    pessoa: PessoaEntity;
    errors: Record<string, string>;
    selectedContato: string | null;
    selectedContrato: ContratoEntity | null;
    selectedCNAE: TableCNAEEntity | null;
    loadingCnpj: boolean;
    hasFocused: boolean;
    reloadKeyContrato: number;
    onAddContato: () => void;
    onFocusFirstField: () => void;
    onChange: (event: any) => void;
    onDropdownChange: (event: DropdownChangeEvent) => void;
    onContatoChange: (event: DropdownChangeEvent) => void;
    onAddContrato: () => void;
    onContratoChange: (contrato: ContratoEntity | null) => void;
    onCNAEChange: (cnae: TableCNAEEntity | null) => void;
    onSearchCnpj: () => Promise<void>;
    onValidateCnpj: () => void;
    fetchAllCnae: (...args: any[]) => any;
    fetchFilteredCnae: (...args: any[]) => any;
}
export interface PessoaDropdownFieldProps {
    selectedPessoa: PessoaEntity | null;
    selectedPessoaId?: number | null;
    onPessoaChange: (pessoa: PessoaEntity | null) => void;
    reloadKey?: number;
    id?: string;
    hasError?: boolean;
    errorMessage?: string;
    placeholder?: string;
    topLabel?: string;
    showTopLabel?: boolean;
    required?: boolean;
    onAddClick?: () => void;
    autoSelectSingle?: boolean;
    showAddButton?: boolean;
}
