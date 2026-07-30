import { CompanyEntity } from "@/app/entity/CompanyEntity";
import { PessoaEntity } from "@/app/entity/PessoaEntity";
import { ServiceEntity } from "@/app/entity/ServiceEntity";
import { DateRangeValue } from "@/app/components/calendarComponent/types/types";

export type RelatorioNotaFiscalParams = {
    idEmpresa?: number | null;
    idCliente?: number | null;
    idServico?: number | null;
    dataInicio?: string | null;
    dataFim?: string | null;
};
export const asRecord = (value: unknown): Record<string, unknown> | null => (
    value !== null && typeof value === 'object' && !Array.isArray(value)
        ? value as Record<string, unknown>
        : null
);
export const getNestedValue = (source: Record<string, unknown> | null, path: string) =>
path.split('.').reduce<unknown>((currentValue, key) => asRecord(currentValue)?.[key], source);

export const normalizeNumber = (value: unknown): number | null => {
    if (typeof value === 'number') {
        return Number.isFinite(value) ? value : null;
    }

    if (typeof value === 'string') {
        const normalizedValue = value.trim();

        if (!normalizedValue) {
            return null;
        }

        const parsedValue = Number(
            normalizedValue.includes(',')
                ? normalizedValue.replace(/\./g, '').replace(',', '.')
                : normalizedValue
        );

        return Number.isFinite(parsedValue) ? parsedValue : null;
    }

    return null;
};
export const getNumberFromPaths = (source: Record<string, unknown> | null, paths: string[]) => {
    for (const path of paths) {
        const value = normalizeNumber(getNestedValue(source, path));

        if (value !== null) {
            return value;
        }
    }

    return null;
};
export const mapDateRangeToResumoParams = (dateRange: DateRangeValue) => {
    const [start, end] = dateRange || [];
    return {
        dataInicio: start ? start.startOf('day').format('YYYY-MM-DDTHH:mm:ss') : null,
        dataFim: end ? end.endOf('day').format('YYYY-MM-DDTHH:mm:ss') : null
    };
};
export type NotaFiscalResumo = {
    raw: unknown;
    totalNotas: number;
    status: {
        canceladas: number;
        rejeitadas: number;
        autorizadas: number;
        pendentes: number;
    };
    valores: {
        valorTotal: number;
        descontos: number;
        cancelados: number;
    };
};
export type ReportFilters = {
    dateRange: DateRangeValue;
    selectedCompany: CompanyEntity | null;
    selectedPessoa: PessoaEntity | null;
    selectedServico: ServiceEntity | null;
};
export type ValueChartItem = {
    label: string;
    value: number;
    color: string;
};
export const EMPTY_DATE_RANGE: DateRangeValue = [null, null];
export  const countFormatter = new Intl.NumberFormat('pt-BR');
export const TOTAL_NOTAS_PATHS = [
    'totalNotas',
    'total_notas',
    'quantidadeNotas',
    'quantidade_notas',
    'total',
    'resumo.totalNotas',
    'resumo.total_notas',
    'resumo.total',
    'statusDasNotas.total',
    'status_das_notas.total',
    'statusNotas.total'
];
export const STATUS_CANCELADAS_PATHS = [
    'cancelados',
    'canceladas',
    'status.cancelados',
    'status.canceladas',
    'statusDasNotas.cancelados',
    'statusDasNotas.canceladas',
    'status_das_notas.cancelados',
    'status_das_notas.canceladas',
    'statusNotas.cancelados',
    'statusNotas.canceladas',
    'resumo.cancelados',
    'resumo.canceladas',
    'resumo.status.cancelados',
    'resumo.status.canceladas',
    'totais.cancelados',
    'totais.canceladas',
    'totalCancelados',
    'totalCanceladas'
];
export const STATUS_REJEITADAS_PATHS = [
    'rejeitas',
    'rejeitadas',
    'rejeitados',
    'status.rejeitas',
    'status.rejeitadas',
    'status.rejeitados',
    'statusDasNotas.rejeitas',
    'statusDasNotas.rejeitadas',
    'status_das_notas.rejeitas',
    'status_das_notas.rejeitadas',
    'statusNotas.rejeitas',
    'statusNotas.rejeitadas',
    'resumo.rejeitas',
    'resumo.rejeitadas',
    'resumo.status.rejeitas',
    'resumo.status.rejeitadas',
    'totais.rejeitas',
    'totais.rejeitadas',
    'totalRejeitas',
    'totalRejeitadas'
];
export const STATUS_AUTORIZADAS_PATHS = [
    'autorizadas',
    'autorizados',
    'status.autorizadas',
    'status.autorizados',
    'statusDasNotas.autorizadas',
    'status_das_notas.autorizadas',
    'statusNotas.autorizadas',
    'resumo.autorizadas',
    'resumo.status.autorizadas',
    'totais.autorizadas',
    'totalAutorizadas'
];
export const STATUS_PENDENTES_PATHS = [
    'pendentes',
    'status.pendentes',
    'statusDasNotas.pendentes',
    'status_das_notas.pendentes',
    'statusNotas.pendentes',
    'resumo.pendentes',
    'resumo.status.pendentes',
    'totais.pendentes',
    'totalPendentes'
];
export const VALOR_TOTAL_PATHS = [
    'valorTotal',
    'valor_total',
    'valores.valorTotal',
    'valores.valor_total',
    'valores.total',
    'resumo.valorTotal',
    'resumo.valor_total',
    'resumo.valores.valorTotal',
    'resumo.valores.valor_total',
    'totais.valorTotal',
    'totais.valor_total',
    'valorTotalBruto',
    'valor_total_bruto',
    'totalValorNotas',
    'total_valor_notas'
];
export const VALOR_DESCONTOS_PATHS = [
    'descontos',
    'valorDescontos',
    'valor_descontos',
    'valorTotalDescontos',
    'valor_total_descontos',
    'valores.descontos',
    'valores.valorDescontos',
    'valores.valor_descontos',
    'resumo.descontos',
    'resumo.valores.descontos',
    'resumo.valores.valorDescontos',
    'totais.descontos'
];
export const VALOR_CANCELADOS_PATHS = [
    'valorCancelado',
    'valor_cancelado',
    'valorCancelados',
    'valor_cancelados',
    'valorTotalCancelados',
    'valor_total_cancelados',
    'valores.cancelados',
    'valores.valorCancelado',
    'valores.valor_cancelado',
    'valores.valorCancelados',
    'valores.valor_cancelados',
    'resumo.valores.cancelados',
    'resumo.valores.valorCancelado',
    'resumo.valores.valor_cancelado',
    'totais.valorCancelado',
    'totais.valor_cancelado'
];
