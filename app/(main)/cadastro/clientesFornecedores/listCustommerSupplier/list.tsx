'use client';
import '@/app/styles/styledGlobal.css'
import { Toast } from 'primereact/toast';
import { useRouter } from 'next/navigation';
import { Messages } from 'primereact/messages';
import { Skeleton } from 'primereact/skeleton';
import LoadingScreen from '@/app/loading';
import { PessoaEntity } from '@/app/entity/PessoaEntity';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { limitarText } from '@/app/utils/limitTextDataCompany';
import { Dispatch, SetStateAction, useContext, useRef, useState } from 'react';
import { handleActiveOrInativeClientesFornecedores } from '../controller/controller';
import { useIsDesktop, useIsMobile } from '@/app/components/responsiveCelular/responsive';
import { DataTableComponent, defaultExpandButtonTemplate, editButton, highlightSearchTerm, toggleStatusOrDeleteButton } from '@/app/components/dataTableComponent/DataTableComponent';


export function ListarClientesFornecedores(
    {
        listPaginationClientesFornecedores,
        setListPaginationClientesFornecedores,
        loading,
        setLoading,
        searchTerm,
        listarInativos,
        cliente,
        fornecedor
    }: {
        listPaginationClientesFornecedores: Record<string, any>
        loading: boolean
        searchTerm: string
        deletar: (id: number) => Promise<void>
        ativar: (id: number) => Promise<void>
        setListPaginationClientesFornecedores: Dispatch<SetStateAction<any>>;
        setLoading: (state: boolean) => void;
        listarInativos: boolean;
        cliente: boolean;
        fornecedor: boolean;
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

    const changeStatusActivateandDelete = async (rowData: PessoaEntity) => {
        await handleActiveOrInativeClientesFornecedores(
            rowData,
            msgs,
            listPaginationClientesFornecedores,
            listarInativos,
            cliente,
            fornecedor,
            setLoading,
            searchTerm,
            setListPaginationClientesFornecedores
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
                                    value={listPaginationClientesFornecedores?.content as PessoaEntity[]}
                                    loading={loading}
                                    totalRecords={listPaginationClientesFornecedores?.size ?? 0}
                                    expandedRows={false}
                                    setExpandedRows={() => { }}
                                    rowExpansionTemplate={() => null}
                                    expandButtonTemplate={(rowData) => defaultExpandButtonTemplate(rowData, expandedRows, setExpandedRows)}
                                    isDarkMode={isDarkMode}
                                    searchTerm={searchTerm}
                                    editButtonTemplate={(rowData) => editButton(rowData, "/cadastro/clientesFornecedores/created", router)}
                                    toggleStatusOrDeleteButtonTemplate={(rowData) => toggleStatusOrDeleteButton({
                                        entity: rowData,
                                        onToggle: changeStatusActivateandDelete,
                                        entityType: "",
                                    })}
                                    showExpandButton={false}
                                    columns={[
                                        {
                                            field: "razao_social",
                                            header: "Razão Social",
                                            body: (data) => {
                                                const isStatusInactive = data.ativo === false;
                                                return loading ? (
                                                    <Skeleton />
                                                ) : (
                                                    <span className={isStatusInactive ? 'text-red-clear-custom' : ''}>
                                                        {highlightSearchTerm(limitarText(data.razao_social, 25), searchTerm)}
                                                    </span>
                                                );
                                            },
                                        },
                                    ]}
                                    listarInativos={listarInativos}
                                    cliente={cliente}
                                    fornecedor={fornecedor}
                                />
                            </div>

                        }
                        {isDesktop &&
                            <div>
                                <DataTableComponent
                                    value={listPaginationClientesFornecedores?.content as PessoaEntity[]}
                                    loading={loading}
                                    totalRecords={listPaginationClientesFornecedores?.size ?? 0}
                                    expandedRows={false}
                                    setExpandedRows={() => { }}
                                    rowExpansionTemplate={() => null}
                                    expandButtonTemplate={(rowData) => defaultExpandButtonTemplate(rowData, expandedRows, setExpandedRows)}
                                    isDarkMode={isDarkMode}
                                    searchTerm={searchTerm}
                                    editButtonTemplate={(rowData) => editButton(rowData, "/cadastro/clientesFornecedores/created", router)}
                                    toggleStatusOrDeleteButtonTemplate={(rowData) => toggleStatusOrDeleteButton({
                                        entity: rowData,
                                        onToggle: changeStatusActivateandDelete,
                                        entityType: "",
                                    })}
                                    showExpandButton={false}
                                    columns={[
                                        {
                                            field: "razao_social",
                                            header: "Razão Social",
                                            body: (data) => {
                                                const isStatusInactive = data.ativo === false;
                                                return loading ? (
                                                    <Skeleton />
                                                ) : (
                                                    <span className={isStatusInactive ? 'text-red-clear-custom' : ''}>
                                                        {highlightSearchTerm(limitarText(data.razao_social, 25), searchTerm)}
                                                    </span>
                                                );
                                            },
                                        },
                                        {
                                            field: "documento",
                                            header: "CPF/CNPJ",
                                            body: (data) => {
                                                const isStatusInactive = data.ativo === false;

                                                const idValue = data?.cpf ?? data?.cnpj ?? data?.razao_social ?? "";

                                                const display = idValue ? limitarText(idValue, 25) : "—";

                                                return loading ? (
                                                    <Skeleton />
                                                ) : (
                                                    <span className={isStatusInactive ? "text-red-clear-custom" : ""}>
                                                        {highlightSearchTerm(display, searchTerm)}
                                                    </span>
                                                );
                                            },
                                        }


                                    ]}
                                    listarInativos={listarInativos}
                                    cliente={cliente}
                                    fornecedor={fornecedor}
                                />
                            </div>
                        }
                    </>
                )
            }
        </div>
    );
}
export default ListarClientesFornecedores;
