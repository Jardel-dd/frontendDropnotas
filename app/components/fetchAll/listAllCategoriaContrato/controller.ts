import { CategoryContratosEntity } from "@/app/entity/CategoryContratEntity";
import api from "@/app/services/api";

export const listTheCategoriaContrato = async () => {
    try {
        const response = await api.get('/categoria-contrato');
        if (response.data && Array.isArray(response.data.content)) {
            return response.data.content;
        } else {
            return [];
        }
    } catch (error) {
        console.error("Erro ao buscar categoria contrato:", error);
        return [];
    }
};
export const fetchAllCategoriaContrato = async () => {
    try {
        const response = await api.get("/categoria-contrato");
        if (response.data && Array.isArray(response.data.content)) {
            return response.data.content;
        } else {
            return [];
        }
    } catch (error) {
        console.error("Erro ao buscar Categoria contrato:", error);
        return [];
    }
};
export const fetchFilteredCategoriaContrato = async (filtro: string) => {
    try {
        const response = await api.get(`/categoria-contrato`, {
            params: {
                termo: filtro
            }
        });
        if (response.data && Array.isArray(response.data.content)) {
            return response.data.content;
        } else {
            return [];
        }
    } catch (error) {
        console.error("Erro ao filtrar Categoria Contrato:", error);
        return [];
    }
};
export const fetchCategoriaContrato = async (): Promise<CategoryContratosEntity[]> => {
    try {
        const idsResponse = await api.get('/categoria-contrato');
        let categoriaContrato = [];
        if (Array.isArray(idsResponse.data)) {
            categoriaContrato = idsResponse.data;
        } else if (idsResponse.data && Array.isArray(idsResponse.data.content)) {
            categoriaContrato = idsResponse.data.content;
        } 
        return categoriaContrato.map((user: any) => ({
            id: user.id,
            descricao: user.descricao || 'Nome não disponível',
        }));
    } catch (error) {
        console.error('Erro ao buscar usuários do endpoint /usuario-conta:', error);
        return [];
    }
};
export const fetchCategoriaContratoByID  = async (categoriaContrato: string) => {
    try {
        const response = await api.get(`/categoria-contrato/${categoriaContrato}`);
        const data = response.data;
        return {
            categoriaContrato: data,
        };
    } catch (error) {
        console.error("Erro ao buscar categoria Contrato:", error);
        throw error;
    }
};