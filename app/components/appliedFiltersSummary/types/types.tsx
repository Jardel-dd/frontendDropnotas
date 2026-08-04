export type AppliedFilterItem = {
    label: string;
    value: string | null | undefined;
    onRemove?: () => void;
};
export type AppliedFiltersSummaryProps = {
    items: AppliedFilterItem[];
    onClear?: () => void;
    title?: string;
    emptyLabel?: string;
    className?: string;
};
