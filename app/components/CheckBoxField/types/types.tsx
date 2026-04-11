export interface CheckBoxFieldProps {
    inputId: string;
    label: string;
    checked: boolean;
    onChange: (event: any) => void;
    className?: string;
}