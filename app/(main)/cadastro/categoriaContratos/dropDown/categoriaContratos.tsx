import { CategoryContratosEntity } from "@/app/entity/CategoryContratEntity";
import { DropdownSearch } from "@/app/shared/include/dropdown/searchDropdownAll";
import { CategoriaContratoDropdownFieldProps } from "../types/categoriaContratos";
import { fetchCategoriaContratoByID, fetchFilteredCategoriaContrato, listTheCategoriaContrato } from "../controller/controller";

export default function CategoriaContratoDropdownField({
    selectedCategoriaContrato,
    selectedCategoriaContratoId,
    onCategoriaContratoChange,
    onEditClick,
    reloadKey = 0,
    hasError,
    errorMessage,
    showAddButton = false,
    onAddClick,
    autoSelectSingle = true,
    required = false
}: CategoriaContratoDropdownFieldProps & { required?: boolean }) {
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
            onEditClick={onEditClick}
            topLabel="Categoria de Contratos:"
            showTopLabel
            required={required}
        />
    );
}
