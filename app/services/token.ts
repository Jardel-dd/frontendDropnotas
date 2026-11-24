import api from './api';
import { JwtPayload, jwtDecode } from 'jwt-decode';
import { logoutUser } from '../(full-page)/auth/logout/logoutRefreshToken';
import { readStoredAuthValue, writeStoredAuthValue } from './authStorage';

const TOKEN_REFRESH_LEEWAY_MS = 30_000;
const AUTH_DEBUG_STORAGE_KEY = 'dropnotas:auth-debug';
const AUTH_DEBUG_BREAKPOINT_STORAGE_KEY = 'dropnotas:auth-debug-breakpoint';

let refreshTokenPromise: Promise<string | null> | null = null;
let tokenRefreshTimer: number | null = null;

const isAuthDebugEnabled = () => {
    if (process.env.NODE_ENV !== 'development' || typeof window === 'undefined') {
        return false;
    }

    return window.localStorage.getItem(AUTH_DEBUG_STORAGE_KEY) === 'true';
};

const authDebug = (event: string, details: Record<string, unknown> = {}) => {
    if (!isAuthDebugEnabled()) {
        return;
    }

    console.info(`[auth] ${event}`, details);
};

const authDebugBreakpoint = (event: string, details: Record<string, unknown> = {}) => {
    authDebug(event, details);

    if (
        process.env.NODE_ENV === 'development' &&
        typeof window !== 'undefined' &&
        window.localStorage.getItem(AUTH_DEBUG_BREAKPOINT_STORAGE_KEY) === 'true'
    ) {
        // Ative apenas durante a investigacao local: o breakpoint nunca e executado em producao.
        debugger;
    }
};

const getTokenPayload = (token: string): JwtPayload | null => {
    try {
        return jwtDecode<JwtPayload>(token);
    } catch {
        return null;
    }
};

const getTokenExpirationDetails = (token: string) => {
    const expirationInSeconds = getTokenPayload(token)?.exp;
    const expiresAt = expirationInSeconds ? expirationInSeconds * 1000 : null;

    return {
        expiresAt,
        expiresInMs: expiresAt === null ? null : expiresAt - Date.now()
    };
};

const getRefreshResponseTokens = (data: unknown) => {
    const response = (data ?? {}) as Record<string, unknown>;
    const token = response.token ?? response.accessToken ?? response.access_token;
    const refreshToken = response.refreshToken ?? response.refresh_token;

    return {
        token: typeof token === 'string' && token.length > 0 ? token : null,
        refreshToken: typeof refreshToken === 'string' && refreshToken.length > 0 ? refreshToken : null,
        responseKeys: Object.keys(response)
    };
};

const getRequestErrorDetails = (error: any) => ({
    status: error?.response?.status ?? null,
    code: error?.code ?? null,
    message: typeof error?.message === 'string' ? error.message : null
});

const scheduleTokenRefresh = (token: string) => {
    if (typeof window === 'undefined') {
        return;
    }

    if (tokenRefreshTimer) {
        window.clearTimeout(tokenRefreshTimer);
        tokenRefreshTimer = null;
    }

    const { expiresAt, expiresInMs } = getTokenExpirationDetails(token);
    if (!expiresAt || expiresInMs === null) {
        authDebug('renewal-not-scheduled-invalid-expiration');
        return;
    }

    const delay = Math.max(0, expiresInMs - TOKEN_REFRESH_LEEWAY_MS);
    authDebug('renewal-scheduled', { expiresAt: new Date(expiresAt).toISOString(), delayMs: delay });

    tokenRefreshTimer = window.setTimeout(() => {
        tokenRefreshTimer = null;

        if (!getRefreshToken()) {
            authDebug('scheduled-renewal-cancelled-session-ended');
            return;
        }

        authDebugBreakpoint('scheduled-renewal-started', { expiresAt: new Date(expiresAt).toISOString() });
        void renewToken();
    }, delay);
};

export const getToken = async (): Promise<string | null> => {
    const token = readStoredAuthValue('token');
    if (!token) {
        authDebugBreakpoint('access-token-missing', { hasRefreshToken: Boolean(getRefreshToken()) });
        return getRefreshToken() ? renewToken() : null;
    }

    const payload = getTokenPayload(token);
    if (!payload) {
        authDebugBreakpoint('access-token-invalid', { hasRefreshToken: Boolean(getRefreshToken()) });
        return getRefreshToken() ? renewToken() : null;
    }

    if (!isExpired(payload.exp)) {
        scheduleTokenRefresh(token);
        return token;
    }

    authDebugBreakpoint('access-token-expired-or-near-expiration', getTokenExpirationDetails(token));
    return renewToken();
};

export const getTokenDecoded = (): JwtPayload | null => {
    const token = readStoredAuthValue('token');
    if (!token) {
        return null;
    }

    const tokenDecoded = getTokenPayload(token);
    if (!tokenDecoded) {
        console.error('[auth] Nao foi possivel decodificar o token de acesso.');
    }

    return tokenDecoded;
};

const isExpired = (exp?: number) => {
    if (!exp) {
        return true;
    }

    return exp * 1000 <= Date.now() + TOKEN_REFRESH_LEEWAY_MS;
};

const performTokenRenewal = async (): Promise<string | null> => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
        authDebugBreakpoint('renewal-failed-refresh-token-missing');
        logoutUser();
        return null;
    }

    try {
        authDebugBreakpoint('renewal-request-started');
        const response = await api.post('/refresh-token', { refreshToken });
        const { token, refreshToken: newRefreshToken, responseKeys } = getRefreshResponseTokens(response.data);

        if (!token) {
            authDebugBreakpoint('renewal-failed-invalid-response', { responseKeys });
            logoutUser();
            return null;
        }

        saveToken(token);

        // Alguns backends rotacionam o refresh token; outros devolvem apenas o token de acesso.
        // Nos dois contratos a sessao continua valida, preservando o refresh token anterior quando necessario.
        if (newRefreshToken) {
            saveRefreshToken(newRefreshToken);
        }

        authDebugBreakpoint('renewal-succeeded', {
            refreshTokenRotated: Boolean(newRefreshToken),
            ...getTokenExpirationDetails(token)
        });
        return token;
    } catch (error: any) {
        const details = getRequestErrorDetails(error);
        authDebugBreakpoint('renewal-request-failed', details);

        if (details.status === 401 || details.status === 403) {
            logoutUser();
        }

        return null;
    }
};

export const renewToken = async (): Promise<string | null> => {
    if (refreshTokenPromise) {
        authDebug('renewal-joined-in-progress-request');
        return refreshTokenPromise;
    }

    refreshTokenPromise = performTokenRenewal();

    try {
        return await refreshTokenPromise;
    } finally {
        refreshTokenPromise = null;
    }
};

export const saveToken = (token: string) => {
    if (token && token !== 'token') {
        writeStoredAuthValue('token', token);
        scheduleTokenRefresh(token);
    } else {
        console.error('[auth] Tentativa de salvar um token de acesso invalido.');
    }
};

export const saveRefreshToken = (refreshToken: string) => {
    if (refreshToken && refreshToken !== 'refreshToken') {
        writeStoredAuthValue('refreshToken', refreshToken);
    } else {
        console.error('[auth] Tentativa de salvar um refresh token invalido.');
    }
};

export const getRefreshToken = (): string | null => {
    return readStoredAuthValue('refreshToken');
};
