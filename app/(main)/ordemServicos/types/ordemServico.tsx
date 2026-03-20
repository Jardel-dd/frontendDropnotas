import { RefObject } from 'react';
import { Messages } from 'primereact/messages';
import { PessoaEntity } from '@/app/entity/PessoaEntity';
import { CompanyEntity } from '@/app/entity/CompanyEntity';
import { ServiceEntity } from '@/app/entity/ServiceEntity';
import { VendedorEntity } from '@/app/entity/VendedorEntity';
import { FormaPagamentoEntity } from '@/app/entity/FormaPagamento';
import { ServiceOrderEntity } from '@/app/entity/ServiceOrderEntity';

export type OrdemServicoParams = {
    termo?: string | null;
    idEmpresa?: number | null;
    idCliente?: number | null;
    idVendedor?: number | null;
    status?: string | null;
    data_hora_inicio?: string | null;
    data_hora_fim?: string | null;
    tipo_data?: string | null;
};

export type ApiListItem = {
    id: string;
    [key: string]: any;
};
export type NestedFormRef = {
    handleSave: () => Promise<void>;
};
export interface OrdemServicoFormRef {
    handleSave: () => Promise<void>;
}

export interface OrdemServicoFormProps {
    ordemServico: ServiceOrderEntity;
    initialId?: string | null;
    onSuccess?: () => void;
    msgs: RefObject<Messages | null>;
    onOrdemServicoChange?: (servico: ServiceOrderEntity) => void;
    onErrorsChange?: (errors: Record<string, string>) => void;
    setOrdemServico?: React.Dispatch<React.SetStateAction<ServiceOrderEntity>>;
    redirectAfterSave?: boolean;
    onClose?: () => void;
    onSaved?: (created: ServiceOrderEntity) => void;
    showBTNPGCreatedDialog?: boolean;
    showBTNPGCreatedAll?: boolean;
    onBackClick?: () => void;
}

export interface OrdemServicoFieldsProps {
    emitirOS: ServiceOrderEntity;
    errors: Record<string, string>;
    reloadKeyPessoa: number;
    reloadKeyEmpresa: number;
    reloadKeyServico: number;
    reloadKeyFormaPagamento: number;
    selectedCliente: PessoaEntity | null;
    selectedEmpresa: CompanyEntity | null;
    selectedServico: ServiceEntity | null;
    selectedVendedor: VendedorEntity | null;
    selectedFormaPagamento: FormaPagamentoEntity | null;
    onChange: (event: { target: { id: string; value: any; checked?: any; type: string } }) => void;
    onDateChange: (field: keyof ServiceOrderEntity, value: Date | null) => void;
    onEmpresaChange: (empresa: CompanyEntity | null) => void;
    onPessoaChange: (pessoa: PessoaEntity | null) => void;
    onVendedorChange: (vendedor: VendedorEntity | null) => void;
    onFormaPagamentoChange: (formaPagamento: FormaPagamentoEntity | null) => void;
    onServicoChange: (servico: ServiceEntity | null) => void;
    onAddEmpresa: () => void;
    onAddPessoa: () => void;
    onAddVendedor: () => void;
    onAddFormaPagamento: () => void;
    onAddServico: () => void;
    onValidateDescricao: () => void;
}

export type FormCreatedOrdemServicoProps = OrdemServicoFieldsProps | OrdemServicoFormProps;
