import { Messages } from 'primereact/messages';
import { Dispatch, RefObject, SetStateAction } from 'react';
import { ContasReceberEntity } from '@/app/entity/contasReceberEntity';
import { FormaPagamentoEntity } from '@/app/entity/FormaPagamento';
import { PessoaEntity } from '@/app/entity/PessoaEntity';
import { VendedorEntity } from '@/app/entity/VendedorEntity';

export interface ContasReceberFormProps {
    contasReceber: ContasReceberEntity;
    initialId?: string | null;
    msgs: RefObject<Messages | null>;
    onContasReceberChange?: (contasReceber: ContasReceberEntity) => void;
    onErrorsChange?: (errors: Record<string, string>) => void;
    setContasReceber?: Dispatch<SetStateAction<ContasReceberEntity>>;
    redirectAfterSave?: boolean;
    onSaved?: (created: ContasReceberEntity) => void;
    onClose?: () => void;
    showBTNPGCreatedDialog?: boolean;
    showBTNPGCreatedAll?: boolean;
    onBackClick?: () => void;
}

export interface ContasReceberFormRef {
    handleSave: () => Promise<void>;
}

export interface ContasReceberFieldsProps {
    contasReceber: ContasReceberEntity;
    errors: Record<string, string>;
    selectedCliente: PessoaEntity | null;
    selectedVendedor: VendedorEntity | null;
    selectedFormaPagamento: FormaPagamentoEntity | null;
    onChange: (event: any) => void;
    onClienteChange: (cliente: PessoaEntity | null) => void;
    onVendedorChange: (vendedor: VendedorEntity | null) => void;
    onFormaPagamentoChange: (formaPagamento: FormaPagamentoEntity | null) => void;
    onValidateDescricao: () => void;
}

export type FormCreatedContasReceberProps = ContasReceberFieldsProps | ContasReceberFormProps;

export interface ContasReceberDropdownFieldProps {
    selectedContasReceber: ContasReceberEntity | null;
    onContasReceberChange: (contasReceber: ContasReceberEntity | null) => void;
    reloadKey?: number;
    hasError?: boolean;
    errorMessage?: string;
    showAddButton?: boolean;
    onAddClick?: () => void;
    autoSelectSingle?: boolean;
}

export interface FormaPagamentoDropdownFieldProps {
    selectedFormaPagamento: FormaPagamentoEntity | null;
    onFormaPagamentoChange: (formaPagamento: FormaPagamentoEntity | null) => void;
    reloadKey?: number;
    hasError?: boolean;
    errorMessage?: string;
    showAddButton?: boolean;
    onAddClick?: () => void;
    autoSelectSingle?: boolean;
}
export const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

export const createEmptyContasReceber = () =>
    new ContasReceberEntity({
        ativo: true,
        id: 0,
        descricao: '',
        id_forma_pagamento: 0,
        id_vendedor: 0,
        id_cliente: 0,
        valor_original: 0,
        data_vencimento: getTodayDate(),
        observacao: ''
    });

export const toContasReceberEntity = (contasReceber?: Partial<ContasReceberEntity> | null) =>
    new ContasReceberEntity({
        ...createEmptyContasReceber(),
        ...(contasReceber ?? {})
    });

export const getInitialContasReceber = (contasReceber?: Partial<ContasReceberEntity> | null) =>
    toContasReceberEntity({
        ...(contasReceber ?? {}),
        data_vencimento: contasReceber?.data_vencimento || getTodayDate()
    });
