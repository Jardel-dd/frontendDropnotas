'use client';
import './style.css';
import '@/app/styles/styledGlobal.css';
import LoadingScreen from '@/app/loading';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { Skeleton } from 'primereact/skeleton';
import { Messages } from '@/app/components/messages/GlobalMessages';
import { NfsEntity } from '@/app/entity/NfsEntity';
import { useRouter } from 'next/navigation';
import { StatusNota } from '../types/statusClassNfs';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { limitarText } from '@/app/utils/limitTextDataCompany';
import { Dispatch, SetStateAction, useContext, useRef } from 'react';
import { CancelarNfs } from '@/app/components/dataTableComponent/DataTableComponent';
import {
    DataTableSelectable,
    downloadPdfButton,
    downloadXmlButton,
    visualiarButton
} from '@/app/components/dataTableComponent/dataTableSelectAll';
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
    const notas = listPaginationNotaServico?.content || [];
    const selectableNotas = notas.filter(
        (nota: NfsEntity) => canSelectPendingNota && nota.status_nota === 'PENDENTE'
    );
    const allSelectableRowsSelected =
        selectableNotas.length > 0 &&
        selectableNotas.every((nota: NfsEntity) =>
            selectedNotas.some((selectedNota) => selectedNota.id === nota.id)
        );

    const formatarDataEmissao = (dataEmissao?: string) => {
        if (!dataEmissao) return '-';

        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(dataEmissao));
    };

    const formatarValor = (valor?: number | string) =>
        new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(Number(valor) || 0);

    const handleCorrecao = (nota: NfsEntity) => {
        const query = new URLSearchParams();

        if (nota.referencia) {
            query.set('referencia', nota.referencia);
        }

        if (!query.toString()) return;

        router.push(`/notaServico/created?${query.toString()}`);
    };

    const toggleNotaSelection = (nota: NfsEntity, checked: boolean) => {
        if (!canSelectPendingNota || nota.status_nota !== 'PENDENTE') return;

        if (checked) {
            if (!selectedNotas.some((selectedNota) => selectedNota.id === nota.id)) {
                setSelectedNotas([...selectedNotas, nota]);
            }
            return;
        }

        setSelectedNotas(selectedNotas.filter((selectedNota) => selectedNota.id !== nota.id));
    };

    const toggleAllSelectableNotas = (checked: boolean) => {
        if (selectableNotas.length === 0) return;

        if (!checked) {
            setSelectedNotas(
                selectedNotas.filter(
                    (selectedNota) => !selectableNotas.some((nota: NfsEntity) => nota.id === selectedNota.id)
                )
            );
            return;
        }

        setSelectedNotas([
            ...selectedNotas.filter(
                (selectedNota) => !selectableNotas.some((nota: NfsEntity) => nota.id === selectedNota.id)
            ),
            ...selectableNotas
        ]);
    };

    const renderExtraActions = (rowData: NfsEntity, compact = false) => {
        if (rowData.status_nota === 'REJEITADA') {
            if (!canCorrectRejectedNota) {
                return null;
            }

            return (
                <Button
                    label="CORRECAO"
                    icon="pi pi-pencil"
                    outlined
                    severity="warning"
                    tooltip="Correcao"
                    className={compact ? 'nota-servico-btn-correcao' : 'nota-servico-btn-correcao'}
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
                <LoadingScreen loadingText={'Carregando Notas Fiscais...'} />
            ) : (
                <div>
                    {isDesktop && (
                        <DataTableSelectable<NfsEntity>
                            data={notas}
                            selected={selectedNotas}
                            onSelectionChange={setSelectedNotas}
                            isRowSelectable={(nota) => canSelectPendingNota && nota.status_nota === 'PENDENTE'}
                            dataKey="id"
                            loading={loading}
                            isDarkMode={isDarkMode}
                            columns={[
                                {
                                    field: 'numero_rps',
                                    header: 'Numero',
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
                                    header: 'Data de Emissao',
                                    body: (data) => <span>{formatarDataEmissao(data.data_emissao)}</span>
                                },
                                {
                                    field: 'total_valor_servico',
                                    header: 'Valor',
                                    body: (data) => <span>{formatarValor(data.total_valor_servico)}</span>
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
                        <div className="nota-servico-mobile-list">
                            {selectableNotas.length > 0 && (
                                <div className="nota-servico-mobile-select-all">
                                    <Checkbox
                                        inputId="selecionar-todas-notas-mobile"
                                        checked={allSelectableRowsSelected}
                                        onChange={(e) => toggleAllSelectableNotas(Boolean(e.checked))}
                                    />
                                    <label htmlFor="selecionar-todas-notas-mobile">Selecionar pendentes</label>
                                </div>
                            )}

                            {notas.length === 0 ? (
                                <div className="nota-servico-mobile-empty">
                                    Nenhum resultado encontrado na pesquisa
                                </div>
                            ) : (
                                notas.map((nota: NfsEntity) => {
                                    const isSelectable = canSelectPendingNota && nota.status_nota === 'PENDENTE';
                                    const isSelected = selectedNotas.some((selectedNota) => selectedNota.id === nota.id);

                                    return (
                                        <div
                                            key={nota.id ?? `${nota.numero_rps}-${nota.referencia}`}
                                            className="nota-servico-mobile-card"
                                        >
                                            <div className="nota-servico-mobile-card-top">
                                                <div className="nota-servico-mobile-card-summary-grid">
                                                    <div className="nota-servico-mobile-card-detail">
                                                        <span className="nota-servico-mobile-card-label">Numero</span>
                                                        <span className="nota-servico-mobile-card-value">
                                                            {highlightSearchTerm(
                                                                limitarText(nota.numero_rps, 25),
                                                                searchTerm
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div className="nota-servico-mobile-card-detail">
                                                        <span className="nota-servico-mobile-card-label">Data Emissao</span>
                                                        <span className="nota-servico-mobile-card-meta-value">
                                                            {formatarDataEmissao(nota.data_emissao)}
                                                        </span>
                                                    </div>
                                                    <div className="nota-servico-mobile-card-detail nota-servico-mobile-card-status-detail">
                                                        <span className="nota-servico-mobile-card-label">Status</span>
                                                        <span
                                                            className={`nota-servico-mobile-status ${StatusNota(
                                                                nota.status_nota ?? ''
                                                            )}`}
                                                        >
                                                            {nota.status_nota || '-'}
                                                        </span>
                                                    </div>
                                                </div>
                                                {isSelectable && (
                                                    <div className="nota-servico-mobile-card-select">
                                                        <Checkbox
                                                            checked={isSelected}
                                                            onChange={(e) => toggleNotaSelection(nota, Boolean(e.checked))}
                                                        />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="nota-servico-mobile-card-body">
                                                <div className="nota-servico-mobile-card-detail">
                                                    <span className="nota-servico-mobile-card-label">Cliente</span>
                                                    <span
                                                        className="nota-servico-mobile-card-text"
                                                        title={nota.razao_social_cliente}
                                                    >
                                                        {highlightSearchTerm(
                                                            nota.razao_social_cliente,
                                                            searchTerm
                                                        )}
                                                    </span>
                                                </div>

                                                <div className="nota-servico-mobile-card-detail">
                                                    <span className="nota-servico-mobile-card-label">Empresa</span>
                                                    <span
                                                        className="nota-servico-mobile-card-text"
                                                        title={nota.razao_social_empresa}
                                                    >
                                                        {highlightSearchTerm(
                                                            nota.razao_social_empresa,
                                                            searchTerm
                                                        )}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="nota-servico-mobile-card-footer">
                                                <div className="nota-servico-mobile-actions">
                                                    {renderExtraActions(nota, true)}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default ListarNotaServico;
