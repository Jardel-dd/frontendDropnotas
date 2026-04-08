import './styledCalendar.css';
import { Calendar } from 'primereact/calendar';
import { useTheme } from '@/app/components/isDarkMode/isDarkMode';
import { Mandatory } from '@/app/shared/mandatory/InputMandatory';
import { SingleDatePickerProps } from '@/app/shared/include/inputMask/types/types';

export function DatePicker({
     topRightElement, required, value, onChange, onSearch, label, placeholder = 'Selecione a data', showTopLabel, topLabel, className }: SingleDatePickerProps) {
    const { isDarkMode } = useTheme();

    return (
        <div className={`single-date-picker-wrapper ${className ?? ''}`}>
            {showTopLabel && (topLabel || topRightElement) && (
                <div style={{ height: 'var(--form-label-height)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <label className="filter-label">
                        {topLabel}
                        {required && <Mandatory />}
                    </label>
                    {topRightElement}
                </div>
            )}
            <div
                className={`p-inputgroup flex-1 styled-on-focus styled-on-hover custom-input single-date-picker-shell ${isDarkMode ? 'single-date-picker-shell-dark' : 'single-date-picker-shell-light'}`}
                style={{ border: isDarkMode ? '1px solid #3e4f62' : '1px solid #ced4da', borderRadius: '6px' }}
            >
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
                    className="single-date-picker-calendar"
                    inputClassName={`single-date-picker-input ${isDarkMode ? 'single-date-picker-input-dark' : 'single-date-picker-input-light'}`}
                    inputStyle={{
                        boxShadow: 'none',
                        background: isDarkMode ? '#293B51' : '#FFFFFF',
                        color: isDarkMode ? '#FFFFFF' : '#495057',
                        width: '100%',
                        height: 'var(--form-control-height)',
                    }}
                    readOnlyInput
                    placeholder={placeholder || label}
                    panelClassName={`periodo-calendar-panel ${isDarkMode ? 'periodo-calendar-panel-dark' : 'periodo-calendar-panel-light'}`}
                    locale="pt"
                />
            </div>
            <div style={{ height: 'var(--form-feedback-height)', display: 'flex', alignItems: 'flex-end' }}></div>
        </div>
    );
}
