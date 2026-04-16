import { TableService } from "@/app/entity/TableServiceEntity";
import api from "@/app/services/api";

export const fetchFilteredTabelaServico = async (
  searchTerm: string
): Promise<TableService[]> => {
  try {
    const response = await api.get(`/tabela-servico/buscar?termo=${searchTerm}`);

    if (Array.isArray(response.data.content)) {
      return response.data.content.map((item: any) =>
        new TableService({
          id: item.id,
          codigo: String(item.codigo ?? ''),
          descricao: `${item.codigo} - ${item.descricao}`,
        })
      );
    }

    return [];
  } catch (error) {
    console.error("Erro ao buscar serviços filtrados:", error);
    return [];
  }
};
export const fetchAllTabelaServico = async (): Promise<TableService[]> => {
  try {
    const response = await api.get(`/tabela-servico/buscar`);

    if (Array.isArray(response.data.content)) {
      return response.data.content.map((item: any) =>
        new TableService({
          id: item.id,
          codigo: String(item.codigo ?? ''),
          descricao: `${item.codigo} - ${item.descricao}`,
        })
      );
    }

    return [];
  } catch (error) {
    console.error("Erro ao buscar serviços:", error);
    return [];
  }
};
