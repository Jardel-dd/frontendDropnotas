'use client';
import '@/app/styles/styledGlobal.css';
import LoadingScreen from '../../ListLoadingScreen';
import { useRouter } from 'next/navigation';
import { Messages } from '@/app/components/messages/GlobalMessages';
import { Skeleton } from 'primereact/skeleton';
import { Button } from 'primereact/button';
import '../../mobileListCards.css';
import { Dispatch, SetStateAction, useContext } from 'react';
import { limitarText } from '@/app/utils/limitTextDataCompany';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { ContasPagarEntity } from '@/app/entity/contasPagarEntity';
import { StatusNota } from '@/app/(main)/notaServico/types/statusClassNfs';
import { useIsDesktop, useIsMobile } from '@/app/components/responsiveCelular/responsive';
import { DataTableComponent, editButton } from '@/app/components/dataTableComponent/DataTableComponent';
import { highlightSearchTerm } from '@/app/components/dataTableComponent/types/types';
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

export function ListarContasPagar({
    listPaginationContasPagar,
    loading,
    searchTerm,
    listarInativos,
    mobileLoadMoreVisible,
    mobileLoadMoreLoading,
    onMobileLoadMore
}: {
    listPaginationContasPagar: Record<string, any>;
    loading: boolean;
    searchTerm: string;
    setListPaginationContasPagar: Dispatch<SetStateAction<any>>;
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
                <LoadingScreen loadingText={'Carregando Contas a Pagar...'} />
            ) : (
                <>
                    {isMobile && (
                        <div className="finance-mobile-list">
                            {(listPaginationContasPagar?.content ?? []).length === 0 ? (
                                <div className="finance-mobile-empty">Nenhum resultado encontrado na pesquisa</div>
                            ) : (
                                (listPaginationContasPagar.content as ContasPagarEntity[]).map((conta: any) => (
                                    <div key={conta.id} className="finance-mobile-card">
                                        <div className="finance-mobile-card-top">
                                            <div className="finance-mobile-card-summary">
                                                <div className="finance-mobile-card-detail">
                                                    <span className="finance-mobile-card-label">Descrição</span>
                                                    <span className="finance-mobile-card-value finance-mobile-card-text" title={conta.descricao}>
                                                        {highlightSearchTerm(conta.descricao, searchTerm)}
                                                    </span>
                                                </div>
                                                <div className="finance-mobile-card-detail">
                                                    <span className="finance-mobile-card-label">Valor</span>
                                                    <span className="finance-mobile-card-value">{formatCurrency(conta.valor_total ?? conta.valor_original)}</span>
                                                </div>
                                                <span className={`finance-mobile-status ${StatusNota(conta.situacao ?? '')}`}>
                                                    {conta.situacao ?? '-'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="finance-mobile-card-body">
                                            <div className="finance-mobile-card-detail">
                                                <span className="finance-mobile-card-label">Fornecedor</span>
                                                <span className="finance-mobile-card-text" title={conta.nome_fornecedor}>
                                                    {highlightSearchTerm(conta.nome_fornecedor, searchTerm)}
                                                </span>
                                            </div>
                                            <div className="finance-mobile-card-detail">
                                                <span className="finance-mobile-card-label">Vencimento</span>
                                                <span className="finance-mobile-card-meta-value">{formatDate(conta.data_vencimento)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                            {mobileLoadMoreVisible && onMobileLoadMore && (
                                <div className="finance-mobile-load-more">
                                    <Button
                                        type="button"
                                        outlined
                                        label={mobileLoadMoreLoading ? 'Carregando...' : 'Carregar mais'}
                                        loading={mobileLoadMoreLoading}
                                        disabled={mobileLoadMoreLoading}
                                        onClick={() => void onMobileLoadMore()}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                    {isDesktop && (
                        <div>
                            <DataTableComponent
                                value={listPaginationContasPagar?.content as ContasPagarEntity[]}
                                loading={loading}
                                totalRecords={listPaginationContasPagar?.totalElements ?? 0}
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
                                                <span>{highlightSearchTerm(limitarText(data.descricao, 40), searchTerm)}</span>
                                            )
                                    },
                                    {
                                        field: 'origem_tipo',
                                        header: 'Origem',
                                        body: (data) =>
                                            <span>{data.origem_tipo ? highlightSearchTerm(data.origem_tipo, searchTerm) : '-'}</span>
                                    },
                                    {
                                        field: 'data_emissao',
                                        header: 'Emissão',
                                        body: (data) => <span>
                                            {highlightSearchTerm(
                                                limitarText(formatDate(data.data_emissao), 5),
                                                searchTerm
                                            )}
                                        </span>
                                    },
                                    {
                                        field: 'data_vencimento',
                                        header: 'Vencimento',
                                        body: (data) =>
                                            <span>
                                                {highlightSearchTerm(
                                                    limitarText(formatDate(data.data_vencimento), 10),
                                                    searchTerm
                                                )}
                                            </span>
                                    },
                                    {
                                        field: 'data_hora_pagamento',
                                        header: 'Pagamento',
                                        body: (data) => <span>{formatDate(data.data_hora_pagamento, true)}</span>
                                    },
                                    {
                                        field: 'valor_original',
                                        header: 'Valor original',
                                        body: (data) => <span>{formatCurrency(data.valor_original)}</span>
                                    },
                                    {
                                        field: 'valor_juros',
                                        header: 'Juros',
                                        body: (data) => <span>{highlightSearchTerm(limitarText(data.valor_juros, 40), searchTerm)}</span>
                                    },
                                    {
                                        field: 'valor_total',
                                        header: 'Valor total',
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
export default ListarContasPagar;
