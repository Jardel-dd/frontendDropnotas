import { Messages } from "primereact/messages";
import { DropdownChangeEvent } from "primereact/dropdown";
import { Dispatch, RefObject, SetStateAction } from "react";
import { FormaPagamentoEntity, TipoFormaPagamento } from "@/app/entity/FormaPagamento";

const normalizeTextToken = (value?: string | null) =>
    value
        ?.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '_')
        .toUpperCase() ?? '';

const normalizeTipoFormaPagamento = (value?: string | null): TipoFormaPagamento => {
    const normalizedValue = normalizeTextToken(value);

    const formaPagamentoMap: Record<string, TipoFormaPagamento> = {
        DINHEIRO: TipoFormaPagamento.DINHEIRO,
        CARTAO_CREDITO: TipoFormaPagamento.CARTAO_CREDITO,
        CARTAO_DEBITO: TipoFormaPagamento.CARTAO_DEBITO,
        PIX: TipoFormaPagamento.PIX,
        BOLETO: TipoFormaPagamento.BOLETO,
        CARTEIRA_DIGITAL: TipoFormaPagamento.CARTEIRA_DIGITAL,
        OUTROS: TipoFormaPagamento.OUTROS
    };

    return formaPagamentoMap[normalizedValue] ?? (value as TipoFormaPagamento) ?? ('' as TipoFormaPagamento);
};
const normalizeTipoTaxa = (value?: string | null) => {
    const normalizedValue = normalizeTextToken(value);

    if (normalizedValue === 'FIXA') {
        return 'FIXA';
    }

    if (normalizedValue === 'PORCENTAGEM') {
        return 'PORCENTAGEM';
    }

    return value ?? '';
};
export const createEmptyFormaPagamento = () =>
    new FormaPagamentoEntity({
        ativo: true,
        id: 0,
        descricao: '',
        observacao: '',
        aplicar_taxa_servico: false,
        tipo_forma_pagamento: '' as TipoFormaPagamento,
        tipo_taxa: '',
        valor_taxa: 0
    });
export const toFormaPagamentoEntity = (formaPagamento?: Partial<FormaPagamentoEntity> | null) =>
    new FormaPagamentoEntity({
        ...createEmptyFormaPagamento(),
        ...(formaPagamento ?? {}),
        tipo_forma_pagamento: normalizeTipoFormaPagamento(formaPagamento?.tipo_forma_pagamento),
        tipo_taxa: normalizeTipoTaxa(formaPagamento?.tipo_taxa)
    });
export interface FormaPagamentoFormProps {
    formaPagamento: FormaPagamentoEntity;
    initialId?: string | null;
    preloadedFormaPagamento?: FormaPagamentoEntity | null;
    msgs: RefObject<Messages | null>;
    onFormaPagamentoChange?: (
        formaPagamento: FormaPagamentoEntity
    ) => void;
    onErrorsChange?: (
        errors: Record<string, string>
    ) => void;
    setFormaPagamento?: Dispatch<
        SetStateAction<FormaPagamentoEntity>
    >;
    redirectAfterSave?: boolean;
    onSaved?: (created: FormaPagamentoEntity) => void | Promise<void>;
    onClose?: () => void;
    onLoadingChange?: (loading: boolean) => void;
    showBTNPGCreatedDialog?: boolean;
    showBTNPGCreatedAll?: boolean;
    onBackClick?: () => void;
}
export interface FormaPagamentoFormRef {
    handleSave: () => Promise<void>;
}
export interface FormaPagamentoFieldsProps {
    formaPagamento: FormaPagamentoEntity;
    errors: Record<string, string>;
    onChange: (event: {
        target: { id: string; value: any; checked?: any; type: string };
    }) => void;
    onDropdownChange: (event: DropdownChangeEvent) => void;
    onValidateDescricao: () => void;
}
export interface FormaPagamentoDropdownFieldProps {
    selectedFormaPagamento: FormaPagamentoEntity | null;
    selectedFormaPagamentoId?: number | null;
    onFormaPagamentoChange: (
        formaPagamento: FormaPagamentoEntity | null
    ) => void;
    onEditClick?: (formaPagamento: FormaPagamentoEntity) => void;
    reloadKey?: number;
    hasError?: boolean;
    errorMessage?: string;
    showAddButton?: boolean;
    onAddClick?: () => void;
    autoSelectSingle?: boolean;
    loadOnMount?: boolean;
    useCachedAllItems?: boolean;
}
export type FormCreatedFormaPagamentoProps = | FormaPagamentoFieldsProps| FormaPagamentoFormProps;
export const FORMA_PAGAMENTO_DROPDOWN_CACHE_TIME_MS = 5 * 60 * 1000;
