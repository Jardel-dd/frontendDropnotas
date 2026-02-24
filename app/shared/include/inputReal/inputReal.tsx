import { ReactNode, useContext, useRef } from 'react';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { Mandatory } from '../../mandatory/InputMandatory';

import "./sytles.css"

type CustomInputNumberProps = {
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

export function CustomInputNumber({
    value,
    onChange,
    currency = 'BRL',
    locale = 'pt-BR',
    label,
    className,
    useRightButton = false,
    outlined = false,
    iconLeft,
    id,
    readOnly = false,
    placeholder,
    hasError,
    errorMessage,
    disabled,
    showTopLabel,
    topLabel,
    required
}: CustomInputNumberProps) {
    const { layoutConfig } = useContext(LayoutContext);
    const isDarkMode = layoutConfig.colorScheme === 'dark';
    const inputRef = useRef<HTMLInputElement>(null);
    return (
        <div className="p-field" style={{ width: '100%' }}>
            {showTopLabel && topLabel && (
                <div style={{ height:25, display:"flex", alignItems:"center" }}>
                    <label className="filter-label">
                        {topLabel}
                        {required && <Mandatory />}
                    </label>
                </div>
            )}
           <div className="p-inputgroup flex-1 custom-input-number styled-on-focus styled-on-hover" style={{ border: '1px solid rgb(62, 79, 98)', borderRadius: '6px' }}>
                {iconLeft && (
                    <span className="p-inputgroup-addon" style={{ background: isDarkMode ? '#293B51' : '#FFFFFF', border: 'none' }}>
                        {typeof iconLeft === 'string' ? <i className={`pi ${iconLeft}`} style={{ color: isDarkMode ? '#E3E6E8' : '#495057' }}></i> : iconLeft}
                    </span>
                )}
                    <InputNumber
                        inputRef={inputRef}
                        id={id}
                        disabled={disabled}
                        value={value !== null && value !== undefined ? Number(value) : null}
                        onChange={(e) => {
                            onChange({
                                ...e,
                                value: e.value ?? 0,
                                target: {
                                    ...(e.originalEvent?.target as HTMLInputElement),
                                    id: id!,
                                    value: e.value ?? 0
                                }
                            } as unknown as InputNumberValueChangeEvent);
                        }}
                        onFocus={() => inputRef.current?.select()}
                        mode="decimal"
                        locale="pt-BR"
                        minFractionDigits={2}
                        currencyDisplay="code"
                        readOnly={readOnly}
                        placeholder={placeholder}
                       
                    />
            </div>
           <div style={{ height: 15, display: 'flex', alignItems: 'flex-end' }}> {errorMessage && <small className="p-error block">{errorMessage}</small>}
        </div>
        </div> 
    );
}

export default CustomInputNumber;
