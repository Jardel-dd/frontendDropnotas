import api from "@/app/services/api";
import { TableCodigoNBSEntity } from "@/app/entity/TableCodigoNBS";

export const fetchFilteredCodigoNBS= async (searchTerm: string) => {
    try {
        const response = await api.get(`/tabela-nbs/buscar?termo=${searchTerm}`);
        if (Array.isArray(response.data.content)) {
            return response.data.content.map((item: { codigo: any; descricao: any; }) => ({
                ...item,
                descricao: `${item.codigo} - ${item.descricao}`
            }));
        } else {
            return [];
        }
    } catch (error) {
        console.error("Erro ao buscar Codigo NBS filtrados:", error);
        return [];
    }
};
export const fetchAllCodigoNBS = async () => {
    try {
        const response = await api.get("/tabela-nbs/buscar");
        if (response.data && Array.isArray(response.data.content)) {
            return response.data.content.map((item: { codigo: any; descricao: any; }) => ({
                ...item,
                codigo: String(item.codigo), 
                descricao: `${item.codigo} - ${item.descricao}`
            }));
        } else {
            return [];
        }
    } catch (error) {
        console.error("Erro ao buscar Codigo NB :", error);
        return [];
    }
};
export function findCodigoNBS (
  codigo: string | undefined | null,
  codigoNBSList: TableCodigoNBSEntity[]
): TableCodigoNBSEntity | null {
  if (!codigo || !codigoNBSList?.length) {
    return null;
  }
  const codigoNormalizado = String(codigo).replace(/\D/g, ""); 
  const found = codigoNBSList.find(classificacao => {
    const codigoNBSNormalizado = String(classificacao.codigo).replace(/\D/g, "");
    return codigoNBSNormalizado === codigoNormalizado;
  });
  return found ?? null;
}
export const listTheCodigoNBS  = async (searchTerm: string): Promise<TableCodigoNBSEntity[]> => {
    try {
        const response = await api.get(`/tabela-nbs/buscar?termo=${searchTerm}`);
        if (Array.isArray(response.data.content)) {
            return response.data.content.map((item: { codigo: any; descricao: any }) => ({
                ...item,
                descricao: `${item.codigo} - ${item.descricao}`,
            }));
        } else {
            return [];
        }
    } catch (error) {
        console.error("Erro ao buscar Classificacao tributaria filtrados:", error);
        return [];
    }
};
