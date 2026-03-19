import { PessoaEntity } from "@/app/entity/PessoaEntity";
import { PessoaDropdownFieldProps } from "../types/pessoa";
import { DropdownSearch } from "@/app/shared/include/dropdown/searchDropdownAll";
import { fetchFilteredPessoas, listThePessoas } from "../controller/controller";

export default function PessoaDropdownField({
    selectedPessoa,
    onPessoaChange,
    reloadKey = 0,
    hasError,
    errorMessage,
    autoSelectSingle = false,
    showAddButton = false,
    onAddClick
}: PessoaDropdownFieldProps) {
    return (
        <DropdownSearch<PessoaEntity>
            id="selectedPessoa"
            key={reloadKey}
            selectedItem={selectedPessoa}
            onItemChange={onPessoaChange}
            fetchAllItems={listThePessoas}
            fetchFilteredItems={fetchFilteredPessoas}
            optionLabel="razao_social"
            optionValue="id"
            autoSelectSingle={autoSelectSingle}
            showAddButton={showAddButton}
            onAddClick={onAddClick}
            placeholder="Selecione o Cliente ou Fornecedor"
            hasError={hasError}
            errorMessage={errorMessage}
            showTopLabel
            required
            topLabel="Cliente ou Fornecedor:"
        />
    );
}