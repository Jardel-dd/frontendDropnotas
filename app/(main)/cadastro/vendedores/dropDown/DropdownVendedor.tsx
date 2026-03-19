import { VendedorEntity } from "@/app/entity/VendedorEntity";
import { DropdownSearch } from "@/app/shared/include/dropdown/searchDropdownAll";
import { fetchAllVendedores, fetchFilteredVendedor } from "../controller/controller";

interface VendedorDropdownFieldProps {
    selectedVendedor: VendedorEntity | null;
    onVendedorChange: (vendedor: VendedorEntity | null) => void;
    onAddClick: () => void;
    reloadKey?: number;
    hasError?: boolean;
    errorMessage?: string;
}

export default function VendedorDropdownField({
    selectedVendedor,
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
