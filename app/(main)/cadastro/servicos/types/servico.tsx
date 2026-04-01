import { ServiceEntity } from "@/app/entity/ServiceEntity";
import { TableCodigoNBSEntity } from "@/app/entity/TableCodigoNBS";
import { TableClassificacaoTributariaEntity } from "@/app/entity/TableClassificacaoTributariaEntity";
import { DropdownChangeEvent } from "primereact/dropdown";
import { InputNumberValueChangeEvent } from "primereact/inputnumber";
import { Messages } from "primereact/messages";
import { Dispatch, RefObject, SetStateAction } from "react";

export interface ServiceFormProps {
    servico: ServiceEntity;
    initialId?: string | null;
    msgs: RefObject<Messages | null>;
    onServicoChange?: (servico: ServiceEntity) => void;
    onErrorsChange?: (errors: Record<string, string>) => void;
    setServico?: Dispatch<SetStateAction<ServiceEntity>>;
    redirectAfterSave?: boolean;
    onClose?: () => void;
    onSaved?: (created: ServiceEntity) => void;
    showBTNPGCreatedDialog?: boolean;
    showBTNPGCreatedAll?: boolean;
    onBackClick?: () => void;
}

export interface ServiceFormRef {
    handleSave: () => Promise<void>;
}

export interface ServicoFieldsProps {
    servico: ServiceEntity;
    errors: Record<string, string>;
    selectedService: ServiceEntity | null;
    selectedCodigoNBS: TableCodigoNBSEntity | null;
    selectedClassificacaoTributaria: TableClassificacaoTributariaEntity | null;
    onChange: (event: any) => void;
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

export interface ServicoDropdownFieldProps {
    selectedService: ServiceEntity | null;
    selectedServiceId?: number | null;
    onServiceChange: (service: ServiceEntity | null) => void;
    reloadKey?: number;
    id?: string;
    hasError?: boolean;
    errorMessage?: string;
    placeholder?: string;
    topLabel?: string;
    showTopLabel?: boolean;
    required?: boolean;
    showAddButton?: boolean;
    onAddClick?: () => void;
    autoSelectSingle?: boolean;
    fetchAllItems?: () => Promise<ServiceEntity[]>;
    fetchFilteredItems?: (filter: string) => Promise<ServiceEntity[]>;
}

export type FormCreatedServicoProps = ServicoFieldsProps | ServiceFormProps;
