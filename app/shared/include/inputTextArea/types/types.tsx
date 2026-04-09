import { ChangeEventHandler, ReactNode } from "react";

export type InputTextareaProps = {
    value: string;
    onChange: ChangeEventHandler<HTMLTextAreaElement>;
    label: string;
    rows?: number;
    cols?: number;
    placeholder?: string;
    disabled?: boolean;
    id?: string;
    maxLength?: number;
    className?: string;
    style?: React.CSSProperties;
    showTopLabel?: boolean;
    topLabel?: string | ReactNode;
    required?: boolean;
};