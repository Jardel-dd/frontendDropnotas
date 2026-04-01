import { FormaPagamentoEntity } from "@/app/entity/FormaPagamento";
import { FormaPagamentoDropdownFieldProps } from "../types/formaPagamento";
import { DropdownSearch } from "@/app/shared/include/dropdown/searchDropdownAll";
import { fetchFilteredFormaPagamento, fetchFormaPagamentoByID, listTheFormaPagamento } from "../controller/controller";
export default function FormaPagamentoDropdownField({
    selectedFormaPagamento,
    selectedFormaPagamentoId,
    onFormaPagamentoChange,
    reloadKey = 0,
    hasError,
    errorMessage,
    showAddButton = false,
    onAddClick,
    autoSelectSingle = false
}: FormaPagamentoDropdownFieldProps) {
    return (
        <DropdownSearch<FormaPagamentoEntity>
            id="selectedFormadePagamento"
            key={reloadKey}
            selectedItem={selectedFormaPagamento}
            onItemChange={onFormaPagamentoChange}
            fetchAllItems={listTheFormaPagamento}
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
            showAddButton={showAddButton}
            onAddClick={onAddClick}
            topLabel="Forma de pagamento:"
            showTopLabel
            required
        />
    );
}
