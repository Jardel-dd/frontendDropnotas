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