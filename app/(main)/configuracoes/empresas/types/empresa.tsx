import { CompanyEntity } from "@/app/entity/CompanyEntity";
import { TableCNAEEntity } from "@/app/entity/TableCNAEEntity";
import { UsuarioContaEntity } from "@/app/entity/UsuarioContaEntity";
import { DropdownChangeEvent } from "primereact/dropdown";
import { FileUpload, FileUploadSelectEvent } from "primereact/fileupload";
import { InputNumberValueChangeEvent } from "primereact/inputnumber";
import { Messages } from "primereact/messages";
import { MultiSelectChangeEvent } from "primereact/multiselect";
import { Toast } from "primereact/toast";
import { ChangeEvent, RefObject } from "react";


export interface EmpresaDropdownFieldProps {
    selectedEmpresa: CompanyEntity | null;
    selectedEmpresaId?: number | null;
    onEmpresaChange: (pessoa: CompanyEntity | null) => void;
    onEditClick?: (empresa: CompanyEntity) => void;
    reloadKey?: number;
    id?: string;
    hasError?: boolean;
    errorMessage?: string;
    placeholder?: string;
    topLabel?: string;
    showTopLabel?: boolean;
    required?: boolean;
    onAddClick?: () => void;
    autoSelectSingle?: boolean;
    showAddButton?: boolean;
}

export interface EmpresaFormProps {
    empresa: any;
    initialId?: string | null;
    preloadedEmpresa?: PreloadedEmpresaData | null;
    onSuccess?: () => void;
    msgs: RefObject<Messages | null>;
    onEmpresaChange?: (empresa: CompanyEntity) => void;
    onErrorsChange?: (errors: Record<string, string>) => void;
    setEmpresa?: React.Dispatch<React.SetStateAction<any>>;
    redirectAfterSave?: boolean;
    onSaved?: (created: CompanyEntity) => void | Promise<void>;
    onClose?: () => void;
    onLoadingChange?: (loading: boolean) => void;
    showBTNPGCreatedDialog?: boolean;
    showBTNPGCreatedAll?: boolean;
    onBackClick?: () => void;
}

export interface PreloadedEmpresaData {
    empresa: CompanyEntity;
    userConta: UsuarioContaEntity[];
    selectedUserConta: UsuarioContaEntity[];
    selectedCNAE: TableCNAEEntity | null;
}

export interface EmpresaFormRef {
    handleSave: () => Promise<void>;
}

export interface EmpresaFieldsProps {
    empresa: CompanyEntity;
    empresaId?: string | null;
    errors: Record<string, string>;
    loadingCnpj: boolean;
    loadingCep: boolean;
    loadingFileUpload: boolean;
    isMobile: boolean;
    isDesktop: boolean;
    isDarkMode: boolean;
    isPasswordVisible: boolean;
    isCertificatePasswordRequired: boolean;
    selectedCNAE: TableCNAEEntity | null;
    userConta: UsuarioContaEntity[];
    selectedUserConta: UsuarioContaEntity[];
    toastRef: RefObject<Toast | null>;
    fileUploadRef: RefObject<FileUpload | null>;
    fileInputRef: RefObject<HTMLInputElement | null>;
    onChange: (event: any) => void;
    onDropdownChange: (event: DropdownChangeEvent) => void;
    onDropdownChangeEndereco: (event: DropdownChangeEvent) => void;
    onNumberChange: (event: InputNumberValueChangeEvent) => void;
    onUserChange: (event: MultiSelectChangeEvent) => void;
    onOpenUserContaModal: () => void;
    onCNAEChange: (cnae: TableCNAEEntity | null) => void;
    onSearchCnpj: () => Promise<void>;
    onValidateCnpj: () => void;
    onLogoChange: (event: ChangeEvent<HTMLInputElement>) => void;
    onDeleteLogo: () => void;
    onRemoveFile: () => void;
    onFileChangeCertificado: (event: FileUploadSelectEvent) => void;
    onClearCertificado: () => void;
    onTogglePasswordVisibility: () => void;
    onCepSearch: () => void;
}

export type FormEmpresaCreatedProps = EmpresaFieldsProps | EmpresaFormProps;
