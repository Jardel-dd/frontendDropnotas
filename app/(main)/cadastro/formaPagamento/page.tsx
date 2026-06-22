'use client';
import '@/app/styles/styledGlobal.css';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';
import { usePermissions } from '@/app/routes/permissoes';
import Input from '@/app/shared/include/input/input-all';
import { CheckboxChangeEvent } from 'primereact/checkbox';
import { DropdownChangeEvent } from 'primereact/dropdown';
import Dropdown from '@/app/shared/include/dropdown/dropdown';
import { PaginatorPageChangeEvent } from 'primereact/paginator';
import { usePageSize } from '@/app/components/pageSize/pageSize';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import ListarFormaPagamento from './tabela/formaPagamentoListagem';
import { Messages } from '@/app/components/messages/GlobalMessages';
import CheckBoxField from '@/app/components/CheckBoxField/checkBoxField';
import CustomPaginator from '@/app/components/paginator/customPaginator';
import { tipo_forma_pagamento } from '@/app/shared/optionsDropDown/options';
import { useGenericSearch } from '@/app/services/debounceSearch/controller';
import { FormaPagamentoEntity, TipoFormaPagamento } from '@/app/entity/FormaPagamento';
import { useIsDesktop, useIsMobile } from '@/app/components/responsiveCelular/responsive';
import { FilterOverlay } from '@/app/components/buttonsComponent/btn-FilterComponent/Btn-Filter';
import { ativarFormaPagamento, deletarFormaPagamento, listFormaPagamento } from './controller/controller';
const CategoriaContrato: React.FC = () => {
    const router = useRouter();
    const isMobile = useIsMobile();
    const pageSize = usePageSize();
    const isDesktop = useIsDesktop();
    const toast = useRef<Toast>(null);
    const msgs = useRef<Messages | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const {permissaoFormaPagamento} = usePermissions();
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
    const [selectedFormaPagamento, setSelectedFormaPagamento] = useState<string | null>(null);
    const [draftSelectedFormaPagamento, setDraftSelectedFormaPagamento] = useState<string | null>(null);
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
        const tipoFinal = tipo_forma_pagamento ?? selectedFormaPagamento ?? '';
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
                summary: 'Atenção:',
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
        setListarInativos(e.checked ?? false);
    };
    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchTerm(value);
        debouncedSearch(value);
    };
    const syncDraftFilters = () => {
        setListarInativos(listarInativos);
        setDraftSelectedFormaPagamento(selectedFormaPagamento);
    };
    const handleClearFilters = () => {
        setListarInativos(false);
        setListarInativos(false);
        setSelectedFormaPagamento(null);
        setDraftSelectedFormaPagamento(null);
        handleListFormaPagamento(0, '', false, '');
    };
    const handleTipoFormaPagamentoChange = (e: DropdownChangeEvent) => {
        setDraftSelectedFormaPagamento(e.value ?? null);
    };
    const handleApplyFilters = () => {
        const firstPage = 0;
        setListarInativos(listarInativos);
        setSelectedFormaPagamento(draftSelectedFormaPagamento);
        handleListFormaPagamento(firstPage, searchTerm, listarInativos, draftSelectedFormaPagamento ?? '');
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
                        <div className="grid formgrid p-2" >
                            <div className="col-8 mb-0 lg:col-6 lg:mb-0 p-0">
                                <Input
                                    label="Pesquisar Descrição"
                                    outlined={true}
                                    useRightButton={true}
                                    iconRight={'pi pi-search'}
                                    id="descricao"
                                    onChange={handleSearchChange}
                                    value={searchTerm}
                                    loading={loading}
                                    onClickSearch={() => searchNow(searchTerm)}
                                    topLabel="Pesquisar:"
                                    showTopLabel
                                />
                            </div>
                            <div className="col-4 mb-0 lg:col-3 lg:mb-0">
                                <div className="container-BTN-Filter-Created">
                                    <FilterOverlay
                                        onOpen={syncDraftFilters}
                                        onClear={handleClearFilters}
                                        onApply={handleApplyFilters}
                                        buttonClassName="height-2-8rem-ml-1rem-mobile"
                                    >
                                        <div>
                                            <Dropdown
                                                value={draftSelectedFormaPagamento}
                                                options={tipo_forma_pagamento}
                                                onChange={handleTipoFormaPagamentoChange}
                                                placeholder="Selecione a Forma de Pagamento:"
                                                optionLabel="label"
                                                optionValue="value"
                                                topLabel="Forma de Pagamento:"
                                                showTopLabel
                                                label=""
                                            />
                                        </div>
                                        <CheckBoxField
                                            inputId="listarInativos"
                                            label="Listar Desativadas"
                                            checked={listarInativos}
                                            onChange={handleCheckboxChange}
                                        />
                                    </FilterOverlay>
                                     {permissaoFormaPagamento.create && (
                                    <Button icon="pi pi-plus" className="ml-1rem" onClick={handleNavigate} />
                                     )}
                                     </div>
                            </div>
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
                                tipo_forma_pagamento={selectedFormaPagamento ?? ''}
                            />
                        </div>
                        <div style={{ marginTop: 'auto' }}>
                            <div className="custom-paginator">
                                <CustomPaginator
                                    first={listPaginationFormaPagamento.pageable.pageNumber * listPaginationFormaPagamento.pageable.pageSize}
                                    rows={pageSize}
                                    totalRecords={listPaginationFormaPagamento.totalElements}
                                    onPageChange={onPageChange}
                                    isMobile
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
                                            label="Pesquisar Descrição "
                                            outlined={true}
                                            id="descricao"
                                            useRightButton={true}
                                            iconRight={'pi pi-search'}
                                            onChange={handleSearchChange}
                                            value={searchTerm}
                                            loading={loading}
                                            onClickSearch={() => searchNow(searchTerm)}
                                            topLabel="Pesquisar:"
                                            showTopLabel
                                        />
                                    </div>
                                    <div className="Container-Btn-Filter-Desktop">
                                        <FilterOverlay onOpen={syncDraftFilters} onClear={handleClearFilters} onApply={handleApplyFilters} buttonClassName="Btn-Filter-Desktop">
                                            <div>
                                                <Dropdown
                                                    value={draftSelectedFormaPagamento}
                                                    options={tipo_forma_pagamento}
                                                    onChange={handleTipoFormaPagamentoChange}
                                                    placeholder="Selecione a Forma de pagamento"
                                                    optionLabel="label"
                                                    optionValue="value"
                                                    topLabel="Forma de Pagamento:"
                                                    showTopLabel
                                                    label=""
                                                />
                                            </div>
                                            <CheckBoxField
                                                inputId="listarInativos"
                                                label="Listar Desativadas"
                                                checked={listarInativos}
                                                onChange={handleCheckboxChange}
                                            />
                                        </FilterOverlay>
                                    </div>
                                    {permissaoFormaPagamento.create && (
                                    <div className="container-button-primary-novo">
                                        <Button icon="pi pi-plus" label="Novo" onClick={handleNavigate} className="p-button-primary-novo" />
                                    </div>
                                     )}
                                </div>
                                <div >
                                    <ListarFormaPagamento
                                        loading={loading}
                                        searchTerm={searchTerm}
                                        setLoading={setLoading}
                                        listarInativos={listarInativos}
                                        setListPaginationFormaPagamento={setListPaginationFormaPagamento}
                                        listPaginationFormaPagamento={listPaginationFormaPagamento}
                                        deletar={(id) => deletarFormaPagamento(id, msgs, listPaginationFormaPagamento, listarInativos, setLoading, searchTerm)}
                                        ativar={(id) => ativarFormaPagamento(id, msgs, listPaginationFormaPagamento, listarInativos, setLoading, searchTerm)}
                                        tipo_forma_pagamento={selectedFormaPagamento ?? ''}
                                    />
                                </div>
                            </div>
                        </div>
                        <div style={{ marginTop: 'auto' }}>
                            <CustomPaginator
                                first={listPaginationFormaPagamento.pageable.pageNumber * listPaginationFormaPagamento.pageable.pageSize}
                                rows={pageSize}
                                totalRecords={listPaginationFormaPagamento.totalElements}
                                onPageChange={onPageChange}
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
export default CategoriaContrato;

