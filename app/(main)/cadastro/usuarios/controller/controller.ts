import axios from 'axios';
import api from '@/app/services/api';
import { CompanyEntity } from '@/app/entity/CompanyEntity';
import { PerfilUser } from '@/app/entity/PerfilUsuarioEntity';
import { UsuarioContaEntity } from '@/app/entity/UsuarioContaEntity';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';

export const list = async (
    listPaginationUserConta: Record<string, any>,
    listarInativos: boolean,
    setLoading: (state: boolean) => void,
    searchTerm: string
) => {
    setLoading(true);
    try {
        const response = await api.get(
            `/usuario-conta?page=${listPaginationUserConta.pageable.pageNumber}&size=${listPaginationUserConta.pageable.pageSize}&listarInativos=${listarInativos}&termo=${searchTerm}`
        );
        console.log('status', listarInativos);
        console.log('Dados retornados da API list:', response.data);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar User Conta:', error);
        throw error;
    } finally {
        setLoading(false);
    }
};
export const ativar = async (
    UserContaId: number,
    msgs: any,
    listPaginationUserConta: Record<string, any>,
    listarInativos: boolean,
    setLoading: (state: boolean) => void,
    searchTerm: string
) => {
    try {
        await api.patch(`/usuario-conta/${String(UserContaId)}/ativar`);
        msgs.current?.clear();
        msgs.current?.show([
            {
                life: 3000,
                severity: 'success',
                summary: 'Sucesso',
                detail: `Usuário Conta ativado com sucesso.`,
            },
        ]);
        await list(listPaginationUserConta, listarInativos, setLoading, searchTerm);
        console.log(`User Conta com ID ${UserContaId} ativada com sucesso.`);
    } catch (error) {
        msgs.current?.clear();
        msgs.current?.show([
            {
                life: 3000,
                severity: 'error',
                summary: 'Erro',
                detail: `Houve um erro ao tentar ativar este Usuário Conta, tente novamente.`,
            },
        ]);
        console.error(`Erro ao tentar ativar Usuário Conta com ID ${UserContaId}:`, error);
    }
};
export const create = async (
    userConta: UsuarioContaEntity,
    selectedEmpresa: CompanyEntity[],
    selectedPerfilUser: PerfilUser | null,
    setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>,
    msgs: any,
    router: AppRouterInstance,
    setUserConta: React.Dispatch<React.SetStateAction<UsuarioContaEntity>>,
    setSelectedEmpresa: React.Dispatch<React.SetStateAction<CompanyEntity[]>>,
    setSelectedPerfilUser: React.Dispatch<React.SetStateAction<PerfilUser | null>>,
) => {
    try {
        const userDataToSend = {
            ...userConta,
            id_perfil_usuario: selectedPerfilUser?.id,
            id_empresas_acesso: selectedEmpresa.map(usuario => usuario.id),
        };
        console.log('Dados enviados para criação:', userDataToSend);
        const response = await api.post('/usuario-conta', userDataToSend);
        console.log('Resposta da API após criação:', response.data);
        msgs.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Usuário cadastrado com sucesso!' });
        router.push('/cadastro/usuarios');
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            const { data } = error.response;
            const errorMessage = data.message || 'Erro ao cadastrar usuário.';
            msgs.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: String(errorMessage),
            });
        } else {
            msgs.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao cadastrar usuário.',
            });
        }
    }
};
export const update = async (
    userContaId: string,
    userConta: UsuarioContaEntity,
    confirmPassword: string,
    selectedEmpresa: CompanyEntity[] | null,
    selectedPerfilUser: PerfilUser | null,
    setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>,
    msgs: any,
    router: AppRouterInstance,
    setUserConta: React.Dispatch<React.SetStateAction<UsuarioContaEntity>>,
    setSelectedEmpresa: React.Dispatch<React.SetStateAction<CompanyEntity[]>>,
    setSelectedPerfilUser: React.Dispatch<React.SetStateAction<PerfilUser | null>>,
) => {
    if (selectedPerfilUser === null) {
        msgs.current?.show({ severity: 'error', summary: 'Erro', detail: 'Perfil de usuário não selecionado.' });
        return;
    }
    try {
        const userContaData = {
            ...userConta,
            id_perfil_usuario: selectedPerfilUser.id,
            perfilUsuario: selectedPerfilUser,
        };
        await api.put(`/usuario-conta/alterar-email`, userContaData);
        msgs.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'O Usuario Conta atualizado com sucesso!' });
        router.push('/cadastro/usuarios');
    } catch (error) {
        msgs.current?.show({ severity: 'error', summary: 'Erro', detail: 'Não foi possível atualizar o Usuario Conta. Tente novamente.' });
    }
};
export const deletar = async (
    UserContaId: number,
    msgs: any,
    listPaginationUserConta: Record<string, any>,
    listarInativos: boolean,
    setLoading: (state: boolean) => void,
    searchTerm: string
) => {
    try {
        await api.delete(`/usuario-conta/${String(UserContaId)}`);
         msgs.current?.clear();
        msgs.current?.show([
            {
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Usuário excluído com sucesso.'
            },
        ]);
    } catch (error) {
        msgs.current?.clear();
        msgs.current?.show([
            {
                severity: 'error',
                summary: 'Erro',
                detail: 'Houve um erro ao tentar excluir o Usuário, tente novamente.'
            },
        ]);
        await list(listPaginationUserConta, listarInativos, setLoading, searchTerm);
    }
};
export const convertProfileUserToBase64 = (
    files: File[],
    setUserConta: React.Dispatch<React.SetStateAction<any>>,
    toast: any,
    msgs: any
) => {
    const file = files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
        const base64String = reader.result as string;
        setUserConta((prev: any) => ({
            ...prev,
            foto_perfil: base64String,
        }));
        msgs.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Foto de perfil carregada com sucesso!' });
    };
    reader.onerror = () => {
        msgs.current?.show({ severity: 'error', summary: 'Error', detail: 'Erro ao processar a Foto de Perfil. Tente novamente!' });
        console.error(`Erro ao ler o logo`);
    };

    reader.readAsDataURL(file);
};
export const handleActiveOrInativeUserConta = async (
    rowData: UsuarioContaEntity,
    msgs: any,
    listPaginationUserConta: Record<string, any>,
    listarInativos: boolean,
    setLoading: (loading: boolean) => void,
    searchTerm: string,
    setListPaginationUserConta: (data: any) => void
) => {
    try {
        if (rowData.ativo) {
            await deletar(rowData.id!, msgs, listPaginationUserConta, listarInativos, setLoading, searchTerm);
        } else {
            await ativar(rowData.id!, msgs, listPaginationUserConta, listarInativos, setLoading, searchTerm);

        }
        const refreshList = await list(listPaginationUserConta, listarInativos, setLoading, searchTerm);
        setListPaginationUserConta(refreshList);
    } catch (error) {
        console.error("Erro ao ativar/desativar UserConta:", error);
    }
};