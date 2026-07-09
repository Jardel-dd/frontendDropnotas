'use client';
import '@/app/styles/styledGlobal.css';
import { Toast } from 'primereact/toast';
import LoadingScreen from '@/app/loading';
import { Button } from 'primereact/button';
import { Skeleton } from 'primereact/skeleton';
import { usePermissions } from '@/app/routes/permissoes';
import { limitarText } from '@/app/utils/limitTextDataCompany';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { Messages } from '@/app/components/messages/GlobalMessages';
import { CategoryContratosEntity } from '@/app/entity/CategoryContratEntity';
import { Dispatch, SetStateAction, useContext, useRef, useState } from 'react';
import { handleActiveOrInativeCategoriaContrato } from '../controller/controller';
import { highlightSearchTerm } from '@/app/components/dataTableComponent/types/types';
import { useIsDesktop, useIsMobile } from '@/app/components/responsiveCelular/responsive';
import { DataTableComponent, defaultExpandButtonTemplate, toggleStatusOrDeleteButton } from '@/app/components/dataTableComponent/DataTableComponent';

export function ListarCategoriaContrato({
    listPaginationCategoriaContrato,
    setListPaginationCategoriaContrato,
    loading,
    setLoading,
    searchTerm,
    listarInativos,
    onCategoriaClick,
    mobileLoadMoreVisible,
    mobileLoadMoreLoading,
    onMobileLoadMore
}: {
    listPaginationCategoriaContrato: Record<string, any>;
    loading: boolean;
    searchTerm: string;
    deletar: (id: number) => Promise<void>;
    ativar: (id: number) => Promise<void>;
    setListPaginationCategoriaContrato: Dispatch<SetStateAction<any>>;
    setLoading: (state: boolean) => void;
    listarInativos: boolean;
    onCategoriaClick?: (categoria: CategoryContratosEntity) => void;
    mobileLoadMoreVisible?: boolean;
    mobileLoadMoreLoading?: boolean;
    onMobileLoadMore?: () => void | Promise<void>;
}) {
    const isMobile = useIsMobile();
    const isDesktop = useIsDesktop();
    const toast = useRef<Toast>(null);
    const msgs = useRef<Messages>(null);
    const { layoutConfig } = useContext(LayoutContext);
    const { permissaoCategoriaContrato } = usePermissions();
    const isDarkMode = layoutConfig.colorScheme === 'dark';
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
    const changeStatusActivateandDelete = async (rowData: CategoryContratosEntity) => {
        await handleActiveOrInativeCategoriaContrato(rowData, msgs, listPaginationCategoriaContrato, listarInativos, setLoading, searchTerm, setListPaginationCategoriaContrato);
    };
    return (
        <div style={{ marginTop: '0', display: 'flex', flex: '1 1 auto', minHeight: 0, flexDirection: 'column' }}>
            <Messages ref={msgs} className="custom-messages" />
            <>
                    {isMobile && (
                        <div style={listLoadingShellStyle}>
                            <DataTableComponent
                                value={listPaginationCategoriaContrato?.content as CategoryContratosEntity[]}
                                loading={false}
                                totalRecords={listPaginationCategoriaContrato?.size ?? 0}
                                expandedRows={false}
                                setExpandedRows={() => { }}
                                rowExpansionTemplate={() => null}
                                expandButtonTemplate={(rowData) => defaultExpandButtonTemplate(rowData, expandedRows, setExpandedRows)}
                                isDarkMode={isDarkMode}
                                searchTerm={searchTerm}
                                editButtonTemplate={
                                    permissaoCategoriaContrato.update ?
                                        (rowData) => (
                                            <Button
                                                icon="pi pi-pencil"
                                                tooltip="Alterar"
                                                className="p-button-text p-button-warning bottom-All-plus-datatableDetails"
                                                onClick={() => {
                                                    console.log('[EDITAR] Clique no botão editar');
                                                    console.log('[EDITAR] RowData:', rowData);
                                                    console.log('[EDITAR] ID da categoria:', rowData.id);
                                                    onCategoriaClick?.(rowData);
                                                }}
                                            />
                                        ) : undefined}
                                toggleStatusOrDeleteButtonTemplate={
                                    permissaoCategoriaContrato.delete ? (rowData) =>
                                        toggleStatusOrDeleteButton({
                                            entity: rowData,
                                            onToggle: changeStatusActivateandDelete,
                                            entityType: ''
                                        }) : undefined
                                }
                                showExpandButton={false}
                                columns={[
                                    {
                                        field: 'descricao',
                                        header: 'Descrição',
                                        body: (data) => {
                                            const isStatusInactive = data.ativo === false;
                                            return loading ? <Skeleton /> : <span className={isStatusInactive ? 'text-red-clear-custom' : ''}>{highlightSearchTerm(limitarText(data.descricao, 40), searchTerm)}</span>;
                                        }
                                    }
                                ]}
                                listarInativos={listarInativos}
                                mobileLoadMoreVisible={!loading && mobileLoadMoreVisible}
                                mobileLoadMoreLoading={mobileLoadMoreLoading}
                                onMobileLoadMore={onMobileLoadMore}
                                mobileBodyScroll
                            />
                            {loading && (
                                <div style={listLoadingOverlayStyle}>
                                    <LoadingScreen loadingText="Carregando Categoria de Contratos..." fullScreen={false} />
                                </div>
                            )}
                        </div>
                    )}
                    {isDesktop && (
                        <div style={listLoadingShellStyle}>
                            <DataTableComponent
                                value={listPaginationCategoriaContrato?.content as CategoryContratosEntity[]}
                                loading={false}
                                totalRecords={listPaginationCategoriaContrato?.size ?? 0}
                                expandedRows={false}
                                setExpandedRows={() => { }}
                                rowExpansionTemplate={() => null}
                                expandButtonTemplate={(rowData) => defaultExpandButtonTemplate(rowData, expandedRows, setExpandedRows)}
                                isDarkMode={isDarkMode}
                                searchTerm={searchTerm}
                                editButtonTemplate={
                                    permissaoCategoriaContrato.update ? (rowData) => (
                                        <Button
                                            icon="pi pi-pencil"
                                            tooltip="Alterar"
                                            className="p-button-text p-button-warning bottom-All-plus-datatableDetails"
                                            onClick={() => {
                                                onCategoriaClick?.(rowData);
                                            }}
                                        />
                                    ) : undefined}
                                toggleStatusOrDeleteButtonTemplate={permissaoCategoriaContrato.delete ? (rowData) =>
                                    toggleStatusOrDeleteButton({
                                        entity: rowData,
                                        onToggle: changeStatusActivateandDelete,
                                        entityType: ''
                                    }) : undefined
                                }
                                showExpandButton={false}
                                columns={[
                                    {
                                        field: 'descricao',
                                        header: 'Descrição',
                                        body: (data) => {
                                            const isStatusInactive = data.ativo === false;
                                            return loading ? <Skeleton /> : <span className={isStatusInactive ? 'text-red-clear-custom' : ''}>{highlightSearchTerm(limitarText(data.descricao, 40), searchTerm)}</span>;
                                        }
                                    }
                                ]}
                                listarInativos={listarInativos}
                            />
                            {loading && (
                                <div style={listLoadingOverlayStyle}>
                                    <LoadingScreen loadingText="Carregando Categoria de Contratos..." fullScreen={false} />
                                </div>
                            )}
                        </div>
                    )}
            </>
        </div>
    );
}
export default ListarCategoriaContrato;

