import axios from 'axios';
import { useCallback } from 'react';
import api from '@/app/services/api';
import { ServiceEntity } from '@/app/entity/ServiceEntity';
import type { PreloadedServicoData } from '../types/servico';
import { TableService } from '@/app/entity/TableServiceEntity';
import { TableCNAEEntity } from '@/app/entity/TableCNAEEntity';
import { TableCodigoNBSEntity } from '@/app/entity/TableCodigoNBS';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';
import { buildMobilePickerPageResult } from '@/app/shared/PageMobile/pageMobile';
import { fetchAllTabelaServico } from '@/app/components/fetchAll/listAllTableService/controller';
import { TableClassificacaoTributariaEntity } from '@/app/entity/TableClassificacaoTributariaEntity';
import { fetchFilteredCnae, findCNAEByCodigo } from '@/app/components/fetchAll/listAllCnae/controller';
import { fetchFilteredCodigoNBS, findCodigoNBS } from '@/app/components/fetchAll/listAllCodigoNBS/controller';
import { fetchFilteredClassificacaoTributaria, findClassificacaoTributariaByCodigo } from '@/app/components/fetchAll/listAllClassficacaoTributaria/controller';

const normalizeEmptyValuesToNull = <T,>(value: T): T => {
    if (Array.isArray(value)) {
        return value.map((item) => normalizeEmptyValuesToNull(item)) as T;
    }

    if (value && typeof value === 'object') {
        const normalizedEntries = Object.entries(value as Record<string, unknown>).map(([key, entryValue]) => [
            key,
            normalizeEmptyValuesToNull(entryValue)
        ]);

        return Object.fromEntries(normalizedEntries) as T;
    }

    if (typeof value === 'string') {
        return (value.trim() === '' ? null : value) as T;
    }

    return value;
};
export const listServico = async (
    listPaginationServicos: Record<string, any>,
    listarInativos: boolean,
    setLoading: (state: boolean) => void,
    searchTerm: string
) => {
    setLoading(true);
    try {
        const response = await api.get(`/servico?termo=${searchTerm}&listarInativos=${listarInativos}&page=${listPaginationServicos.pageable.pageNumber}&size=${listPaginationServicos.pageable.pageSize}`
        );
        return response.data;
    } finally {
        setLoading(false);
    }
};
export const ativarServico = async (
    ServicosId: number,
    msgs: any,
    listPaginationServicos: Record<string, any>,
    listarInativos: boolean,
    setLoading: (state: boolean) => void,
    searchTerm: string
) => {
    try {
        await api.patch(`/servico/${String(ServicosId)}/ativar`);
        msgs.current?.clear();
        msgs.current?.show([
            {
                life: 3000,
                severity: 'success',
                summary: 'Sucesso:',
                detail: `Serviço ativado com sucesso.`,
            },
        ]);
       
        await listServico(listPaginationServicos, listarInativos, setLoading, searchTerm);
        console.log(`User Conta com ID ${ServicosId} ativada com sucesso.`);
    } catch (error) {
        msgs.current?.clear();
        msgs.current?.show([
            {
                life: 3000,
                severity: 'error',
                summary: 'Atenção:',
                detail: `Houve um erro ao tentar ativar este Serviço, tente novamente.`,
            },
        ]);
        setTimeout(() => {
            msgs.current?.clear();
        }, 2000);
        console.error(`Erro ao tentar ativar Serviço com ID ${ServicosId}:`, error);
    }
};
export const deletarServico = async (
    ServicosId: number,
    msgs: any,
    listPaginationServicos: Record<string, any>,
    listarInativos: boolean,
    setLoading: (state: boolean) => void,
    searchTerm: string
) => {
    try {
        await api.delete(`/servico/${String(ServicosId)}`);
        msgs.current?.clear();
        msgs.current?.show([
            {
                life: 3000,
                severity: 'success',
                summary: 'Sucesso:',
                detail: 'Serviço excluído com sucesso.'
            },
        ]);
        fetch
        setTimeout(() => {
            msgs.current?.clear();
        }, 20000);
        console.log(`Serviço com ID ${ServicosId} excluída com sucesso.`);
        await listServico(listPaginationServicos, listarInativos, setLoading, searchTerm);

    } catch (error) {
        msgs.current?.clear();
        msgs.current?.show([
            {
                life: 3000,
                severity: 'error',
                summary: 'Atenção:',
                detail: 'Houve um erro ao tentar excluir este Serviço, tente novamente.'
            },
        ]);
        setTimeout(() => {
            msgs.current?.clear();
        }, 2000);
        console.error(`Erro ao tentar excluir o Serviço com ID ${ServicosId}:`, error);
    }
};
export const createServico = async (
    service: Partial<ServiceEntity>,
    setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>,
    msgs: any,
    router: AppRouterInstance,
    setServico: React.Dispatch<React.SetStateAction<ServiceEntity>>,
    redirectAfterSave: boolean,
): Promise<ServiceEntity> => {
    try {
        const dataServiceCreated = normalizeEmptyValuesToNull({
            ...service,
            codigo: service.codigo?.trim() ? service.codigo : null,
            aliquota_deducoes: service.aliquota_deducoes ?? 0,
        });
        console.log('[Cadastro/Servicos] Payload enviado ao criar servico:', dataServiceCreated);
        const resp = await api.post('/servico', dataServiceCreated);
        const created = new ServiceEntity(resp.data?.servico ?? resp.data);
        msgs.current?.show({
            severity: 'success',
            summary: 'Sucesso:',
            detail: 'Serviço cadastrado com sucesso!',
        });
        if (redirectAfterSave) {
            router.push('/cadastro/servicos');
        }
        setServico(created);
        console.log("resp setServico", resp)
        return created;
    } catch (error) {
        throw error;
    }
};
export const updateServico = async (
    servicosID: string,
    service: ServiceEntity,
    setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>,
    msgs: any,
    router: AppRouterInstance,
    setServicos: React.Dispatch<React.SetStateAction<ServiceEntity>>,
    redirectAfterSave: boolean
) => {
    try {
        const dataServiceUpdate = normalizeEmptyValuesToNull({
            ...service,
            aliquota_deducoes: service.aliquota_deducoes ?? 0,
        });
        console.log('Payload enviado ao atualizar servico:', dataServiceUpdate);
        const response = await api.put(`/servico`, dataServiceUpdate);
        const responseData = response?.data;
        const responseServico =
            responseData &&
            typeof responseData === 'object' &&
            'servico' in responseData
                ? (responseData as { servico?: ServiceEntity | Record<string, unknown> }).servico
                : null;
        const updated =
            (responseServico && typeof responseServico === 'object' ? responseServico : null) ??
            (responseData && typeof responseData === 'object' ? responseData : null) ?? {
                ...dataServiceUpdate,
                id: Number(servicosID)
            };
        msgs.current?.show({
            severity: 'success',
            summary: 'Sucesso:',
            detail: 'Serviço atualizado com sucesso!',
        });
        setServicos(new ServiceEntity(updated));
        if (redirectAfterSave) {
            router.push('/cadastro/servicos');
        }
        return updated;
    } catch (error: any) {
        if (axios.isAxiosError(error) && error.response) {
            const { status, data } = error.response;
            const errorMessage = data.message || 'Erro ao atualizar Serviço.';
            console.error("Erro de API:", status, data);
            msgs.current?.show({
                severity: 'error',
                summary: 'Atenção:',
                detail: String(errorMessage),
            });
        } else {
            console.error("Erro inesperado:", error);
            msgs.current?.show({
                severity: 'error',
                summary: 'Atenção:',
                detail: 'Erro inesperado ao atualizar Serviço.',
            });
        }
    }
};
export const handleActiveOrInativeServicos = async (
    rowData: ServiceEntity,
    msgs: any,
    listPaginationServicos: Record<string, any>,
    listarInativos: boolean,
    setLoading: (loading: boolean) => void,
    searchTerm: string,
    setListPaginationServicos: (data: any) => void
) => {
    try {
        if (rowData.ativo) {
            await deletarServico(rowData.id!, msgs, listPaginationServicos, listarInativos, setLoading, searchTerm);
        } else {
            await ativarServico(rowData.id!, msgs, listPaginationServicos, listarInativos, setLoading, searchTerm);

        }
        const refreshList = await listServico(listPaginationServicos, listarInativos, setLoading, searchTerm);
        setListPaginationServicos(refreshList);
    } catch (error) {
        console.error("Erro ao ativar/desativar Servicos;:", error);
    }
};
export const fetchServicesByID = async (id: string): Promise<{ servico: ServiceEntity }> => {
    try {
        const response = await api.get(`/servico/${id}`);
        const data = response.data;
        console.log("Retorno service", data);
        return {
            servico: {
                ...data,
                aliquota_deducoes: data.aliquota_deducoes ?? 0,
                item_lista_servico_display: `${data.codigo} - ${data.item_lista_servico}`,
            },
        };
    } catch (error) {
        console.error("Erro ao buscar serviço:", error);
        throw error;
    }
};
export const fetchServiceFormDataByID = async (id: string): Promise<PreloadedServicoData> => {
    const { servico } = await fetchServicesByID(id);
    const entidade = new ServiceEntity(servico);
    const [allServices, codigoNBSOptions, codigoCNAEOptions, classificacaoTributariaOptions] = await Promise.all([
        fetchAllTabelaServico(),
        entidade.codigo_nbs ? fetchFilteredCodigoNBS(entidade.codigo_nbs) : Promise.resolve([] as TableCodigoNBSEntity[]),
        entidade.codigo_cnae ? fetchFilteredCnae(entidade.codigo_cnae) : Promise.resolve([] as TableCNAEEntity[]),
        entidade.codigo_classificacao_tributaria ? fetchFilteredClassificacaoTributaria(entidade.codigo_classificacao_tributaria) : Promise.resolve([] as TableClassificacaoTributariaEntity[])
    ]);
    const matchedServico = entidade.item_lista_servico
        ? allServices.find((option) => option.codigo === entidade.item_lista_servico) ?? null
        : null;

    return {
        servico: new ServiceEntity({
            ...entidade,
        }),
        selectedCodigoNBS: entidade.codigo_nbs
            ? (
                findCodigoNBS(entidade.codigo_nbs, codigoNBSOptions) ??
                new TableCodigoNBSEntity({
                    id: 0,
                    codigo: entidade.codigo_nbs,
                    descricao: entidade.codigo_nbs
                })
            )
            : null,
        selectedCodigoCNAE: entidade.codigo_cnae
            ? (
                findCNAEByCodigo(entidade.codigo_cnae, codigoCNAEOptions) ??
                new TableCNAEEntity({
                    id: 0,
                    codigo: entidade.codigo_cnae,
                    descricao: entidade.codigo_cnae
                })
            )
            : null,
        selectedClassificacaoTributaria: entidade.codigo_classificacao_tributaria
            ? (
                findClassificacaoTributariaByCodigo(entidade.codigo_classificacao_tributaria, classificacaoTributariaOptions) ??
                new TableClassificacaoTributariaEntity({
                    id: 0,
                    codigo: entidade.codigo_classificacao_tributaria,
                    descricao: entidade.codigo_classificacao_tributaria,
                    codigoCst: entidade.codigo_classificacao_tributaria
                })
            )
            : null,
        selectedCodigoServico: matchedServico ??
            (entidade.item_lista_servico
                ? new TableService({
                    id: 0,
                    codigo: entidade.item_lista_servico,
                    descricao: entidade.item_lista_servico,
                })
                : null)
    };
};
export const listTheService = async () => {
    try {
        const response = await api.get('/servico');
        if (response.data && Array.isArray(response.data.content)) {
            return response.data.content;
        } else {
            return [];
        }
    } catch (error) {
        console.error("Erro ao buscar Serviços contrato:", error);
        return [];
    }
};
export const fetchFilteredService = async (filtro: string) => {
    try {
        const response = await api.get(`/servico`, {
            params: {
                termo: filtro
            }
        });
        console.log(" Serviços filtradas:", response.data);
        if (response.data && Array.isArray(response.data.content)) {
            return response.data.content;
        } else {
            return [];
        }
    } catch (error) {
        return [];
    }
};
export const fetchAllService = async (): Promise<ServiceEntity[]> => {
    try {
        const response = await api.get('/servico');
        return response.data.content || [];
    } catch (error) {
        console.error("Erro ao buscar todas as vendedor:", error);
        return [];
    }
};
export const fetchServiceMobilePage = async ({
    searchTerm: termo,
    page,
    size
}: {
    searchTerm: string;
    page: number;
    size: number;
}) => {
    const response = await api.get('/servico', {
        params: {
            page,
            size,
            termo: termo || undefined
        }
    });

    return buildMobilePickerPageResult<ServiceEntity>(response.data);
};