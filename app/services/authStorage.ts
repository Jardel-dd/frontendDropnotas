import { UsuarioContaEntity } from '@/app/entity/UsuarioContaEntity';

export const AUTH_STORAGE_KEYS = {
    token: 'token',
    refreshToken: 'refreshToken',
    user: 'userConta'
} as const;

const USER_RELOAD_SYNC_MARKER_KEY = 'auth:user-reload-sync-marker';

const canUseBrowserStorage = () => typeof window !== 'undefined';

export const readStoredAuthValue = (key: keyof typeof AUTH_STORAGE_KEYS) => {
    if (!canUseBrowserStorage()) {
        return null;
    }

    return localStorage.getItem(AUTH_STORAGE_KEYS[key]);
};

export const writeStoredAuthValue = (key: keyof typeof AUTH_STORAGE_KEYS, value: string | null) => {
    if (!canUseBrowserStorage()) {
        return;
    }

    if (!value) {
        localStorage.removeItem(AUTH_STORAGE_KEYS[key]);
        return;
    }

    localStorage.setItem(AUTH_STORAGE_KEYS[key], value);
};

export const readStoredUser = (): UsuarioContaEntity | null => {
    const rawStoredUser = readStoredAuthValue('user');

    if (!rawStoredUser) {
        return null;
    }

    try {
        return JSON.parse(rawStoredUser) as UsuarioContaEntity;
    } catch (error) {
        console.error('[authStorage] Falha ao ler userConta do storage:', error);
        return null;
    }
};

export const writeStoredUser = (user: UsuarioContaEntity | null) => {
    if (!user) {
        writeStoredAuthValue('user', null);
        return;
    }

    writeStoredAuthValue('user', JSON.stringify(user));
};

export const hasStoredToken = () => !!readStoredAuthValue('token');

export const hasStoredAuthSession = () => {
    const storedUser = readStoredUser();
    return hasStoredToken() && !!storedUser?.id;
};

export const isReloadNavigation = () => {
    if (typeof window === 'undefined') {
        return false;
    }

    const navigationEntries = window.performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    const navigationEntry = navigationEntries[0];

    if (navigationEntry?.type) {
        return navigationEntry.type === 'reload';
    }

    const legacyPerformance = window.performance as Performance & {
        navigation?: {
            type?: number;
        };
    };

    return legacyPerformance.navigation?.type === 1;
};

export const shouldSyncStoredUserOnReload = (userId?: number | null) => {
    if (!userId || !hasStoredAuthSession() || !isReloadNavigation() || typeof window === 'undefined') {
        return false;
    }

    try {
        const currentNavigationMarker = String(window.performance.timeOrigin || Date.now());
        const lastSyncedNavigationMarker = window.sessionStorage.getItem(USER_RELOAD_SYNC_MARKER_KEY);

        if (lastSyncedNavigationMarker === currentNavigationMarker) {
            return false;
        }

        window.sessionStorage.setItem(USER_RELOAD_SYNC_MARKER_KEY, currentNavigationMarker);
        return true;
    } catch {
        return true;
    }
};
