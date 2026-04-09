import { ServiceEntity } from "@/app/entity/ServiceEntity";
import { TableCodigoNBSEntity } from "@/app/entity/TableCodigoNBS";
import { TableClassificacaoTributariaEntity } from "@/app/entity/TableClassificacaoTributariaEntity";
import { DropdownChangeEvent } from "primereact/dropdown";
import { InputNumberValueChangeEvent } from "primereact/inputnumber";
import { Messages } from "primereact/messages";
import { Dispatch, RefObject, SetStateAction } from "react";
export const createEmptyServico = () =>
    new ServiceEntity({
        ativo: true,
        id: 0,
        descricao: '',
        descricao_completa: '',
        codigo: '',
        item_lista_servico: '010501',
        exigibilidade_iss: '',
        iss_retido: '',
        observacoes: '',
        codigo_municipio: '',
        numero_processo: '',
        responsavel_retencao: '',
        codigo_cnae: '',
        codigo_nbs: '',
        codigo_inter_contr: '',
        codigo_indicador_operacao: '',
        tipo_operacao: 0,
        finalidade_nfse: 0,
        indicador_finalidade: 0,
        indicador_destinatario: 0,
        codigo_situacao_tributaria: '',
        codigo_classificacao_tributaria: '',
        codigo_situacao_tributaria_regular: '',
        codigo_classificacao_tributaria_regular: '',
        codigo_credito_presumido: '',
        percentual_diferencial_uf: 0,
        percentual_diferencial_municipal: 0,
        percentual_diferencial_cbs: 0,
        valor_servico: null,
        valor_desconto: 0,
        aliquota_deducoes: 0
    });
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
