import api from "@/app/services/api";

export const searchServiceTable = async (searchTerm?: string) => {
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