'use client';
import '@/app/styles/styledGlobal.css';
import LoadingScreen from '@/app/loading';
import { Messages } from 'primereact/messages';
import { ComissaoEntity } from '@/app/entity/comissoesEntity';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { limitarText } from '@/app/utils/limitTextDataCompany';
import { Dispatch, SetStateAction, useContext, useRef } from 'react';
import { useIsDesktop, useIsMobile } from '@/app/components/responsiveCelular/responsive';
import DataTableMultiSelect from '@/app/components/dataTableComponent/DataTableMultiSelect';
import { highlightSearchTerm } from '@/app/components/dataTableComponent/types/types';

export function ListarComissoes({
    listPaginationComissoes,
    setListPaginationComissoes,
    loading,
    setLoading,
    searchTerm,
    listarInativos,
    selectedComissoes,
    setSelectedComissoes
}: {
    listPaginationComissoes: Record<string, any>;
    setListPaginationComissoes: Dispatch<SetStateAction<any>>;
    loading: boolean;
    searchTerm: string;
    setLoading: (state: boolean) => void;
    listarInativos: boolean;
    selectedComissoes: ComissaoEntity[];
    setSelectedComissoes: Dispatch<SetStateAction<ComissaoEntity[]>>;
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
                        <DataTableMultiSelect<ComissaoEntity>
                            data={listPaginationComissoes?.content || []}
                            selected={selectedComissoes}
                            onSelectionChange={setSelectedComissoes}
                            dataKey="id"
                            loading={loading}
                            isDarkMode={isDarkMode}
                            columns={[
                                {
                                    field: 'tipo_origem',
                                    header: 'Origem da venda',
                                    body: (data) => <span>{highlightSearchTerm(limitarText(data.tipo_origem, 15), searchTerm)}</span>
                                },
                                {
                                    field: 'data_hora_venda',
                                    header: 'Data da Venda',
                                    body: (data) => {
                                        if (!data.data_hora_venda) return <span>-</span>;
                                        const dataObj = new Date(data.data_hora_venda);
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
                                    field: 'data_hora_fechamento',
                                    header: 'Data do Fechamando',
                                    body: (data) => {
                                        if (!data.data_hora_fechamento) return <span>-</span>;
                                        const dataObj = new Date(data.data_hora_fechamento);
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
                                    field: 'valor_venda',
                                    header: 'Valor da Venda',
                                    body: (data) => {
                                        const valor = Number(data.valor_venda) || 0;
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
                                
                            ]}
                        />
                    )}
                    {/* {isMobile && (
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
                    )} */}
                </div>
            )}
        </div>
    );
}
export default ListarComissoes;
