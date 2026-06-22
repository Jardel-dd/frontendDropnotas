import { ContratoEntity } from "@/app/entity/ContratoEntity";
import { PessoaEntity } from "@/app/entity/PessoaEntity";
import { TableCNAEEntity } from "@/app/entity/TableCNAEEntity";
import { DropdownChangeEvent } from "primereact/dropdown";
import { Messages } from "primereact/messages";
import { RefObject } from "react";
import { VendedorEntity } from "@/app/entity/VendedorEntity";

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
    selectedContato: string | null;
    selectedCNAE: TableCNAEEntity | null;
    loadingCnpj: boolean;
    hasFocused: boolean;
    onFocusFirstField: () => void;
    onChange: (event: any) => void;
    onDropdownChange: (event: DropdownChangeEvent) => void;
    onContatoChange: (event: DropdownChangeEvent) => void;
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
export const mapPessoaContatoToSelection = (pessoa: Pick<PessoaEntity, 'pessoa_cliente' | 'pessoa_fornecedor'>): string | null => {
    if (pessoa.pessoa_cliente && pessoa.pessoa_fornecedor) return 'AMBOS';
    if (pessoa.pessoa_cliente) return 'pessoa_cliente';
    if (pessoa.pessoa_fornecedor) return 'pessoa_fornecedor';
    return null;
};
// export const buildMobilePickerPageResult = <T,>(data: any) => {
//     const items = Array.isArray(data?.content) ? (data.content as T[]) : Array.isArray(data) ? (data as T[]) : [];
//     const currentPage = Number(data?.number ?? data?.pageable?.pageNumber ?? 0);
//     const totalPages = Number(data?.totalPages ?? 0);
//     const hasMoreFromLastFlag = typeof data?.last === 'boolean' ? !data.last : null;
//     const hasMoreFromTotalPages = totalPages > currentPage + 1;
//     return {
//         items,
//         hasMore: hasMoreFromLastFlag ?? hasMoreFromTotalPages
//     };
// };
