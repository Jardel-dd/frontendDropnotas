import { CategoryContratosEntity } from "@/app/entity/CategoryContratEntity";
import { DropdownSearch } from "@/app/shared/include/dropdown/searchDropdownAll";
import { fetchCategoriaContratoByID, fetchFilteredCategoriaContrato, listTheCategoriaContrato } from "../controller/controller";
import { CategoriaContratoDropdownFieldProps } from "../types/categoriaContratos";

export default function CategoriaContratoDropdownField({
    selectedCategoriaContrato,
    selectedCategoriaContratoId,
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
            fetchItemByValue={async (value) => {
                const response = await fetchCategoriaContratoByID(String(value));
                return response.categoriaContrato ?? null;
            }}
            optionLabel="descricao"
            optionValue="id"
            initialOptionValue={selectedCategoriaContratoId ?? null}
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
