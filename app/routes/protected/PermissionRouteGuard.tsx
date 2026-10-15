'use client';

import React, { useEffect } from 'react';
import LoadingScreen from '@/app/loading';
import { useUser } from '@/app/routes/protected/UserContext';
import { hasPermissionAccess } from '@/app/routes/permissionRules';
import type { PermissionAction, PermissionResourceKey } from '@/app/routes/typesPermissoes';
import { usePathname, useRouter } from 'next/navigation';

interface PermissionRouteGuardProps {
    children: React.ReactNode;
}

type RoutePermission = {
    resource: PermissionResourceKey;
    action?: PermissionAction;
};

type ProtectedRoute = {
    path: string;
    permissions: RoutePermission[];
    allowPrimaryUser?: boolean;
};

const protectedRoutes: ProtectedRoute[] = [
    { path: '/cadastro/permissoes', permissions: [{ resource: 'perfilUsuario' }] },
    { path: '/cadastro/usuarios', permissions: [{ resource: 'usuarioConta' }] },
    { path: '/cadastro/pessoas', permissions: [{ resource: 'pessoa' }] },
    { path: '/cadastro/servicos', permissions: [{ resource: 'servico' }] },
    { path: '/cadastro/perfilTributario', permissions: [{ resource: 'perfilTributario' }] },
    { path: '/cadastro/vendedores', permissions: [{ resource: 'vendedor' }] },
    { path: '/cadastro/formaPagamento', permissions: [{ resource: 'formaPagamento' }] },
    { path: '/cadastro/categoriaContratos', permissions: [{ resource: 'categoriaContrato' }] },
    { path: '/configuracoes/empresas', permissions: [{ resource: 'configuracoes' }, { resource: 'empresa' }] },
    { path: '/financas/pagar', permissions: [{ resource: 'financas' }, { resource: 'contaPagar' }] },
    { path: '/financas/receber', permissions: [{ resource: 'financas' }, { resource: 'contaReceber' }] },
    { path: '/financas/comissoes', permissions: [{ resource: 'financas' }, { resource: 'comissao' }] },
    { path: '/relatorios/servicos', permissions: [{ resource: 'relatorio' }, { resource: 'relatorioServico' }] },
    { path: '/relatorios/recebimentos', permissions: [{ resource: 'relatorio' }, { resource: 'relatorioRecebimento' }] },
    { path: '/contrato', permissions: [{ resource: 'contrato' }] },
    { path: '/ordemServicos', permissions: [{ resource: 'ordemServico' }] },
    { path: '/notaServico', permissions: [{ resource: 'nfse' }] },
    { path: '/assinaturas', permissions: [{ resource: 'is_usuario_principal' }] },
    { path: '/financas', permissions: [{ resource: 'financas' }] },
    { path: '/configuracoes', permissions: [{ resource: 'configuracoes' }], allowPrimaryUser: true }
];

const findProtectedRoute = (pathname: string) => {
    return protectedRoutes.find(({ path }) => pathname === path || pathname.startsWith(`${path}/`));
};

const PermissionRouteGuard: React.FC<PermissionRouteGuardProps> = ({ children }) => {
    const { userConta, isInitializing } = useUser();
    const pathname = usePathname() ?? '';
    const router = useRouter();
    const protectedRoute = findProtectedRoute(pathname);
    const isCreateRoute = Boolean(protectedRoute && pathname.startsWith(`${protectedRoute.path}/created`));
    const hasPermissionsForRoute = protectedRoute?.permissions.every((permission, index) => {
        const isLastPermission = index === protectedRoute.permissions.length - 1;
        const action = isCreateRoute && isLastPermission ? 'create' : permission.action ?? 'view';

        return hasPermissionAccess(userConta, permission.resource, action);
    });
    const hasRouteAccess = !protectedRoute || hasPermissionsForRoute || (
        protectedRoute.allowPrimaryUser && hasPermissionAccess(userConta, 'is_usuario_principal')
    );

    useEffect(() => {
        if (!isInitializing && !hasRouteAccess) {
            router.replace('/dashboard');
        }
    }, [hasRouteAccess, isInitializing, router]);

    if (isInitializing) {
        return <LoadingScreen loadingText="Atualizando permissoes de acesso..." overlayOpacity={1} />;
    }

    if (!hasRouteAccess) {
        return <LoadingScreen loadingText="Redirecionando..." overlayOpacity={1} />;
    }

    return <>{children}</>;
};

export default PermissionRouteGuard;
