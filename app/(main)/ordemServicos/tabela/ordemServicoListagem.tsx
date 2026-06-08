'use client';
import LoadingScreen from '@/app/loading';
import { Button } from 'primereact/button';
import { Skeleton } from 'primereact/skeleton';
import { confirmDialog } from 'primereact/confirmdialog';
import { Messages } from '@/app/components/messages/GlobalMessages';
import { getStatusClassOs } from '../types/statusClassNfs';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { limitarText } from '@/app/utils/limitTextDataCompany';
import { ServiceOrderEntity } from '@/app/entity/ServiceOrderEntity';
import { useIsDesktop } from '@/app/components/responsiveCelular/responsive';
import { Dispatch, SetStateAction, useContext, useRef } from 'react';
import { highlightSearchTerm } from '@/app/components/dataTableComponent/types/types';
import { DataTableComponent, editButton } from '@/app/components/dataTableComponent/DataTableComponent';
import { useRouter } from 'next/navigation';
import { usePermissions } from '@/app/routes/permissoes';
import { handleActiveOrInativeOrdemServicos } from '../controller/controller';

export function ListarOrdemServico({
    listPaginationOrdemServico,
    setListPaginationOrdemServico,
    loading,
    setLoading,
    searchTerm,
    listarInativos
}: {
    listPaginationOrdemServico: Record<string, any>;
    setListPaginationOrdemServico: Dispatch<SetStateAction<any>>;
    loading: boolean;
    searchTerm: string;
    setLoading: (state: boolean) => void;
    listarInativos: boolean;
}) {
    const isDesktop = useIsDesktop();
    const msgs = useRef<Messages>(null);
    const router = useRouter();
    const { permissaoOrdemServico } = usePermissions();
    const { layoutConfig } = useContext(LayoutContext);
    const isDarkMode = layoutConfig.colorScheme === 'dark';

    const handleDelete = async (rowData: ServiceOrderEntity) => {
        await handleActiveOrInativeOrdemServicos(
            rowData,
            msgs,
            listPaginationOrdemServico,
            listarInativos,
            setLoading,
            searchTerm,
            setListPaginationOrdemServico
        );
    };

    const deleteButtonTemplate = (rowData: ServiceOrderEntity) => {
        const handleConfirm = () => {
            confirmDialog({
                message: (
                    <span
                        dangerouslySetInnerHTML={{
                            __html:
                                'Tem certeza que deseja <strong style="color:red">&nbsp;Excluir&nbsp;</strong> esta Ordem de Serviço?'
                        }}
                    />
                ),
                header: 'Confirmação',
                icon: 'pi pi-exclamation-triangle',
                acceptLabel: 'Sim',
                rejectLabel: 'Não',
                className: 'custom-confirm-buttons',
                acceptClassName: 'btn-sim',
                rejectClassName: 'p-button-outlined btn-nao',
                accept: async () => await handleDelete(rowData)
            });
        };

        return (
            <Button
                icon="pi pi-trash"
                tooltip="Excluir"
                className="p-button-text p-button-danger bottom-All-plus-datatableDetails"
                style={{ fontSize: '1rem', width: '2rem', height: '2rem' }}
                onClick={handleConfirm}
            />
        );
    };

    return (
        <div style={{ marginTop: '0' }}>
            <Messages ref={msgs} className="custom-messages" />
            {loading ? (
                <LoadingScreen loadingText={'Carregando Ordens de Serviços...'} />
            ) : (
                <>
                    {isDesktop && (
                        <div>
                            <DataTableComponent<ServiceOrderEntity>
                                    value={listPaginationOrdemServico?.content}
                                    loading={loading}
                                    totalRecords={listPaginationOrdemServico?.size ?? 0}
                                    expandedRows={false}
                                    setExpandedRows={() => { } }
                                    rowExpansionTemplate={() => null}
                                    isDarkMode={isDarkMode}
                                    searchTerm={searchTerm}
                                    editButtonTemplate={permissaoOrdemServico.update
                                        ? (rowData) => editButton(rowData, '/ordemServicos/created', router)
                                        : undefined}
                                    toggleStatusOrDeleteButtonTemplate={permissaoOrdemServico.delete ? (rowData) => deleteButtonTemplate(rowData) : undefined}
                                    showExpandButton={false}
                                    columns={[
                                        {
                                            field: 'numero',
                                            header: 'Número',
                                            body: (data) => {
                                                const isStatusInactive = data.ativo === false;
                                                return loading ? (
                                                    <Skeleton />
                                                ) : (
                                                    <span className={isStatusInactive ? 'text-red-custom' : ''}>
                                                        {highlightSearchTerm(limitarText(data.numero, 25), searchTerm)}
                                                    </span>
                                                );
                                            }
                                        },
                                        {
                                            field: 'descricao',
                                            header: 'Descrição',
                                            body: (data) => {
                                                const isStatusInactive = data.ativo === false;
                                                return loading ? (
                                                    <Skeleton />
                                                ) : (
                                                    <span className={isStatusInactive ? 'text-red-custom' : ''}>
                                                        {highlightSearchTerm(limitarText(data.descricao, 25), searchTerm)}
                                                    </span>
                                                );
                                            }
                                        },
                                        {
                                            field: 'razao_social_cliente',
                                            header: 'Nome Cliente',
                                            body: (data) => {
                                                const isStatusInactive = data.ativo === false;
                                                return loading ? (
                                                    <Skeleton />
                                                ) : (
                                                    <span className={isStatusInactive ? 'text-red-custom' : ''}>
                                                        {highlightSearchTerm(
                                                            limitarText(data.razao_social_cliente, 25),
                                                            searchTerm
                                                        )}
                                                    </span>
                                                );
                                            }
                                        },
                                        {
                                            field: 'razao_social_empresa',
                                            header: 'Nome Empresa',
                                            body: (data) => {
                                                const isStatusInactive = data.ativo === false;
                                                return loading ? (
                                                    <Skeleton />
                                                ) : (
                                                    <span className={isStatusInactive ? 'text-red-custom' : ''}>
                                                        {highlightSearchTerm(
                                                            limitarText(data.razao_social_empresa, 25),
                                                            searchTerm
                                                        )}
                                                    </span>
                                                );
                                            }
                                        },
                                        {
                                            field: 'data_hora_inicio',
                                            header: 'Data de Início',
                                            body: (data) => {
                                                if (!data.data_hora_inicio) return <span>-</span>;
                                                const dataObj = new Date(data.data_hora_inicio);
                                                const dataFormatada = new Intl.DateTimeFormat('pt-BR', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                }).format(dataObj);

                                                return <span>{dataFormatada}</span>;
                                            }
                                        },
                                        {
                                            field: 'data_hora_prevista',
                                            header: 'Data Prevista',
                                            body: (data) => {
                                                if (!data.data_hora_prevista) return <span>-</span>;
                                                const dataObj = new Date(data.data_hora_prevista);
                                                const dataFormatada = new Intl.DateTimeFormat('pt-BR', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                }).format(dataObj);

                                                return <span>{dataFormatada}</span>;
                                            }
                                        },
                                        {
                                            field: 'data_hora_conclusao',
                                            header: 'Data de Conclusão',
                                            body: (data) => {
                                                if (!data.data_hora_conclusao) return <span>-</span>;
                                                const dataObj = new Date(data.data_hora_conclusao);
                                                const dataFormatada = new Intl.DateTimeFormat('pt-BR', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                }).format(dataObj);

                                                return <span>{dataFormatada}</span>;
                                            }
                                        },
                                        {
                                            field: 'status',
                                            header: 'Status',
                                            body: (data) => {
                                                return loading ? (
                                                    <Skeleton />
                                                ) : (
                                                    <span
                                                        style={{
                                                            borderRadius: '1rem',
                                                            width: '90%',
                                                            display: 'flex',
                                                            alignItems: 'center'
                                                        }}
                                                        className={`px-3 py-1 rounded-2xl text-sm font-medium inline-block ${getStatusClassOs(data.status ?? '')}`}
                                                    >
                                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                            {data.status}
                                                        </div>
                                                    </span>
                                                );
                                            }
                                        }
                                    ]}
                                    listarInativos={listarInativos} expandButtonTemplate={function (rowData: ServiceOrderEntity): React.ReactNode {
                                        throw new Error('Function not implemented.');
                                    } }                            />
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default ListarOrdemServico;
