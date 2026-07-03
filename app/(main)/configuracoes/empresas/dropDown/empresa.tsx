import { CompanyEntity } from "@/app/entity/CompanyEntity";
import { EmpresaDropdownFieldProps } from "../types/empresa";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DropdownSearch } from "@/app/shared/include/dropdown/searchDropdownAll";
import {fetchCompanyDropdownByID, fetchFilteredEmpresa, listTheEmpresa} from "../controller/controller";

const COMPANY_DROPDOWN_CACHE_TIME_MS = 5 * 60 * 1000;

export default function EmpresaDropdownField({
    selectedEmpresa,
    selectedEmpresaId,
    onEmpresaChange,
    onEditClick,
    reloadKey = 0,
    id = "selectedEmpresa",
    hasError,
    errorMessage,
    placeholder = "Selecione a Empresa",
    topLabel = "Empresa:",
    showTopLabel = true,
    required = false,
    autoSelectSingle = true,
    loadOnMount = false,
    showAddButton = false,
    autoLoadAndSelectSingle = true,
    onAddClick
}: EmpresaDropdownFieldProps & { required?: boolean; }) {
    const queryClient = useQueryClient();
    const companyDropdownQueryKey = ["dropdown", "empresa", "all", reloadKey] as const;

    useQuery({
        queryKey: companyDropdownQueryKey,
        queryFn: listTheEmpresa,
        enabled: loadOnMount,
        staleTime: COMPANY_DROPDOWN_CACHE_TIME_MS,
        gcTime: COMPANY_DROPDOWN_CACHE_TIME_MS
    });

    return (
        <DropdownSearch<CompanyEntity>
            id={id}
            key={reloadKey}
            selectedItem={selectedEmpresa}
            onItemChange={onEmpresaChange}
            fetchAllItems={() =>
                queryClient.fetchQuery({
                    queryKey: companyDropdownQueryKey,
                    queryFn: listTheEmpresa,
                    staleTime: COMPANY_DROPDOWN_CACHE_TIME_MS,
                    gcTime: COMPANY_DROPDOWN_CACHE_TIME_MS
                })
            }
            fetchFilteredItems={fetchFilteredEmpresa}
            fetchItemByValue={async (value) => {
                const response = await fetchCompanyDropdownByID(String(value));
                return response ?? null;
            }}
            optionLabel="razao_social"
            optionValue="id"
            initialOptionValue={selectedEmpresaId ?? null}
            autoSelectSingle={autoSelectSingle}
            loadOnMount={loadOnMount}
            showAddButton={showAddButton}
            onAddClick={onAddClick}
            onEditClick={onEditClick}
            placeholder={placeholder}
            hasError={hasError}
            errorMessage={errorMessage}
            showTopLabel={showTopLabel}
            required={required}
            topLabel={topLabel}
            autoLoadAndSelectSingle={autoLoadAndSelectSingle}
            reloadAllOnShow
        />
    );
}
