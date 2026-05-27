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
    const { userConta, isInitializing } = useUser();
    const [isRedirecting, setIsRedirecting] = useState(false);

    const currentPathWithQuery = useMemo(() => {
        const queryString = searchParams?.toString();
        return queryString ? `${pathname}?${queryString}` : pathname;
    }, [pathname, searchParams]);

    const isAuthorized = isPathAuthorized(pathname, userConta);

    useEffect(() => {
        if (isInitializing) {
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
    }, [currentPathWithQuery, isAuthorized, isInitializing, pathname, router]);

    if (isInitializing || isRedirecting) {
        return <LoadingScreen loadingText="Verificando permissões de acesso..." overlayOpacity={1} />;
    }

    if (!isAuthorized && pathname !== ACCESS_DENIED_PATH) {
        return <LoadingScreen loadingText="Verificando permissões acesso..." overlayOpacity={1} />;
    }

    return <>{children}</>;
};

export default PermissionRouteGuard;
