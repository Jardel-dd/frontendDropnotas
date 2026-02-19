import api from '@/app/services/api';

export type RelatorioDashboardParams = {
    idEmpresa?: number | null;
    idCliente?: number | null;
    tipoOrigem?: string | null;
    data_hora_inicio?: string | null;
    data_hora_fim?: string | null;
};
export type DateRange = {
    startDate: Date | null;
    endDate: Date | null;
};
export type DateRangeMobile = {
    startDate: Date | null;
    endDate: Date | null;
};

export const fetchDashboard= async (params: RelatorioDashboardParams) => {
    const searchParams = new URLSearchParams();
    if (params.idEmpresa != null) {
        searchParams.append('id_empresa', String(params.idEmpresa));
    }
    if (params.idCliente != null) {
        searchParams.append('id_cliente', String(params.idCliente));
    }

    if (params.tipoOrigem) {
        searchParams.append('tipo_origem', params.tipoOrigem);
    }

    if (params.data_hora_inicio) {
        searchParams.append('data_hora_inicio', params.data_hora_inicio);
    }

    if (params.data_hora_fim) {
        searchParams.append('data_hora_final', params.data_hora_fim);
    }

    const queryString = searchParams.toString();
    const url = `/relatorios/recebimentos${queryString ? `?${queryString}` : ''}`;

    const response = await api.get(url);
    return response.data;
};
