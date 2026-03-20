import { PerfilUser } from '@/app/entity/PerfilUsuarioEntity';
import { Messages } from 'primereact/messages';
import { TreeCheckboxSelectionKeys } from 'primereact/tree';
import { RefObject } from 'react';

export interface PermissoesFormRef {
    handleSave: () => Promise<void>;
}

export interface PermissoesFormProps {
    perfilUser: PerfilUser;
    initialId?: string | null;
    onSuccess?: () => void;
    msgs: RefObject<Messages | null>;
    onPerfilUserChange?: (perfilUser: PerfilUser) => void;
    onErrorsChange?: (errors: Record<string, string>) => void;
    setPerfilUser?: React.Dispatch<React.SetStateAction<PerfilUser>>;
    redirectAfterSave?: boolean;
    onSaved?: (created: PerfilUser) => void;
    onClose?: () => void;
    showBTNPGCreatedDialog?: boolean;
    showBTNPGCreatedAll?: boolean;
    onBackClick?: () => void;
}

export interface PermissoesFieldsProps {
    perfilUser: PerfilUser;
    errors: Record<string, string>;
    selectedKeys: TreeCheckboxSelectionKeys;
    isLoading: boolean;
    onChange: (event: { target: { id: string; value: any; checked?: any; type: string } }) => void;
    onDropdownChange: (event: any) => void;
    onSelectionChange: (selectedKeys: TreeCheckboxSelectionKeys) => void;
    onValidateNome: () => void;
}

export type FormCreatedPermissoesProps = PermissoesFieldsProps | PermissoesFormProps;

export interface PerfilUserDropdownFieldProps {
    selectedPerfilUser: PerfilUser | null;
    onPerfilUserChange: (perfilUser: PerfilUser | null) => void;
    reloadKey?: number;
    hasError?: boolean;
    errorMessage?: string;
    showAddButton?: boolean;
    onAddClick?: () => void;
    autoSelectSingle?: boolean;
}
