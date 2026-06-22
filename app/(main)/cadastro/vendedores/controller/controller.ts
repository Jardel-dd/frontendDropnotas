'use client'
import axios from "axios";
import { useCallback } from "react";
import api from "@/app/services/api";
import { VendedorEntity } from "@/app/entity/VendedorEntity";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";
import { buildMobilePickerPageResult } from "@/app/shared/PageMobile/pageMobile";

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
                summary: 'Sucesso:',
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
                summary: 'Atenção:',
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
                summary: 'Sucesso:',
                detail: 'Vendedor excluído com sucesso.'
            },
        ]);
    } catch (error) {
        msgs.current?.clear();
        msgs.current?.show([
            {
                severity: 'error',
                summary: 'Atenção:',
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
      documento_estrangeiro:
        vendedor.documento_estrangeiro &&
        vendedor.documento_estrangeiro.replace(/\D/g, '').length > 0
          ? vendedor.documento_estrangeiro
          : null,
    };
    const resp = await api.post('/vendedor', vendedorDataToSend);
    const created = new VendedorEntity(resp.data?.vendedor ?? resp.data);
    msgs.current?.show({
      severity: 'success',
      detail: 'Vendedor criado com sucesso!',
    });
    if (redirectAfterSave) {
      router.push('/cadastro/vendedores');
    }
    setVendedor(created);
    return created;
  } catch (error: any) {
    if (error.response?.status === 409) {
      msgs.current?.show({
        severity: 'error',
        summary: 'Atenção:',
        detail:
          'Já existe cadastrado com este CPF ou CNPJ. Verifique os dados informados.',
      });
    }
    throw null;
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
        const response = await api.put(`/vendedor`, vendedor);
        const updated = new VendedorEntity(response.data?.vendedor ?? vendedor);
        msgs.current?.show({
            severity: 'success',
            summary: 'Sucesso:',
            detail: 'Vendedor atualizado com sucesso!',
        });
        setVendedor(updated);
        if (redirectAfterSave) {
            router.push('/cadastro/vendedores');
        }
        return updated;
    } catch (error: any) {
        if (axios.isAxiosError(error) && error.response?.status === 409) {
            msgs.current?.show({
                severity: 'error',
                summary: 'Atenção:',
                detail:
                    'Já existe um vendedor cadastrado com este CPF ou CNPJ.',
            });
            return null;
        }
        if (axios.isAxiosError(error) && error.response) {
            const { status, data } = error.response;

            console.error('Erro de API:', status, data);

            msgs.current?.show({
                severity: 'error',
                summary: 'Atenção:',
                detail:
                    data.message ||
                    'Não foi possível atualizar o vendedor.',
            });

        } else {
            msgs.current?.show({
                severity: 'error',
                summary: 'Atenção:',
                detail:
                    'Ocorreu um erro inesperado ao atualizar o vendedor.',
            });
        }
        return null;
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
export const fetchVendedor = async (vendedorId: string): Promise<{ dataVendedor: VendedorEntity }> => {
  try {
    const { data: dataVendedor } = await api.get(`/vendedor/${vendedorId}`);
    const vendedorInstanciado = new VendedorEntity({
      ...dataVendedor,
      percentual_comissao: dataVendedor.percentual_comissao ?? 0 
    });
    console.log("vendedor selecionado", dataVendedor);
    return {
      dataVendedor: vendedorInstanciado,
    };
  } catch (error) {
    console.error("Erro ao buscar vendedor :", error);
    throw error;
  }
};
export const fetchAllVendedores = async (): Promise<VendedorEntity[]> => {
    try {
        const response = await api.get('/vendedor');
        return response.data.content || [];
    } catch (error) {
        console.error("Erro ao buscar todas as vendedor:", error);
        return [];
    }
};
export const fetchFilteredVendedor = async (termo: string): Promise<VendedorEntity[]> => {
    try {
        const response = await api.get('/vendedor', {
            params: {
                termo: termo 
            }
        });
        return response.data.content || [];
    } catch (error) {
        console.error("Erro ao buscar vendedor filtradas:", error);
        return [];
    }
};
export const listTheVendedor = async () => {
    try {
        const response = await api.get('/vendedor');
        if (response.data && Array.isArray(response.data.content)) {
            return response.data.content;
        } else {
            return [];
        }
    } catch (error) {
        console.error("Erro ao buscar Vendedor contrato:", error);
        return [];
    }
};
export const fetchVendedorMobilePage = async ({
    searchTerm: termo,
    page,
    size
}: {
    searchTerm: string;
    page: number;
    size: number;
}) => {
    const response = await api.get('/vendedor', {
        params: {
            page,
            size,
            termo: termo || undefined
        }
    });

    return buildMobilePickerPageResult<VendedorEntity>(response.data);
};