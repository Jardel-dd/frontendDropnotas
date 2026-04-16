'use client'
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useDebouncedCallback } from 'use-debounce';
import { Mandatory } from '../../mandatory/InputMandatory';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import LoadingScreenComponent from '@/app/loading/loadingComponent';
import React, { useState, useEffect, useContext, useRef, ChangeEvent, ReactNode } from 'react';
interface SearchDropdownProps<T> {
    selectedItem: T | null;
    onItemChange: (item: T | null) => void;
    fetchAllItems: () => Promise<T[]>;
    fetchFilteredItems: (filter: string) => Promise<T[]>;
    fetchItemByValue?: (value: string | number) => Promise<T | null>;
    optionLabel: keyof T;
    optionValue?: keyof T;
    initialOptionValue?: string | number | null;
    placeholder?: string;
    disabled?: boolean;
    id?: string;
    hasError?: boolean;
    errorMessage?: string;
    autoFocus?: boolean;
    onBlur?: () => void;
    showAddButton?: boolean;
    onAddClick?: () => void;
    minSearchChars?: number;
    maxResults?: number;
    autoSelectSingle?: boolean;
    showTopLabel?: boolean;
    topLabel?: string | ReactNode;
    required?: boolean;
}

const normalize = (v: any) => (v === null || v === undefined ? null : String(v));

function ensureSelectedInList<T extends Record<string, any>>(list: T[], selected: T | null, optionValue?: keyof T) {
    if (!selected) return list;
    if (!optionValue) {
        const found = list.find((it) => it === selected) || list.find((it) => JSON.stringify(it) === JSON.stringify(selected));
        return found ? list : [selected, ...list];
    }
    const selId = normalize(selected[optionValue]);
    const found = list.some((it) => normalize(it[optionValue]) === selId);
    return found ? list : [selected, ...list];
}

export const DropdownSearch = <T extends Record<string, any>>({
    selectedItem,
    onItemChange,
    fetchAllItems,
    fetchFilteredItems,
    fetchItemByValue,
    optionLabel,
    optionValue,
    initialOptionValue,
    placeholder = 'Selecione um item',
    disabled = false,
    id,
    autoFocus,
    hasError,
    errorMessage,
    showAddButton,
    onAddClick,
    onBlur,
    minSearchChars = 2,
    maxResults = 20,
    autoSelectSingle = false,
    showTopLabel,
    topLabel,
    required
}: SearchDropdownProps<T>) => {
    const [items, setItems] = useState<T[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasLoadedAllItems, setHasLoadedAllItems] = useState(false);
    const { layoutConfig } = useContext(LayoutContext);
    const isDarkMode = layoutConfig.colorScheme === 'dark';
    const [filterValue, setFilterValue] = useState<string>('');
    const wrapperRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<Dropdown>(null);
    const selectedItemRef = useRef<T | null>(selectedItem);
    const optionValueRef = useRef<keyof T | undefined>(optionValue);
    const initialOptionValueRef = useRef<string | number | null | undefined>(initialOptionValue);
    const onItemChangeRef = useRef(onItemChange);
    const didAutoSelectRef = useRef(false);
    const loadingRef = useRef(false);
    const hasLoadedAllItemsRef = useRef(false);
    useEffect(() => {
        selectedItemRef.current = selectedItem;
    }, [selectedItem]);
    useEffect(() => {
        optionValueRef.current = optionValue;
    }, [optionValue]);
    useEffect(() => {
        initialOptionValueRef.current = initialOptionValue;
    }, [initialOptionValue]);

    useEffect(() => {
        onItemChangeRef.current = onItemChange;
    }, [onItemChange]);
    useEffect(() => {
        loadingRef.current = loading;
    }, [loading]);
    useEffect(() => {
        hasLoadedAllItemsRef.current = hasLoadedAllItems;
    }, [hasLoadedAllItems]);
    const selectedValue = optionValue && selectedItem ? selectedItem[optionValue] ?? null : selectedItem ?? null;
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                onBlur?.();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onBlur]);

    const loadAll = async () => {
        if (loadingRef.current) return;

        loadingRef.current = true;
        setLoading(true);
        try {
            const data = await fetchAllItems();
            let limited = Array.isArray(data) ? data.slice(0, maxResults) : [];
            let resolvedSelectedItem = selectedItemRef.current;

            if (optionValueRef.current) {
                const ov = optionValueRef.current as keyof T;
                const rawTargetValue = selectedItemRef.current
                    ? (selectedItemRef.current as T)[ov]
                    : initialOptionValueRef.current;
                const targetValue = normalize(rawTargetValue);
                let match = data.find((it) => normalize(it[ov]) === targetValue) ?? null;

                if (!match && rawTargetValue !== null && rawTargetValue !== undefined && fetchItemByValue) {
                    match = await fetchItemByValue(rawTargetValue);
                }

                if (match && match !== selectedItemRef.current) {
                    resolvedSelectedItem = match;
                    onItemChangeRef.current?.(match);
                }
            }

            limited = ensureSelectedInList(limited, resolvedSelectedItem, optionValueRef.current);

            setItems(limited);

            if (autoSelectSingle && !didAutoSelectRef.current && !selectedItemRef.current && Array.isArray(data) && data.length === 1) {
                didAutoSelectRef.current = true;
                onItemChangeRef.current?.(data[0]);
            }

            setHasLoadedAllItems(true);
            hasLoadedAllItemsRef.current = true;
        } catch (err) {
            console.error('Erro ao carregar os itens:', err);
            setItems([]);
        } finally {
            loadingRef.current = false;
            setLoading(false);
        }
    };
    const loadAllIfNeeded = async () => {
        if (hasLoadedAllItemsRef.current || loadingRef.current) return;
        await loadAll();
    };

    const handleShow = async () => {
        await loadAllIfNeeded();
    };
    const handleFocus = async () => {
        if (filterValue.trim().length > 0) return;
        await loadAllIfNeeded();
    };

    const debouncedFilter = useDebouncedCallback(async (value: string) => {
        const trimmed = value.trim();

        if (trimmed.length === 0) {
            await loadAll();
            return;
        }
        if (trimmed.length < minSearchChars) return;

        setLoading(true);
        try {
            const data = await fetchFilteredItems(trimmed);
            let limited = Array.isArray(data) ? data.slice(0, maxResults) : [];

            limited = ensureSelectedInList(limited, selectedItemRef.current, optionValueRef.current);

            setItems(limited);
            setHasLoadedAllItems(false);

            if (optionValueRef.current && selectedItemRef.current) {
                const ov = optionValueRef.current as keyof T;
                const match = data.find((it) => normalize(it[ov]) === normalize((selectedItemRef.current as T)[ov])) ?? null;
                if (match && match !== selectedItemRef.current) onItemChangeRef.current?.(match);
            }
        } catch (error) {
            console.error('Erro ao filtrar os itens:', error);
            setItems([]);
        } finally {
            setLoading(false);
        }
    }, 1000);

    const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFilterValue(value);
        debouncedFilter(value);
    };
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
        dropdownRef.current?.hide();
        onBlur?.();
    };
    const handleClearButtonMouseDown = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        event.stopPropagation();
    };
    const handleClearButtonClick = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        event.stopPropagation();
        onItemChangeRef.current?.(null);
    };
    const hasSelectedValue = selectedItem !== null;
    const showHeaderButtons = showAddButton || hasSelectedValue;

    useEffect(() => {
        if (!selectedItem) return;

        const hasInList = optionValue ? items.some((it) => normalize(it[optionValue]) === normalize(selectedItem[optionValue])) : items.includes(selectedItem);

        if (!hasInList) {
            setItems((prev) => ensureSelectedInList(prev, selectedItem, optionValue));
        }
    }, [selectedItem, optionValue, items]);

    return (
        <div ref={wrapperRef} className="p-field" style={{ width: '100%', height:'85px', maxHeight:"85px"}}>
            {showTopLabel && topLabel && (
                <div style={{ height: 'var(--form-label-height)', display:"flex", alignItems:"center" }}>
                    <label className="filter-label">
                        {topLabel}
                        {required && <Mandatory />}
                    </label>
                </div>
            )}
            <div className={`p-inputgroup flex-1 custom-input-number styled-on-focus styled-on-hover ${hasError ? 'input-error' : ''}`}
                  style={{ border: isDarkMode ? '1px solid #3e4f62' : '1px solid #ced4da' , borderRadius: '6px' }}>
                <Dropdown
                    ref={dropdownRef}
                    id={id}
                    onFocus={handleFocus}
                    onShow={handleShow}
                    emptyMessage={
                        loading ? (
                            <div style={{ padding: '0.5rem 0' }}>
                                <LoadingScreenComponent fullScreen={false} loadingText="Carregando informações..." />
                            </div>
                        ) : (
                            'Nenhum resultado encontrado'
                        )
                    }
                    value={selectedValue as any}
                    onChange={(e: DropdownChangeEvent) => {
                        if (optionValue) {
                            const val = e.value;
                            const item = items.find((it) => normalize(it[optionValue]) === normalize(val)) ?? null;
                            onItemChange(item);
                        } else {
                            onItemChange(e.value as T | null);
                        }
                    }}
                    options={Array.isArray(items) ? items : []}
                    optionLabel={optionLabel as string}
                    {...(optionValue ? { optionValue: optionValue as string } : {})}
                    placeholder={loading ? 'Carregando...' : placeholder}
                    disabled={disabled}
                    filter
                    autoFocus={autoFocus}
                    panelStyle={{ maxWidth: '350px', width: '100%' }}
                    className={`${hasError ? 'p-invalid' : ''}`}
                    style={{
                        boxShadow: 'none',
                        background: isDarkMode ? '#293B51' : '#FFFFFF',
                        width: '100%',
                        border: 'none',
                        height: 'var(--form-control-height)',
                        minHeight: 'var(--form-control-height)'
                        
                    }}
                    filterTemplate={() => (
                        <div className="p-2 flex align-items-center gap-2" style={{ width: '100%',height:"40px" }}>
                            <InputText
                                autoFocus
                                type="text"
                                value={filterValue}
                                onChange={handleFilterChange}
                                placeholder="Digite para filtrar..."
                                className="p-inputtext-sm flex-1"
                                style={{
                                    background: isDarkMode ? '#293B51' : '#FFFFFF',
                                    boxShadow: 'none'
                                }}
                            />
                            {showHeaderButtons && (
                                <>
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
                                    {hasSelectedValue && (
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
                                            severity="danger"
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
                                        severity="danger"
                                        raised
                                        outlined
                                        onMouseDown={handleCloseButtonMouseDown}
                                        onClick={handleCloseButtonClick}
                                    />
                                </>
                            )}
                        </div>
                    )}
                />
            </div>
            <div style={{ height: 'var(--form-feedback-height)', display: 'flex', alignItems: 'flex-end' }}> {errorMessage && <small className="p-error block">{errorMessage}</small>}
        </div>
        </div>
    );
};
