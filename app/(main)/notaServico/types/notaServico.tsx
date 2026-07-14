import dayjs from 'dayjs';
import { RefObject } from 'react';
import { Messages } from 'primereact/messages';
import { NfsEntity } from '@/app/entity/NfsEntity';
import { EnderecoEntity } from '@/app/entity/enderecoEntity';
import { DetalPrestadorEntity } from '@/app/entity/CompanyEntity';
import { DateRangeValue } from '@/app/components/calendarComponent/types/types';
import { ContatoEntity, DetalTomadorEntity, PessoaEntity } from '@/app/entity/PessoaEntity';
import { DetalPrestadorValoresEntity, DetalServiceEntity } from '@/app/entity/ServiceEntity';

export type NotaServicoFeedback = {
    severity: 'success' | 'warn' | 'error';
    summary: string;
    detail: string;
    notaAutorizada?: Partial<NfsEntity> | null;
};
export type CreatedNotaServicoResult = {
    wasCreated: boolean;
    redirected: boolean;
};
export interface NotaServicoFormRef {
    handleSave: () => Promise<void>;
}
export type ExportarPdfNfsePayload = {
    data_hora_inicio?: string;
    data_hora_fim?: string;
    referencias?: string[];
    status?: string[];
    id_empresa?: number | null;
    id_cliente?: number | null;
};
export interface NotaServicoFormProps {
    notaServico: NfsEntity;
    initialId?: string | null;
    onSuccess?: () => void;
    msgs: RefObject<Messages | null>;
    onNotaServicoChange?: (nota: NfsEntity) => void;
    onErrorsChange?: (errors: Record<string, string>) => void;
    setNotaServico?: React.Dispatch<React.SetStateAction<NfsEntity>>;
    redirectAfterSave?: boolean;
    onClose?: () => void;
    onSaved?: (created: NfsEntity) => void;
    showBTNPGCreatedDialog?: boolean;
    showBTNPGCreatedAll?: boolean;
    onBackClick?: () => void;
}
export interface NotaServicoFieldsProps {
    gerarNfse: NfsEntity;
    mensagemRetornoCorrecao?: string | null;
    errors: Record<string, string>;
    loadingCep: boolean;
    dateRange: Date[] | null;
    onDateChange: (date: Date | null) => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any, bloco?: 'prestador' | 'tomador' | 'servico', subBloco?: 'contato') => void;
    onNumberChange: (e: any, bloco?: 'prestador' | 'tomador' | 'servico') => void;
    onDropdownChange: (e: any, bloco?: 'prestador' | 'tomador' | 'servico') => void;
    onDropdownChangeRegime: (e: any) => void;
    onDropdownChangeEnderecoPrestador: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onDropdownChangeEnderecoTomador: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (event?: React.FormEvent) => Promise<void>;
    msgs: RefObject<Messages | null>;
    router: any;
    setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
    setLoadingCep: React.Dispatch<React.SetStateAction<boolean>>;
    setGerarNfse: React.Dispatch<React.SetStateAction<NfsEntity>>;
}
export type FormCreatedNotaServicoProps = NotaServicoFieldsProps | NotaServicoFormProps;
export type NotaFiscalQueryParams = NotaFiscalParams & {
    page?: number;
    size?: number;
};
export interface ListNotaServicoParams {
    page: number;
    size: number;
    termo?: string;
    status?: string;
    dateRange?: DateRangeValue;
    id_empresa?: number | null;
    id_cliente?: number | null;
    id_vendedor?: number | null;
}
export type NotaFiscalParams = {
    termo?: string | null;
    id_empresa?: number | null;
    id_cliente?: number | null;
    id_vendedor?: number | null;
    status?: string | null;
    data_hora_inicio?: string | null;
    data_hora_fim?: string | null;
    sort?: string;
};
export const createEmptyPessoa = () =>
    new PessoaEntity({
        id: 0,
        razao_social: '',
        nome_fantasia: '',
        cpf: null,
        rg: null,
        email: '',
        documento_estrangeiro: null,
        cnpj: null,
        inscricao_estadual: '',
        inscricao_municipal: '',
        atividade_principal: '',
        cnae_fiscal: null,
        data_fundacao: '',
        pessoa_cliente: false,
        pessoa_fornecedor: false,
        codigo_regime_tributario: '',
        tipo_pessoa: 'PESSOA_JURIDICA',
        contribuinte: '',
        endereco: {} as EnderecoEntity,
        arquivo_contrato: '',
        id_vendedor_padrao: null,
        ativo: true,
        pais: ''
});
export const createEmptyNfse = () =>
    new NfsEntity({
        referencia: '',
        competencia: '',
        regime_especial_tributacao: '',
        prestador: new DetalPrestadorEntity({
            cpf_cnpj: 0,
            inscricao_municipal: '',
            razao_social: '',
            nome_fantasia: '',
            telefone: 0,
            email: '',
            regime_especial_tributacao:'',
            prestacao_sus: false,
            optante_simples_nacional: false,
            incentivo_fiscal: false,
            endereco: new EnderecoEntity({
                cep: '',
                logradouro: '',
                complemento: '',
                numero: '',
                bairro: '',
                municipio: '',
                codigo_municipio: '',
                codigo_pais: '',
                nome_pais: '',
                uf: '',
                telefone: ''
            })
        }),
        servico: new DetalServiceEntity({
            id_servico: 0,
            descricao: '',
            codigo: '',
            iss_retido: '',
            item_lista_servico: '',
            codigo_municipio: '',
            numero_processo: '',
            exigibilidade_iss: '',
            responsavel_retencao: '',
            municipio_incidencia: '',
            codigo_nbs: '',
            codigo_tributacao_municipio: '',
            tributacao_issqn: '',
            valor_total: 0,
            valores: new DetalPrestadorValoresEntity({
                base_calculo: 0,
                valor_servico: 0,
                aliquota_iss: 0,
                aliquota_deducoes: 0,
                aliquota_pis: 0,
                aliquota_cofins: 0,
                aliquota_inss: 0,
                aliquota_ir: 0,
                aliquota_csll: 0,
                aliquota_outras_retencoes: 0,
                percentual_desconto_incondicionado: 0,
                percentual_desconto_condicionado: 0
            })
        }),
        tomador: new DetalTomadorEntity({
            cpf_cnpj: 0,
            razao_social: '',
            contato:  new ContatoEntity({
                email:'',
            }),
            endereco: new EnderecoEntity({
                cep: '',
                logradouro: '',
                complemento: '',
                numero: '',
                bairro: '',
                municipio: '',
                codigo_municipio: '',
                codigo_pais: '',
                nome_pais: '',
                uf: '',
                telefone: ''
            })
        })
});
export const buildEmptyNotaServicoPagination = (pageSize: number, pageNumber = 0) => ({
    content: [],
    pageable: {
        pageNumber,
        pageSize,
        sort: {
            empty: true,
            sorted: false,
            unsorted: true
        },
        offset: pageNumber * pageSize,
        paged: true,
        unpaged: false
    },
    totalPages: 0,
    totalElements: 0,
    last: true,
    size: pageSize,
    number: pageNumber,
    sort: {
        empty: true,
        sorted: false,
        unsorted: true
    },
    numberOfElements: 0,
    first: pageNumber === 0,
    empty: true
});
export const formatAuthorizedNotaDateTime = (value?: string) => {
    if (!value) {
        return '-';
    }
    const parsedDate = dayjs(value);
    return parsedDate.isValid() ? parsedDate.format('DD/MM/YYYY [às] HH:mm') : '-';
};
export const formatAuthorizedNotaValue = (value?: string | number) => {
    const parsedValue = typeof value === 'string' ? Number(value.includes(',') ? value.replace(/\./g, '').replace(',', '.') : value) : Number(value);

    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(Number.isFinite(parsedValue) ? parsedValue : 0);
};
