import { useContext } from 'react';
import { InputTextareaProps } from './types/types';
import { Mandatory } from '../../mandatory/InputMandatory';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { InputTextarea as PrimeInputTextarea } from 'primereact/inputtextarea';

const InputTextarea: React.FC<InputTextareaProps> = ({
    value,
    onChange,
    label,
    rows = 10,
    cols = 50,
    placeholder,
    disabled = false,
    id,
    maxLength,
    className,
    style,
    showTopLabel,
    topLabel,
    required
}) => {
    const { layoutConfig } = useContext(LayoutContext);
    const isDarkMode = layoutConfig.colorScheme === 'dark';

    return (
        <div>
            {showTopLabel && topLabel && (
              <div style={{ height: 'var(--form-label-height)', display:"flex", alignItems:"center" }}>
                    <label className="filter-label">
                    {topLabel}
                        {required && <Mandatory />}
                </label>
                  </div>
            )}
            <PrimeInputTextarea
                id={id}
                value={value}
                onChange={onChange}
                placeholder={placeholder || label}
                disabled={disabled}
                rows={rows}
                cols={cols}
                maxLength={maxLength}
                className={className}
                style={{
                    background: isDarkMode ? '#293B51' : '#FFFFFF',
                    boxShadow: 'none',
                    borderRadius: '6px',
                    width: '100%',
                    ...style
                }}
            />
        </div>
    );
};

export default InputTextarea;
