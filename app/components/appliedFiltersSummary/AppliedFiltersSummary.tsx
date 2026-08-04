'use client';

import './styles.css';
import React from 'react';
import { AppliedFiltersSummaryProps } from './types/types';


export const AppliedFiltersSummary: React.FC<AppliedFiltersSummaryProps> = ({
    items,
    onClear,
    title = 'Filtros aplicados:',
    emptyLabel = 'Nenhum filtro selecionado',
    className = ''
}) => {
    const activeItems = items.filter((item) => item.value && item.value.trim().length > 0);
    if (activeItems.length === 0) {
        return null;
    }
    return (
        <div className={`applied-filters-summary ${className}`.trim()}>
            <div className="applied-filters-summary__content">
                <strong className="applied-filters-summary__title">{title}</strong>

                <div className="applied-filters-summary__chips">
                    {activeItems.map((item) => (
                        <span key={item.label} className="applied-filters-summary__chip">
                            <span className="applied-filters-summary__chip-label">{item.label}:</span>
                            <span>{item.value}</span>
                            {item.onRemove && (
                                <button
                                    type="button"
                                    className="applied-filters-summary__chip-remove"
                                    onClick={item.onRemove}
                                    aria-label={`Remover filtro ${item.label}`}
                                >
                                    <i className="pi pi-times" />
                                </button>
                            )}
                        </span>
                    ))}
                </div>
            </div>

            {onClear && (
                <button type="button" className="applied-filters-summary__clear" onClick={onClear}>
                    Limpar filtros
                </button>
            )}
        </div>
    );
};
