import './styledCalendar.css';
import { ReactNode } from 'react';
import { Calendar } from 'primereact/calendar';
import { Mandatory } from '@/app/shared/mandatory/InputMandatory';
interface SingleDatePickerProps {
    value: Date | null;
    onChange: (date: Date | null) => void;
    onSearch?: (date: Date | null) => void;
    label?: string;
    placeholder?: string;
    className?: string;
    showTopLabel?: boolean;
    topLabel?: string | ReactNode;
    required?: boolean;
    topRightElement?: ReactNode;
}
export function DatePicker({ topRightElement, required, value, onChange, onSearch, label, placeholder = 'Selecione a data', showTopLabel, topLabel, className }: SingleDatePickerProps) {
    return (
        <div className="p-field" style={{ height: '71px' }}>
            {showTopLabel && (topLabel || topRightElement) && (
                <div className="flex align-items-center justify-content-between my-1" style={{ height: '17px' }}>
                    <label className="filter-label">
                        {topLabel}
                        {required && <Mandatory />}
                    </label>
                    {topRightElement}
                </div>
            )}
            <div className="flex flex-column w-full">
                <Calendar
                    id="singleDate"
                    value={value}
                    onChange={(e) => {
                        const newDate = e.value as Date | null;
                        onChange(newDate);
                        onSearch?.(newDate);
                    }}
                    dateFormat="dd/mm/yy"
                    showTime
                    hourFormat="24"
                    showIcon
                    readOnlyInput
                    placeholder={placeholder}
                    style={{ width: '100%' }}
                    locale="pt"
                />
            </div>
        </div>
    );
}
