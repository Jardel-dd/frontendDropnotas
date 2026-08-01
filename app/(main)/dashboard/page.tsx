'use client';
import './styled.css';
import dayjs from 'dayjs';
import '@/app/styles/styledGlobal.css';
import { Chart } from 'primereact/chart';
import LoadingScreen from '@/app/loading';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { PessoaEntity } from '@/app/entity/PessoaEntity';
import React, { useEffect, useRef, useState } from 'react';
import { CompanyEntity } from '@/app/entity/CompanyEntity';
import { ServiceEntity } from '@/app/entity/ServiceEntity';
import PieChart from '@/app/components/chartsComponent/charts';
import { useTheme } from '@/app/components/isDarkMode/isDarkMode';
import { Messages } from '@/app/components/messages/GlobalMessages';
import { formatCurrency } from '@/app/shared/traducaoBr/formatCurrency';
import { DateRangeValue, todayRange } from '@/app/components/calendarComponent/types/types';
import { DropdownSearch } from '@/app/shared/include/dropdown/searchDropdownAll';
import { DateRangePicker } from '@/app/components/calendarComponent/dataRangerPicker';
import { useIsDesktop, useIsMobile } from '@/app/components/responsiveCelular/responsive';
import { fetchFilteredPessoa, listThePessoas } from '../cadastro/pessoas/controller/controller';
import { FilterOverlay } from '@/app/components/buttonsComponent/btn-FilterComponent/Btn-Filter';
import { fetchFilteredService, listTheService } from '../cadastro/servicos/controller/controller';
import { fetchFilteredEmpresa, listTheEmpresa } from '../configuracoes/empresas/controller/controller';
import { countFormatter, EMPTY_DATE_RANGE, mapDateRangeToResumoParams, NotaFiscalResumo, ReportFilters, ValueChartItem } from './types/types';
import { fetchRelatorioNotaFiscalResumo } from './controller/controller';

const renderEmptyChartState = (icon: string, title: string, description: string) => (
    <div className="nota-fiscal-empty-state">
        <i className={icon} />
        <strong>{title}</strong>
        <span>{description}</span>
    </div>
);
const NotaFiscalValueBarChart: React.FC<{
    items: ValueChartItem[];
    isDarkMode: boolean;
}> = ({ items, isDarkMode }) => {
const visibleItems = items.filter((item) => item.value > 0);
    if (visibleItems.length === 0) {
        return (
            <div className="card nota-fiscal-chart-card nota-fiscal-chart-card-custom">
                <div className="nota-fiscal-chart-header">
                    <div>
                        <h3>Comparativo financeiro</h3>
                    </div>
                    <p>Veja rapidamente quanto foi faturado, descontado e cancelado.</p>
                </div>
                {renderEmptyChartState(
                    'pi pi-chart-bar',
                    'Sem dados financeiros',
                    'Aplique um periodo ou ajuste os filtros para carregar os valores.'
                )}
            </div>
        );
    }
    const labelColor = isDarkMode ? '#cbd5e1' : '#475569';
    const gridColor = isDarkMode ? 'rgba(148, 163, 184, 0.16)' : 'rgba(148, 163, 184, 0.24)';
    return (
        <div className="card nota-fiscal-chart-card nota-fiscal-chart-card-custom">
            <div className="nota-fiscal-chart-header">
                <div>
                    <h3>Comparativo financeiro</h3>
                </div>
                <p>Veja rapidamente quanto foi faturado, descontado e cancelado.</p>
            </div>

            <div className="nota-fiscal-bar-chart-shell">
                <Chart
                    type="bar"
                    plugins={[ChartDataLabels]}
                    data={{
                        labels: visibleItems.map((item) => item.label),
                        datasets: [
                            {
                                data: visibleItems.map((item) => item.value),
                                backgroundColor: visibleItems.map((item) => item.color),
                                borderRadius: 999,
                                borderSkipped: false,
                                barThickness: 24
                            }
                        ]
                    }}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        indexAxis: 'y',
                        animation: false,
                        plugins: {
                            legend: {
                                display: false
                            },
                            tooltip: {
                                callbacks: {
                                    label: (context: any) => `${context.label}: ${formatCurrency(Number(context.parsed?.x ?? 0))}`
                                }
                            },
                            datalabels: {
                                color: labelColor,
                                anchor: 'end',
                                align: 'end',
                                offset: 8,
                                clamp: true,
                                font: {
                                    weight: 'bold'
                                },
                                formatter: (value: number) => formatCurrency(value)
                            }
                        },
                        scales: {
                            x: {
                                beginAtZero: true,
                                grid: {
                                    color: gridColor
                                },
                                ticks: {
                                    color: labelColor,
                                    callback: (value: string | number) => {
                                        const parsedValue = Number(value);
                                        return Number.isFinite(parsedValue) ? formatCurrency(parsedValue) : value;
                                    }
                                }
                            },
                            y: {
                                grid: {
                                    display: false
                                },
                                ticks: {
                                    color: labelColor,
                                    font: {
                                        weight: 'bold'
                                    }
                                }
                            }
                        }
                    }}
                    style={{ height: '100%', width: '100%' }}
                />
            </div>
        </div>
    );
};
const RelatoriosNotaFiscal: React.FC = () => {
    const { isDarkMode } = useTheme();
    const isMobile = useIsMobile();
    const isDesktop = useIsDesktop();
    const showDesktopToolbar = isDesktop || !isMobile;
    const msgs = useRef<Messages | null>(null);
    const [loading, setLoading] = useState(false);
    const [relatorio, setRelatorio] = useState<NotaFiscalResumo | null>(null);
    const [dateRange, setDateRange] = useState<DateRangeValue>(todayRange);
    const [selectedCompany, setSelectedCompany] = useState<CompanyEntity | null>(null);
    const [selectedPessoa, setSelectedPessoa] = useState<PessoaEntity | null>(null);
    const [selectedServico, setSelectedServico] = useState<ServiceEntity | null>(null);
    const [draftSelectedCompany, setDraftSelectedCompany] = useState<CompanyEntity | null>(null);
    const [draftSelectedPessoa, setDraftSelectedPessoa] = useState<PessoaEntity | null>(null);
    const [draftSelectedServico, setDraftSelectedServico] = useState<ServiceEntity | null>(null);

    const search = async (filters: ReportFilters) => {
        setLoading(true);
        try {
            msgs.current?.clear();

            const { dataInicio, dataFim } = mapDateRangeToResumoParams(filters.dateRange);
            const resultado = await fetchRelatorioNotaFiscalResumo({
                idEmpresa: filters.selectedCompany?.id ?? null,
                idCliente: filters.selectedPessoa?.id ?? null,
                idServico: filters.selectedServico?.id ?? null,
                dataInicio,
                dataFim
            });

            setRelatorio(resultado);
        } catch (error) {
            setRelatorio(null);
            msgs.current?.show({
                severity: 'error',
                summary: 'Atencao:',
                detail: error instanceof Error ? error.message : 'Nao foi possivel carregar o relatorio de NFS-e.'
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const loadInitialResumo = async () => {
            setLoading(true);

            try {
                const { dataInicio, dataFim } = mapDateRangeToResumoParams(todayRange);
                const resultado = await fetchRelatorioNotaFiscalResumo({
                    dataInicio,
                    dataFim
                });
                setRelatorio(resultado);
            } catch (error) {
                setRelatorio(null);
                msgs.current?.show({
                    severity: 'error',
                    summary: 'Atencao:',
                    detail: error instanceof Error ? error.message : 'Nao foi possivel carregar o relatorio de NFS-e.'
                });
            } finally {
                setLoading(false);
            }
        };

        void loadInitialResumo();
    }, []);

    const syncDraftFilters = () => {
        setDraftSelectedCompany(selectedCompany);
        setDraftSelectedPessoa(selectedPessoa);
        setDraftSelectedServico(selectedServico);
    };

    const handleApplyFilters = () => {
        const nextFilters: ReportFilters = {
            dateRange,
            selectedCompany: draftSelectedCompany,
            selectedPessoa: draftSelectedPessoa,
            selectedServico: draftSelectedServico
        };

        setSelectedCompany(draftSelectedCompany);
        setSelectedPessoa(draftSelectedPessoa);
        setSelectedServico(draftSelectedServico);
        void search(nextFilters);
    };

    const handleClearFilters = () => {
        const nextFilters: ReportFilters = {
            dateRange,
            selectedCompany: null,
            selectedPessoa: null,
            selectedServico: null
        };

        setSelectedCompany(null);
        setSelectedPessoa(null);
        setSelectedServico(null);
        setDraftSelectedCompany(null);
        setDraftSelectedPessoa(null);
        setDraftSelectedServico(null);
        void search(nextFilters);
    };

    const handleDateRangeSearch = (inicio: Date, fim: Date) => {
        const nextDateRange: DateRangeValue = [dayjs(inicio), dayjs(fim)];

        setDateRange(nextDateRange);
        void search({
            dateRange: nextDateRange,
            selectedCompany,
            selectedPessoa,
            selectedServico
        });
    };
    const handleDateRangeClear = () => {
        setDateRange(EMPTY_DATE_RANGE);
        void search({
            dateRange: EMPTY_DATE_RANGE,
            selectedCompany,
            selectedPessoa,
            selectedServico
        });
    };
    const totalNotas = relatorio?.totalNotas ?? 0;
    const valorTotal = relatorio?.valores.valorTotal ?? 0;
    const valorDescontos = relatorio?.valores.descontos ?? 0;
    const valorCancelado = relatorio?.valores.cancelados ?? 0;

    const overviewCards = [
        {
            label: 'Total de notas',
            value: countFormatter.format(totalNotas),
            accent: '#0f172a'
        },
        {
            label: 'Autorizadas',
            value: countFormatter.format(relatorio?.status.autorizadas ?? 0),
            accent: '#10b981'
        },
        {
            label: 'Pendentes',
            value: countFormatter.format(relatorio?.status.pendentes ?? 0),
            accent: '#f59e0b'
        },
        {
            label: 'Rejeitadas',
            value: countFormatter.format(relatorio?.status.rejeitadas ?? 0),
            accent: '#fb7185'
        },
        {
            label: 'Canceladas',
            value: countFormatter.format(relatorio?.status.canceladas ?? 0),
            accent: '#ef4444'
        },
        {
            label: 'Valor total',
            value: formatCurrency(valorTotal),
            accent: '#2563eb'
        },
        {
            label: 'Valor cancelado',
            value: formatCurrency(valorCancelado),
            accent: '#e11d48'
        },
        {
            label: 'Descontos',
            value: formatCurrency(valorDescontos),
            accent: '#06b6d4'
        },
        
    ];
    const valueChartItems: ValueChartItem[] = [
        {
            label: 'Valor total',
            value: valorTotal,
            color: '#2563eb'
        },
        {
            label: 'Descontos',
            value: valorDescontos,
            color: '#06b6d4'
        },
        {
            label: 'Cancelados',
            value: valorCancelado,
            color: '#e11d48'
        }
    ];
    const filterOverlayContent = (
        <div className="grid formgrid nota-fiscal-filter-overlay-content">
            <div className="col-12">
                <DropdownSearch<CompanyEntity>
                    id="selectedEmpresa"
                    selectedItem={draftSelectedCompany}
                    onItemChange={setDraftSelectedCompany}
                    fetchAllItems={listTheEmpresa}
                    fetchFilteredItems={fetchFilteredEmpresa}
                    optionLabel="razao_social"
                    placeholder="Selecione a empresa"
                    topLabel="Empresa:"
                    showTopLabel
                    autoLoadAndSelectSingle={false}
                />
            </div>

            <div className="col-12">
                <DropdownSearch<PessoaEntity>
                    id="selectedPessoa"
                    selectedItem={draftSelectedPessoa}
                    onItemChange={setDraftSelectedPessoa}
                    fetchAllItems={listThePessoas}
                    fetchFilteredItems={fetchFilteredPessoa}
                    optionLabel="razao_social"
                    placeholder="Selecione o cliente"
                    topLabel="Cliente:"
                    showTopLabel
                    autoLoadAndSelectSingle={false}
                />
            </div>

            <div className="col-12">
                <DropdownSearch<ServiceEntity>
                    id="selectedServico"
                    selectedItem={draftSelectedServico}
                    onItemChange={setDraftSelectedServico}
                    fetchAllItems={listTheService}
                    fetchFilteredItems={fetchFilteredService}
                    optionLabel="descricao"
                    placeholder="Selecione o servico"
                    topLabel="Servico:"
                    showTopLabel
                    autoLoadAndSelectSingle={false}
                />
            </div>
        </div>
    );

    return (
        <div className="p-fluid">
            <Messages ref={msgs} className="custom-messages" />

            <div className="card styled-container-main-all-routes w-full nota-fiscal-card-shell">
                {loading && (
                    <div className="nota-fiscal-loading-overlay">
                        <LoadingScreen
                            loadingText="Atualizando relatorio..."
                            fullScreen={false}
                            overlayOpacity={0.88}
                        />
                    </div>
                )}

                <div className="scrollable-container nota-fiscal-report-shell">
                    {isMobile && (
                        <div className="grid formgrid flex justify-content-between w-full nota-fiscal-toolbar-mobile">
                            <div className="col-10 mb-0 lg:col-10">
                                <DateRangePicker
                                    initialPeriodo={[todayRange[0]!.toDate(), todayRange[1]!.toDate()]}
                                    showTopLabel
                                    topLabel="Filtrar por data:"
                                    onClear={handleDateRangeClear}
                                    onBuscar={handleDateRangeSearch}
                                />
                            </div>

                            <div className="col-2 mb-0 lg:col-2">
                                <div className="container-BTN-Filter-Created nota-fiscal-mobile-actions">
                                    <FilterOverlay onOpen={syncDraftFilters} onApply={handleApplyFilters} onClear={handleClearFilters}>
                                        {filterOverlayContent}
                                    </FilterOverlay>
                                </div>
                            </div>
                        </div>
                    )}
                    {showDesktopToolbar && !isMobile && (
                        <div className="grid formgrid nota-fiscal-toolbar-desktop">
                            <div style={{width:"220px"}}>
                                <DateRangePicker
                                    initialPeriodo={[todayRange[0]!.toDate(), todayRange[1]!.toDate()]}
                                    showTopLabel
                                    topLabel="Filtrar por data:"
                                    onClear={handleDateRangeClear}
                                    onBuscar={handleDateRangeSearch}
                                />
                            </div>

                            <div className="Container-Btn-Filter-Desktop nota-fiscal-filter-trigger-desktop">
                                <FilterOverlay onOpen={syncDraftFilters} onApply={handleApplyFilters} onClear={handleClearFilters}>
                                    {filterOverlayContent}
                                </FilterOverlay>
                            </div>
                        </div>
                    )}
                    <div className="nota-fiscal-content-wrapper">
                        <section className="nota-fiscal-section">
                            <div className="nota-fiscal-section-header">
                                <div>
                                    <h2>Indicadores principais</h2>
                                </div>
                            </div>
                            <div className="nota-fiscal-metric-grid">
                                {overviewCards.map((card) => (
                                    <div
                                        key={card.label}
                                        className="card nota-fiscal-metric-card"
                                        style={{ '--metric-accent': card.accent } as React.CSSProperties}>
                                        <span className="nota-fiscal-metric-label">{card.label}</span>
                                        <strong className="nota-fiscal-metric-value">{card.value}</strong>
                                    </div>
                                ))}
                            </div>
                        </section>
                        <section className="nota-fiscal-section">
                            <div className="nota-fiscal-chart-grid">
                                <PieChart
                                    title="Status NFS-e"
                                    type="doughnut"
                                    labels={['Autorizadas', 'Pendentes', 'Rejeitadas', 'Canceladas']}
                                    values={[
                                        relatorio?.status.autorizadas ?? 0,
                                        relatorio?.status.pendentes ?? 0,
                                        relatorio?.status.rejeitadas ?? 0,
                                        relatorio?.status.canceladas ?? 0
                                    ]}
                                    legendPosition="bottom"
                                    showPercentOnTooltip
                                    percentDecimals={1}
                                    disableAnimation
                                    className="nota-fiscal-chart-card"
                                    heightPx={320}
                                    emptyState={renderEmptyChartState(
                                        'pi pi-chart-pie',
                                        'Sem dados de status',
                                        'Tente ampliar o periodo ou limpar os filtros para visualizar a distribuicao.'
                                    )}
                                />
                                <NotaFiscalValueBarChart items={valueChartItems} isDarkMode={isDarkMode} />
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default RelatoriosNotaFiscal;
