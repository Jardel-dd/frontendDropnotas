import Input from '../include/input/input-all';
import '@/app/styles/styledGlobal.css';
import { Button } from 'primereact/button';
import DialogFilter from '@/app/components/dialogs/dialogFilterComponents/dialogFilter';


type MobileSearchWithFilterProps = {
    value: string;
    loading?: boolean;
    topLabel?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSearch: () => void;
    filterVisible: boolean;
      showSearch?: boolean;
    onOpenFilter: () => void;
    onCloseFilter: () => void;
    onSaveFilter: () => void;
    onCancelFilter: () => void;
    onAddClick?: () => void;

    filterContent: React.ReactNode;
};

export function BTNFilterMobile({
    value,
    loading,
    topLabel = 'Buscar:',
    onChange,
    onSearch,
    showSearch = true,
    filterVisible,
    onOpenFilter,
    onCloseFilter,
    onSaveFilter,
    onCancelFilter,
    onAddClick,
    filterContent
}: MobileSearchWithFilterProps) {
    return (
        <div className="flex-column-full">
            <div className="flex flex-row align-items-start">
                  {showSearch && (
                <Input
                    label="Buscar"
                    outlined
                    id="descricao"
                    useRightButton
                    iconRight="pi pi-search"
                    onChange={onChange}
                    value={value}
                    loading={loading}
                    onClickSearch={onSearch}
                    topLabel={topLabel}
                    showTopLabel
                />
                  )}
                <div className="flex-center-row">
                    <Button
                        className="height-2-8rem-ml-1rem"
                        icon="pi pi-filter"
                        outlined
                        onClick={onOpenFilter}
                    />

                    {onAddClick && (
                        <Button
                            icon="pi pi-plus"
                            className="height-2-8rem-ml-1rem"
                            onClick={onAddClick}
                        />
                    )}
                </div>
            </div>
            <DialogFilter
                visible={filterVisible}
                header="Filtro"
                onHide={onCloseFilter}
                onSave={onSaveFilter}
                onCancel={onCancelFilter}
            >
                {filterContent}
            </DialogFilter>
        </div>
    );
}
