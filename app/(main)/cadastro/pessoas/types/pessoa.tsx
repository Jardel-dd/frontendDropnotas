import { RefObject } from "react";
import { Messages } from "primereact/messages";
import { PessoaEntity } from "@/app/entity/PessoaEntity";
import { DropdownChangeEvent } from "primereact/dropdown";
import { ContratoEntity } from "@/app/entity/ContratoEntity";
import { VendedorEntity } from "@/app/entity/VendedorEntity";
import { TableCNAEEntity } from "@/app/entity/TableCNAEEntity";
import { MultiSelectChangeEvent } from "primereact/multiselect";

const normalizeBooleanFlag = (value: boolean | string | number | null | undefined): boolean =>
    value === true || value === 'true' || value === 1 || value === '1';

export interface PessoaFormProps {
    pessoa?: PessoaEntity;
    initialId?: string | null;
    preloadedPessoa?: PreloadedPessoaData | null;
    onSuccess?: () => void;
    msgs: RefObject<Messages | null>;
    onPessoaChange?: (pessoa: PessoaEntity) => void;
    onErrorsChange?: (errors: Record<string, string>) => void;
    setPessoa?: React.Dispatch<React.SetStateAction<any>>;
    redirectAfterSave?: boolean;
    onClose?: () => void;
    onSaved?: (created: PessoaEntity) => void | Promise<void>;
    onLoadingChange?: (loading: boolean) => void;
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
    selectedContato: string[];
    selectedCNAE: TableCNAEEntity | null;
    loadingCnpj: boolean;
    hasFocused: boolean;
    onFocusFirstField: () => void;
    onChange: (event: any) => void;
    onDropdownChange: (event: DropdownChangeEvent) => void;
    onContatoChange: (event: MultiSelectChangeEvent) => void;
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
    onEditClick?: (pessoa: PessoaEntity) => void;
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
    autoLoadAndSelectSingle?: boolean;
}
export interface PreloadedPessoaData {
    dataPessoa: PessoaEntity;
    selectedVendedor: VendedorEntity | null;
    selectedContrato: ContratoEntity | null;
}
export const mapPessoaContatoToSelection = (pessoa: Pick<PessoaEntity, 'pessoa_cliente' | 'pessoa_fornecedor'>): string[] => {
    const selectedContato: string[] = [];
    if (normalizeBooleanFlag(pessoa.pessoa_cliente)) {
        selectedContato.push('pessoa_cliente');
    }

    if (normalizeBooleanFlag(pessoa.pessoa_fornecedor)) {
        selectedContato.push('pessoa_fornecedor');
    }

    return selectedContato;
};
export const nullableString = (value?: string | null) => {
    if (value === undefined || value === null) return null;
    return value.trim().length > 0 ? value : null;
};
export const buildPessoaPayload = (pessoa: PessoaEntity) => ({
    ...pessoa,
    pessoa_cliente: normalizeBooleanFlag(pessoa.pessoa_cliente),
    pessoa_fornecedor: normalizeBooleanFlag(pessoa.pessoa_fornecedor),
    cnpj: pessoa.cnpj && pessoa.cnpj.replace(/\D/g, '').length > 0 ? pessoa.cnpj : null,
    cpf: pessoa.cpf && pessoa.cpf.replace(/\D/g, '').length > 0 ? pessoa.cpf : null,
    email: (pessoa.email ?? '').trim(),
    cnae_fiscal: nullableString(pessoa.cnae_fiscal),
    inscricao_estadual: nullableString(pessoa.inscricao_estadual),
    inscricao_municipal: nullableString(pessoa.inscricao_municipal),
});
