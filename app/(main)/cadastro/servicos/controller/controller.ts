import axios from 'axios';
import api from '@/app/services/api';
import { CompanyEntity } from '@/app/entity/CompanyEntity';
import { ServiceEntity } from '@/app/entity/ServiceEntity';
import { PerfilTributarioEntity } from '@/app/entity/perfilTributarioEntity';
import { remocaoCaractereFiltro } from '@/app/shared/removeCaracter/controller';
import { buildMobilePickerPageResult } from '@/app/shared/PageMobile/pageMobile';
import { fetchCompanyDropdownByID } from '@/app/(main)/configuracoes/empresas/controller/controller';
import { fetchPerfilTributarioByID } from '@/app/(main)/cadastro/perfilTributario/controller/controller';
import { normalizeEmptyValuesToNull, type PreloadedServicoData } from '../types/servico';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

const normalizeServicoIds = (value: unknown): number[] => {
    if (!Array.isArray(value)) {
        return [];
    }

    return Array.from(
        new Set(
            value
                .map((item) => Number(item))
                .filter((item) => Number.isFinite(item) && item > 0)
        )
    );
};

const normalizeServicoPerfilTributarioId = (value: unknown): number | null => {
    const parsedValue = Number(value);

    return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : null;
};

const mapServicoResponseToEntity = (data: any): ServiceEntity =>
    new ServiceEntity({
        ...data,
        id_perfil_tributario: normalizeServicoPerfilTributarioId(
            data?.id_perfil_tributario ?? data?.perfil_tributario?.id ?? data?.perfilTributario?.id
        ),
        id_empresas: normalizeServicoIds(
            data?.id_empresas ??
                (Array.isArray(data?.empresas) ? data.empresas.map((empresa: any) => empresa?.id) : [])
        ),
        valor_servico: data?.valor_servico ?? null,
        valor_desconto: data?.valor_desconto ?? 0
    });

const buildServicoPayload = (service: Partial<ServiceEntity>, servicoId?: string) =>
    normalizeEmptyValuesToNull({
        ...(service.id ? { id: service.id } : servicoId ? { id: Number(servicoId) } : {}),
        ...(service.ativo !== undefined ? { ativo: service.ativo } : {}),
        descricao: service.descricao ?? '',
        descricao_completa: service.descricao_completa ?? '',
        codigo: service.codigo?.trim() ? service.codigo : null,
        observacoes: service.observacoes ?? '',
        valor_servico: service.valor_servico ?? 0,
        id_perfil_tributario: normalizeServicoPerfilTributarioId(service.id_perfil_tributario),
        id_empresas: normalizeServicoIds(service.id_empresas)
    });

const fetchSelectedPerfilTributario = async (perfilTributarioId?: number | null) => {
    if (!perfilTributarioId) {
        return null;
    }

    try {
        const { perfilTributario } = await fetchPerfilTributarioByID(String(perfilTributarioId));
        return new PerfilTributarioEntity(perfilTributario);
    } catch (error) {
        console.error('Erro ao buscar perfil tributario selecionado:', error);
        return null;
    }
};

const fetchSelectedEmpresas = async (empresaIds: number[]) => {
    if (empresaIds.length === 0) {
        return [];
    }

    const empresas = await Promise.all(
        empresaIds.map(async (empresaId) => {
            try {
                const empresa = await fetchCompanyDropdownByID(String(empresaId));
                return empresa ? new CompanyEntity(empresa) : null;
            } catch (error) {
                console.error(`Erro ao buscar empresa ${empresaId} do servico:`, error);
                return null;
            }
        })
    );

    return empresas.filter((empresa): empresa is CompanyEntity => empresa !== null);
};

export const listServico = async (
    listPaginationServicos: Record<string, any>,
    listarInativos: boolean,
    setLoading: (state: boolean) => void,
    searchTerm: string
) => {
    setLoading(true);

    try {
        const response = await api.get(
            `/servico?termo=${searchTerm}&listarInativos=${listarInativos}&page=${listPaginationServicos.pageable.pageNumber}&size=${listPaginationServicos.pageable.pageSize}`
        );
        return response.data;
    } finally {
        setLoading(false);
    }
};

export const ativarServico = async (
    servicosId: number,
    msgs: any,
    listPaginationServicos: Record<string, any>,
    listarInativos: boolean,
    setLoading: (state: boolean) => void,
    searchTerm: string
) => {
    try {
        await api.patch(`/servico/${String(servicosId)}/ativar`);
        msgs.current?.clear();
        msgs.current?.show([
            {
                life: 3000,
                severity: 'success',
                summary: 'Sucesso:',
                detail: 'Servico ativado com sucesso.'
            }
        ]);

        await listServico(listPaginationServicos, listarInativos, setLoading, searchTerm);
    } catch (error) {
        msgs.current?.clear();
        msgs.current?.show([
            {
                life: 3000,
                severity: 'error',
                summary: 'Atencao:',
                detail: 'Houve um erro ao tentar ativar este servico, tente novamente.'
            }
        ]);
        setTimeout(() => {
            msgs.current?.clear();
        }, 2000);
        console.error(`Erro ao tentar ativar servico com ID ${servicosId}:`, error);
    }
};

export const deletarServico = async (
    servicosId: number,
    msgs: any,
    listPaginationServicos: Record<string, any>,
    listarInativos: boolean,
    setLoading: (state: boolean) => void,
    searchTerm: string
) => {
    try {
        await api.delete(`/servico/${String(servicosId)}`);
        msgs.current?.clear();
        msgs.current?.show([
            {
                life: 3000,
                severity: 'success',
                summary: 'Sucesso:',
                detail: 'Servico excluido com sucesso.'
            }
        ]);

        setTimeout(() => {
            msgs.current?.clear();
        }, 20000);

        await listServico(listPaginationServicos, listarInativos, setLoading, searchTerm);
    } catch (error) {
        msgs.current?.clear();
        msgs.current?.show([
            {
                life: 3000,
                severity: 'error',
                summary: 'Atencao:',
                detail: 'Houve um erro ao tentar excluir este servico, tente novamente.'
            }
        ]);
        setTimeout(() => {
            msgs.current?.clear();
        }, 2000);
        console.error(`Erro ao tentar excluir o servico com ID ${servicosId}:`, error);
    }
};

export const createServico = async (
    service: Partial<ServiceEntity>,
    _setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>,
    msgs: any,
    router: AppRouterInstance,
    setServico: React.Dispatch<React.SetStateAction<ServiceEntity>>,
    redirectAfterSave: boolean
): Promise<ServiceEntity> => {
    try {
        const dataServiceCreated = buildServicoPayload(service);
        const resp = await api.post('/servico', dataServiceCreated);
        const created = mapServicoResponseToEntity(resp.data?.servico ?? resp.data);

        msgs.current?.show({
            severity: 'success',
            summary: 'Sucesso:',
            detail: 'Servico cadastrado com sucesso!'
        });

        if (redirectAfterSave) {
            router.push('/cadastro/servicos');
        }

        setServico(created);
        return created;
    } catch (error) {
        throw error;
    }
};

export const updateServico = async (
    servicosID: string,
    service: ServiceEntity,
    _setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>,
    msgs: any,
    router: AppRouterInstance,
    setServicos: React.Dispatch<React.SetStateAction<ServiceEntity>>,
    redirectAfterSave: boolean
) => {
    try {
        const dataServiceUpdate = buildServicoPayload(service, servicosID);
        const response = await api.put('/servico', dataServiceUpdate);
        const responseData = response?.data;
        const responseServico =
            responseData && typeof responseData === 'object' && 'servico' in responseData
                ? (responseData as { servico?: ServiceEntity | Record<string, unknown> }).servico
                : null;
        const updated = mapServicoResponseToEntity(
            (responseServico && typeof responseServico === 'object' ? responseServico : null) ??
                (responseData && typeof responseData === 'object' ? responseData : null) ?? {
                    ...dataServiceUpdate,
                    id: Number(servicosID)
                }
        );

        msgs.current?.show({
            severity: 'success',
            summary: 'Sucesso:',
            detail: 'Servico atualizado com sucesso!'
        });

        setServicos(updated);

        if (redirectAfterSave) {
            router.push('/cadastro/servicos');
        }

        return updated;
    } catch (error: any) {
        if (axios.isAxiosError(error) && error.response) {
            const { status, data } = error.response;
            const errorMessage = data.message || 'Erro ao atualizar servico.';
            console.error('Erro de API:', status, data);
            msgs.current?.show({
                severity: 'error',
                summary: 'Atencao:',
                detail: String(errorMessage)
            });
        } else {
            console.error('Erro inesperado:', error);
            msgs.current?.show({
                severity: 'error',
                summary: 'Atencao:',
                detail: 'Erro inesperado ao atualizar servico.'
            });
        }
    }
};

export const listTheService = async () => {
    try {
        const response = await api.get('/servico');
        if (response.data && Array.isArray(response.data.content)) {
            return response.data.content;
        }

        return [];
    } catch (error) {
        console.error('Erro ao buscar servicos:', error);
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
        console.error('Erro ao ativar/desativar servicos:', error);
    }
};

export const fetchFilteredService = async (filtro: string) => {
    try {
        const response = await api.get('/servico', {
            params: {
                termo: remocaoCaractereFiltro(filtro)
            }
        });

        if (response.data && Array.isArray(response.data.content)) {
            return response.data.content;
        }

        return [];
    } catch (error) {
        return [];
    }
};

export const fetchAllService = async (): Promise<ServiceEntity[]> => {
    try {
        const response = await api.get('/servico');
        return response.data.content || [];
    } catch (error) {
        console.error('Erro ao buscar todos os servicos:', error);
        return [];
    }
};

export const fetchServiceFormDataByID = async (id: string): Promise<PreloadedServicoData> => {
    const { servico } = await fetchServicesByID(id);
    const entidade = mapServicoResponseToEntity(servico);
    const [selectedPerfilTributario, selectedEmpresas] = await Promise.all([
        fetchSelectedPerfilTributario(entidade.id_perfil_tributario),
        fetchSelectedEmpresas(entidade.id_empresas ?? [])
    ]);

    return {
        servico: entidade,
        selectedPerfilTributario,
        selectedEmpresas
    };
};

export const fetchServicesByID = async (id: string): Promise<{ servico: ServiceEntity }> => {
    try {
        const response = await api.get(`/servico/${id}`);
        const data = response.data;
        return {
            servico: mapServicoResponseToEntity(data)
        };
    } catch (error) {
        console.error('Erro ao buscar servico:', error);
        throw error;
    }
};
