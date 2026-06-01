import './style.css';
import { Chip } from 'primereact/chip';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useDebouncedCallback } from 'use-debounce';
import { MultiSelect } from 'primereact/multiselect';
import { Mandatory } from '../../mandatory/InputMandatory';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { useIsMobile } from '@/app/components/responsiveCelular/responsive';
import { useContext, useEffect, useRef, useState } from 'react';
import LoadingScreenComponent from '@/app/loading/loadingComponent';
import { ensureSelectedItemsInList, MultiSelectProps, normalize } from './types/types';


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
    onEditClick,
    minSearchChars = 2,
    maxResults = 50,
    showTopLabel,
    topLabel,
    required
}: MultiSelectProps) {
    const { layoutConfig } = useContext(LayoutContext);
    const isMobile = useIsMobile();
    const isDarkMode = layoutConfig.colorScheme === 'dark';
    const [filterValue, setFilterValue] = useState('');
    const [filteredOptions, setFilteredOptions] = useState<any[]>(options);
    const [loading, setLoading] = useState(false);
    const [hasLoadedAllOptions, setHasLoadedAllOptions] = useState(false);
    const multiSelectRef = useRef<MultiSelect>(null);

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
        if (fetchAllItems && !loading) {
            if (!hasLoadedAllOptions || filteredOptions.length === 0 || filterValue.trim().length === 0) {
                setFilterValue('');
                await loadAll();
                return;
            }

            setFilteredOptions((prev) => ensureSelectedItemsInList(prev, selectedItemsRef.current, dataKey));
            return;
        }

        setFilteredOptions(ensureSelectedItemsInList(options, selectedItemsRef.current, dataKey));
    };
    const debouncedFilter = useDebouncedCallback(async (value: string) => {
        setFilterValue(value);
        const trimmed = value.trim();
        if (!trimmed) {
            await loadAll();
            return;
        }

        if (trimmed.length < minSearchChars) return;

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
    const handleAddButtonMouseDown = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        event.stopPropagation();
    };
    const handleAddButtonClick = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        event.stopPropagation();
        onAddClick?.();
    };
    const handleCloseButtonMouseDown = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        event.stopPropagation();
    };
    const handleCloseButtonClick = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        event.stopPropagation();
        multiSelectRef.current?.hide();
    };
    const handleClearButtonMouseDown = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        event.stopPropagation();
    };
    const handleClearButtonClick = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        event.stopPropagation();
        onChange({
            value: [],
            target: {
                id,
                value: []
            }
        });
    };
    const handleEditButtonMouseDown = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        event.stopPropagation();
    };
    const handleEditButtonClick = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        event.stopPropagation();
        multiSelectRef.current?.hide();

        if (Array.isArray(selectedItemsRef.current) && selectedItemsRef.current.length === 1) {
            onEditClick?.(selectedItemsRef.current[0]);
        }
    };
    const hasSelectedValues = Array.isArray(selectedItems) && selectedItems.length > 0;
    const canEditSelected = Boolean(onEditClick && Array.isArray(selectedItems) && selectedItems.length === 1);
    const showHeaderButtons = showAddButton || canEditSelected || hasSelectedValues;
    return (
        <div className="p-field" style={{ width: '100%', height: '85px', maxHeight: "85px" }}>
            {showTopLabel && topLabel && (
                <div style={{ height: 25, display: "flex", alignItems: "center" }}>
                    <label className="filter-label">
                        {topLabel}
                        {required && <Mandatory />}
                    </label>
                </div>
            )}
            <div>
                <div style={{ width: '100%' }}>
                    <MultiSelect
                        ref={multiSelectRef}
                        id={id}
                        value={selectedItems}
                        onChange={onChange}
                        options={filteredOptions}
                        optionLabel={optionLabel}
                        dataKey={dataKey}
                        placeholder={loading ? 'Carregando...' : placeholder}
                        selectedItemsLabel="{0} itens selecionados"
                        style={{ boxShadow: 'none', background: isDarkMode ? '#293B51' : '#FFFFFF', display: "flex" }}
                        maxSelectedLabels={maxSelectedLabels}
                        panelFooterTemplate={
                            loading ? (
                                <div style={{ padding: '0.75rem', display: 'flex', justifyContent: 'center' }}>
                                    <LoadingScreenComponent fullScreen={false} loadingText="Carregando..." />
                                </div>
                            ) : null
                        }
                        panelClassName="custom-multiselect-panel"
                        className={`w-full ${className ?? ''} ${hasError ? 'p-invalid' : ''}`}
                        filter
                        filterInputAutoFocus={false}
                        showSelectAll={!isMobile}
                        onShow={handleShow}
                        appendTo={typeof window !== 'undefined' ? document.body : null}
                        pt={
                            showHeaderButtons
                                ? {
                                    closeButton: {
                                        style: {
                                            display: 'none'
                                        }
                                    }
                                }
                                : undefined
                        }
                        filterTemplate={() => (
                            <div className="custom-multiselect-filter">
                                <InputText
                                    autoFocus={!isMobile}
                                    type="text"
                                    value={filterValue}
                                    onChange={(e) => {
                                        const value = e.target.value ?? '';
                                        setFilterValue(value);
                                        debouncedFilter(value);
                                    }}
                                    placeholder="Digite para filtrar..."
                                    className="p-inputtext-sm custom-multiselect-filter-input"
                                    style={{ boxShadow: 'none', display: "flex", background: "transparent" }}
                                />
                                {showHeaderButtons && (
                                    <div className="custom-multiselect-filter-actions">
                                        {showAddButton && (
                                            <Button
                                                type="button"
                                                style={{
                                                    height: '30px',
                                                    width: '40px',
                                                    background: 'var(--primary-color)',
                                                    borderColor: 'var(--primary-color)',
                                                    color: 'var(--primary-color-text)',
                                                    boxShadow: 'none'
                                                }}
                                                tooltip="Adicionar"
                                                icon="pi pi-plus"
                                                aria-label="Adicionar"
                                            onMouseDown={handleAddButtonMouseDown}
                                            onClick={handleAddButtonClick}
                                        />
                                        )}
                                        {canEditSelected && (
                                            <Button
                                                type="button"
                                                style={{
                                                    height: '30px',
                                                    width: '40px',
                                                    boxShadow: 'none'
                                                }}
                                                tooltip="Editar"
                                                icon="pi pi-pencil"
                                                aria-label="Editar"
                                                severity="info"
                                                outlined
                                                raised
                                                onMouseDown={handleEditButtonMouseDown}
                                                onClick={handleEditButtonClick}
                                            />
                                        )}
                                        {hasSelectedValues && (
                                            <Button
                                                type="button"
                                                style={{
                                                    height: '30px',
                                                    width: '40px',
                                                    boxShadow: 'none'
                                                }}

                                                tooltip="Limpar"
                                                icon="pi pi-trash"
                                                aria-label="Limpar"
                                                severity="secondary"
                                                outlined
                                                raised
                                            onMouseDown={handleClearButtonMouseDown}
                                            onClick={handleClearButtonClick}
                                            />
                                        )}
                                        <Button
                                            type="button"
                                            style={{
                                                height: '30px',
                                                width: '40px',
                                                boxShadow: 'none'
                                            }}
                                            tooltip="Fechar"
                                            icon="pi pi-times"
                                            aria-label="Fechar"
                                            severity="secondary"
                                            raised
                                            outlined
                                            onMouseDown={handleCloseButtonMouseDown}
                                            onClick={handleCloseButtonClick}
                                        />
                                    </div>
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
