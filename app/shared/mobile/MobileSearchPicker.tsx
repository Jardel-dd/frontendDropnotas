'use client';

import './MobileSearchPicker.css';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useIsMobile } from '@/app/components/responsiveCelular/responsive';
import { useGenericSearch } from '@/app/services/debounceSearch/controller';

type MobileSearchPickerProps<T extends Record<string, any>> = {
    selectedItem: T | null;
    onItemChange: (item: T | null) => void;
    fetchAllItems: () => Promise<T[]>;
    fetchFilteredItems: (filter: string) => Promise<T[]>;
    fetchItemsPage?: (params: {
        searchTerm: string;
        page: number;
        size: number;
    }) => Promise<{
        items: T[];
        hasMore: boolean;
    }>;
    optionLabel: keyof T;
    optionValue?: keyof T;
    dialogTitle: string;
    placeholder: string;
    topLabel: string;
    hasError?: boolean;
    errorMessage?: string;
    rows?: number;
    loadMoreRows?: number;
    minSearchChars?: number;
    loadingMessage?: string;
    emptyMessage?: string;
    searchHint?: string;
    searchPlaceholder?: string;
    onAddClick?: () => void;
    onEditClick?: (item: T) => void;
    dialogPosition?: string;
    getOptionSubtitle?: (item: T) => string | null | undefined;
    autoLoadAndSelectSingle?: boolean;
};

const normalize = (v: any) => (v === null || v === undefined ? null : String(v));
const getOptionKey = <T extends Record<string, any>>(option: T, optionLabel: keyof T, optionValue?: keyof T) =>
    normalize(optionValue ? option[optionValue] : option[optionLabel]) ?? JSON.stringify(option);
const mergeUniqueOptions = <T extends Record<string, any>>(current: T[], next: T[], optionLabel: keyof T, optionValue?: keyof T) => {
    const merged = new Map<string, T>();

    current.forEach((option) => {
        merged.set(getOptionKey(option, optionLabel, optionValue), option);
    });

    next.forEach((option) => {
        merged.set(getOptionKey(option, optionLabel, optionValue), option);
    });

    return Array.from(merged.values());
};

export default function MobileSearchPicker<T extends Record<string, any>>({
    selectedItem,
    onItemChange,
    fetchAllItems,
    fetchFilteredItems,
    fetchItemsPage,
    optionLabel,
    optionValue,
    dialogTitle,
    placeholder,
    topLabel,
    hasError = false,
    errorMessage,
    rows = 8,
    loadMoreRows = rows,
    minSearchChars = 2,
    loadingMessage = 'Carregando itens...',
    emptyMessage = 'Nenhum item encontrado.',
    searchHint = '',
    searchPlaceholder = 'Digite para pesquisar...',
    onAddClick,
    onEditClick,
    dialogPosition,
    getOptionSubtitle,
    autoLoadAndSelectSingle = false
}: MobileSearchPickerProps<T>) {
    const isMobile = useIsMobile();
    const [visible, setVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [appliedSearchTerm, setAppliedSearchTerm] = useState('');
    const [options, setOptions] = useState<T[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [visibleCount, setVisibleCount] = useState(rows);
    const [currentPage, setCurrentPage] = useState(0);
    const [hasMore, setHasMore] = useState(false);
    const [showLoadMoreButton, setShowLoadMoreButton] = useState(false);
    const resultsRef = useRef<HTMLDivElement | null>(null);
    const requestSequenceRef = useRef(0);
    const fetchAllItemsRef = useRef(fetchAllItems);
    const onItemChangeRef = useRef(onItemChange);
    const selectedItemRef = useRef<T | null>(selectedItem);
    const onEditClickRef = useRef(onEditClick);
    const selectedValue = selectedItem && optionValue ? normalize(selectedItem[optionValue]) : null;
    const isPaginatedMode = Boolean(fetchItemsPage);
    const pageSize = Math.max(rows, loadMoreRows);
    const [, setDebouncedSearchState] = useState({ value: '' });
    const { debouncedSearch, searchNow } = useGenericSearch({
        setter: setDebouncedSearchState,
        field: 'value',
        onSearch: (value) => {
            const normalizedValue = value.trim();

            if (normalizedValue.length === 0) {
                setAppliedSearchTerm('');
                return;
            }

            if (normalizedValue.length < minSearchChars) {
                return;
            }

            setAppliedSearchTerm(value);
        }
    });

    useEffect(() => {
        fetchAllItemsRef.current = fetchAllItems;
    }, [fetchAllItems]);

    useEffect(() => {
        onItemChangeRef.current = onItemChange;
    }, [onItemChange]);

    useEffect(() => {
        selectedItemRef.current = selectedItem;
    }, [selectedItem]);

    useEffect(() => {
        onEditClickRef.current = onEditClick;
    }, [onEditClick]);

    useEffect(() => {
        if (!autoLoadAndSelectSingle || selectedItem) {
            return;
        }

        let isMounted = true;

        const loadSingleItemIfExists = async () => {
            try {
                const data = await fetchAllItemsRef.current();

                if (!isMounted || !Array.isArray(data)) {
                    return;
                }

                setOptions(data);

                if (data.length === 1) {
                    onItemChangeRef.current(data[0]);
                }
            } catch (error) {
                console.error('Erro ao verificar selecao automatica no seletor mobile:', error);
            }
        };

        void loadSingleItemIfExists();

        return () => {
            isMounted = false;
        };
    }, [autoLoadAndSelectSingle, selectedItem]);

    useEffect(() => {
        if (!visible) {
            return;
        }
        if (appliedSearchTerm.trim().length > 0 && appliedSearchTerm.trim().length < minSearchChars) {
            return;
        }
        const requestId = ++requestSequenceRef.current;

        const loadOptions = async () => {
            setLoading(true);
            setLoadingMore(false);
            try {
                const normalizedTerm = appliedSearchTerm.trim();
                const effectiveSearchTerm = normalizedTerm.length >= minSearchChars ? normalizedTerm : '';
                resultsRef.current?.scrollTo({ top: 0 });

                if (isPaginatedMode && fetchItemsPage) {
                    const results = await fetchItemsPage({
                        searchTerm: effectiveSearchTerm,
                        page: 0,
                        size: pageSize
                    });

                    if (requestId !== requestSequenceRef.current) {
                        return;
                    }

                    setOptions(Array.isArray(results.items) ? results.items : []);
                    setVisibleCount(rows);
                    setCurrentPage(0);
                    setHasMore(Boolean(results.hasMore));
                } else {
                    const results =
                        normalizedTerm.length >= minSearchChars
                            ? await fetchFilteredItems(normalizedTerm)
                            : await fetchAllItems();

                    if (requestId !== requestSequenceRef.current) {
                        return;
                    }

                    setOptions(Array.isArray(results) ? results : []);
                    setVisibleCount(rows);
                    setCurrentPage(0);
                    setHasMore(false);
                }

                setShowLoadMoreButton(false);
            } catch (error) {
                console.error('Erro ao carregar itens no seletor mobile:', error);
                if (requestId !== requestSequenceRef.current) {
                    return;
                }

                setOptions([]);
                setVisibleCount(rows);
                setCurrentPage(0);
                setHasMore(false);
                setShowLoadMoreButton(false);
            } finally {
                if (requestId === requestSequenceRef.current) {
                    setLoading(false);
                }
            }
        };

        void loadOptions();
    }, [appliedSearchTerm, fetchAllItems, fetchFilteredItems, fetchItemsPage, isPaginatedMode, minSearchChars, pageSize, rows, visible]);

    const visibleOptions = useMemo(
        () => options.slice(0, visibleCount),
        [options, visibleCount]
    );
    const hasAdditionalResults = isPaginatedMode ? options.length > visibleCount || hasMore : options.length > visibleCount;

    const handleOpen = () => {
        debouncedSearch.cancel();
        setSearchTerm('');
        searchNow('');
        setVisibleCount(rows);
        setCurrentPage(0);
        setHasMore(false);
        setLoadingMore(false);
        setShowLoadMoreButton(false);
        setVisible(true);
    };

    const handleHide = () => {
        requestSequenceRef.current += 1;
        debouncedSearch.cancel();
        setVisible(false);
        setSearchTerm('');
        searchNow('');
        setVisibleCount(rows);
        setCurrentPage(0);
        setHasMore(false);
        setLoading(false);
        setLoadingMore(false);
        setShowLoadMoreButton(false);
    };

    useEffect(() => {
        const container = resultsRef.current;

        if (!container || loading || !hasAdditionalResults) {
            setShowLoadMoreButton(false);
            return;
        }

        const updateButtonVisibility = () => {
            const canScroll = container.scrollHeight > container.clientHeight + 4;

            if (!canScroll) {
                setShowLoadMoreButton(true);
                return;
            }

            const distanceToBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
            setShowLoadMoreButton(distanceToBottom <= 24);
        };

        updateButtonVisibility();
        container.addEventListener('scroll', updateButtonVisibility);

        return () => {
            container.removeEventListener('scroll', updateButtonVisibility);
        };
    }, [hasAdditionalResults, loading, loadingMore, options.length, visibleCount]);

    const handleLoadMore = async () => {
        if (loading || loadingMore) {
            return;
        }

        if (isPaginatedMode && fetchItemsPage) {
            const nextVisibleCount = visibleCount + loadMoreRows;

            setVisibleCount(nextVisibleCount);

            if (options.length >= nextVisibleCount || !hasMore) {
                return;
            }

            const requestId = ++requestSequenceRef.current;

            setLoadingMore(true);
            try {
                const results = await fetchItemsPage({
                    searchTerm: appliedSearchTerm.trim().length >= minSearchChars ? appliedSearchTerm.trim() : '',
                    page: currentPage + 1,
                    size: pageSize
                });

                if (requestId !== requestSequenceRef.current) {
                    return;
                }

                setOptions((currentOptions) =>
                    mergeUniqueOptions(
                        currentOptions,
                        Array.isArray(results.items) ? results.items : [],
                        optionLabel,
                        optionValue
                    )
                );
                setCurrentPage((page) => page + 1);
                setHasMore(Boolean(results.hasMore));
            } catch (error) {
                if (requestId !== requestSequenceRef.current) {
                    return;
                }

                console.error('Erro ao carregar mais itens no seletor mobile:', error);
            } finally {
                if (requestId === requestSequenceRef.current) {
                    setLoadingMore(false);
                }
            }

            return;
        }

        setVisibleCount((current) => current + loadMoreRows);
    };

    useEffect(() => {
        return () => {
            debouncedSearch.cancel();
        };
    }, [debouncedSearch]);

    return (
        <>
            <div className="mobile-search-picker-field">
                <div style={{ height: 'var(--form-label-height)', display: 'flex', alignItems: 'center' }}>
                    <label className="filter-label">{topLabel}</label>
                </div>
                <div className={`mobile-search-picker-trigger ${hasError ? 'mobile-search-picker-trigger--error' : ''}`}>
                    <button type="button" className="mobile-search-picker-trigger-button" onClick={handleOpen}>
                        <span  className={`mobile-search-picker-trigger-text${selectedItem ? '' : ' mobile-search-picker-trigger-text--placeholder'}`}>
                            {selectedItem ? String(selectedItem[optionLabel] ?? placeholder) : placeholder}
                        </span>
                        <i className="pi pi-search" />
                    </button>
                    <div className="mobile-search-picker-actions">
                        {onAddClick && (
                            <Button
                                type="button"
                                icon="pi pi-plus"
                                aria-label="Adicionar"
                                onClick={(event) => {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    onAddClick();
                                }}
                                style={{ height: '20px', width: '30px', boxShadow: 'none' }}
                            />
                        )}
                        {onEditClick && (
                            <Button
                                type="button"
                                icon="pi pi-pencil"
                                aria-label="Editar"
                                severity="info"
                                outlined
                                disabled={!selectedItem}
                                onClick={(event) => {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    const currentSelectedItem = selectedItemRef.current;

                                    if (currentSelectedItem) {
                                        onEditClickRef.current?.(currentSelectedItem);
                                    }
                                }}
                                style={{ height: '20px', width: '30px', boxShadow: 'none' }}
                            />
                        )}
                    </div>
                </div>
                <div style={{ height: 'var(--form-feedback-height)', display: 'flex', alignItems: 'flex-end' }}>
                    {errorMessage && <small className="p-error block">{errorMessage}</small>}
                </div>
            </div>
            <Dialog
                header={dialogTitle}
                visible={visible}
                className="mobile-search-picker-dialog"
                contentClassName="mobile-search-picker-dialog-content"
                breakpoints={{ '960px': '95vw' }}
                style={{ width: isMobile ? '95vw' : '32rem', maxWidth: '95vw' }}
                position={dialogPosition as any}
                draggable={false}
                onHide={handleHide}
            >
                <div className="mobile-search-picker-dialog-body">
                    <div className="mobile-search-picker-search">
                        <InputText
                            value={searchTerm}
                            onChange={(event) => {
                                const nextValue = event.target.value;
                                const normalizedValue = nextValue.trim();

                                setSearchTerm(nextValue);
                                if (normalizedValue.length === 0) {
                                    debouncedSearch.cancel();
                                    searchNow('');
                                    return;
                                }

                                debouncedSearch(nextValue);
                            }}
                            placeholder={searchPlaceholder}
                            autoFocus
                            className="w-full"
                            style={{boxShadow:"none"}}
                        />
                        <small className="text-color-secondary">{searchHint}</small>
                    </div>
                    <div ref={resultsRef} className="mobile-search-picker-results">
                        {loading ? (
                            <div className="mobile-search-picker-empty">{loadingMessage}</div>
                        ) : visibleOptions.length === 0 ? (
                            <div className="mobile-search-picker-empty">{emptyMessage}</div>
                        ) : (
                            visibleOptions.map((option) => {
                                const optionKey = optionValue ? normalize(option[optionValue]) : normalize(option[optionLabel]);
                                const subtitle = getOptionSubtitle?.(option);
                                const isActive = optionKey === selectedValue;
                                return (
                                    <button
                                        key={optionKey ?? String(option[optionLabel])}
                                        type="button"
                                        className={`mobile-search-picker-option${isActive ? ' mobile-search-picker-option--active' : ''}`}
                                        onClick={() => {
                                            onItemChangeRef.current(option);
                                            handleHide();
                                        }}
                                    >
                                        <span className="mobile-search-picker-option-title">
                                            {String(option[optionLabel] ?? 'Nome não disponível')}
                                        </span>
                                        {subtitle && <span className="mobile-search-picker-option-subtitle">{subtitle}</span>}
                                    </button>
                                );
                            })
                        )}
                    </div>
                    {!loading && hasAdditionalResults && showLoadMoreButton && (
                        <Button
                            type="button"
                            label={loadingMore ? 'Carregando...' : 'Carregar mais'}
                            outlined
                            className="mobile-search-picker-load-more"
                            loading={loadingMore}
                            disabled={loadingMore}
                            onClick={handleLoadMore}
                        />
                    )}
                </div>
            </Dialog>
        </>
    );
}
