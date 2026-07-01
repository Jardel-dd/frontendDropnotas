'use client';
import axios from 'axios';
import api from '@/app/services/api';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';
import { CategoryContratosEntity } from '@/app/entity/CategoryContratEntity';
import { remocaoCaractereFiltro } from '@/app/shared/removeCaracter/controller';
export const updateCategoriaContrato = async (
    categoriaContratoId: string,
    categoriaContrato: CategoryContratosEntity,
    msgs: React.MutableRefObject<any>,
    router: AppRouterInstance,
    setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>,
    setLoading: (state: boolean) => void,
    redirectAfterSave: boolean
) => {
    try {
        const response = await api.put(`/categoria-contrato`, categoriaContrato);
        const responseData = response?.data;
        const responseCategoriaContrato =
            responseData &&
                typeof responseData === 'object' &&
                'categoriaContrato' in responseData
                ? (responseData as { categoriaContrato?: CategoryContratosEntity | Record<string, unknown> }).categoriaContrato
                : null;
        const updated =
            (responseCategoriaContrato && typeof responseCategoriaContrato === 'object' ? responseCategoriaContrato : null) ??
            (responseData && typeof responseData === 'object' ? responseData : null) ?? {
                ...categoriaContrato,
                id: Number(categoriaContratoId)
            };
        msgs.current?.show({
            severity: 'success',
            summary: 'Sucesso:',
            detail: 'Categoria Contrato atualizado com sucesso!'
        });
        if (redirectAfterSave) {
            router.push('/cadastro/categoriaContratos');
        }
        return new CategoryContratosEntity(updated);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status;
            let message = 'Erro ao atualizar Categoria de Contrato,';
            if (status === 409) {
                message = 'Já existe uma Categoria de Contrato com essa descrição.';
            }
            msgs.current?.show({
                severity: 'error',
                summary: 'Atenção:',
                detail: message,
                life: 4000
            });
        }
    }
};
export const createdCategoriaContrato = async (
    categoriaContrato: CategoryContratosEntity,
    msgs: React.MutableRefObject<any>,
    router: AppRouterInstance,
    setCategoriaContrato: React.Dispatch<React.SetStateAction<CategoryContratosEntity>>,
    setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>,
    setLoading: (state: boolean) => void,
    redirectAfterSave: boolean
) => {
    try {
        const resp = await api.post('/categoria-contrato', categoriaContrato);
        const created = new CategoryContratosEntity(resp.data?.categoriaContrato ?? resp.data);
        msgs.current?.show({
            severity: 'success',
            summary: 'Sucesso:',
            detail: 'Categoria Contrato criado com sucesso!'
        });
        if (redirectAfterSave) {
            router.push('/cadastro/categoriaContratos');
        }
        setCategoriaContrato(created);
        console.log('resp', resp);
        return created;
    } catch (error: any) {
        const status = error.response?.status;
        let message = 'Erro ao atualizar Categoria de Contrato,';
        if (status === 409) {
            message = 'Já existe uma Categoria de Contrato com essa descrição.';
        }
        msgs.current?.show({
            severity: 'error',
            summary: 'Atenção:',
            detail: message,
            life: 4000
        });
    }
};
export const listTheCategoriaContrato = async () => {
    try {
        const response = await api.get('/categoria-contrato');
        if (response.data && Array.isArray(response.data.content)) {
            return response.data.content;
        } else {
            return [];
        }
    } catch (error) {
        console.error("Erro ao buscar categoria contrato:", error);
        return [];
    }
};
export const fetchAllCategoriaContrato = async () => {
    try {
        const response = await api.get("/categoria-contrato");
        if (response.data && Array.isArray(response.data.content)) {
            return response.data.content;
        } else {
            return [];
        }
    } catch (error) {
        console.error("Erro ao buscar Categoria contrato:", error);
        return [];
    }
};
export const handleActiveOrInativeCategoriaContrato = async (
    rowData: CategoryContratosEntity,
    msgs: any,
    listPaginationCategoriaContrato: Record<string, any>,
    listarInativos: boolean,
    setLoading: (loading: boolean) => void,
    searchTerm: string,
    setListPaginationCategoriaContrato: (data: any) => void
) => {
    try {
        if (rowData.ativo) {
            await deletarCategoriaContrato(rowData.id!, msgs, listPaginationCategoriaContrato, listarInativos, setLoading, searchTerm);
        } else {
            await ativarCategoriaContrato(rowData.id!, msgs, listPaginationCategoriaContrato, listarInativos, setLoading, searchTerm);
        }
        const refreshList = await listCategoriaContrato(listPaginationCategoriaContrato, listarInativos, setLoading, searchTerm);
        setListPaginationCategoriaContrato(refreshList);
    } catch (error) {
        console.error('Erro ao ativar/desativar Categoria Contratos:', error);
    }
};
export const fetchFilteredCategoriaContrato = async (filtro: string) => {
    try {
        const response = await api.get(`/categoria-contrato`, {
            params: {
                termo: remocaoCaractereFiltro(filtro)
            }
        });
        if (response.data && Array.isArray(response.data.content)) {
            return response.data.content;
        } else {
            return [];
        }
    } catch (error) {
        console.error("Erro ao filtrar Categoria Contrato:", error);
        return [];
    }
};
export const fetchCategoriaContratoByID = async (categoriaContrato: string) => {
    try {
        const response = await api.get(`/categoria-contrato/${categoriaContrato}`);
        const data = response.data;
        return {
            categoriaContrato: data,
        };
    } catch (error) {
        console.error("Erro ao buscar categoria Contrato:", error);
        throw error;
    }
};
export const fetchCategoriaContrato = async (): Promise<CategoryContratosEntity[]> => {
    try {
        const idsResponse = await api.get('/categoria-contrato');
        let categoriaContrato = [];
        if (Array.isArray(idsResponse.data)) {
            categoriaContrato = idsResponse.data;
        } else if (idsResponse.data && Array.isArray(idsResponse.data.content)) {
            categoriaContrato = idsResponse.data.content;
        }
        return categoriaContrato.map((user: any) => ({
            id: user.id,
            descricao: user.descricao || 'Nome não disponível',
        }));
    } catch (error) {
        console.error('Erro ao buscar usuários do endpoint /usuario-conta:', error);
        return [];
    }
};
export const listCategoriaContrato = async (listPaginationCategoriaContrato: Record<string, any>, listarInativos: boolean, setLoading: (state: boolean) => void, searchTerm: string) => {
    setLoading(true);
    try {
        const response = await api.get(`/categoria-contrato?page=${listPaginationCategoriaContrato.pageable.pageNumber}&size=${listPaginationCategoriaContrato.pageable.pageSize}&listarInativos=${listarInativos}&termo=${searchTerm}`);
        return response.data;
    } finally {
        setLoading(false);
        console.log('loading.....');
    }
};
export const ativarCategoriaContrato = async (categoriaContratoId: number, msgs: any, listPaginationCategoriaContrato: Record<string, any>, listarInativos: boolean, setLoading: (state: boolean) => void, searchTerm: string) => {
    try {
        await api.patch(`/categoria-contrato/${String(categoriaContratoId)}/ativar`);
        msgs.current?.clear();
        msgs.current?.show([
            {
                className: 'messages-center',
                severity: 'success',
                summary: 'Sucesso:',
                detail: `Categoria Contrato ativada com sucesso.`
            }
        ]);
    } catch (error) {
        msgs.current?.clear();
        msgs.current?.show([
            {
                className: 'messages-center',
                severity: 'error',
                summary: 'Atenção:',
                detail: `Houve um erro ao tentar ativar a Categoria Contrato , tente novamente.`
            }
        ]);
        console.error(`Erro ao tentar ativar este a Categoria Contrato com ID ${categoriaContratoId}:`, error);
    }
};
export const deletarCategoriaContrato = async (categoriaContratoId: number, msgs: any, listPaginationCategoriaContrato: Record<string, any>, listarInativos: boolean, setLoading: (state: boolean) => void, searchTerm: string) => {
    try {
        await api.delete(`/categoria-contrato/${String(categoriaContratoId)}`);
        msgs.current?.clear();
        msgs.current?.show([
            {
                severity: 'success',
                summary: 'Sucesso:',
                detail: 'Categoria Contrato excluído com sucesso.'
            }
        ]);
    } catch (error) {
        msgs.current?.clear();
        msgs.current?.show([
            {
                severity: 'error',
                summary: 'Atenção:',
                detail: 'Houve um erro ao tentar excluir a Categoria Contrato, tente novamente.'
            }
        ]);
    }
};