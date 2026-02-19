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
    optionLabel: keyof T;
    optionValue?: keyof T;
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
    optionLabel,
    optionValue,
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
    const { layoutConfig } = useContext(LayoutContext);
    const isDarkMode = layoutConfig.colorScheme === 'dark';
    const [filterValue, setFilterValue] = useState<string>('');

    const wrapperRef = useRef<HTMLDivElement>(null);
    const selectedItemRef = useRef<T | null>(selectedItem);
    const optionValueRef = useRef<keyof T | undefined>(optionValue);
    const onItemChangeRef = useRef(onItemChange);
    const didAutoSelectRef = useRef(false);

    useEffect(() => {
        selectedItemRef.current = selectedItem;
    }, [selectedItem]);

    useEffect(() => {
        optionValueRef.current = optionValue;
    }, [optionValue]);

    useEffect(() => {
        onItemChangeRef.current = onItemChange;
    }, [onItemChange]);
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
        setLoading(true);
        try {
            const data = await fetchAllItems();
            let limited = Array.isArray(data) ? data.slice(0, maxResults) : [];

            limited = ensureSelectedInList(limited, selectedItemRef.current, optionValueRef.current);

            setItems(limited);

            if (optionValueRef.current && selectedItemRef.current) {
                const ov = optionValueRef.current as keyof T;
                const match = data.find((it) => normalize(it[ov]) === normalize((selectedItemRef.current as T)[ov])) ?? null;

                if (match && match !== selectedItemRef.current) {
                    onItemChangeRef.current?.(match);
                }
            }

            if (autoSelectSingle && !didAutoSelectRef.current && !selectedItemRef.current && Array.isArray(data) && data.length === 1) {
                didAutoSelectRef.current = true;
                onItemChangeRef.current?.(data[0]);
            }
        } catch (err) {
            console.error('Erro ao carregar os itens:', err);
            setItems([]);
        } finally {
            setLoading(false);
        }
    };

    const handleShow = async () => {
        if (!items.length && !loading) {
            await loadAll();
        }
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

    useEffect(() => {
        if (!selectedItem) return;

        const hasInList = optionValue ? items.some((it) => normalize(it[optionValue]) === normalize(selectedItem[optionValue])) : items.includes(selectedItem);

        if (!hasInList) {
            setItems((prev) => ensureSelectedInList(prev, selectedItem, optionValue));
        }
    }, [selectedItem, optionValue, items.length]);

    return (
        <div ref={wrapperRef} className="p-field" style={{ width: '100%', height: '71px' }}>
            {showTopLabel && topLabel && (
                <div className="flex align-items-center justify-content-between my-1" style={{ height: '17px' }}>
                    <label className="filter-label">
                        {topLabel}
                        {required && <Mandatory />}
                    </label>
                </div>
            )}
            <div className="flex gap-2 align-items-center w-full">
                <Dropdown
                    id={id}
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
                        width: '100%',
                        background: isDarkMode ? '#293B51' : '#FFFFFF',
                        boxShadow: 'none'
                    }}
                    filterTemplate={() => (
                        <div className="p-2 flex align-items-center gap-2" style={{ width: '100%' }}>
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
                            {showAddButton && <Button style={{ height: '15px', width: '25px' }} tooltip="Adicionar" icon="pi pi-plus" severity="success" aria-label="Adicionar" onClick={onAddClick} />}
                        </div>
                    )}
                />
            </div>
            {errorMessage && (
                <small className="p-error block" style={{ height: '24px' }}>
                    {errorMessage}
                </small>
            )}
        </div>
    );
};
