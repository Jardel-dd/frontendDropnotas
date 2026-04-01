import { PessoaEntity } from "@/app/entity/PessoaEntity";
import { PessoaDropdownFieldProps } from "../types/pessoa";
import { DropdownSearch } from "@/app/shared/include/dropdown/searchDropdownAll";
import { fetchFilteredPessoas, fetchPessoasById, listThePessoas } from "../controller/controller";

export default function PessoaDropdownField({
    selectedPessoa,
    selectedPessoaId,
    onPessoaChange,
    reloadKey = 0,
    id = "selectedPessoa",
    hasError,
    errorMessage,
    placeholder = "Selecione o Cliente ou Fornecedor",
    topLabel = "Cliente ou Fornecedor:",
    showTopLabel = true,
    required = true,
    autoSelectSingle = false,
    showAddButton = false,
    onAddClick
}: PessoaDropdownFieldProps) {
    return (
        <DropdownSearch<PessoaEntity>
            id={id}
            key={reloadKey}
            selectedItem={selectedPessoa}
            onItemChange={onPessoaChange}
            fetchAllItems={listThePessoas}
            fetchFilteredItems={fetchFilteredPessoas}
            fetchItemByValue={async (value) => {
                const response = await fetchPessoasById(String(value));
                return response.dataPessoa ?? null;
            }}
            optionLabel="razao_social"
            optionValue="id"
            initialOptionValue={selectedPessoaId ?? null}
            autoSelectSingle={autoSelectSingle}
            showAddButton={showAddButton}
            onAddClick={onAddClick}
            placeholder={placeholder}
            hasError={hasError}
            errorMessage={errorMessage}
            showTopLabel={showTopLabel}
            required={required}
            topLabel={topLabel}
        />
    );
}
