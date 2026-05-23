import { RefObject } from "react";
import { Messages } from "primereact/messages";
import { PessoaEntity } from "@/app/entity/PessoaEntity";
import { DropdownChangeEvent } from "primereact/dropdown";
import { ServiceEntity } from "@/app/entity/ServiceEntity";
import { CompanyEntity } from "@/app/entity/CompanyEntity";
import { ContratoEntity } from "@/app/entity/ContratoEntity";
import { FormaPagamentoEntity } from "@/app/entity/FormaPagamento";
import { InputNumberValueChangeEvent } from "primereact/inputnumber";
import { CategoryContratosEntity } from "@/app/entity/CategoryContratEntity";

export type ApiListItem = { id: string;[key: string]: any };
export interface ContratoFormRef {
    handleSave: () => Promise<void>;
}
export interface ContratoFormProps {
    contrato: any;
    initialId?: string | null;
    onSuccess?: () => void;
    msgs: RefObject<Messages | null>;
    onContratoChange?: (contrato: ContratoEntity) => void;
    onErrorsChange?: (errors: Record<string, string>) => void;
    setContrato: React.Dispatch<React.SetStateAction<ContratoEntity>>;
    redirectAfterSave?: boolean;
    onClose?: () => void;
    onSaved?: (created: ContratoEntity) => void;
    showBTNPGCreatedDialog?: boolean;
    showBTNPGCreatedAll?: boolean;
    onBackClick?: () => void;
}
export interface ContratoFieldsProps {
    contrato: ContratoEntity;
    errors: Record<string, string>;
    selectedPessoa: PessoaEntity[];
    pessoaOptions: PessoaEntity[];
    selectedCompany: CompanyEntity | null;
    selectedService: ServiceEntity | null;
    selectedCategoriaContrato: CategoryContratosEntity | null;
    selectedFormaPagamento: FormaPagamentoEntity | null;
    reloadKeyPessoa: number;
    reloadKeyEmpresa: number;
    reloadKeyServico: number;
    reloadKeyCategoriaContrato: number;
    reloadKeyFormaPagamento: number;
    onChange: (event: {
        target: {
            id: string;
            value: any;
            checked?: any;
            type: string;
        };
    }) => void;
    onDropdownChange: (event: DropdownChangeEvent) => void;
    onNumberChange: (
        event: InputNumberValueChangeEvent
    ) => void;
    onCompanyChange: (empresa: CompanyEntity | null) => void;
    onServiceChange: (service: ServiceEntity | null) => void;
    onCategoriaContratoChange: (
        categoriaContrato: CategoryContratosEntity | null
    ) => void;
    onFormaPagamentoChange: (
        formaPagamento: FormaPagamentoEntity | null
    ) => void;
    onPessoaChange: (pessoas: PessoaEntity[]) => void;
    onAddEmpresa: () => void;
    onAddServico: () => void;
    onAddCategoriaContrato: () => void;
    onAddFormaPagamento: () => void;
    onAddPessoa: () => void;
    onValidateDescricao: () => void;
}
export type FormContratoCreatedProps =
    | ContratoFieldsProps
    | ContratoFormProps;
