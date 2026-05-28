'use client';
import api from '@/app/services/api';
import { ContasPagarEntity } from '@/app/entity/contasPagarEntity';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';

const buildContasPagarQuery = (
    listPaginationContasPagar: Record<string, any>,
    listarInativos: boolean,
    searchTerm: string
) => {
    const params = new URLSearchParams();
    const pageNumber = listPaginationContasPagar.pageable.pageNumber ?? 0;
    const pageSize = listPaginationContasPagar.pageable.pageSize ?? 10;

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
export const listContasPagar = async (
    listPaginationContasPagar: Record<string, any>,
    listarInativos: boolean,
    setLoading: (state: boolean) => void,
    searchTerm: string
) => {
    setLoading(true);

    try {
        const query = buildContasPagarQuery(listPaginationContasPagar, listarInativos, searchTerm);
        const response = await api.get(`/financeiro/contas-pagar?${query}`);
        return response.data;
    } finally {
        setLoading(false);
    }
};
export const createdContasPagar = async (
    contasPagar: Partial<ContasPagarEntity>,
    msgs: any,
    router: AppRouterInstance,
    setContasPagar: React.Dispatch<React.SetStateAction<ContasPagarEntity>>,
    setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>,
    setLoading: (state: boolean) => void,
    redirectAfterSave: boolean
) => {
    try {
        const data = {
            ...contasPagar,
            id_fornecedor: Number(contasPagar.id_fornecedor ?? 0),
            valor_original: Number(contasPagar.valor_original ?? 0),
            valor_total: Number(contasPagar.valor_total ?? contasPagar.valor_original ?? 0),
            observacao: contasPagar.observacao ?? ''
        };
        console.log('Contas a pagar', data);
        const resp = await api.post('/financeiro/contas-pagar', data);
        const payload = resp?.data;
        const created = new ContasPagarEntity(payload);
        console.log('resposta de sucesso:', payload);
        msgs.current?.show({
            severity: 'success',
            summary: 'Sucesso:',
            detail: 'Contas a Pagar criada com sucesso!'
        });
        if (redirectAfterSave) {
            router.push('/financas/pagar');
        }
        setContasPagar(created);
        return created;
    } catch (error: any) {
        throw error;
    } finally {
        setLoading(false);
    }
};
export const handleActiveOrInativeContasPagar = async (
    rowData: ContasPagarEntity,
    msgs: any,
    listPaginationContasPagar: Record<string, any>,
    listarInativos: boolean,
    setLoading: (loading: boolean) => void,
    searchTerm: string,
    setListPaginationContasPagar: (data: any) => void
) => {
    try {
        const refreshList = await listContasPagar(listPaginationContasPagar, listarInativos, setLoading, searchTerm);
        setListPaginationContasPagar(refreshList);
    } catch (error) {
        console.error('Erro ao recarregar Contas a Pagar:', error);
        msgs.current?.show({
            severity: 'error',
            summary: 'Atenção:',
            detail: `Nao foi possivel atualizar a listagem da conta ${rowData.id}.`
        });
    }
};
