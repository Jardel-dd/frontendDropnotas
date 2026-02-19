'use client'
import axios from "axios";
import api from "@/app/services/api";
import { FormaPagamentoEntity } from "@/app/entity/FormaPagamento";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";

export const listFormaPagamento = async (
    listPaginationFormaPagamento: Record<string, any>,
    listarInativos: boolean,
    setLoading: (state: boolean) => void,
    searchTerm: string,
    tipo_forma_pagamento: string
) => {
    setLoading(true);
    try {
        const response = await api.get(
            `/forma-pagamento?page=${listPaginationFormaPagamento.pageable.pageNumber}&size=${listPaginationFormaPagamento.pageable.pageSize}&listarInativos=${listarInativos}&termo=${searchTerm}&tipo_forma_pagamento=${tipo_forma_pagamento}`
        );
        return response.data;
    } finally {
        setLoading(false);
        console.log('loading.....');
    }
};
export const ativarFormaPagamento = async (
    formaPagamentoId: number,
    msgs: any,
    listPaginationFormaPagamento: Record<string, any>,
    listarInativos: boolean,
    setLoading: (state: boolean) => void,
    searchTerm: string,
) => {
    try {
        await api.patch(`/forma-pagamento/${String(formaPagamentoId)}/ativar`);
        msgs.current?.clear();
        msgs.current?.show([
            {
                className: 'messages-center',
                severity: 'success',
                summary: 'Sucesso',
                detail: `Forma de Pagamento ativada com sucesso.`,
            },
        ]);
    } catch (error) {
        msgs.current?.clear();
        msgs.current?.show([
            {
                className: 'messages-center',
                severity: 'error',
                summary: 'Erro',
                detail: `Houve um erro ao tentar ativar a Forma Pagamento, tente novamente.`,
            },
        ]);
        console.error(`Erro ao tentar ativar este a Forma de Pagamento com ID ${formaPagamentoId}:`, error);
    }
};
export const deletarFormaPagamento = async (
    formaPagamentoId: number,
    msgs: any,
    listPaginationFormaPagamento: Record<string, any>,
    listarInativos: boolean,
    setLoading: (state: boolean) => void,
    searchTerm: string,
) => {
    try {
        await api.delete(`/forma-pagamento/${String(formaPagamentoId)}`);
        msgs.current?.clear();
        msgs.current?.show([
            {
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Forma de Pagamento  excluído com sucesso.'
            },
        ]);
    } catch (error) {
        msgs.current?.clear();
        msgs.current?.show([
            {
                severity: 'error',
                summary: 'Erro',
                detail: 'Houve um erro ao tentar excluir a Forma de Pagamento , tente novamente.'
            },
        ]);
    }
};
export const createdFormaPagamento = async (
  formaPagamento: Partial<FormaPagamentoEntity>,
  msgs: any,
  router: AppRouterInstance,
  setFormaPagamento: React.Dispatch<React.SetStateAction<FormaPagamentoEntity>>,
  setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>,
  setLoading: (state: boolean) => void,
  redirectAfterSave: boolean,
) => {
  try {
    const data = { ...formaPagamento };
    const resp = await api.post('/forma-pagamento', data);
    const payload = resp?.data;
    const created = new FormaPagamentoEntity(payload);

    msgs.current?.show({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Forma de Pagamento criada com sucesso!',
    });

    if (redirectAfterSave) {
      router.push('/cadastro/formaPagamento');
    }
    setFormaPagamento(created);
    console.log('[createdFormaPagamento] payload:', payload);
    return created; 
  } finally {
    setLoading(false);
  }
};
export const updateFormaPagamento = async (
    formaPagamentoId: string,
    formaPagamento: Partial<FormaPagamentoEntity>,
    msgs: React.MutableRefObject<any>,
    router: AppRouterInstance,
    setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>,
    setLoading: (state: boolean) => void,
    redirectAfterSave: boolean
) => {
    try {
        await api.put(`/forma-pagamento`, formaPagamento);
        msgs.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Forma de Pagamento atualizado com sucesso!' });
        router.push('/cadastro/formaPagamento');
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Detalhes do erro de Axios:', error.response?.data);
            console.error('Status do erro:', error.response?.status);
            console.error('Cabeçalhos da resposta de erro:', error.response?.headers);
            msgs.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: error.response?.data?.message
                    || 'Ocorreu um erro ao atualizar a Forma de Pagamento.'
            });
        }
    }
};
export const handleActiveOrInativeFormaPagamento = async (
    rowData: FormaPagamentoEntity,
    msgs: any,
    listPaginationFormaPagamento: Record<string, any>,
    listarInativos: boolean,
    setLoading: (loading: boolean) => void,
    searchTerm: string,
    tipo_forma_pagamento: string,
    setListPaginationFormaPagamento: (data: any) => void
) => {
    try {
        if (rowData.ativo) {
            await deletarFormaPagamento(rowData.id!, msgs, listPaginationFormaPagamento, listarInativos, setLoading, searchTerm);
        } else {
            await ativarFormaPagamento(rowData.id!, msgs, listPaginationFormaPagamento, listarInativos, setLoading, searchTerm);
        }
        const refreshList = await listFormaPagamento(listPaginationFormaPagamento, listarInativos, setLoading, searchTerm, tipo_forma_pagamento);
        setListPaginationFormaPagamento(refreshList);
    } catch (error) {
        console.error("Erro ao ativar/desativar Forma de Pagamento:", error);
    }
};
