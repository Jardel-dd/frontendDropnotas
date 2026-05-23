import { ContratoEntity } from "@/app/entity/ContratoEntity";
import { ContratoDropdownFieldProps } from "../types/contrato";
import { DropdownSearch } from "@/app/shared/include/dropdown/searchDropdownAll";
import { fetchContratoByID, fetchFilteredContrato, listTheContrato } from "@/app/(main)/contrato/controller/controller";

export default function ContratoDropdownField({
    selectedContrato,
    selectedContratoId,
    onContratoChange,
    reloadKey = 0,
    hasError,
    errorMessage,
    showAddButton = false,
    onAddClick,
    autoSelectSingle = false,
    required = false,
    className
}: ContratoDropdownFieldProps & { required?: boolean }) {
    return (
        <DropdownSearch<ContratoEntity>
            id="selectedContrato"
            key={reloadKey}
            selectedItem={selectedContrato}
            onItemChange={onContratoChange}
            fetchAllItems={listTheContrato}
            fetchFilteredItems={fetchFilteredContrato}
            fetchItemByValue={async (value) => {
                const response = await fetchContratoByID(String(value));
                return response.contrato ?? null;
            }}
            optionLabel="descricao"
            optionValue="id"
            initialOptionValue={selectedContratoId ?? null}
            placeholder="Selecione o Contrato"
            hasError={hasError}
            errorMessage={errorMessage}
            autoSelectSingle={autoSelectSingle}
            showAddButton={showAddButton}
            onAddClick={onAddClick}
            className={`${className} ${hasError ? 'p-invalid' : ''}`}
            topLabel="Contrato:"
            showTopLabel
            required={required}
        />
    );
}