import { TableCNAEEntity } from "@/app/entity/TableCNAEEntity";
import api from "@/app/services/api";

export const fetchFilteredCnae = async (searchTerm: string) => {
    try {
        const response = await api.get(`/tabela-cnae/buscar?termo=${searchTerm}`);
        if (Array.isArray(response.data.content)) {
            return response.data.content.map((item: { codigo: any; descricao: any; }) => ({
                ...item,
                descricao: `${item.codigo} - ${item.descricao}`
            }));
        } else {
            return [];
        }
    } catch (error) {
        console.error("Erro ao buscar CNAE filtrados:", error);
        return [];
    }
};
export const fetchAllCnae = async () => {
    try {
        const response = await api.get("/tabela-cnae/buscar");
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
        console.error("Erro ao buscar serviços:", error);
        return [];
    }
};
export function findCNAEByCodigo(
  codigo: string | undefined | null,
  cnaeList: TableCNAEEntity[]
): TableCNAEEntity | null {
  if (!codigo || !cnaeList?.length) {
    return null;
  }

  const codigoNormalizado = String(codigo).replace(/\D/g, ""); 

  const found = cnaeList.find(cnae => {
    const codigoCnaeNormalizado = String(cnae.codigo).replace(/\D/g, "");
    return codigoCnaeNormalizado === codigoNormalizado;
  });

  return found ?? null;
}
export const listTheCNAE = async (searchTerm: string): Promise<TableCNAEEntity[]> => {
    try {
        const response = await api.get(`/tabela-cnae/buscar?termo=${searchTerm}`);
        if (Array.isArray(response.data.content)) {
            return response.data.content.map((item: { codigo: any; descricao: any }) => ({
                ...item,
                descricao: `${item.codigo} - ${item.descricao}`,
            }));
        } else {
            return [];
        }
    } catch (error) {
        console.error("Erro ao buscar CNAE filtrados:", error);
        return [];
    }
};
