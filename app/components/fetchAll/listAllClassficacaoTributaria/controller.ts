import api from "@/app/services/api";
import { TableClassificacaoTributariaEntity } from "@/app/entity/TableClassificacaoTributariaEntity";

export const fetchFilteredClassificacaoTributaria= async (searchTerm: string) => {
    try {
        const response = await api.get(`/tabela-classificacao-tributaria/buscar?busca=${searchTerm}`);
        if (Array.isArray(response.data.content)) {
            return response.data.content.map((item: { codigo: any; descricao: any; }) => ({
                ...item,
                descricao: `${item.codigo} - ${item.descricao}`
            }));
        } else {
            return [];
        }
    } catch (error) {
        console.error("Erro ao buscar Classificacao Tributaria filtrados:", error);
        return [];
    }
};
export const fetchAllClassificacaoTributaria = async (searchTerm?: string) => {
    try {
        const query = searchTerm?.trim()
            ? `?termo=${encodeURIComponent(searchTerm.trim())}`
            : '';
        const response = await api.get(`/tabela-classificacao-tributaria/buscar${query}`);
        if (response.data && Array.isArray(response.data.content)) {
            return response.data.content.map((item: { codigo: any; descricao: any; }) => ({
                ...item,
                codigo: String(item.codigo ?? ''), 
                descricao: `${item.codigo} - ${item.descricao}`
            }));
        } else {
            return [];
        }
    } catch (error) {
        console.error("Erro ao buscar :", error);
        return [];
    }
};
export function findClassificacaoTributariaByCodigo(
  codigo: string | undefined | null,
  classificacaoTributariaList: TableClassificacaoTributariaEntity[]
): TableClassificacaoTributariaEntity | null {
  if (!codigo || !classificacaoTributariaList?.length) {
    return null;
  }

  const codigoNormalizado = String(codigo).replace(/\D/g, ""); 

  const found = classificacaoTributariaList.find(classificacao => {
    const codigoClassificacaoTributariaNormalizado = String(classificacao.codigo).replace(/\D/g, "");
    return codigoClassificacaoTributariaNormalizado === codigoNormalizado;
  });

  return found ?? null;
}
export const listTheClassificacaoTributaria = async (searchTerm: string): Promise<TableClassificacaoTributariaEntity[]> => {
    try {
        const trimmedSearchTerm = searchTerm.trim();
        const query = trimmedSearchTerm
            ? `?termo=${encodeURIComponent(trimmedSearchTerm)}`
            : '';
        const response = await api.get(`/classificacao-tributaria/buscar${query}`);
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
