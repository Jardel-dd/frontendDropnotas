'use client';
import '@/app/styles/styledGlobal.css';
import LoadingScreen from '@/app/loading';
import { StatusNota } from './statusClassNfs';
import { Skeleton } from 'primereact/skeleton';
import { Messages } from 'primereact/messages';
import { NfsEntity } from '@/app/entity/NfsEntity';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { limitarText } from '@/app/utils/limitTextDataCompany';
import { Dispatch, SetStateAction, useContext, useRef } from 'react';
import { CancelarNfs, highlightSearchTerm } from '@/app/components/dataTableComponent/DataTableComponent';
import { DataTableSelectable, downloadPdfButton, downloadXmlButton, visualiarButton } from '@/app/components/dataTableComponent/dataTableSelectAll';
import { useIsDesktop, useIsMobile } from '@/app/components/responsiveCelular/responsive';

export function ListarNotaServico({
    listPaginationNotaServico,
    setListPaginationNotaServico,
    loading,
    setLoading,
    searchTerm,
    listarInativos,
    selectedNotas,
    setSelectedNotas
}: {
    listPaginationNotaServico: Record<string, any>;
    setListPaginationNotaServico: Dispatch<SetStateAction<any>>;
    loading: boolean;
    searchTerm: string;
    setLoading: (state: boolean) => void;
    listarInativos: boolean;
    selectedNotas: NfsEntity[];
    setSelectedNotas: Dispatch<SetStateAction<NfsEntity[]>>;
}) {
    const msgs = useRef<Messages>(null);
    const isMobile = useIsMobile();
    const isDesktop = useIsDesktop();
    const { layoutConfig } = useContext(LayoutContext);
    const isDarkMode = layoutConfig.colorScheme === 'dark';
    return (
        <div style={{ marginTop: '0' }}>
            <Messages ref={msgs} className="custom-messages" />
            {loading ? (
                <LoadingScreen loadingText={'Carregando...'} />
            ) : (
                <div>
                    {isDesktop && (
                        <DataTableSelectable<NfsEntity>
                            data={listPaginationNotaServico?.content || []}
                            selected={selectedNotas}
                            onSelectionChange={setSelectedNotas}
                            dataKey="id"
                            loading={loading}
                            isDarkMode={isDarkMode}
                            columns={[
                                {
                                    field: 'numero_rps',
                                    header: 'Número',
                                    body: (data) => (loading ? <Skeleton /> : <span>{highlightSearchTerm(limitarText(data.numero_rps,10), searchTerm)}</span>)
                                },
                                {
                                    field: 'razao_social_cliente',
                                    header: 'Nome Cliente',
                                    body: (data) => <span>{highlightSearchTerm(limitarText(data.razao_social_cliente, 15), searchTerm)}</span>
                                },
                                {
                                    field: 'razao_social_empresa',
                                    header: 'Nome Empresa',
                                    body: (data) => <span>{highlightSearchTerm(limitarText(data.razao_social_empresa, 15), searchTerm)}</span>
                                },
                                {
                                    field: 'data_emissao',
                                    header: 'Data de Emissão',
                                    body: (data) => {
                                        if (!data.data_emissao) return <span>-</span>;
                                        const dataObj = new Date(data.data_emissao);
                                        const dataFormatada = new Intl.DateTimeFormat('pt-BR', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        }).format(dataObj);

                                        return <span>{dataFormatada}</span>;
                                    }
                                },

                                {
                                    field: 'total_valor_servico',
                                    header: 'Valor',
                                    body: (data) => {
                                        const valor = Number(data.total_valor_servico) || 0;
                                        return (
                                            <span>
                                                {new Intl.NumberFormat('pt-BR', {
                                                    style: 'currency',
                                                    currency: 'BRL'
                                                }).format(valor)}
                                            </span>
                                        );
                                    }
                                },

                                {
                                    field: 'status_nota',
                                    header: 'Status',
                                    body: (data) => (
                                        <span style={{ borderRadius: '1REM', width: '90%', display: 'flex', alignItems: 'center' }} className={`px-3 py-1 rounded-2xl text-sm font-medium inline-block ${StatusNota(data.status_nota ?? '')}`}>
                                            <div style={{ display: 'flex', justifyContent: 'center' }}>{data.status_nota}</div>
                                        </span>
                                    )
                                }
                            ]}
                            extraActionsTemplate={(rowData) => (
                                <>
                                    {rowData.status_nota !== 'REJEITADA' && (
                                        <>
                                            {visualiarButton(rowData, msgs)}
                                            {downloadXmlButton(rowData, msgs)}
                                            {downloadPdfButton(rowData, msgs)}
                                            <CancelarNfs nota={rowData} msgs={msgs} />
                                        </>
                                    )}
                                </>
                            )}
                        />
                    )}
                    {isMobile && (
                        <DataTableSelectable<NfsEntity>
                            data={listPaginationNotaServico?.content || []}
                            selected={selectedNotas}
                            onSelectionChange={setSelectedNotas}
                            dataKey="id"
                            loading={loading}
                            isDarkMode={isDarkMode}
                            className="table-mobile"
                            columns={[
                                {
                                    field: 'numero_rps',
                                    header: 'Número',
                                    body: (data) => (loading ? <Skeleton /> : <span>{highlightSearchTerm(limitarText(data.numero_rps, 25), searchTerm)}</span>)
                                },
                                {
                                    field: 'razao_social_cliente',
                                    header: 'Nome Cliente',
                                    body: (data) => <span>{highlightSearchTerm(limitarText(data.razao_social_cliente, 25), searchTerm)}</span>
                                },
                                {
                                    field: 'status_nota',
                                    header: 'Status',
                                    body: (data) => (
                                        <span style={{ borderRadius: '1REM', width: '90%', display: 'flex', alignItems: 'center' }} className={`px-3 py-1 rounded-2xl text-sm font-medium inline-block ${StatusNota(data.status_nota ?? '')}`}>
                                            <div style={{ display: 'flex', justifyContent: 'center' }}>{data.status_nota}</div>
                                        </span>
                                    )
                                }
                            ]}
                            extraActionsTemplate={(rowData) => (
                                <>
                                    {rowData.status_nota !== 'REJEITADA' && (
                                        <>
                                            {visualiarButton(rowData, msgs)}
                                            {downloadXmlButton(rowData, msgs)}
                                            {downloadPdfButton(rowData, msgs)}
                                            <CancelarNfs nota={rowData} msgs={msgs} />
                                        </>
                                    )}
                                </>
                            )}
                        />
                    )}
                </div>
            )}
        </div>
    );
}
export default ListarNotaServico;
