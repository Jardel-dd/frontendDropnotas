import api from "@/app/services/api";
import { Messages } from "primereact/messages";
import { saveRefreshToken, saveToken } from "@/app/services/token";
import { UsuarioContaEntity } from "@/app/entity/UsuarioContaEntity";
import {
  applyThemeLink,
  getThemePreferencesFromUser
} from "@/app/utils/themePreferences";

export const authLogin = async (
  userConta: UsuarioContaEntity,
  msgs: React.RefObject<Messages | null>,
  router: any,
): Promise<boolean> => {
  try {
    const response = await api.post('/login', {
      email: userConta.email.trim(),
      senha: userConta.senha.trim(),
    });
    console.log("Login sucesso dados",response)
    const { token, refreshToken, dadosUsuario } = response.data;
    saveToken(token);
    saveRefreshToken(refreshToken);
    if (dadosUsuario) {
      const themePreferences =
        getThemePreferencesFromUser(dadosUsuario);
      const userData: UsuarioContaEntity = {
        ...dadosUsuario,
        tema_componente: themePreferences.colorScheme,
        esquema_cor: themePreferences.componentTheme,
        token,
        refreshToken,
      };
      localStorage.setItem('userConta', JSON.stringify(userData));
      applyThemeLink(
        userData.tema_componente,
        userData.esquema_cor
      );
      return true;
    }
    return false;
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      msgs.current?.show([
        { severity: 'error', summary: 'Erro', detail: 'Email ou Senha incorreto, por favor verifique.' }
      ]);
    } else {
      msgs.current?.show([
        { severity: 'error', summary: 'Erro', detail: 'Ocorreu um erro. Tente novamente.' }
      ]);
    }
    return false;
  }
};
