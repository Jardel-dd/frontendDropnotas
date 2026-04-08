import api from "@/app/services/api";

export interface ListComissoesFilters {
    id_vendedor?: number | null;
    tipo_origem?: string | null;
    comissao_fechada?: boolean | null;
    data_inicio?: string | null;
    data_fim?: string | null;
}

const buildComissoesQuery = (
    listPaginationComissoes: Record<string, any>,
    listarInativos: boolean,
    searchTerm: string,
    filters: ListComissoesFilters = {}
) => {
    const params = new URLSearchParams();
    const pageNumber = listPaginationComissoes.pageable.pageNumber ?? 0;
    const pageSize = listPaginationComissoes.pageable.pageSize ?? 10;

    params.set('page', String(pageNumber));
    params.set('size', String(pageSize));
    params.append('sort', '');

    if (searchTerm.trim()) {
        params.set('termo', searchTerm.trim());
    }
    if (listarInativos) {
        params.set('listarInativos', 'true');
    }
    if (filters.id_vendedor != null) {
        params.set('id_vendedor', String(filters.id_vendedor));
    }
    if (filters.tipo_origem) {
        params.set('tipo_origem', filters.tipo_origem);
    }
    if (filters.comissao_fechada != null) {
        params.set('comissao_fechada', String(filters.comissao_fechada));
    }
    if (filters.data_inicio) {
        params.set('data_inicio', filters.data_inicio);
    }
    if (filters.data_fim) {
        params.set('data_fim', filters.data_fim);
    }

    return params.toString();
};
export const listComissoes= async (
    listPaginationComissoes: Record<string, any>,
    listarInativos: boolean,
    setLoading: (state: boolean) => void,
    searchTerm: string,
    filters: ListComissoesFilters = {}
) => {
    setLoading(true);
    try {
        const query = buildComissoesQuery(listPaginationComissoes, listarInativos, searchTerm, filters);
        const response = await api.get(`/financeiro/comissoes?${query}`);
        return response.data;
    } finally {
        setLoading(false);
    }
};
