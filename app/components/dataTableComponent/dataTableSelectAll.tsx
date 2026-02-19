import React, { JSX, useState } from "react";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Messages } from "primereact/messages";
import { Checkbox } from "primereact/checkbox";
import { DataTable } from "primereact/datatable";
import { NfsEntity } from "@/app/entity/NfsEntity";
import { downloadPdfNota, downloadXmlNota, visualizarPdfNota } from "@/app/(main)/notaServico/controller/controller";
import LoadingScreen from "@/app/loading";

export interface GenericColumn<T> {
    field: keyof T;
    header: string;
    style?: React.CSSProperties;
    body?: (rowData: T) => React.ReactNode;
}
interface DataTableSelectableProps<T extends NfsEntity> {
    data: T[];
    selected: T[];
    onSelectionChange: (selected: T[]) => void;
    columns: { field: keyof T; header: string; body?: (rowData: T) => JSX.Element }[];
    dataKey: keyof T;
    rowClick?: boolean;
    minWidth?: string;
    loading?: boolean;
    searchTerm?: string;
    isDarkMode: boolean;
    className?: string;
    extraActionsTemplate?: (rowData: T) => React.ReactNode;
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
    className
}: DataTableSelectableProps<T>) {

    const toggleSelection = (rowData: T, checked: boolean) => {
        if (checked) {
            if (!selected.some((n) => n.id === rowData.id)) {
                onSelectionChange([...selected, rowData]);
            }
        } else {
            onSelectionChange(selected.filter((n) => n.id !== rowData.id));
        }
    };
    const handleSelectAllToggle = () => {
        const selectableNotas = data.filter((n) => n.status_nota !== "REJEITADA");
        const allSelected = selectableNotas.every((n) =>
            selected.some((s) => s.id === n.id)
        );
        if (allSelected) {
            const updatedSelection = selected.filter(
                (s) => !selectableNotas.some((n) => n.id === s.id)
            );
            onSelectionChange(updatedSelection);
        } else {
            const updatedSelection = [
                ...selected.filter(
                    (s) => !selectableNotas.some((n) => n.id === s.id)
                ),
                ...selectableNotas,
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
            emptyMessage={
                loading ? (
                    <LoadingScreen loadingText={""} />
                ) : "Nenhum resultado encontrado na pesquisa"
            }
        >
            <Column
                headerStyle={{ background: isDarkMode ? '#162A41' : '#EFF3F8' }}
                header={
                    <Checkbox
                        checked={data
                            .filter((nota) => nota.status_nota !== "REJEITADA")
                            .every((n) => selected.some((s) => s.id === n.id))
                        }
                        onChange={handleSelectAllToggle}
                    />
                }
                body={(rowData) => (
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        {rowData.status_nota !== "REJEITADA" && (
                            <Checkbox
                                checked={selected.some((n) => n.id === rowData.id)}
                                onChange={(e) => toggleSelection(rowData, e.checked!)}
                            />
                        )}
                    </div>
                )}
                style={{ width: "3rem", textAlign: "center" }}
            />

            {columns.map((col) => (
                <Column
                    key={String(col.field)}
                    field={String(col.field)}
                    header={col.header}
                    body={col.body}
                    headerStyle={{ background: isDarkMode ? '#162A41' : '#EFF3F8' }}
                />
            ))}

            {extraActionsTemplate && (
                <Column
                    header="Ações"
                    body={(rowData) => extraActionsTemplate(rowData)}
                    style={{ textAlign: "center", width: "10rem" }}
                    headerStyle={{ background: isDarkMode ? '#162A41' : '#EFF3F8' }}
                />
            )}
        </DataTable>

    );
}
export const downloadPdfButton = (
    nota: NfsEntity,
    msgs: React.RefObject<Messages | null>
) => {
    return (
        <Button
            icon="pi pi-file-pdf"
            tooltip="Baixar PDF"
            className="p-button-text bottom-All-plus-datatableDetails"
            style={{
                fontSize: '1rem',
                width: '2rem',
                height: '2rem',
                color: 'GOLD',
                boxShadow: "none"
            }}
            onClick={() => downloadPdfNota(nota, msgs)}
        />
    );
};
export const downloadXmlButton = (
    nota: NfsEntity,
    msgs: React.RefObject<Messages | null>
) => {
    return (
        <Button
            icon="pi pi-code"
            tooltip="Baixar XML"
            className="p-button-text bottom-All-plus-datatableDetails"
            style={{
                fontSize: '1rem',
                width: '2rem',
                height: '2rem',
                color: '#1976D2',
                boxShadow: "none"
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
                color: "#FFFFFF",
                boxShadow: "none"

            }}
            onClick={() => visualizarPdfNota(nota, msgs)}
        />
    );
};