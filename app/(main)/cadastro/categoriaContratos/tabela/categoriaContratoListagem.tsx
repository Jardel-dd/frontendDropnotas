'use client';
import '@/app/styles/styledGlobal.css';
import { Toast } from 'primereact/toast';
import LoadingScreen from '@/app/loading';
import { Button } from 'primereact/button';
import { Messages } from 'primereact/messages';
import { Skeleton } from 'primereact/skeleton';
import { usePermissions } from '@/app/routes/permissoes';
import { limitarText } from '@/app/utils/limitTextDataCompany';
import { LayoutContext } from '@/layout/context/layoutcontext';
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
    onCategoriaClick
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
}) {
    const isMobile = useIsMobile();
    const isDesktop = useIsDesktop();
    const toast = useRef<Toast>(null);
    const msgs = useRef<Messages>(null);
    const { layoutConfig } = useContext(LayoutContext);
    const { permissaoCategoriaContrato } = usePermissions();
    const isDarkMode = layoutConfig.colorScheme === 'dark';
    const [expandedRows, setExpandedRows] = useState<any[]>([]);
    const changeStatusActivateandDelete = async (rowData: CategoryContratosEntity) => {
        await handleActiveOrInativeCategoriaContrato(rowData, msgs, listPaginationCategoriaContrato, listarInativos, setLoading, searchTerm, setListPaginationCategoriaContrato);
    };
    return (
        <div style={{ marginTop: '0' }}>
            <Messages ref={msgs} className="custom-messages" />
            {loading ? (
                <LoadingScreen loadingText={'Carregando...'} />
            ) : (
                <>
                    {isMobile && (
                        <div>
                            <DataTableComponent
                                value={listPaginationCategoriaContrato?.content as CategoryContratosEntity[]}
                                loading={loading}
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
                            />
                        </div>
                    )}
                    {isDesktop && (
                        <div>
                            <DataTableComponent
                                value={listPaginationCategoriaContrato?.content as CategoryContratosEntity[]}
                                loading={loading}
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
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
export default ListarCategoriaContrato;
