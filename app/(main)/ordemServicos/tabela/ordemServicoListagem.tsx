'use client';
import LoadingScreen from '@/app/loading';
import { Skeleton } from 'primereact/skeleton';
import { Messages } from 'primereact/messages';
import { getStatusClassOs } from '../types/statusClassNfs';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { limitarText } from '@/app/utils/limitTextDataCompany';
import { ServiceOrderEntity } from '@/app/entity/ServiceOrderEntity';
import { useIsDesktop } from '@/app/components/responsiveCelular/responsive';
import { Dispatch, SetStateAction, useContext, useRef, useState } from 'react';
import { highlightSearchTerm } from '@/app/components/dataTableComponent/types/types';
import { DataTableComponent, defaultExpandButtonTemplate} from '@/app/components/dataTableComponent/DataTableComponent';

export function ListarOrdemServico(
    {
        listPaginationOrdemServico,
        setListPaginationOrdemServico,
        loading,
        setLoading,
        searchTerm,
        listarInativos,
        deletar
    }: {
        listPaginationOrdemServico: Record<string, any>
        setListPaginationOrdemServico: Dispatch<SetStateAction<any>>;
        loading: boolean
        searchTerm: string
        setLoading: (state: boolean) => void;
        listarInativos: boolean;
        deletar: (id: number) => Promise<void>;
    }
) {
    const isDesktop = useIsDesktop();
    const msgs = useRef<Messages>(null);
    const { layoutConfig } = useContext(LayoutContext);
    const isDarkMode = layoutConfig.colorScheme === "dark";
    const [expandedRows, setExpandedRows] = useState<any[]>([]);
    return (
        <div style={{ marginTop: '0' }}>
            <Messages ref={msgs} className="custom-messages" />
            {loading ? (<LoadingScreen loadingText={'Carregando Ordens de Serviços...'} />) :
                (
                    <>
                        {isDesktop &&
                            <div>
                                <DataTableComponent<ServiceOrderEntity>
                                    value={listPaginationOrdemServico?.content}
                                    loading={loading}
                                    totalRecords={listPaginationOrdemServico?.size ?? 0}
                                    expandedRows={false}
                                    setExpandedRows={() => { }}
                                    rowExpansionTemplate={() => null}
                                    expandButtonTemplate={(rowData) =>
                                        defaultExpandButtonTemplate(rowData, expandedRows, setExpandedRows)
                                    }
                                    isDarkMode={isDarkMode}
                                    searchTerm={searchTerm}
                                    showExpandButton={false}
                                    columns={[
                                        {
                                            field: "numero",
                                            header: "Número",
                                            body: (data) => {
                                                const isStatusInactive = data.ativo === false;
                                                return loading ? (
                                                    <Skeleton />
                                                ) : (
                                                    <span className={isStatusInactive ? "text-red-custom" : ""}>
                                                        {highlightSearchTerm(limitarText(data.numero, 25), searchTerm)}
                                                    </span>
                                                );
                                            },
                                        },
                                        {
                                            field: "descricao",
                                            header: "Descrição",
                                            body: (data) => {
                                                const isStatusInactive = data.ativo === false;
                                                return loading ? (
                                                    <Skeleton />
                                                ) : (
                                                    <span className={isStatusInactive ? "text-red-custom" : ""}>
                                                        {highlightSearchTerm(
                                                            limitarText(data.descricao, 25),
                                                            searchTerm
                                                        )}
                                                    </span>
                                                );
                                            },
                                        },
                                        {
                                            field: "razao_social_cliente",
                                            header: "Nome Cliente",
                                            body: (data) => {
                                                const isStatusInactive = data.ativo === false;
                                                return loading ? (
                                                    <Skeleton />
                                                ) : (
                                                    <span className={isStatusInactive ? "text-red-custom" : ""}>
                                                        {highlightSearchTerm(
                                                            limitarText(data.razao_social_cliente, 25),
                                                            searchTerm
                                                        )}
                                                    </span>
                                                );
                                            },
                                        },
                                        {
                                            field: "razao_social_empresa",
                                            header: "Nome Empresa",
                                            body: (data) => {
                                                const isStatusInactive = data.ativo === false;
                                                return loading ? (
                                                    <Skeleton />
                                                ) : (
                                                    <span className={isStatusInactive ? "text-red-custom" : ""}>
                                                        {highlightSearchTerm(
                                                            limitarText(data.razao_social_empresa, 25),
                                                            searchTerm
                                                        )}
                                                    </span>
                                                );
                                            },
                                        },
                                        {
                                            field: "data_hora_inicio",
                                            header: "Data de Inicio",
                                            body: (data) => {
                                                if (!data.data_hora_inicio) return <span>-</span>;
                                                const dataObj = new Date(data.data_hora_inicio);
                                                const dataFormatada = new Intl.DateTimeFormat("pt-BR", {
                                                    day: "2-digit",
                                                    month: "2-digit",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                }).format(dataObj);

                                                return <span>{dataFormatada}</span>;
                                            },
                                        },
                                        {
                                            field: "data_hora_prevista",
                                            header: "Data Prevista",
                                            body: (data) => {
                                                if (!data.data_hora_prevista) return <span>-</span>;
                                                const dataObj = new Date(data.data_hora_prevista);
                                                const dataFormatada = new Intl.DateTimeFormat("pt-BR", {
                                                    day: "2-digit",
                                                    month: "2-digit",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                }).format(dataObj);

                                                return <span>{dataFormatada}</span>;
                                            },
                                        },
                                        {
                                            field: "data_hora_conclusao",
                                            header: "Data de Conclusão",
                                            body: (data) => {
                                                if (!data.data_hora_conclusao) return <span>-</span>;
                                                const dataObj = new Date(data.data_hora_conclusao);
                                                const dataFormatada = new Intl.DateTimeFormat("pt-BR", {
                                                    day: "2-digit",
                                                    month: "2-digit",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                }).format(dataObj);

                                                return <span>{dataFormatada}</span>;
                                            },
                                        },
                                        {
                                            field: "status",
                                            header: "Status",
                                            body: (data) => {
                                                return loading ? (
                                                    <Skeleton />
                                                ) : (

                                                    <span style={{ borderRadius: '1REM', width: '90%', display: 'flex', alignItems: 'center' }} className={`px-3 py-1 rounded-2xl text-sm font-medium inline-block ${getStatusClassOs(data.status ?? '')}`}>
                                                        <div style={{ display: 'flex', justifyContent: 'center' }}>{data.status}</div>
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
export default ListarOrdemServico;
