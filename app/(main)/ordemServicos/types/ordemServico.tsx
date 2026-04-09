import { RefObject } from 'react';
import { Messages } from 'primereact/messages';
import { PessoaEntity } from '@/app/entity/PessoaEntity';
import { CompanyEntity } from '@/app/entity/CompanyEntity';
import { DetalServiceOSEntity, ServiceEntity } from '@/app/entity/ServiceEntity';
import { VendedorEntity } from '@/app/entity/VendedorEntity';
import { FormaPagamentoEntity, Formas_recebimento, TipoFormaPagamento } from '@/app/entity/FormaPagamento';
import { ServiceOrderEntity } from '@/app/entity/ServiceOrderEntity';
import { EnderecoEntity } from '@/app/entity/enderecoEntity';

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


export  const createEmptyOrdemServico = () =>
    new ServiceOrderEntity({
        id: 0,
        numero: 0,
        ativo: true,
        descricao: '',
        consideracoes_finais: '',
        data_hora_inicio: new Date(),
        data_hora_prevista: new Date(),
        data_hora_conclusao: new Date(),
        observacao_servico: '',
        observacao_interna: '',
        servicos: new DetalServiceOSEntity({
            id_servico: 0,
            descricao: '',
            descricao_completa: '',
            codigo: '',
            quantidade: 1,
            valor_servico: 0,
            valor_desconto: 0
        }),
        formas_recebimento: new Formas_recebimento({
            id_forma_recebimento: 0,
            valor_taxa: 0,
            valor_recebido: 0,
            percentual_taxa: 0
        }),
        id_vendedor: 0,
        id_forma_pagamento: 0,
        id_cliente: 0,
        id_empresa: 0,
        orcar: true
    });

export  const createEmptyServico = () =>
    new ServiceEntity({
        ativo: true,
        id: null,
        descricao: '',
        descricao_completa: '',
        codigo: '',
        item_lista_servico: '',
        exigibilidade_iss: '',
        iss_retido: 'NAO',
        codigo_municipio: '',
        numero_processo: '',
        responsavel_retencao: '',
        codigo_cnae: '',
        valor_servico: null
    });

export  const createEmptyPessoa = () =>
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
        cnae_fiscal: '',
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

export const createEmptyEmpresa = () =>
    new CompanyEntity({
        id: 0,
        id_usuarios_acesso: [0],
        cnpj: '',
        razao_social: '',
        nome_fantasia: '',
        logo_empresa: '',
        atividade_principal: '',
        inscricao_estadual: '',
        inscricao_municipal: '',
        codigo_regime_tributario: '',
        tipo_rps: '',
        endereco: {} as EnderecoEntity,
        cnaes_secundarios: ['0'],
        certificado_digital: '',
        data_vencimento_certificado_digital: '',
        senha_certificado_digital: '',
        nome_certificado_digital: '',
        serie_emissao_nfse: '',
        proximo_numero_rps: null,
        proximo_numero_lote: null,
        aliquota_iss: null,
        cnae_fiscal: '',
        prestacao_sus: false,
        regime_especial_tributacao: '',
        incentivo_fiscal: false,
        email: '',
        telefone: '',
        ativo: true,
        aliquota_pis: 0,
        aliquota_cofins: 0,
        aliquota_inss: 0,
        aliquota_ir: 0,
        aliquota_csll: 0,
        aliquota_outras_retencoes: 0,
        aliquota_deducoes: 0,
        percentual_desconto_incondicionado: 0,
        percentual_desconto_condicionado: 0
    });

export  const createEmptyVendedor = () =>
    new VendedorEntity({
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
        codigo_regime_tributario: '',
        tipo_pessoa: 'PESSOA_JURIDICA',
        contribuinte: '',
        telefone: '',
        endereco: {} as EnderecoEntity,
        arquivo_contrato: '',
        percentual_comissao: 0,
        id_vendedor_padrao: null,
        ativo: true
    });

export const createEmptyFormaPagamento = () =>
    new FormaPagamentoEntity({
        ativo: true,
        id: null,
        descricao: '',
        aplicar_taxa_servico: false,
        observacao: '',
        tipo_forma_pagamento: '' as TipoFormaPagamento,
        tipo_taxa: '',
        valor_taxa: 0
    });


export type FormCreatedOrdemServicoProps = OrdemServicoFieldsProps | OrdemServicoFormProps;
