'use client';
import { Toast } from 'primereact/toast';
import LoadingScreen from '@/app/loading';
import { useRouter } from 'next/navigation';
import { Skeleton } from 'primereact/skeleton';
import { usePermissions } from '@/app/routes/permissoes';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { limitarText } from '@/app/utils/limitTextDataCompany';
import { Messages } from '@/app/components/messages/GlobalMessages';
import { PerfilTributarioEntity } from '@/app/entity/perfilTributarioEntity';
import { Dispatch, SetStateAction, useContext, useRef, useState } from 'react';
import { highlightSearchTerm } from '@/app/components/dataTableComponent/types/types';
import { useIsDesktop, useIsMobile } from '@/app/components/responsiveCelular/responsive';
import { DataTableComponent, defaultExpandButtonTemplate, editButton, toggleStatusOrDeleteButton } from '@/app/components/dataTableComponent/DataTableComponent';

export function ListarPerfilTributario(
    {
        listPaginationPerfilTributario,
        loading,
        searchTerm,
        listarInativos,
        deletar,
        ativar,
        mobileLoadMoreVisible,
        mobileLoadMoreLoading,
        onMobileLoadMore
    }: {
        listPaginationPerfilTributario: Record<string, any>;
        loading: boolean;
        searchTerm: string;
        deletar: (id: number) => Promise<void>;
        ativar: (id: number) => Promise<void>;
        setListPaginationPerfilTributario: Dispatch<SetStateAction<any>>;
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
    const { permissaoPerfilTributario } = usePermissions();
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

    const changeStatusActivateandDelete = async (rowData: PerfilTributarioEntity) => {
        if (rowData.ativo) {
            await deletar(rowData.id!);
            return;
        }

        await ativar(rowData.id!);
    };

    const logPerfilTributarioEdit = (perfilTributario: PerfilTributarioEntity) => {
        console.info('[Perfil Tributario] Editando perfil', {
            id: perfilTributario.id,
            endpoint: `/perfil-tributario/${perfilTributario.id}`
        });
    };

    return (
        <div style={{ marginTop: '0', display: 'flex', flex: '1 1 auto', minHeight: 0, flexDirection: 'column' }}>
            <Messages ref={msgs} className="custom-messages" />
            <>
                    {isMobile && (
                        <div style={listLoadingShellStyle}>
                            <DataTableComponent
                                value={listPaginationPerfilTributario?.content}
                                loading={false}
                                totalRecords={listPaginationPerfilTributario?.size ?? 0}
                                expandedRows={false}
                                setExpandedRows={() => {}}
                                rowExpansionTemplate={() => null}
                                expandButtonTemplate={(rowData) => defaultExpandButtonTemplate(rowData, expandedRows, setExpandedRows)}
                                isDarkMode={isDarkMode}
                                searchTerm={searchTerm}
                                editButtonTemplate={permissaoPerfilTributario.update ? (rowData) => editButton(rowData, '/cadastro/perfilTributario/created', router, undefined, logPerfilTributarioEdit) : undefined}
                                toggleStatusOrDeleteButtonTemplate={
                                    permissaoPerfilTributario.delete
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
                                        field: 'nome',
                                        header: 'Descrição',
                                        body: (data) => {
                                            const isStatusInactive = data.ativo === false;
                                            return loading ? (
                                                <Skeleton />
                                            ) : (
                                                <span className={isStatusInactive ? 'text-red-clear-custom' : ''}>
                                                    {highlightSearchTerm(limitarText(data.nome, 25), searchTerm)}
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
                                    <LoadingScreen loadingText="Carregando Perfil Tributário..." fullScreen={false} />
                                </div>
                            )}
                        </div>
                    )}
                    {isDesktop && (
                        <div style={listLoadingShellStyle}>
                            <DataTableComponent
                                value={listPaginationPerfilTributario?.content}
                                loading={false}
                                totalRecords={listPaginationPerfilTributario?.size ?? 0}
                                expandedRows={false}
                                setExpandedRows={() => {}}
                                rowExpansionTemplate={() => null}
                                expandButtonTemplate={(rowData) => defaultExpandButtonTemplate(rowData, expandedRows, setExpandedRows)}
                                isDarkMode={isDarkMode}
                                searchTerm={searchTerm}
                                editButtonTemplate={permissaoPerfilTributario.update ? (rowData) => editButton(rowData, '/cadastro/perfilTributario/created', router, undefined, logPerfilTributarioEdit) : undefined}
                                toggleStatusOrDeleteButtonTemplate={
                                    permissaoPerfilTributario.delete
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
                                        field: 'nome',
                                        header: 'Descrição',
                                        body: (data) => {
                                            const isStatusInactive = data.ativo === false;
                                            return loading ? (
                                                <Skeleton />
                                            ) : (
                                                <span className={isStatusInactive ? 'text-red-clear-custom' : ''}>
                                                    {highlightSearchTerm(limitarText(data.nome, 25), searchTerm)}
                                                </span>
                                            );
                                        }
                                    },
                                 
                                ]}
                                listarInativos={listarInativos}
                            />
                            {loading && (
                                <div style={listLoadingOverlayStyle}>
                                    <LoadingScreen loadingText="Carregando Perfil Tributário..." fullScreen={false} />
                                </div>
                            )}
                        </div>
                    )}
            </>
        </div>
    );
}

export default ListarPerfilTributario;
