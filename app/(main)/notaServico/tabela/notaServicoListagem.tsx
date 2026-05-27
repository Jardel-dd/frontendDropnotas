'use client';
import './style.css';
import '@/app/styles/styledGlobal.css';
import LoadingScreen from '@/app/loading';
import { Button } from 'primereact/button';
import { Skeleton } from 'primereact/skeleton';
import { Messages } from 'primereact/messages';
import { NfsEntity } from '@/app/entity/NfsEntity';
import { useRouter } from 'next/navigation';
import { StatusNota } from '../types/statusClassNfs';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { limitarText } from '@/app/utils/limitTextDataCompany';
import { Dispatch, SetStateAction, useContext, useRef } from 'react';
import { CancelarNfs } from '@/app/components/dataTableComponent/DataTableComponent';
import { DataTableSelectable, downloadPdfButton, downloadXmlButton, visualiarButton } from '@/app/components/dataTableComponent/dataTableSelectAll';
import { useIsDesktop, useIsMobile } from '@/app/components/responsiveCelular/responsive';
import { highlightSearchTerm } from '@/app/components/dataTableComponent/types/types';
import { usePermissions } from '@/app/routes/permissoes';

export function ListarNotaServico({
    listPaginationNotaServico,
    setListPaginationNotaServico,
    loading,
    setLoading,
    searchTerm,
    listarInativos,
    selectedNotas,
    setSelectedNotas
}: {
    listPaginationNotaServico: Record<string, any>;
    setListPaginationNotaServico: Dispatch<SetStateAction<any>>;
    loading: boolean;
    searchTerm: string;
    setLoading: (state: boolean) => void;
    listarInativos: boolean;
    selectedNotas: NfsEntity[];
    setSelectedNotas: (selected: NfsEntity[]) => void;
}) {
    const isMobile = useIsMobile();
    const isDesktop = useIsDesktop();
    const router = useRouter();
    const msgs = useRef<Messages>(null);
    const { layoutConfig } = useContext(LayoutContext);
    const { permissaoNfse } = usePermissions();
    const isDarkMode = layoutConfig.colorScheme === 'dark';

    const canCorrectRejectedNota = permissaoNfse.update;
    const canCancelNota = permissaoNfse.delete;
    const canSelectPendingNota = permissaoNfse.update;

    const handleCorrecao = (nota: NfsEntity) => {
        const query = new URLSearchParams();

        if (nota.referencia) {
            query.set('referencia', nota.referencia);
        }

        if (!query.toString()) return;

        router.push(`/notaServico/created?${query.toString()}`);
    };

    const renderExtraActions = (rowData: NfsEntity) => {
        if (rowData.status_nota === 'REJEITADA') {
            if (!canCorrectRejectedNota) {
                return null;
            }

            return (
                <Button
                    label="CORREÇÃO"
                    icon="pi pi-pencil"
                    outlined
                    severity="warning"
                    className="nota-servico-btn-correcao"
                    style={{
                        boxShadow: 'none'
                    }}
                    onClick={() => handleCorrecao(rowData)}
                />
            );
        }

        return (
            <>
                {visualiarButton(rowData, msgs)}
                {downloadXmlButton(rowData, msgs)}
                {downloadPdfButton(rowData, msgs)}
                {canCancelNota && <CancelarNfs nota={rowData} msgs={msgs} />}
            </>
        );
    };

    return (
        <div style={{ marginTop: '0' }}>
            <Messages ref={msgs} className="custom-messages" />
            {loading ? (
                <LoadingScreen loadingText={'Carregando...'} />
            ) : (
                <div>
                    {isDesktop && (
                        <DataTableSelectable<NfsEntity>
                            data={listPaginationNotaServico?.content || []}
                            selected={selectedNotas}
                            onSelectionChange={setSelectedNotas}
                            isRowSelectable={(nota) => canSelectPendingNota && nota.status_nota === 'PENDENTE'}
                            dataKey="id"
                            loading={loading}
                            isDarkMode={isDarkMode}
                            columns={[
                                {
                                    field: 'numero_rps',
                                    header: 'Número',
                                    body: (data) =>
                                        loading ? (
                                            <Skeleton />
                                        ) : (
                                            <span>
                                                {highlightSearchTerm(
                                                    limitarText(data.numero_rps, 10),
                                                    searchTerm
                                                )}
                                            </span>
                                        )
                                },

                                {
                                    field: 'razao_social_cliente',
                                    header: 'Nome Cliente',
                                    body: (data) => (
                                        <span
                                            className={isMobile ? 'line-clamp-mobile' : 'truncate-text'}
                                            title={data.razao_social_cliente}
                                        >
                                            {highlightSearchTerm(
                                                data.razao_social_cliente,
                                                searchTerm
                                            )}
                                        </span>
                                    )
                                },

                                {
                                    field: 'razao_social_empresa',
                                    header: 'Nome Empresa',
                                    body: (data) => (
                                        <span
                                            className={isMobile ? 'line-clamp-mobile' : 'truncate-text'}
                                            title={data.razao_social_empresa}
                                        >
                                            {highlightSearchTerm(
                                                data.razao_social_empresa,
                                                searchTerm
                                            )}
                                        </span>
                                    )
                                },

                                {
                                    field: 'data_emissao',
                                    header: 'Data de Emissão',
                                    body: (data) => {
                                        if (!data.data_emissao) return <span>-</span>;

                                        const dataObj = new Date(data.data_emissao);

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
                                    field: 'total_valor_servico',
                                    header: 'Valor',
                                    body: (data) => {
                                        const valor = Number(data.total_valor_servico) || 0;

                                        return (
                                            <span>
                                                {new Intl.NumberFormat('pt-BR', {
                                                    style: 'currency',
                                                    currency: 'BRL'
                                                }).format(valor)}
                                            </span>
                                        );
                                    }
                                },

                                {
                                    field: 'status_nota',
                                    header: 'Status',
                                    body: (data) => (
                                        <span
                                            style={{
                                                borderRadius: '1REM',
                                                width: '90%',
                                                display: 'flex',
                                                alignItems: 'center'
                                            }}
                                            className={`px-3 py-1 rounded-2xl text-sm font-medium inline-block ${StatusNota(
                                                data.status_nota ?? ''
                                            )}`}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                {data.status_nota}
                                            </div>
                                        </span>
                                    )
                                }
                            ]}
                            extraActionsTemplate={renderExtraActions}
                        />
                    )}
                    {isMobile && (
                        <DataTableSelectable<NfsEntity>
                            data={listPaginationNotaServico?.content || []}
                            selected={selectedNotas}
                            onSelectionChange={setSelectedNotas}
                            isRowSelectable={(nota) => canSelectPendingNota && nota.status_nota === 'PENDENTE'}
                            dataKey="id"
                            loading={loading}
                            isDarkMode={isDarkMode}
                            className="table-mobile"
                            columns={[
                                {
                                    field: 'numero_rps',
                                    header: 'Número',
                                    body: (data) => (loading ? <Skeleton /> : <span>{highlightSearchTerm(limitarText(data.numero_rps, 25), searchTerm)}</span>)
                                },
                                {
                                    field: 'razao_social_cliente',
                                    header: 'Nome Cliente',
                                    body: (data) => <span>{highlightSearchTerm(limitarText(data.razao_social_cliente, 25), searchTerm)}</span>
                                },
                                {
                                    field: 'status_nota',
                                    header: 'Status',
                                    body: (data) => (
                                        <span style={{ borderRadius: '1REM', width: '90%', display: 'flex', alignItems: 'center' }} className={`px-3 py-1 rounded-2xl text-sm font-medium inline-block ${StatusNota(data.status_nota ?? '')}`}>
                                            <div style={{ display: 'flex', justifyContent: 'center' }}>{data.status_nota}</div>
                                        </span>
                                    )
                                }
                            ]}
                            extraActionsTemplate={renderExtraActions}
                        />
                    )}
                </div>
            )}
        </div>
    );
}
export default ListarNotaServico;
