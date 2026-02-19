import { ReactNode } from 'react';
import { TableCNAEEntity } from '@/app/entity/TableCNAEEntity';
import { Mandatory } from '@/app/shared/mandatory/InputMandatory';
import { DropdownSearch } from '@/app/shared/include/dropdown/searchDropdownAll';

type Props = {
    selectedCNAE: TableCNAEEntity | null;
    onCNAEChange: (item: TableCNAEEntity | null) => void;
    fetchAllCnae: () => Promise<TableCNAEEntity[]>;
    fetchFilteredCnae: (searchTerm: string) => Promise<TableCNAEEntity[]>;
    errorMessage?: string;
    hasError?: boolean;
    showTopLabel?: boolean;
    topLabel?: string | ReactNode;
    required?: boolean;
    topRightElement?: ReactNode;
};

export default function CNAEDropdownField({ selectedCNAE, onCNAEChange, fetchAllCnae, fetchFilteredCnae, hasError = false, errorMessage, showTopLabel, topLabel, topRightElement, required }: Props) {
    return (
        <div className="p-field" style={{ height: '76px'  }}>
            {showTopLabel && (topLabel || topRightElement) && (
                <div className="flex align-items-center justify-content-between my-1" style={{ height: '17px' }}>
                    <label className="filter-label">
                        {topLabel}
                        {required && <Mandatory />}
                    </label>
                    {topRightElement}
                </div>
            )}
            <DropdownSearch<TableCNAEEntity>
                id="cnae_fiscal"
                selectedItem={selectedCNAE}
                onItemChange={onCNAEChange}
                fetchAllItems={fetchAllCnae}
                fetchFilteredItems={fetchFilteredCnae}
                optionValue="codigo"
                placeholder="Selecione o código CNAE"
                optionLabel={'descricao' as keyof TableCNAEEntity}
                hasError={hasError}
                errorMessage={errorMessage}
            />
        </div>
    );
}
