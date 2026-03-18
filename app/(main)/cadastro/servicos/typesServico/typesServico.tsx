'use client';

import { RefObject } from 'react';
import { Messages } from 'primereact/messages';
import { DropdownChangeEvent } from 'primereact/dropdown';
import { InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { ServiceEntity } from '@/app/entity/ServiceEntity';
import { TableCodigoNBSEntity } from '@/app/entity/TableCodigoNBS';
import { TableClassificacaoTributariaEntity } from '@/app/entity/TableClassificacaoTributariaEntity';

export interface ServiceFormRef {
    handleSave: () => Promise<void>;
}

export interface ServicoFieldsProps {
    servico: ServiceEntity;
    errors: Record<string, string>;
    selectedService: ServiceEntity | null;
    selectedCodigoNBS: TableCodigoNBSEntity | null;
    selectedClassificacaoTributaria: TableClassificacaoTributariaEntity | null;
    onChange: (event: { target: { id: string; value: any; checked?: any; type: string } }) => void;
    onDropdownChange: (event: DropdownChangeEvent) => void;
    onNumberChange: (event: InputNumberValueChangeEvent) => void;
    onServicoChange: (service: ServiceEntity | null) => void;
    onCodigoNBSChange: (codigoNBS: TableCodigoNBSEntity | null) => void;
    onClassificacaoTributariaChange: (classificacaoTributaria: TableClassificacaoTributariaEntity | null) => void;
    onDescriptionBlur: () => void;
    fetchServiceTable: (...args: any[]) => any;
    fetchAllClassificacaoTributaria: (...args: any[]) => any;
    fetchFilteredClassificacaoTributaria: (...args: any[]) => any;
    fetchAllCodigoNBS: (...args: any[]) => any;
    fetchFilteredCodigoNBS: (...args: any[]) => any;
}

export interface ServiceFormProps {
    servico: ServiceEntity;
    initialId?: string | null;
    onSuccess?: () => void;
    msgs: RefObject<Messages | null>;
    onServicoChange?: (servico: ServiceEntity) => void;
    onErrorsChange?: (errors: Record<string, string>) => void;
    setServico: React.Dispatch<React.SetStateAction<ServiceEntity>>;
    redirectAfterSave?: boolean;
    onClose?: () => void;
    onSaved?: (created: ServiceEntity) => void;
    showBTNPGCreatedDialog?: boolean;
    showBTNPGCreatedAll?: boolean;
    onBackClick?: () => void;
}

export type FormCreatedServicoProps = ServicoFieldsProps | ServiceFormProps;
