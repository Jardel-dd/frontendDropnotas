import { ServiceEntity } from "@/app/entity/ServiceEntity";
import { ServicoDropdownFieldProps } from "../types/servico";
import { DropdownSearch } from "@/app/shared/include/dropdown/searchDropdownAll";
import { fetchFilteredService, listTheService } from "../controller/controller";

export default function ServicoDropdownField({
    selectedService,
    onServiceChange,
    reloadKey = 0,
    id = "selectedService",
    hasError,
    errorMessage,
    placeholder = "Selecione o Serviço",
    topLabel = "Serviço:",
    showTopLabel = true,
    required = true,
    showAddButton = false,
    onAddClick,
    autoSelectSingle = false,
    fetchAllItems = listTheService,
    fetchFilteredItems = fetchFilteredService
}: ServicoDropdownFieldProps) {
    return (
        <DropdownSearch<ServiceEntity>
            id={id}
            key={reloadKey}
            selectedItem={selectedService}
            onItemChange={onServiceChange}
            fetchAllItems={fetchAllItems}
            fetchFilteredItems={fetchFilteredItems}
            optionLabel="descricao"
            optionValue="id"
            placeholder={placeholder}
            hasError={hasError}
            errorMessage={errorMessage}
            autoSelectSingle={autoSelectSingle}
            showAddButton={showAddButton}
            onAddClick={onAddClick}
            topLabel={topLabel}
            showTopLabel={showTopLabel}
            required={required}
        />
    );
}

