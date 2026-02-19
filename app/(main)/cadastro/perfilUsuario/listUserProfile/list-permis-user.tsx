'use client';
import '@/app/styles/styledGlobal.css'
import LoadingScreen from '@/app/loading';
import { useRouter } from 'next/navigation';
import { Skeleton } from 'primereact/skeleton';
import { Messages } from 'primereact/messages';
import { PerfilUser } from '@/app/entity/PerfilUsuarioEntity';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { limitarText } from '@/app/utils/limitTextDataCompany';
import { handleActiveOrInativePerfilUsuario } from '../controller/controller';
import { Dispatch, SetStateAction, useContext, useRef, useState } from 'react';
import { useIsDesktop, useIsMobile } from '@/app/components/responsiveCelular/responsive';
import { DataTableComponent, defaultExpandButtonTemplate, editButton, highlightSearchTerm, toggleStatusOrDeleteButton } from '@/app/components/dataTableComponent/DataTableComponent';


export function ListarPerfilUsers(
    {
        listPaginationPerfilUser,
        loading,
        searchTerm,
        setListPaginationPerfilUser,
        setLoading,
        listarInativos,
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
      
    }
) {
    const router = useRouter();
    const isMobile = useIsMobile();
    const isDesktop = useIsDesktop();
    const msgs = useRef<Messages>(null);
    const { layoutConfig } = useContext(LayoutContext);
    const isDarkMode = layoutConfig.colorScheme === "dark";
    const [expandedRows, setExpandedRows] = useState<any[]>([]);

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
        <div style={{ marginTop: '0' }}>
            <Messages ref={msgs} className="custom-messages" />
            {loading ? (<LoadingScreen loadingText={'Carregando...'} />) :
                (
                    <>
                        {isMobile &&
                            <div>
                                <DataTableComponent
                                    value={listPaginationPerfilUser?.content as PerfilUser[]}
                                    loading={loading}
                                    totalRecords={listPaginationPerfilUser?.size ?? 0}
                                    expandedRows={false}
                                    setExpandedRows={() => { }}
                                    rowExpansionTemplate={() => null}
                                    expandButtonTemplate={(rowData) => defaultExpandButtonTemplate(rowData, expandedRows, setExpandedRows)}
                                    isDarkMode={isDarkMode}
                                    searchTerm={searchTerm}
                                    editButtonTemplate={(rowData) => editButton(rowData, "/cadastro/perfilUsuario/created", router)}
                                    toggleStatusOrDeleteButtonTemplate={(rowData) => toggleStatusOrDeleteButton({
                                        entity: rowData,
                                        onToggle: changeStatusActivateandDelete,
                                        entityType: "",
                                    })}
                                    showExpandButton={false}
                                    columns={[
                                        {
                                            field: "nome",
                                            header: "Nome",
                                            body: (data) => {
                                                const isStatusInactive = data.ativo === false;
                                                return loading ? (
                                                    <Skeleton />
                                                ) : (
                                                    <span className={isStatusInactive ? 'text-red-clear-custom' : ''}>
                                                        {highlightSearchTerm(limitarText(data.nome, 20), searchTerm)}
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
                                    value={listPaginationPerfilUser?.content as PerfilUser[]}
                                    loading={loading}
                                    totalRecords={listPaginationPerfilUser?.size ?? 0}
                                    expandedRows={false}
                                    setExpandedRows={() => { }}
                                    rowExpansionTemplate={() => null}
                                    expandButtonTemplate={(rowData) => defaultExpandButtonTemplate(rowData, expandedRows, setExpandedRows)}
                                    isDarkMode={isDarkMode}
                                    searchTerm={searchTerm}
                                    editButtonTemplate={(rowData) => editButton(rowData, "/cadastro/perfilUsuario/created", router)}
                                    toggleStatusOrDeleteButtonTemplate={(rowData) => toggleStatusOrDeleteButton({
                                        entity: rowData,
                                        onToggle: changeStatusActivateandDelete,
                                        entityType: "",
                                    })}
                                    showExpandButton={false}
                                    columns={[
                                        {
                                            field: "nome",
                                            header: "Nome",
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
                                   
                                />
                            </div>
                        }
                    </>
                )
            }
        </div>
    );
}
export default ListarPerfilUsers;
