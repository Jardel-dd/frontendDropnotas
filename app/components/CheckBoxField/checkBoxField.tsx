import { Checkbox } from "primereact/checkbox";
import { CheckBoxFieldProps } from "./types/types";

export default function CheckBoxField({
    inputId,
    label,
    checked,
    onChange,
    className = "checkBoxMobile-width-max-10rem"
}: CheckBoxFieldProps) {
    return (
        <div className={className}>
            <div className="checkbox-container">
                <Checkbox
                    inputId={inputId}
                    onChange={onChange}
                    checked={checked}
                />
                <label htmlFor={inputId} className="ml-2">
                    {label}
                </label>
            </div>
        </div>
    );
}