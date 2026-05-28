'use client';
import '@/app/styles/styledGlobal.css';
import LoadingScreen from '@/app/loading';
import { Messages } from 'primereact/messages';
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

    return (
        <div style={{ marginTop: '0' }}>
            <Messages ref={msgs} className="custom-messages" />
            {loading ? (
                <LoadingScreen loadingText={'Carregando Comissões...'} />
            ) : (
                <div>
                    <DataTableMultiSelect<ComissaoEntity>
                        data={listPaginationComissoes?.content || []}
                        selected={selectedComissoes}
                        onSelectionChange={setSelectedComissoes}
                        dataKey="id"
                        loading={loading}
                        isDarkMode={isDarkMode}
                        className={isMobile ? 'table-mobile' : undefined}
                        isRowSelectable={(rowData) => !rowData.comissao_fechada}
                        columns={
                            isMobile
                                ? [
                                      {
                                          field: 'tipo_origem',
                                          header: 'Origem',
                                          body: (data) => <span>{highlightSearchTerm(limitarText(data.tipo_origem, 20), searchTerm)}</span>
                                      },
                                      {
                                          field: 'valor_comissao',
                                          header: 'Comissão',
                                          body: (data) => formatarMoeda(data.valor_comissao)
                                      },
                                      {
                                          field: 'data_hora_venda',
                                          header: 'Venda',
                                          body: (data) => formatarData(data.data_hora_venda)
                                      }
                                  ]
                                : [
                                      {
                                          field: 'tipo_origem',
                                          header: 'Origem da venda',
                                          body: (data) => <span>{highlightSearchTerm(limitarText(data.tipo_origem, 15), searchTerm)}</span>
                                      },
                                      {
                                          field: 'data_hora_venda',
                                          header: 'Data da Venda',
                                          body: (data) => formatarData(data.data_hora_venda)
                                      },
                                      {
                                          field: 'data_hora_fechamento',
                                          header: 'Data do Fechamento',
                                          body: (data) => formatarData(data.data_hora_fechamento)
                                      },
                                      {
                                          field: 'valor_venda',
                                          header: 'Valor da Venda',
                                          body: (data) => formatarMoeda(data.valor_venda)
                                      }
                                  ]
                        }
                    />
                </div>
            )}
        </div>
    );
}
export default ListarComissoes;
