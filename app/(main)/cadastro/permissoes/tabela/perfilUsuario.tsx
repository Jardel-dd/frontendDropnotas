'use client';
import '@/app/styles/styledGlobal.css'
import LoadingScreen from '@/app/loading';
import { useRouter } from 'next/navigation';
import { Skeleton } from 'primereact/skeleton';
import { usePermissions } from '@/app/routes/permissoes';
import { PerfilUser } from '@/app/entity/PerfilUsuarioEntity';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { limitarText } from '@/app/utils/limitTextDataCompany';
import { Messages } from '@/app/components/messages/GlobalMessages';
import { handleActiveOrInativePerfilUsuario } from '../controller/controller';
import { Dispatch, SetStateAction, useContext, useRef, useState } from 'react';
import { highlightSearchTerm } from '@/app/components/dataTableComponent/types/types';
import { useIsDesktop, useIsMobile } from '@/app/components/responsiveCelular/responsive';
import { DataTableComponent, defaultExpandButtonTemplate, editButton, toggleStatusOrDeleteButton } from '@/app/components/dataTableComponent/DataTableComponent';

export function ListarPerfilUsers(
    {
        listPaginationPerfilUser,
        loading,
        searchTerm,
        setListPaginationPerfilUser,
        setLoading,
        listarInativos,
        mobileLoadMoreVisible,
        mobileLoadMoreLoading,
        onMobileLoadMore
    }: {
        listPaginationPerfilUser: Record<string, any>
        loading: boolean
        searchTerm: string
        deletar: (id: number) => Promise<void>
        ativar: (id: number) => Promise<void>
        setListPaginationPerfilUser: Dispatch<SetStateAction<any>>;
        setSelectedPerfilUser: Dispatch<SetStateAction<PerfilUser | null>>
        selectedPerfil: PerfilUser | null
        setLoading: (state: boolean) => void;
        listarInativos: boolean;
        mobileLoadMoreVisible?: boolean;
        mobileLoadMoreLoading?: boolean;
        onMobileLoadMore?: () => void | Promise<void>;

    }
) {
    const router = useRouter();
    const isMobile = useIsMobile();
    const isDesktop = useIsDesktop();
    const msgs = useRef<Messages>(null);
    const { permissaoPerfilUsuario } = usePermissions();
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

    const changeStatusActivateandDelete = async (rowData: PerfilUser) => {
        await handleActiveOrInativePerfilUsuario(
            rowData,
            msgs,
            listPaginationPerfilUser,
            listarInativos,
            setLoading,
            searchTerm,
            setListPaginationPerfilUser
        );
    };

    return (
        <div style={{ marginTop: '0', display: 'flex', flex: '1 1 auto', minHeight: 0, flexDirection: 'column' }}>
            <Messages ref={msgs} className="custom-messages" />
            <>
                {isMobile &&
                    <div style={listLoadingShellStyle}>
                        <DataTableComponent
                            value={listPaginationPerfilUser?.content as PerfilUser[]}
                            loading={false}
                            totalRecords={listPaginationPerfilUser?.size ?? 0}
                            expandedRows={false}
                            setExpandedRows={() => { }}
                            rowExpansionTemplate={() => null}
                            expandButtonTemplate={(rowData) => defaultExpandButtonTemplate(rowData, expandedRows, setExpandedRows)}
                            isDarkMode={isDarkMode}
                            searchTerm={searchTerm}
                            editButtonTemplate={
                                permissaoPerfilUsuario.update
                                    ? (rowData) => editButton(rowData, "/cadastro/permissoes/created", router)
                                    : undefined
                            }
                            toggleStatusOrDeleteButtonTemplate={
                                permissaoPerfilUsuario.delete
                                    ? (rowData) => toggleStatusOrDeleteButton({
                                        entity: rowData,
                                        onToggle: changeStatusActivateandDelete,
                                        entityType: "",
                                    }) : undefined
                            }
                            showExpandButton={false}
                            columns={[
                                {
                                    field: "nome",
                                    header: "Descrição",
                                    body: (data) => {
                                        const isStatusInactive = data.ativo === false;
                                        return loading ? (
                                            <Skeleton />
                                        ) : (
                                            <span className={isStatusInactive ? 'text-red-clear-custom' : ''}>
                                                {highlightSearchTerm(limitarText(data.nome, 15), searchTerm)}
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
                                <LoadingScreen loadingText="Carregando Permissões..." fullScreen={false} />
                            </div>
                        )}
                    </div>
                }
                {isDesktop &&
                    <div style={listLoadingShellStyle}>
                        <DataTableComponent
                            value={listPaginationPerfilUser?.content as PerfilUser[]}
                            loading={false}
                            totalRecords={listPaginationPerfilUser?.size ?? 0}
                            expandedRows={false}
                            setExpandedRows={() => { }}
                            rowExpansionTemplate={() => null}
                            expandButtonTemplate={(rowData) => defaultExpandButtonTemplate(rowData, expandedRows, setExpandedRows)}
                            isDarkMode={isDarkMode}
                            searchTerm={searchTerm}
                            editButtonTemplate={
                                permissaoPerfilUsuario.update
                                    ? (rowData) => editButton(rowData, "/cadastro/permissoes/created", router)
                                    : undefined
                            }
                            toggleStatusOrDeleteButtonTemplate={
                                permissaoPerfilUsuario.delete
                                    ? (rowData) => toggleStatusOrDeleteButton({
                                        entity: rowData,
                                        onToggle: changeStatusActivateandDelete,
                                        entityType: "",
                                    }) : undefined
                            }
                            showExpandButton={false}
                            columns={[
                                {
                                    field: "nome",
                                    header: "Descrição",
                                    body: (data) => {
                                        const isStatusInactive = data.ativo === false;
                                        return loading ? (
                                            <Skeleton />
                                        ) : (
                                            <span className={isStatusInactive ? 'text-red-clear-custom' : ''}>
                                                {highlightSearchTerm(limitarText(data.nome, 40), searchTerm)}
                                            </span>
                                        );
                                    },
                                },
                            ]}
                            listarInativos={listarInativos}
                            mobileLoadMoreVisible={mobileLoadMoreVisible}
                            mobileLoadMoreLoading={mobileLoadMoreLoading}
                            onMobileLoadMore={onMobileLoadMore}
                        />
                        {loading && (
                            <div style={listLoadingOverlayStyle}>
                                <LoadingScreen loadingText="Carregando Permissões..." fullScreen={false} />
                            </div>
                        )}
                    </div>
                }
            </>
        </div>
    );
}

export default ListarPerfilUsers;
