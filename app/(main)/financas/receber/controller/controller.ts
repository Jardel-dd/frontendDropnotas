'use client';

import api from '@/app/services/api';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';
import { ContasReceberEntity } from '@/app/entity/contasReceberEntity';

const buildContasReceberQuery = (
    listPaginationContasReceber: Record<string, any>,
    listarInativos: boolean,
    searchTerm: string
) => {
    const params = new URLSearchParams();
    const pageNumber = listPaginationContasReceber.pageable.pageNumber ?? 0;
    const pageSize = listPaginationContasReceber.pageable.pageSize ?? 10;

    params.set('page', String(pageNumber));
    params.set('size', String(pageSize));
    params.append('sort', '');

    if (searchTerm.trim()) {
        params.set('termo', searchTerm.trim());
    }
    if (listarInativos) {
        params.set('listarInativos', 'true');
    }

    return params.toString();
};

export const listContasReceber = async (
    listPaginationContasReceber: Record<string, any>,
    listarInativos: boolean,
    setLoading: (state: boolean) => void,
    searchTerm: string
) => {
    setLoading(true);

    try {
        const query = buildContasReceberQuery(listPaginationContasReceber, listarInativos, searchTerm);
        const response = await api.get(`/financeiro/contas-receber?${query}`);
        return response.data;
    } finally {
        setLoading(false);
    }
};

export const createdContasReceber = async (
    contasReceber: Partial<ContasReceberEntity>,
    msgs: any,
    router: AppRouterInstance,
    setContasReceber: React.Dispatch<React.SetStateAction<ContasReceberEntity>>,
    setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>,
    setLoading: (state: boolean) => void,
    redirectAfterSave: boolean
) => {
    try {
        const data = { ...contasReceber };
        const resp = await api.post('/financeiro/contas-receber', data);
        const payload = resp?.data;
        const created = new ContasReceberEntity(payload);

        msgs.current?.show({
            severity: 'success',
            summary: 'Sucesso:',
            detail: 'Contas a Receber criada com sucesso!'
        });

        if (redirectAfterSave) {
            router.push('/financas/receber');
        }

        setContasReceber(created);
        return created;
    } finally {
        setLoading(false);
    }
};

export const handleActiveOrInativeContasReceber = async (
    rowData: ContasReceberEntity,
    msgs: any,
    listPaginationContasReceber: Record<string, any>,
    listarInativos: boolean,
    setLoading: (loading: boolean) => void,
    searchTerm: string,
    setListPaginationContasReceber: (data: any) => void
) => {
    try {
        const refreshList = await listContasReceber(listPaginationContasReceber, listarInativos, setLoading, searchTerm);
        setListPaginationContasReceber(refreshList);
    } catch (error) {
        console.error('Erro ao recarregar Contas a Receber:', error);
        msgs.current?.show({
            severity: 'error',
            summary: 'Atenção:',
            detail: `Nao foi possivel atualizar a listagem da conta ${rowData.id}.`
        });
    }
};
