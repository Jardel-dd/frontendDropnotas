'use client';
import 'dayjs/locale/pt-br';
import './styledCalendar.css';
import dayjs, { Dayjs } from 'dayjs';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { useRef, useState, ReactNode } from 'react';
import type { Calendar as CalendarRef } from 'primereact/calendar';
import { Mandatory } from '@/app/shared/mandatory/InputMandatory';
import { Divider } from 'antd';

type Periodo = Date[] | null;
export type DateRangeValue = [Dayjs | null, Dayjs | null];

type Props = {
    onBuscar: (inicio: Date, fim: Date) => void;
    showTopLabel?: boolean;
    topLabel?: string;
    required?: boolean;
    topRightElement?: ReactNode;
};
export const todayRange: DateRangeValue = [dayjs().startOf('day'), dayjs().endOf('day')];

export const DateRangePicker = ({ onBuscar, showTopLabel = false, topLabel, required = false, topRightElement }: Props) => {
    const calendarRef = useRef<CalendarRef>(null);
    const clearPeriodo = () => {
        setPeriodo(null);
    };
    const [periodo, setPeriodo] = useState<Periodo>(null);
    const setHoje = () => {
        const hoje = new Date();
        setPeriodo([hoje, hoje]);
    };
    const setOntem = () => {
        const ontem = dayjs().subtract(1, 'day').toDate();
        setPeriodo([ontem, ontem]);
    };
    const setSemanaAtual = () => {
        setPeriodo([dayjs().startOf('week').toDate(), dayjs().endOf('week').toDate()]);
    };
    const setSemanaPassada = () => {
        setPeriodo([dayjs().subtract(1, 'week').startOf('week').toDate(), dayjs().subtract(1, 'week').endOf('week').toDate()]);
    };
    const setMesAtual = () => {
        setPeriodo([dayjs().startOf('month').toDate(), dayjs().endOf('month').toDate()]);
    };
    const setMesPassado = () => {
        setPeriodo([dayjs().subtract(1, 'month').startOf('month').toDate(), dayjs().subtract(1, 'month').endOf('month').toDate()]);
    };
    const periodoCompleto = Array.isArray(periodo) && periodo.length === 2 && !!periodo[0] && !!periodo[1];
    const footerTemplate = () => (
        <div className="calendar-footer">
            <div className="calendar-divider" />
            <div className="calendar-buttons calendar-buttons-DataPiker gap-2">
                <Button label="Hoje" className="btn-filter-calendar" severity="secondary" outlined onClick={setHoje} />
                <Button label="Ontem" className="btn-filter-calendar" severity="secondary" outlined onClick={setOntem} />
                <Button label="Semana atual" className="btn-filter-calendar" severity="secondary" outlined onClick={setSemanaAtual} />
            </div>
            <div className="calendar-buttons calendar-buttons-DataPiker gap-2">
                <Button label="Semana passada" className="btn-filter-calendar" severity="secondary" outlined onClick={setSemanaPassada} />
                <Button label="Mês atual" className="btn-filter-calendar" severity="secondary" outlined onClick={setMesAtual} />
                <Button label="Mês passado" className="btn-filter-calendar" severity="secondary" outlined onClick={setMesPassado} />
            </div>
            <div className="calendar-footer-ok">
                <Button
                    label="Filtrar"
                    icon="pi pi-search"
                    disabled={!periodoCompleto}
                    onClick={() => {
                        if (!periodoCompleto) return;
                        onBuscar(periodo[0]!, periodo[1]!);
                        calendarRef.current?.hide();
                    }}
                    style={{ height: '20px' }}
                />
                <Button
                    label="Limpar filtro"
                    icon="pi pi-trash"
                    severity="danger"
                    outlined
                    onClick={() => {
                        clearPeriodo();
                        calendarRef.current?.hide();
                    }}
                    style={{ height: '20px' }}
                />
            </div>
        </div>
    );

    return (
        <div className="periodo-calendar-wrapper w-full" style={{ height: '71px' }}>
            {showTopLabel && (topLabel || topRightElement) && (
                <div className="flex align-items-center justify-content-between my-1" style={{ height: '17px' }}>
                    <label className="filter-label">
                        {topLabel}
                        {required && <Mandatory />}
                    </label>
                    {topRightElement}
                </div>
            )}
            <Calendar
                ref={calendarRef}
                value={periodo}
                onChange={(e) => setPeriodo(e.value as Periodo)}
                selectionMode="range"
                numberOfMonths={1}
                locale="pt"
                dateFormat="dd/mm/yy"
                style={{ boxShadow: 'none', borderColor: 'none', width: '100%' }}
                readOnlyInput
                placeholder="Data inicio      ↔︎      Data final"
                showIcon
                panelClassName="periodo-calendar-panel"
                footerTemplate={footerTemplate}
            />
        </div>
    );
};
