import { NfsEntity } from "@/app/entity/NfsEntity";
import { Messages } from "primereact/messages";

export type CancelarNfsActionProps = {
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