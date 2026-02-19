'use client';
import axios from 'axios';
import api from '@/app/services/api';
import { getFormattedPermissions } from './mapPerfilUser';
import { TreeCheckboxSelectionKeys } from 'primereact/tree';
import { PerfilUser } from '@/app/entity/PerfilUsuarioEntity';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';
type SetErrorsFn = React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
export const listPerfilUser = async (
    listPaginationPerfilUser: Record<string, any>, 
    listarInativos: boolean, 
    setLoading: (state: boolean) => void, 
    searchTerm: string
) => {
    setLoading(true);
    try {
        const response = await api.get(`/perfil-usuario?page=${listPaginationPerfilUser.pageable.pageNumber}&size=${listPaginationPerfilUser.pageable.pageSize}&listarInativos=${listarInativos}&termo=${searchTerm}`
        );
        return response.data;
    } finally {
        setLoading(false);
    }
};
export const deletarPerfilUser = async (perfilUserId: number, msgs: any, listPaginationPerfilUser: Record<string, any>, listarInativos: boolean, setLoading: (state: boolean) => void, searchTerm: string) => {
    try {
        await api.delete(`/perfil-usuario/${String(perfilUserId)}`);
        msgs.current?.clear();
        msgs.current?.show([
            {
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Perfil Usuário excluído com sucesso.'
            }
        ]);
    } catch (error) {
        msgs.current?.clear();
        msgs.current?.show([
            {
                severity: 'error',
                summary: 'Erro',
                detail: 'Houve um erro ao tentar excluir o Perfil Usuário, tente novamente.'
            }
        ]);
    }
};
export const ativarPerfilUser = async (perfilUserId: number, msgs: any, listPaginationPerfilUser: Record<string, any>, listarInativos: boolean, setLoading: (state: boolean) => void, searchTerm: string) => {
    try {
        await api.patch(`/perfil-usuario/${String(perfilUserId)}/ativar`);
        msgs.current?.clear();
        msgs.current?.show([
            {
                className: 'messages-center',
                severity: 'success',
                summary: 'Sucesso',
                detail: `Perfil usuario ativado com sucesso.`
            }
        ]);
         setTimeout(() => {
            msgs.current?.clear();
        }, 2000);
     await listPerfilUser(listPaginationPerfilUser, listarInativos, setLoading, searchTerm);
        
    } catch (error) {
        msgs.current?.clear();
        msgs.current?.show([
            {
                className: 'messages-center',
                severity: 'error',
                summary: 'Erro',
                detail: `Houve um erro ao tentar ativar este Perfil usuario , tente novamente.`
            }
        ]);
        console.error(`Erro ao tentar ativar este Perfil usuario  com ID ${perfilUserId}:`, error);
    }
};
export const createdPerfilUser = async (
    perfilUser: Partial<PerfilUser>,
    selectedPerfilUser: PerfilUser[],
    setPerfilUser: React.Dispatch<React.SetStateAction<PerfilUser>>,
    selectedKeys: TreeCheckboxSelectionKeys,
    setErrors: SetErrorsFn,
    msgs: React.MutableRefObject<any>,
    router: AppRouterInstance,
    permissionUser: any[],
    redirectAfterSave: boolean
) => {
    const formattedPermissions = getFormattedPermissions(selectedKeys);
    try {
        const resp = await api.post('/perfil-usuario', { ...perfilUser, ...formattedPermissions });
        const created = new PerfilUser(resp.data?.perfilUser ?? resp.data);
        msgs.current?.show({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Perfil criado com sucesso!'
        });
        console.log('Dados do perfil:', perfilUser);
        if (redirectAfterSave) {
            router.push('/cadastro/perfilUsuario');
        }
        setPerfilUser(created);
        return created;
    } catch (error: any) {
        console.error('Erro ao criar perfil:', error.response?.data || error);
        msgs.current?.show({
            severity: 'error',
            detail: `Erro ao criar perfil: ${error.response?.data?.message || error.message}`
        });
    }
};
export const updatePerfilUser = async (
    perfilUserId: string,
    perfilUser: PerfilUser,
    selectedPerfilUser: PerfilUser[],
    selectedKeys: TreeCheckboxSelectionKeys,
    setErrors: SetErrorsFn,
    msgs: React.MutableRefObject<any>,
    router: AppRouterInstance,
    permissionUser: any[]
) => {
    const formattedPermissions = getFormattedPermissions(selectedKeys);
    console.log('Dados antes do envio:', perfilUser);
    try {
        const dataPerfilUser = perfilUser.copyWith({
            ...formattedPermissions
        });
        console.log('Payload final para atualização:', dataPerfilUser);
        await api.put(`/perfil-usuario`, dataPerfilUser);
        msgs.current?.show({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Perfil de usuário atualizado com sucesso!'
        });

        router.push('/cadastro/perfilUsuario');
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Erro na atualização do perfil de usuário:', error.response?.data);
            msgs.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: error.response?.data?.message || 'Ocorreu um erro ao atualizar o perfil de usuário.'
            });
        }
    }
};
export const handleActiveOrInativePerfilUsuario = async (
    rowData: PerfilUser,
    msgs: any,
    listPaginationPerfilUser: Record<string, any>,
    listarInativos: boolean,
    setLoading: (loading: boolean) => void,
    searchTerm: string,
    setListPaginationPerfilUser: (data: any) => void
) => {
    try {
        if (rowData.ativo) {
            await deletarPerfilUser(rowData.id!, msgs, listPaginationPerfilUser, listarInativos, setLoading, searchTerm);
        } else {
            await ativarPerfilUser(rowData.id!, msgs, listPaginationPerfilUser, listarInativos, setLoading, searchTerm);
        }
        const refreshList = await listPerfilUser(listPaginationPerfilUser, listarInativos, setLoading, searchTerm);
        setListPaginationPerfilUser(refreshList);
    } catch (error) {
        console.error('Erro PerfilUser:', error);
    }
};
