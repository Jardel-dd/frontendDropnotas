import { Messages } from 'primereact/messages';
import { Dispatch, RefObject, SetStateAction } from 'react';
import { ServiceEntity } from '@/app/entity/ServiceEntity';
import { CompanyEntity } from '@/app/entity/CompanyEntity';
import { InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { PerfilTributarioEntity } from '@/app/entity/perfilTributarioEntity';

export const createEmptyServico = () =>
    new ServiceEntity({
        ativo: true,
        id: 0,
        descricao: '',
        descricao_completa: '',
        codigo: '',
        id_perfil_tributario: null,
        id_empresas: [],
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
        tipo_operacao: 0,
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
        valor_servico: null,
        valor_desconto: 0,
        aliquota_deducoes: 0
    });

export interface ServiceFormProps {
    servico: ServiceEntity;
    initialId?: string | null;
    preloadedServico?: PreloadedServicoData | null;
    msgs: RefObject<Messages | null>;
    onServicoChange?: (servico: ServiceEntity) => void;
    onErrorsChange?: (errors: Record<string, string>) => void;
    setServico?: Dispatch<SetStateAction<ServiceEntity>>;
    redirectAfterSave?: boolean;
    onClose?: () => void;
    onSaved?: (created: ServiceEntity) => void | Promise<void>;
    onLoadingChange?: (loading: boolean) => void;
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
    selectedPerfilTributario: PerfilTributarioEntity | null;
    selectedEmpresas: CompanyEntity[];
    onChange: (event: any) => void;
    onNumberChange: (event: InputNumberValueChangeEvent) => void;
    onPerfilTributarioChange: (perfilTributario: PerfilTributarioEntity | null) => void;
    onCompanyChange: (event: any) => void;
    onDescriptionBlur: () => void;
    fetchAllPerfilTributario: (...args: any[]) => any;
    fetchFilteredPerfilTributario: (...args: any[]) => any;
}

export interface ServicoDropdownFieldProps {
    selectedService: ServiceEntity | null;
    selectedServiceId?: number | null;
    onServiceChange: (service: ServiceEntity | null) => void;
    onEditClick?: (service: ServiceEntity) => void;
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
    fetchAllItems?: () => Promise<ServiceEntity[]>;
    fetchFilteredItems?: (filter: string) => Promise<ServiceEntity[]>;
    useCachedAllItems?: boolean;
    autoLoadAndSelectSingle?: boolean;
}

export interface PreloadedServicoData {
    servico: ServiceEntity;
    selectedPerfilTributario: PerfilTributarioEntity | null;
    selectedEmpresas: CompanyEntity[];
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

export type FormCreatedServicoProps = ServicoFieldsProps | ServiceFormProps;

export const SERVICE_DROPDOWN_CACHE_TIME_MS = 5 * 60 * 1000;

export const servicoSectionFlowConfig = [
    {
        id: 'dados-servico',
        errorFields: ['descricao', 'valor_servico']
    },
    {
        id: 'vinculos',
        errorFields: ['id_perfil_tributario', 'id_empresas']
    }
];
