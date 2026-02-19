'use client';
import LoadingScreen from '@/app/loading';
import { useRouter } from 'next/navigation';
import React, { ReactNode, useEffect,  useState } from 'react';
interface PrivateRouteProps {
    children: ReactNode;
    redirectIfAuthenticated?: boolean;
}
export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, redirectIfAuthenticated = false }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true); 
    const [isAuthenticated, setIsAuthenticated] = useState(false); 
    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            if (token) {
                setIsAuthenticated(true);
                if (redirectIfAuthenticated) {
                    router.push('/dashboard'); 
                }
            } else {
                setIsAuthenticated(false);
                if (!redirectIfAuthenticated) {
                    setTimeout(() => {
                        router.push('/');
                    }, 3000);
                }
            }
            setIsLoading(false);
        };
        checkAuth();
    }, [router, redirectIfAuthenticated]);

    if (isLoading || (!isAuthenticated && !redirectIfAuthenticated)) {
        return <LoadingScreen loadingText={'Carregando...'} />;
    }
    return <>{children}</>;
};

export default PrivateRoute;
