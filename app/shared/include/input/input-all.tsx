'use client';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { ChangeEvent, FocusEvent, ChangeEventHandler, ReactNode, useContext, useState, RefObject } from 'react';
import './Input.css';
import { useDebouncedCallback } from 'use-debounce';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { Mandatory } from '../../mandatory/InputMandatory';

type InputProps = {
    value: string | number;
    onChange: ChangeEventHandler<HTMLInputElement>;
    label: string;
    outlined?: boolean;
    onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
    iconRight?: string | ReactNode;
    iconLeft?: string | ReactNode;
    useRightButton?: boolean;
    disabledRightButton?: boolean;
    id?: string;
    isSearch?: boolean;
    loading?: boolean;
    icon?: string;
    inputRef?: RefObject<HTMLInputElement>;
    type?: 'button' | 'checkbox' | 'color' | 'date' | 'datetime-local' | 'email' | 'file' | 'hidden' | 'image' | 'month' | 'number' | 'password' | 'radio' | 'range' | 'reset' | 'search' | 'submit' | 'tel' | 'text' | 'time' | 'url' | 'week';
    onClickSearch?: () => void;
    isIconOnly?: boolean;
    className?: string;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    autoFocus?: boolean;
    maxLength?: number;
    readOnly?: boolean;
    errorMessage?: string;
    hasError?: boolean;
    disabled?: boolean;
    noInputValue?: boolean;
    showTopLabel?: boolean;
    topLabel?: string | ReactNode;
    required?: boolean;
    min?: number;
};

function Input({
    value,
    onChange,
    onClickSearch,
    label,
    icon,
    iconRight,
    useRightButton,
    outlined,
    id,
    type,
    loading,
    isSearch,
    isIconOnly,
    className,
    iconLeft,
    inputRef,
    onClick,
    autoFocus,
    onBlur,
    maxLength,
    readOnly = false,
    hasError,
    errorMessage,
    disabled,
    noInputValue,
    showTopLabel,
    topLabel,
    required,
    min
}: InputProps) {
    const { layoutConfig } = useContext(LayoutContext);
    const [isLoading, setIsLoading] = useState(false);
    const isDarkMode = layoutConfig.colorScheme === 'dark';
    const debounced = useDebouncedCallback(async (event: ChangeEvent<HTMLInputElement>) => {
        console.log('debounce:', event.target.value);
        if (onChange) {
            onChange(event);
        }
    }, 500);
    const handleSearchClick = async () => {
        setIsLoading(true);
        if (onClickSearch) {
            try {
                await onClickSearch();
            } finally {
                setIsLoading(false);
            }
        }
    };
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
            <div className="p-inputgroup flex-1 styled-on-focus styled-on-hover" style={{ border: '1px solid rgb(62, 79, 98)', borderRadius: '6px' }}>
                {iconLeft && (
                    <span className="p-inputgroup-addon" style={{ background: isDarkMode ? '#293B51' : '#FFFFFF', border: 'none' }}>
                        {typeof iconLeft === 'string' ? <i className={`pi ${iconLeft}`} style={{ color: isDarkMode ? '#E3E6E8' : '#495057' }}></i> : iconLeft}
                    </span>
                )}
                <div className="w-full">
                    <InputText
                        id={id}
                        type={type}
                        min={min}
                        disabled={disabled}
                        value={value !== null && value !== undefined ? String(value) : ''}
                        onChange={(event) => (isSearch ? debounced(event) : onChange(event))}
                        placeholder={label}
                        onBlur={onBlur}
                        autoFocus={autoFocus}
                        ref={inputRef}
                        maxLength={maxLength}
                        readOnly={readOnly}
                        style={{
                            boxShadow: 'none',
                            background: isDarkMode ? '#293B51' : '#FFFFFF',
                            width: '100%',
                            border: 'none',
                            height:40
                        }}
                    />
                </div>
                {useRightButton && outlined && iconRight && !isIconOnly && (
                    <Button
                        icon={loading ? 'pi pi-spin pi-spinner' : iconRight}
                        outlined={outlined}
                        onClick={onClick ? onClick : handleSearchClick}
                        style={{
                            background: isDarkMode ? '#293B51' : '#FFFFFF',
                            color: isDarkMode ? '#FFFFFF' : '#495057',
                            borderColor: isDarkMode ? '#3e4f62' : '#ced4da',
                            boxShadow: 'none',
                            border: 'none'
                        }}
                    />
                )}
            </div>
            <div style={{ height: 15, display: 'flex', alignItems: 'flex-end' }}>{errorMessage && <small className="p-error block">{errorMessage}</small>}</div>
        </div>
    );
}
export default Input;
