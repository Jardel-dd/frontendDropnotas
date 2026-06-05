import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ServiceEntity } from "@/app/entity/ServiceEntity";
import { ServicoDropdownFieldProps } from "../types/servico";
import { DropdownSearch } from "@/app/shared/include/dropdown/searchDropdownAll";
import { fetchFilteredService, fetchServicesByID, listTheService } from "../controller/controller";

const SERVICE_DROPDOWN_CACHE_TIME_MS = 5 * 60 * 1000;

export default function ServicoDropdownField({
    selectedService,
    selectedServiceId,
    onServiceChange,
    onEditClick,
    reloadKey = 0,
    id = "selectedService",
    hasError,
    errorMessage,
    placeholder = "Selecione o Serviço",
    topLabel = "Serviço:",
    showTopLabel = true,
    required = false,
    showAddButton = false,
    onAddClick,
    autoSelectSingle = false,
    loadOnMount = false,
    useCachedAllItems = false,
    fetchAllItems = listTheService,
    fetchFilteredItems = fetchFilteredService
}: ServicoDropdownFieldProps) {
    const queryClient = useQueryClient();
    const serviceDropdownQueryKey = ["dropdown", "servico", "all", reloadKey] as const;

    useQuery({
        queryKey: serviceDropdownQueryKey,
        queryFn: fetchAllItems,
        enabled: useCachedAllItems && loadOnMount,
        staleTime: SERVICE_DROPDOWN_CACHE_TIME_MS,
        gcTime: SERVICE_DROPDOWN_CACHE_TIME_MS
    });

    return (
        <DropdownSearch<ServiceEntity>
            id={id}
            key={reloadKey}
            selectedItem={selectedService}
            onItemChange={onServiceChange}
            fetchAllItems={() =>
                useCachedAllItems
                    ? queryClient.fetchQuery({
                        queryKey: serviceDropdownQueryKey,
                        queryFn: fetchAllItems,
                        staleTime: SERVICE_DROPDOWN_CACHE_TIME_MS,
                        gcTime: SERVICE_DROPDOWN_CACHE_TIME_MS
                    })
                    : fetchAllItems()
            }
            fetchFilteredItems={fetchFilteredItems}
            fetchItemByValue={async (value) => {
                const response = await fetchServicesByID(String(value));
                return response.servico ?? null;
            }}
            optionLabel="descricao"
            optionValue="id"
            initialOptionValue={selectedServiceId ?? null}
            placeholder={placeholder}
            hasError={hasError}
            errorMessage={errorMessage}
            autoSelectSingle={autoSelectSingle}
            loadOnMount={loadOnMount}
            showAddButton={showAddButton}
            onAddClick={onAddClick}
            onEditClick={onEditClick}
            topLabel={topLabel}
            showTopLabel={showTopLabel}
            required={required}
            autoLoadAndSelectSingle
            reloadAllOnShow={useCachedAllItems}
        />
    );
}
