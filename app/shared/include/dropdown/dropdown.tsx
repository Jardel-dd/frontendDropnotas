import './styles.css'
import { JSX, ReactNode, useContext } from 'react';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { SelectItemOptionsType } from 'primereact/selectitem';
import { Dropdown as PrimeDropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { Mandatory } from '../../mandatory/InputMandatory';

type DropdownProps = {
    value: any;
    label: string;
    id?: string;
    options?: SelectItemOptionsType;
    onChange: (event: DropdownChangeEvent) => void;
    disabled?: boolean;
    loading?: boolean;
    placeholder?: string;
    className?: string;
    optionLabel?: string;
    filterBy?: boolean;
    valueTemplate?: (option: any, props: any) => JSX.Element;
    itemTemplate?: (option: any) => JSX.Element;
    optionValue?: string;
    hasError?: boolean;
    errorMessage?: string;
    readOnly?: boolean;
    style?: string;
    showTopLabel?: boolean;
    topLabel?: string | ReactNode;
    required?: boolean;
    topRightElement?: ReactNode;
};

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
        <div className="p-field" style={{ width: '100%',height: '71px',   }}>
            {showTopLabel && (topLabel 
            || topRightElement) && (
                <div className="flex align-items-center justify-content-between my-1" style={{ height: '17px' }}>
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
                    }}
                />
            </div>
            {errorMessage && (
                <small className="p-error block" style={{ height: '24px' }}>
                    {errorMessage}
                </small>
            )}
        </div>
    );
}

export default Dropdown;
