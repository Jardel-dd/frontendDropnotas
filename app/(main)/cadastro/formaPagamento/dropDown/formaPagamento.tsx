import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FormaPagamentoEntity } from "@/app/entity/FormaPagamento";
import { DropdownSearch } from "@/app/shared/include/dropdown/searchDropdownAll";
import { FORMA_PAGAMENTO_DROPDOWN_CACHE_TIME_MS, FormaPagamentoDropdownFieldProps } from "../types/formaPagamento";
import { fetchFilteredFormaPagamento, fetchFormaPagamentoByID, listTheFormaPagamento } from "../controller/controller";

export default function FormaPagamentoDropdownField({
    selectedFormaPagamento,
    selectedFormaPagamentoId,
    onFormaPagamentoChange,
    onEditClick,
    reloadKey = 0,
    hasError,
    errorMessage,
    showAddButton = false,
    onAddClick,
    autoSelectSingle = false,
    loadOnMount = false,
    useCachedAllItems = false,
    required = false
}: FormaPagamentoDropdownFieldProps & { required?: boolean }) {
    const queryClient = useQueryClient();
    const formaPagamentoDropdownQueryKey = ["dropdown", "forma-pagamento", "all", reloadKey] as const;

    useQuery({
        queryKey: formaPagamentoDropdownQueryKey,
        queryFn: listTheFormaPagamento,
        enabled: useCachedAllItems && loadOnMount,
        staleTime: FORMA_PAGAMENTO_DROPDOWN_CACHE_TIME_MS,
        gcTime: FORMA_PAGAMENTO_DROPDOWN_CACHE_TIME_MS
    });

    return (
        <DropdownSearch<FormaPagamentoEntity>
            id="selectedFormadePagamento"
            key={reloadKey}
            selectedItem={selectedFormaPagamento}
            onItemChange={onFormaPagamentoChange}
            fetchAllItems={() =>
                useCachedAllItems
                    ? queryClient.fetchQuery({
                        queryKey: formaPagamentoDropdownQueryKey,
                        queryFn: listTheFormaPagamento,
                        staleTime: FORMA_PAGAMENTO_DROPDOWN_CACHE_TIME_MS,
                        gcTime: FORMA_PAGAMENTO_DROPDOWN_CACHE_TIME_MS
                    })
                    : listTheFormaPagamento()
            }
            fetchFilteredItems={fetchFilteredFormaPagamento}
            fetchItemByValue={async (value) => {
                const response = await fetchFormaPagamentoByID(String(value));
                return response.formaPagamento ?? null;
            }}
            optionLabel="descricao"
            optionValue="id"
            initialOptionValue={selectedFormaPagamentoId ?? null}
            placeholder="Selecione a Forma de Pagamento"
            hasError={hasError}
            errorMessage={errorMessage}
            autoSelectSingle={autoSelectSingle}
            loadOnMount={loadOnMount}
            showAddButton={showAddButton}
            onAddClick={onAddClick}
            onEditClick={onEditClick}
            topLabel="Forma de pagamento:"
            showTopLabel
            required={required}
            autoLoadAndSelectSingle
            reloadAllOnShow={useCachedAllItems}
        />
    );
}
