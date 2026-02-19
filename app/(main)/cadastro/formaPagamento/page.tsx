'use client';
import '@/app/styles/styledGlobal.css';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';
import { Messages } from 'primereact/messages';
import Input from '@/app/shared/include/input/input-all';
import Dropdown from '@/app/shared/include/dropdown/dropdown';
import { ListarFormaPagamento } from './listPaymentMethod/list';
import { usePageSize } from '@/app/components/pageSize/pageSize';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useTheme } from '@/app/components/isDarkMode/isDarkMode';
import { Checkbox, CheckboxChangeEvent } from 'primereact/checkbox';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';
import { tipo_forma_pagamento } from '@/app/shared/optionsDropDown/options';
import { useGenericSearch } from '@/app/services/debounceSearch/controller';
import { FormaPagamentoEntity, TipoFormaPagamento } from '@/app/entity/FormaPagamento';
import DialogFilter from '@/app/components/dialogs/dialogFilterComponents/dialogFilter';
import { useIsDesktop, useIsMobile } from '@/app/components/responsiveCelular/responsive';
import { ativarFormaPagamento, deletarFormaPagamento, listFormaPagamento } from './controller/controller';
import { FilterOverlay } from '@/app/components/buttonsComponent/btn-FilterComponent/Btn-Filter';
import { DropdownChangeEvent } from 'primereact/dropdown';

const CategoriaContrato: React.FC = () => {
    const router = useRouter();
    const isMobile = useIsMobile();
    const pageSize = usePageSize();
    const isDesktop = useIsDesktop();
    const { isDarkMode } = useTheme();
    const toast = useRef<Toast>(null);
    const msgs = useRef<Messages | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [visible, setVisible] = useState<boolean>(false);
    const [listarInativos, setListarInativos] = useState<boolean>(false);
    const [formaPagamento, setFormaPagamento] = useState<FormaPagamentoEntity>(
        new FormaPagamentoEntity({
            ativo: true,
            id: 0,
            descricao: '',
            observacao: '',
            tipo_forma_pagamento: '' as TipoFormaPagamento,
            tipo_taxa: '',
            valor_taxa: 0
        })
    );
    const [isFormaPagamentoCreated, setIsFormaPagamentoCreated] = useState(false);
    const [selectedFormaPagamento, setSelectedFormaPagamento] = useState<{ label: string; value: string } | null>(null);
    const [listPaginationFormaPagamento, setListPaginationFormaPagamento] = useState<Record<string, any>>({
        content: [],
        pageable: {
            pageNumber: 0,
            pageSize: pageSize,
            sort: {
                empty: true,
                unsorted: true,
                sorted: false
            }
        },
        totalPages: 0,
        totalElements: 0,
        last: false,
        size: 10,
        number: 0,
        sort: {
            empty: true,
            unsorted: true,
            sorted: false
        },
        numberOfElements: 0,
        first: true,
        empty: false
    });
    const handleNavigate = () => {
        router.push('/cadastro/formaPagamento/created');
        setIsFormaPagamentoCreated(true);
    };
    const handleListFormaPagamento = async (pageNumber?: number, _searchTerm?: string, listarInativos = false, tipo_forma_pagamento?: string) => {
        const tipoFinal = tipo_forma_pagamento ?? selectedFormaPagamento?.value ?? '';
        setLoading(true);
        try {
            const formaPagamento = await listFormaPagamento(
                {
                    ...listPaginationFormaPagamento,
                    pageable: {
                        ...listPaginationFormaPagamento.pageable,
                        pageNumber: pageNumber ?? listPaginationFormaPagamento.pageable.pageNumber,
                        pageSize: pageSize
                    }
                },
                listarInativos,
                setLoading,
                _searchTerm ?? searchTerm,
                tipoFinal
            );
            setListPaginationFormaPagamento(formaPagamento);
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Falha ao buscar Forma de Pagamento ',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };
    const { debouncedSearch, searchNow } = useGenericSearch({
        setter: setFormaPagamento,
        field: 'descricao',
        onSearch: (value) => handleListFormaPagamento(0, value, listarInativos)
    });
    const onPageChange = (event: PaginatorPageChangeEvent) => {
        const selectedPage = event.page;
        setListPaginationFormaPagamento((prev) => ({
            ...prev,
            pageable: {
                ...prev.pageable,
                pageNumber: selectedPage
            }
        }));
        handleListFormaPagamento(selectedPage, searchTerm, listarInativos);
    };
    const handleCheckboxChange = (e: CheckboxChangeEvent) => {
        const newValue = e.checked ?? false;
        setListarInativos(newValue);
        handleListFormaPagamento(0, searchTerm, newValue);
        setVisible(false);
    };
    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchTerm(value);
        debouncedSearch(value);
    };
    const handleCheckboxChangeMobile = (e: CheckboxChangeEvent) => {
        setListarInativos(e.checked ?? false);
    };
    const handleCancelarFiltro = () => {
        setVisible(false);
    };
    const handleClearFilters = () => {
        setListarInativos(false);
        setSelectedFormaPagamento(null);
        handleListFormaPagamento(0, '', false, '');
    };
    const handleTipoFormaPagamentoChange = (e: DropdownChangeEvent) => {
        const value = e.value ?? '';
        setSelectedFormaPagamento(value);
        handleListFormaPagamento(0, searchTerm, listarInativos, value);
    };
    const handleApplyFilters = () => {
        const firstPage = 0;
        handleListFormaPagamento(firstPage, searchTerm, listarInativos, selectedFormaPagamento?.value);
        setVisible(false);
    };
    useEffect(() => {
        handleListFormaPagamento();
    }, []);
    return (
        <div className="w-full">
            <Messages ref={msgs} className="custom-messages" />
            {isMobile && (
                <>
                    <div className="card styled-container-main-all-routes p-2">
                        <div className="scrollable-container">
                            <div className="grid formgrid p-0">
                                <div className="col-8 mb-0 lg:col-6 lg:mb-0 p-0">
                                    <Input
                                        label="Buscar"
                                        outlined={true}
                                        useRightButton={true}
                                        iconRight={'pi pi-search'}
                                        id="descricao"
                                        onChange={handleSearchChange}
                                        value={searchTerm}
                                        loading={loading}
                                        onClickSearch={() => searchNow(searchTerm)}
                                        topLabel="Descrição:"
                                        showTopLabel
                                    />
                                </div>
                                <div className="col-4 mb-0 lg:col-3 lg:mb-0 p-0 ">
                                    <div className="container-BTN-Filter-Created mt-2">
                                        <Button className="height-2-8rem-ml-1rem" icon="pi pi-filter" onClick={() => setVisible(true)} outlined />
                                        <Button icon="pi pi-plus" className="ml-1rem" onClick={handleNavigate} />
                                    </div>
                                </div>
                            </div>
                            <FilterOverlay onClear={handleClearFilters} onApply={handleApplyFilters} buttonClassName="Btn-Filter-Desktop">
                                <div className="col-12 lg:col-12 ">
                                    <Dropdown
                                        value={selectedFormaPagamento}
                                        options={tipo_forma_pagamento}
                                        onChange={handleTipoFormaPagamentoChange}
                                        placeholder="Selecione o tipo"
                                        optionLabel="label"
                                        optionValue="value"
                                        topLabel="Cliente ou Fornecedor:"
                                        showTopLabel
                                        label=""
                                    />
                                </div>
                                <div className="col-12 lg:col-12 mt-3">
                                    <Checkbox inputId="listarInativos" onChange={handleCheckboxChange} checked={listarInativos} />
                                    <label htmlFor="listarInativos" className="ml-2">
                                        Listar Desativadas
                                    </label>
                                </div>
                            </FilterOverlay>
                        </div>
                        <div>
                            <ListarFormaPagamento
                                loading={loading}
                                searchTerm={searchTerm}
                                setLoading={setLoading}
                                listarInativos={listarInativos}
                                setListPaginationFormaPagamento={setListPaginationFormaPagamento}
                                listPaginationFormaPagamento={listPaginationFormaPagamento}
                                deletar={(id) => deletarFormaPagamento(id, msgs, listPaginationFormaPagamento, listarInativos, setLoading, searchTerm)}
                                ativar={(id) => ativarFormaPagamento(id, msgs, listPaginationFormaPagamento, listarInativos, setLoading, searchTerm)}
                                tipo_forma_pagamento={selectedFormaPagamento?.value ?? ''}
                            />
                        </div>
                        <div style={{ marginTop: 'auto' }}>
                            <div className="custom-paginator">
                                <Paginator
                                    first={listPaginationFormaPagamento.pageable.pageNumber * listPaginationFormaPagamento.pageable.pageSize}
                                    rows={pageSize}
                                    totalRecords={listPaginationFormaPagamento.totalElements}
                                    onPageChange={onPageChange}
                                    template={{
                                        layout: 'PrevPageLink CurrentPageReport NextPageLink',
                                        CurrentPageReport: (options) => {
                                            const pageNumber = Math.floor(options.first / options.rows) + 1;
                                            return (
                                                <span>
                                                    Página {pageNumber} de {options.totalPages}
                                                </span>
                                            );
                                        }
                                    }}
                                    style={{ background: isDarkMode ? '#162A41' : '#EFF3F8' }}
                                />
                            </div>
                        </div>
                    </div>
                </>
            )}
            {isDesktop && (
                <>
                    <div className="card styled-container-main-all-routes p-2">
                        <div className="scrollable-container">
                            <div className="p-0">
                                <div className="grid formgrid">
                                    <div className="col-12 lg:col-3 container-input-search-all">
                                        <Input
                                            label="Buscar "
                                            outlined={true}
                                            id="descricao"
                                            useRightButton={true}
                                            iconRight={'pi pi-search'}
                                            onChange={handleSearchChange}
                                            value={searchTerm}
                                            loading={loading}
                                            onClickSearch={() => searchNow(searchTerm)}
                                            topLabel="Descrição:"
                                            showTopLabel
                                        />
                                    </div>
                                    <div className="Container-Btn-Filter-Desktop">
                                        <FilterOverlay onClear={handleClearFilters} onApply={handleApplyFilters} buttonClassName="Btn-Filter-Desktop">
                                            <div className="col-12 lg:col-12 ">
                                                <Dropdown
                                                    value={selectedFormaPagamento}
                                                    options={tipo_forma_pagamento}
                                                    onChange={handleTipoFormaPagamentoChange}
                                                    placeholder="Selecione o tipo"
                                                    optionLabel="label"
                                                    optionValue="value"
                                                    topLabel="Cliente ou Fornecedor:"
                                                    showTopLabel
                                                    label=""
                                                />
                                            </div>
                                            <div className="col-12 lg:col-12 mt-3">
                                                <Checkbox inputId="listarInativos" onChange={handleCheckboxChange} checked={listarInativos} />
                                                <label htmlFor="listarInativos" className="ml-2">
                                                    Listar Desativadas
                                                </label>
                                            </div>
                                        </FilterOverlay>
                                    </div>
                                    <div className="container-button-primary-novo">
                                        <Button icon="pi pi-plus" label="Novo" onClick={handleNavigate} className="p-button-primary-novo" />
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <ListarFormaPagamento
                                        loading={loading}
                                        searchTerm={searchTerm}
                                        setLoading={setLoading}
                                        listarInativos={listarInativos}
                                        setListPaginationFormaPagamento={setListPaginationFormaPagamento}
                                        listPaginationFormaPagamento={listPaginationFormaPagamento}
                                        deletar={(id) => deletarFormaPagamento(id, msgs, listPaginationFormaPagamento, listarInativos, setLoading, searchTerm)}
                                        ativar={(id) => ativarFormaPagamento(id, msgs, listPaginationFormaPagamento, listarInativos, setLoading, searchTerm)}
                                        tipo_forma_pagamento={selectedFormaPagamento?.value ?? ''}
                                    />
                                </div>
                            </div>
                        </div>
                        <div style={{ marginTop: 'auto' }}>
                            <Paginator first={listPaginationFormaPagamento.pageable.pageNumber * listPaginationFormaPagamento.pageable.pageSize} rows={pageSize} totalRecords={listPaginationFormaPagamento.totalElements} onPageChange={onPageChange} />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default CategoriaContrato;
