'use client';
import '@/app/styles/styledGlobal.css'
import { Toast } from 'primereact/toast';
import { useRouter } from 'next/navigation';
import { Messages } from 'primereact/messages';
import { Skeleton } from 'primereact/skeleton';
import LoadingScreen from '@/app/loading';
import { limitarText } from '@/app/utils/limitTextDataCompany';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { handleActiveOrInativeUserConta } from '../controller/controller';
import { Dispatch, SetStateAction, useContext, useRef, useState } from 'react';
import { useIsDesktop, useIsMobile } from '@/app/components/responsiveCelular/responsive';
import { DataTableComponent, defaultExpandButtonTemplate, editButton, highlightSearchTerm, toggleStatusOrDeleteButton } from '@/app/components/dataTableComponent/DataTableComponent';
import { PerfilUser } from '@/app/entity/PerfilUsuarioEntity';
import { UsuarioContaEntity } from '@/app/entity/UsuarioContaEntity';


export function ListarUserConta(
    {
        listPaginationUserConta,
        setListPaginationUserConta,
        loading,
        setLoading,
        searchTerm,
        listarInativos
    }: {
        listPaginationUserConta: Record<string, any>
        loading: boolean
        searchTerm: string
        deletar: (id: number) => Promise<void>
        ativar: (id: number) => Promise<void>
        setListPaginationUserConta: Dispatch<SetStateAction<any>>;
        setLoading: (state: boolean) => void;
        listarInativos: boolean;
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
    const changeStatusActivateandDelete = async (rowData: UsuarioContaEntity) => {
        await handleActiveOrInativeUserConta(
                   rowData,
                   msgs,
                   listPaginationUserConta,
                   listarInativos,
                   setLoading,
                   searchTerm,
                   setListPaginationUserConta
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
                                    value={listPaginationUserConta?.content as UsuarioContaEntity[]}
                                    loading={loading}
                                    totalRecords={listPaginationUserConta?.size ?? 0}
                                    expandedRows={false}
                                    setExpandedRows={() => {}}
                                    rowExpansionTemplate={() => null}
                                    expandButtonTemplate={(rowData) => defaultExpandButtonTemplate(rowData, expandedRows, setExpandedRows)}
                                    isDarkMode={isDarkMode}
                                    searchTerm={searchTerm}
                                    editButtonTemplate={(rowData) => editButton(rowData, "/cadastro/usuarios/created", router)}
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
                                                        {highlightSearchTerm(limitarText(data.nome, 25), searchTerm)}
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
                                value={listPaginationUserConta?.content as PerfilUser[]}
                                loading={loading}
                                totalRecords={listPaginationUserConta?.size ?? 0}
                                expandedRows={false}
                                setExpandedRows={() => {}}
                                rowExpansionTemplate={() => null}
                                expandButtonTemplate={(rowData) => defaultExpandButtonTemplate(rowData, expandedRows, setExpandedRows)}
                                isDarkMode={isDarkMode}
                                searchTerm={searchTerm}
                                editButtonTemplate={(rowData) => editButton(rowData, "/cadastro/usuarios/created", router)}
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
                                                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                                    <div
                                                        style={{
                                                            width: "25px",
                                                            height: "25px",
                                                            borderRadius: "50%",
                                                            overflow: "hidden",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            backgroundColor: "#f0f0f0", 
                                                        }}
                                                    >
                                                        {(data.foto_perfil || data.fotoPerfil) ? (
                                                            <img
                                                                src={data.foto_perfil?.startsWith('data:image') ? data.foto_perfil : data.foto_perfil}
                                                                alt="Foto de Perfil"
                                                                style={{
                                                                    width: "100%",
                                                                    height: "100%",
                                                                    objectFit: "cover",
                                                                }}
                                                            />
                                                        ) : (
                                                            <i className="pi pi-user" style={{ fontSize: "1.5rem", color: "#aaa" }}></i>
                                                        )}
                                                    </div>
                                                    <span className={isStatusInactive ? 'text-red-clear-custom' : ''}>
                                                        {highlightSearchTerm(limitarText(data.nome, 25), searchTerm)}
                                                    </span>
                                                </div>
                                            );
                                        },
                                    },
                                    
                                    {
                                        field: "email",
                                        header: "E-mail",
                                        body: (data) => {
                                            const isStatusInactive = data.ativo === false;
                                            return loading ? (
                                                <Skeleton />
                                            ) : (
                                                <span className={isStatusInactive ? 'text-red-clear-custom' : ''}>
                                                    {highlightSearchTerm(limitarText(data.email, 25), searchTerm)}
                                                </span>
                                            );
                                        },
                                    },
                                    {
                                        field: "permissoes",
                                        header: "Permissão",
                                        body: (data) => {
                                            const isStatusInactive = data.ativo === false;
                                            return loading ? (
                                                <Skeleton />
                                            ) : (
                                                <span className={isStatusInactive ? 'text-red-clear-custom' : ''}>
                                                    {highlightSearchTerm(limitarText(data.nome_perfil_usuario, 25), searchTerm)}
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
export default ListarUserConta;
