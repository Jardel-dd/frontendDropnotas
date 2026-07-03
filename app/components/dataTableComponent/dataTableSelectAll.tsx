import React from "react";
import "./styledDataTableComponent.css";
import LoadingScreen from "@/app/loading";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Messages } from "primereact/messages";
import { Checkbox } from "primereact/checkbox";
import { confirmDialog } from "primereact/confirmdialog";
import { NfsEntity } from "@/app/entity/NfsEntity";
import { DataTable, DataTableRowToggleEvent } from "primereact/datatable";
import { useIsDesktop, useIsMobile } from "../responsiveCelular/responsive";
import { downloadArquivosNota, downloadPdfNota, downloadXmlNota, visualizarPdfNota } from "@/app/(main)/notaServico/controller/controller";

const NOTA_SERVICO_DOWNLOAD_CONFIRM_GROUP = "nota-servico-download";

const isMobileActionContext = () => {
    if (typeof window === "undefined" || typeof navigator === "undefined") {
        return false;
    }

    const matchesViewport = typeof window.matchMedia === "function" && window.matchMedia("(max-width: 868px)").matches;
    const hasTouchPoints = typeof navigator.maxTouchPoints === "number" && navigator.maxTouchPoints > 0;

    return matchesViewport || hasTouchPoints;
};

const confirmMobileDownloadAction = (
    message: string,
    action: () => void | Promise<void>
) => {
    confirmDialog({
        group: NOTA_SERVICO_DOWNLOAD_CONFIRM_GROUP,
        message,
        header: "Confirmação",
        icon: "pi pi-download",
        acceptLabel: "Baixar",
        rejectLabel: "Cancelar",
        className: "custom-confirm-buttons",
        acceptClassName: "btn-sim",
        rejectClassName: "p-button-outlined btn-nao",
        accept: async () => await action()
    });
};

const handleActionButtonClick = (
    event: React.MouseEvent<HTMLElement>,
    action: () => void | Promise<void>
) => {
    event.preventDefault();
    event.stopPropagation();
    void action();
};

export interface GenericColumn<T> {
    field: keyof T;
    header: string;
    style?: React.CSSProperties;
    body?: (rowData: T) => React.ReactNode;
    headerStyle?: React.CSSProperties;
    className?: string;
}

interface DataTableSelectableProps<T extends NfsEntity> {
    data: T[];
    selected: T[];
    onSelectionChange: (selected: T[]) => void;
    columns: GenericColumn<T>[];
    dataKey: keyof T;
    rowClick?: boolean;
    minWidth?: string;
    loading?: boolean;
    searchTerm?: string;
    isDarkMode: boolean;
    className?: string;
    extraActionsTemplate?: (rowData: T) => React.ReactNode;
    isRowSelectable?: (rowData: T) => boolean;
    expandedRows?: T[];
    onExpandedRowsChange?: (rows: T[]) => void;
    rowExpansionTemplate?: (rowData: T) => React.ReactNode;
    showExpandButton?: boolean;
}

export function DataTableSelectable<T extends NfsEntity>({
    data,
    onSelectionChange,
    columns,
    dataKey,
    rowClick = false,
    minWidth = "50rem",
    loading = false,
    searchTerm = "",
    isDarkMode,
    selected,
    extraActionsTemplate,
    className,
    isRowSelectable = (rowData) => rowData.status_nota !== "REJEITADA",
    expandedRows,
    onExpandedRowsChange,
    rowExpansionTemplate,
    showExpandButton = false
}: DataTableSelectableProps<T>) {
    const isMobile = useIsMobile();
    const isDesktop = useIsDesktop();
    const selectableRows = data.filter(isRowSelectable);
    const allSelectableRowsSelected =
        selectableRows.length > 0 &&
        selectableRows.every((n) => selected.some((s) => s.id === n.id));

    const toggleSelection = (rowData: T, checked: boolean) => {
        if (!isRowSelectable(rowData)) return;

        if (checked) {
            if (!selected.some((n) => n.id === rowData.id)) {
                onSelectionChange([...selected, rowData]);
            }
        } else {
            onSelectionChange(selected.filter((n) => n.id !== rowData.id));
        }
    };

    const handleSelectAllToggle = () => {
        if (selectableRows.length === 0) return;

        if (allSelectableRowsSelected) {
            const updatedSelection = selected.filter(
                (s) => !selectableRows.some((n) => n.id === s.id)
            );
            onSelectionChange(updatedSelection);
        } else {
            const updatedSelection = [
                ...selected.filter(
                    (s) => !selectableRows.some((n) => n.id === s.id)
                ),
                ...selectableRows,
            ];
            onSelectionChange(updatedSelection);
        }
    };

    return (
        <div className={`datatable-selectable-shell${loading ? " datatable-selectable-shell-loading" : ""}`}>
            <DataTable
                value={data}
                dataKey={dataKey as string}
                tableStyle={{ minWidth }}
                loading={false}
                className={className}
                expandedRows={rowExpansionTemplate ? expandedRows : undefined}
                onRowToggle={(e: DataTableRowToggleEvent) => {
                    if (!onExpandedRowsChange) return;
                    onExpandedRowsChange(Array.isArray(e.data) ? (e.data as T[]) : []);
                }}
                rowExpansionTemplate={rowExpansionTemplate}
                emptyMessage="Nenhum resultado encontrado na pesquisa"
            >
                {showExpandButton && rowExpansionTemplate && (
                    <Column
                        expander
                        headerStyle={{ background: isDarkMode ? "#162A41" : "#EFF3F8", width: "3rem" }}
                        style={{ width: "3rem", textAlign: "center" }}
                    />
                )}
                {isDesktop && (
                    <Column
                        headerStyle={{ background: isDarkMode ? "#162A41" : "#EFF3F8" }}
                        header={
                            <Checkbox
                                checked={allSelectableRowsSelected}
                                disabled={selectableRows.length === 0}
                                onChange={handleSelectAllToggle}
                            />
                        }
                        body={(rowData) => (
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                {isRowSelectable(rowData) && (
                                    <Checkbox
                                        checked={selected.some((n) => n.id === rowData.id)}
                                        onChange={(e) => toggleSelection(rowData, e.checked!)}
                                    />
                                )}
                            </div>
                        )}
                        style={{ width: "5px", textAlign: "center" }}
                    />
                )}
                {isMobile && (
                    <Column
                        headerStyle={{ background: isDarkMode ? "#162A41" : "#EFF3F8", width: "10px", maxWidth: "15px" }}
                        header={
                            <Checkbox
                                checked={allSelectableRowsSelected}
                                disabled={selectableRows.length === 0}
                                onChange={handleSelectAllToggle}
                            />
                        }
                        body={(rowData) => (
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                {isRowSelectable(rowData) && (
                                    <Checkbox
                                        checked={selected.some((n) => n.id === rowData.id)}
                                        onChange={(e) => toggleSelection(rowData, e.checked!)}
                                    />
                                )}
                            </div>
                        )}
                        style={{ width: "5px", textAlign: "center" }}
                    />
                )}

                {columns.map((col) => (
                    <Column
                        key={String(col.field)}
                        field={String(col.field)}
                        header={col.header}
                        body={col.body}
                        headerStyle={{
                            background: isDarkMode ? "#162A41" : "#EFF3F8",
                            ...col.headerStyle
                        }}
                        style={col.style}
                        className={col.className}
                    />
                ))}

                {extraActionsTemplate && (
                    <Column
                        header="Ações"
                        body={(rowData) => extraActionsTemplate(rowData)}
                        style={{ textAlign: "center" }}
                        headerStyle={{ background: isDarkMode ? "#162A41" : "#EFF3F8" }}
                    />
                )}
            </DataTable>
            {loading && (
                <div className="datatable-selectable-loading-overlay">
                    <LoadingScreen loadingText="Carregando..." fullScreen={false} />
                </div>
            )}
        </div>
    );
}

export const downloadPdfButton = (
    nota: NfsEntity,
    msgs: React.RefObject<Messages | null>,
    options?: {
        label?: string;
        className?: string;
        style?: React.CSSProperties;
    }
) => {
    return (
        <Button
            type="button"
            icon="pi pi-file-pdf"
            label={options?.label}
            tooltip="Baixar PDF"
            className={options?.className ?? "p-button-text bottom-All-plus-datatableDetails"}
            style={{
                fontSize: "1rem",
                width: "2rem",
                height: "2rem",
                color: "GOLD",
                boxShadow: "none",
                ...options?.style
            }}
            onClick={(event) =>
                handleActionButtonClick(event, () => {
                    if (isMobileActionContext()) {
                        confirmMobileDownloadAction(
                            "Deseja baixar o PDF desta nota no celular?",
                            () => downloadPdfNota(nota, msgs)
                        );
                        return;
                    }

                    return downloadPdfNota(nota, msgs);
                })
            }
        />
    );
};

export { NOTA_SERVICO_DOWNLOAD_CONFIRM_GROUP };

export const downloadXmlButton = (
    nota: NfsEntity,
    msgs: React.RefObject<Messages | null>,
    options?: {
        label?: string;
        className?: string;
        style?: React.CSSProperties;
    }
) => {
    return (
        <Button
            type="button"
            icon="pi pi-code"
            label={options?.label}
            tooltip="Baixar XML"
            className={options?.className ?? "p-button-text bottom-All-plus-datatableDetails"}
            style={{
                fontSize: "1rem",
                width: "2rem",
                height: "2rem",
                color: "#1976D2",
                boxShadow: "none",
                ...options?.style
            }}
            onClick={(event) =>
                handleActionButtonClick(event, () => {
                    if (isMobileActionContext()) {
                        confirmMobileDownloadAction(
                            "Deseja baixar o XML desta nota no celular?",
                            () => downloadXmlNota(nota, msgs)
                        );
                        return;
                    }

                    return downloadXmlNota(nota, msgs);
                })
            }
        />
    );
};

export const visualiarButton = (
    nota: NfsEntity,
    msgs: React.RefObject<Messages | null>
) => {
    return (
        <Button
            type="button"
            icon="pi pi-eye"
            tooltip="Visualizar PDF"
            className="p-button-text p-button-warning bottom-All-plus-datatableDetails"
            style={{
                fontSize: "1rem",
                width: "2rem",
                height: "2rem",
                color: "#64748B",
                boxShadow: "none"
            }}
            onClick={(event) => handleActionButtonClick(event, () => visualizarPdfNota(nota, msgs))}
        />
    );
};

export const downloadArquivosButton = (
    nota: NfsEntity,
    msgs: React.RefObject<Messages | null>,
    options?: {
        label?: string;
        className?: string;
        style?: React.CSSProperties;
    }
) => {
    return (
        <Button
            type="button"
            icon="pi pi-download"
            label={options?.label}
            tooltip="Baixar PDF e XML"
            className={options?.className ?? "p-button-text bottom-All-plus-datatableDetails"}
            style={{
                fontSize: "1rem",
                width: "2rem",
                height: "2rem",
                color: "#2E7D32",
                boxShadow: "none",
                ...options?.style
            }}
            onClick={(event) =>
                handleActionButtonClick(event, () => {
                    if (isMobileActionContext()) {
                        confirmMobileDownloadAction(
                            "Deseja baixar o arquivo com PDF e XML desta nota no celular?",
                            () => downloadArquivosNota(nota, msgs)
                        );
                        return;
                    }

                    return downloadArquivosNota(nota, msgs);
                })
            }
        />
    );
};
