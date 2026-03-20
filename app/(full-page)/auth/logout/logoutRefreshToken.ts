
const AUTH_STORAGE_KEYS = [
    'token',
    'refreshToken',
    'userConta',
    'colorScheme'
] as const;
const DEFAULT_LOGOUT_REDIRECT_PATH = '/';

export const clearAuthStorage = () => {
    AUTH_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
};

export const redirectToLogout = (redirectPath = DEFAULT_LOGOUT_REDIRECT_PATH) => {
    window.location.href = redirectPath;
};

export const logoutUser = (redirectPath = DEFAULT_LOGOUT_REDIRECT_PATH) => {
    console.warn('Sessão expirada. Deslogando usuário...');
    clearAuthStorage();
    redirectToLogout(redirectPath);
};
