import { VendedorEntity } from "@/app/entity/VendedorEntity";
import { VendedorDropdownFieldProps } from "../types/vendedor";
import { DropdownSearch } from "@/app/shared/include/dropdown/searchDropdownAll";
import { fetchAllVendedores, fetchFilteredVendedor } from "../controller/controller";

export default function VendedorDropdownField({
    selectedVendedor,
    selectedVendedorId,
    onVendedorChange,
    onAddClick,
    onEditClick,
    reloadKey = 0,
    hasError,
    errorMessage,
    required = false
}: VendedorDropdownFieldProps & { required?: boolean }) {

    return (
        <DropdownSearch<VendedorEntity>
            id="selectedVendedor"
            key={reloadKey}
            selectedItem={selectedVendedor}
            onItemChange={onVendedorChange}
            fetchAllItems={fetchAllVendedores}
            fetchFilteredItems={fetchFilteredVendedor}
            optionLabel="razao_social"
            optionValue="id"
            initialOptionValue={selectedVendedorId ?? null}
            placeholder="Selecione o Vendedor"
            hasError={hasError}
            errorMessage={errorMessage}
            onAddClick={onAddClick}
            onEditClick={onEditClick}
            showAddButton
            autoSelectSingle
            showTopLabel
            required={required}
            topLabel="Vendedor:"
            autoLoadAndSelectSingle
        />
    );
}
