import { InputNumberValueChangeEvent } from "primereact/inputnumber";
import { ReactNode } from "react";

export type CustomInputNumberProps = {
    value: number | string;
    onChange: (e: InputNumberValueChangeEvent) => void;
    currency?: string;
    locale?: string;
    label?: string;
    useRightButton?: boolean;
    outlined?: boolean;
    iconLeft?: React.ReactNode;
    id?: string;
    className?: string;
    readOnly?: boolean;
    placeholder?: string;
    errorMessage?: string;
    hasError?: boolean;
    disabled?: boolean;
    showTopLabel?: boolean;
    topLabel?: string | ReactNode;
    required?: boolean;
};