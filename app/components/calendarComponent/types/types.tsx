import { ReactNode } from "react";
import dayjs, { Dayjs } from "dayjs";

export type Periodo = Date[] | null;
export type DateRangeValue = [Dayjs | null, Dayjs | null];

export type Props = {
    onBuscar: (inicio: Date, fim: Date) => void;
    onPeriodoChange?: (periodo: Date[] | null) => void;
    onClear?: () => void;
    showTopLabel?: boolean;
    topLabel?: string;
    required?: boolean;
    topRightElement?: ReactNode;
};

export const todayRange: DateRangeValue = [dayjs().startOf('day'), dayjs().endOf('day')];
