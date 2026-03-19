import { CompanyEntity } from "@/app/entity/CompanyEntity";

export interface EmpresaDropdownFieldProps {
    selectedCompany: CompanyEntity | null;
    onCompanyChange: (empresa: CompanyEntity | null) => void;
    reloadKey?: number;
    hasError?: boolean;
    errorMessage?: string;
    showAddButton?: boolean;
    onAddClick?: () => void;
    autoSelectSingle?: boolean;
}