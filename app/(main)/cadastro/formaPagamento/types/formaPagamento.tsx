import { FormaPagamentoEntity } from "@/app/entity/FormaPagamento";
import { DropdownChangeEvent } from "primereact/dropdown";
import { Messages } from "primereact/messages";
import { Dispatch, RefObject, SetStateAction } from "react";

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

export type FormCreatedFormaPagamentoProps =
    | FormaPagamentoFieldsProps
    | FormaPagamentoFormProps;

export interface FormaPagamentoDropdownFieldProps {
    selectedFormaPagamento: FormaPagamentoEntity | null;
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
