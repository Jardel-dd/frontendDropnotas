import api from '@/app/services/api';
import { Messages } from 'primereact/messages';
import { saveRefreshToken, saveToken } from '@/app/services/token';
import { UsuarioContaEntity } from '@/app/entity/UsuarioContaEntity';
import { applyThemeLink, getThemePreferencesFromUser, updateStoredUserThemePreferences } from '@/app/utils/themePreferences';
import { writeStoredUser } from '@/app/services/authStorage';

export const authLogin = async (userConta: UsuarioContaEntity, msgs: React.RefObject<Messages | null>, router: any): Promise<boolean> => {
    try {
        const response = await api.post('/login', {
            email: userConta.email.trim(),
            senha: userConta.senha.trim()
        });
        console.log('[signIn] Resposta completa do login:', response);
        console.log('[signIn] Payload de sucesso do backend:', response.data);
        if (typeof window !== 'undefined') {
            window.sessionStorage.setItem('lastSuccessfulLoginResponse', JSON.stringify(response.data ?? {}));
        }
        const { token, refreshToken, dadosUsuario, perfil_usuario } = response.data ?? {};
        saveToken(token);
        saveRefreshToken(refreshToken);
        if (dadosUsuario) {
            const perfilUsuario = perfil_usuario ?? dadosUsuario.perfil_usuario;
            const mergedUserData = new UsuarioContaEntity({
                ...dadosUsuario,
                perfil_usuario: perfilUsuario
            });
            const themePreferences = getThemePreferencesFromUser(mergedUserData);
            const userData = new UsuarioContaEntity({
                ...mergedUserData,
                tema_componente: themePreferences.colorScheme,
                esquema_cor: themePreferences.componentTheme
            });
            writeStoredUser(userData);
            updateStoredUserThemePreferences({
                colorScheme: themePreferences.colorScheme,
                componentTheme: themePreferences.componentTheme
            });
            applyThemeLink(userData.tema_componente, userData.esquema_cor);
            return true;
        }
        return false;
    } catch (error: any) {
        const statusCode = error.response?.status;

        if (statusCode === 401 || statusCode === 403) {
            msgs.current?.show([{ severity: 'error', summary: 'Erro', detail: 'Email ou senha incorretos. Por favor, verifique e tente novamente.' }]);
        } else {
            msgs.current?.show([{ severity: 'error', summary: 'Erro', detail: 'Ocorreu um erro. Tente novamente.' }]);
        }
        return false;
    }
};
