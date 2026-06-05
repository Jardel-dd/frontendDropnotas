import { PerfilUser } from '@/app/entity/PerfilUsuarioEntity';
import { DropdownSearch } from '@/app/shared/include/dropdown/searchDropdownAll';
import { fetchAllPerfilUsuarios, fetchFilteredPerfilUsuarios } from '../controller/controller';
import { PerfilUserDropdownFieldProps } from '../types/perfilUsuario';

export default function PerfilUserDropdownField({
    selectedPerfilUser,
    onPerfilUserChange,
    reloadKey = 0,
    hasError,
    errorMessage,
    showAddButton = false,
    onAddClick,
    autoSelectSingle = true
}: PerfilUserDropdownFieldProps) {
    return (
        <DropdownSearch<PerfilUser>
            id="selectedPerfilUser"
            key={reloadKey}
            selectedItem={selectedPerfilUser}
            onItemChange={onPerfilUserChange}
            fetchAllItems={fetchAllPerfilUsuarios}
            fetchFilteredItems={fetchFilteredPerfilUsuarios}
            optionLabel="nome"
            placeholder="Selecione a permissão"
            hasError={hasError}
            errorMessage={errorMessage}
            autoSelectSingle={autoSelectSingle}
            showAddButton={showAddButton}
            onAddClick={onAddClick}
            topLabel="Permissões deste Usuário:"
            showTopLabel
            required
            autoLoadAndSelectSingle
        />
    );
}
