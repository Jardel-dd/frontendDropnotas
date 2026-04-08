'use client';

import React from 'react';
import { Column } from 'primereact/column';
import { Checkbox, CheckboxChangeEvent } from 'primereact/checkbox';
import { DataTable } from 'primereact/datatable';
import LoadingScreen from '@/app/loading';

export interface DataTableMultiSelectColumn<T> {
    field: keyof T;
    header: string;
    style?: React.CSSProperties;
    headerStyle?: React.CSSProperties;
    className?: string;
    body?: (rowData: T) => React.ReactNode;
}

export interface DataTableMultiSelectProps<T extends Record<string, any>> {
    data: T[];
    selected: T[];
    onSelectionChange: (selected: T[]) => void;
    columns: DataTableMultiSelectColumn<T>[];
    dataKey: keyof T;
    isDarkMode: boolean;
    minWidth?: string;
    loading?: boolean;
    className?: string;
    tableStyle?: React.CSSProperties;
    emptyMessage?: React.ReactNode;
    extraActionsTemplate?: (rowData: T) => React.ReactNode;
    actionsHeader?: string;
    actionsColumnStyle?: React.CSSProperties;
    isRowSelectable?: (rowData: T) => boolean;
}

const getDefaultHeaderStyle = (isDarkMode: boolean, style?: React.CSSProperties): React.CSSProperties => ({
    background: isDarkMode ? '#162A41' : '#EFF3F8',
    ...style,
});

const getRowIdentifier = <T extends Record<string, any>>(rowData: T, dataKey: keyof T) => rowData[dataKey];

export function DataTableMultiSelect<T extends Record<string, any>>({
    data,
    selected,
    onSelectionChange,
    columns,
    dataKey,
    isDarkMode,
    minWidth = '50rem',
    loading = false,
    className,
    tableStyle,
    emptyMessage,
    extraActionsTemplate,
    actionsHeader = 'Ações',
    actionsColumnStyle,
    isRowSelectable,
}: DataTableMultiSelectProps<T>) {
    const canSelectRow = isRowSelectable ?? (() => true);

    const isRowSelected = (rowData: T) => {
        const rowIdentifier = getRowIdentifier(rowData, dataKey);

        return selected.some((selectedRow) => getRowIdentifier(selectedRow, dataKey) === rowIdentifier);
    };

    const toggleSelection = (rowData: T, checked: boolean) => {
        const rowIdentifier = getRowIdentifier(rowData, dataKey);

        if (checked) {
            if (!selected.some((selectedRow) => getRowIdentifier(selectedRow, dataKey) === rowIdentifier)) {
                onSelectionChange([...selected, rowData]);
            }
            return;
        }

        onSelectionChange(
            selected.filter((selectedRow) => getRowIdentifier(selectedRow, dataKey) !== rowIdentifier)
        );
    };

    const handleSelectAllToggle = (_event: CheckboxChangeEvent) => {
        const selectableRows = data.filter(canSelectRow);
        const allSelected =
            selectableRows.length > 0 && selectableRows.every((rowData) => isRowSelected(rowData));

        if (allSelected) {
            const updatedSelection = selected.filter(
                (selectedRow) =>
                    !selectableRows.some(
                        (rowData) => getRowIdentifier(rowData, dataKey) === getRowIdentifier(selectedRow, dataKey)
                    )
            );

            onSelectionChange(updatedSelection);
            return;
        }

        const rowsToAdd = selectableRows.filter((rowData) => !isRowSelected(rowData));
        onSelectionChange([...selected, ...rowsToAdd]);
    };

    const selectableRows = data.filter(canSelectRow);
    const allSelectableRowsSelected =
        selectableRows.length > 0 && selectableRows.every((rowData) => isRowSelected(rowData));

    return (
        <DataTable
            value={data}
            dataKey={String(dataKey)}
            tableStyle={tableStyle ?? { minWidth }}
            loading={loading}
            className={className}
            emptyMessage={
                loading ? (
                    <LoadingScreen loadingText="" />
                ) : (
                    emptyMessage ?? 'Nenhum resultado encontrado na pesquisa'
                )
            }
        >
            <Column
                headerStyle={getDefaultHeaderStyle(isDarkMode)}
                header={
                    <Checkbox
                        checked={allSelectableRowsSelected}
                        disabled={selectableRows.length === 0}
                        onChange={handleSelectAllToggle}
                    />
                }
                body={(rowData: T) => (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {canSelectRow(rowData) && (
                            <Checkbox
                                checked={isRowSelected(rowData)}
                                onChange={(event) => toggleSelection(rowData, !!event.checked)}
                            />
                        )}
                    </div>
                )}
                style={{ width: '3rem', textAlign: 'center' }}
            />

            {columns.map((column) => (
                <Column
                    key={String(column.field)}
                    field={String(column.field)}
                    header={column.header}
                    body={column.body}
                    style={column.style}
                    className={column.className}
                    headerStyle={getDefaultHeaderStyle(isDarkMode, column.headerStyle)}
                />
            ))}

            {extraActionsTemplate && (
                <Column
                    header={actionsHeader}
                    body={(rowData: T) => extraActionsTemplate(rowData)}
                    style={actionsColumnStyle ?? { textAlign: 'center', width: '10rem' }}
                    headerStyle={getDefaultHeaderStyle(isDarkMode)}
                />
            )}
        </DataTable>
    );
}

export default DataTableMultiSelect;
