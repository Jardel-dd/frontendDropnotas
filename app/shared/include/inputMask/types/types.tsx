import { ReactNode } from "react";

export interface SingleDatePickerProps {
    value: Date | null;
    onChange: (date: Date | null) => void;
    onSearch?: (date: Date | null) => void;
    label?: string;
    placeholder?: string;
    className?: string;
    showTopLabel?: boolean;
    topLabel?: string | ReactNode;
    required?: boolean;
    topRightElement?: ReactNode;
}