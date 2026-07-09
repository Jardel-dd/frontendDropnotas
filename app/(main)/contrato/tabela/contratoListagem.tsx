'use client';
import '@/app/styles/styledGlobal.css';
import { Toast } from 'primereact/toast';
import LoadingScreen from '@/app/loading';
import { useRouter } from 'next/navigation';
import { Skeleton } from 'primereact/skeleton';
import { Messages } from '@/app/components/messages/GlobalMessages';
import { usePermissions } from '@/app/routes/permissoes';
import { ContratoEntity } from '@/app/entity/ContratoEntity';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { limitarText } from '@/app/utils/limitTextDataCompany';
import { handleActiveOrInativeContrato } from '../controller/controller';
import { Dispatch, SetStateAction, useContext, useRef, useState } from 'react';
import { highlightSearchTerm } from '@/app/components/dataTableComponent/types/types';
import { useIsDesktop, useIsMobile } from '@/app/components/responsiveCelular/responsive';
import { DataTableComponent, defaultExpandButtonTemplate, editButton, toggleStatusOrDeleteButton } from '@/app/components/dataTableComponent/DataTableComponent';
export function ListarContratos({
    listPaginationContratos,
    setListPaginationContratos,
    loading,
    setLoading,
    searchTerm,
    listarInativos,
    mobileLoadMoreVisible,
    mobileLoadMoreLoading,
    onMobileLoadMore
}: {
    listPaginationContratos: Record<string, any>;
    loading: boolean;
    searchTerm: string;
    deletar: (id: number) => Promise<void>;
    ativar: (id: number) => Promise<void>;
    setListPaginationContratos: Dispatch<SetStateAction<any>>;
    setLoading: (state: boolean) => void;
    listarInativos: boolean;
    mobileLoadMoreVisible?: boolean;
    mobileLoadMoreLoading?: boolean;
    onMobileLoadMore?: () => void | Promise<void>;
}) {
    const router = useRouter();
    const isMobile = useIsMobile();
    const isDesktop = useIsDesktop();
    const toast = useRef<Toast>(null);
    const msgs = useRef<Messages>(null);
    const { permissaoContrato } = usePermissions();
    const { layoutConfig } = useContext(LayoutContext);
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
    const changeStatusActivateandDelete = async (rowData: ContratoEntity) => {
        await handleActiveOrInativeContrato(rowData, msgs, listPaginationContratos, listarInativos, setLoading, searchTerm, setListPaginationContratos);
    };
    return (
        <div style={{ marginTop: '0', display: 'flex', flex: '1 1 auto', minHeight: 0, flexDirection: 'column' }}>
            <Messages ref={msgs} className="custom-messages" />
            <>
                    {isMobile && (
                        <div style={listLoadingShellStyle}>
                            <DataTableComponent
                                value={listPaginationContratos?.content as ContratoEntity[]}
                                loading={false}
                                totalRecords={listPaginationContratos?.size ?? 0}
                                expandedRows={false}
                                setExpandedRows={() => { }}
                                rowExpansionTemplate={() => null}
                                expandButtonTemplate={(rowData) => defaultExpandButtonTemplate(rowData, expandedRows, setExpandedRows)}
                                isDarkMode={isDarkMode}
                                searchTerm={searchTerm}
                                editButtonTemplate={permissaoContrato.update ? (rowData) => editButton(rowData, '/contrato/created', router) : undefined}
                                toggleStatusOrDeleteButtonTemplate={permissaoContrato.delete ? (rowData) =>
                                    toggleStatusOrDeleteButton({
                                        entity: rowData,
                                        onToggle: changeStatusActivateandDelete,
                                        entityType: ''
                                    }) : undefined
                                }
                                showExpandButton={false}
                                columns={[
                                    {
                                        field: 'nome',
                                        header: 'Descrição do Contrato',
                                        body: (data) => {
                                            const isStatusInactive = data.ativo === false;
                                            return loading ? <Skeleton /> : <span className={isStatusInactive ? 'text-red-clear-custom' : ''}>{highlightSearchTerm(limitarText(data.descricao, 25), searchTerm)}</span>;
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
                                    <LoadingScreen loadingText="Carregando Contratos..." fullScreen={false} />
                                </div>
                            )}
                        </div>
                    )}
                    {isDesktop && (
                        <div style={listLoadingShellStyle}>
                            <DataTableComponent
                                value={listPaginationContratos?.content as ContratoEntity[]}
                                loading={false}
                                totalRecords={listPaginationContratos?.size ?? 0}
                                expandedRows={false}
                                setExpandedRows={() => { }}
                                rowExpansionTemplate={() => null}
                                expandButtonTemplate={(rowData) => defaultExpandButtonTemplate(rowData, expandedRows, setExpandedRows)}
                                isDarkMode={isDarkMode}
                                searchTerm={searchTerm}
                                editButtonTemplate={permissaoContrato.update ? (rowData) => editButton(rowData, '/contrato/created', router) : undefined}
                                toggleStatusOrDeleteButtonTemplate={permissaoContrato.delete ? (rowData) =>
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
                                            return loading ? (
                                                <Skeleton />
                                            ) : (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <span className={isStatusInactive ? 'text-red-clear-custom' : ''}>{highlightSearchTerm(limitarText(data.descricao, 25), searchTerm)}</span>
                                                </div>
                                            );
                                        }
                                    },
                                    {
                                        field: 'NomeCompany',
                                        header: 'Razão Social',
                                        body: (data) => {
                                            const isStatusInactive = data.ativo === false;
                                            return loading ? <Skeleton /> : <span className={isStatusInactive ? 'text-red-clear-custom' : ''}>{highlightSearchTerm(limitarText(data.nome_empresa, 25), searchTerm)}</span>;
                                        }
                                    },
                                    {
                                        field: 'preco',
                                        header: 'Valor do Serviço',
                                        body: (data) => {
                                            const isStatusInactive = data.ativo === false;

                                            const valorFormatado = new Intl.NumberFormat('pt-BR', {
                                                style: 'currency',
                                                currency: 'BRL'
                                            }).format(data.valor_servico || 0);

                                            return loading ? <Skeleton /> : <span className={isStatusInactive ? 'text-red-clear-custom' : ''}>{highlightSearchTerm(limitarText(valorFormatado, 25), searchTerm)}</span>;
                                        }
                                    }
                                ]}
                                listarInativos={listarInativos}
                            />
                            {loading && (
                                <div style={listLoadingOverlayStyle}>
                                    <LoadingScreen loadingText="Carregando Contratos..." fullScreen={false} />
                                </div>
                            )}
                        </div>
                    )}
            </>
        </div>
    );
}
export default ListarContratos;

