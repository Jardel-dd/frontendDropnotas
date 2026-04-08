'use client';
import React, { useRef, ReactNode, useState } from 'react';
import { Button } from 'primereact/button';
import './style.css';
import { useTheme } from '@/app/components/isDarkMode/isDarkMode';
import { Mandatory } from '../../mandatory/InputMandatory';
import { InputText } from 'primereact/inputtext';

interface InputMaskDropProps {
    value: string | undefined;
    onChange: (e: { value: string; target: { value: string; id?: string } }) => void;
    iconRight?: string | ReactNode;
    useRightButton?: boolean;
    onBlur?: () => void;
    onFocus?: () => void;
    onClickSearch: () => void;
    mask: string;
    outlined: boolean;
    placeholder?: string;
    disabledRightButton?: boolean;
    iconLeft?: string | ReactNode;
    id: string;
    loading?: boolean;
    autoFocus?: boolean;
    className?: string;
    hasError?: boolean;
    errorMessage?: string;
    readOnly?: boolean;
    showTopLabel?: boolean;
    topLabel?: string | ReactNode;
    required?: boolean;
}

export const InputMaskDrop: React.FC<InputMaskDropProps> = ({
    id,
    loading,
    mask,
    placeholder,
    outlined,
    value,
    onChange,
    onBlur,
    onFocus,
    iconRight,
    iconLeft,
    useRightButton,
    onClickSearch,
    disabledRightButton,
    readOnly = false,
    className,
    autoFocus,
    hasError,
    errorMessage,
    showTopLabel,
    topLabel,
    required
}) => {
    const { isDarkMode } = useTheme();
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [displayValue, setDisplayValue] = React.useState('');
    const [isLoading, setIsLoading] = useState(false);
    const maxDigits = mask.split('').filter(char => char === '9').length;
    const applyDynamicMask = (value: string, mask: string) => {
        let masked = '';
        let valueIndex = 0;

        for (let i = 0; i < mask.length && valueIndex < value.length; i++) {
            if (mask[i] === '9') {
                masked += value[valueIndex];
                valueIndex++;
            } else {
                if (valueIndex < value.length) {
                    masked += mask[i];
                }
            }
        }
        return masked;
    };
    React.useEffect(() => {
        setDisplayValue(applyDynamicMask(value || '', mask));
    }, [value, mask]);
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let onlyDigits = e.target.value.replace(/\D/g, '');

        if (onlyDigits.length > maxDigits) {
            onlyDigits = onlyDigits.slice(0, maxDigits);
        }

        const masked = applyDynamicMask(onlyDigits, mask);
        setDisplayValue(masked);
        onChange({ value: onlyDigits, target: { value: onlyDigits, id } });
    };
    const handleFocus = () => {
        setTimeout(() => {
            inputRef.current?.setSelectionRange(0, 0);
        }, 0);

        if (onFocus) onFocus();
    };
    const handleSearchClick = async () => {
        setIsLoading(true);
        try {
            await onClickSearch();
        } finally {
            setIsLoading(false);
        }
    };
    const onlyDigits = (value || '').replace(/\D/g, '');
    const rightButtonDisabled = disabledRightButton ?? (onlyDigits.length !== maxDigits);
    return (
        <div className="p-field" style={{ width: '100%', height:'85px', maxHeight:"85px"}}>
            {showTopLabel && topLabel && (
                <div style={{ height: 'var(--form-label-height)', display:"flex", alignItems:"center" }}>
                    <label className="filter-label">
                        {topLabel}
                        {required && <Mandatory />}
                    </label>
                </div>
            )}
            <div className={`p-inputgroup flex-1 styled-on-focus styled-on-hover custom-input ${hasError ? 'input-error' : ''}`}
                style={{
                    border: isDarkMode ? '1px solid #3e4f62' : '1px solid #ced4da',
                    borderRadius: '6px'
                }}>
                {iconLeft && (
                    <span className="p-inputgroup-addon" style={{
                            background: isDarkMode ? '#293B51' : '#FFFFFF',
                            border: 'none'
                        }}
                    >
                        {typeof iconLeft === 'string' ? (
                            <i
                                className={iconLeft}
                                style={{
                                    color: isDarkMode ? '#E3E6E8' : '#495057'
                                }}
                            />
                        ) : (
                            iconLeft
                        )}
                    </span>
                )}
                <div className="w-full">
                    <InputText
                        id={id}
                        type="text"
                        value={displayValue}
                        placeholder={placeholder}
                        onFocus={handleFocus}
                        onBlur={onBlur}
                        onChange={handleInputChange}
                        ref={inputRef}
                        readOnly={readOnly}
                        autoFocus={autoFocus}
                        className="p-inputtext p-component"
                        style={{
                            boxShadow: 'none',
                            background: isDarkMode ? '#293B51' : '#FFFFFF',
                            width: '100%',
                            border: 'none',
                            height: 'var(--form-control-height)'
                        }}
                    />
                </div>
                {useRightButton && iconRight && (
                    <Button
                        icon={loading || isLoading ? 'pi pi-spin pi-spinner' : iconRight}
                        outlined={outlined}
                        onClick={handleSearchClick}
                        disabled={rightButtonDisabled || loading || isLoading}
                        style={{
                            background: isDarkMode ? '#293B51' : '#FFFFFF',
                            color: isDarkMode ? '#FFFFFF' : '#495057',
                            borderColor: isDarkMode ? '#3e4f62' : '#ced4da',
                            boxShadow: 'none',
                            border: 'none',
                            width: 'var(--form-control-height)',
                            minWidth: 'var(--form-control-height)',
                            height: 'var(--form-control-height)'
                        }}
                    />
                )}
            </div>
            <div style={{ height: 'var(--form-feedback-height)', display: 'flex', alignItems: 'flex-end' }}>
                {hasError && errorMessage && <small className="p-error block">{errorMessage}</small>}
            </div>
        </div>
    );
};
