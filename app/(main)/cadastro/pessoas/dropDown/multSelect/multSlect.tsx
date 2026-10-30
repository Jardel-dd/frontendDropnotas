import { Mandatory } from '@/app/shared/mandatory/InputMandatory';
import { useTheme } from '@/app/components/isDarkMode/isDarkMode';
import { MultiSelect as PrimeMultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect';

interface Option {
    label: string;
    value: any;
}

interface MultiSelectProps {
    id?: string;
    value: any[];
    onChange: (event: MultiSelectChangeEvent) => void;
    options: Option[];
    optionLabel?: string;
    optionValue?: string;
    placeholder?: string;

    label?: string;
    topLabel?: string;
    showTopLabel?: boolean;
    required?: boolean;

    hasError?: boolean;
    errorMessage?: string;

    disabled?: boolean;
    className?: string;
}

export default function MultiSelect({
    id,
    value,
    onChange,
    options,
    optionLabel = 'label',
    optionValue = 'value',
    placeholder,
    topLabel,
    showTopLabel = false,
    required = false,
    hasError = false,
    errorMessage,
    disabled = false,
    className = 'w-full'
}: MultiSelectProps) {
    const { isDarkMode } = useTheme();

    return (
        <div className="field">
            <div
                style={{
                    height: 'var(--form-label-height)',
                    display: 'flex',
                    alignItems: 'center'
                }}
            >
                {showTopLabel && topLabel && (
                    <label className="filter-label">
                        {topLabel}
                        {required && <Mandatory />}
                    </label>
                )}
            </div>

            <PrimeMultiSelect
                id={id}
                value={value}
                onChange={onChange}
                options={options}
                optionLabel={optionLabel}
                optionValue={optionValue}
                placeholder={placeholder}
                display="chip"
                disabled={disabled}
                className={`${className} ${hasError ? 'p-invalid' : ''}`}
                style={{
                    backgroundColor: isDarkMode ? '#293B51' : '#FFFFFF',
                    borderColor: isDarkMode ? '#3E4F62' : '#CED4DA',
                    color: isDarkMode ? '#FFFFFF' : '#495057'
                }}
            />

            <div
                style={{
                    height: 'var(--form-feedback-height)',
                    display: 'flex',
                    alignItems: 'flex-end'
                }}
            >
                {errorMessage && (
                    <small className="p-error">
                        {errorMessage}
                    </small>
                )}
            </div>
        </div>
    );
}
