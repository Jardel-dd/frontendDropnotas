import type { UsuarioContaEntity } from '@/app/entity/UsuarioContaEntity';

export const ACCESS_DENIED_PATH = '/acesso-negado';

type RoutePermissionRule = {
    pathPrefix: string;
    isAllowed: (userConta: UsuarioContaEntity | null) => boolean;
};

const routePermissionRules: RoutePermissionRule[] = [
    {
        pathPrefix: '/dashboard',
        isAllowed: (userConta) => !!userConta?.perfilUsuario?.empresa
    },
    {
        pathPrefix: '/cadastro/pessoas',
        isAllowed: (userConta) => !!userConta?.perfilUsuario?.pessoa
    },
    {
        pathPrefix: '/cadastro/servicos',
        isAllowed: (userConta) => !!userConta?.perfilUsuario?.servico
    },
    {
        pathPrefix: '/cadastro/vendedores',
        isAllowed: (userConta) => !!userConta?.perfilUsuario?.vendedor
    },
    {
        pathPrefix: '/cadastro/usuarios',
        isAllowed: (userConta) => !!userConta?.perfilUsuario?.usuarioConta
    },
    {
        pathPrefix: '/cadastro/permissoes',
        isAllowed: (userConta) => !!userConta?.perfilUsuario?.perfilUsuario
    },
    {
        pathPrefix: '/cadastro/formaPagamento',
        isAllowed: (userConta) => !!userConta?.perfilUsuario?.formaPagamento
    },
    {
        pathPrefix: '/cadastro/categoriaContratos',
        isAllowed: (userConta) => !!userConta?.perfilUsuario?.categoriaContrato
    },
    {
        pathPrefix: '/contrato',
        isAllowed: (userConta) => !!userConta?.perfilUsuario?.contrato
    },
    {
        pathPrefix: '/ordemServicos',
        isAllowed: (userConta) => !!userConta?.perfilUsuario?.ordemServico
    },
    {
        pathPrefix: '/financas',
        isAllowed: (userConta) => userConta?.perfilUsuario?.financeiro ?? true
    },
    {
        pathPrefix: '/cobrancas',
        isAllowed: (userConta) => userConta?.perfilUsuario?.financeiro ?? true
    },
    {
        pathPrefix: '/configuracoes',
        isAllowed: (userConta) => !!userConta?.perfilUsuario?.empresa
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

    return matchedRule.isAllowed(userConta);
};
