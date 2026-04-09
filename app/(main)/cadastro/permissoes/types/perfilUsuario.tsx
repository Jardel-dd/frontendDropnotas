import { PerfilUser } from '@/app/entity/PerfilUsuarioEntity';
import { Messages } from 'primereact/messages';
import { TreeCheckboxSelectionKeys } from 'primereact/tree';
import { RefObject } from 'react';

export interface PermissoesFormRef {
    handleSave: () => Promise<void>;
}

export interface PermissoesFormProps {
    perfilUser: PerfilUser;
    initialId?: string | null;
    onSuccess?: () => void;
    msgs: RefObject<Messages | null>;
    onPerfilUserChange?: (perfilUser: PerfilUser) => void;
    onErrorsChange?: (errors: Record<string, string>) => void;
    setPerfilUser?: React.Dispatch<React.SetStateAction<PerfilUser>>;
    redirectAfterSave?: boolean;
    onSaved?: (created: PerfilUser) => void;
    onClose?: () => void;
    showBTNPGCreatedDialog?: boolean;
    showBTNPGCreatedAll?: boolean;
    onBackClick?: () => void;
}

export interface PermissoesFieldsProps {
    perfilUser: PerfilUser;
    errors: Record<string, string>;
    selectedKeys: TreeCheckboxSelectionKeys;
    isLoading: boolean;
    onChange: (event: { target: { id: string; value: any; checked?: any; type: string } }) => void;
    onDropdownChange: (event: any) => void;
    onSelectionChange: (selectedKeys: TreeCheckboxSelectionKeys) => void;
    onValidateNome: () => void;
}

export type FormCreatedPermissoesProps = PermissoesFieldsProps | PermissoesFormProps;

export interface PerfilUserDropdownFieldProps {
    selectedPerfilUser: PerfilUser | null;
    onPerfilUserChange: (perfilUser: PerfilUser | null) => void;
    reloadKey?: number;
    hasError?: boolean;
    errorMessage?: string;
    showAddButton?: boolean;
    onAddClick?: () => void;
    autoSelectSingle?: boolean;
}
export const createEmptyPerfilUser = () =>
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
        nfseCadastrar: false,
        nfseAlterar: false,
        nfseDesativar: false,
        nfsePesquisar: false,
        integracaoCadastrar: false,
        integracaoAlterar: false,
        integracaoDesativar: false,
        integracaoPesquisar: false,
        nfseTipoVisualizacao: ''
    });