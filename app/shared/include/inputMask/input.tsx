'use client';
import React, { useRef, ReactNode } from 'react';
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

    // Conta o número máximo de dígitos baseado na máscara
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

        // Limita os dígitos ao máximo da máscara
        if (onlyDigits.length > maxDigits) {
            onlyDigits = onlyDigits.slice(0, maxDigits);
        }

        const masked = applyDynamicMask(onlyDigits, mask);
        setDisplayValue(masked);
        onChange({ value: onlyDigits, target: { value: onlyDigits, id } });
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        // Mantém o cursor no início
        setTimeout(() => {
            inputRef.current?.setSelectionRange(0, 0);
        }, 0);

        if (onFocus) onFocus();
    };

    const onlyDigits = (value || '').replace(/\D/g, '');
    const rightButtonDisabled = disabledRightButton ?? (onlyDigits.length !== maxDigits);

    return (
        <div className="p-field" style={{ width: '100%', height: '71px' }}>
            {showTopLabel && topLabel && (
                <div className="flex align-items-center justify-content-between my-1" style={{ height: '17px' }}>
                    <label className="filter-label">
                        {topLabel}
                        {required && <Mandatory />}
                    </label>
                </div>
            )}
            <div className={`p-inputgroup flex-1`} style={{ width: '100%' }}>
                {iconLeft && (
                    <span className="p-inputgroup-addon">
                        {typeof iconLeft === 'string' ? <i className={`pi ${iconLeft}`} style={{ color: '#FFF' }}></i> : iconLeft}
                    </span>
                )}
                <InputText
                    type="text"
                    value={displayValue}
                    placeholder={placeholder}
                    onFocus={handleFocus}
                    onBlur={onBlur}
                    onChange={handleInputChange}
                    ref={inputRef}
                    readOnly={readOnly}
                    className={`p-inputtext p-component ${hasError ? 'p-invalid' : ''}`}
                    autoFocus={autoFocus}
                    style={{
                        boxShadow: 'none',
                        background: isDarkMode ? '#293B51' : '#FFFFFF'
                    }}
                />
                {useRightButton && (
                    <Button
                        icon={loading ? 'pi pi-spin pi-spinner' : iconRight}
                        outlined={outlined}
                        onClick={onClickSearch}
                        disabled={rightButtonDisabled || loading}
                        className="p-button p-component"
                        style={{
                            background: isDarkMode ? '#293B51' : '#FFFFFF',
                            color: isDarkMode ? '#FFF' : '#000',
                            borderColor: isDarkMode ? '#3e4f62' : '#ced4da',
                            boxShadow: 'none'
                        }}
                    />
                )}
            </div>
            {hasError && errorMessage && <small className="p-error block">{errorMessage}</small>}
        </div>
    );
};