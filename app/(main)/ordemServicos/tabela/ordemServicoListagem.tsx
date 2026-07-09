'use client';

import './style.css';
import LoadingScreen from '@/app/loading';
import { Button } from 'primereact/button';
import { Skeleton } from 'primereact/skeleton';
import { confirmDialog } from 'primereact/confirmdialog';
import { Messages } from '@/app/components/messages/GlobalMessages';
import { getStatusClassOs } from '../types/statusClassNfs';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { limitarText } from '@/app/utils/limitTextDataCompany';
import { ServiceOrderEntity } from '@/app/entity/ServiceOrderEntity';
import { useIsDesktop, useIsMobile } from '@/app/components/responsiveCelular/responsive';
import { useContext, useRef } from 'react';
import { highlightSearchTerm } from '@/app/components/dataTableComponent/types/types';
import { DataTableComponent, editButton } from '@/app/components/dataTableComponent/DataTableComponent';
import { useRouter } from 'next/navigation';
import { usePermissions } from '@/app/routes/permissoes';

export function ListarOrdemServico({
    listPaginationOrdemServico,
    loading,
    searchTerm,
    listarInativos,
    onDelete,
    mobileLoadMoreVisible = false,
    mobileLoadMoreLoading = false,
    onMobileLoadMore
}: {
    listPaginationOrdemServico: Record<string, any>;
    loading: boolean;
    searchTerm: string;
    listarInativos: boolean;
    onDelete: (rowData: ServiceOrderEntity) => Promise<void>;
    mobileLoadMoreVisible?: boolean;
    mobileLoadMoreLoading?: boolean;
    onMobileLoadMore?: () => void | Promise<void>;
}) {
    const isDesktop = useIsDesktop();
    const isMobile = useIsMobile();
    const msgs = useRef<Messages>(null);
    const router = useRouter();
    const { permissaoOrdemServico } = usePermissions();
    const { layoutConfig } = useContext(LayoutContext);
    const isDarkMode = layoutConfig.colorScheme === 'dark';
    const ordensServico = listPaginationOrdemServico?.content ?? [];

    const formatDateTime = (value?: Date | string | null) => {
        if (!value) {
            return '-';
        }

        const parsedDate = new Date(value);

        if (Number.isNaN(parsedDate.getTime())) {
            return '-';
        }

        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(parsedDate);
    };

    const deleteButtonTemplate = (rowData: ServiceOrderEntity) => {
        const handleConfirm = () => {
            confirmDialog({
                message: (
                    <span
                        dangerouslySetInnerHTML={{
                            __html:
                                'Tem certeza que deseja <strong style="color:red">&nbsp;Excluir&nbsp;</strong> esta Ordem de Servico?'
                        }}
                    />
                ),
                header: 'Confirmacao',
                icon: 'pi pi-exclamation-triangle',
                acceptLabel: 'Sim',
                rejectLabel: 'Nao',
                className: 'custom-confirm-buttons',
                acceptClassName: 'btn-sim',
                rejectClassName: 'p-button-outlined btn-nao',
                accept: async () => await onDelete(rowData)
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
        <div style={{ marginTop: '0', display: 'flex', flex: '1 1 auto', minHeight: 0, flexDirection: 'column' }}>
            <Messages ref={msgs} className="custom-messages" />
            <div>
                {isDesktop && (
                    <>
                        {loading ? (
                            <LoadingScreen loadingText="Carregando Ordens de Servicos..." />
                        ) : (
                            <div>
                                <DataTableComponent<ServiceOrderEntity>
                                    value={ordensServico}
                                    loading={loading}
                                    totalRecords={listPaginationOrdemServico?.size ?? 0}
                                    expandedRows={false}
                                    setExpandedRows={() => {}}
                                    rowExpansionTemplate={() => null}
                                    expandButtonTemplate={() => null}
                                    isDarkMode={isDarkMode}
                                    searchTerm={searchTerm}
                                    editButtonTemplate={
                                        permissaoOrdemServico.update
                                            ? (rowData) =>
                                                  editButton(
                                                      rowData,
                                                      '/ordemServicos/created',
                                                      router
                                                  )
                                            : undefined
                                    }
                                    toggleStatusOrDeleteButtonTemplate={
                                        permissaoOrdemServico.delete
                                            ? (rowData) => deleteButtonTemplate(rowData)
                                            : undefined
                                    }
                                    showExpandButton={false}
                                    columns={[
                                        {
                                            field: 'numero',
                                            header: 'Numero',
                                            body: (data) => {
                                                const isStatusInactive = data.ativo === false;
                                                return loading ? (
                                                    <Skeleton />
                                                ) : (
                                                    <span
                                                        className={
                                                            isStatusInactive ? 'text-red-custom' : ''
                                                        }
                                                    >
                                                        {highlightSearchTerm(
                                                            limitarText(String(data.numero ?? '-'), 25),
                                                            searchTerm
                                                        )}
                                                    </span>
                                                );
                                            }
                                        },
                                        {
                                            field: 'descricao',
                                            header: 'Descricao',
                                            body: (data) => {
                                                const isStatusInactive = data.ativo === false;
                                                return loading ? (
                                                    <Skeleton />
                                                ) : (
                                                    <span
                                                        className={
                                                            isStatusInactive ? 'text-red-custom' : ''
                                                        }
                                                    >
                                                        {highlightSearchTerm(
                                                            limitarText(data.descricao ?? '-', 25),
                                                            searchTerm
                                                        )}
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
                                                    <span
                                                        className={
                                                            isStatusInactive ? 'text-red-custom' : ''
                                                        }
                                                    >
                                                        {highlightSearchTerm(
                                                            limitarText(
                                                                data.razao_social_cliente ?? '-',
                                                                25
                                                            ),
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
                                                    <span
                                                        className={
                                                            isStatusInactive ? 'text-red-custom' : ''
                                                        }
                                                    >
                                                        {highlightSearchTerm(
                                                            limitarText(
                                                                data.razao_social_empresa ?? '-',
                                                                25
                                                            ),
                                                            searchTerm
                                                        )}
                                                    </span>
                                                );
                                            }
                                        },
                                        {
                                            field: 'data_hora_inicio',
                                            header: 'Data de Inicio',
                                            body: (data) => (
                                                <span>{formatDateTime(data.data_hora_inicio)}</span>
                                            )
                                        },
                                        {
                                            field: 'data_hora_prevista',
                                            header: 'Data Prevista',
                                            body: (data) => (
                                                <span>{formatDateTime(data.data_hora_prevista)}</span>
                                            )
                                        },
                                        {
                                            field: 'data_hora_conclusao',
                                            header: 'Data de Conclusao',
                                            body: (data) => (
                                                <span>{formatDateTime(data.data_hora_conclusao)}</span>
                                            )
                                        },
                                        {
                                            field: 'status',
                                            header: 'Status',
                                            body: (data) =>
                                                loading ? (
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
                                                        <div
                                                            style={{
                                                                display: 'flex',
                                                                justifyContent: 'center'
                                                            }}
                                                        >
                                                            {data.status}
                                                        </div>
                                                    </span>
                                                )
                                        }
                                    ]}
                                    listarInativos={listarInativos}
                                />
                            </div>
                        )}
                    </>
                )}
                {isMobile && (
                    <div className="ordem-servico-mobile-list">
                        {loading ? (
                            <LoadingScreen
                                loadingText="Carregando Ordens de Servicos..."
                                fullScreen={false}
                            />
                        ) : ordensServico.length === 0 ? (
                            <div className="ordem-servico-mobile-empty">
                                Nenhum resultado encontrado na pesquisa
                            </div>
                        ) : (
                            <>
                                {ordensServico.map((ordem: ServiceOrderEntity) => {
                                    const isStatusInactive = ordem.ativo === false;
                                    const hasActions =
                                        permissaoOrdemServico.update || permissaoOrdemServico.delete;

                                    return (
                                        <div
                                            key={ordem.id ?? ordem.numero}
                                            className="ordem-servico-mobile-card"
                                        >
                                            <div className="ordem-servico-mobile-card-top">
                                                <div className="ordem-servico-mobile-card-summary-grid">
                                                    <div className="ordem-servico-mobile-card-detail">
                                                        <span className="ordem-servico-mobile-card-label">
                                                            Numero
                                                        </span>
                                                        <span
                                                            className={`ordem-servico-mobile-card-value${isStatusInactive ? ' text-red-custom' : ''}`}
                                                        >
                                                            {highlightSearchTerm(
                                                                String(ordem.numero ?? '-'),
                                                                searchTerm
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div className="ordem-servico-mobile-card-detail">
                                                        <span className="ordem-servico-mobile-card-label">
                                                            Inicio
                                                        </span>
                                                        <span className="ordem-servico-mobile-card-meta-value">
                                                            {formatDateTime(ordem.data_hora_inicio)}
                                                        </span>
                                                    </div>
                                                    <div className="ordem-servico-mobile-card-detail ordem-servico-mobile-card-status-detail">
                                                        <span className="ordem-servico-mobile-card-label">
                                                            Status
                                                        </span>
                                                        <span
                                                            className={`ordem-servico-mobile-status ${getStatusClassOs(ordem.status ?? '')}`}
                                                        >
                                                            {ordem.status || '-'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="ordem-servico-mobile-card-body">
                                                <div className="ordem-servico-mobile-card-detail">
                                                    <span className="ordem-servico-mobile-card-label">
                                                        Descricao
                                                    </span>
                                                    <span
                                                        className={`ordem-servico-mobile-card-text${isStatusInactive ? ' text-red-custom' : ''}`}
                                                        title={ordem.descricao ?? ''}
                                                    >
                                                        {highlightSearchTerm(
                                                            ordem.descricao ?? '-',
                                                            searchTerm
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="ordem-servico-mobile-card-detail">
                                                    <span className="ordem-servico-mobile-card-label">
                                                        Cliente
                                                    </span>
                                                    <span
                                                        className={`ordem-servico-mobile-card-text${isStatusInactive ? ' text-red-custom' : ''}`}
                                                        title={ordem.razao_social_cliente ?? ''}
                                                    >
                                                        {highlightSearchTerm(
                                                            ordem.razao_social_cliente ?? '-',
                                                            searchTerm
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="ordem-servico-mobile-card-detail">
                                                    <span className="ordem-servico-mobile-card-label">
                                                        Empresa
                                                    </span>
                                                    <span
                                                        className={`ordem-servico-mobile-card-text${isStatusInactive ? ' text-red-custom' : ''}`}
                                                        title={ordem.razao_social_empresa ?? ''}
                                                    >
                                                        {highlightSearchTerm(
                                                            ordem.razao_social_empresa ?? '-',
                                                            searchTerm
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="ordem-servico-mobile-card-date-grid">
                                                    <div className="ordem-servico-mobile-card-detail">
                                                        <span className="ordem-servico-mobile-card-label">
                                                            Prevista
                                                        </span>
                                                        <span className="ordem-servico-mobile-card-meta-value">
                                                            {formatDateTime(ordem.data_hora_prevista)}
                                                        </span>
                                                    </div>
                                                    <div className="ordem-servico-mobile-card-detail">
                                                        <span className="ordem-servico-mobile-card-label">
                                                            Conclusao
                                                        </span>
                                                        <span className="ordem-servico-mobile-card-meta-value">
                                                            {formatDateTime(ordem.data_hora_conclusao)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {hasActions && (
                                                <div className="ordem-servico-mobile-actions">
                                                    {permissaoOrdemServico.update &&
                                                        editButton(
                                                            ordem,
                                                            '/ordemServicos/created',
                                                            router
                                                        )}
                                                    {permissaoOrdemServico.delete &&
                                                        deleteButtonTemplate(ordem)}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                                {mobileLoadMoreVisible && onMobileLoadMore && (
                                    <div className="ordem-servico-mobile-load-more">
                                        <Button
                                            type="button"
                                            outlined
                                            label={
                                                mobileLoadMoreLoading
                                                    ? 'Carregando...'
                                                    : 'Carregar mais'
                                            }
                                            loading={mobileLoadMoreLoading}
                                            disabled={mobileLoadMoreLoading || loading}
                                            onClick={() => {
                                                void onMobileLoadMore();
                                            }}
                                        />
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ListarOrdemServico;
