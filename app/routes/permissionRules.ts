import type { MenuModel } from '@/types';
import type { PerfilUsuario } from '@/app/entity/CreatedAccountEntity';
import type { UsuarioContaEntity } from '@/app/entity/UsuarioContaEntity';
import { PermissionAction, PermissionDefinition, PermissionFlags, PermissionResourceKey } from './typesPermissoes';

const permissionDefinitions: Record<PermissionResourceKey, PermissionDefinition> = {

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
    nfse: {
        viewKey: 'nfse',
        createKey: 'nfseCadastrar',
        updateKey: 'nfseAlterar',
        deleteKey: 'nfseDesativar',
        searchKey: 'nfsePesquisar'
    },
      integracao: {
        viewKey: 'integracao',
        createKey: 'integracaoCadastrar',
        updateKey: 'integracaoAlterar',
        deleteKey: 'integracaoDesativar',
        searchKey: 'integracaoPesquisar'
    },
     perfilTributario: {
        viewKey: 'perfilTributario',
        createKey: 'perfilTributarioCadastrar',
        updateKey: 'perfilTributarioAlterar',
        deleteKey: 'perfilTributarioDesativar',
        searchKey: 'perfilTributarioPesquisar'
    },
     relatorio: {
        viewKey: 'relatorio',
    },
      relatorioServico: {
        viewKey: 'relatorioServico',
    },
       relatorioRecebimento: {
        viewKey: 'relatorioRecebimento',
    },
      financas: {
        viewKey: 'financas'
    },
    contaPagar: {
        viewKey: 'contaPagarPesquisar',
        createKey: 'contaPagarCadastrar',
        searchKey: 'contaPagarPesquisar'
    },
    contaReceber: {
        viewKey: 'contaReceberPesquisar',
        createKey: 'contaReceberCadastrar',
        searchKey: 'contaReceberPesquisar'
    },
    comissao: {
        viewKey: 'comissaoVisualizar'
    },
    configuracoes: {
        viewKey: 'permiteAlterarConfiguracoes'
    },
    permiteAlterarConfiguracoes: {
        viewKey: 'permiteAlterarConfiguracoes'
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

    if (!definition) {
        return {
            view: false,
            create: false,
            update: false,
            delete: false,
            search: false
        };
    }

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
