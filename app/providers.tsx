'use client';

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PrimeReactProvider } from 'primereact/api';
import { LoadingProvider } from '@/layout/context/LoadingContext';
import { UserProvider } from './routes/protected/UserContext';
import { LayoutProvider } from '@/layout/context/layoutcontext';

export default function AppProviders({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        refetchOnWindowFocus: false,
                        retry: 1
                    }
                }
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            <PrimeReactProvider>
                <LoadingProvider>
                    <UserProvider>
                        <LayoutProvider>{children}</LayoutProvider>
                    </UserProvider>
                </LoadingProvider>
            </PrimeReactProvider>
        </QueryClientProvider>
    );
}
