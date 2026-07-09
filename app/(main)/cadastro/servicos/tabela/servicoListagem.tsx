'use client';
import { Toast } from 'primereact/toast';
import LoadingScreen from '@/app/loading';
import { useRouter } from 'next/navigation';
import { Skeleton } from 'primereact/skeleton';
import { Messages } from '@/app/components/messages/GlobalMessages';
import { usePermissions } from '@/app/routes/permissoes';
import { ServiceEntity } from '@/app/entity/ServiceEntity';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { limitarText } from '@/app/utils/limitTextDataCompany';
import { Dispatch, SetStateAction, useContext, useRef, useState } from 'react';
import { highlightSearchTerm } from '@/app/components/dataTableComponent/types/types';
import { useIsDesktop, useIsMobile } from '@/app/components/responsiveCelular/responsive';
import { DataTableComponent, defaultExpandButtonTemplate, editButton, toggleStatusOrDeleteButton } from '@/app/components/dataTableComponent/DataTableComponent';

export function ListarServicos(
    {
        listPaginationServicos,
        loading,
        searchTerm,
        listarInativos,
        deletar,
        ativar,
        mobileLoadMoreVisible,
        mobileLoadMoreLoading,
        onMobileLoadMore
    }: {
        listPaginationServicos: Record<string, any>;
        loading: boolean;
        searchTerm: string;
        deletar: (id: number) => Promise<void>;
        ativar: (id: number) => Promise<void>;
        setListPaginationServicos: Dispatch<SetStateAction<any>>;
        setLoading: (state: boolean) => void;
        listarInativos: boolean;
        mobileLoadMoreVisible?: boolean;
        mobileLoadMoreLoading?: boolean;
        onMobileLoadMore?: () => void | Promise<void>;
    }
) {
    const isMobile = useIsMobile();
    const isDesktop = useIsDesktop();
    const router = useRouter();
    const toast = useRef<Toast>(null);
    const msgs = useRef<Messages>(null);
    const { permissaoServico } = usePermissions();
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

    const changeStatusActivateandDelete = async (rowData: ServiceEntity) => {
        if (rowData.ativo) {
            await deletar(rowData.id!);
            return;
        }

        await ativar(rowData.id!);
    };

    return (
        <div style={{ marginTop: '0', display: 'flex', flex: '1 1 auto', minHeight: 0, flexDirection: 'column' }}>
            <Messages ref={msgs} className="custom-messages" />
            <>
                    {isMobile && (
                        <div style={listLoadingShellStyle}>
                            <DataTableComponent
                                value={listPaginationServicos?.content}
                                loading={false}
                                totalRecords={listPaginationServicos?.size ?? 0}
                                expandedRows={false}
                                setExpandedRows={() => {}}
                                rowExpansionTemplate={() => null}
                                expandButtonTemplate={(rowData) => defaultExpandButtonTemplate(rowData, expandedRows, setExpandedRows)}
                                isDarkMode={isDarkMode}
                                searchTerm={searchTerm}
                                editButtonTemplate={permissaoServico.update ? (rowData) => editButton(rowData, '/cadastro/servicos/created', router) : undefined}
                                toggleStatusOrDeleteButtonTemplate={
                                    permissaoServico.delete
                                        ? (rowData) =>
                                              toggleStatusOrDeleteButton({
                                                  entity: rowData,
                                                  onToggle: changeStatusActivateandDelete,
                                                  entityType: ''
                                              })
                                        : undefined
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
                                                <span className={isStatusInactive ? 'text-red-clear-custom' : ''}>
                                                    {highlightSearchTerm(limitarText(data.descricao, 25), searchTerm)}
                                                </span>
                                            );
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
                                    <LoadingScreen loadingText="Carregando Servicos..." fullScreen={false} />
                                </div>
                            )}
                        </div>
                    )}
                    {isDesktop && (
                        <div style={listLoadingShellStyle}>
                            <DataTableComponent
                                value={listPaginationServicos?.content}
                                loading={false}
                                totalRecords={listPaginationServicos?.size ?? 0}
                                expandedRows={false}
                                setExpandedRows={() => {}}
                                rowExpansionTemplate={() => null}
                                expandButtonTemplate={(rowData) => defaultExpandButtonTemplate(rowData, expandedRows, setExpandedRows)}
                                isDarkMode={isDarkMode}
                                searchTerm={searchTerm}
                                editButtonTemplate={permissaoServico.update ? (rowData) => editButton(rowData, '/cadastro/servicos/created', router) : undefined}
                                toggleStatusOrDeleteButtonTemplate={
                                    permissaoServico.delete
                                        ? (rowData) =>
                                              toggleStatusOrDeleteButton({
                                                  entity: rowData,
                                                  onToggle: changeStatusActivateandDelete,
                                                  entityType: ''
                                              })
                                        : undefined
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
                                                <span className={isStatusInactive ? 'text-red-clear-custom' : ''}>
                                                    {highlightSearchTerm(limitarText(data.descricao, 25), searchTerm)}
                                                </span>
                                            );
                                        }
                                    },
                                    {
                                        field: 'valor_servico',
                                        header: 'Valor',
                                        body: (data) => {
                                            const valor = Number(data.valor_servico) || 0;
                                            return (
                                                <span>
                                                    {new Intl.NumberFormat('pt-BR', {
                                                        style: 'currency',
                                                        currency: 'BRL'
                                                    }).format(valor)}
                                                </span>
                                            );
                                        }
                                    }
                                ]}
                                listarInativos={listarInativos}
                            />
                            {loading && (
                                <div style={listLoadingOverlayStyle}>
                                    <LoadingScreen loadingText="Carregando Servicos..." fullScreen={false} />
                                </div>
                            )}
                        </div>
                    )}
            </>
        </div>
    );
}

export default ListarServicos;
