import api from './api';
import { JwtPayload, jwtDecode } from 'jwt-decode';
import { logoutUser } from '../(full-page)/auth/logout/logoutRefreshToken';

export const getToken = async (): Promise<string | null> => {
    const token = localStorage.getItem('token');
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
    console.log('Token expirado, renovando...');
    return await renewToken();
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
// export const getToken = async (forceRefresh = false): Promise<string | null> => {
//     const token = localStorage.getItem('token');
//     const payload = getTokenDecoded();
//     if (token && payload && (!isExpired(payload.exp as number) && !forceRefresh)) {
//         return token;
//     }
//     if (forceRefresh || !token || isExpired(payload?.exp as number)) {
//         console.log('Token expirado ou forçado para renovação');
//         const newToken = await renewToken();
//         return newToken;
//     }
//     return null;
// };
// export const renewToken = async (): Promise<string | null> => {
//     try {
//         const refreshToken = getRefreshToken();
//         if (!refreshToken) {
//             throw new Error('Refresh token não encontrado.');
//         }
//         const response = await axios.post(
//             `${process.env.NEXT_PUBLIC_API_URL}/refresh-token`,
//             { refreshToken },
//         );
//         console.log('responseData refreshToken', response.data);
//         const { token, refreshToken: newRefreshToken } = response.data;
//         console.log('token', token);
//         console.log('newRefreshToken', newRefreshToken);

//         if (token && newRefreshToken) {
//             saveToken(token);
//             saveRefreshToken(newRefreshToken);
//             console.log('Novo token e refresh token armazenados com sucesso!');
//             return token;
//         } else {
//             console.error('Tokens não encontrados na resposta da API.');
//             return null;
//         }
//     } catch (error) {
//         console.error('Erro ao renovar o token:', error);
//         return null;
//     }
// };