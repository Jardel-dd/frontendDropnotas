import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CategoryContratosEntity } from "@/app/entity/CategoryContratEntity";
import { DropdownSearch } from "@/app/shared/include/dropdown/searchDropdownAll";
import { CategoriaContratoDropdownFieldProps } from "../types/categoriaContratos";
import { fetchCategoriaContratoByID, fetchFilteredCategoriaContrato, listTheCategoriaContrato } from "../controller/controller";

const CATEGORIA_CONTRATO_DROPDOWN_CACHE_TIME_MS = 5 * 60 * 1000;

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
    loadOnMount = false,
    useCachedAllItems = false,
    required = false
}: CategoriaContratoDropdownFieldProps & { required?: boolean }) {
    const queryClient = useQueryClient();
    const categoriaContratoDropdownQueryKey = ["dropdown", "categoria-contrato", "all", reloadKey] as const;

    useQuery({
        queryKey: categoriaContratoDropdownQueryKey,
        queryFn: listTheCategoriaContrato,
        enabled: useCachedAllItems && loadOnMount,
        staleTime: CATEGORIA_CONTRATO_DROPDOWN_CACHE_TIME_MS,
        gcTime: CATEGORIA_CONTRATO_DROPDOWN_CACHE_TIME_MS
    });

    return (
        <DropdownSearch<CategoryContratosEntity>
            id="selectedCategoriaContrato"
            key={reloadKey}
            selectedItem={selectedCategoriaContrato}
            onItemChange={onCategoriaContratoChange}
            fetchAllItems={() =>
                useCachedAllItems
                    ? queryClient.fetchQuery({
                        queryKey: categoriaContratoDropdownQueryKey,
                        queryFn: listTheCategoriaContrato,
                        staleTime: CATEGORIA_CONTRATO_DROPDOWN_CACHE_TIME_MS,
                        gcTime: CATEGORIA_CONTRATO_DROPDOWN_CACHE_TIME_MS
                    })
                    : listTheCategoriaContrato()
            }
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
            loadOnMount={loadOnMount}
            showAddButton={showAddButton}
            onAddClick={onAddClick}
            onEditClick={onEditClick}
            topLabel="Categoria de Contratos:"
            showTopLabel
            required={required}
            autoLoadAndSelectSingle
            reloadAllOnShow={useCachedAllItems}
        />
    );
}
