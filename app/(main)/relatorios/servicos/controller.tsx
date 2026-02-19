'use client'
import api from '@/app/services/api';
import { DateRangeValue } from '@/app/components/calendarComponent/dataRangerPicker';

type RelatorioServicosPrestadosParams = {
    idEmpresa?: number | null;
    idCliente?: number | null;
    tipoOrigem?: string | null;
    dataInicio?: string | null;
    dataFim?: string | null;
};

export const mapDateRangeToIso = (dateRange: DateRangeValue) => {
    const [start, end] = dateRange || [];
    const dataInicio = start ? start.toISOString() : null;
    const dataFim = end ? end.toISOString() : null;

    return { dataInicio, dataFim };
};

export const fetchRelatorioServicosPrestados = async (
    params: RelatorioServicosPrestadosParams,
) => {
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

    if (params.dataInicio) {
        searchParams.append('data_hora_inicio', params.dataInicio);
    }

    if (params.dataFim) {
        searchParams.append('data_hora_final', params.dataFim);
    }

    const queryString = searchParams.toString();
    const url = `/relatorios/servicos-prestados/resumo${queryString ? `?${queryString}` : ''}`;

    const response = await api.get(url);
    return response.data;
};