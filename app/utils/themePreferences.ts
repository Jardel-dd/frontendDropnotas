import type { ColorScheme } from '@/types';
import type { UsuarioContaEntity } from '@/app/entity/UsuarioContaEntity';

type ThemePreferences = {
    colorScheme: ColorScheme;
    componentTheme: string;
};

const AVAILABLE_COMPONENT_THEMES = [
    'indigo',
    'blue',
    'green',
    'deeppurple',
    'orange',
    'cyan',
    'yellow',
    'pink',
    'purple',
    'lime'
] as const;

const COLOR_SCHEME_ALIASES: Record<string, ColorScheme> = {
    light: 'light',
    ligth: 'light',
    dark: 'dark'
};

export const DEFAULT_COLOR_SCHEME: ColorScheme = 'dark';
export const DEFAULT_COMPONENT_THEME = 'green';

const getDefaultThemePreferences = (): ThemePreferences => ({
    colorScheme: DEFAULT_COLOR_SCHEME,
    componentTheme: DEFAULT_COMPONENT_THEME
});

export const normalizeColorScheme = (
    value?: string | null
): ColorScheme => {
    const normalizedValue = value?.trim().toLowerCase();

    if (
        normalizedValue &&
        normalizedValue in COLOR_SCHEME_ALIASES
    ) {
        return COLOR_SCHEME_ALIASES[normalizedValue];
    }

    return DEFAULT_COLOR_SCHEME;
};

export const normalizeComponentTheme = (
    value?: string | null
): string => {
    const normalizedValue = value?.trim().toLowerCase();

    if (
        normalizedValue &&
        AVAILABLE_COMPONENT_THEMES.includes(
            normalizedValue as (typeof AVAILABLE_COMPONENT_THEMES)[number]
        )
    ) {
        return normalizedValue;
    }

    return DEFAULT_COMPONENT_THEME;
};

export const getThemePreferencesFromUser = (
    userData?: Partial<
        Pick<
            UsuarioContaEntity,
            'tema_componente' | 'esquema_cor'
        >
    > | null
): ThemePreferences => ({
    colorScheme: normalizeColorScheme(
        userData?.tema_componente
    ),
    componentTheme: normalizeComponentTheme(
        userData?.esquema_cor
    )
});

export const getThemeHref = (
    colorScheme?: string | null,
    componentTheme?: string | null
) => {
    const normalizedColorScheme =
        normalizeColorScheme(colorScheme);
    const normalizedComponentTheme =
        normalizeComponentTheme(componentTheme);

    return `/theme/theme-${normalizedColorScheme}/${normalizedComponentTheme}/theme.css`;
};

export const applyThemeLink = (
    colorScheme?: string | null,
    componentTheme?: string | null,
    themeLinkId = 'theme-link'
) => {
    if (typeof document === 'undefined') {
        return;
    }

    const themeLink = document.getElementById(
        themeLinkId
    ) as HTMLLinkElement | null;

    if (themeLink) {
        themeLink.href = getThemeHref(
            colorScheme,
            componentTheme
        );
    }
};

export const getStoredUserThemePreferences =
    (): ThemePreferences => {
        if (typeof window === 'undefined') {
            return getDefaultThemePreferences();
        }

        try {
            const storedUser =
                localStorage.getItem('userConta');

            if (!storedUser) {
                return getDefaultThemePreferences();
            }

            return getThemePreferencesFromUser(
                JSON.parse(storedUser)
            );
        } catch {
            return getDefaultThemePreferences();
        }
    };

export const updateStoredUserThemePreferences = ({
    colorScheme,
    componentTheme
}: {
    colorScheme?: string | null;
    componentTheme?: string | null;
}) => {
    if (typeof window === 'undefined') {
        return;
    }

    try {
        const storedUser =
            localStorage.getItem('userConta');

        if (!storedUser) {
            return;
        }

        const parsedUser = JSON.parse(storedUser);
        const nextUser = {
            ...parsedUser,
            tema_componente: colorScheme
                ? normalizeColorScheme(colorScheme)
                : normalizeColorScheme(
                      parsedUser.tema_componente
                  ),
            esquema_cor: componentTheme
                ? normalizeComponentTheme(componentTheme)
                : normalizeComponentTheme(
                      parsedUser.esquema_cor
                  )
        };

        localStorage.setItem(
            'userConta',
            JSON.stringify(nextUser)
        );
    } catch {
        return;
    }
};
