import { PerfilUser } from '@/app/entity/PerfilUsuarioEntity';

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
