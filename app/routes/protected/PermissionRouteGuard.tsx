'use client';

import React, { useEffect, useMemo, useState } from 'react';
import LoadingScreen from '@/app/loading';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useUser } from '@/app/routes/protected/UserContext';
import { ACCESS_DENIED_PATH, isPathAuthorized } from '@/app/routes/protected/routePermissions';

interface PermissionRouteGuardProps {
    children: React.ReactNode;
}

const PermissionRouteGuard: React.FC<PermissionRouteGuardProps> = ({ children }) => {
    const router = useRouter();
    const pathname = usePathname() ?? '';
    const searchParams = useSearchParams();
    const { userConta } = useUser();
    const [isRedirecting, setIsRedirecting] = useState(false);
    const hasStoredUser = typeof window !== 'undefined' && !!window.localStorage.getItem('userConta');

    const currentPathWithQuery = useMemo(() => {
        const queryString = searchParams?.toString();
        return queryString ? `${pathname}?${queryString}` : pathname;
    }, [pathname, searchParams]);

    const hasStoredToken = typeof window !== 'undefined' && !!window.localStorage.getItem('token');
    const isUserContextLoading = hasStoredToken && hasStoredUser && !userConta;
    const isAuthorized = isPathAuthorized(pathname, userConta);

    useEffect(() => {
        if (isUserContextLoading) {
            return;
        }

        if (pathname === ACCESS_DENIED_PATH) {
            setIsRedirecting(false);
            return;
        }

        if (!isAuthorized) {
            setIsRedirecting(true);
            router.replace(`${ACCESS_DENIED_PATH}?from=${encodeURIComponent(currentPathWithQuery)}`);
            return;
        }

        setIsRedirecting(false);
    }, [currentPathWithQuery, isAuthorized, isUserContextLoading, pathname, router]);

    if (isUserContextLoading || isRedirecting) {
        return <LoadingScreen loadingText="Atualizando permissoes de acesso..." />;
    }

    if (!isAuthorized && pathname !== ACCESS_DENIED_PATH) {
        return <LoadingScreen loadingText="Atualizando permissoes de acesso..." />;
    }

    return <>{children}</>;
};

export default PermissionRouteGuard;
