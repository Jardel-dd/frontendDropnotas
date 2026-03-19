'use client';
import '@/app/styles/styledGlobal.css';
import { Toast } from 'primereact/toast';
import LoadingScreen from '@/app/loading';
import { useRouter } from 'next/navigation';
import { Messages } from 'primereact/messages';
import { Skeleton } from 'primereact/skeleton';
import { limitarText } from '@/app/utils/limitTextDataCompany';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { FormaPagamentoEntity } from '@/app/entity/FormaPagamento';
import { Dispatch, SetStateAction, useContext, useRef, useState } from 'react';
import { handleActiveOrInativeFormaPagamento, } from '../controller/controller';
import { useIsDesktop, useIsMobile } from '@/app/components/responsiveCelular/responsive';
import { DataTableComponent, defaultExpandButtonTemplate, editButton, highlightSearchTerm, toggleStatusOrDeleteButton } from '@/app/components/dataTableComponent/DataTableComponent';
export function ListarFormaPagamento(
    {
        listPaginationFormaPagamento,
        loading,
        searchTerm,
        setListPaginationFormaPagamento,
        setLoading,
        listarInativos,
        tipo_forma_pagamento
    }: {
        listPaginationFormaPagamento: Record<string, any>
        loading: boolean
        searchTerm: string
        deletar: (id: number) => Promise<void>
        ativar: (id: number) => Promise<void>
        setListPaginationFormaPagamento: Dispatch<SetStateAction<any>>;
        setLoading: (state: boolean) => void;
        listarInativos: boolean;
        tipo_forma_pagamento: string
    }
) {
    const router = useRouter();
    const isMobile = useIsMobile();
    const isDesktop = useIsDesktop();
    const toast = useRef<Toast>(null);
    const msgs = useRef<Messages>(null);
    const { layoutConfig } = useContext(LayoutContext);
    const isDarkMode = layoutConfig.colorScheme === "dark";
    const [expandedRows, setExpandedRows] = useState<any[]>([]);
    const changeStatusActivateandDelete = async (rowData: FormaPagamentoEntity) => {
        await handleActiveOrInativeFormaPagamento(
            rowData,
            msgs,
            listPaginationFormaPagamento,
            listarInativos,
            setLoading,
            searchTerm,
            tipo_forma_pagamento,
            setListPaginationFormaPagamento

        );
    };
    return (
        <div style={{ marginTop: '0' }}>
            <Messages ref={msgs} className="custom-messages" />
            {loading ? (<LoadingScreen loadingText={'Carregando...'} />) :
                (
                    <>
                        {isMobile &&
                            <div>
                                <DataTableComponent
                                    value={listPaginationFormaPagamento?.content as FormaPagamentoEntity[]}
                                    loading={loading}
                                    totalRecords={listPaginationFormaPagamento?.size ?? 0}
                                    expandedRows={false}
                                    setExpandedRows={() => { }}
                                    rowExpansionTemplate={() => null}
                                    expandButtonTemplate={(rowData) => defaultExpandButtonTemplate(rowData, expandedRows, setExpandedRows)}
                                    isDarkMode={isDarkMode}
                                    searchTerm={searchTerm}
                                    editButtonTemplate={(rowData) => editButton(rowData, "/cadastro/formaPagamento/created", router)}
                                    toggleStatusOrDeleteButtonTemplate={(rowData) => toggleStatusOrDeleteButton({
                                        entity: rowData,
                                        onToggle: changeStatusActivateandDelete,
                                        entityType: "",
                                    })}
                                    showExpandButton={false}
                                    columns={[
                                        {
                                            field: "descricao",
                                            header: "Descrição",
                                            body: (data) => {
                                                const isStatusInactive = data.ativo === false;
                                                return loading ? (
                                                    <Skeleton />
                                                ) : (
                                                    <span className={isStatusInactive ? 'text-red-clear-custom' : ''}>
                                                        {highlightSearchTerm(limitarText(data.descricao, 25), searchTerm)}
                                                    </span>
                                                );
                                            },
                                        },
                                    ]}
                                    listarInativos={listarInativos}
                                />
                            </div>
                        }
                        {isDesktop &&
                            <div>
                                <DataTableComponent
                                    value={listPaginationFormaPagamento?.content as FormaPagamentoEntity[]}
                                    loading={loading}
                                    totalRecords={listPaginationFormaPagamento?.size ?? 0}
                                    expandedRows={false}
                                    setExpandedRows={() => { }}
                                    rowExpansionTemplate={() => null}
                                    expandButtonTemplate={(rowData) => defaultExpandButtonTemplate(rowData, expandedRows, setExpandedRows)}
                                    isDarkMode={isDarkMode}
                                    searchTerm={searchTerm}
                                    editButtonTemplate={(rowData) => editButton(rowData, "/cadastro/formaPagamento/created", router)}
                                    toggleStatusOrDeleteButtonTemplate={(rowData) => toggleStatusOrDeleteButton({
                                        entity: rowData,
                                        onToggle: changeStatusActivateandDelete,
                                        entityType: "",
                                    })}
                                    showExpandButton={false}
                                    columns={[
                                        {
                                            field: "descricao",
                                            header: "Descrição",
                                            body: (data) => {
                                                const isStatusInactive = data.ativo === false;
                                                return loading ? (
                                                    <Skeleton />
                                                ) : (
                                                    <span className={isStatusInactive ? 'text-red-clear-custom' : ''}>
                                                        {highlightSearchTerm(limitarText(data.descricao, 40), searchTerm)}
                                                    </span>
                                                );
                                            },
                                        },
                                        {
                                            field: "tipo_forma_pagamento",
                                            header: "Tipo de Pagamento",
                                            body: (data) => {
                                                const isStatusInactive = data.ativo === false;
                                                return loading ? (
                                                    <Skeleton />
                                                ) : (
                                                    <span className={isStatusInactive ? 'text-red-clear-custom' : ''}>
                                                        {highlightSearchTerm(limitarText(data.tipo_forma_pagamento, 40), searchTerm)}
                                                    </span>
                                                );
                                            },
                                        },
                                        {
                                            field: "tipo_taxa",
                                            header: "Taxa",
                                            body: (data) => {
                                                const isStatusInactive = data.ativo === false;
                                                return loading ? (
                                                    <Skeleton />
                                                ) : (
                                                    <span className={isStatusInactive ? 'text-red-clear-custom' : ''}>
                                                        {highlightSearchTerm(limitarText(data.tipo_taxa, 40), searchTerm)}
                                                    </span>
                                                );
                                            },
                                        },
                                        {
                                            field: "valor_taxa",
                                            header: "Valor da Taxa",
                                            body: (data) => {
                                                const isStatusInactive = data.ativo === false;
                                                return loading ? (
                                                    <Skeleton />
                                                ) : (
                                                    <span className={isStatusInactive ? 'text-red-clear-custom' : ''}>
                                                        {highlightSearchTerm(limitarText(data.valor_taxa, 40), searchTerm)}
                                                    </span>
                                                );
                                            },
                                        },
                                    ]}
                                    listarInativos={listarInativos}
                                />
                            </div>
                        }
                    </>
                )
            }
        </div>
    );
}
export default ListarFormaPagamento;
