import { ReactNode } from "react";
export const normalize = (value: unknown) => (value === null || value === undefined ? null : String(value));
export function ensureSelectedItemsInList(list: any[], selectedItems: any[], dataKey?: string) {
    if (!dataKey || !Array.isArray(selectedItems) || selectedItems.length === 0) {
        return list;
    }

    const selectedItemsByKey = new Map(
        selectedItems.map((item) => [normalize(item?.[dataKey]), item])
    );

    const mergedList = list.map((item) => {
        const itemKey = normalize(item?.[dataKey]);
        return selectedItemsByKey.get(itemKey) ?? item;
    });

    const existingKeys = new Set(mergedList.map((item) => normalize(item?.[dataKey])));
    const missingItems = selectedItems.filter((item) => !existingKeys.has(normalize(item?.[dataKey])));

    return missingItems.length > 0 ? [...missingItems, ...mergedList] : mergedList;
}
export type MultiSelectProps = {
    selectedItems: any[];
    id: string;
    onChange: (e: any) => void;
    options: any[];
    optionLabel: string;
    placeholder: string;
    maxSelectedLabels?: number;
    className?: string;
    showChips: boolean;
    errorMessage?: string;
    hasError?: boolean;
    fetchFilteredItems?: (filter: string) => Promise<any[]>;
    fetchAllItems?: () => Promise<any[]>;
    autoSelectSingle?: boolean;
    dataKey?: string;
    initialSelectedValues?: Array<string | number>;
    showAddButton?: boolean;
    onAddClick?: () => void;
    onEditClick?: (item: any) => void;
    minSearchChars?: number;
    maxResults?: number;
    showTopLabel?: boolean;
    topLabel?: string | ReactNode;
    required?: boolean;
};
