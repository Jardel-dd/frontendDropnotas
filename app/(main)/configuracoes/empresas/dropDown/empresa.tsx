import { CompanyEntity } from "@/app/entity/CompanyEntity";
import { EmpresaDropdownFieldProps } from "../types/empresa";
import { DropdownSearch } from "@/app/shared/include/dropdown/searchDropdownAll";
import { fetchCompanyDropdownByID, fetchFilteredCompany, listTheCompany } from "../controller/controller";

export default function EmpresaDropdownField({
    selectedCompany,
    selectedCompanyId,
    onCompanyChange,
    reloadKey = 0,
    hasError,
    errorMessage,
    showAddButton = false,
    onAddClick,
    autoSelectSingle = true,
    required = false
}: EmpresaDropdownFieldProps & { required?: boolean }) {

    return (
        <DropdownSearch<CompanyEntity>
            id="selectedCompany"
            key={reloadKey}
            selectedItem={selectedCompany}
            onItemChange={onCompanyChange}
            fetchAllItems={listTheCompany}
            fetchFilteredItems={fetchFilteredCompany}
            fetchItemByValue={async (value) => await fetchCompanyDropdownByID(String(value))}
            optionLabel="razao_social"
            optionValue="id"
            initialOptionValue={selectedCompanyId ?? null}
            placeholder="Selecione a Empresa"
            hasError={hasError}
            errorMessage={errorMessage}
            autoSelectSingle={autoSelectSingle}
            showAddButton={showAddButton}
            onAddClick={onAddClick}
            topLabel="Empresa:"
            showTopLabel
            required={required}
        />
    );
}