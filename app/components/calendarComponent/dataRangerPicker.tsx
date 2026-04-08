'use client';

import 'dayjs/locale/pt-br';
import './styledCalendar.css';
import dayjs, { Dayjs } from 'dayjs';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import type { Calendar as CalendarRef } from 'primereact/calendar';
import { ReactNode, useRef, useState } from 'react';
import { useTheme } from '@/app/components/isDarkMode/isDarkMode';
import { Mandatory } from '@/app/shared/mandatory/InputMandatory';

type Periodo = Date[] | null;
export type DateRangeValue = [Dayjs | null, Dayjs | null];

type Props = {
    onBuscar: (inicio: Date, fim: Date) => void;
    onPeriodoChange?: (periodo: Date[] | null) => void;
    onClear?: () => void;
    showTopLabel?: boolean;
    topLabel?: string;
    required?: boolean;
    topRightElement?: ReactNode;
};

export const todayRange: DateRangeValue = [dayjs().startOf('day'), dayjs().endOf('day')];

export const DateRangePicker = ({ onBuscar, onPeriodoChange, onClear, showTopLabel = false, topLabel, required = false, topRightElement }: Props) => {
    const calendarRef = useRef<CalendarRef>(null);
    const { isDarkMode } = useTheme();
    const [periodo, setPeriodo] = useState<Periodo>(null);
    const updatePeriodo = (nextPeriodo: Periodo) => {
        setPeriodo(nextPeriodo);
        onPeriodoChange?.(nextPeriodo);
    };

    const clearPeriodo = () => {
        updatePeriodo(null);
    };

    const setHoje = () => {
        const hoje = new Date();
        updatePeriodo([hoje, hoje]);
    };

    const setOntem = () => {
        const ontem = dayjs().subtract(1, 'day').toDate();
        updatePeriodo([ontem, ontem]);
    };

    const setSemanaAtual = () => {
        updatePeriodo([dayjs().startOf('week').toDate(), dayjs().endOf('week').toDate()]);
    };

    const setSemanaPassada = () => {
        updatePeriodo([dayjs().subtract(1, 'week').startOf('week').toDate(), dayjs().subtract(1, 'week').endOf('week').toDate()]);
    };

    const setMesAtual = () => {
        updatePeriodo([dayjs().startOf('month').toDate(), dayjs().endOf('month').toDate()]);
    };

    const setMesPassado = () => {
        updatePeriodo([dayjs().subtract(1, 'month').startOf('month').toDate(), dayjs().subtract(1, 'month').endOf('month').toDate()]);
    };

    const periodoCompleto = Array.isArray(periodo) && periodo.length === 2 && !!periodo[0] && !!periodo[1];

    const footerTemplate = () => (
        <div className="calendar-footer">
            <div className="calendar-buttons calendar-buttons-DataPiker">
                <Button label="Hoje" className="btn-filter-calendar" severity="secondary" outlined onClick={setHoje} />
                <Button label="Ontem" className="btn-filter-calendar" severity="secondary" outlined onClick={setOntem} />
                <Button label="Semana atual" className="btn-filter-calendar" severity="secondary" outlined onClick={setSemanaAtual} />
                <Button label="Semana passada" className="btn-filter-calendar" severity="secondary" outlined onClick={setSemanaPassada} />
                <Button label="Mes atual" className="btn-filter-calendar" severity="secondary" outlined onClick={setMesAtual} />
                <Button label="Mes passado" className="btn-filter-calendar" severity="secondary" outlined onClick={setMesPassado} />
            </div>
            <div className="row flex justify-content-between gap-2 mt-4">
                <Button
                    label="Filtrar"
                    icon="pi pi-search"
                    disabled={!periodoCompleto}
                    onClick={() => {
                        if (!periodoCompleto) return;
                        onBuscar(periodo[0]!, periodo[1]!);
                        calendarRef.current?.hide();
                    }}
                    style={{ height: '25px', maxHeight:"20px" }}
                />
                <Button
                    label="Limpar filtro"
                    icon="pi pi-trash"
                    severity="danger"
                    outlined
                    onClick={() => {
                        clearPeriodo();
                        onClear?.();
                        calendarRef.current?.hide();
                    }}
                    style={{ height: '25px', maxHeight:"20px" }}
                />
            </div>
        </div>
    );
    return (
        <div className="periodo-calendar-wrapper w-full" >
            {showTopLabel && (topLabel || topRightElement) && (
                <div style={{ height: 25, display: 'flex', alignItems: 'center' }}>
                    <label className="filter-label">
                        {topLabel}
                        {required && <Mandatory />}
                    </label>
                    {topRightElement}
                </div>
            )}
            <div
                className={`p-inputgroup flex-1 styled-on-focus styled-on-hover custom-input periodo-calendar-shell ${isDarkMode ? 'periodo-calendar-shell-dark' : 'periodo-calendar-shell-light'}`}
                style={{ border: isDarkMode ? '1px solid #3e4f62' : '1px solid #ced4da', borderRadius: '6px' }}
            >
                <Calendar
                    ref={calendarRef}
                    value={periodo}
                    onChange={(e) => {
                        const nextPeriodo = e.value as Periodo;
                        updatePeriodo(nextPeriodo);
                    }}
                    selectionMode="range"
                    numberOfMonths={1}
                    locale="pt"
                    dateFormat="dd/mm/yy"
                    className={isDarkMode ? 'periodo-calendar-dark' : 'periodo-calendar-light'}
                    inputClassName={isDarkMode ? 'periodo-calendar-input-dark' : 'periodo-calendar-input-light'}
                    inputStyle={{
                        boxShadow: 'none',
                        background: isDarkMode ? '#293B51' : '#FFFFFF',
                        color: isDarkMode ? '#FFFFFF' : '#495057',
                        width: '100%',
                        height: 40,
                        border: 0,
                        textAlign: 'center'
                    }}
                    style={{ boxShadow: 'none', borderColor: 'none', width: '100%', height: 40, border: 0 }}
                    readOnlyInput
                    placeholder="Data inicio - Data final"
                    showIcon
                    panelClassName={`periodo-calendar-panel ${isDarkMode ? 'periodo-calendar-panel-dark' : 'periodo-calendar-panel-light'}`}
                    footerTemplate={footerTemplate}
                />
            </div>
            <div style={{ height: 15, display: 'flex', alignItems: 'flex-end' }}></div>
        </div>
    );
};
