'use client';
import { Dispatch, SetStateAction, useContext, useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import LoadingScreen from '@/app/loading';
import { useRouter } from 'next/navigation';
import './perfilStyles.css'
import { Messages } from 'primereact/messages';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { useIsDesktop, useIsMobile } from '@/app/components/responsiveCelular/responsive';
import { DataTableComponent, defaultExpandButtonTemplate, editButton, highlightSearchTerm, toggleStatusOrDeleteButton } from '@/app/components/dataTableComponent/DataTableComponent';
import { limitarText } from '@/app/utils/limitTextDataCompany';
import { Skeleton } from 'primereact/skeleton';
import { handleActiveOrInativeVendedor } from '../controller/controller';
import { VendedorEntity } from '@/app/entity/VendedorEntity';

export function ListarVendedores(
    {
        listPaginationVendedores,
        setListPaginationVendedores,
        loading,
        setLoading,
        searchTerm,
        listarInativos, 
     
    }: {
        listPaginationVendedores: Record<string, any>
        loading: boolean
        searchTerm: string
        deletar: (id: number) => Promise<void>
        ativar: (id: number) => Promise<void>
        setListPaginationVendedores: Dispatch<SetStateAction<any>>;
        setLoading: (state: boolean) => void;
        listarInativos: boolean;
    }
) {
    const isMobile = useIsMobile();
    const isDesktop = useIsDesktop();
    const router = useRouter();
    const toast = useRef<Toast>(null);
    const msgs = useRef<Messages>(null);
    const { layoutConfig } = useContext(LayoutContext);
    const isDarkMode = layoutConfig.colorScheme === "dark";
    const [expandedRows, setExpandedRows] = useState<any[]>([]);
     
    const changeStatusActivateandDelete = async (rowData: VendedorEntity) => {
        await handleActiveOrInativeVendedor(
            rowData,
            msgs,
            listPaginationVendedores,
            listarInativos,
            setLoading,
            searchTerm,
            setListPaginationVendedores
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
                                    value={listPaginationVendedores?.content as VendedorEntity[]}
                                    loading={loading}
                                    totalRecords={listPaginationVendedores?.size ?? 0}
                                    expandedRows={false}
                                    setExpandedRows={() => {}}
                                    rowExpansionTemplate={() => null}
                                    expandButtonTemplate={(rowData) => defaultExpandButtonTemplate(rowData, expandedRows, setExpandedRows)}
                                    isDarkMode={isDarkMode}
                                    searchTerm={searchTerm}
                                    editButtonTemplate={(rowData) => editButton(rowData, "/cadastro/vendedores/created", router)}
                                    toggleStatusOrDeleteButtonTemplate={(rowData) => toggleStatusOrDeleteButton({
                                        entity: rowData,
                                        onToggle: changeStatusActivateandDelete,
                                        entityType: "",
                                    })}
                                    showExpandButton={false} 
                                    columns={[
                                        {
                                            field: "razaoSocial",
                                            header: "Vendedores",
                                            body: (data) => {
                                                const isStatusInactive = data.ativo === false;
                                                return loading ? (
                                                    <Skeleton />
                                                ) : (
                                                    <span className={isStatusInactive ? 'text-red-custom' : ''}>
                                                        {highlightSearchTerm(limitarText(data.razao_social, 25), searchTerm)}
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
                                value={listPaginationVendedores?.content as VendedorEntity[]}
                                loading={loading}
                                totalRecords={listPaginationVendedores?.size ?? 0}
                                expandedRows={false}
                                setExpandedRows={() => {}}
                                rowExpansionTemplate={() => null}
                                expandButtonTemplate={(rowData) => defaultExpandButtonTemplate(rowData, expandedRows, setExpandedRows)}
                                isDarkMode={isDarkMode}
                                searchTerm={searchTerm}
                                editButtonTemplate={(rowData) => editButton(rowData, "/cadastro/vendedores/created", router)}
                                toggleStatusOrDeleteButtonTemplate={(rowData) => toggleStatusOrDeleteButton({
                                    entity: rowData,
                                    onToggle: changeStatusActivateandDelete,
                                    entityType: "",
                                })}
                                showExpandButton={false} 
                                columns={[
                                    {
                                        field: "razaoSocial",
                                        header: "Vendedores",
                                        body: (data) => {
                                            const isStatusInactive = data.ativo === false;
                                            return loading ? (
                                                <Skeleton />
                                            ) : (
                                                <span className={isStatusInactive ? 'text-red-custom' : ''}>
                                                    {highlightSearchTerm(limitarText(data.razao_social, 25), searchTerm)}
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
export default ListarVendedores;
