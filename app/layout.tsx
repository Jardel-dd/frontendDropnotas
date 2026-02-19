'use client';
import React from 'react';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import '../styles/layout/layout.scss';
import 'primereact/resources/primereact.css';
import 'primereact/resources/primereact.min.css';
import { PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/themes/saga-blue/theme.css';
import { LayoutProvider } from '../layout/context/layoutcontext';
import { LoadingContext, LoadingProvider } from '@/layout/context/LoadingContext';
import LoadingScreen from './loading';
export default function RootLayout({ children }: { children: React.ReactNode }) {
    const { loading } = React.useContext(LoadingContext);
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <title>DropNotas</title>
                <link rel="icon" href="/layout/images/logoDrm.png" />
                <link id="theme-link" href={`/theme/theme-dark/green/theme.css`} rel="stylesheet"></link>
            </head>
            <body style={{ overflow: "hidden" }}>
                <PrimeReactProvider>
                    <LoadingProvider>
                        <LayoutProvider>
                            {loading ? <LoadingScreen loadingText={'Carregando...'} /> : children}
                        </LayoutProvider>
                    </LoadingProvider>
                </PrimeReactProvider>
            </body>
        </html>
    );
}
