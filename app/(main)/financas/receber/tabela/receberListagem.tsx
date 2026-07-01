'use client';
import '@/app/styles/styledGlobal.css';
import LoadingScreen from '@/app/loading';
import { useRouter } from 'next/navigation';
import { Messages } from '@/app/components/messages/GlobalMessages';
import { Skeleton } from 'primereact/skeleton';
import { Dispatch, SetStateAction, useContext } from 'react';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { ContasReceberEntity } from '@/app/entity/contasReceberEntity';
import { StatusNota } from '@/app/(main)/notaServico/types/statusClassNfs';
import { highlightSearchTerm } from '@/app/components/dataTableComponent/types/types';
import { useIsDesktop, useIsMobile } from '@/app/components/responsiveCelular/responsive';
import { DataTableComponent} from '@/app/components/dataTableComponent/DataTableComponent';

const formatDate = (value?: string | null, includeTime = false) => {
    if (!value) {
        return '-';
    }

    if (!includeTime && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
        const [year, month, day] = value.split('-');
        return `${day}/${month}/${year}`;
    }

    const dateObj = new Date(value);

    if (Number.isNaN(dateObj.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat(
        'pt-BR',
        includeTime
            ? {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }
            : {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            }
    ).format(dateObj);
};
const formatCurrency = (value?: number | null) =>
    new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(Number(value) || 0);

export function ListarContasReceber({
    listPaginationContasReceber,
    loading,
    searchTerm,
    listarInativos,
    mobileLoadMoreVisible,
    mobileLoadMoreLoading,
    onMobileLoadMore
}: {
    listPaginationContasReceber: Record<string, any>;
    loading: boolean;
    searchTerm: string;
    setListPaginationContasReceber: Dispatch<SetStateAction<any>>;
    setLoading: (state: boolean) => void;
    listarInativos: boolean;
    mobileLoadMoreVisible?: boolean;
    mobileLoadMoreLoading?: boolean;
    onMobileLoadMore?: () => void | Promise<void>;
}) {
    const router = useRouter();
    const isMobile = useIsMobile();
    const isDesktop = useIsDesktop();
    const msgs = useContext(LayoutContext);
    const isDarkMode = msgs.layoutConfig.colorScheme === 'dark';

    return (
        <div style={{ marginTop: '0' }}>
            <Messages className="custom-messages" />
            {loading ? (
                <LoadingScreen loadingText={'Carregando Contas a Receber...'} />
            ) : (
                <>
                    {isMobile && (
                        <div>
                            <DataTableComponent
                                value={listPaginationContasReceber?.content as ContasReceberEntity[]}
                                loading={loading}
                                totalRecords={listPaginationContasReceber?.totalElements ?? 0}
                                expandedRows={false}
                                setExpandedRows={() => { }}
                                rowExpansionTemplate={() => null}
                                expandButtonTemplate={() => null}
                                isDarkMode={isDarkMode}
                                searchTerm={searchTerm}
                                showExpandButton={false}
                                columns={[
                                    {
                                        field: 'Descrição',
                                        header: 'Descrição',
                                        body: (data) =>
                                            loading ? (
                                                <Skeleton />
                                            ) : (
                                                <span className="table-cell-truncate" title={data.descricao}>
                                                    {highlightSearchTerm(data.descricao, searchTerm)}
                                                </span>
                                            )
                                    },
                                    {
                                        field: 'nome_cliente',
                                        header: 'Cliente',
                                        body: (data) =>
                                            loading ? (
                                                <Skeleton />
                                            ) : (
                                                <span className="table-cell-truncate" title={data.nome_cliente}>
                                                    {highlightSearchTerm(data.nome_cliente, searchTerm)}
                                                </span>
                                            )
                                    },
                                    {
                                        field: 'nome_vendedor',
                                        header: 'Vendedor',
                                        body: (data) =>
                                            loading ? (
                                                <Skeleton />
                                            ) : (
                                                <span className="table-cell-truncate" title={data.nome_vendedor}>
                                                    {highlightSearchTerm(data.nome_vendedor, searchTerm)}
                                                </span>
                                            )
                                    },
                                    {
                                        field: 'valor_total',
                                        header: 'Valor',
                                        body: (data) => <span>{formatCurrency(data.valor_total ?? data.valor_original)}</span>
                                    },
                                    {
                                        field: 'situacao',
                                        header: 'Status',
                                        body: (data) => (
                                            <span className={`px-3 py-1 rounded-2xl text-sm font-medium inline-block ${StatusNota(data.situacao ?? '')}`}>
                                                {data.situacao ?? '-'}
                                            </span>
                                        )
                                    }
                                ]}
                                listarInativos={listarInativos}
                                mobileLoadMoreVisible={mobileLoadMoreVisible}
                                mobileLoadMoreLoading={mobileLoadMoreLoading}
                                onMobileLoadMore={onMobileLoadMore}
                            />
                        </div>
                    )}
                    {isDesktop && (
                        <div>
                            <DataTableComponent
                                value={listPaginationContasReceber?.content as ContasReceberEntity[]}
                                loading={loading}
                                totalRecords={listPaginationContasReceber?.totalElements ?? 0}
                                expandedRows={false}
                                setExpandedRows={() => { }}
                                rowExpansionTemplate={() => null}
                                expandButtonTemplate={() => null}
                                isDarkMode={isDarkMode}
                                searchTerm={searchTerm}
                                showExpandButton={false}
                                columns={[
                                    {
                                        field: 'Descrição',
                                        header: 'Descrição',
                                        body: (data) =>
                                            loading ? (
                                                <Skeleton />
                                            ) : (
                                                <span className="table-cell-truncate" title={data.descricao}>
                                                    {highlightSearchTerm(data.descricao, searchTerm)}
                                                </span>
                                            )
                                    },
                                     {
                                        field: 'nome_cliente',
                                        header: 'Cliente',
                                        body: (data) =>
                                            loading ? (
                                                <Skeleton />
                                            ) : (
                                                <span className="table-cell-truncate" title={data.nome_cliente}>
                                                    {highlightSearchTerm(data.nome_cliente, searchTerm)}
                                                </span>
                                            )
                                    },
                                    {
                                        field: 'nome_vendedor',
                                        header: 'Vendedor',
                                        body: (data) =>
                                            loading ? (
                                                <Skeleton />
                                            ) : (
                                                <span className="table-cell-truncate" title={data.nome_vendedor}>
                                                    {highlightSearchTerm(data.nome_vendedor, searchTerm)}
                                                </span>
                                            )
                                    },
                                    {
                                        field: 'origem_tipo',
                                        header: 'Origem',
                                        body: (data) => <span>{data.origem_tipo ? highlightSearchTerm(data.origem_tipo, searchTerm) : '-'}</span>
                                    },
                                    {
                                        field: 'data_emissao',
                                        header: 'Data de Emissao',
                                        body: (data) => <span>{formatDate(data.data_emissao)}</span>
                                    },
                                    {
                                        field: 'data_vencimento',
                                        header: 'Data de Vencimento',
                                        body: (data) => <span>{formatDate(data.data_vencimento)}</span>
                                    },
                                    {
                                        field: 'data_hora_pagamento',
                                        header: 'Data do Pagamento',
                                        body: (data) => <span>{formatDate(data.data_hora_pagamento, true)}</span>
                                    },
                                     {
                                        field: 'valor_juros',
                                        header: 'Juros',
                                        body: (data) => (
                                            <span className="table-cell-truncate" title={String(data.valor_juros ?? '')}>
                                                {highlightSearchTerm(data.valor_juros, searchTerm)}
                                            </span>
                                        )
                                    },
                                    {
                                        field: 'valor_original',
                                        header: 'Valor Original',
                                        body: (data) => <span>{formatCurrency(data.valor_original)}</span>
                                    },
                                    {
                                        field: 'valor_total',
                                        header: 'Valor Total',
                                        body: (data) => <span>{formatCurrency(data.valor_total ?? data.valor_original)}</span>
                                    },
                                    
                                    {
                                        field: 'situacao',
                                        header: 'Status',
                                        body: (data) => (
                                            <span
                                                style={{ borderRadius: '1rem', width: '90%', display: 'flex', alignItems: 'center' }}
                                                className={`px-3 py-1 rounded-2xl text-sm font-medium inline-block ${StatusNota(data.situacao ?? '')}`}
                                            >
                                                <div style={{ display: 'flex', justifyContent: 'center' }}>{data.situacao ?? '-'}</div>
                                            </span>
                                        )
                                    }
                                ]}
                                listarInativos={listarInativos}
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default ListarContasReceber;

