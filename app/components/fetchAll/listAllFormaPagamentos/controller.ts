import api from "@/app/services/api";

export const listTheFormaPagamento = async () => {
    try {
        const response = await api.get('/forma-pagamento');
        if (response.data && Array.isArray(response.data.content)) {
            return response.data.content;
        } else {
            return [];
        }
    } catch (error) {
        console.error("Erro ao buscar forma de pagamento:", error);
        return [];
    }
};
export const fetchAllFormaPagamento = async () => {
       try {
        const response = await api.get('/forma-pagamento');
        return response.data.content || [];
    } catch (error) {
        console.error("Erro ao buscar todas as vendedor:", error);
        return [];
    }
};
export const fetchFilteredFormaPagamento = async (filtro: string) => {
    try {
        const response = await api.get(`/forma-pagamento`, {
            params: {
                termo: filtro
            }
        });
        console.log(" Categoria Contrato filtrados:", response.data);
        if (response.data && Array.isArray(response.data.content)) {
            return response.data.content;
        } else {
            return [];
        }
    } catch (error) {
        console.log("Erro ao filtrar forma pagamento :", error);
        return [];
    }
};
export const fetchFormaPagamentoByID  = async (formaPagamentoId: string) => {
    try {
        const response = await api.get(`/forma-pagamento/${formaPagamentoId}`);
        const data = response.data;
        return {
            formaPagamento: data,
        };
    } catch (error) {
        console.error("Erro ao buscar Forma dePagamento:", error);
        throw error;
    }
};