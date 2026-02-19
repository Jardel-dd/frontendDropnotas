import api from "@/app/services/api";
import { fetchAllCnae } from "../listAllCnae/controller";
import { UsuarioContaEntity } from "@/app/entity/UsuarioContaEntity";
import { CompanyEntity } from "@/app/entity/CompanyEntity";

export const listTheCompany = async () => {
    try {
        const response = await api.get('/empresa');
        if (response.data && Array.isArray(response.data.content)) {
            return response.data.content;
        } else {
            return [];
        }
    } catch (error) {
        console.error("Erro ao buscar Company contrato:", error);
        return [];
    }
};
export const fetchCompanyByID = async (empresaId: string) => {
    try {
        const response = await api.get(`/empresa/${empresaId}`);
        const data = response.data;
        console.log("empresa", data)
        const idsResponse = await api.get("/usuario-conta");
        let usuariosConta = [];
        if (Array.isArray(idsResponse.data)) {
            usuariosConta = idsResponse.data;
        } else if (idsResponse.data && Array.isArray(idsResponse.data.content)) {
            usuariosConta = idsResponse.data.content;
        }
        const idsData: UsuarioContaEntity[] = usuariosConta.map((user: any) => ({
            id: user.id,
            nome: user.nome || "Nome não disponível",
        }));
        let selectedUsers: UsuarioContaEntity[] = [];
        if (Array.isArray(data.id_usuarios_acesso)) {
            selectedUsers = idsData.filter(user => data.id_usuarios_acesso.includes(user.id));
        }
        const cnaeResponse = await fetchAllCnae();
        let selectedCnae = null;
        if (data.cnae_fiscal) {
            selectedCnae = cnaeResponse.find(
                (item: { codigo: string }) => item.codigo === data.cnae_fiscal
            ) || null;
        }
        return {
            empresa: data,
            userConta: idsData,
            selectedUserConta: selectedUsers,
            selectedCnae: selectedCnae,
        };
    } catch (error) {
        console.error("Erro ao buscar empresa, perfis ou CNAEs:", error);
        throw error;
    }
};
export const fetchFilteredCompany = async (filtro: string) => {
    try {
        const response = await api.get(`/empresa`, {
            params: {
                termo: filtro
            }
        });
        console.log(" Empresa filtradas:", response.data);
        if (response.data && Array.isArray(response.data.content)) {
            return response.data.content;
        } else {
            return [];
        }
    } catch (error) {
        return [];
    }
};
export const fetchAllCompany = async (): Promise<CompanyEntity[]> => {
    try {
        const response = await api.get('/empresa');
        return response.data.content || [];
    } catch (error) {
        console.error("Erro ao buscar todas as vendedor:", error);
        return [];
    }
};
