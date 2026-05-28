'use client';
import axios from 'axios';
import api from '@/app/services/api';
import { TreeCheckboxSelectionKeys } from 'primereact/tree';
import { PerfilUser } from '@/app/entity/PerfilUsuarioEntity';
import { getFormattedPermissions, permissionsMap } from './mapPerfilUser';
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
                summary: 'Sucesso:',
                detail: 'Perfil Usuário excluído com sucesso.'
            }
        ]);
    } catch (error) {
        msgs.current?.clear();
        msgs.current?.show([
            {
                severity: 'error',
                summary: 'Atenção:',
                detail: 'Houve um erro ao excluir o Perfil Usuário, tente novamente.'
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
                summary: 'Sucesso:',
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
                severity: 'Atenção:',
                summary: 'Erro',
                detail: `Houve um erro ao tentar ativar este Perfil usuário, tente novamente.`
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
    const payload = { ...perfilUser, ...formattedPermissions };
    console.log('Payload final para criacao de permissao:', payload);
    try {
        const resp = await api.post('/perfil-usuario', payload);
        const created = new PerfilUser(resp.data?.perfilUser ?? resp.data);
        msgs.current?.show({
            severity: 'success',
            summary: 'Sucesso:',
            detail: 'Perfil criado com sucesso!'
        });
        if (redirectAfterSave) {
            router.push('/cadastro/permissoes');
        }
        setPerfilUser(created);
        return created;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.error('Erro ao criar permissao:', {
                status: error.response?.status,
                data: error.response?.data,
                payload
            });
            msgs.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail:
                    error.response?.status === 500
                        ? 'Não foi possivel cadastrar esta permissão, tente novamente.'
                        : error.response?.data?.message || error.message
            });
            return;
        }
        console.error('Erro inesperado ao criar permissao:', error, 'Payload enviado:', payload);
        msgs.current?.show({
            severity: 'error',
            summary: 'Atenção:',
            detail: 'Não foi possivel cadastrar esta permissão, tente novamente.'
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
            summary: 'Sucesso:',
            detail: 'Perfil de usuário atualizado com sucesso!'
        });

        router.push('/cadastro/permissoes');
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Erro na atualização do perfil de usuário:', error.response?.data);
            msgs.current?.show({
                severity: 'error',
                summary: 'Atenção:',
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
export const fetchAllPerfilUsuarios = async (): Promise<PerfilUser[]> => {
    try {
        const response = await api.get('/perfil-usuario', { params: { ativo: true } });
        let perfilUsuarios = [];
        if (Array.isArray(response.data)) {
            perfilUsuarios = response.data;
        } else if (response.data && Array.isArray(response.data.content)) {
            perfilUsuarios = response.data.content;
        }

        return perfilUsuarios.map((user: any) => ({
            id: user.id,
            nome: user.nome
        }));
    } catch (error) {
        console.error('Erro ao buscar perfis de usuário:', error);
        return [];
    }
};
export const fetchPerfilUserByID = async (
    perfilUserId: string,
    setPerfilUser: React.Dispatch<React.SetStateAction<PerfilUser>>,
    setSelectedKeys: React.Dispatch<React.SetStateAction<TreeCheckboxSelectionKeys>>,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
    try {
        setIsLoading(true);
        const response = await api.get(`/perfil-usuario/${perfilUserId}`);
        const data = response.data;
        console.log(' Dados do Perfil U:', data);
        const perfilUserInstance = new PerfilUser(data);
        setPerfilUser(perfilUserInstance);
        const selected = Object.keys(permissionsMap).reduce((acc, key) => {
            const permission = permissionsMap[key];
            if (permission !== undefined) {  
                const isChecked = data[permission];
                const parentKey = key.split('-')[0];
                if (!acc[parentKey]) {
                    acc[parentKey] = { checked: false };
                }
                if (isChecked) {
                    acc[key] = { checked: true };
                    const childrenKeys = Object.keys(permissionsMap).filter(k => k.startsWith(parentKey));
                    const allChildrenChecked = childrenKeys.every(childKey => {
                        const perm = permissionsMap[childKey];
                        return perm !== undefined && data[perm];
                    });
                    if (allChildrenChecked) {
                        acc[parentKey] = { checked: true };
                    }
                } else {
                    acc[key] = { checked: false };
                }
            }
            return acc;
        }, {} as TreeCheckboxSelectionKeys);


        setSelectedKeys(selected);
    } catch (error) {
        console.error('Erro ao buscar Permissão ou perfis:', error);
    } finally {
        setIsLoading(false);
    }
};
export const fetchFilteredPerfilUsuarios = async (query: string): Promise<PerfilUser[]> => {
    try {
        const response = await api.get('/perfil-usuario', {
            params: {
                termo: query 
            }
        });
        return response.data.content || [];
    } catch (error) {
        console.error("Erro ao buscar perfil usuario filtradas:", error);
        return [];
    }
};
