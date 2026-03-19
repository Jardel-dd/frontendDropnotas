import { CompanyEntity } from "@/app/entity/CompanyEntity";
import { EmpresaDropdownFieldProps } from "../types/empresa";
import { DropdownSearch } from "@/app/shared/include/dropdown/searchDropdownAll";
import { fetchFilteredCompany, listTheCompany } from "../controller/controller";

export default function EmpresaDropdownField({
    selectedCompany,
    onCompanyChange,
    reloadKey = 0,
    hasError,
    errorMessage,
    showAddButton = false,
    onAddClick,
    autoSelectSingle = true
}: EmpresaDropdownFieldProps) {
    return (
        <DropdownSearch<CompanyEntity>
            id="selectedCompany"
            key={reloadKey}
            selectedItem={selectedCompany}
            onItemChange={onCompanyChange}
            fetchAllItems={listTheCompany}
            fetchFilteredItems={fetchFilteredCompany}
            optionLabel="razao_social"
            optionValue="id"
            placeholder="Selecione a Empresa"
            hasError={hasError}
            errorMessage={errorMessage}
            autoSelectSingle={autoSelectSingle}
            showAddButton={showAddButton}
            onAddClick={onAddClick}
            topLabel="Empresa:"
            showTopLabel
            required
        />
    );
}
