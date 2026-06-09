import React from "react";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Messages } from "primereact/messages";
import { Checkbox } from "primereact/checkbox";
import { DataTable, DataTableRowToggleEvent } from "primereact/datatable";
import { NfsEntity } from "@/app/entity/NfsEntity";
import { downloadPdfNota, downloadXmlNota, visualizarPdfNota } from "@/app/(main)/notaServico/controller/controller";
import LoadingScreen from "@/app/loading";
import { useIsDesktop, useIsMobile } from "../responsiveCelular/responsive";

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
    // columns: { field: keyof T; header: string; body?: (rowData: T) => JSX.Element }[];
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
        <DataTable
            value={data}
            dataKey={dataKey as string}
            tableStyle={{ minWidth }}
            loading={loading}
            className={className}
            expandedRows={rowExpansionTemplate ? expandedRows : undefined}
            onRowToggle={(e: DataTableRowToggleEvent) => {
                if (!onExpandedRowsChange) return;
                onExpandedRowsChange(Array.isArray(e.data) ? (e.data as T[]) : []);
            }}
            rowExpansionTemplate={rowExpansionTemplate}
            emptyMessage={
                loading ? (
                    <LoadingScreen loadingText={""} />
                ) : "Nenhum resultado encontrado na pesquisa"
            }>
            {showExpandButton && rowExpansionTemplate && (
                <Column
                    expander
                    headerStyle={{ background: isDarkMode ? '#162A41' : '#EFF3F8', width: "3rem" }}
                    style={{ width: "3rem", textAlign: "center" }}
                />
            )}
            {isDesktop && (
                <Column
                    headerStyle={{ background: isDarkMode ? '#162A41' : '#EFF3F8' }}
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
                    headerStyle={{ background: isDarkMode ? '#162A41' : '#EFF3F8', width: "10px", maxWidth: "15px", }}
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
                        background: isDarkMode ? '#162A41' : '#EFF3F8',
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
                    headerStyle={{ background: isDarkMode ? '#162A41' : '#EFF3F8' }}
                />
            )}
        </DataTable>
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
            icon="pi pi-file-pdf"
            label={options?.label}
            tooltip="Baixar PDF"
            className={options?.className ?? "p-button-text bottom-All-plus-datatableDetails"}
            style={{
                fontSize: '1rem',
                width: '2rem',
                height: '2rem',
                color: 'GOLD',
                boxShadow: "none",
                ...options?.style
            }}
            onClick={() => downloadPdfNota(nota, msgs)}
        />
    );
};
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
            icon="pi pi-code"
            label={options?.label}
            tooltip="Baixar XML"
            className={options?.className ?? "p-button-text bottom-All-plus-datatableDetails"}
            style={{
                fontSize: '1rem',
                width: '2rem',
                height: '2rem',
                color: '#1976D2',
                boxShadow: "none",
                ...options?.style
            }}
            onClick={() => downloadXmlNota(nota, msgs)}
        />
    );
};
export const visualiarButton = (
    nota: NfsEntity,
    msgs: React.RefObject<Messages | null>
) => {
    return (
        <Button
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
            onClick={() => visualizarPdfNota(nota, msgs)}
        />
    );
};
