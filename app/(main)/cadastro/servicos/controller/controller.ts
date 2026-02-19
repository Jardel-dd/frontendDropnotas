import axios from 'axios';
import api from '@/app/services/api';
import { ServiceEntity } from '@/app/entity/ServiceEntity';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';

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
                summary: 'Sucesso',
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
                summary: 'Erro',
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
                summary: 'Sucesso',
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
                summary: 'Erro',
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
        const dataServiceCreated = {
            ...service,
            item_lista_servico: service.item_lista_servico
                ? service.item_lista_servico.split(" - ")[0].trim()
                : "",
            codigo: service.codigo?.trim() ? service.codigo : null,
        };
        const resp = await api.post('/servico', dataServiceCreated);
        const created = new ServiceEntity(resp.data?.servico ?? resp.data);
        msgs.current?.show({
            severity: 'success',
            summary: 'Sucesso',
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
        const dataServiceUpdate = {
            ...service,
            item_lista_servico: service.item_lista_servico
                ? service.item_lista_servico.split(" - ")[0]
                : "",
        };
        await api.put(`/servico`, dataServiceUpdate);
        msgs.current?.show({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Serviço atualizado com sucesso!',
        });
        router.push('/cadastro/servicos');
    } catch (error: any) {
        if (axios.isAxiosError(error) && error.response) {
            const { status, data } = error.response;
            const errorMessage = data.message || 'Erro ao atualizar Serviço.';
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