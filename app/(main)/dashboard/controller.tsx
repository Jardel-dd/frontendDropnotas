import axios from 'axios';
import api from '@/app/services/api';
import { RelatorioDashboardParams } from './types';


export const fetchDashboard = async (params: RelatorioDashboardParams) => {
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
    try {
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 403) {
                throw new Error('Não foi possivel carrega estas informações.');
            }
            throw new Error(
                typeof error.response?.data?.message === 'string'
                    ? error.response.data.message
                    : 'Não foi possível carregar os dados do dashboard.'
            );
        }
        throw new Error('Não foi possível carregar os dados do dashboard.');
    }
};
