'use client';

import React from 'react';
import LoadingScreen from '@/app/loading';
import { useUser } from '@/app/routes/protected/UserContext';

interface PermissionRouteGuardProps {
    children: React.ReactNode;
}

const PermissionRouteGuard: React.FC<PermissionRouteGuardProps> = ({ children }) => {
    const { isInitializing } = useUser();

    if (isInitializing) {
        return <LoadingScreen loadingText="Atualizando permissoes de acesso..." overlayOpacity={1} />;
    }

    return <>{children}</>;
};

export default PermissionRouteGuard;
