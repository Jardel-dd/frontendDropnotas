import api from "@/app/services/api";
import { LoginResponse } from "../page";
import { authLogin } from "../../signIn/controller/controller";
import { searchByCNPJ } from "@/app/utils/search/searchCNPJ/controller";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";
import { CreatedAccountEntity, } from "../../../../entity/CreatedAccountEntity";
import { UsuarioContaEntity } from "@/app/entity/UsuarioContaEntity";

export const create = async (
  conta: CreatedAccountEntity,
  router: AppRouterInstance,
  msgs: any,
): Promise<LoginResponse> => {
  const requestData = {
    usuario_conta: {
      nome: conta.nome,
      email: conta.email,
      senha: conta.senha
    },
    nome: conta.nome,
    email: conta.email,
    razao_social: conta.razao_social,
    cnpj: conta.cnpj
  };
  try {
    await api.post('/conta-cliente', requestData);
    console.log('requestData:', requestData);
    msgs.current?.show({
      severity: 'success',
      summary: 'Conta criada com sucesso',
      detail: 'Sua conta foi criada com sucesso.',
    });
    const loginSuccess = await authLogin(
      new UsuarioContaEntity({
        id: conta.usuario_conta.id,
        nome: conta.usuario_conta.nome,
        email: conta.usuario_conta.email,
        senha: conta.usuario_conta.senha,
        ativo: conta.usuario_conta.ativo,
        foto_perfil: conta.usuario_conta.foto_perfil,
      }),
      msgs,
      router
    );
    if (loginSuccess) {
      router.push('/dashboard');
      return {
        token: localStorage.getItem('token') || '',
        refreshToken: localStorage.getItem('refreshToken') || '',
      };
    } else {
      console.log('Erro ao realizar o login após a criação da conta.');
      msgs.current?.show({
        severity: 'error',
        detail: 'Não foi possível fazer o login automático após a criação da conta. Tente logar manualmente.',
        life: 5000
      });
      throw new Error('Erro ao realizar login após criação da conta');
    }
  } catch (error: any) {
    msgs.current?.clear();
    let detailMessage = 'Erro desconhecido ao criar a conta.';
    let summaryMessage = 'Erro';
 if (error.response) {
    const statusCode = error.response.status;
    const backendMessage = error.response.data?.message;
    console.error("Erro da API:", error.response.data);
    console.error("Status do erro:", statusCode);
    if (statusCode === 400) {
        detailMessage = 'Este CNPJ já existe em nosso cadastro. Por favor, inclua um CNPJ diferente.';
    } else if (statusCode === 409) {
        detailMessage = 'Este E-mail já existe em nosso cadastro. Por favor, inclua um E-mail  diferente.';
    } else if (backendMessage) {
        detailMessage = typeof backendMessage === 'object' ? JSON.stringify(backendMessage) : backendMessage;
    } else {
        detailMessage = `Ocorreu um erro com o status ${statusCode}.`;
    }
} else if (error.request) {
    summaryMessage = 'Erro de Rede';
    detailMessage = 'Não foi possível conectar ao servidor. Verifique sua conexão com a internet.';
} else {
    summaryMessage = 'Erro Interno';
    detailMessage = error.message || 'Ocorreu um erro inesperado.';
}
msgs.current?.show({
    severity: 'error',
    summary: summaryMessage,
    detail: detailMessage,
    life: 5000,
});
throw error;
  }
};
export const handleSearchCNPJCreated = async <T extends CreatedAccountEntity>(
  cnpj: string,
  setState: React.Dispatch<React.SetStateAction<T>>,
  setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>,
  msgs: any,
) => {
  try {
    const cnpjOnlyNumbers = cnpj.replace(/\D/g, '');
    const data = await searchByCNPJ(cnpjOnlyNumbers);
    if (data) {
      setState((prevState) => {
        const newState = prevState.copyWith({
           ...prevState,
          cnpj: data.cnpj,
          razao_social: data.razao_social,
        }) as T;

        if (data.razao_social?.trim().length >= 2) {
          setErrors((prevErrors) => {
            const { razao_social, ...rest } = prevErrors;
            return rest;
          });
        }
        console.log('Novo estado da empresa:', newState);
        return newState;
      });
    }
  } catch (error) {
    if (msgs.current) {
      msgs.current.show({
        severity: 'error',
        detail: 'CNPJ não encontrado. Verifique ou inclua manualmente os dados da empresa.',
      });
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      error: 'Erro ao buscar CNPJ. Por favor, tente novamente.',
    }));
  }
};



