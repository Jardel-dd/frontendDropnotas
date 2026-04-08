import { JSX, ReactNode } from "react";
import { DropdownChangeEvent } from "primereact/dropdown";
import { SelectItemOptionsType } from "primereact/selectitem";

export type DropdownProps = {
    value: any;
    label: string;
    id?: string;
    options?: SelectItemOptionsType;
    onChange: (event: DropdownChangeEvent) => void;
    disabled?: boolean;
    loading?: boolean;
    placeholder?: string;
    className?: string;
    optionLabel?: string;
    filterBy?: boolean;
    valueTemplate?: (option: any, props: any) => JSX.Element;
    itemTemplate?: (option: any) => JSX.Element;
    optionValue?: string;
    hasError?: boolean;
    errorMessage?: string;
    readOnly?: boolean;
    style?: string;
    showTopLabel?: boolean;
    topLabel?: string | ReactNode;
    required?: boolean;
    topRightElement?: ReactNode;
};