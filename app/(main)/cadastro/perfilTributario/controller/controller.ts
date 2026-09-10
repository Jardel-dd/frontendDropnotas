import axios from 'axios';
import api from '@/app/services/api';
import { TableService } from '@/app/entity/TableServiceEntity';
import { TableCNAEEntity } from '@/app/entity/TableCNAEEntity';
import { TableCodigoNBSEntity } from '@/app/entity/TableCodigoNBS';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';
import { PerfilTributarioEntity } from '@/app/entity/perfilTributarioEntity';
import { remocaoCaractereFiltro } from '@/app/shared/removeCaracter/controller';
import { buildMobilePickerPageResult } from '@/app/shared/PageMobile/pageMobile';
import { fetchAllTabelaServico } from '@/app/components/fetchAll/listAllTableService/controller';
import { TableClassificacaoTributariaEntity } from '@/app/entity/TableClassificacaoTributariaEntity';
import { fetchFilteredCnae, findCNAEByCodigo } from '@/app/components/fetchAll/listAllCnae/controller';
import {
    normalizeEmptyValuesToNull,
    type PerfilTributarioRecommendations,
    type PreloadedPerfilTributarioData
} from '../types/perfilTributario';
import { fetchFilteredCodigoNBS, findCodigoNBS } from '@/app/components/fetchAll/listAllCodigoNBS/controller';
import { fetchFilteredClassificacaoTributaria, findClassificacaoTributariaByCodigo } from '@/app/components/fetchAll/listAllClassficacaoTributaria/controller';

const PERFIL_TRIBUTARIO_LOG_PREFIX = '[perfilTributario]';

export const listPerfilTributario = async (
    listPaginationServicos: Record<string, any>,
    listarInativos: boolean,
    setLoading: (state: boolean) => void,
    searchTerm: string
) => {
    setLoading(true);
    try {
        const response = await api.get(`/perfil-tributario?termo=${searchTerm}&listarInativos=${listarInativos}&page=${listPaginationServicos.pageable.pageNumber}&size=${listPaginationServicos.pageable.pageSize}`
        );
        return response.data;
    } finally {
        setLoading(false);
    }
};
export const ativarPerfilTributario = async (
    PerfilTributarioId: number,
    msgs: any,
    listPaginationPerfilTributario: Record<string, any>,
    listarInativos: boolean,
    setLoading: (state: boolean) => void,
    searchTerm: string
) => {
    try {
        await api.patch(`/perfil-tributario/${String(PerfilTributarioId)}/ativar`);
        msgs.current?.clear();
        msgs.current?.show([
            {
                life: 3000,
                severity: 'success',
                summary: 'Sucesso:',
                detail: `Perfil Tributário ativado com sucesso.`,
            },
        ]);
        await listPerfilTributario(listPaginationPerfilTributario, listarInativos, setLoading, searchTerm);
    } catch (error) {
        msgs.current?.clear();
        msgs.current?.show([
            {
                life: 3000,
                severity: 'error',
                summary: 'Atenção:',
                detail: `Houve um erro ao tentar ativar este Perfil Tributário, tente novamente.`,
            },
        ]);
        setTimeout(() => {
            msgs.current?.clear();
        }, 2000);
    }
};
export const deletarPerfilTributario = async (
    PerfilTributarioId: number,
    msgs: any,
    listPaginationPerfilTributario: Record<string, any>,
    listarInativos: boolean,
    setLoading: (state: boolean) => void,
    searchTerm: string
) => {
    try {
        await api.delete(`/perfil-tributario/${String(PerfilTributarioId)}`);
        msgs.current?.clear();
        msgs.current?.show([
            {
                life: 3000,
                severity: 'success',
                summary: 'Sucesso:',
                detail: 'Perfil Tributário excluído com sucesso.'
            },
        ]);
        // fetch
        // setTimeout(() => {
        //     msgs.current?.clear();
        // }, 20000);
        await listPerfilTributario(listPaginationPerfilTributario, listarInativos, setLoading, searchTerm);
    } catch (error) {
        msgs.current?.clear();
        msgs.current?.show([
            {
                life: 3000,
                severity: 'error',
                summary: 'Atenção:',
                detail: 'Houve um erro ao tentar excluir Perfil Tributário, tente novamente.'
            },
        ]);
        setTimeout(() => {
            msgs.current?.clear();
        }, 2000);
        console.error(`Erro ao tentar excluir Perfil Tributário com ID ${PerfilTributarioId}:`, error);
    }
};
export const createPerfilTributario = async (
    perfilTributario: Partial<PerfilTributarioEntity>,
    setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>,
    msgs: any,
    router: AppRouterInstance,
    setPerfilTributario: React.Dispatch<React.SetStateAction<PerfilTributarioEntity>>,
    redirectAfterSave: boolean,
): Promise<PerfilTributarioEntity> => {
    try {
        const dataPerfilTributarioCreated = normalizeEmptyValuesToNull({
            ...perfilTributario,
            aliquota_deducoes: perfilTributario.aliquota_deducoes ?? 0,
        });
        console.log(`${PERFIL_TRIBUTARIO_LOG_PREFIX} POST /perfil-tributario`, {
            id_empresa: dataPerfilTributarioCreated.id_empresa ?? null,
            payload: dataPerfilTributarioCreated
        });
        const resp = await api.post('/perfil-tributario', dataPerfilTributarioCreated);
        const created = new PerfilTributarioEntity(resp.data?.perfilTributario ?? resp.data);
        msgs.current?.show({
            severity: 'success',
            summary: 'Sucesso:',
            detail: 'Perfil Tributário cadastrado com sucesso!',
        });
        if (redirectAfterSave) {
            router.push('/cadastro/perfilTributario');
        }
        setPerfilTributario(created);
        return created;
    } catch (error) {
        throw error;
    }
};
export const updatePerfilTributario = async (
    PerfilTributarioID: string,
    perfilTributario: PerfilTributarioEntity,
    setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>,
    msgs: any,
    router: AppRouterInstance,
    setPerfilTributario: React.Dispatch<React.SetStateAction<PerfilTributarioEntity>>,
    redirectAfterSave: boolean
) => {
    try {
        const dataPerfilTributarioUpdate = normalizeEmptyValuesToNull({
            ...perfilTributario,
            aliquota_deducoes: perfilTributario.aliquota_deducoes ?? 0,
        });
        console.log(`${PERFIL_TRIBUTARIO_LOG_PREFIX} PUT /perfil-tributario`, {
            perfilTributarioId: PerfilTributarioID,
            id_empresa: dataPerfilTributarioUpdate.id_empresa ?? null,
            payload: dataPerfilTributarioUpdate
        });
        const response = await api.put(`/perfil-tributario`, dataPerfilTributarioUpdate);
        const responseData = response?.data;
        const responsePerfilTributario =
            responseData &&
                typeof responseData === 'object' &&
                'perfilTributario' in responseData
                ? (responseData as { perfilTributario?: PerfilTributarioEntity | Record<string, unknown> }).perfilTributario
                : null;
        const updated =
            (responsePerfilTributario && typeof responsePerfilTributario === 'object' ? responsePerfilTributario : null) ??
            (responseData && typeof responseData === 'object' ? responseData : null) ?? {
                ...dataPerfilTributarioUpdate,
                id: Number(PerfilTributarioID)
            };
        msgs.current?.show({
            severity: 'success',
            summary: 'Sucesso:',
            detail: 'Perfil Tributário atualizado com sucesso!',
        });
        setPerfilTributario(new PerfilTributarioEntity(updated));
        if (redirectAfterSave) {
            router.push('/cadastro/perfilTributario');
        }
        return updated;
    } catch (error: any) {
        if (axios.isAxiosError(error) && error.response) {
            const { status, data } = error.response;
            const errorMessage = data.message || 'Erro ao atualizar Perfil Tributário.';
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
                detail: 'Erro inesperado ao atualizar Perfil Tributário.',
            });
        }
    }
};
export const listThePerfilTributario = async () => {
    try {
        const response = await api.get('/perfil-tributario');
        if (response.data && Array.isArray(response.data.content)) {
            return response.data.content;
        } else {
            return [];
        }
    } catch (error) {
        console.error("Erro ao buscar Perfil Tributário:", error);
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
    const response = await api.get('/perfil-tributario', {
        params: {
            page,
            size,
            termo: termo || undefined
        }
    });

    return buildMobilePickerPageResult<PerfilTributarioEntity>(response.data);
};
export const handleActiveOrInativePerfilTributario = async (
    rowData: PerfilTributarioEntity,
    msgs: any,
    listPaginationPerfilTributario: Record<string, any>,
    listarInativos: boolean,
    setLoading: (loading: boolean) => void,
    searchTerm: string,
    setListPaginationPerfilTributario: (data: any) => void
) => {
    try {
        if (rowData.ativo) {
            await deletarPerfilTributario(rowData.id!, msgs, listPaginationPerfilTributario, listarInativos, setLoading, searchTerm);
        } else {
            await ativarPerfilTributario(rowData.id!, msgs, listPaginationPerfilTributario, listarInativos, setLoading, searchTerm);

        }
        const refreshList = await listPerfilTributario(listPaginationPerfilTributario, listarInativos, setLoading, searchTerm);
        setListPaginationPerfilTributario(refreshList);
    } catch (error) {
        console.error("Erro ao ativar/desativar Perfil Tributário;:", error);
    }
};
export const fetchFilteredPerfilTributario = async (filtro: string) => {
    try {
        const response = await api.get(`/perfil-tributario`, {
            params: {
                termo: remocaoCaractereFiltro(filtro)
            }
        });
        console.log(" Perfil Tributário filtradas:", response.data);
        if (response.data && Array.isArray(response.data.content)) {
            return response.data.content;
        } else {
            return [];
        }
    } catch (error) {
        return [];
    }
};
export const fetchAllPerfilTributario = async (): Promise<PerfilTributarioEntity[]> => {
    try {
        const response = await api.get('/perfil-tributario');
        return response.data.content || [];
    } catch (error) {
        console.error("Erro ao buscar Perfil Tributário:", error);
        return [];
    }
};

export const fetchPerfilTributarioByID = async (id: string): Promise<{ perfilTributario: PerfilTributarioEntity }> => {
    try {
        const response = await api.get(`/perfil-tributario/${id}`);
        const data = response.data;
        console.log("Retorno Perfil Tributário", data);
        return {
            perfilTributario: new PerfilTributarioEntity({
                ...data,
                aliquota_deducoes: data.aliquota_deducoes ?? 0,
            }),
        };
    } catch (error) {
        console.error("Erro ao buscar Perfil Tributário:", error);
        throw error;
    }
};

export const fetchPerfilTributarioRecommendations = async (
    empresaId: number
): Promise<PerfilTributarioRecommendations> => {
    console.log(`${PERFIL_TRIBUTARIO_LOG_PREFIX} GET /perfil-tributario/recomendacoes`, {
        params: { id_empresa: empresaId }
    });
    const response = await api.get('/perfil-tributario/recomendacoes', {
        params: { id_empresa: empresaId }
    });

    return response.data ?? {};
};
