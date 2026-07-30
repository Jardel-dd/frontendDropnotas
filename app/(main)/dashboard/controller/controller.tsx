'use client'
import api from '@/app/services/api';
import { asRecord, getNumberFromPaths, NotaFiscalResumo, RelatorioNotaFiscalParams, STATUS_AUTORIZADAS_PATHS, STATUS_CANCELADAS_PATHS, STATUS_PENDENTES_PATHS, STATUS_REJEITADAS_PATHS, TOTAL_NOTAS_PATHS, VALOR_CANCELADOS_PATHS, VALOR_DESCONTOS_PATHS, VALOR_TOTAL_PATHS } from '../types/types';
export const normalizeRelatorioNotaFiscalResumo = (payload: unknown): NotaFiscalResumo => {
    const source = asRecord(payload);
    const canceladas = getNumberFromPaths(source, STATUS_CANCELADAS_PATHS) ?? 0;
    const rejeitadas = getNumberFromPaths(source, STATUS_REJEITADAS_PATHS) ?? 0;
    const autorizadas = getNumberFromPaths(source, STATUS_AUTORIZADAS_PATHS) ?? 0;
    const pendentes = getNumberFromPaths(source, STATUS_PENDENTES_PATHS) ?? 0;
    const totalNotas = getNumberFromPaths(source, TOTAL_NOTAS_PATHS) ?? (canceladas + rejeitadas + autorizadas + pendentes);
    const valorTotal = getNumberFromPaths(source, VALOR_TOTAL_PATHS) ?? 0;
    const descontos = getNumberFromPaths(source, VALOR_DESCONTOS_PATHS) ?? 0;
    const valorCancelado = getNumberFromPaths(source, VALOR_CANCELADOS_PATHS) ?? 0;
    return {
        raw: payload,
        totalNotas,
        status: {
            canceladas,
            rejeitadas,
            autorizadas,
            pendentes
        },
        valores: {
            valorTotal,
            descontos,
            cancelados: valorCancelado
        }
    };
};
export const fetchRelatorioNotaFiscalResumo = async (
    params: RelatorioNotaFiscalParams,
) => {
    const searchParams = new URLSearchParams();

    if (params.idEmpresa != null) {
        searchParams.append('id_empresa', String(params.idEmpresa));
    }

    if (params.idCliente != null) {
        searchParams.append('id_cliente', String(params.idCliente));
    }

    if (params.idServico != null) {
        searchParams.append('id_servico', String(params.idServico));
    }

    if (params.dataInicio) {
        searchParams.append('data_hora_inicio', params.dataInicio);
    }

    if (params.dataFim) {
        searchParams.append('data_hora_final', params.dataFim);
    }

    const queryString = searchParams.toString();
    const url = `/relatorios/nfse/resumo${queryString ? `?${queryString}` : ''}`;
    const response = await api.get(url);

    return normalizeRelatorioNotaFiscalResumo(response.data);
};
