'use client';
import api from '@/app/services/api';
import '@/app/styles/styledGlobal.css';
import './styledDataTableComponent.css';
import LoadingScreen from '@/app/loading';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { useRouter } from 'next/navigation';
import { Divider } from 'primereact/divider';
import { Skeleton } from 'primereact/skeleton';
import { Messages } from 'primereact/messages';
import Input from '@/app/shared/include/input/input-all';
import { IconReal } from '@/app/utils/icons/icons';
import { NfsEntity } from '@/app/entity/NfsEntity';
import { ChangeEvent, useRef, useState } from 'react';
import { confirmDialog } from 'primereact/confirmdialog';
import CustomInputNumber from '@/app/shared/include/inputReal/inputReal';
import { DataTable, DataTableRowToggleEvent } from 'primereact/datatable';
import InputTextarea from '@/app/shared/include/inputTextArea/InputTextarea';
type CancelarNfsActionProps = {
    nota: NfsEntity;
    msgs: React.RefObject<Messages | null>;
};
export interface ColumnProps {
    field: string;
    header: string;
    body: (data: any) => React.ReactNode;
}
export interface DataTableComponentProps<T> {
    value: T[];
    loading: boolean;
    totalRecords: number;
    expandedRows: any[] | false;
    setExpandedRows: React.Dispatch<React.SetStateAction<any[]>>;
    rowExpansionTemplate: (data: any) => React.ReactNode;
    expandButtonTemplate: (rowData: T) => React.ReactNode;
    editButtonTemplate?: (rowData: any) => React.ReactNode;
    toggleStatusOrDeleteButtonTemplate?: (rowData: any) => React.ReactNode;
    columns: ColumnProps[];
    isDarkMode: boolean;
    searchTerm: string;
    showExpandButton?: boolean;
    listarInativos: boolean;
    cliente?: boolean;
    fornecedor?: boolean;
    selectionMode?: 'multiple' | 'checkbox';
    rowClick?: boolean;
    extraActionsTemplate?: (rowData: T) => React.ReactNode;
}
export interface Identifiable {
    id: number | string;
}
export interface ToggleButtonProps<T> {
    entity: T & { ativo: boolean };
    onToggle: (entity: T) => Promise<void>;
    entityType: string;
}
export const highlightSearchTerm = (text: any, searchTerm: string) => {
    if (!searchTerm) return text;
    const safeText = String(text);
    const parts = safeText.split(new RegExp(`(${searchTerm})`, 'gi'));
    return parts.map((part, index) =>
        part.toLowerCase() === searchTerm.toLowerCase() ? (
            <span key={index} style={{ color: 'var(--primary-color)' }}>
                {part}
            </span>
        ) : (
            part
        )
    );
};
export const DataTableComponent = <T extends Identifiable>({
    value,
    loading,
    totalRecords,
    expandedRows,
    setExpandedRows,
    rowExpansionTemplate,
    expandButtonTemplate,
    isDarkMode,
    editButtonTemplate,
    toggleStatusOrDeleteButtonTemplate,
    columns,
    searchTerm,
    listarInativos,
    cliente = false,
    fornecedor = false,
    showExpandButton = true,
    rowClick = false,
    selectionMode = 'multiple',
    extraActionsTemplate
}: DataTableComponentProps<T>) => {
    const msgs = useRef<Messages>(null);
    return (
        <>
            <Messages ref={msgs} className="custom-messages" />
            <DataTable
                value={value}
                scrollable
                expandedRows={expandedRows === false ? undefined : expandedRows}
                onRowToggle={(e: DataTableRowToggleEvent) => {
                    if (Array.isArray(e.data)) {
                        setExpandedRows(e.data);
                    } else {
                        setExpandedRows([]);
                    }
                }}
                rowExpansionTemplate={rowExpansionTemplate}
                className="p-datatable-row-expansion"
                emptyMessage={loading ? <LoadingScreen loadingText={''} /> : 'Nenhum resultado encontrado na pesquisa'}
                totalRecords={totalRecords}
            >
                {showExpandButton && <Column expander={true} body={expandButtonTemplate} className="width-3rem-Collum-Btn-Plus-Desktop-left" headerStyle={{ background: isDarkMode ? '#162A41' : '#EFF3F8' }} />}

                {columns.map((col) => (
                    <Column key={col.field} field={col.field} header={col.header} body={col.body} headerStyle={{ background: isDarkMode ? '#162A41' : '#EFF3F8' }} className="custom-title-column-list" />
                ))}
                <Column
                    header="Ações"
                    body={(rowData) => (
                        <div className="flex-gap-0-5rem">
                            {loading ? (
                                <>
                                    <Skeleton shape="circle" width="2rem" height="2rem" />
                                    <Skeleton shape="circle" width="2rem" height="2rem" />
                                </>
                            ) : (
                                <>
                                    {editButtonTemplate?.(rowData)}
                                    {toggleStatusOrDeleteButtonTemplate?.(rowData)}
                                    {extraActionsTemplate?.(rowData)}
                                </>
                            )}
                        </div>
                    )}
                    headerStyle={{ background: isDarkMode ? '#162A41' : '#EFF3F8' }}
                    className="width-3rem-Collum-Btn-Plus-Desktop-Rigth"
                />
            </DataTable>
        </>
    );
};
export const handleEdit = <T extends { id?: number | string }>(entity: T, basePath: string, router: ReturnType<typeof useRouter>) => {
    const queryParams = new URLSearchParams({
        id: entity.id?.toString() ?? ''
    }).toString();
    router.push(`${basePath}?${queryParams}`);
};
export const editButton = <T extends { id?: number | string }>(entity: T, basePath: string, router: ReturnType<typeof useRouter>) => {
    return <Button icon="pi pi-pencil" tooltip="Alterar" className="p-button-text p-button-warning bottom-All-plus-datatableDetails" onClick={() => handleEdit(entity, basePath, router)} />;
};
export const defaultExpandButtonTemplate = <T extends Identifiable>(rowData: T, expandedRows: any[], setExpandedRows: React.Dispatch<React.SetStateAction<any[]>>) => {
    const isExpanded = expandedRows.some((row) => row.id === rowData.id);
    return (
        <Button
            tooltip="Detalhes"
            icon={isExpanded ? 'pi pi-minus' : 'pi pi-plus'}
            className="bottom-All-plus-datatableDetails p-button-text"
            onClick={() => {
                const newExpandedRows = isExpanded ? expandedRows.filter((row) => row.id !== rowData.id) : [...expandedRows, rowData];
                setExpandedRows(newExpandedRows);
            }}
        />
    );
};
export const toggleStatusOrDeleteButton = <T,>({ entity, onToggle, entityType }: ToggleButtonProps<T>) => {
    const style = entity.ativo
        ? {
              icon: 'pi pi-trash',
              style: 'p-button-danger',
              tooltip: `Desativar ${entityType}`,
              message: `Tem certeza que deseja <strong style="color:red">&nbsp;Desativar&nbsp;</strong> este ${entityType}?`
          }
        : {
              icon: 'pi pi-refresh',
              style: 'p-button-success',
              tooltip: `Ativar ${entityType}`,
              message: `Tem certeza que deseja <strong style="color:#3DBF98">&nbsp;Ativar&nbsp;</strong> este ${entityType}?`
          };

    const handleConfirm = () => {
        confirmDialog({
            message: <span dangerouslySetInnerHTML={{ __html: style.message }} />,
            header: 'Confirmação',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sim',
            rejectLabel: 'Não',
            className: 'custom-confirm-buttons',
            acceptClassName: 'btn-sim',
            rejectClassName: 'p-button-outlined btn-nao',
            accept: async () => await onToggle(entity)
        });
    };
    return <Button icon={style.icon} tooltip={style.tooltip} className={`p-button-text ${style.style} bottom-All-plus-datatableDetails`} style={{ fontSize: '1rem', width: '2rem', height: '2rem' }} onClick={handleConfirm} />;
};
export function CancelarNfs({ nota, msgs }: CancelarNfsActionProps) {
    const [visible, setVisible] = useState(false);
    const [motivo, setMotivo] = useState('');
    const handleCancelar = async () => {
        if (!nota?.id) return;
        try {
            await api.post(`/nfse/cancelar`, { id: nota.id, motivo });
            msgs.current?.show({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'NFS-e cancelada com sucesso.'
            });
            setVisible(false);
            setMotivo('');
        } catch {
            msgs.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Não foi possível cancelar a NFS-e.'
            });
        }
    };
    return (
        <>
            <Button icon="pi pi-times" tooltip="Cancelar" className="p-button-text bottom-All-plus-datatableDetails" style={{ color: 'red', boxShadow: 'none' }} onClick={() => setVisible(true)} />

            <Dialog header="Cancelar NFS" visible={visible} style={{ width: '60rem' }} draggable={false} modal onHide={() => setVisible(false)}>
                <div className="grid formgrid">
                    <div className="col-12 mb-1 lg:col-5">
                        <label>Nome da Empresa:</label>
                        <Input disabled value={nota.razao_social_empresa || ''} label="Razão Social do Prestador" onChange={function (_e: ChangeEvent<HTMLInputElement>): void {}} />
                    </div>
                    <div className="col-12 mb-1 lg:col-4">
                        <label>Nome do Cliente:</label>
                        <Input disabled value={nota.razao_social_cliente || ''} label="Razão Social do Tomador" onChange={function (_e: ChangeEvent<HTMLInputElement>): void {}} />
                    </div>
                    <div className="col-12 mb-1 lg:col-3 lg:mb-0">
                        <label>Valor da Nota:</label>
                        <CustomInputNumber value={nota.total_valor_servico ?? 0} label="Valor" useRightButton disabled outlined iconLeft={<IconReal isDarkMode={false} />} onChange={() => {}} />
                    </div>
                </div>

                <div className="p-fluid">
                    <div className="field">
                        <label htmlFor="motivo">Motivo do Cancelamento</label>
                        <InputTextarea id="motivo" rows={4} value={motivo} onChange={(e) => setMotivo(e.target.value)} label="Motivo do Cancelamento" />
                    </div>
                </div>

                <Divider />

                <div className="flex justify-between gap-2 mt-4 w-full" style={{ padding: '0 1rem' }}>
                    <Button label="Cancelar" className="p-button-danger" onClick={handleCancelar} disabled={!motivo.trim()} />
                    <Button label="Voltar" className="p-button" outlined onClick={() => setVisible(false)} />
                </div>
            </Dialog>
        </>
    );
}
