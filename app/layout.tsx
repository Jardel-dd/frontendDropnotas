import React from 'react';
import { cookies } from 'next/headers';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import '../styles/layout/layout.scss';
import 'primereact/resources/primereact.css';
import 'primereact/resources/primereact.min.css';
import AppProviders from './providers';
import { DEFAULT_COLOR_SCHEME, DEFAULT_COMPONENT_THEME, THEME_PREFERENCES_STORAGE_KEY, getThemeHref, getThemePreferencesFromCookieValue } from './utils/themePreferences';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const themePreferencesCookie = cookies().get(THEME_PREFERENCES_STORAGE_KEY)?.value;
    const initialThemePreferences = getThemePreferencesFromCookieValue(themePreferencesCookie) ?? {
        colorScheme: DEFAULT_COLOR_SCHEME,
        componentTheme: DEFAULT_COMPONENT_THEME
    };

    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <title>DropNotas</title>
                <link rel="icon" href="/layout/images/logoDrm.png" />
                <link id="theme-link" href={getThemeHref(initialThemePreferences.colorScheme, initialThemePreferences.componentTheme)} rel="stylesheet" suppressHydrationWarning />
            </head>
            <body style={{ overflow: 'hidden' }}>
                <AppProviders>{children}</AppProviders>
            </body>
            
        </html>
    );
}
