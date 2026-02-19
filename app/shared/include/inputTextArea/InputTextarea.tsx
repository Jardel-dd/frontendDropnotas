import { Mandatory } from '../../mandatory/InputMandatory';
import { LayoutContext } from '@/layout/context/layoutcontext';
import React, { ChangeEventHandler, ReactNode, useContext } from 'react';
import { InputTextarea as PrimeInputTextarea } from 'primereact/inputtextarea';

type InputTextareaProps = {
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
const InputTextarea: React.FC<InputTextareaProps> = ({ value, onChange, label, rows = 5, cols = 30, placeholder, disabled = false, id, maxLength, className, style, showTopLabel, topLabel, required }) => {
    const { layoutConfig } = useContext(LayoutContext);
    const isDarkMode = layoutConfig.colorScheme === 'dark';
    return (
        <>
         {showTopLabel && topLabel && (
                <label className="filter-label flex my-1 items-center">
                    {topLabel}
                    <div>
                    {required && <Mandatory />}
                    </div>
                </label>
            )}
        <div className={`p-inputgroup flex-1 ${className}`}>
            <PrimeInputTextarea
                id={id}
                value={value}
                onChange={onChange}
                rows={rows}
                cols={cols}
                placeholder={placeholder || label}
                disabled={disabled}
                maxLength={maxLength}
                className={className}
                style={{
                    background: isDarkMode ? '#293B51' : '#FFFFFF',
                    boxShadow: 'none',
                    borderRadius: '6px',
                    ...style
                }}
            />
        </div>
        </>
    );
};

export default InputTextarea;
