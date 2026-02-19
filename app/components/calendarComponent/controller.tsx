import { Dayjs } from "dayjs";
import { DateRangeValue } from "./dataRangerPicker";
export type DateRangeDesktop = [Dayjs | null, Dayjs | null];
export const mapDateRangeToParams = (dateRange?: DateRangeValue) => {
    if (!dateRange?.[0] || !dateRange?.[1]) return {};
    return {
        data_hora_inicio: dateRange[0].startOf('day').format('YYYY-MM-DDTHH:mm:ss'),
        data_hora_fim: dateRange[1].endOf('day').format('YYYY-MM-DDTHH:mm:ss')
    };
};