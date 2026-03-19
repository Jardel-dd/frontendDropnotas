import { CategoryContratosEntity } from "@/app/entity/CategoryContratEntity";
import { DropdownSearch } from "@/app/shared/include/dropdown/searchDropdownAll";
import { fetchFilteredCategoriaContrato, listTheCategoriaContrato } from "../controller/controller";
import { CategoriaContratoDropdownFieldProps } from "../types/categoriaContratos";

export default function CategoriaContratoDropdownField({
    selectedCategoriaContrato,
    onCategoriaContratoChange,
    reloadKey = 0,
    hasError,
    errorMessage,
    showAddButton = false,
    onAddClick,
    autoSelectSingle = true
}: CategoriaContratoDropdownFieldProps) {
    return (
        <DropdownSearch<CategoryContratosEntity>
            id="selectedCategoriaContrato"
            key={reloadKey}
            selectedItem={selectedCategoriaContrato}
            onItemChange={onCategoriaContratoChange}
            fetchAllItems={listTheCategoriaContrato}
            fetchFilteredItems={fetchFilteredCategoriaContrato}
            optionLabel="descricao"
            optionValue="id"
            placeholder="Selecione a Categoria de Contratos"
            hasError={hasError}
            errorMessage={errorMessage}
            autoSelectSingle={autoSelectSingle}
            showAddButton={showAddButton}
            onAddClick={onAddClick}
            topLabel="Categoria de Contratos:"
            showTopLabel
            required
        />
    );
}
