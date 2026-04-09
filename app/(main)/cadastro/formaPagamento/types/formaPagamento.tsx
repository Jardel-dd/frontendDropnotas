import { Messages } from "primereact/messages";
import { DropdownChangeEvent } from "primereact/dropdown";
import { Dispatch, RefObject, SetStateAction } from "react";
import { FormaPagamentoEntity, TipoFormaPagamento } from "@/app/entity/FormaPagamento";
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
        ...(formaPagamento ?? {})
    });
export interface FormaPagamentoFormProps {
    formaPagamento: FormaPagamentoEntity;
    initialId?: string | null;
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
    onSaved?: (created: FormaPagamentoEntity) => void;
    onClose?: () => void;
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
    reloadKey?: number;
    hasError?: boolean;
    errorMessage?: string;
    showAddButton?: boolean;
    onAddClick?: () => void;
    autoSelectSingle?: boolean;
}
export type FormCreatedFormaPagamentoProps = | FormaPagamentoFieldsProps| FormaPagamentoFormProps;