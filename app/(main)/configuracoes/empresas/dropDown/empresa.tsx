import { CompanyEntity } from "@/app/entity/CompanyEntity";
import { EmpresaDropdownFieldProps } from "../types/empresa";
import { DropdownSearch } from "@/app/shared/include/dropdown/searchDropdownAll";
import {
    fetchCompanyDropdownByID,
    fetchFilteredCompany,
    listTheCompany
} from "../controller/controller";

export default function EmpresaDropdownField({
    selectedEmpresa,
    selectedEmpresaId,
    onEmpresaChange,
    reloadKey = 0,
    id = "selectedEmpresa",
    hasError,
    errorMessage,
    placeholder = "Selecione a Empresa",
    topLabel = "Empresa:",
    showTopLabel = true,
    required = false,
    autoSelectSingle = false,
    showAddButton = false,
    onAddClick
}: EmpresaDropdownFieldProps & { required?: boolean }) {

    return (
        <DropdownSearch<CompanyEntity>
            id={id}
            key={reloadKey}
            selectedItem={selectedEmpresa}
            onItemChange={onEmpresaChange}
            fetchAllItems={listTheCompany}
            fetchFilteredItems={fetchFilteredCompany}
            fetchItemByValue={async (value) => {
                const response = await fetchCompanyDropdownByID(String(value));
                return response ?? null;
            }}
            optionLabel="razao_social"
            optionValue="id"
            initialOptionValue={selectedEmpresaId ?? null}
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