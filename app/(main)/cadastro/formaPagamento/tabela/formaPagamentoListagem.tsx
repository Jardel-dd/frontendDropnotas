'use client';
import '@/app/styles/styledGlobal.css';
import { Toast } from 'primereact/toast';
import LoadingScreen from '@/app/loading';
import { useRouter } from 'next/navigation';
import { Skeleton } from 'primereact/skeleton';
import { usePermissions } from '@/app/routes/permissoes';
import { limitarText } from '@/app/utils/limitTextDataCompany';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { FormaPagamentoEntity } from '@/app/entity/FormaPagamento';
import { Messages } from '@/app/components/messages/GlobalMessages';
import { Dispatch, SetStateAction, useContext, useRef, useState } from 'react';
import { handleActiveOrInativeFormaPagamento, } from '../controller/controller';
import { highlightSearchTerm } from '@/app/components/dataTableComponent/types/types';
import { useIsDesktop, useIsMobile } from '@/app/components/responsiveCelular/responsive';
import { DataTableComponent, defaultExpandButtonTemplate, editButton, toggleStatusOrDeleteButton } from '@/app/components/dataTableComponent/DataTableComponent';
export function ListarFormaPagamento(
    {
        listPaginationFormaPagamento,
        loading,
        searchTerm,
        setListPaginationFormaPagamento,
        setLoading,
        listarInativos,
        tipo_forma_pagamento,
        mobileLoadMoreVisible,
        mobileLoadMoreLoading,
        onMobileLoadMore
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
        mobileLoadMoreVisible?: boolean;
        mobileLoadMoreLoading?: boolean;
        onMobileLoadMore?: () => void | Promise<void>;
    }
) {
    const router = useRouter();
    const isMobile = useIsMobile();
    const isDesktop = useIsDesktop();
    const toast = useRef<Toast>(null);
    const msgs = useRef<Messages>(null);
    const { permissaoFormaPagamento } = usePermissions();
    const { layoutConfig } = useContext(LayoutContext);
    const isDarkMode = layoutConfig.colorScheme === "dark";
    const [expandedRows, setExpandedRows] = useState<any[]>([]);
    const listLoadingShellStyle = {
        position: 'relative' as const,
        display: 'flex',
        flexDirection: 'column' as const,
        flex: '1 1 auto',
        minHeight: 'clamp(24rem, 60vh, 40rem)'
    };
    const listLoadingOverlayStyle = {
        position: 'absolute' as const,
        inset: 0,
        zIndex: 3
    };
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
        <div style={{ marginTop: '0', display: 'flex', flex: '1 1 auto', minHeight: 0, flexDirection: 'column' }}>
            <Messages ref={msgs} className="custom-messages" />
            <>
                        {isMobile &&
                            <div style={listLoadingShellStyle}>
                                <DataTableComponent
                                    value={listPaginationFormaPagamento?.content as FormaPagamentoEntity[]}
                                    loading={false}
                                    totalRecords={listPaginationFormaPagamento?.size ?? 0}
                                    expandedRows={false}
                                    setExpandedRows={() => { }}
                                    rowExpansionTemplate={() => null}
                                    expandButtonTemplate={(rowData) => defaultExpandButtonTemplate(rowData, expandedRows, setExpandedRows)}
                                    isDarkMode={isDarkMode}
                                    searchTerm={searchTerm}
                                    editButtonTemplate={
                                        permissaoFormaPagamento.update ?
                                            (rowData) => editButton(rowData, "/cadastro/formaPagamento/created",
                                                router) : undefined}
                                    toggleStatusOrDeleteButtonTemplate={
                                        permissaoFormaPagamento.delete ? (rowData) => toggleStatusOrDeleteButton({
                                            entity: rowData,
                                            onToggle: changeStatusActivateandDelete,
                                            entityType: "",
                                        }) : undefined}
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
                                    mobileLoadMoreVisible={!loading && mobileLoadMoreVisible}
                                    mobileLoadMoreLoading={mobileLoadMoreLoading}
                                    onMobileLoadMore={onMobileLoadMore}
                                    mobileBodyScroll
                                />
                                {loading && (
                                    <div style={listLoadingOverlayStyle}>
                                        <LoadingScreen loadingText="Carregando Formas de Pagamentos..." fullScreen={false} />
                                    </div>
                                )}
                            </div>
                        }
                        {isDesktop &&
                            <div style={listLoadingShellStyle}>
                                <DataTableComponent
                                    value={listPaginationFormaPagamento?.content as FormaPagamentoEntity[]}
                                    loading={false}
                                    totalRecords={listPaginationFormaPagamento?.size ?? 0}
                                    expandedRows={false}
                                    setExpandedRows={() => { }}
                                    rowExpansionTemplate={() => null}
                                    expandButtonTemplate={(rowData) => defaultExpandButtonTemplate(rowData, expandedRows, setExpandedRows)}
                                    isDarkMode={isDarkMode}
                                    searchTerm={searchTerm}
                                    editButtonTemplate={
                                        permissaoFormaPagamento.update ?
                                            (rowData) => editButton(rowData, "/cadastro/formaPagamento/created",
                                                router) : undefined}
                                    toggleStatusOrDeleteButtonTemplate={
                                        permissaoFormaPagamento.delete ? (rowData) => toggleStatusOrDeleteButton({
                                            entity: rowData,
                                            onToggle: changeStatusActivateandDelete,
                                            entityType: "",
                                        }) : undefined}
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
                                {loading && (
                                    <div style={listLoadingOverlayStyle}>
                                        <LoadingScreen loadingText="Carregando Formas de Pagamentos..." fullScreen={false} />
                                    </div>
                                )}
                            </div>
                        }
            </>
        </div>
    );
}
export default ListarFormaPagamento;

