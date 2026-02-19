import { JwtPayload, jwtDecode } from 'jwt-decode';
import axios from 'axios';

export const getToken = async (forceRefresh = false): Promise<string | null> => {
    const token = localStorage.getItem('token');
    const payload = getTokenDecoded();
    if (token && payload && (!isExpired(payload.exp as number) && !forceRefresh)) {
        return token;
    }
    if (forceRefresh || !token || isExpired(payload?.exp as number)) {
        console.log('Token expirado ou forçado para renovação');
        const newToken = await renewToken();
        return newToken;
    }
    return null;
};
export const getTokenDecoded = (): JwtPayload | null => {
    try {
        const token = localStorage.getItem('token');
        if (!token) return null;
        const tokenDecoded = jwtDecode(token);
        return tokenDecoded;
    } catch (error) {
        console.error('Erro ao decodificar o token:', error);
        return null;
    }
};
const isExpired = (exp: number) => {
    const now = new Date().getTime() / 1000;
    return exp - now < 15 * 60;
};
export const renewToken = async (): Promise<string | null> => {
    try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
            throw new Error('Refresh token não encontrado.');
        }
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/refresh-token`,
            { refreshToken },
        );
        console.log('responseData refreshToken', response.data);
        const { token, refreshToken: newRefreshToken } = response.data;
        console.log('token', token);
        console.log('newRefreshToken', newRefreshToken);

        if (token && newRefreshToken) {
            saveToken(token);
            saveRefreshToken(newRefreshToken);
            console.log('Novo token e refresh token armazenados com sucesso!');
            return token;
        } else {
            console.error('Tokens não encontrados na resposta da API.');
            return null;
        }
    } catch (error) {
        console.error('Erro ao renovar o token:', error);
        return null;
    }
};
export const saveToken = (token: string) => {
    if (token && token !== 'token') {
        localStorage.setItem('token', token);
        console.log('Token armazenado com sucesso:', token);
    } else {
        console.error('Tentativa de salvar um token falhou:', token);
    }
};
export const saveRefreshToken = (refreshToken: string) => {
    if (refreshToken && refreshToken !== 'refreshToken') {
        localStorage.setItem('refreshToken', refreshToken);
        console.log('Refresh token armazenado com sucesso:', refreshToken);
    } else {
        console.error('Tentativa de salvar um refresh token falhou', refreshToken);
    }
};
export const getRefreshToken = (): string | null => {
    return localStorage.getItem('refreshToken');
};
