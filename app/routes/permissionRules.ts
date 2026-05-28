import type { MenuModel } from '@/types';
import type { PerfilUsuario } from '@/app/entity/CreatedAccountEntity';
import type { UsuarioContaEntity } from '@/app/entity/UsuarioContaEntity';

export type PermissionAction = 'view' | 'create' | 'update' | 'delete' | 'search';

export type PermissionResourceKey =
    | 'dashboard'
    | 'perfilUsuario'
    | 'usuarioConta'
    | 'empresa'
    | 'pessoa'
    | 'vendedor'
    | 'servico'
    | 'ordemServico'
    | 'contrato'
    | 'categoriaContrato'
    | 'formaPagamento'
    | 'integracao'
    | 'nfse'
    | 'financeiro'
    | 'configuracoes'
    | 'is_usuario_principal';

export type PermissionFlags = {
    view: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
    search: boolean;
};

type PermissionDefinition = {
    viewKey?: keyof PerfilUsuario;
    fallbackViewKeys?: Array<keyof PerfilUsuario>;
    defaultView?: boolean;
    createKey?: keyof PerfilUsuario;
    updateKey?: keyof PerfilUsuario;
    deleteKey?: keyof PerfilUsuario;
    searchKey?: keyof PerfilUsuario;
};

const permissionDefinitions: Record<PermissionResourceKey, PermissionDefinition> = {
    dashboard: {
        viewKey: 'empresa'
    },
    perfilUsuario: {
        viewKey: 'perfilUsuario',
        createKey: 'perfilUsuarioCadastrar',
        updateKey: 'perfilUsuarioAlterar',
        deleteKey: 'perfilUsuarioDesativar',
        searchKey: 'perfilUsuarioPesquisar'
    },
    usuarioConta: {
        viewKey: 'usuarioConta',
        createKey: 'usuarioContaCadastrar',
        updateKey: 'usuarioContaAlterar',
        deleteKey: 'usuarioContaDesativar',
        searchKey: 'usuarioContaPesquisar'
    },
    empresa: {
        viewKey: 'empresa',
        createKey: 'empresaCadastrar',
        updateKey: 'empresaAlterar',
        deleteKey: 'empresaDesativar',
        searchKey: 'empresaPesquisar'
    },
    pessoa: {
        viewKey: 'pessoa',
        createKey: 'pessoaCadastrar',
        updateKey: 'pessoaAlterar',
        deleteKey: 'pessoaDesativar',
        searchKey: 'pessoaPesquisar'
    },
    vendedor: {
        viewKey: 'vendedor',
        createKey: 'vendedorCadastrar',
        updateKey: 'vendedorAlterar',
        deleteKey: 'vendedorDesativar',
        searchKey: 'vendedorPesquisar'
    },
    servico: {
        viewKey: 'servico',
        createKey: 'servicoCadastrar',
        updateKey: 'servicoAlterar',
        deleteKey: 'servicoDesativar',
        searchKey: 'servicoPesquisar'
    },
    ordemServico: {
        viewKey: 'ordemServico',
        createKey: 'ordemServicoCadastrar',
        updateKey: 'ordemServicoAlterar',
        deleteKey: 'ordemServicoDesativar',
        searchKey: 'ordemServicoPesquisar'
    },
    contrato: {
        viewKey: 'contrato',
        createKey: 'contratoCadastrar',
        updateKey: 'contratoAlterar',
        deleteKey: 'contratoDesativar',
        searchKey: 'contratoPesquisar'
    },
    categoriaContrato: {
        viewKey: 'categoriaContrato',
        createKey: 'categoriaContratoCadastrar',
        updateKey: 'categoriaContratoAlterar',
        deleteKey: 'categoriaContratoDesativar',
        searchKey: 'categoriaContratoPesquisar'
    },
    formaPagamento: {
        viewKey: 'formaPagamento',
        createKey: 'formaPagamentoCadastrar',
        updateKey: 'formaPagamentoAlterar',
        deleteKey: 'formaPagamentoDesativar',
        searchKey: 'formaPagamentoPesquisar'
    },
    integracao: {
        viewKey: 'integracao',
        createKey: 'integracaoCadastrar',
        updateKey: 'integracaoAlterar',
        deleteKey: 'integracaoDesativar',
        searchKey: 'integracaoPesquisar'
    },
    nfse: {
        viewKey: 'nfse',
        createKey: 'nfseCadastrar',
        updateKey: 'nfseAlterar',
        deleteKey: 'nfseDesativar',
        searchKey: 'nfsePesquisar'
    },
    financeiro: {
        viewKey: 'financeiro',
        defaultView: true
    },
    configuracoes: {
        viewKey: 'configuracoes',
        updateKey: 'permiteAlterarConfiguracoes'
    },
    is_usuario_principal: {
        defaultView: false
    }
};

const normalizePermissionValue = (value: unknown) => {
    if (typeof value === 'boolean') {
        return value;
    }

    if (typeof value === 'number') {
        if (value === 1) {
            return true;
        }

        if (value === 0) {
            return false;
        }

        return Boolean(value);
    }

    if (typeof value === 'string') {
        const normalizedValue = value.trim().toLowerCase();

        if (['true', '1', 'sim', 's', 'yes', 'y'].includes(normalizedValue)) {
            return true;
        }

        if (['false', '0', 'nao', 'não', 'n', 'no', 'null', 'undefined', ''].includes(normalizedValue)) {
            return false;
        }
    }

    return false;
};

const readActionPermission = (perfilUsuario: PerfilUsuario | undefined, key?: keyof PerfilUsuario) => {
    if (!perfilUsuario || !key) {
        return false;
    }

    return normalizePermissionValue(perfilUsuario[key]);
};

const readViewPermission = (perfilUsuario: PerfilUsuario | undefined, definition: PermissionDefinition) => {
    if (!perfilUsuario) {
        return false;
    }

    if (definition.viewKey && perfilUsuario[definition.viewKey] !== undefined) {
        return normalizePermissionValue(perfilUsuario[definition.viewKey]);
    }

    for (const fallbackKey of definition.fallbackViewKeys ?? []) {
        if (perfilUsuario[fallbackKey] !== undefined) {
            return normalizePermissionValue(perfilUsuario[fallbackKey]);
        }
    }

    return definition.defaultView ?? false;
};

const readPrimaryUserPermission = (userConta: UsuarioContaEntity | null) => {
    return normalizePermissionValue(userConta?.is_usuario_principal);
};

export const getPermissionFlags = (userConta: UsuarioContaEntity | null, resource: PermissionResourceKey): PermissionFlags => {
    if (resource === 'is_usuario_principal') {
        return {
            view: readPrimaryUserPermission(userConta),
            create: false,
            update: false,
            delete: false,
            search: false
        };
    }

    const perfilUsuario = userConta?.perfil_usuario;
    const definition = permissionDefinitions[resource];

    return {
        view: readViewPermission(perfilUsuario, definition),
        create: readActionPermission(perfilUsuario, definition.createKey),
        update: readActionPermission(perfilUsuario, definition.updateKey),
        delete: readActionPermission(perfilUsuario, definition.deleteKey),
        search: readActionPermission(perfilUsuario, definition.searchKey)
    };
};

export const hasPermissionAccess = (userConta: UsuarioContaEntity | null, resource: PermissionResourceKey, action: PermissionAction = 'view') => {
    return getPermissionFlags(userConta, resource)[action];
};

export const filterVisibleMenuItems = (items: MenuModel[]): MenuModel[] => {
    return items.flatMap((item) => {
        if (item.visible === false) {
            return [];
        }

        const nextItems = item.items ? filterVisibleMenuItems(item.items) : undefined;
        const shouldHideEmptyGroup = !item.to && !item.url && (!nextItems || nextItems.length === 0);

        if (shouldHideEmptyGroup) {
            return [];
        }

        return [
            {
                ...item,
                items: nextItems
            }
        ];
    });
};
