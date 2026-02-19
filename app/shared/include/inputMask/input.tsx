'use client';
import React, { useRef, ReactNode, RefObject } from 'react';
import { Button } from 'primereact/button';
import { InputMask, InputMaskChangeEvent } from 'primereact/inputmask';
import './style.css';
import { useTheme } from '@/app/components/isDarkMode/isDarkMode';
import { Mandatory } from '../../mandatory/InputMandatory';

interface InputMaskDropProps {
    value: string | undefined;
    onChange: (e: InputMaskChangeEvent) => void;
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
    inputRef?: RefObject<InputMask>;
    autoFocus?: boolean;
    className?: string;
    icon?: string;
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
    inputRef,
    readOnly = false,
    className,
    autoFocus,
    icon,
    hasError,
    errorMessage,
    showTopLabel,
    topLabel,
    required
}) => {
    const { isDarkMode } = useTheme();
    const inputMaskRef = useRef<InputMask | null>(null);

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        setTimeout(() => {
            const nativeInput = (inputMaskRef.current as any)?.inputElement as HTMLInputElement | undefined;
            if (nativeInput) {
                nativeInput.setSelectionRange(0, 0);
            }
        }, 0);
        if (onFocus) {
            onFocus();
        }
    };
    const handleChange = (e: InputMaskChangeEvent) => {
        const onlyDigits = e.value?.replace(/\D/g, '') || '';
        const syntheticEvent = {
            ...e,
            target: {
                ...e.target,
                value: onlyDigits
            },
            value: onlyDigits
        };

        onChange(syntheticEvent);
    };
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
                {iconLeft && <span className="p-inputgroup-addon">{typeof iconLeft === 'string' ? <i className={`pi ${iconLeft}`} style={{ color: '#FFF' }}></i> : iconLeft}</span>}
                <InputMask
                    mask={mask}
                    value={value}
                    onBlur={onBlur}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    placeholder={placeholder}
                    id={id}
                    ref={inputMaskRef}
                    readOnly={readOnly}
                    autoFocus={autoFocus}
                    className={`p-inputtext p-component ${hasError ? 'p-invalid' : ''} no-border-on-focus`}
                    style={{
                        boxShadow: 'none',
                        background: isDarkMode ? '#293B51' : '#FFFFFF'
                    }}
                    autoClear={false}
                    slotChar={''}
                />
                {useRightButton && (
                    <Button
                        icon={loading ? 'pi pi-spin pi-spinner' : iconRight}
                        outlined={outlined}
                        onClick={onClickSearch}
                        disabled={disabledRightButton || loading}
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
