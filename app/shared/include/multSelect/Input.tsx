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

const normalize = (value: unknown) => (value === null || value === undefined ? null : String(value));

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
    initialSelectedValues?: Array<string | number>;
    showAddButton?: boolean;
    onAddClick?: () => void;
    minSearchChars?: number;
    maxResults?: number;
    showTopLabel?: boolean;
    topLabel?: string | ReactNode;
    required?: boolean;
};

function ensureSelectedItemsInList(list: any[], selectedItems: any[], dataKey?: string) {
    if (!dataKey || !Array.isArray(selectedItems) || selectedItems.length === 0) {
        return list;
    }

    const existingKeys = new Set(list.map((item) => normalize(item?.[dataKey])));
    const missingItems = selectedItems.filter((item) => !existingKeys.has(normalize(item?.[dataKey])));

    return missingItems.length > 0 ? [...missingItems, ...list] : list;
}

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
    initialSelectedValues = [],
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
    const [hasLoadedAllOptions, setHasLoadedAllOptions] = useState(false);

    const didAutoSelectRef = useRef(false);
    const selectedItemsRef = useRef<any[]>(selectedItems);
    const initialSelectedValuesRef = useRef<Array<string | number>>(initialSelectedValues);
    useEffect(() => {
        selectedItemsRef.current = selectedItems;
    }, [selectedItems]);
    useEffect(() => {
        initialSelectedValuesRef.current = initialSelectedValues;
    }, [initialSelectedValues]);
    const loadAll = async () => {
        setLoading(true);
        try {
            const data = fetchAllItems ? await fetchAllItems() : options;
            let arr = Array.isArray(data) ? data.slice(0, maxResults) : [];
            arr = ensureSelectedItemsInList(arr, selectedItemsRef.current, dataKey);
            setFilteredOptions(arr);

            if (
                dataKey &&
                selectedItemsRef.current?.length === 0 &&
                Array.isArray(initialSelectedValuesRef.current) &&
                initialSelectedValuesRef.current.length > 0
            ) {
                const selectedKeys = new Set(initialSelectedValuesRef.current.map((value) => normalize(value)));
                const matchedItems = (Array.isArray(data) ? data : []).filter((item) =>
                    selectedKeys.has(normalize(item?.[dataKey]))
                );

                if (matchedItems.length > 0) {
                    onChange({ value: matchedItems });
                }
            }

            if (
                autoSelectSingle &&
                !didAutoSelectRef.current &&
                !filterValue &&
                selectedItemsRef.current?.length === 0 &&
                initialSelectedValuesRef.current.length === 0 &&
                arr.length === 1
            ) {
                didAutoSelectRef.current = true;
                onChange({ value: [arr[0]] });
            }
            setHasLoadedAllOptions(true);
        } catch (e) {
            console.error('Erro ao carregar opções:', e);
            setFilteredOptions([]);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (!fetchAllItems) {
            setFilteredOptions(ensureSelectedItemsInList(options, selectedItemsRef.current, dataKey));
            if (
                autoSelectSingle &&
                !didAutoSelectRef.current &&
                !filterValue &&
                selectedItemsRef.current?.length === 0 &&
                initialSelectedValuesRef.current.length === 0 &&
                Array.isArray(options) &&
                options.length === 1
            ) {
                didAutoSelectRef.current = true;
                onChange({ value: [options[0]] });
            }
        }
    }, [options, fetchAllItems, autoSelectSingle, filterValue, onChange, dataKey]);
    const handleShow = async () => {
        if (fetchAllItems && !loading && !hasLoadedAllOptions) {
            await loadAll();
        } else {
            setFilteredOptions(ensureSelectedItemsInList(options, selectedItemsRef.current, dataKey));
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
                setFilteredOptions(
                    ensureSelectedItemsInList(Array.isArray(data) ? data : [], selectedItemsRef.current, dataKey)
                );
                setHasLoadedAllOptions(false);
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
                ensureSelectedItemsInList(
                    (Array.isArray(base) ? base : []).filter((opt: any) =>
                        String(opt?.[optionLabel] ?? '')
                            .toLowerCase()
                            .includes(v)
                    ),
                    selectedItemsRef.current,
                    dataKey
                )
            );
        }
    }, 1000);
    useEffect(() => {
        setFilteredOptions((prev) => ensureSelectedItemsInList(prev, selectedItems, dataKey));
    }, [selectedItems, dataKey]);
    return (
        <div className="p-field" style={{ width: '100%', height:'85px', maxHeight:"85px"}}>
            {showTopLabel && topLabel && (
                <div style={{ height:25, display:"flex", alignItems:"center" }}>
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
                        dataKey={dataKey}
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
                                {showAddButton && (
                                    <Button
                                        type="button"
                                        icon="pi pi-plus"
                                        tooltip="Adicionar"
                                        severity="success"
                                        aria-label="Adicionar"
                                        onMouseDown={(event) => {
                                            event.preventDefault();
                                            event.stopPropagation();
                                        }}
                                        onClick={(event) => {
                                            event.preventDefault();
                                            event.stopPropagation();
                                            onAddClick?.();
                                        }}
                                        style={{ height: 28, width: 32 }}
                                    />
                                )}
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
                                const itemKey = dataKey ? item?.[dataKey] : item?.id;
                                return (
                                    <Chip
                                        key={itemKey ?? JSON.stringify(item)}
                                        label={truncatedLabel}
                                        removable
                                        onRemove={() =>
                                            onChange({
                                                value: selectedItems.filter((i: any) => {
                                                    const currentKey = dataKey ? i?.[dataKey] : i?.id;
                                                    return (currentKey ?? JSON.stringify(i)) !== (itemKey ?? JSON.stringify(item));
                                                })
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
