import './style.css';
import { Chip } from 'primereact/chip';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useDebouncedCallback } from 'use-debounce';
import { MultiSelect } from 'primereact/multiselect';
import { Mandatory } from '../../mandatory/InputMandatory';
import { LayoutContext } from '@/layout/context/layoutcontext';
import LoadingScreenComponent from '@/app/loading/loadingComponent';
import { ReactNode, useContext, useEffect, useRef, useState } from 'react';

type MultiSelectProps = {
    selectedItems: any[];
    id: string;
    onChange: (e: any) => void;
    options: any[];
    optionLabel: string;
    placeholder: string;
    maxSelectedLabels?: number;
    className?: string;
    showChips: boolean;
    errorMessage?: string;
    hasError?: boolean;
    fetchFilteredItems?: (filter: string) => Promise<any[]>;
    fetchAllItems?: () => Promise<any[]>;
    autoSelectSingle?: boolean;
    dataKey?: string;
    showAddButton?: boolean;
    onAddClick?: () => void;
    minSearchChars?: number;
    maxResults?: number;
    showTopLabel?: boolean;
    topLabel?: string | ReactNode;
    required?: boolean;
};

function CustomMultiSelect({
    selectedItems,
    onChange,
    id,
    options,
    optionLabel,
    placeholder,
    maxSelectedLabels,
    className,
    showChips = true,
    hasError,
    errorMessage,
    fetchFilteredItems,
    fetchAllItems,
    autoSelectSingle = false,
    dataKey,
    showAddButton = false,
    onAddClick,
    minSearchChars = 2,
    maxResults = 50,
    showTopLabel,
    topLabel,
    required
}: MultiSelectProps) {
    const { layoutConfig } = useContext(LayoutContext);
    const isDarkMode = layoutConfig.colorScheme === 'dark';
    const [filterValue, setFilterValue] = useState('');
    const [filteredOptions, setFilteredOptions] = useState<any[]>(options);
    const [loading, setLoading] = useState(false);

    const didAutoSelectRef = useRef(false);
    const selectedItemsRef = useRef<any[]>(selectedItems);
    useEffect(() => {
        selectedItemsRef.current = selectedItems;
    }, [selectedItems]);
    const loadAll = async () => {
        setLoading(true);
        try {
            const data = fetchAllItems ? await fetchAllItems() : options;
            const arr = Array.isArray(data) ? data.slice(0, maxResults) : [];
            setFilteredOptions(arr);

            if (autoSelectSingle && !didAutoSelectRef.current && !filterValue && selectedItemsRef.current?.length === 0 && arr.length === 1) {
                didAutoSelectRef.current = true;
                onChange({ value: [arr[0]] });
            }
        } catch (e) {
            console.error('Erro ao carregar opções:', e);
            setFilteredOptions([]);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (!fetchAllItems) {
            setFilteredOptions(options);
            if (autoSelectSingle && !didAutoSelectRef.current && !filterValue && selectedItemsRef.current?.length === 0 && Array.isArray(options) && options.length === 1) {
                didAutoSelectRef.current = true;
                onChange({ value: [options[0]] });
            }
        }
    }, [options, fetchAllItems, autoSelectSingle, filterValue, onChange]);
    const handleShow = async () => {
        if (fetchAllItems && !loading) {
            await loadAll();
        } else {
            setFilteredOptions(options);
        }
    };
    const debouncedFilter = useDebouncedCallback(async (value: string) => {
        setFilterValue(value);
        const trimmed = value.trim();
        if (!trimmed) {
            await loadAll();
            return;
        }

        if (fetchFilteredItems) {
            setLoading(true);
            try {
                const data = await fetchFilteredItems(trimmed);
                setFilteredOptions(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error('Erro ao filtrar opções:', err);
                setFilteredOptions([]);
            } finally {
                setLoading(false);
            }
            if (trimmed.length < minSearchChars) return;
        } else {
            const v = trimmed.toLowerCase();
            const base = fetchAllItems ? filteredOptions : options;
            setFilteredOptions(
                (Array.isArray(base) ? base : []).filter((opt: any) =>
                    String(opt?.[optionLabel] ?? '')
                        .toLowerCase()
                        .includes(v)
                )
            );
        }
    }, 1000);
    return (
        <div className="p-field" style={{ width: '100%', height: '71px', }}>
            {showTopLabel && topLabel && (
                <div className="flex align-items-center justify-content-between my-1" style={{ height: '17px' }}>
                    <label className="filter-label">
                        {topLabel}
                        {required && <Mandatory />}
                    </label>
                </div>
            )}
            <div>
                <div style={{ width: '100%' }}>
                    <MultiSelect
                        id={id}
                        value={selectedItems}
                        onChange={onChange}
                        options={filteredOptions}
                        optionLabel={optionLabel}
                        placeholder={loading ? 'Carregando...' : placeholder}
                        selectedItemsLabel="{0} itens selecionados"
                        style={{ boxShadow: 'none', background: isDarkMode ? '#293B51' : '#FFFFFF',display:"flex" }}

                        maxSelectedLabels={maxSelectedLabels}
                        panelFooterTemplate={
                            loading ? (
                                <div style={{ padding: '0.75rem', display: 'flex', justifyContent: 'center' }}>
                                    <LoadingScreenComponent fullScreen={false} loadingText="Carregando..." />
                                </div>
                            ) : null
                        }
                        className={`w-full ${className ?? ''} ${hasError ? 'p-invalid' : ''}`}
                        filter
                        onShow={handleShow}
                        appendTo={typeof window !== 'undefined' ? document.body : null}
                        filterTemplate={() => (
                            <div className="p-2 flex align-items-center gap-2 w-full">
                                <InputText
                                    autoFocus
                                    type="text"
                                    value={filterValue}
                                    onChange={(e) => {
                                        const value = e.target.value ?? '';
                                        setFilterValue(value);
                                        debouncedFilter(value);
                                    }}
                                    placeholder="Digite para filtrar..."
                                    className="p-inputtext-sm w-full"
                                    style={{ boxShadow: 'none',display:"flex" }}
                                />
                                {showAddButton && <Button type="button" icon="pi pi-plus" tooltip="Adicionar" severity="success" aria-label="Adicionar" onClick={onAddClick} style={{ height: 28, width: 32 }} />}
                            </div>
                        )}
                    />
                    {hasError && errorMessage && <small className="p-error">{errorMessage}</small>}
                    {showChips && Array.isArray(selectedItems) && selectedItems.length > 0 && (
                        <div
                            style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '0.5rem',
                                marginTop: '0.25rem'
                            }}
                        >
                            {selectedItems.map((item: any) => {
                                const label = item?.[optionLabel];
                                const truncatedLabel = label && label.length > 10 ? label.slice(0, 10) + '...' : label;
                                return (
                                    <Chip
                                        key={item.id ?? JSON.stringify(item)}
                                        label={truncatedLabel}
                                        removable
                                        onRemove={() =>
                                            onChange({
                                                value: selectedItems.filter((i: any) => (i.id ?? JSON.stringify(i)) !== (item.id ?? JSON.stringify(item)))
                                            })
                                        }
                                        className="selected-chip mt-2"
                                    />
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
export default CustomMultiSelect;
