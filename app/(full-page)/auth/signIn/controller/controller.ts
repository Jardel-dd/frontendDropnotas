import api from "@/app/services/api";
import { Messages } from "primereact/messages";
import { saveRefreshToken, saveToken } from "@/app/services/token";
import { UsuarioContaEntity } from "@/app/entity/UsuarioContaEntity";

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
      const userData: UsuarioContaEntity = {
        ...dadosUsuario,
        token,
        refreshToken,
      };
      localStorage.setItem('userConta', JSON.stringify(userData));
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
