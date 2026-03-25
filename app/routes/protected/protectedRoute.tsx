'use client';
import LoadingScreen from '@/app/loading';
import { getToken } from '@/app/services/token';
import { useRouter } from 'next/navigation';
import React, { ReactNode, useEffect, useState } from 'react';

interface PrivateRouteProps {
    children: ReactNode;
    redirectIfAuthenticated?: boolean;
}
export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, redirectIfAuthenticated = false }) => {
    const router = useRouter();
    const [authStatus, setAuthStatus] = useState<'checking' | 'authenticated' | 'unauthenticated'>('checking');
    useEffect(() => {
        let isMounted = true;
        const checkAuth = async () => {
            const token = await getToken();
            if (!isMounted) return;
            const nextStatus = token ? 'authenticated' : 'unauthenticated';
            setAuthStatus(nextStatus);
            if (nextStatus === 'authenticated' && redirectIfAuthenticated) {
                router.replace('/dashboard');
                return;
            }
            if (nextStatus === 'unauthenticated' && !redirectIfAuthenticated) {
                router.replace('/');
            }
        };
        checkAuth();

        return () => {
            isMounted = false;
        };
    }, [router, redirectIfAuthenticated]);

    const shouldBlockScreen = authStatus === 'checking' || (authStatus === 'authenticated' && redirectIfAuthenticated) || (authStatus === 'unauthenticated' && !redirectIfAuthenticated);

    if (shouldBlockScreen) {
        return <LoadingScreen loadingText={'Carregando...'} />;
    }

    return <>{children}</>;
};

export default PrivateRoute;
