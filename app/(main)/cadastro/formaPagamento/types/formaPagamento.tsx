import { FormaPagamentoEntity } from "@/app/entity/FormaPagamento";

export interface FormaPagamentoDropdownFieldProps {
    selectedFormaPagamento: FormaPagamentoEntity | null;
    onFormaPagamentoChange: (formaPagamento: FormaPagamentoEntity | null) => void;
    reloadKey?: number;
    hasError?: boolean;
    errorMessage?: string;
    showAddButton?: boolean;
    onAddClick?: () => void;
    autoSelectSingle?: boolean;
}
