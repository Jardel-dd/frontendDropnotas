import { VendedorEntity } from "@/app/entity/VendedorEntity";
import { VendedorDropdownFieldProps } from "../types/vendedor";
import { DropdownSearch } from "@/app/shared/include/dropdown/searchDropdownAll";
import { fetchAllVendedores, fetchFilteredVendedor } from "../controller/controller";

export default function VendedorDropdownField({
    selectedVendedor,
    selectedVendedorId,
    onVendedorChange,
    onAddClick,
    reloadKey = 0,
    hasError,
    errorMessage
}: VendedorDropdownFieldProps) {
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
            showAddButton
            autoSelectSingle
            showTopLabel
            required
            topLabel="Vendedor:"
        />
    );
}
