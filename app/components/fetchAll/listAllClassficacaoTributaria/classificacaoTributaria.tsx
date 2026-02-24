import { ReactNode } from 'react';
import { TableCNAEEntity } from '@/app/entity/TableCNAEEntity';
import { Mandatory } from '@/app/shared/mandatory/InputMandatory';
import { DropdownSearch } from '@/app/shared/include/dropdown/searchDropdownAll';
import { TableClassificacaoTributariaEntity } from '@/app/entity/TableClassificacaoTributariaEntity';

type Props = {
    selectedClassificacaoTributaria: TableClassificacaoTributariaEntity | null;
    onClassificacaoTributariaChange: (item: TableClassificacaoTributariaEntity | null) => void;
    fetchAllClassificacaoTributaria: () => Promise<TableClassificacaoTributariaEntity[]>;
    fetchFilteredClassificacaoTributaria: (searchTerm: string) => Promise<TableClassificacaoTributariaEntity[]>;
    errorMessage?: string;
    hasError?: boolean;
    showTopLabel?: boolean;
    topLabel?: string | ReactNode;
    required?: boolean;
    topRightElement?: ReactNode;
};

export default function ClassificacaoTributariaEDropdownField({ selectedClassificacaoTributaria, onClassificacaoTributariaChange, fetchAllClassificacaoTributaria,
     fetchFilteredClassificacaoTributaria, hasError = false, errorMessage, showTopLabel, topLabel, topRightElement, required }: Props) {
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
            <DropdownSearch<TableClassificacaoTributariaEntity>
                id="codigo_classificacao_tributaria"
                selectedItem={selectedClassificacaoTributaria}
                onItemChange={onClassificacaoTributariaChange}
                fetchAllItems={fetchAllClassificacaoTributaria}
                fetchFilteredItems={fetchFilteredClassificacaoTributaria}
                optionValue="codigo"
                placeholder="Selecione uma opção"
                optionLabel={'descricao' as keyof TableCNAEEntity}
                hasError={hasError}
                errorMessage={errorMessage}
            />
        </div>
    );
}
