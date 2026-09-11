import { Messages } from "primereact/messages";
import { DropdownChangeEvent } from "primereact/dropdown";
import { ServiceEntity } from "@/app/entity/ServiceEntity";
import { Dispatch, RefObject, SetStateAction } from "react";
import { TableService } from "@/app/entity/TableServiceEntity";
import { TableCNAEEntity } from "@/app/entity/TableCNAEEntity";
import { TableCodigoNBSEntity } from "@/app/entity/TableCodigoNBS";
import { InputNumberValueChangeEvent } from "primereact/inputnumber";
import { TableClassificacaoTributariaEntity } from "@/app/entity/TableClassificacaoTributariaEntity";
import { PerfilTributarioEntity } from "@/app/entity/perfilTributarioEntity";

export interface PerfilTributarioRecommendationOption {
    codigo: string;
    descricao: string;
    codigo_cst?: string | null;
    prioridade?: number | null;
}

export interface PerfilTributarioRecommendationCorrelation {
    codigo_servico?: string;
    codigo_nbs?: string;
    codigo_indicador_operacao?: string;
    codigo_classificacao_tributaria?: string;
    codigo_cst?: string | null;
}

export interface PerfilTributarioRecommendations {
    indicadores_operacao?: PerfilTributarioRecommendationOption[];
    classificacoes_tributarias?: PerfilTributarioRecommendationOption[];
    cnaes?: PerfilTributarioRecommendationOption[];
    servicos?: PerfilTributarioRecommendationOption[];
    nbs?: PerfilTributarioRecommendationOption[];
    correlacoes?: PerfilTributarioRecommendationCorrelation[];
    avisos?: string[];
    [key: string]: unknown;
}

export const createEmptyPerfilTributario = () =>
    new PerfilTributarioEntity({
        ativo: true,
        id: 0,
        id_empresa: null,
        nome: '',
        item_lista_servico: '',
        exigibilidade_iss: '',
        iss_retido: '',
        observacoes: '',
        codigo_municipio: '',
        municipio_incidencia: '',
        numero_processo: '',
        responsavel_retencao: '',
        codigo_cnae: '',
        codigo_nbs: '',
        codigo_inter_contr: '',
        codigo_indicador_operacao: '',
        tipo_operacao: '',
        finalidade_nfse: 0,
        indicador_finalidade: 0,
        indicador_destinatario: '',
        codigo_situacao_tributaria: '',
        codigo_classificacao_tributaria: '',
        codigo_situacao_tributaria_regular: '',
        codigo_classificacao_tributaria_regular: '',
        codigo_credito_presumido: '',
        percentual_diferencial_uf: 0,
        percentual_diferencial_municipal: 0,
        percentual_diferencial_cbs: 0,
        aliquota_deducoes: 0
});
export interface PerfilTributarioFormProps {
    perfilTributario: PerfilTributarioEntity;
    initialId?: string | null;
    preloadedPerfilTributario?: PreloadedPerfilTributarioData | null;
    msgs: RefObject<Messages | null>;
    onPerfilTributarioChange?: (perfilTributario: PerfilTributarioEntity) => void;
    onErrorsChange?: (errors: Record<string, string>) => void;
    setPerfilTributario?: Dispatch<SetStateAction<PerfilTributarioEntity>>;
    redirectAfterSave?: boolean;
    onClose?: () => void;
    onSaved?: (created: PerfilTributarioEntity) => void | Promise<void>;
    onLoadingChange?: (loading: boolean) => void;
    showBTNPGCreatedDialog?: boolean;
    showBTNPGCreatedAll?: boolean;
    onBackClick?: () => void;
}
export interface PerfilTributarioFormRef {
    handleSave: () => Promise<void>;
}
export interface PerfilTributarioFieldsProps {
    perfilTributario: PerfilTributarioEntity;
    errors: Record<string, string>;
    selectedPerfilTributario: PerfilTributarioEntity | null;
    selectedCodigoCNAE: TableCNAEEntity | null;
    selectedCodigoNBS: TableCodigoNBSEntity | null;
    selectedCodigoServico: TableService | null;
    selectedClassificacaoTributaria: TableClassificacaoTributariaEntity | null;
    onChange: (event: any) => void;
    onDropdownChange: (event: DropdownChangeEvent) => void;
    onNumberChange: (event: InputNumberValueChangeEvent) => void;
    onCodigoServicoChange: (service: TableService  | null) => void;
    onServicoChange: (service: ServiceEntity | null) => void;
    onPerfilTributarioChange: (perfilTributario: PerfilTributarioEntity | null) => void;
    onCodigoNBSChange: (codigoNBS: TableCodigoNBSEntity | null) => void;
    onCodigoCNAEChange: (codigoCNAE: TableCNAEEntity | null) => void;
    onClassificacaoTributariaChange: (classificacaoTributaria: TableClassificacaoTributariaEntity | null) => void;
    onDescriptionBlur: () => void;
    fetchServiceTable: (...args: any[]) => any;
    fetchAllClassificacaoTributaria: (...args: any[]) => any;
    fetchFilteredClassificacaoTributaria: (...args: any[]) => any;
    fetchAllCodigoNBS: (...args: any[]) => any;
    fetchFilteredCodigoNBS: (...args: any[]) => any;
    fetchAllCodigoServico: (...args: any[]) => any;
    fetchFilteredCodigoServico: (...args: any[]) => any;
}
export interface PerfilTributarioDropdownFieldProps {
    selectedPerfilTributario: PerfilTributarioEntity | null;
    selectedPerfilTributarioId?: number | null;
    onPerfilTributarioChange: (perfilTributario: PerfilTributarioEntity | null) => void;
    onEditClick?: (perfilTributario: PerfilTributarioEntity) => void;
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
    loadOnMount?: boolean;
    fetchAllItems?: () => Promise<PerfilTributarioEntity[]>;
    fetchFilteredItems?: (filter: string) => Promise<PerfilTributarioEntity[]>;
    useCachedAllItems?: boolean;
    autoLoadAndSelectSingle?: boolean;
}
export interface PreloadedPerfilTributarioData {
    perfilTributario: PerfilTributarioEntity;
    selectedCodigoCNAE: TableCNAEEntity | null;
    selectedCodigoNBS: TableCodigoNBSEntity | null;
    selectedCodigoServico: TableService | null;
    selectedClassificacaoTributaria: TableClassificacaoTributariaEntity | null;
}
export const normalizeEmptyValuesToNull = <T,>(value: T): T => {
    if (Array.isArray(value)) {
        return value.map((item) => normalizeEmptyValuesToNull(item)) as T;
    }

    if (value && typeof value === 'object') {
        const normalizedEntries = Object.entries(value as Record<string, unknown>).map(([key, entryValue]) => [
            key,
            normalizeEmptyValuesToNull(entryValue)
        ]);

        return Object.fromEntries(normalizedEntries) as T;
    }

    if (typeof value === 'string') {
        return (value.trim() === '' ? null : value) as T;
    }

    return value;
};
export type FormCreatedPerfilTributarioProps = PerfilTributarioFieldsProps | PerfilTributarioFormProps;
export const PERFILTRIBUTARIO = 5 * 60 * 1000;
export const perfilTributarioSectionFlowConfig = [
    {
        id: 'empresa',
        errorFields: [
            'id_empresa',
            'codigo_cnae',
            'item_lista_servico',
            'codigo_nbs',
            'codigo_indicador_operacao'
        ]
    },
    {
        id: 'dados-perfilTributario',
        errorFields: ['nome' ]
    },
    {
        id: 'tributacoes',
        errorFields: [
            'codigo_situacao_tributaria',
            'codigo_situacao_tributaria_regular',
            'iss_retido',
            'exigibilidade_iss',
            'responsavel_retencao',
            'indicador_destinatario'
        ]
    },
    {
        id: 'informacoes-tributarias-avancadas',
        errorFields: [
            'aliquota_deducoes',
            'percentual_diferencial_uf',
            'percentual_diferencial_municipal',
            'percentual_diferencial_cbs',
            'codigo_credito_presumido',
            'codigo_municipio',
            'numero_processo'
        ]
    }
];
