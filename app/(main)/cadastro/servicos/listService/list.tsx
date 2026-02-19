'use client';
import { Toast } from 'primereact/toast';
import LoadingScreen from '@/app/loading';
import { useRouter } from 'next/navigation';
import { Skeleton } from 'primereact/skeleton';
import { Messages } from 'primereact/messages';
import { ServiceEntity } from '@/app/entity/ServiceEntity';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { limitarText } from '@/app/utils/limitTextDataCompany';
import { handleActiveOrInativeServicos } from '../controller/controller';
import { Dispatch, SetStateAction, useContext, useRef, useState } from 'react';
import { useIsDesktop, useIsMobile } from '@/app/components/responsiveCelular/responsive';
import { DataTableComponent, defaultExpandButtonTemplate, editButton, highlightSearchTerm, toggleStatusOrDeleteButton } from '@/app/components/dataTableComponent/DataTableComponent';

export function ListarServicos(
    {
        listPaginationServicos,
        setListPaginationServicos,
        loading,
        setLoading,
        searchTerm,
        listarInativos
    }: {
        listPaginationServicos: Record<string, any>
        loading: boolean
        searchTerm: string
        deletar: (id: number) => Promise<void>
        ativar: (id: number) => Promise<void>
        setListPaginationServicos: Dispatch<SetStateAction<any>>;
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
    const changeStatusActivateandDelete = async (rowData: ServiceEntity) => {
        await handleActiveOrInativeServicos(
            rowData,
            msgs,
            listPaginationServicos,
            listarInativos,
            setLoading,
            searchTerm,
            setListPaginationServicos
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
                                    value={listPaginationServicos?.content}
                                    loading={loading}
                                    totalRecords={listPaginationServicos?.size ?? 0}
                                    expandedRows={false}
                                    setExpandedRows={() => { }}
                                    rowExpansionTemplate={() => null}
                                    expandButtonTemplate={(rowData) => defaultExpandButtonTemplate(rowData, expandedRows, setExpandedRows)}
                                    isDarkMode={isDarkMode}
                                    searchTerm={searchTerm}
                                    editButtonTemplate={(rowData) => editButton(rowData, "/cadastro/servicos/created", router)}
                                    toggleStatusOrDeleteButtonTemplate={(rowData) => toggleStatusOrDeleteButton({
                                        entity: rowData,
                                        onToggle: changeStatusActivateandDelete,
                                        entityType: "",
                                    })}
                                    showExpandButton={false}
                                    columns={[
                                        {
                                            field: "descrição",
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
                                />
                            </div>
                        }
                        {isDesktop &&
                            <div>
                                <DataTableComponent
                                    value={listPaginationServicos?.content}
                                    loading={loading}
                                    totalRecords={listPaginationServicos?.size ?? 0}
                                    expandedRows={false}
                                    setExpandedRows={() => { }}
                                    rowExpansionTemplate={() => null}
                                    expandButtonTemplate={(rowData) => defaultExpandButtonTemplate(rowData, expandedRows, setExpandedRows)}
                                    isDarkMode={isDarkMode}
                                    searchTerm={searchTerm}
                                    editButtonTemplate={(rowData) => editButton(rowData, "/cadastro/servicos/created", router)}
                                    toggleStatusOrDeleteButtonTemplate={(rowData) => toggleStatusOrDeleteButton({
                                        entity: rowData,
                                        onToggle: changeStatusActivateandDelete,
                                        entityType: "",
                                    })}
                                    showExpandButton={false}
                                    columns={[
                                        {
                                            field: "descrição",
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
                                        {
                                            field: "valor_servico",
                                            header: "Valor",
                                            body: (data) => {
                                                const valor = Number(data.valor_servico) || 0;
                                                return (
                                                    <span>
                                                        {new Intl.NumberFormat("pt-BR", {
                                                            style: "currency",
                                                            currency: "BRL",
                                                        }).format(valor)}
                                                    </span>
                                                );
                                            },
                                        }

                                        ,
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
export default ListarServicos;
