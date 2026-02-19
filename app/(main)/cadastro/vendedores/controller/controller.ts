'use client'
import axios from "axios";
import api from "@/app/services/api";
import { VendedorEntity } from "@/app/entity/VendedorEntity";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";

export const listVendedor = async (
    listPaginationVendedoresId: Record<string, any>,
    listarInativos: boolean,
    setLoading: (state: boolean) => void,
    searchTerm: string
) => {
    setLoading(true);
    try {
        const response = await api.get(
            `/vendedor?page=${listPaginationVendedoresId.pageable.pageNumber}&size=${listPaginationVendedoresId.pageable.pageSize}&listarInativos=${listarInativos}&termo=${searchTerm}`
        );
        console.log('status', listarInativos);
        console.log('Dados retornados da API list:', response.data);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar Vendedores:', error);
        throw error;
    } finally {
        setLoading(false);
        console.log('loading.....');
    }
};
export const ativarVendedor = async (
    vendedoresId: number,
    msgs: any,
    listPaginationVendedoresId: Record<string, any>,
    listarInativos: boolean,
    setLoading: (state: boolean) => void,
    searchTerm: string
) => {
    try {
        await api.patch(`/vendedor/${String(vendedoresId)}/ativar`);
        msgs.current?.clear();
        msgs.current?.show([
            {
                className: 'messages-center',
                sticky: true,
                severity: 'success',
                summary: 'Sucesso',
                detail: `Vendedor ativado com sucesso.`,
            },
        ]);
        setTimeout(() => {
            msgs.current?.clear();
        }, 2000);
    } catch (error) {
        msgs.current?.clear();
        msgs.current?.show([
            {
                className: 'messages-center',
                sticky: true,
                severity: 'error',
                summary: 'Erro',
                detail: `Houve um erro ao tentar ativar este Vendedor , tente novamente.`,
            },
        ]);
        await listVendedor(listPaginationVendedoresId, listarInativos, setLoading, searchTerm);
        console.error(`Erro ao tentar ativar este Cliente ou Fornecedor com ID ${vendedoresId}:`, error);
    }
};
export const deletarVendedor = async (
    vendedoresId: number,
    msgs: any,
    listPaginationVendedoresId: Record<string, any>,
    listarInativos: boolean,
    setLoading: (state: boolean) => void,
    searchTerm: string
) => {
    try {
        await api.delete(`/vendedor/${String(vendedoresId)}`);
        msgs.current?.clear();
        msgs.current?.show([
            {
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Vendedor excluído com sucesso.'
            },
        ]);
    } catch (error) {
        msgs.current?.clear();
        msgs.current?.show([
            {
                severity: 'error',
                summary: 'Erro',
                detail: 'Houve um erro ao tentar excluir o Vendedor, tente novamente.'
            },
        ]);
        await listVendedor(listPaginationVendedoresId, listarInativos, setLoading, searchTerm);
    }
};
export const createdVendedor = async (
  vendedor: VendedorEntity,
  setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>,
  msgs: React.MutableRefObject<any>,
  router: AppRouterInstance,
  redirectAfterSave: boolean,
  setVendedor: React.Dispatch<React.SetStateAction<VendedorEntity>>,
): Promise<VendedorEntity> => {
  try {
    const vendedorDataToSend = {
      ...vendedor,
      cnpj: vendedor.cnpj && vendedor.cnpj.replace(/\D/g, '').length > 0 ? vendedor.cnpj : null,
      cpf: vendedor.cpf && vendedor.cpf.replace(/\D/g, '').length > 0 ? vendedor.cpf : null,
      documento_estrangeiro: vendedor.documento_estrangeiro && vendedor.documento_estrangeiro.replace(/\D/g, '').length > 0 ? vendedor.documento_estrangeiro : null,
    };
    const resp = await api.post('/vendedor', vendedorDataToSend);
    const created = new VendedorEntity(resp.data?.vendedor ?? resp.data);
    msgs.current?.show({ severity: 'success', detail: 'Vendedor criado com sucesso!' });
    if (redirectAfterSave) {
      router.push('/cadastro/vendedores');
    }
    setVendedor(created);
    return created;
  } catch (error: any) {
    console.error('Erro ao criar Vendedor:', error);
    if (error.response) {
      console.log('Status do erro:', error.response.status, vendedor);
      console.error('Dados do erro:', error.response.data);
    } else {
      console.error('Erro inesperado:', error.message);
    }
    msgs.current?.show({
      severity: 'error',
      detail: `Erro ao criar Vendedor: ${error.response?.data?.message || error.message}`,
    });
    throw error;
  }
};

export const updateVendedor = async (
    vendedorId: string,
    vendedor: VendedorEntity,
    setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>,
    msgs: any,
    router: AppRouterInstance,
    setVendedor: React.Dispatch<React.SetStateAction<VendedorEntity>>,
    redirectAfterSave: boolean,
) => {
    try {
        await api.put(`/vendedor`, vendedor);
        msgs.current?.show({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Vendedor atualizado com sucesso!',
        });
        if (redirectAfterSave) {
            router.push('/cadastro/vendedores');
        }
    } catch (error: any) {
        if (axios.isAxiosError(error) && error.response) {
            const { status, data } = error.response;
            const errorMessage = data.message || 'Erro ao atualizar Vendedor.';
            console.error("Erro de API:", status, data);
            msgs.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: String(errorMessage),
            });
        } else {
            console.error("Erro inesperado:", error);
            msgs.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro inesperado ao atualizar Vendedor.',
            });
        }
    }
};
export const handleActiveOrInativeVendedor = async (
    rowData: VendedorEntity,
    msgs: any,
    listPaginationVendedoresId: Record<string, any>,
    listarInativos: boolean,
    setLoading: (loading: boolean) => void,
    searchTerm: string,
    setListPaginationVendedores: (data: any) => void
) => {
    try {
        if (rowData.ativo) {
            await deletarVendedor(rowData.id!, msgs, listPaginationVendedoresId, listarInativos, setLoading, searchTerm);
        } else {
            await ativarVendedor(rowData.id!, msgs, listPaginationVendedoresId, listarInativos, setLoading, searchTerm);
        }
        const refreshList = await listVendedor(listPaginationVendedoresId, listarInativos, setLoading, searchTerm);
        setListPaginationVendedores(refreshList);
    } catch (error) {
        console.error("Erro ao ativar/desativar Cliente ou fornecedor:", error);
    }
};
