'use client';
import '@/app/styles/styledGlobal.css';
import { Toast } from 'primereact/toast';
import { useRouter } from 'next/navigation';
import { Skeleton } from 'primereact/skeleton';
import { Messages } from 'primereact/messages';
import LoadingScreen from '@/app/loading';
import { ContratoEntity } from '@/app/entity/ContratoEntity';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { limitarText } from '@/app/utils/limitTextDataCompany';
import { handleActiveOrInativeContrato } from '../controller/controller';
import { Dispatch, SetStateAction, useContext, useRef, useState } from 'react';
import { useIsDesktop, useIsMobile } from '@/app/components/responsiveCelular/responsive';
import { DataTableComponent, defaultExpandButtonTemplate, editButton, highlightSearchTerm, toggleStatusOrDeleteButton } from '@/app/components/dataTableComponent/DataTableComponent';
export function ListarContratos({
    listPaginationContratos,
    setListPaginationContratos,
    loading,
    setLoading,
    searchTerm,
    listarInativos
}: {
    listPaginationContratos: Record<string, any>;
    loading: boolean;
    searchTerm: string;
    deletar: (id: number) => Promise<void>;
    ativar: (id: number) => Promise<void>;
    setListPaginationContratos: Dispatch<SetStateAction<any>>;
    setLoading: (state: boolean) => void;
    listarInativos: boolean;
}) {
    const router = useRouter();
    const isMobile = useIsMobile();
    const isDesktop = useIsDesktop();
    const toast = useRef<Toast>(null);
    const msgs = useRef<Messages>(null);
    const { layoutConfig } = useContext(LayoutContext);
    const isDarkMode = layoutConfig.colorScheme === 'dark';
    const [expandedRows, setExpandedRows] = useState<any[]>([]);
    const changeStatusActivateandDelete = async (rowData: ContratoEntity) => {
        await handleActiveOrInativeContrato(rowData, msgs, listPaginationContratos, listarInativos, setLoading, searchTerm, setListPaginationContratos);
    };
    return (
        <div style={{ marginTop: '0' }}>
            <Messages ref={msgs} className="custom-messages" />
            {loading ? (
                <LoadingScreen loadingText={'Carregando...'} />
            ) : (
                <>
                    {isMobile && (
                        <div>
                            <DataTableComponent
                                value={listPaginationContratos?.content as ContratoEntity[]}
                                loading={loading}
                                totalRecords={listPaginationContratos?.size ?? 0}
                                expandedRows={false}
                                setExpandedRows={() => {}}
                                rowExpansionTemplate={() => null}
                                expandButtonTemplate={(rowData) => defaultExpandButtonTemplate(rowData, expandedRows, setExpandedRows)}
                                isDarkMode={isDarkMode}
                                searchTerm={searchTerm}
                                editButtonTemplate={(rowData) => editButton(rowData, '/contrato/created', router)}
                                toggleStatusOrDeleteButtonTemplate={(rowData) =>
                                    toggleStatusOrDeleteButton({
                                        entity: rowData,
                                        onToggle: changeStatusActivateandDelete,
                                        entityType: ''
                                    })
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
                            />
                        </div>
                    )}
                    {isDesktop && (
                        <div style={{ overflow: 'auto' }}>
                            <DataTableComponent
                                value={listPaginationContratos?.content as ContratoEntity[]}
                                loading={loading}
                                totalRecords={listPaginationContratos?.size ?? 0}
                                expandedRows={false}
                                setExpandedRows={() => {}}
                                rowExpansionTemplate={() => null}
                                expandButtonTemplate={(rowData) => defaultExpandButtonTemplate(rowData, expandedRows, setExpandedRows)}
                                isDarkMode={isDarkMode}
                                searchTerm={searchTerm}
                                editButtonTemplate={(rowData) => editButton(rowData, '/contrato/created', router)}
                                toggleStatusOrDeleteButtonTemplate={(rowData) =>
                                    toggleStatusOrDeleteButton({
                                        entity: rowData,
                                        onToggle: changeStatusActivateandDelete,
                                        entityType: ''
                                    })
                                }
                                showExpandButton={false}
                                columns={[
                                    {
                                        field: 'descricao',
                                        header: 'Descrição do Contrato',
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
                                        header: 'Nome da Empresa',
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
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
export default ListarContratos;
