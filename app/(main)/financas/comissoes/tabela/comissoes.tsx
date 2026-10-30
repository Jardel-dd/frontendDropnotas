'use client';
import '@/app/styles/styledGlobal.css';
import '../../mobileListCards.css';
import LoadingScreen from '../../ListLoadingScreen';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { Messages } from '@/app/components/messages/GlobalMessages';
import { ComissaoEntity } from '@/app/entity/comissoesEntity';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { limitarText } from '@/app/utils/limitTextDataCompany';
import { Dispatch, SetStateAction, useContext, useRef } from 'react';
import { useIsMobile } from '@/app/components/responsiveCelular/responsive';
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
    setSelectedComissoes,
    mobileLoadMoreVisible = false,
    mobileLoadMoreLoading = false,
    onMobileLoadMore
}: {
    listPaginationComissoes: Record<string, any>;
    setListPaginationComissoes: Dispatch<SetStateAction<any>>;
    loading: boolean;
    searchTerm: string;
    setLoading: (state: boolean) => void;
    listarInativos: boolean;
    selectedComissoes: ComissaoEntity[];
    setSelectedComissoes: Dispatch<SetStateAction<ComissaoEntity[]>>;
    mobileLoadMoreVisible?: boolean;
    mobileLoadMoreLoading?: boolean;
    onMobileLoadMore?: () => void | Promise<void>;
}) {
    const msgs = useRef<Messages>(null);
    const isMobile = useIsMobile();
    const { layoutConfig } = useContext(LayoutContext);
    const isDarkMode = layoutConfig.colorScheme === 'dark';

    const formatarData = (valor?: string | null) => {
        if (!valor) return <span>-</span>;

        const dataObj = new Date(valor);
        const dataFormatada = new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(dataObj);

        return <span>{dataFormatada}</span>;
    };

    const formatarMoeda = (valor?: number | null) => (
        <span>
            {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            }).format(Number(valor) || 0)}
        </span>
    );

    const toggleComissaoSelection = (comissao: ComissaoEntity, checked: boolean) => {
        if (comissao.comissao_fechada) return;

        setSelectedComissoes((current) => {
            if (checked) {
                return current.some((selected) => selected.id === comissao.id)
                    ? current
                    : [...current, comissao];
            }

            return current.filter((selected) => selected.id !== comissao.id);
        });
    };

    return (
        <div style={{ marginTop: '0' }}>
            <Messages ref={msgs} className="custom-messages" />
            {loading ? (
                <LoadingScreen loadingText={'Carregando Comissões...'} />
            ) : (
                <>
                    {isMobile && (
                        <div className="finance-mobile-list">
                            {(listPaginationComissoes?.content ?? []).length === 0 ? (
                                <div className="finance-mobile-empty">Nenhum resultado encontrado na pesquisa</div>
                            ) : (
                                (listPaginationComissoes.content as ComissaoEntity[]).map((comissao) => {
                                    const isSelected = selectedComissoes.some((selected) => selected.id === comissao.id);

                                    return (
                                        <div key={comissao.id} className="finance-mobile-card">
                                            <div className="finance-mobile-card-top">
                                                <div className="finance-mobile-card-summary">
                                                    <div className="finance-mobile-card-detail">
                                                        <span className="finance-mobile-card-label">Origem</span>
                                                        <span className="finance-mobile-card-value finance-mobile-card-text">
                                                            {highlightSearchTerm(comissao.tipo_origem ?? '-', searchTerm)}
                                                        </span>
                                                    </div>
                                                    <div className="finance-mobile-card-detail">
                                                        <span className="finance-mobile-card-label">Comissão</span>
                                                        <span className="finance-mobile-card-value">{formatarMoeda(comissao.valor_comissao)}</span>
                                                    </div>
                                                    {!comissao.comissao_fechada && (
                                                        <Checkbox
                                                            checked={isSelected}
                                                            onChange={(event) => toggleComissaoSelection(comissao, event.checked ?? false)}
                                                            aria-label="Selecionar comissão"
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                            <div className="finance-mobile-card-body">
                                                <div className="finance-mobile-card-detail">
                                                    <span className="finance-mobile-card-label">Data da venda</span>
                                                    <span className="finance-mobile-card-meta-value">{formatarData(comissao.data_hora_venda)}</span>
                                                </div>
                                                <div className="finance-mobile-card-detail">
                                                    <span className="finance-mobile-card-label">Valor da venda</span>
                                                    <span className="finance-mobile-card-meta-value">{formatarMoeda(comissao.valor_venda)}</span>
                                                </div>
                                                <span className="finance-mobile-status">
                                                    {comissao.comissao_fechada ? 'Fechada' : 'Pendente'}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            {mobileLoadMoreVisible && onMobileLoadMore && (
                                <div className="finance-mobile-load-more">
                                    <Button
                                        type="button"
                                        outlined
                                        label={mobileLoadMoreLoading ? 'Carregando...' : 'Carregar mais'}
                                        loading={mobileLoadMoreLoading}
                                        disabled={mobileLoadMoreLoading || loading}
                                        onClick={() => void onMobileLoadMore()}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                    {!isMobile && (
                <div>
                    <DataTableMultiSelect<ComissaoEntity>
                        data={listPaginationComissoes?.content || []}
                        selected={selectedComissoes}
                        onSelectionChange={setSelectedComissoes}
                        dataKey="id"
                        loading={loading}
                        isDarkMode={isDarkMode}
                        isRowSelectable={(rowData) => !rowData.comissao_fechada}
                        columns={
                            [
                                      {
                                          field: 'tipo_origem',
                                          header: 'Origem da venda',
                                          body: (data) => <span>{highlightSearchTerm(limitarText(data.tipo_origem, 15), searchTerm)}</span>
                                      },
                                      {
                                          field: 'data_hora_venda',
                                          header: 'Venda',
                                          body: (data) => formatarData(data.data_hora_venda)
                                      },
                                      {
                                          field: 'data_hora_fechamento',
                                          header: 'Fechamento',
                                          body: (data) => formatarData(data.data_hora_fechamento)
                                      },
                                      {
                                          field: 'valor_venda',
                                          header: 'Valor Venda',
                                          body: (data) => formatarMoeda(data.valor_venda)
                                      }
                            ]
                        }
                    />
                </div>
                    )}
                </>
            )}
        </div>
    );
}
export default ListarComissoes;

