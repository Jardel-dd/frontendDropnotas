import type { ColorScheme } from '@/types';
import type { UsuarioContaEntity } from '@/app/entity/UsuarioContaEntity';
import { AUTH_STORAGE_KEYS } from '@/app/services/authStorage';

type ThemePreferences = {
    colorScheme: ColorScheme;
    componentTheme: string;
};

type ThemePreferencesSource = Partial<ThemePreferences & Pick<UsuarioContaEntity, 'tema_componente' | 'esquema_cor'>>;

const AVAILABLE_COMPONENT_THEMES = ['indigo', 'blue', 'green', 'deeppurple', 'orange', 'cyan', 'yellow', 'pink', 'purple', 'lime'] as const;

const COLOR_SCHEME_ALIASES: Record<string, ColorScheme> = {
    light: 'light',
    ligth: 'light',
    dark: 'dark'
};

export const THEME_PREFERENCES_STORAGE_KEY = 'themePreferences';

export const DEFAULT_COLOR_SCHEME: ColorScheme = 'light';
export const DEFAULT_COMPONENT_THEME = 'green';

const getDefaultThemePreferences = (): ThemePreferences => ({
    colorScheme: DEFAULT_COLOR_SCHEME,
    componentTheme: DEFAULT_COMPONENT_THEME
});

export const normalizeColorScheme = (value?: string | null): ColorScheme => {
    const normalizedValue = value?.trim().toLowerCase();

    if (normalizedValue && normalizedValue in COLOR_SCHEME_ALIASES) {
        return COLOR_SCHEME_ALIASES[normalizedValue];
    }

    return DEFAULT_COLOR_SCHEME;
};

export const normalizeComponentTheme = (value?: string | null): string => {
    const normalizedValue = value?.trim().toLowerCase();

    if (normalizedValue && AVAILABLE_COMPONENT_THEMES.includes(normalizedValue as (typeof AVAILABLE_COMPONENT_THEMES)[number])) {
        return normalizedValue;
    }

    return DEFAULT_COMPONENT_THEME;
};

const buildThemePreferences = (source?: ThemePreferencesSource | null): ThemePreferences => ({
    colorScheme: normalizeColorScheme(source?.colorScheme ?? source?.tema_componente),
    componentTheme: normalizeComponentTheme(source?.componentTheme ?? source?.esquema_cor)
});

export const getThemePreferencesFromUser = (userData?: Partial<Pick<UsuarioContaEntity, 'tema_componente' | 'esquema_cor'>> | null): ThemePreferences => buildThemePreferences(userData);

export const getThemePreferencesFromCookieValue = (cookieValue?: string | null): ThemePreferences | null => {
    if (!cookieValue) {
        return null;
    }

    try {
        return buildThemePreferences(JSON.parse(decodeURIComponent(cookieValue)));
    } catch {
        return null;
    }
};

export const getThemeHref = (colorScheme?: string | null, componentTheme?: string | null) => {
    const normalizedColorScheme = normalizeColorScheme(colorScheme);
    const normalizedComponentTheme = normalizeComponentTheme(componentTheme);

    return `/theme/theme-${normalizedColorScheme}/${normalizedComponentTheme}/theme.css`;
};

export const applyThemeLink = (colorScheme?: string | null, componentTheme?: string | null, themeLinkId = 'theme-link') => {
    if (typeof document === 'undefined') {
        return;
    }

    const themeLink = document.getElementById(themeLinkId) as HTMLLinkElement | null;

    if (themeLink) {
        themeLink.href = getThemeHref(colorScheme, componentTheme);
    }
};

const getStoredDedicatedThemePreferences = (): ThemePreferences | null => {
    if (typeof window === 'undefined') {
        return null;
    }

    try {
        const storedThemePreferences = localStorage.getItem(THEME_PREFERENCES_STORAGE_KEY);

        if (!storedThemePreferences) {
            return null;
        }

        return buildThemePreferences(JSON.parse(storedThemePreferences));
    } catch {
        return null;
    }
};

export const getStoredUserThemePreferences = (): ThemePreferences => {
    if (typeof window === 'undefined') {
        return getDefaultThemePreferences();
    }

    const storedDedicatedPreferences = getStoredDedicatedThemePreferences();

    if (storedDedicatedPreferences) {
        return storedDedicatedPreferences;
    }

    try {
        const storedUser = localStorage.getItem(AUTH_STORAGE_KEYS.user);

        if (!storedUser) {
            return getDefaultThemePreferences();
        }

        return getThemePreferencesFromUser(JSON.parse(storedUser));
    } catch {
        return getDefaultThemePreferences();
    }
};

export const updateStoredUserThemePreferences = ({ colorScheme, componentTheme }: { colorScheme?: string | null; componentTheme?: string | null }) => {
    if (typeof window === 'undefined') {
        return;
    }

    try {
        const currentThemePreferences = getStoredUserThemePreferences();
        const nextThemePreferences = {
            colorScheme: colorScheme ? normalizeColorScheme(colorScheme) : currentThemePreferences.colorScheme,
            componentTheme: componentTheme ? normalizeComponentTheme(componentTheme) : currentThemePreferences.componentTheme
        };

        localStorage.setItem(THEME_PREFERENCES_STORAGE_KEY, JSON.stringify(nextThemePreferences));
        document.cookie = `${THEME_PREFERENCES_STORAGE_KEY}=${encodeURIComponent(JSON.stringify(nextThemePreferences))}; path=/; max-age=31536000; SameSite=Lax`;

        const storedUser = localStorage.getItem(AUTH_STORAGE_KEYS.user);

        if (!storedUser) {
            return;
        }

        const parsedUser = JSON.parse(storedUser);
        const nextUser = {
            ...parsedUser,
            tema_componente: nextThemePreferences.colorScheme,
            esquema_cor: nextThemePreferences.componentTheme
        };

        localStorage.setItem(AUTH_STORAGE_KEYS.user, JSON.stringify(nextUser));
    } catch {
        return;
    }
};

export const getThemeInitializationScript = (themeLinkId = 'theme-link') => `
(() => {
    try {
        const storageKey = ${JSON.stringify(THEME_PREFERENCES_STORAGE_KEY)};
        const rawThemePreferences = window.localStorage.getItem(storageKey);
        const rawUser = window.localStorage.getItem(${JSON.stringify(AUTH_STORAGE_KEYS.user)});
        const colorSchemeAliases = ${JSON.stringify(COLOR_SCHEME_ALIASES)};
        const availableComponentThemes = ${JSON.stringify([...AVAILABLE_COMPONENT_THEMES])};
        const defaultColorScheme = ${JSON.stringify(DEFAULT_COLOR_SCHEME)};
        const defaultComponentTheme = ${JSON.stringify(DEFAULT_COMPONENT_THEME)};
        const normalizeColorScheme = (value) => {
            const normalizedValue =
                typeof value === 'string'
                    ? value.trim().toLowerCase()
                    : '';

            return (
                colorSchemeAliases[normalizedValue] ||
                defaultColorScheme
            );
        };
        const normalizeComponentTheme = (value) => {
            const normalizedValue =
                typeof value === 'string'
                    ? value.trim().toLowerCase()
                    : '';

            return availableComponentThemes.includes(
                normalizedValue
            )
                ? normalizedValue
                : defaultComponentTheme;
        };
        const parsedThemePreferences = rawThemePreferences
            ? JSON.parse(rawThemePreferences)
            : null;
        const parsedUser =
            !parsedThemePreferences && rawUser
                ? JSON.parse(rawUser)
                : null;
        const source = parsedThemePreferences || parsedUser || {};
        const colorScheme = normalizeColorScheme(
            source.colorScheme ?? source.tema_componente
        );
        const componentTheme = normalizeComponentTheme(
            source.componentTheme ?? source.esquema_cor
        );
        const themeLink = document.getElementById(
            ${JSON.stringify(themeLinkId)}
        );

        if (themeLink) {
            themeLink.href =
                '/theme/theme-' +
                colorScheme +
                '/' +
                componentTheme +
                '/theme.css';
        }
    } catch (error) {
        console.error(
            '[ThemePreferences] Falha ao aplicar tema inicial:',
            error
        );
    }
})();
`;
