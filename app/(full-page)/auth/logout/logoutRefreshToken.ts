import { applyThemeLink, DEFAULT_COLOR_SCHEME, DEFAULT_COMPONENT_THEME, THEME_PREFERENCES_STORAGE_KEY } from '@/app/utils/themePreferences';
import { AUTH_STORAGE_KEYS } from '@/app/services/authStorage';

const AUTH_STORAGE_KEYS_TO_CLEAR = [AUTH_STORAGE_KEYS.token, AUTH_STORAGE_KEYS.refreshToken, AUTH_STORAGE_KEYS.user, 'colorScheme', THEME_PREFERENCES_STORAGE_KEY] as const;
const DEFAULT_LOGOUT_REDIRECT_PATH = '/';

const clearThemeCookie = () => {
    if (typeof document === 'undefined') {
        return;
    }

    document.cookie = `${THEME_PREFERENCES_STORAGE_KEY}=; path=/; max-age=0; SameSite=Lax`;
};

const resetPublicThemeToDefault = () => {
    if (typeof window === 'undefined') {
        return;
    }

    applyThemeLink(DEFAULT_COLOR_SCHEME, DEFAULT_COMPONENT_THEME);
};

export const clearAuthStorage = () => {
    if (typeof window === 'undefined') {
        return;
    }

    AUTH_STORAGE_KEYS_TO_CLEAR.forEach((key) => localStorage.removeItem(key));
    clearThemeCookie();
    resetPublicThemeToDefault();
};

export const redirectToLogout = (redirectPath = DEFAULT_LOGOUT_REDIRECT_PATH) => {
    window.location.href = redirectPath;
};

export const logoutUser = (redirectPath = DEFAULT_LOGOUT_REDIRECT_PATH) => {
    console.warn('Sessao expirada. Deslogando usuario...');
    clearAuthStorage();
    redirectToLogout(redirectPath);
};
