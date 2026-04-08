import './styles.css'
import {  useContext } from 'react';
import { DropdownProps } from './types/type';
import { Mandatory } from '../../mandatory/InputMandatory';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { Dropdown as PrimeDropdown } from 'primereact/dropdown';

function Dropdown({
    value,
    label,
    id,
    options,
    onChange,
    disabled = false,
    loading = false,
    placeholder,
    className,
    optionLabel,
    filterBy,
    valueTemplate,
    itemTemplate,
    optionValue,
    readOnly,
    hasError,
    errorMessage,
    style,
    showTopLabel,
    topLabel,
    topRightElement,
    required
}: DropdownProps) {
    const { layoutConfig } = useContext(LayoutContext);
    const isDarkMode = layoutConfig.colorScheme === 'dark';
    return (
        <div className="p-field" style={{ width: '100%', height:'85px', maxHeight:"85px"}}>
            {showTopLabel && (topLabel 
            || topRightElement) && (
                <div style={{ height: 'var(--form-label-height)', display:"flex", alignItems:"center" }}>
                    <label className="filter-label">
                        {topLabel}
                        {required && <Mandatory />}
                    </label>
                    {topRightElement}
                </div>
            )}
            <div className="w-full">
                <PrimeDropdown
                    id={id}
                    value={value}
                    optionLabel={optionLabel}
                    options={options}
                    onChange={onChange}
                    placeholder={placeholder || label}
                    disabled={disabled || readOnly}
                    loading={loading}
                    className={`${className} ${hasError ? 'p-invalid' : ''}`}
                    filter={filterBy}
                    optionValue={optionValue}
                    valueTemplate={valueTemplate}
                    itemTemplate={itemTemplate}
                    style={{
                        width: '100%',
                        background: isDarkMode ? '#293B51' : '#FFFFFF',
                        boxShadow: 'none',
                        border: isDarkMode ? '1px solid #3e4f62' : '1px solid #ced4da',  
                        height: 'var(--form-control-height)',
                        minHeight: 'var(--form-control-height)',
                    }}
                />
            </div>
             <div style={{ height: 'var(--form-feedback-height)', display: 'flex', alignItems: 'flex-end' }}> {errorMessage && <small className="p-error block">{errorMessage}</small>}
        </div>
        </div>
    );
}

export default Dropdown;
