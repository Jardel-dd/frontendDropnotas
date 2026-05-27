import type { UsuarioContaEntity } from '@/app/entity/UsuarioContaEntity';
import { hasPermissionAccess, type PermissionResourceKey } from '@/app/routes/permissionRules';

export const ACCESS_DENIED_PATH = '/acesso-negado';

type RoutePermissionRule = {
    pathPrefix: string;
    resource: PermissionResourceKey;
};

const routePermissionRules: RoutePermissionRule[] = [
    {
        pathPrefix: '/dashboard',
        resource: 'dashboard'
    },
    {
        pathPrefix: '/cadastro/pessoas',
        resource: 'pessoa'
    },
    {
        pathPrefix: '/cadastro/servicos',
        resource: 'servico'
    },
    {
        pathPrefix: '/cadastro/vendedores',
        resource: 'vendedor'
    },
    {
        pathPrefix: '/cadastro/usuarios',
        resource: 'usuarioConta'
    },
    {
        pathPrefix: '/cadastro/permissoes',
        resource: 'perfilUsuario'
    },
    {
        pathPrefix: '/cadastro/formaPagamento',
        resource: 'formaPagamento'
    },
    {
        pathPrefix: '/cadastro/categoriaContratos',
        resource: 'categoriaContrato'
    },
    {
        pathPrefix: '/contrato',
        resource: 'contrato'
    },
    {
        pathPrefix: '/ordemServicos',
        resource: 'ordemServico'
    },
    {
        pathPrefix: '/notaServico',
        resource: 'nfse'
    },
    {
        pathPrefix: '/financas',
        resource: 'financeiro'
    },
    {
        pathPrefix: '/cobrancas',
        resource: 'financeiro'
    },
    {
        pathPrefix: '/configuracoes/empresas',
        resource: 'empresa'
    },
    {
        pathPrefix: '/configuracoes/geral',
        resource: 'configuracoes'
    }
];

export const isPathAuthorized = (pathname: string, userConta: UsuarioContaEntity | null) => {
    if (!pathname || pathname === ACCESS_DENIED_PATH) {
        return true;
    }

    const matchedRule = routePermissionRules.find((rule) => pathname.startsWith(rule.pathPrefix));

    if (!matchedRule) {
        return true;
    }

    return hasPermissionAccess(userConta, matchedRule.resource);
};
