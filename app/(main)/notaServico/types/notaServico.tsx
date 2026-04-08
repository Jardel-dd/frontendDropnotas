import { RefObject } from 'react';
import { Messages } from 'primereact/messages';
import { NfsEntity } from '@/app/entity/NfsEntity';
import { DateRangeValue } from '@/app/components/calendarComponent/dataRangerPicker';

export interface NotaServicoFormRef {
    handleSave: () => Promise<void>;
}
export interface NotaServicoFormProps {
    notaServico: NfsEntity;
    initialId?: string | null;
    onSuccess?: () => void;
    msgs: RefObject<Messages | null>;
    onNotaServicoChange?: (nota: NfsEntity) => void;
    onErrorsChange?: (errors: Record<string, string>) => void;
    setNotaServico?: React.Dispatch<React.SetStateAction<NfsEntity>>;
    redirectAfterSave?: boolean;
    onClose?: () => void;
    onSaved?: (created: NfsEntity) => void;
    showBTNPGCreatedDialog?: boolean;
    showBTNPGCreatedAll?: boolean;
    onBackClick?: () => void;
}
export interface NotaServicoFieldsProps {
    gerarNfse: NfsEntity;
    errors: Record<string, string>;
    loadingCep: boolean;
    dateRange: Date[] | null;
    onDateChange: (date: Date | null) => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any, bloco?: 'prestador' | 'tomador' | 'servico') => void;
    onNumberChange: (e: any, bloco?: 'prestador' | 'tomador' | 'servico') => void;
    onDropdownChange: (e: any, bloco?: 'prestador' | 'tomador' | 'servico') => void;
    onDropdownChangeRegime: (e: any) => void;
    onDropdownChangeEnderecoPrestador: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onDropdownChangeEnderecoTomador: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (event?: React.FormEvent) => Promise<void>;
    msgs: RefObject<Messages | null>;
    router: any;
    setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
    setLoadingCep: React.Dispatch<React.SetStateAction<boolean>>;
    setGerarNfse: React.Dispatch<React.SetStateAction<NfsEntity>>;
}
export type FormCreatedNotaServicoProps = NotaServicoFieldsProps | NotaServicoFormProps;
export type NotaFiscalQueryParams = NotaFiscalParams & {
    page?: number;
    size?: number;
};
export interface ListNotaServicoParams {
    page: number;
    size: number;
    termo?: string;
    status?: string;
    dateRange?: DateRangeValue;
    id_empresa?: number | null;
    id_cliente?: number | null;
    id_vendedor?: number | null;
}
export type NotaFiscalParams = {
    termo?: string | null;
    id_empresa?: number | null;
    id_cliente?: number | null;
    id_vendedor?: number | null;
    status?: string | null;
    data_hora_inicio?: string | null;
    data_hora_fim?: string | null;
    sort?: string;
};
