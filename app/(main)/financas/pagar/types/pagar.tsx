import { Messages } from 'primereact/messages';
import { PessoaEntity } from '@/app/entity/PessoaEntity';
import { Dispatch, RefObject, SetStateAction } from 'react';
import { VendedorEntity } from '@/app/entity/VendedorEntity';
import { FormaPagamentoEntity } from '@/app/entity/FormaPagamento';
import { ContasPagarEntity } from '@/app/entity/contasPagarEntity';

export interface ContasPagarFormProps {
    contasPagar: ContasPagarEntity;
    initialId?: string | null;
    msgs: RefObject<Messages | null>;
    onContasPagarChange?: (contasPagar: ContasPagarEntity) => void;
    onErrorsChange?: (errors: Record<string, string>) => void;
    setContasPagar?: Dispatch<SetStateAction<ContasPagarEntity>>;
    redirectAfterSave?: boolean;
    onSaved?: (created: ContasPagarEntity) => void;
    onClose?: () => void;
    showBTNPGCreatedDialog?: boolean;
    showBTNPGCreatedAll?: boolean;
    onBackClick?: () => void;
}

export interface ContasPagarFormRef {
    handleSave: () => Promise<void>;
}

export interface ContasPagarFieldsProps {
    contasPagar: ContasPagarEntity;
    errors: Record<string, string>;
    selectedCliente: PessoaEntity | null;
    onChange: (event: any) => void;
    onClienteChange: (cliente: PessoaEntity | null) => void;
    onValidateDescricao: () => void;
}
export type FormCreatedContasPagarProps = ContasPagarFieldsProps | ContasPagarFormProps;
export interface ContasPagarDropdownFieldProps {
    selectedContasPagar: ContasPagarEntity | null;
    onContasPagarChange: (contasPagar: ContasPagarEntity | null) => void;
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
export interface ContasReceberFormProps {
    contasReceber: ContasPagarEntity;
    initialId?: string | null;
    msgs: RefObject<Messages | null>;
    onContasReceberChange?: (contasReceber: ContasPagarEntity) => void;
    onErrorsChange?: (errors: Record<string, string>) => void;
    setContasReceber?: Dispatch<SetStateAction<ContasPagarEntity>>;
    redirectAfterSave?: boolean;
    onSaved?: (created: ContasPagarEntity) => void;
    onClose?: () => void;
    showBTNPGCreatedDialog?: boolean;
    showBTNPGCreatedAll?: boolean;
    onBackClick?: () => void;
}

export interface ContasReceberFormRef {
    handleSave: () => Promise<void>;
}

export interface ContasReceberFieldsProps {
    contasReceber: ContasPagarEntity;
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
