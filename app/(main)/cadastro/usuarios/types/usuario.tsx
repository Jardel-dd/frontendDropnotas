import { CompanyEntity } from '@/app/entity/CompanyEntity';
import { EnderecoEntity } from '@/app/entity/enderecoEntity';
import { PerfilUser } from '@/app/entity/PerfilUsuarioEntity';
import { UsuarioContaEntity } from '@/app/entity/UsuarioContaEntity';
import { Messages } from 'primereact/messages';
import { MultiSelectChangeEvent } from 'primereact/multiselect';
import { ChangeEvent, RefObject } from 'react';

export interface UserMultiSelectProps {
    id?: string;
    label?: string;
    selectedItems: any[];
    onChange: (e: any) => void;
    options: any[];
    optionLabel?: string;
    placeholder?: string;
    maxSelectedLabels?: number;
    hasError?: boolean;
    errorMessage?: string;
    showChips?: boolean;
    fetchFilteredItems?: (query: string) => Promise<any[]>;
    fetchAllItems?: () => Promise<any[]>;
}

export interface UsuarioFormRef {
    handleSave: () => Promise<void>;
}

export interface UsuarioFormProps {
    userConta: UsuarioContaEntity;
    initialId?: string | null;
    msgs: RefObject<Messages | null>;
    onUserContaChange?: (userConta: UsuarioContaEntity) => void;
    onErrorsChange?: (errors: Record<string, string>) => void;
    setUserConta?: React.Dispatch<React.SetStateAction<UsuarioContaEntity>>;
    redirectAfterSave?: boolean;
    onSaved?: (created: UsuarioContaEntity) => void;
    onClose?: () => void;
    showBTNPGCreatedDialog?: boolean;
    showBTNPGCreatedAll?: boolean;
    onBackClick?: () => void;
}

export interface UsuarioFieldsProps {
    userConta: UsuarioContaEntity;
    userContaID?: string | null;
    confirmPassword: string;
    errors: Record<string, string>;
    isPasswordVisible: boolean;
    isConfirmPasswordVisible: boolean;
    selectedPerfilUser: PerfilUser | null;
    selectedEmpresa: CompanyEntity[];
    empresasOptions: CompanyEntity[];
    reloadKeyPerfilUser: number;
    fileInputRef: RefObject<HTMLInputElement | null>;
    onChange: (event: { target: { id: string; value: any; checked?: any; type: string } }) => void;
    onConfirmPasswordChange: (value: string) => void;
    onValidateConfirmPassword: () => void;
    onValidateNome: () => void;
    onPerfilUserChange: (perfilUser: PerfilUser | null) => void;
    onCompanyChange: (event: MultiSelectChangeEvent) => void;
    onFileChangeLogo: (event: ChangeEvent<HTMLInputElement>) => void;
    onTogglePasswordVisibility: () => void;
    onTriggerProfileImageUpload: () => void;
    onOpenPerfilUserModal: () => void;
    onOpenEmpresaModal: () => void;
    onOpenChangeEmailModal?: () => void;
}

export type FormCreatedUsuarioProps = UsuarioFieldsProps | UsuarioFormProps;

export const createEmptyUserConta = () =>
    new UsuarioContaEntity({
        ativo: true,
        id: 0,
        foto_perfil: '',
        nome: '',
        email: '',
        senha: '',
        id_empresas_acesso: []
    });

export const createEmptyPerfilUsuario = () =>
    new PerfilUser({
        ativo: true,
        id: 0,
        nome: '',
        perfilUsuario: false,
        perfilUsuarioCadastrar: false,
        perfilUsuarioAlterar: false,
        perfilUsuarioDesativar: false,
        perfilUsuarioPesquisar: false,
        usuarioConta: false,
        usuarioContaCadastrar: false,
        usuarioContaAlterar: false,
        usuarioContaDesativar: false,
        usuarioContaPesquisar: false,
        empresa: false,
        empresaCadastrar: false,
        empresaAlterar: false,
        empresaDesativar: false,
        empresaPesquisar: false,
        pessoa: false,
        pessoaCadastrar: false,
        pessoaAlterar: false,
        pessoaDesativar: false,
        pessoaPesquisar: false,
        vendedor: false,
        vendedorCadastrar: false,
        vendedorAlterar: false,
        vendedorDesativar: false,
        vendedorPesquisar: false,
        servico: false,
        servicoCadastrar: false,
        servicoAlterar: false,
        servicoDesativar: false,
        servicoPesquisar: false,
        ordemServico: false,
        ordemServicoCadastrar: false,
        ordemServicoAlterar: false,
        ordemServicoDesativar: false,
        ordemServicoPesquisar: false,
        ordemServicoTipoVisualizacao: '',
        contrato: false,
        contratoCadastrar: false,
        contratoAlterar: false,
        contratoDesativar: false,
        contratoPesquisar: false,
        contratoTipoVisualizacao: '',
        categoriaContrato: false,
        categoriaContratoCadastrar: false,
        categoriaContratoAlterar: false,
        categoriaContratoDesativar: false,
        categoriaContratoPesquisar: false,
        formaPagamento: false,
        formaPagamentoCadastrar: false,
        formaPagamentoAlterar: false,
        formaPagamentoDesativar: false,
        formaPagamentoPesquisar: false,
        nfseTipoVisualizacao: ''
    });

export const createEmptyEmpresaUsuario = () =>
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
