'use client';
import './style.css'
import { CSSProperties } from 'react';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';
import { useTheme } from '../isDarkMode/isDarkMode';

interface CustomPaginatorProps {
    first: number;
    rows: number;
    totalRecords: number;
    onPageChange: (event: PaginatorPageChangeEvent) => void;
    isMobile?: boolean;
    className?: string;
    style?: CSSProperties;
}

export default function CustomPaginator({
    first,
    rows,
    totalRecords,
    onPageChange,
    isMobile = false,
    className,
    style
}: CustomPaginatorProps) {
    const { isDarkMode } = useTheme();
    const paginatorStyle = isMobile
        ? {
              background: isDarkMode ? '#162A41' : '#EFF3F8',
              ...style
          }
        : style;

    return (
        <Paginator
            first={first}
            rows={rows}
            totalRecords={totalRecords}
            alwaysShow
            onPageChange={onPageChange}
                className={`no-border-color ${className ?? ''}`}

            style={paginatorStyle}
            template={
                isMobile
                    ? {
                          layout: 'PrevPageLink CurrentPageReport NextPageLink',
                          CurrentPageReport: (options: { first: number; rows: number; totalPages: number }) => {
                              const pageNumber = Math.floor(options.first / options.rows) + 1;
                              return (
                                  <span>
                                      Página {pageNumber} de {options.totalPages}
                                  </span>
                              );
                          }
                      }
                    : 'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink'
            }
        />
    );
}
