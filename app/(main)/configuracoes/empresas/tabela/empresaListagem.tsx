'use client';
import '@/app/styles/styledGlobal.css';
import LoadingScreen from '@/app/loading';
import { useRouter } from 'next/navigation';
import { Skeleton } from 'primereact/skeleton';
import { Messages } from 'primereact/messages';
import { CompanyEntity } from '@/app/entity/CompanyEntity';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { limitarText } from '@/app/utils/limitTextDataCompany';
import { handleActiveOrInativeEmpresa } from '../controller/controller';
import { Dispatch, SetStateAction, useContext, useRef, useState } from 'react';
import { useIsDesktop, useIsMobile } from '@/app/components/responsiveCelular/responsive';
import { DataTableComponent, defaultExpandButtonTemplate, editButton, highlightSearchTerm, toggleStatusOrDeleteButton } from '@/app/components/dataTableComponent/DataTableComponent';

export function ListarEmpresas({
    listPaginationEmpresa,
    setListPaginationEmpresa,
    loading,
    setLoading,
    searchTerm,
    listarInativos
}: {
    listPaginationEmpresa: Record<string, any>;
    loading: boolean;
    searchTerm: string;
    deletar: (id: number) => Promise<void>;
    ativar: (id: number) => Promise<void>;
    setSelectedEmpresa: Dispatch<SetStateAction<CompanyEntity | null>>;
    setListPaginationEmpresa: Dispatch<SetStateAction<any>>;
    selectedEmpresa: CompanyEntity | null;
    setLoading: (state: boolean) => void;
    listarInativos: boolean;
}) {
    const router = useRouter();
    const isMobile = useIsMobile();
    const isDesktop = useIsDesktop();
    const msgs = useRef<Messages>(null);
    const { layoutConfig } = useContext(LayoutContext);
    const isDarkMode = layoutConfig.colorScheme === 'dark';
    const [expandedRows, setExpandedRows] = useState<CompanyEntity[]>([]);
    const rowExpansionTemplate = (data: CompanyEntity) => {
        return (
            <div className="company-details p-3 shadow-sm rounded">
                <h5 className="company-title">Detalhes da Empresa</h5>
                <p className="company-detail">
                    <strong className="company-label">Razão Social:</strong> {data.razao_social}
                </p>
                <p className="company-detail">
                    <strong className="company-label">Nome Fantasia:</strong> {data.nome_fantasia}
                </p>
                <p className="company-detail">
                    <strong className="company-label">CNPJ:</strong> {data.cnpj}
                </p>
                <p className="company-detail">
                    <strong className="company-label">Telefone:</strong> {data.telefone}
                </p>
            </div>
        );
    };
    const changeStatusActivateandDelete = async (rowData: CompanyEntity) => {
        await handleActiveOrInativeEmpresa(rowData, msgs, listPaginationEmpresa, listarInativos, setLoading, searchTerm, setListPaginationEmpresa);
    };
    return (
        <div className="mt-0">
            <Messages ref={msgs} className="custom-messages" />
            {loading ? (
                <LoadingScreen loadingText={'Carregando...'} />
            ) : (
                <>
                    {isMobile && (
                        <div>
                            <DataTableComponent
                                value={listPaginationEmpresa?.content as CompanyEntity[]}
                                loading={loading}
                                totalRecords={listPaginationEmpresa?.size ?? 0}
                                expandedRows={expandedRows}
                                setExpandedRows={setExpandedRows}
                                rowExpansionTemplate={rowExpansionTemplate}
                                expandButtonTemplate={(rowData) => defaultExpandButtonTemplate(rowData, expandedRows, setExpandedRows)}
                                isDarkMode={isDarkMode}
                                searchTerm={searchTerm}
                                editButtonTemplate={(rowData) => editButton(rowData, '/configuracoes/empresas/created', router)}
                                toggleStatusOrDeleteButtonTemplate={(rowData) =>
                                    toggleStatusOrDeleteButton({
                                        entity: rowData,
                                        onToggle: changeStatusActivateandDelete,
                                        entityType: ''
                                    })
                                }
                                showExpandButton={true}
                                columns={[
                                    {
                                        field: 'nomeFantasia',
                                        header: 'Nome Fantasia',
                                        body: (data) => {
                                            const isStatusInactive = data.ativo === false;
                                            return loading ? <Skeleton /> : <span className={isStatusInactive ? 'text-red-clear-custom' : ''}>{highlightSearchTerm(limitarText(data.nome_fantasia, 25), searchTerm)}</span>;
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
                                value={listPaginationEmpresa?.content as CompanyEntity[]}
                                loading={loading}
                                totalRecords={listPaginationEmpresa?.size ?? 0}
                                setExpandedRows={setExpandedRows}
                                expandedRows={expandedRows}
                                isDarkMode={isDarkMode}
                                searchTerm={searchTerm}
                                rowExpansionTemplate={rowExpansionTemplate}
                                expandButtonTemplate={(rowData) => defaultExpandButtonTemplate(rowData, expandedRows, setExpandedRows)}
                                editButtonTemplate={(rowData) => editButton(rowData, '/configuracoes/empresas/created', router)}
                                toggleStatusOrDeleteButtonTemplate={(rowData) =>
                                    toggleStatusOrDeleteButton({
                                        entity: rowData,
                                        onToggle: changeStatusActivateandDelete,
                                        entityType: ''
                                    })
                                }
                                columns={[
                                    {
                                        field: 'razaoSocial',
                                        header: 'Razão social',
                                        body: (data) => {
                                            const isStatusInactive = data.ativo === false;
                                            return loading ? <Skeleton /> : <span className={isStatusInactive ? 'text-red-clear-custom' : ''}>{highlightSearchTerm(limitarText(data.razao_social, 25), searchTerm)}</span>;
                                        }
                                    },
                                    {
                                        field: 'nomeFantasia',
                                        header: 'Nome Fantasia',
                                        body: (data) => {
                                            const isStatusInactive = data.ativo === false;
                                            return loading ? <Skeleton /> : <span className={isStatusInactive ? 'text-red-clear-custom' : ''}>{highlightSearchTerm(limitarText(data.nome_fantasia, 25), searchTerm)}</span>;
                                        }
                                    },
                                    {
                                        field: 'cnpj',
                                        header: 'CNPJ',
                                        body: (data) => {
                                            const isStatusInactive = data.ativo === false;
                                            return loading ? <Skeleton /> : <span className={isStatusInactive ? 'text-red-clear-custom' : ''}>{limitarText(data.cnpj, 20)}</span>;
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
export default ListarEmpresas;
