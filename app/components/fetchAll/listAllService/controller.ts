import api from "@/app/services/api";
import { ServiceEntity } from "@/app/entity/ServiceEntity";
export const fetchServicesByID = async (id: string): Promise<{ servico: ServiceEntity }> => {
    try {
        const response = await api.get(`/servico/${id}`);
        const data = response.data;
        console.log("Retorno service", data);
        return {
            servico: {
                ...data,
                item_lista_servico_display: `${data.codigo} - ${data.item_lista_servico}`,
            },
        };
    } catch (error) {
        console.error("Erro ao buscar serviço:", error);
        throw error;
    }
};
export const searchServicesByParam = async (searchTerm?: string) => {
    try {
        const termo = searchTerm ? `?termo=${searchTerm}` : '';
        const response = await api.get(`/tabela-servico/buscar${termo}`);
        const services = Array.isArray(response.data.content) ? response.data.content : [];
        return services.map((service:any ) => {
            service.descricao = `${service.codigo} - ${service.descricao}`;
            return service;
        })
    } catch (error) {
        console.error("Erro ao buscar serviços filtrados:", error);
        return [];
    }
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