'use client';

import React from 'react';
import { PrimeReactProvider } from 'primereact/api';
import { LoadingProvider } from '@/layout/context/LoadingContext';
import { UserProvider } from './routes/protected/UserContext';
import { LayoutProvider } from '@/layout/context/layoutcontext';

export default function AppProviders({ children }: { children: React.ReactNode }) {
    return (
        <PrimeReactProvider>
            <LoadingProvider>
                <UserProvider>
                    <LayoutProvider>{children}</LayoutProvider>
                </UserProvider>
            </LoadingProvider>
        </PrimeReactProvider>
    );
}
