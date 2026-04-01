import { CompanyEntity } from "@/app/entity/CompanyEntity";
import { Messages } from "primereact/messages";
import { RefObject } from "react";

export interface EmpresaDropdownFieldProps {
    selectedCompany: CompanyEntity | null;
    selectedCompanyId?: number | null;
    onCompanyChange: (empresa: CompanyEntity | null) => void;
    reloadKey?: number;
    hasError?: boolean;
    errorMessage?: string;
    showAddButton?: boolean;
    onAddClick?: () => void;
    autoSelectSingle?: boolean;
}

export interface EmpresaFormProps {
    empresa: any;
    initialId?: string | null;
    onSuccess?: () => void;
    msgs: RefObject<Messages | null>;
    onEmpresaChange?: (empresa: CompanyEntity) => void;
    onErrorsChange?: (errors: Record<string, string>) => void;
    setEmpresa?: React.Dispatch<React.SetStateAction<any>>;
    redirectAfterSave?: boolean;
    onSaved?: (created: CompanyEntity) => void;
    onClose?: () => void;
    showBTNPGCreatedDialog?: boolean;
    showBTNPGCreatedAll?: boolean;
    onBackClick?: () => void;
}

export interface EmpresaFormRef {
    handleSave: () => Promise<void>;
}
