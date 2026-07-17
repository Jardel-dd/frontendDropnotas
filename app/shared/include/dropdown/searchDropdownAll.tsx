'use client'
import './styles.css';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useDebouncedCallback } from 'use-debounce';
import { Mandatory } from '../../mandatory/InputMandatory';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import LoadingScreenComponent from '@/app/loading/loadingComponent';
import { useIsMobile } from '@/app/components/responsiveCelular/responsive';
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
    onEditClick?: (item: T) => void;
    minSearchChars?: number;
    maxResults?: number;
    className?: string;
    autoSelectSingle?: boolean;
    showTopLabel?: boolean;
    topLabel?: string | ReactNode;
    required?: boolean;
    loadOnMount?: boolean;
    autoLoadAndSelectSingle?: boolean;
    reloadAllOnShow?: boolean;
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

    if (!found) {
        return [selected, ...list];
    }

    return list.map((it) => (normalize(it[optionValue]) === selId ? selected : it));
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
    onEditClick,
    onBlur,
    minSearchChars = 2,
    maxResults = 20,
    autoSelectSingle = false,
    autoLoadAndSelectSingle = false,
    showTopLabel,
    topLabel,
    required,
    loadOnMount = false,
    reloadAllOnShow = false,
    className,
}: SearchDropdownProps<T>) => {
    const [items, setItems] = useState<T[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasLoadedAllItems, setHasLoadedAllItems] = useState(false);
    const { layoutConfig } = useContext(LayoutContext);
    const isDarkMode = layoutConfig.colorScheme === 'dark';
    const isMobile = useIsMobile();
    const [filterValue, setFilterValue] = useState<string>('');
    const wrapperRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<Dropdown>(null);
    const selectedItemRef = useRef<T | null>(selectedItem);
    const optionValueRef = useRef<keyof T | undefined>(optionValue);
    const initialOptionValueRef = useRef<string | number | null | undefined>(initialOptionValue);
    const onItemChangeRef = useRef(onItemChange);
    const didAutoSelectRef = useRef(false);
    const didLoadOnMountRef = useRef(false);
    const loadingRef = useRef(false);
    const hasLoadedAllItemsRef = useRef(false);
    const requestSequenceRef = useRef(0);
    const activeRequestCountRef = useRef(0);
    const loadAllRef = useRef<() => Promise<void>>(async () => undefined);
    const beginRequest = (clearItems = false) => {
        activeRequestCountRef.current += 1;
        loadingRef.current = true;
        setLoading(true);
        if (clearItems) {
            setItems([]);
        }
        requestSequenceRef.current += 1;
        return requestSequenceRef.current;
    };
    const finishRequest = () => {
        activeRequestCountRef.current = Math.max(0, activeRequestCountRef.current - 1);
        const stillLoading = activeRequestCountRef.current > 0;

        loadingRef.current = stillLoading;
        setLoading(stillLoading);
    };
    const isLatestRequest = (requestId: number) => requestId === requestSequenceRef.current;
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
    useEffect(() => {
        if (!autoLoadAndSelectSingle) return;
        if (
            selectedItemRef.current ||
            initialOptionValueRef.current !== null && initialOptionValueRef.current !== undefined
        ) {
            return;
        }
        let mounted = true;
        const loadSingleItemIfExists = async () => {
            try {
                const data = await fetchAllItems();
                if (!mounted || !Array.isArray(data)) return;
                const limitedData = data.slice(0, maxResults);

                setItems((prev) => ensureSelectedInList(
                    limitedData.length > 0 ? limitedData : prev,
                    selectedItemRef.current,
                    optionValueRef.current
                ));
                setHasLoadedAllItems(true);
                hasLoadedAllItemsRef.current = true;

                if (data.length === 1) {
                    didAutoSelectRef.current = true;
                    onItemChangeRef.current?.(data[0]);
                }
            } catch (error) {
                console.error(
                    'Erro ao verificar seleção automática:',
                    error
                );
            }
        };

        loadSingleItemIfExists();

        return () => {
            mounted = false;
        };
    }, [autoLoadAndSelectSingle, fetchAllItems, maxResults]);

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

        const requestId = beginRequest(items.length === 0);
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

                if (
                    !match &&
                    !selectedItemRef.current &&
                    rawTargetValue !== null &&
                    rawTargetValue !== undefined &&
                    fetchItemByValue
                ) {
                    match = await fetchItemByValue(rawTargetValue);
                }

                if (match && match !== selectedItemRef.current) {
                    resolvedSelectedItem = match;
                    onItemChangeRef.current?.(match);
                }
            }
            const hasPresetSelection =
                resolvedSelectedItem !== null ||
                initialOptionValueRef.current !== null && initialOptionValueRef.current !== undefined;
            if (
                autoSelectSingle &&
                !didAutoSelectRef.current &&
                !hasPresetSelection &&
                Array.isArray(data) &&
                data.length === 1
            ) {
                didAutoSelectRef.current = true;
                resolvedSelectedItem = data[0];
                onItemChangeRef.current?.(data[0]);
            }

            if (!isLatestRequest(requestId)) return;

            limited = ensureSelectedInList(limited, resolvedSelectedItem, optionValueRef.current);

            setItems(limited);

            setHasLoadedAllItems(true);
            hasLoadedAllItemsRef.current = true;
        } catch (err) {
            if (!isLatestRequest(requestId)) return;
            console.error('Erro ao carregar os itens:', err);
            setItems([]);
        } finally {
            finishRequest();
        }
    };
    loadAllRef.current = loadAll;

    useEffect(() => {
        if (!loadOnMount || didLoadOnMountRef.current) {
            return;
        }

        didLoadOnMountRef.current = true;
        if (selectedItemRef.current) {
            setItems((prev) => ensureSelectedInList(prev, selectedItemRef.current, optionValueRef.current));
            return;
        }

        if (
            optionValueRef.current &&
            initialOptionValueRef.current !== null &&
            initialOptionValueRef.current !== undefined &&
            fetchItemByValue
        ) {
            void (async () => {
                const requestId = beginRequest(true);
                try {
                    const resolvedItem = await fetchItemByValue(initialOptionValueRef.current as string | number);

                    if (!isLatestRequest(requestId)) return;

                    if (resolvedItem) {
                        onItemChangeRef.current?.(resolvedItem);
                        setItems((prev) => ensureSelectedInList(prev, resolvedItem, optionValueRef.current));
                    } else {
                        setItems([]);
                    }
                } catch (error) {
                    if (!isLatestRequest(requestId)) return;
                    console.error('Erro ao carregar item inicial do dropdown:', error);
                    setItems([]);
                } finally {
                    finishRequest();
                }
            })();
            return;
        }

        void loadAllRef.current();
    }, [fetchItemByValue, loadOnMount]);

    const loadAllIfNeeded = async () => {
        if (loadingRef.current) return;
        if (hasLoadedAllItemsRef.current) return;
        await loadAll();
    };
    const handleShow = async () => {
        if (reloadAllOnShow) {
            await loadAll();
            return;
        }

        await loadAllIfNeeded();
    };
    const handleFocus = async () => {
        if (reloadAllOnShow) return;
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

        const requestId = beginRequest(true);
        try {
            const data = await fetchFilteredItems(trimmed);
            let limited = Array.isArray(data) ? data.slice(0, maxResults) : [];

            if (!isLatestRequest(requestId)) return;

            limited = ensureSelectedInList(limited, selectedItemRef.current, optionValueRef.current);

            setItems(limited);
            setHasLoadedAllItems(false);
            hasLoadedAllItemsRef.current = false;

            if (optionValueRef.current && selectedItemRef.current) {
                const ov = optionValueRef.current as keyof T;
                const match = data.find((it) => normalize(it[ov]) === normalize((selectedItemRef.current as T)[ov])) ?? null;
                if (match && match !== selectedItemRef.current) onItemChangeRef.current?.(match);
            }
        } catch (error) {
            if (!isLatestRequest(requestId)) return;
            console.error('Erro ao filtrar os itens:', error);
            setItems([]);
        } finally {
            finishRequest();
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
        dropdownRef.current?.hide();
        onBlur?.();
        onAddClick?.();
    };
    const handleEditButtonMouseDown = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        event.stopPropagation();
    };
    const handleEditButtonClick = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        event.stopPropagation();
        dropdownRef.current?.hide();
        onBlur?.();

        if (selectedItemRef.current) {
            onEditClick?.(selectedItemRef.current);
        }
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
        setFilterValue('');
        debouncedFilter.cancel();
        didAutoSelectRef.current = false;
        selectedItemRef.current = null;
        initialOptionValueRef.current = null;
        onItemChangeRef.current?.(null);
        void loadAll();
    };
    const hasSelectedValue = selectedItem !== null;
    const canEditSelected = Boolean(onEditClick && hasSelectedValue);
    const canClearFilter = hasSelectedValue || filterValue.trim().length > 0;
    const showHeaderButtons = showAddButton || canEditSelected || canClearFilter;

    useEffect(() => {
        if (!selectedItem) return;

        setItems((prev) => ensureSelectedInList(prev, selectedItem, optionValue));
    }, [selectedItem, optionValue]);

    useEffect(() => {
        return () => {
            debouncedFilter.cancel();
        };
    }, [debouncedFilter]);

    const bringFieldIntoView = () => {
        if (!isMobile || !wrapperRef.current) {
            return;
        }

        requestAnimationFrame(() => {
            wrapperRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                inline: 'nearest'
            });
        });
    };

    return (
        <div ref={wrapperRef} className="p-field" style={{ width: '100%', height: '85px', maxHeight: "85px", scrollMarginTop: isMobile ? '1rem' : undefined }}>
            {showTopLabel && topLabel && (
                <div style={{ height: 'var(--form-label-height)', display: "flex", alignItems: "center" }}>
                    <label className="filter-label">
                        {topLabel}
                        {required && <Mandatory />}
                    </label>
                </div>
            )}
            <div className={`p-inputgroup flex-1 custom-input-number styled-on-focus styled-on-hover ${hasError ? 'input-error' : ''}`}
                style={{ border: hasError ? '1px solid #fca5a5' : (isDarkMode ? '1px solid #3e4f62' : '1px solid #ced4da'), borderRadius: '6px' }}>
                <Dropdown
                    ref={dropdownRef}
                    id={id}
                    onFocus={handleFocus}
                    onShow={() => {
                        bringFieldIntoView();
                        void handleShow();
                    }}
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
                    panelStyle={{ maxWidth: '350px', width: '100%', maxHeight: isMobile ? '40dvh' : undefined }}
                    className={hasError ? 'p-invalid' : ''}
                    style={{
                        boxShadow: 'none',
                        background: isDarkMode ? '#293B51' : '#FFFFFF',
                        width: '100%',
                        border: 'none',
                        height: 'var(--form-control-height)',
                        minHeight: 'var(--form-control-height)'

                    }}
                    filterTemplate={() => (
                        <div className="p-2 flex align-items-center gap-2" style={{ width: '100%', height: "40px" }}>
                            <InputText
                                autoFocus
                                type="text"
                                value={filterValue}
                                onChange={handleFilterChange}
                                onFocus={() => {
                                    setTimeout(bringFieldIntoView, 120);
                                }}
                                placeholder="Digite para filtrar..."
                                className="flex-1"
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
                                            raised
                                            outlined
                                            onMouseDown={handleEditButtonMouseDown}
                                            onClick={handleEditButtonClick}
                                        />
                                    )}
                                    {canClearFilter && (
                                        <Button
                                            type="button"
                                            style={{
                                                height: '30px',
                                                width: '40px',
                                                boxShadow: 'none'
                                            }}
                                            tooltip="Remover filtro"
                                            icon="pi pi-filter-slash"
                                            aria-label="Remover filtro"
                                            severity="warning"
                                            raised
                                            outlined
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
