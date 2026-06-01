import { RefObject } from "react";
import { Messages } from "primereact/messages";
import { DropdownChangeEvent } from "primereact/dropdown";
import { VendedorEntity } from "@/app/entity/VendedorEntity";
import { EnderecoEntity } from "@/app/entity/enderecoEntity";

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
    preloadedVendedor?: VendedorEntity | null;
    onSuccess?: () => void;
    msgs: RefObject<Messages | null>;
    onVendedorChange?: (servico: VendedorEntity) => void;
    onErrorsChange?: (errors: Record<string, string>) => void;
    setVendedor: React.Dispatch<React.SetStateAction<VendedorEntity>>;
    redirectAfterSave?: boolean;
    onClose?: () => void;
    onSaved?: (created: VendedorEntity) => void;
    onLoadingChange?: (loading: boolean) => void;
    showBTNPGCreatedDialog?: boolean;
    showBTNPGCreatedAll?: boolean;
    onBackClick?: () => void;
}
export interface VendedorDropdownFieldProps {
    selectedVendedor: VendedorEntity | null;
    selectedVendedorId?: number | null;
    onVendedorChange: (vendedor: VendedorEntity | null) => void;
    onAddClick: () => void;
    onEditClick?: (vendedor: VendedorEntity) => void;
    reloadKey?: number;
    hasError?: boolean;
    errorMessage?: string;
}
export type FormCreatedVendedorProps = VendedorFieldsProps | VendedorFormProps;
export const createEmptyVendedor = () =>
    new VendedorEntity({
        id: 0,
        razao_social: '',
        nome_fantasia: '',
        cpf: null,
        rg: null,
        email: '',
        documento_estrangeiro: null,
        cnpj: null,
        inscricao_estadual: '',
        inscricao_municipal: '',
        atividade_principal: '',
        codigo_regime_tributario: '',
        tipo_pessoa: 'PESSOA_JURIDICA',
        contribuinte: '',
        telefone: '',
        endereco: {} as EnderecoEntity,
        arquivo_contrato: '',
        percentual_comissao: 0,
        id_vendedor_padrao: null,
        ativo: true,
        pais: ''
    });
