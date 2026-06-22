import api from './api';
import { JwtPayload, jwtDecode } from 'jwt-decode';
import { logoutUser } from '../(full-page)/auth/logout/logoutRefreshToken';
import { readStoredAuthValue, writeStoredAuthValue } from './authStorage';

export const getToken = async (): Promise<string | null> => {
    const token = readStoredAuthValue('token');
    if (!token) {
        return null;
    }
    const payload = getTokenDecoded();
    if (!payload) {
        return null;
    }
    if (!isExpired(payload.exp as number)) {
        return token;
    }
    console.log('Token expirado, renovando...',token);
    return await renewToken();
};
export const getTokenDecoded = (): JwtPayload | null => {
    try {
        const token = readStoredAuthValue('token');
        if (!token) return null;
        const tokenDecoded = jwtDecode(token);
        return tokenDecoded;
    } catch (error) {
        console.error('Erro ao decodificar o token:', error);
        return null;
    }
};
const isExpired = (exp: number) => {
  const now = Date.now() / 1000;
  return exp < now;
};
export const renewToken = async (): Promise<string | null> => {
    try {
        console.log('Refresh tok');
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
            console.error('Refresh tok não encontradp.');
            logoutUser();
            return null;
        }
 const response = await api.post(`/refresh-token`,
  { refreshToken }
);
        const { token, refreshToken: newRefreshToken } = response.data;
        if (token && newRefreshToken) {
            saveToken(token);
            saveRefreshToken(newRefreshToken);
            return token;
        }
        console.error('Tokens invalido retornado');
        logoutUser();
        return null;
    } catch (error: any) {
        console.error('erro renovacao token');
        if (error.response?.status === 403) {
            console.error('Refresh token inválido');
            logoutUser();
        }
        return null;
    }
};
export const saveToken = (token: string) => {
    if (token && token !== 'token') {
        writeStoredAuthValue('token', token);
        console.log('Token armazenado com sucesso:', token);
    } else {
        console.error('Tentativa de salvar um token falhou:', token);
    }
};
export const saveRefreshToken = (refreshToken: string) => {
    if (refreshToken && refreshToken !== 'refreshToken') {
        writeStoredAuthValue('refreshToken', refreshToken);
        console.log('Refresh token armazenado com sucesso:', refreshToken);
    } else {
        console.error('Tentativa de salvar um refresh token falhou', refreshToken);
    }
};
export const getRefreshToken = (): string | null => {
    return readStoredAuthValue('refreshToken');
};
